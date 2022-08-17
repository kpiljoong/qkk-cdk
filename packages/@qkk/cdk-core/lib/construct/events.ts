import { Construct } from 'constructs';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { QkkConstruct, QkkConstructDef } from './base';

export interface QkkEventsDef extends QkkConstructDef {
    readonly id: string;
    readonly busName: string;
}

export class QkkEvents extends QkkConstruct {
    public readonly bus: EventBus;
    
    constructor(scope: Construct, id: string, def: QkkEventsDef) {
        super(scope, def.busName + id, def);
        
        this.bus = new EventBus(this, 'EventBus', {
            eventBusName: def.busName
        });
    }
}
