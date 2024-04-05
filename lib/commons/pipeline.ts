import * as cdk from '@aws-cdk/core';
import { DEVELOPER_ACCOUNT_ID_PLACEHOLDER, StageConfig, devStage, DEFAULT_STACK_REGION, APP_NAME } from './constants';
import { print } from './utility';
import { ServiceStack, ServiceStackProps } from '../stacks/stack';
import { App } from 'aws-cdk-lib';

function createServiceStack(stageConfig: StageConfig, app: App) {
  const stack = new ServiceStack(app, `${APP_NAME}-${stageConfig.stage}`, {
    stage: "test",
    accountId: "785567567155",
    region: "ap-south-1",
  });
  return stack;
}

export function createDevelopmentStack(app: App) {
  print(`Proceeding in local development mode with DEVELOPER_ACCOUNT_ID = ${DEVELOPER_ACCOUNT_ID_PLACEHOLDER}...`);
  createServiceStack(devStage, app);
}
