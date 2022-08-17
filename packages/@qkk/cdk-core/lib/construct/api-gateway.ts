import { Construct } from 'constructs';
import { DatabaseCluster, Credentials, IClusterEngine } from 'aws-cdk-lib/aws-rds';
import { SubnetType, IVpc } from 'aws-cdk-lib/aws-ec2';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { QkkConstruct, QkkConstructDef } from './base';

export interface QkkApiGatewayDef extends QkkConstructDef {
}

export class QkkApiGateway extends QkkConstruct {
  protected def: QkkApiGatewayDef;
    
  constructor(scope: Construct, id: string, def: QkkApiGatewayDef) {
      super(scope, id, def);
  }
}