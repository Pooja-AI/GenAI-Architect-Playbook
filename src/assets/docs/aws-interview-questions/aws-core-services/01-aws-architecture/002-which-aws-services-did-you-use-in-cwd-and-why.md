# Which AWS services did you use in CWD and why?

## Short answer
Each service does one job, and the design favours managed, serverless and private-by-default options.

## Key points
- Bedrock: LLM reasoning, embeddings and guardrails through one IAM-secured API.
- API Gateway: secured, throttled front door. Lambda: event-driven glue. ECS Fargate: long-running Coordinator, Delegators, Workers and MCP servers.
- SQS and Step Functions: async work, retries and durable workflows. EventBridge: event routing.
- DynamoDB: durable state. ElastiCache: cache. OpenSearch Serverless: hybrid retrieval. S3: document lake.
- IAM, KMS, Secrets Manager, VPC endpoints: security. CloudWatch, X-Ray, CloudTrail: observability. CodePipeline, CodeBuild, ECR: delivery.

## CWD context
Be ready to say what you rejected for each (Lambda vs Fargate, Step Functions vs LangGraph, and so on).

## Interview tip
Lead with the job each service does, not the product name.
