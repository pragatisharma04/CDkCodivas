import { ComparisonOperator, Statistic, TreatMissingData } from "aws-cdk-lib/aws-cloudwatch";
import { Duration } from "aws-cdk-lib";

export const ProdStageName = 'prod';
export const GammaStageName = 'gamma';

export function print(logStatement: string) {
    console.log('\x1b[35m%s\x1b[0m', logStatement);
}

export function isProdStage(stage: String) {
    return ProdStageName === stage;
}

export function isTestStage(stage: String) {
    return ProdStageName !== stage && GammaStageName !== stage;
}
