import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ScheduledNatGateway } from '../src/index';

test('ScheduledNatGateway creates a CloudWatch Event Rule and Lambda Function with the necessary resources', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const publicSubnetId = 'subnet-11111111';
  const privateSubnetId = 'subnet-22222222';

  new ScheduledNatGateway(stack, 'TestScheduledNatGateway', {
    publicSubnetId: publicSubnetId,
    privateSubnetId: privateSubnetId,
    createSchedule: '0 8 * * ? *',
    deleteSchedule: '0 18 * * ? *',
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs16.x',
  });
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'cron(0 8 * * ? *)',
  });
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'cron(0 18 * * ? *)',
  });
});
