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
  privateSubnetId: 'subnet-67890'
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

// Output the ID of the NAT Gateway
new cdk.CfnOutput(stack, 'NatGatewayId', {
  value: scheduledNatGateway.natGatewayId,
});
```

This example creates a VPC with a public and a private subnet, and then creates a NAT Gateway in the public subnet at noon every day and deletes it at midnight every day. It also adds a route to the NAT Gateway in the private subnet's route table, so that traffic from the private subnet can be routed through the NAT Gateway. The ID of the NAT Gateway is output as a stack output.
# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### ScheduledNatGateway <a name="ScheduledNatGateway" id="scheduled-natgateway.ScheduledNatGateway"></a>

#### Initializers <a name="Initializers" id="scheduled-natgateway.ScheduledNatGateway.Initializer"></a>

```typescript
import { ScheduledNatGateway } from 'scheduled-natgateway'

new ScheduledNatGateway(scope: Construct, id: string, props: ScheduledNatGatewayProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#scheduled-natgateway.ScheduledNatGateway.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#scheduled-natgateway.ScheduledNatGateway.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#scheduled-natgateway.ScheduledNatGateway.Initializer.parameter.props">props</a></code> | <code><a href="#scheduled-natgateway.ScheduledNatGatewayProps">ScheduledNatGatewayProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="scheduled-natgateway.ScheduledNatGateway.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="scheduled-natgateway.ScheduledNatGateway.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="scheduled-natgateway.ScheduledNatGateway.Initializer.parameter.props"></a>

- *Type:* <a href="#scheduled-natgateway.ScheduledNatGatewayProps">ScheduledNatGatewayProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#scheduled-natgateway.ScheduledNatGateway.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="scheduled-natgateway.ScheduledNatGateway.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#scheduled-natgateway.ScheduledNatGateway.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="scheduled-natgateway.ScheduledNatGateway.isConstruct"></a>

```typescript
import { ScheduledNatGateway } from 'scheduled-natgateway'

ScheduledNatGateway.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="scheduled-natgateway.ScheduledNatGateway.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#scheduled-natgateway.ScheduledNatGateway.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="scheduled-natgateway.ScheduledNatGateway.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### ScheduledNatGatewayProps <a name="ScheduledNatGatewayProps" id="scheduled-natgateway.ScheduledNatGatewayProps"></a>

#### Initializer <a name="Initializer" id="scheduled-natgateway.ScheduledNatGatewayProps.Initializer"></a>

```typescript
import { ScheduledNatGatewayProps } from 'scheduled-natgateway'

const scheduledNatGatewayProps: ScheduledNatGatewayProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#scheduled-natgateway.ScheduledNatGatewayProps.property.createSchedule">createSchedule</a></code> | <code>string</code> | *No description.* |
| <code><a href="#scheduled-natgateway.ScheduledNatGatewayProps.property.deleteSchedule">deleteSchedule</a></code> | <code>string</code> | *No description.* |
| <code><a href="#scheduled-natgateway.ScheduledNatGatewayProps.property.privateSubnetId">privateSubnetId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#scheduled-natgateway.ScheduledNatGatewayProps.property.publicSubnetId">publicSubnetId</a></code> | <code>string</code> | *No description.* |

---

##### `createSchedule`<sup>Required</sup> <a name="createSchedule" id="scheduled-natgateway.ScheduledNatGatewayProps.property.createSchedule"></a>

```typescript
public readonly createSchedule: string;
```

- *Type:* string

---

##### `deleteSchedule`<sup>Required</sup> <a name="deleteSchedule" id="scheduled-natgateway.ScheduledNatGatewayProps.property.deleteSchedule"></a>

```typescript
public readonly deleteSchedule: string;
```

- *Type:* string

---

##### `privateSubnetId`<sup>Required</sup> <a name="privateSubnetId" id="scheduled-natgateway.ScheduledNatGatewayProps.property.privateSubnetId"></a>

```typescript
public readonly privateSubnetId: string;
```

- *Type:* string

---

##### `publicSubnetId`<sup>Required</sup> <a name="publicSubnetId" id="scheduled-natgateway.ScheduledNatGatewayProps.property.publicSubnetId"></a>

```typescript
public readonly publicSubnetId: string;
```

- *Type:* string

---



