import { Construct } from "constructs";
import { PolicyDocument, PolicyStatement, PolicyStatementProps, Role, ServicePrincipal } 
    from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { QkkConstruct, QkkConstructDef } from "./base";
import _ = require("lodash");

export interface QkkLambdaDef extends QkkConstructDef {
  functionName: string;
  
  codePath: string;

  handler: string;

  policies?: PolicyStatementProps[];

  // Default runtime: NODEJS_16_X.
  runtime?: Runtime;

  // Default memory size: 128
  memorySize?: number;

  vpc?: Vpc;
}

export class QkkLambda extends QkkConstruct {
  public readonly lambda: Function;

  constructor(parent: Construct, id: string, def: QkkLambdaDef) {
    super(parent, id, def);
    
    const role = createRole(this,
        `${def.functionName}${id}Role`,
        def.policies ?? []
    );

    this.lambda = new Function(this, id, {
      code: Code.fromAsset(def.codePath),
      handler: def.handler,
      runtime: def.runtime ?? Runtime.NODEJS_16_X,
      role,
      functionName: def.functionName,
      memorySize: def.memorySize ?? 128,
      tracing: Tracing.ACTIVE,
      vpc: def.vpc
    });
  }
}

function createRole(scope: Construct,
  roleName: string,
  policies: PolicyStatementProps[]): Role {
  const policy = new PolicyDocument();

  if (!_.isEmpty(policies)) {
    policies.forEach((p) => {
      if (p.actions && p.resources) {
        policy.addStatements(createPolicyStatement(p.actions, p.resources));
      }
    });
  }

  const logActions: string[] = [
    "logs:CreateLogGroup", "logs:CreateLogStream", 
        "logs:PutLogEvents", "logs:DescribeLogStreams"
  ];
  const logResources: string[] = [
    'arn:aws:logs:*:*:*'
  ];

  policy.addStatements(createPolicyStatement(logActions, logResources));

  return new Role(scope, roleName, {
    roleName,
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    inlinePolicies: { indexerPolicy: policy }
  });
}

function createPolicyStatement(actions: string[],
      resources: string[]) : PolicyStatement {
  const stmt = new PolicyStatement();
  stmt.addActions(...actions);
  stmt.addResources(...resources);
  return stmt;
}