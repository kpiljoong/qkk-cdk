import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

import { 
  QkkDynamoTableDef, 
  QkkDynamoTable, 
  QkkLambda, 
  QkkLambdaDef,
  QkkConstruct,
  QkkConstructDef,
} from '@qkk/cdk-core';

export interface QkkServerlessAppDef extends QkkConstructDef {
  name: string;
  lambdaDef: QkkLambdaDef;
  tableDef: QkkDynamoTableDef;
}

export class QkkServerlessApp extends QkkConstruct {
  readonly apiEndpoint: string;
  readonly def: QkkServerlessAppDef;

  constructor(scope: Construct, id: string, def: QkkServerlessAppDef) {
    super(scope, id, def);

    const name = def.name;

    // App function
    const fn = new QkkLambda(this, name, def.lambdaDef);

    // App API
    const api = new LambdaRestApi(this, `${name}Api`, {
      handler: fn.lambda,
      proxy: false
    });

    api.root.addResource('api').addMethod('GET');

    // App database
    const table = new QkkDynamoTable(this, `${name}Table`, def.tableDef);
  }
}