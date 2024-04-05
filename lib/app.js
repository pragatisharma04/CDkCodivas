"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeline_1 = require("./commons/pipeline");
const aws_cdk_lib_1 = require("aws-cdk-lib");
// Set up your CDK App.
const app = new aws_cdk_lib_1.App();
pipeline_1.createDevelopmentStack(app);
