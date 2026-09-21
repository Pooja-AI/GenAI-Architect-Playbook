# AWS CWD interview answers - how to use these files

Each file gives a short answer, key points and CWD context for one question. They are **draft reference answers**
written against the reference AWS architecture below. Edit them so they match what you actually built and can defend.

## Reference architecture assumed

CloudFront / AWS WAF (optional) -> API Gateway (JWT or Cognito authorisation, throttling, validation) -> VPC Link -> private ALB
-> ECS Fargate services: Coordinator (LangGraph), Delegators, Workers, MCP servers for Salesforce, ServiceNow, SharePoint, Snowflake and Oracle.

- AI: Amazon Bedrock (LLMs, embeddings, Guardrails); OpenSearch Serverless (hybrid retrieval, ACL filters); SageMaker for custom models.
- Data: Glue and S3 for ingestion and the document lake.
- State and messaging: DynamoDB (state, checkpoints, registries), ElastiCache, SQS with DLQs, Step Functions, EventBridge.
- Security: IAM roles, KMS, Secrets Manager, private subnets with VPC endpoints.
- Operations: CloudWatch, X-Ray, CloudTrail; CodePipeline, CodeBuild, ECR; CDK, CloudFormation or Terraform.

## Things to check before an interview

- Replace generic statements with your real numbers (latency, cost, volumes, quotas, SLAs).
- AWS service limits, model names and features change; verify against current AWS documentation.
- Where a question asks what *you* did, make sure the answer reflects your actual decisions.
