"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDB = void 0;
const constructs_1 = require("constructs");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
class DynamoDB extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.table = new aws_dynamodb_1.Table(this, id, Object.assign(Object.assign(Object.assign({ tableName: props.tableName, partitionKey: {
                name: props.partitionKeyName,
                type: props.partitionKeyType,
            } }, (!!props.sortKeyName &&
            !!props.sortKeyType && {
            sortKey: {
                name: props.sortKeyName,
                type: props.sortKeyType,
            },
        })), { billingMode: props.billingMode }), (!!props.streamViewType && {
            stream: props.streamViewType
        })));
        if (props.localSecondaryIndexes) {
            props.localSecondaryIndexes.forEach((lsi) => {
                this.table.addLocalSecondaryIndex(lsi);
            });
        }
        if (props.globalSecondaryIndexes) {
            props.globalSecondaryIndexes.forEach((gsi) => {
                this.table.addGlobalSecondaryIndex(gsi);
            });
        }
    }
}
exports.DynamoDB = DynamoDB;
