# Explain the complete AWS architecture for CWD.

## Short answer
CWD on AWS is a layered, private, IAM-based architecture: edge and API, orchestration and agents, tools, AI and data services, state and messaging, and a platform layer for security, observability and delivery.

## Key points
- Edge: optional CloudFront and AWS WAF → API Gateway (JWT or Cognito authorisation, throttling, validation) → VPC Link to a private ALB.
- Orchestration: Coordinator (LangGraph) on ECS Fargate, routing to Delegators and Workers; Lambda for light, short paths.
- Tools: Workers call MCP servers (ECS) that wrap Salesforce, ServiceNow, SharePoint, Snowflake and Oracle.
- AI and data: Amazon Bedrock (LLMs, embeddings, Guardrails), OpenSearch Serverless (RAG), S3 plus Glue for ingestion, SageMaker for custom models.
- State and async: DynamoDB, ElastiCache (Redis/Valkey), SQS, Step Functions, EventBridge.
- Platform: IAM roles, KMS, Secrets Manager, private subnets with VPC endpoints, CloudWatch / X-Ray / CloudTrail, CodePipeline / CodeBuild / ECR, infrastructure as code.

## CWD context
Everything sits in private subnets across multiple AZs; only API Gateway (and CloudFront) face the internet.

## Interview tip
Walk one request left to right and name the job of each box.
