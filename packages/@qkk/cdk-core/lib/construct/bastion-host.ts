import { BastionHostLinux, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { QkkConstruct, QkkConstructDef } from './base';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';

import * as _ from 'lodash';

export interface QkkBastionHostDef extends QkkConstructDef {
  vpc: Vpc;
  ssmEnabled?: boolean;
}

export class QkkBastionHost extends QkkConstruct {
  public readonly host: BastionHostLinux;
  
  constructor(scope: Construct, id: string, def: QkkBastionHostDef) {
    super(scope, id, def);

    const sg = new SecurityGroup(this, 'BastionSg', {
      securityGroupName: `${id}-bastion-host-sg`,
      vpc: def.vpc
    });

    this.host = new BastionHostLinux(this, id, {
        vpc: def.vpc,
        securityGroup: sg,
        subnetSelection: {
          subnetType: SubnetType.PUBLIC
        }
    });

    if (_.isEmpty(def.ssmEnabled) || def.ssmEnabled) {
      this.host.role.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
      );
    }
  }
}