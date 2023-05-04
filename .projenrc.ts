import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  majorVersion: 1,
  author: 'yayami3',
  authorAddress: '116920988+yayami3@users.noreply.github.com',
  cdkVersion: '2.77.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: 'scheduled-natgateway',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yayami3/scheduled-nat-gateway.git',

  // deps: [], /* Runtime dependencies of this module. */
  description:
    'Scheduled NatGateway at the time you need it' /* The description is just a string that helps people understand the purpose of the package. */,
  keywords: ['cdk', 'awscdk', 'aws-cdk', 'nat'],
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  stability: 'experimental',
});
project.synth();
