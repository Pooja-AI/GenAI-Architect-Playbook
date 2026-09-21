# How would you deploy CWD on AWS?

## Short answer
Deploy CWD through infrastructure as code and a pipeline that promotes one artifact through accounts.

## Key points
- IaC provisions VPC, ECS, API Gateway, DynamoDB, SQS, Step Functions, IAM and alarms.
- CodePipeline builds with CodeBuild, pushes to ECR and deploys to ECS through CodeDeploy; Lambda through versions and aliases.
- Runtime configuration through AppConfig and SSM; approvals; smoke tests.

## CWD context
The same image and templates go to every environment; only configuration differs.
