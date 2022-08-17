import { Construct } from 'constructs';
import { QkkConstruct, QkkConstructDef } from './base';

/**
 * The definition for QkkApiGateway.
 */
export interface QkkApiGatewayDef extends QkkConstructDef {
}

export class QkkApiGateway extends QkkConstruct {
  protected def: QkkApiGatewayDef;
    
  constructor(scope: Construct, id: string, def: QkkApiGatewayDef) {
      super(scope, id, def);
  }
}