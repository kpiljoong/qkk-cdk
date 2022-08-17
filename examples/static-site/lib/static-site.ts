import { Construct } from 'constructs';

import { generateRandomString, QkkStack, QkkStackDef } from '@qkk/cdk-core';
import { QkkStaticSite } from '@qkk/cdk-patterns';
import { RemovalPolicy } from 'aws-cdk-lib';

import * as path from 'path';

export class SimpleStaticSite extends QkkStack {
  
  constructor(scope: Construct, id: string, def: QkkStackDef) {
    super(scope, id, def);

    this.initResources();
  }

  protected initResources(): void {
    new QkkStaticSite(this, 'QkkStaticSite', {
      name: 'SimpleStaticSite',
      bucketName: generateRandomString(),
      siteRootPath: path.join(__dirname, './web'),
      bucketRemovalPolicy: RemovalPolicy.DESTROY
    });
  }
}
