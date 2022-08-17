import { App, AppProps, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import * as _ from 'lodash';
import { Environment, Stage } from "../config";
import { ensureEnvValues } from "../util";

/**
 * QkkApp's definition.
 */
export interface QkkAppDef extends AppProps {
  stages: Stage[];
  appPrefix: string;
}

/**
 * Qkk's base app.
 * 
 * It ensures all the stacks deploy on each environment.
 */
export class QkkApp extends App {
  stages: Stage[];
  appPrefix: string;

  constructor(def: QkkAppDef) {
    super(def);

    this.stages = def.stages;
    this.appPrefix = def.appPrefix
  }

  public run(code: (envName: string, env: Environment) => any) {
    for (let stage of this.stages) {
      const stageName = stage.name;
      const envName = `${this.appPrefix}-${stageName}`;
      const environments = stage.environment;
    
      for (let env of environments) {
        let newEnv = ensureEnvValues(env);
        
        code(envName, newEnv);
      }
    }
  }
}

/**
 * QkkStack's definition.
 * 
 * Qkk uses definition for the construct's initial configuration
 * to distinguish from CDK property.
 */
 export interface QkkStackDef extends StackProps {
  /**
   * A name of the construct. It differs from stackName.
   */
  readonly name?: string;

  /**
   * A stage for the stack.
   */
  readonly stage?: string;
}

/**
 * Qkk's base stack.
 */
export abstract class QkkStack extends Stack {
  protected def: QkkStackDef;

  constructor(scope: Construct, id: string, def: QkkStackDef) {
    super(scope, id, def);
    this.def = def;
  }

  /**
   * Initializes resources.
   */
  //  protected initResources() {}
  protected abstract initResources(): void

  /**
   * Declares an output value.
   * 
   * @param id 
   * @param value 
   * @returns CfnOutput
   */
  protected createCfnOutput(id: string, value: string): CfnOutput {
    const name = _.camelCase(id);
    const output = new CfnOutput(this, id, {
      exportName: `${this.def.stackName}-${name}`,
      value: value ?? ''
    });
    return output;
  }
}

/**
 * QkkConstruct's definition.
 * 
 * Qkk uses definition for the construct's initial configuration
 * to distinguish from CDK property.
 */
export interface QkkConstructDef {}

/**
 * Base construct for all the Qkk constructs.
 * 
 * It contains the base definition containing foundation information.
 */
export class QkkConstruct extends Construct {
  protected def: QkkConstructDef;

  constructor(parent: Construct, id: string, def: QkkConstructDef) {
    super(parent, id);
    this.def = def;
  }
}