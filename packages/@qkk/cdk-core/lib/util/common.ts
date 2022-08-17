import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Environment } from "../config";

import * as crypto from 'crypto';

/**
 * A helper to generate CfnOutput.
 * 
 * @param scope 
 * @param name 
 * @param value 
 * @returns CfnOutput
 */
export const output = (scope: Construct, name: string, value: string) => 
    new CfnOutput(scope, name, { value });

export const ensureEnvValues = (env: Environment) => {
  let account = env.account || process.env.CDK_DEPLOY_ACCOUNT
    || process.env.CDK_DEFAULT_ACCOUNT;
  let region = env.region || process.env.CDK_DEPLOY_REGION 
    || process.env.CDK_DEFAULT_REGION;

  if (!account || !region) {
      throw Error('Env values are not found');
  }

  return { account, region };
}

export const generateRandomString = (n?: number) => {
  let str = crypto.randomBytes(20).toString('hex');
  return str.substring(0, n ?? 10);
}