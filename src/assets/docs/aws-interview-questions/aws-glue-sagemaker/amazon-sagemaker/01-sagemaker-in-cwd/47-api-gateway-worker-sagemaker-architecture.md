# API Gateway → Worker → SageMaker architecture?

## Short answer
The Worker sits between CWD and the endpoint: API Gateway → ALB → Coordinator → Delegator → Worker → SageMaker.

## Key points
- The endpoint is private and never exposed to clients or API Gateway directly.
- The Worker adds validation, identity context, retries and logging.
- For slow or large jobs: Worker → SQS → asynchronous endpoint, with results in S3.

## CWD context
The Worker is the policy enforcement point.
