import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal, AccountPrincipal } from 'aws-cdk-lib/aws-iam';
import { aws_iam as IAM } from 'aws-cdk-lib';
import { DynamoDB } from '../constructs/dynamodb';
import { AttributeType, BillingMode, Table, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AuthorizationType, FieldLogLevel, GraphqlApi } from '@aws-cdk/aws-appsync-alpha';
import {
    DEFAULT_STACK_REGION,
    APP_NAME,
    PACKAGE_NAME,
    SERVICE_NAME,
    StageConfig,
    DEVELOPER_ACCOUNT_ID_PLACEHOLDER
} from "../commons/constants"
import { lambda_appsync_handlers, requestTemplate } from '../commons/constants';
// import { AppSync } from '../constructs/appsync';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { App, Stack, StackProps } from 'aws-cdk-lib';

export interface ServiceStackProps extends StackProps, StageConfig {
}

export class ServiceStack extends Stack {
  private PaymentAttributeTable: Table;

  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);
    const environmentVariables: { [key: string]: string } = {};
    environmentVariables['Stage'] = props.stage;
    environmentVariables['Region'] = props.region;

    this.PaymentAttributeTable = new DynamoDB(this, 'PaymentAttributeTable', {
      tableName: 'PaymentAttributeTable',
      partitionKeyName: 'customerName',
      sortKeyName: 'destinationName',
      partitionKeyType: AttributeType.STRING,
      sortKeyType: AttributeType.STRING,
      billingMode: BillingMode.PAY_PER_REQUEST,
      streamViewType: StreamViewType.NEW_AND_OLD_IMAGES
      }).table;

    const appSyncRole = new IAM.Role(this, 'PaymentAppSyncIAMRole', {
      roleName: `Payment-AppSync-Role-${props.stage}-${props.region}`,
      assumedBy: new IAM.ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [IAM.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess')],
    });

    const appSyncAPI = new GraphqlApi(this, 'PostPaymentActivityApi', {
      name: `Post-Payment-Activity-Api-${props.stage}-${props.region}`,
      schema: appsync.Schema.fromAsset('lib/schema/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
        excludeVerboseContent: false,
        role: appSyncRole,
      },
    });

    const lambdaRoles = this.createLambdaRole(
      props,
      `arn:aws:dynamodb:ap-south-1:${DEVELOPER_ACCOUNT_ID_PLACEHOLDER}:table/PaymentAttributeTable`,
    );

    lambda_appsync_handlers.forEach((handler) => {
      // Create Lambda
      const handler_lambda = new Function(this, handler['function_name'], {
        functionName: handler['function_name'],
        runtime: Runtime.JAVA_11,
        handler: 'Codivas.activity.' + handler['handler'] + '::handleRequest',
        code: Code.fromAsset('D:/Codivas/target/Codivas-1.0-SNAPSHOT.jar'),
        memorySize: 1024,
        logRetention: RetentionDays.SIX_MONTHS,
        environment: {
          sample_env: 'Lambda env',
        },
        timeout: Duration.seconds(30),
        role: lambdaRoles,
      });

      // Create AppSync Lambda Resolvers
      const handler_datasource = appSyncAPI.addLambdaDataSource(handler['function_name'], handler_lambda);

      handler['resolvers'].forEach((resolver) => {
        appSyncAPI.createResolver({
          typeName: resolver['type_name'],
          fieldName: resolver['name'],
          dataSource: handler_datasource,
          requestMappingTemplate: appsync.MappingTemplate.fromString(
            '{' +
              requestTemplate +
              '"' +
              resolver['name'] +
              '",\n' +
              '\t\t"typeName": "' +
              resolver['type_name'] +
              '"' +
              '\n\t}\n}',
          ),
          responseMappingTemplate: appsync.MappingTemplate.fromFile(resolver['response_filepath']),
        });
      });
    });
  }

  private createLambdaRole(props: ServiceStackProps, dynamodbarn: string) {
    const CodivasLambdaRole = new Role(this, `CodivasLambdaRole`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      roleName: `CodivasLambdaRole-${props.stage}-${props.region}`,
    });

    CodivasLambdaRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    );

    CodivasLambdaRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ["arn:aws:dynamodb:ap-south-1:785567567155:table/PaymentAttributeTable"],
        actions: ['dynamodb:PutItem', 'dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem', 'dynamodb:Query'],
      }),
    );

    CodivasLambdaRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
        resources: [`*`],
      }),
    );
    return CodivasLambdaRole;
  }
}
