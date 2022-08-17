import { Construct } from 'constructs';
import { 
  QkkStack, 
  QkkStackDef, 
  QkkLambdaDef, 
  QkkDynamoTableDef,
  generateRandomString
} from '@qkk/cdk-core';
import { QkkServerlessApp } from '@qkk/cdk-patterns';

import * as path from 'path';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export class ServerlessApp extends QkkStack {
  constructor(scope: Construct, id: string, def: QkkStackDef) {
    super(scope, id, def);

    this.initResources();
  }

  protected initResources(): void {
    const lambdaDef: QkkLambdaDef = {
      functionName: 'QkkSimpleServerlessAppFn',
      handler: 'index.handler',
      codePath: path.join(__dirname, './lambda')
    };

    const tableDef: QkkDynamoTableDef = {
      tableName: 'QkkServerlessAppTable' + generateRandomString(3),
      partitionKey: { name: 'uid', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY
    };

    new QkkServerlessApp(this, 'ServerlessApp', {
      appName: 'SimpleServerlessApp',
      lambdaDef,
      tableDef
    })
  } 
}