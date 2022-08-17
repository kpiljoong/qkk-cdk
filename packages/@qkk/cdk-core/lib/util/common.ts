import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

export const output = (scope: Construct, name: string, value: string) => 
    new CfnOutput(scope, name, { value });
