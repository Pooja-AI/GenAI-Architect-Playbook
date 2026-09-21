# How would you eliminate AWS single points of failure?

## Short answer
Eliminate single points of failure with redundancy at every tier and tested failover.

## Key points
- ALB across AZs; ECS tasks in at least two AZs; one NAT gateway per AZ.
- ElastiCache Multi-AZ with automatic failover; DynamoDB, S3 and SQS are multi-AZ by design; OpenSearch Serverless with standby replicas in production.
- Bedrock fallback models and cross-region inference; everything in IaC.
- Route 53 health checks for regional failover; runbooks and no single-person dependencies.

## CWD context
A failover you have never tested is not a failover.
