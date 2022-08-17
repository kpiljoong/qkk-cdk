import { Construct } from 'constructs';

import { LayerVersion, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { QkkConstruct, QkkConstructDef } from './base';

export interface QkkLambdaLayerDef extends QkkConstructDef {
    layerName: string,
    codePath: string,
    compatibleRuntimes: Runtime[]
}

export class QkkLambdaLayer extends QkkConstruct {
    public readonly layer: LayerVersion;
    
    constructor(scope: Construct, id: string, def: QkkLambdaLayerDef) {
        super(scope, def.layerName + id, def);
        
        this.layer = new LayerVersion(this, id, {
            code: Code.fromAsset(def.codePath),
            compatibleRuntimes: def.compatibleRuntimes
        });
    }
}
