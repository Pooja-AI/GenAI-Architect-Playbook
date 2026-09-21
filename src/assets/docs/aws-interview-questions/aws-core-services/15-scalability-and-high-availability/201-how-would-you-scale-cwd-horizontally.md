# How would you scale CWD horizontally?

## Short answer
Scale horizontally by keeping compute stateless and pushing state and load into managed, scalable services.

## Key points
- ECS behind an ALB with target-tracking scaling; Lambda scales itself.
- State in DynamoDB and ElastiCache; async work through SQS.
- Scale data stores (DynamoDB on-demand, OpenSearch OCUs, ElastiCache cluster mode).
- Remove the real bottleneck, usually Bedrock quota; load test.

## CWD context
Partition by tenant to keep one tenant from affecting others.
