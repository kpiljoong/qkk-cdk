/**
 * The definition for Stage.
 */
export interface Stage {
  readonly name: string;
  readonly prod: boolean;
  readonly environment: Environment[];
}

/**
 * The definition for Environment.
 */
export interface Environment {
  readonly account: string;
  readonly region: string;
}