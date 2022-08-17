import { Construct } from 'constructs';
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

/**
 * The definition for QkkStaticSite
 */
export interface QkkStaticSiteDef extends QkkConstructDef {
  name: string;
  bucketName: string;
  bucketRemovalPolicy?: RemovalPolicy;
  siteRootPath: string;
}

/**
 * The pattern for static site.
 */
export class QkkStaticSite extends QkkConstruct {
  def: QkkStaticSiteDef;

  constructor(scope: Construct, id: string, def: QkkStaticSiteDef) {
    super(scope, id, def);

    const name = def.name;
    const bucket = new QkkS3Bucket(this, `${name}Bucket`, {
      name: name,
      bucketName: def.bucketName,
      removalPolicy: def.bucketRemovalPolicy
    });

    const oai = new OriginAccessIdentity(this, `${name}CloudFrontOai`);

    bucket.bucket.grantRead(new CanonicalUserPrincipal(
      oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
    ));

    const webDist = new QkkCloudFrontWebDist(this, 'EkkCloudFrontWebDist', {
      siteBucket: bucket.bucket,
      oai: oai,
      siteRootPath: def.siteRootPath
    });

    EkkUtil.output(
      this, 
      `${name}Endpoint`,
      `https://${webDist.dist.distributionDomainName}`);
  }
}