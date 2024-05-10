# New Craft CMS Project

You have now setup a new Craft Project. Congrats 🥳.
This Setup brings you additional Functionality.

- Working Gulp Workflow.
- Typescript support with ts-config and ready for deploy
- Dart SASS to get advantage of the new feature-set with scss.
- Load component based css just when a component is used (defined in twig).`{{ loadCssComponent('component-a') }}`

## Documentation

For more information (Repository, Environments and Hosting) about the project setup of a Craft CMS project, the
following documentation is available:
https://yooapps.jira.com/wiki/spaces/INTRA/pages/4244471823/Craft+CMS+Project-Setup

## Adjustments

Dont forget to adjust the following:

azure-pipelines.yml: **ArtifactName: 'yourprojectname'**
package.json: **check for updates**
