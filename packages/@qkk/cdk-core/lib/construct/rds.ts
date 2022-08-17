import { Construct } from 'constructs';
import { DatabaseCluster, Credentials, IClusterEngine } from 'aws-cdk-lib/aws-rds';
import { SubnetType, IVpc } from 'aws-cdk-lib/aws-ec2';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { QkkConstruct, QkkConstructDef } from './base';

export interface QkkRdsClusterDef extends QkkConstructDef {
    name: string,
    vpc: IVpc,
    creds?: ISecret
    engine: IClusterEngine
}

export class QkkRds extends QkkConstruct {
    public readonly cluster: DatabaseCluster;
    
    constructor(scope: Construct, id: string, def: QkkRdsClusterDef) {
        super(scope, id, def);
        
        this.cluster = new DatabaseCluster(this, def.name, {
            engine: def.engine,
            credentials: Credentials.fromSecret(def.creds!!),
            instanceProps: {
                vpc: def.vpc,
                vpcSubnets: {
                    subnetType: SubnetType.PRIVATE_ISOLATED
                }
            }
        });
        this.cluster.connections.allowDefaultPortFromAnyIpv4();
    }
}
