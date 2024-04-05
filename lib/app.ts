import * as cdk from '@aws-cdk/core';
import { beta, DEVELOPER_ACCOUNT_ID_PLACEHOLDER, PipelineStages, APP_NAME } from "./commons/constants";
import { ServiceStack } from './stacks/stack';
import {createDevelopmentStack} from './commons/pipeline';
import { App } from 'aws-cdk-lib';
// Set up your CDK App.
const app = new App();

createDevelopmentStack(app);
