import { RemovalPolicy } from 'aws-cdk-lib';
import { OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { CanonicalUserPrincipal } from 'aws-cdk-lib/aws-iam';

import { 
  QkkCloudFrontWebDist, 
  QkkConstruct, 
  QkkConstructDef, 
  QkkS3Bucket
} from '@qkk/cdk-core';

import * as EkkUtil from '@qkk/cdk-core';

export interface QkkStaticsiteDef extends QkkConstructDef {
  name: string;
  bucketName: string;
  bucketRemovalPolicy?: RemovalPolicy;
  siteRootPath: string;
}

export class QkkStaticSite extends QkkConstruct {
  def: QkkStaticsiteDef;

  constructor(scope: QkkConstruct, id: string, def: QkkStaticsiteDef) {
    super(scope, id, def);

    this.initResources();
  }

  protected initResources() {
    const name = this.def.name;
    const bucket = new QkkS3Bucket(this, `${name}Bucket`, {
      name: name,
      bucketName: this.def.bucketName,
      removalPolicy: this.def.bucketRemovalPolicy
    });

    const oai = new OriginAccessIdentity(this, `${name}CloudFrontOai`);

    bucket.bucket.grantRead(new CanonicalUserPrincipal(
      oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
    ));

    const webDist = new QkkCloudFrontWebDist(this, 'EkkCloudFrontWebDist', {
      siteBucket: bucket.bucket,
      oai: oai,
      siteRootPath: this.def.siteRootPath
    });

    EkkUtil.output(
      this, 
      `${name}Endpoint`,
      `https://${webDist.dist.distributionDomainName}`);
  }
}