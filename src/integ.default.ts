import * as cdk from 'aws-cdk-lib';
import { ScheduledNatGateway } from './index';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

const publicSubnetId = 'subnet-11111111';
const privateSubnetId = 'subnet-22222222';

new ScheduledNatGateway(stack, 'Scheduled-Nat-Gateway-Lib', {
  publicSubnetId: publicSubnetId,
  privateSubnetId: privateSubnetId,
  createSchedule: '0 8 * * ? *',
  deleteSchedule: '0 18 * * ? *',
});