const {
  EC2,
  waitUntilNatGatewayAvailable,
  waitUntilNatGatewayDeleted,
} = require("@aws-sdk/client-ec2");
const ec2 = new EC2();

exports.handler = async (event) => {
  const publicSubnetId = process.env.PUBLIC_SUBNET_ID;
  const privateSubnetId = process.env.PRIVATE_SUBNET_ID;
  const isCreate = event["operation"] === "create" ? true : false;

  try {
    // Create/delete the NAT Gateway in the public subnet
    const operation = isCreate ? createNatGateway : deleteNatGateway;
    const natGatewayId = await operation(publicSubnetId);

    // Update the private subnet's route table to point to the NAT Gateway
    await updateRouteTable(natGatewayId, privateSubnetId, isCreate);

    return {
      statusCode: 200,
      body: JSON.stringify(
        `Successfully ${
          isCreate ? "created" : "deleted"
        } NAT Gateway ${natGatewayId}`
      ),
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to ${isCreate ? "create" : "delete"} NAT Gateway: ${
        error.message
      }`
    );
  }
};

async function createNatGateway(publicSubnetId) {
  const allocateAddress = await ec2.allocateAddress({
    Domain: "vpc",
    TagSpecifications: [
      {
        ResourceType: "elastic-ip",
        Tags: [
          {
            Key: "Name",
            Value: "scheduled-nat-eip",
          },
        ],
      },
    ],
  });
  const allocationId = allocateAddress.AllocationId;
  const natGateway = await ec2.createNatGateway({
    AllocationId: allocationId,
    SubnetId: publicSubnetId,
    TagSpecifications: [
      {
        ResourceType: "natgateway",
        Tags: [
          {
            Key: "Name",
            Value: "scedueled-nat-gateway",
          },
        ],
      },
    ],
  });

  // Wait for the Nat Gateway to become available
  const natGatewayId = natGateway.NatGateway.NatGatewayId;
  await waitUntilNatGatewayAvailable(
    {
      client: ec2,
      maxWaitTime: 600,
    },
    { NatGatewayIds: [natGatewayId] }
  );

  return natGatewayId;
}

async function deleteNatGateway(publicSubnetId) {
  // Find the ID of the NAT Gateway in the subnet
  const { NatGateways } = await ec2.describeNatGateways({
    Filter: [
      { Name: "subnet-id", Values: [publicSubnetId] },
      { Name: "state", Values: ["available"] },
    ],
  });

  if (NatGateways.length === 0) {
    throw new Error(`No NAT Gateway found in subnet ${publicSubnetId}`);
  }
  const natGatewayId = NatGateways[0].NatGatewayId;

  const elasticIP = await ec2.describeAddresses({
    Filters: [
      {
        Name: "tag:Name",
        Values: ["scheduled-nat-eip"],
      },
    ],
  });

  const allocationId = elasticIP["Addresses"][0].AllocationId;

  // Delete the NAT Gateway
  await ec2.deleteNatGateway({ NatGatewayId: natGatewayId });

  await waitUntilNatGatewayDeleted(
    {
      client: ec2,
      maxWaitTime: 600,
    },
    { NatGatewayIds: [natGatewayId] }
  );

  await ec2.releaseAddress({ AllocationId: allocationId });

  return natGatewayId;
}

async function updateRouteTable(natGatewayId, privateSubnetId, isCreate) {
  const { RouteTables } = await ec2.describeRouteTables({
    Filters: [{ Name: "association.subnet-id", Values: [privateSubnetId] }],
  });

  for (const routeTable of RouteTables) {
    const existingRoute = routeTable.Routes.find(
      (route) => route.DestinationCidrBlock === "0.0.0.0/0"
    );
    if (isCreate) {
      if (existingRoute) {
        if (existingRoute.NatGatewayId === natGatewayId) {
          console.log(
            `Route for 0.0.0.0/0 in route table ${routeTable.RouteTableId} already points to NAT Gateway ${natGatewayId}`
          );
          continue;
        }

        console.log(
          `Replacing route for 0.0.0.0/0 in route table ${routeTable.RouteTableId} from NAT Gateway ${existingRoute.NatGatewayId} to NAT Gateway ${natGatewayId}`
        );

        await ec2.replaceRoute({
          DestinationCidrBlock: existingRoute.DestinationCidrBlock,
          NatGatewayId: natGatewayId,
          RouteTableId: routeTable.RouteTableId,
        });
      } else {
        console.log(
          `Creating new route for 0.0.0.0/0 in route table ${routeTable.RouteTableId} to NAT Gateway ${natGatewayId}`
        );

        await ec2.createRoute({
          DestinationCidrBlock: "0.0.0.0/0",
          NatGatewayId: natGatewayId,
          RouteTableId: routeTable.RouteTableId,
        });
      }
    } else {
      if (existingRoute) {
        if (existingRoute.NatGatewayId === natGatewayId) {
          console.log(
            `Delete Route for 0.0.0.0/0 in route table ${routeTable.RouteTableId} points to NAT Gateway ${natGatewayId}`
          );
          await ec2.deleteRoute({
            RouteTableId: routeTable.RouteTableId,
            DestinationCidrBlock: "0.0.0.0/0",
          });
          continue;
        }
      }
    }
  }
}
