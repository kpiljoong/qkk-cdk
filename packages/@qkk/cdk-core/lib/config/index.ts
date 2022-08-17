export interface Stage {
  readonly name: string;
  readonly prod: boolean;
  readonly environment: Environment[];
}

export interface Environment {
  readonly account: string;
  readonly region: string;
}