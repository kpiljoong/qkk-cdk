import { RemovalPolicy } from 'aws-cdk-lib';
import { Attribute, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { QkkConstruct, QkkConstructDef } from './base';

export interface QkkDynamoTableDef extends QkkConstructDef {
  tableName: string;
  partitionKey: Attribute;
  sortKey?: Attribute;
  billingMode?: BillingMode;
  removalPolicy?: RemovalPolicy;
}

export class QkkDynamoTable extends QkkConstruct {
  public readonly table: Table;

  constructor(scope: Construct, id: string, def: QkkDynamoTableDef) {
    super(scope, id, def);

    this.table = new Table(this, id, {
      tableName: def.tableName,
      partitionKey: def.partitionKey,
      sortKey: def.sortKey,
      billingMode: def.billingMode ?? BillingMode.PROVISIONED,
      pointInTimeRecovery: true,
      removalPolicy: def.removalPolicy ?? RemovalPolicy.RETAIN
    });
  }
}