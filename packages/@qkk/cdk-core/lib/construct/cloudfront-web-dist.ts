import { CloudFrontWebDistribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { QkkConstruct, QkkConstructDef } from "./base";

export interface QkkCloudFrontWebDistDef extends QkkConstructDef {
  siteBucket: Bucket;
  oai: OriginAccessIdentity;
  siteRootPath: string;
}

export class QkkCloudFrontWebDist extends QkkConstruct {
  public readonly dist: CloudFrontWebDistribution;

  constructor(scope: Construct, id: string, def: QkkCloudFrontWebDistDef) {
    super(scope, id, def);

    this.dist = new CloudFrontWebDistribution(this, 'TestDist', {
      enabled: true,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: def.siteBucket,
            originAccessIdentity: def.oai
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    new BucketDeployment(this, 'EkkStaticSiteBucketDeployment', {
      destinationBucket: def.siteBucket,
      sources: [ Source.asset(def.siteRootPath) ],
      distribution: this.dist,
      distributionPaths: ['/*']
    });
  }
}