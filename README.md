# ScheduledNatGateway Construct

ScheduledNatGateway is a CDK TypeScript construct that creates a Lambda function to generate and delete a NAT Gateway in a specified public subnet at a scheduled time using cron expressions. It also creates a route in the associated private subnet's route table that directs traffic to the NAT Gateway.

## Usage

To use the ScheduledNatGateway construct, first import it into your CDK stack:

```typescript
import { ScheduledNatGateway } from 'scheduled-nat-gateway';
```

Then, instantiate the construct with the desired parameters:

```typescript
const scheduledNatGateway = new ScheduledNatGateway(scope, 'NatGateway', {
  publicSubnetId: 'subnet-12345',
  privateSubnetId: 'subnet-67890',
  createSchedule: '0 12 * * *',
  deleteSchedule: '0 0 * * *',
});
```

The `publicSubnetId` parameter specifies the ID of the public subnet where the NAT Gateway will be created. The `privateSubnetId` parameter specifies the ID of the private subnet where the NAT Gateway route will be added.
The `createSchedule` and `deleteSchedule` parameters take a cron expression that specifies the time when the NAT Gateway should be created and deleted, respectively. 

## Example

Here's an example of how to use the ScheduledNatGateway construct:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ScheduledNatGateway } from 'scheduled-nat-gateway';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

// Create a VPC with two subnets (public and private)
const vpc = new ec2.Vpc(stack, 'MyVpc', {
  cidr: '10.0.0.0/16',
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 24,
      name: 'private',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
});

// Create a NAT Gateway in the public subnet on a schedule
const scheduledNatGateway = new ScheduledNatGateway(stack, 'NatGateway', {
  publicSubnetId: vpc.publicSubnets[0].subnetId,
  privateSubnetId: vpc.privateSubnets[0].subnetId,
  createSchedule: '0 12 * * ? *',
  deleteSchedule: '0 0 * * ? *',
});

```

This example creates a VPC with a public and a private subnet, and then creates a NAT Gateway in the public subnet at noon every day and deletes it at midnight every day. It also adds a route to the NAT Gateway in the private subnet's route table, so that traffic from the private subnet can be routed through the NAT Gateway. The ID of the NAT Gateway is output as a stack output.