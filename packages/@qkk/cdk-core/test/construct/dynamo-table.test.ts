import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { QkkDynamoTable, QkkStack, QkkVpc } from "../../lib";

const testTableName = 'TestTableName';

class TestStack extends QkkStack {
  constructor() {
    super(new App(), 'TestStack', {
      name: 'TestStack',
      stage: 'test'
    });
    this.initResources();
  }

  protected initResources(): void {
    new QkkDynamoTable(this, testTableName, {
      tableName: testTableName,
      partitionKey: {
        name: 'uid',
        type: AttributeType.STRING
      }
    });
  }
}

describe("DynamoDB Table Stack", () => {
  test("creates a table", () => {
    const stack = new TestStack();
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: testTableName
    });
  });
});