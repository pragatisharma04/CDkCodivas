export const DEFAULT_STACK_REGION = 'ap-south-1';
export const APP_NAME = 'Codivas';
export const PACKAGE_NAME = 'Codivas';
export const SERVICE_NAME = 'Codivas';

// TODO
// AppSync Lambda resolvers from Backend package
export const lambda_appsync_handlers = [
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
export const requestTemplate = `
  "version" : "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "arguments":  $utils.toJson($context.arguments),
    "identity":  $utils.toJson($context.identity),
    "fieldName": `;

export interface StageConfig {
  readonly stage: string; 
  readonly accountId: string;
  readonly region: string;
}

// TODO: update
export const DEVELOPER_ACCOUNT_ID_PLACEHOLDER = '785567567155';

export const devStage: StageConfig = {
  stage: 'test',
  accountId: DEVELOPER_ACCOUNT_ID_PLACEHOLDER,
  region: DEFAULT_STACK_REGION,
};

// TODO
export const beta: StageConfig = {
  stage: 'beta',
  accountId: DEVELOPER_ACCOUNT_ID_PLACEHOLDER,
  region: DEFAULT_STACK_REGION,
};

export const PipelineStages = [beta];
