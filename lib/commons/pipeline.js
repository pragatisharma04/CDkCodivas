"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevelopmentStack = void 0;
const constants_1 = require("./constants");
const utility_1 = require("./utility");
const stack_1 = require("../stacks/stack");
function createServiceStack(stageConfig, app) {
    const stack = new stack_1.ServiceStack(app, `${constants_1.APP_NAME}-${stageConfig.stage}`, {
        stage: "test",
        accountId: "785567567155",
        region: "ap-south-1",
    });
    return stack;
}
function createDevelopmentStack(app) {
    utility_1.print(`Proceeding in local development mode with DEVELOPER_ACCOUNT_ID = ${constants_1.DEVELOPER_ACCOUNT_ID_PLACEHOLDER}...`);
    createServiceStack(constants_1.devStage, app);
}
exports.createDevelopmentStack = createDevelopmentStack;
