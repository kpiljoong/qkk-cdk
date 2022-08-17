import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption, IBucket, LifecycleRule } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import _ = require('lodash');
import { QkkConstruct } from './base';
import { QkkS3Bucket, QkkS3BucketDef } from './s3-bucket';

export interface QkkSecureS3BucketDef extends QkkS3BucketDef {
  enabledLogging?: boolean;
  loggingBucketLifecycleRules?: LifecycleRule[];
  loggingBucketRemovalPolicy?: RemovalPolicy;
}

export class QkkSecureS3Bucket extends QkkConstruct {
  readonly bucket: Bucket;
  readonly loggingBucket: Bucket;
  
  constructor(scope: Construct, id: string, def: QkkSecureS3BucketDef) {
    super(scope, id, def);

    if (def.enabledLogging) {
      const loggingBucketLifecycleRules = def.loggingBucketLifecycleRules ?? [
        {
          id: 'ExpireAfterOneMonth',
          expiration: Duration.days(30),
          enabled: true
        }
      ];

      this.loggingBucket = new QkkS3Bucket(this, `${def.name}LoggingBucket`, {
        name: `${def.name}LoggingBucket`,
        versioned: true,
        lifecycleRules: loggingBucketLifecycleRules,
        accessControl: BucketAccessControl.LOG_DELIVERY_WRITE,
        removalPolicy: def.loggingBucketRemovalPolicy ?? RemovalPolicy.RETAIN
      }).bucket;
      this.addDenyInsecurePolicyStatement(this.loggingBucket);
    }

    const lifecycleRules = def.lifecycleRules ?? [];
    const encryption = def.encryption ?? BucketEncryption.S3_MANAGED;
    const encryptionKey = def.encryptionKey ?? undefined;

    this.bucket = new QkkS3Bucket(this, `${def.name}Bucket`, {
      name: def.name,
      versioned: true,
      bucketName: def.bucketName,
      lifecycleRules,
      encryption,
      encryptionKey,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      accessLogBucket: def.enabledLogging ? this.loggingBucket : undefined,
      removalPolicy: def.removalPolicy ?? RemovalPolicy.RETAIN
    }).bucket;

    this.addDenyInsecurePolicyStatement(this.bucket);
  }

  private addDenyInsecurePolicyStatement(bucket: IBucket) {
    const stmt = new PolicyStatement();
    stmt.addAnyPrincipal();
    stmt.addActions('s3:*');
    stmt.effect = Effect.DENY;
    stmt.addResources(bucket.bucketArn, bucket.arnForObjects('*'));
    stmt.addCondition('Bool', { 'aws:SecureTransport': 'false' });
    bucket.addToResourcePolicy(stmt);
  }
}