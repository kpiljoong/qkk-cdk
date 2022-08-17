import { RemovalPolicy } from 'aws-cdk-lib';
import { IKey } from 'aws-cdk-lib/aws-kms';
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption, LifecycleRule } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { QkkConstruct, QkkConstructDef } from './base';

/**
 * S3 bucket definition.
 * 
 * removalPolicy: If set to DESTROY, the objects will be deleted as well.
 */
export interface QkkS3BucketDef extends QkkConstructDef {
  name: string;
  bucketName?: string;
  websiteIndexDocument?: string;
  removalPolicy?: RemovalPolicy;
  versioned?: boolean;
  lifecycleRules?: LifecycleRule[];
  encryption?: BucketEncryption;
  encryptionKey?: IKey;
  blockPublicAccess?: BlockPublicAccess;
  accessLogBucket?: Bucket;
  accessControl?: BucketAccessControl
}

export class QkkS3Bucket extends QkkConstruct {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, def: QkkS3BucketDef) {
    super(scope, id, def);

    // S3 Bucket
    this.bucket = new Bucket(this, 'S3Bucket', {
      bucketName: def.bucketName ?? undefined,
      websiteIndexDocument: def.websiteIndexDocument,
      removalPolicy: def.removalPolicy ?? RemovalPolicy.RETAIN,
      autoDeleteObjects: def.removalPolicy == RemovalPolicy.DESTROY ? true : false,
      versioned: def.versioned ?? false,
      lifecycleRules: def.lifecycleRules ?? [],
      encryption: def.encryption,
      encryptionKey: def.encryptionKey,
      blockPublicAccess: def.blockPublicAccess ?? BlockPublicAccess.BLOCK_ALL,
      serverAccessLogsBucket: def.accessLogBucket,
      accessControl: def.accessControl ?? BucketAccessControl.PRIVATE
    });
  }
}