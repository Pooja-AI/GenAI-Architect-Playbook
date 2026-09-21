# How would you use CodeBuild?

## Short answer
CodeBuild runs build, test and evaluation steps in managed containers.

## Key points
- buildspec: install, lint, unit tests, build and scan the image, push to ECR.
- Also runs evaluation suites and IaC checks (for example cdk-nag or checkov).
- VPC access for private resources; caching; test reports; least-privilege service role.

## CWD context
Keep build roles separate from deploy roles.
