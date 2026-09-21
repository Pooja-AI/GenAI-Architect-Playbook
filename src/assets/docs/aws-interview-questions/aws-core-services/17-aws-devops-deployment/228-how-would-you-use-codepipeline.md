# How would you use CodePipeline?

## Short answer
CodePipeline orchestrates the release stages and connects the build and deploy services.

## Key points
- Triggers on source changes; integrates CodeBuild, CodeDeploy, CloudFormation, ECS and Lambda.
- Manual approvals, cross-account and cross-region actions.
- Artifact store in S3 encrypted with KMS; EventBridge notifications.

## CWD context
The pipeline definition itself is code.
