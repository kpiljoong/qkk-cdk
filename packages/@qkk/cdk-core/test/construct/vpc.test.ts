import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { QkkStack, QkkVpc } from "../../lib";

class TestStack extends QkkStack {
  constructor() {
    super(new App(), 'TestStack', {
      name: 'TestStack',
      stage: 'test'
    });
    this.initResources();
  }

  protected initResources(): void {
    new QkkVpc(this, 'QkkVpc', {
      cidr: "10.0.0.0/16"
    });
  }
}

describe("VPC Stack", () => {
  test("creates a vpc", () => {
    const stack = new TestStack();
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::EC2::VPC", {
      CidrBlock: "10.0.0.0/16"
    });
  });
});