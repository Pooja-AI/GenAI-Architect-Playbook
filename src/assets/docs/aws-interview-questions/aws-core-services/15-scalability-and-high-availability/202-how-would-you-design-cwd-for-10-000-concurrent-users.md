# How would you design CWD for 10,000 concurrent users?

## Short answer
Size from request rate and tokens, not user count.

## Key points
- Example: 10,000 users each sending one request every 30 seconds is roughly 330 requests per second.
- Multiply by tokens per request for required tokens per minute; compare with Bedrock quota and provisioned throughput.
- Size ECS tasks by requests per task; check API Gateway quotas, DynamoDB capacity, OpenSearch OCUs and Redis.
- Plan for streaming connections; add per-tenant quotas, backpressure and load testing.

## CWD context
Present the arithmetic and name the bottleneck first.
