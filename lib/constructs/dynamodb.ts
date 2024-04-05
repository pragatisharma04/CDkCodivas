import {Construct} from "constructs";
import {
    AttributeType,
    BillingMode,
    GlobalSecondaryIndexProps,
    LocalSecondaryIndexProps,
    StreamViewType,
    Table
} from "aws-cdk-lib/aws-dynamodb";

interface DynamoDBProps {
    tableName: string;
    partitionKeyName: string;
    partitionKeyType: AttributeType;
    sortKeyName?: string;
    sortKeyType?: AttributeType;
    billingMode: BillingMode;
    localSecondaryIndexes?: LocalSecondaryIndexProps[];
    globalSecondaryIndexes?: GlobalSecondaryIndexProps[];
    streamViewType?: StreamViewType
}

export class DynamoDB extends Construct {
    public readonly table: Table;

    constructor(scope: Construct, id: string, props: DynamoDBProps) {
        super(scope, id);

        this.table = new Table(this, id, {
            tableName: props.tableName,
            partitionKey: {
                name: props.partitionKeyName,
                type: props.partitionKeyType,
            },
            ...(!!props.sortKeyName &&
                !!props.sortKeyType && {
                    sortKey: {
                        name: props.sortKeyName,
                        type: props.sortKeyType,
                    },
                }),
            billingMode: props.billingMode,
            ...(!!props.streamViewType && {
                stream: props.streamViewType
            })
        });

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
