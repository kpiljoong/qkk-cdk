import { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

import { 
  QkkDynamoTableDef, 
  QkkDynamoTable, 
  QkkLambda, 
  QkkLambdaDef,
  QkkConstruct,
  QkkConstructDef,
} from '@qkk/cdk-core';

export interface QkkServerlessAppDef extends QkkConstructDef {
  appName: string;
  lambdaDef: QkkLambdaDef;
  tableDef: QkkDynamoTableDef;
}

export class QkkServerlessApp extends QkkConstruct {
  readonly apiEndpoint: string;
  readonly def: QkkServerlessAppDef;

  constructor(scope: Construct, id: string, def: QkkServerlessAppDef) {
    super(scope, id, def);

    // App function
    const fn = new QkkLambda(this, def.appName, def.lambdaDef);

    // App API
    const api = new LambdaRestApi(this, `${def.appName}Api`, {
      handler: fn.lambda,
      proxy: false
    });

    api.root.addResource('api').addMethod('GET');

    // App database
    const table = new QkkDynamoTable(this, `${def.appName}Table`, def.tableDef);
  }
}