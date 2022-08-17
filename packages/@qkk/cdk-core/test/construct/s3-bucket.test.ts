import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { QkkS3Bucket, QkkStack } from "../../lib";

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
    new QkkS3Bucket(this, testTableName, {
      name: 'TestBucket',
      bucketName: 'tesbucket'
    });
  }
}

describe("S3 Bucket Stack", () => {
  test("creates a bucket", () => {
    const stack = new TestStack();
    const template = Template.fromStack(stack);
    console.log(JSON.stringify(template.toJSON()));
    // template.hasResourceProperties("AWS::DynamoDB::Table", {
    //   TableName: testTableName
    // });
  });
});