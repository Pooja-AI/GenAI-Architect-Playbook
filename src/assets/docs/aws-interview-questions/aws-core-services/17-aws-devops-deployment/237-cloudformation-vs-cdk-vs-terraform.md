# CloudFormation vs CDK vs Terraform?

## Short answer
CloudFormation is AWS-native; CDK generates CloudFormation from real code; Terraform is multi-cloud.

## Key points
- CloudFormation: declarative YAML or JSON, managed state, rollback on failure.
- CDK: TypeScript, Python and others; reusable constructs; synthesises to CloudFormation.
- Terraform: HCL, plan and apply, state file, providers for many platforms.

## CWD context
Choose CDK for AWS-only developer-led teams; Terraform for multi-cloud or existing skills.
