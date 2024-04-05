"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceStack = void 0;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const dynamodb_1 = require("../constructs/dynamodb");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_cdk_lib_2 = require("aws-cdk-lib");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
const constants_1 = require("../commons/constants");
const constants_2 = require("../commons/constants");
// import { AppSync } from '../constructs/appsync';
const appsync = __importStar(require("@aws-cdk/aws-appsync-alpha"));
const aws_cdk_lib_3 = require("aws-cdk-lib");
class ServiceStack extends aws_cdk_lib_3.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const environmentVariables = {};
        environmentVariables['Stage'] = props.stage;
        environmentVariables['Region'] = props.region;
        this.PaymentAttributeTable = new dynamodb_1.DynamoDB(this, 'PaymentAttributeTable', {
            tableName: 'PaymentAttributeTable',
            partitionKeyName: 'customerName',
            sortKeyName: 'destinationName',
            partitionKeyType: aws_dynamodb_1.AttributeType.STRING,
            sortKeyType: aws_dynamodb_1.AttributeType.STRING,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            streamViewType: aws_dynamodb_1.StreamViewType.NEW_AND_OLD_IMAGES
        }).table;
        const appSyncRole = new aws_cdk_lib_1.aws_iam.Role(this, 'PaymentAppSyncIAMRole', {
            roleName: `Payment-AppSync-Role-${props.stage}-${props.region}`,
            assumedBy: new aws_cdk_lib_1.aws_iam.ServicePrincipal('appsync.amazonaws.com'),
            managedPolicies: [aws_cdk_lib_1.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess')],
        });
        const appSyncAPI = new aws_appsync_alpha_1.GraphqlApi(this, 'PostPaymentActivityApi', {
            name: `Post-Payment-Activity-Api-${props.stage}-${props.region}`,
            schema: appsync.Schema.fromAsset('lib/schema/schema.graphql'),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: aws_appsync_alpha_1.AuthorizationType.API_KEY,
                },
            },
            xrayEnabled: true,
            logConfig: {
                fieldLogLevel: aws_appsync_alpha_1.FieldLogLevel.ALL,
                excludeVerboseContent: false,
                role: appSyncRole,
            },
        });
        const lambdaRoles = this.createLambdaRole(props, `arn:aws:dynamodb:ap-south-1:${constants_1.DEVELOPER_ACCOUNT_ID_PLACEHOLDER}:table/PaymentAttributeTable`);
        constants_2.lambda_appsync_handlers.forEach((handler) => {
            // Create Lambda
            const handler_lambda = new aws_lambda_1.Function(this, handler['function_name'], {
                functionName: handler['function_name'],
                runtime: aws_lambda_1.Runtime.JAVA_11,
                handler: 'Codivas.activity.' + handler['handler'] + '::handleRequest',
                code: aws_lambda_1.Code.fromAsset('D:/Codivas/target/Codivas-1.0-SNAPSHOT.jar'),
                memorySize: 1024,
                logRetention: aws_logs_1.RetentionDays.SIX_MONTHS,
                environment: {
                    sample_env: 'Lambda env',
                },
                timeout: aws_cdk_lib_2.Duration.seconds(30),
                role: lambdaRoles,
            });
            // Create AppSync Lambda Resolvers
            const handler_datasource = appSyncAPI.addLambdaDataSource(handler['function_name'], handler_lambda);
            handler['resolvers'].forEach((resolver) => {
                appSyncAPI.createResolver({
                    typeName: resolver['type_name'],
                    fieldName: resolver['name'],
                    dataSource: handler_datasource,
                    requestMappingTemplate: appsync.MappingTemplate.fromString('{' +
                        constants_2.requestTemplate +
                        '"' +
                        resolver['name'] +
                        '",\n' +
                        '\t\t"typeName": "' +
                        resolver['type_name'] +
                        '"' +
                        '\n\t}\n}'),
                    responseMappingTemplate: appsync.MappingTemplate.fromFile(resolver['response_filepath']),
                });
            });
        });
    }
    createLambdaRole(props, dynamodbarn) {
        const CodivasLambdaRole = new aws_iam_1.Role(this, `CodivasLambdaRole`, {
            assumedBy: new aws_iam_1.ServicePrincipal('lambda.amazonaws.com'),
            roleName: `CodivasLambdaRole-${props.stage}-${props.region}`,
        });
        CodivasLambdaRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
        CodivasLambdaRole.addToPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            resources: ["arn:aws:dynamodb:ap-south-1:785567567155:table/PaymentAttributeTable"],
            actions: ['dynamodb:PutItem', 'dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem', 'dynamodb:Query'],
        }));
        CodivasLambdaRole.addToPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
            resources: [`*`],
        }));
        return CodivasLambdaRole;
    }
}
exports.ServiceStack = ServiceStack;
