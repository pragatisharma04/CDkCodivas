// import * as cdk from '@aws-cdk/core';
// import { aws_iam as IAM } from 'aws-cdk-lib';
// import * as appsync from '@aws-cdk/aws-appsync-alpha';
// import { Construct } from 'constructs';
// import { AuthorizationType, FieldLogLevel, GraphqlApi } from '@aws-cdk/aws-appsync-alpha';
//
// export interface AppSyncProps {
//   readonly stackName?: string;
// }
//
// export class AppSync extends cdk.Stack {
//   constructor(scope: cdk.Construct, id: string, readonly props: AppSyncProps) {
//     super(scope, id, props);
//     this.createAppSyncApp();
//   }
//
//   private createAppSyncApp() {
//     return new appsync.GraphqlApi(this, 'api', {
//       name: 'CartService-API',
//       schema: appsync.Schema.fromAsset('./lib/schema/schema.graphql'),
//       authorizationConfig: {
//         defaultAuthorization: {
//           authorizationType: AuthorizationType.API_KEY,
//         },
//       },
//       xrayEnabled: true,
//       logConfig: {
//         fieldLogLevel: FieldLogLevel.ALL,
//         excludeVerboseContent: false,
//         role: this.createAppSyncRole(),
//       },
//     });
//   }
//
//   protected createAppSyncRole() {
//     const roleName = 'AppSyncRole';
//     return new IAM.Role(this, roleName, {
//       assumedBy: new IAM.ServicePrincipal('appsync.amazonaws.com'),
//       managedPolicies: [IAM.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs')],
//       inlinePolicies: {
//         AppSyncPolicies: new IAM.PolicyDocument({
//           statements: this.createAppSyncPolicies(),
//         }),
//       },
//       roleName: roleName,
//     });
//   }
//
//   protected createAppSyncPolicies(): IAM.PolicyStatement[] {
//     const policies = new Array<IAM.PolicyStatement>();
//
//     const stsPolicyStatement = new IAM.PolicyStatement({
//       effect: IAM.Effect.ALLOW,
//       resources: ['*'],
//       actions: ['sts:AssumeRole'],
//     });
//     policies.push(stsPolicyStatement);
//
//     return policies;
//   }
// }
