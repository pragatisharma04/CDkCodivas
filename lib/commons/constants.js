"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStages = exports.beta = exports.devStage = exports.DEVELOPER_ACCOUNT_ID_PLACEHOLDER = exports.requestTemplate = exports.lambda_appsync_handlers = exports.SERVICE_NAME = exports.PACKAGE_NAME = exports.APP_NAME = exports.DEFAULT_STACK_REGION = void 0;
exports.DEFAULT_STACK_REGION = 'ap-south-1';
exports.APP_NAME = 'Codivas';
exports.PACKAGE_NAME = 'Codivas';
exports.SERVICE_NAME = 'Codivas';
// TODO
// AppSync Lambda resolvers from Backend package
exports.lambda_appsync_handlers = [
    {
        handler: 'PostPaymentActivity',
        function_name: 'PostActivityLambda',
        resolvers: [
            {
                name: 'PostPaymentActivity',
                type_name: 'Mutation',
                response_filepath: 'lib/graphql/genericItemResponse.vtl',
            },
        ],
    },
];
// Lambda resolver request template
exports.requestTemplate = `
  "version" : "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "arguments":  $utils.toJson($context.arguments),
    "identity":  $utils.toJson($context.identity),
    "fieldName": `;
// TODO: update
exports.DEVELOPER_ACCOUNT_ID_PLACEHOLDER = '381491998791';
exports.devStage = {
    stage: 'test',
    accountId: exports.DEVELOPER_ACCOUNT_ID_PLACEHOLDER,
    region: exports.DEFAULT_STACK_REGION,
};
// TODO
exports.beta = {
    stage: 'beta',
    accountId: exports.DEVELOPER_ACCOUNT_ID_PLACEHOLDER,
    region: exports.DEFAULT_STACK_REGION,
};
exports.PipelineStages = [exports.beta];
