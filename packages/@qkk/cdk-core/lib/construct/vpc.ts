import { DefaultInstanceTenancy, IVpc, SubnetConfiguration, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { QkkConstruct, QkkConstructDef } from "./base";

export interface QkkVpcDef extends QkkConstructDef {
  readonly cidr?: string;
  readonly maxAzs?: number;
  readonly subnextConfiguration?: SubnetConfiguration[];
}

/**
 * A default VPC.
 */
export class QkkVpc extends QkkConstruct {
  public readonly vpc: Vpc;

  constructor(parent: Construct, id: string, def: QkkVpcDef) {
    super(parent, id, def);

    this.vpc = new Vpc(this, 'Vpc', {
      cidr: def.cidr ?? '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      maxAzs: def.maxAzs ?? 2,
      defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
      subnetConfiguration: def.subnextConfiguration
    });
  }
}