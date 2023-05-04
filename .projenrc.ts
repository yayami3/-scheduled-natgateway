import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yayami3',
  authorAddress: '116920988+yayami3@users.noreply.github.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: 'scheduled-natgateway',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/116920988+yayami3/scheduled-natgateway.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();