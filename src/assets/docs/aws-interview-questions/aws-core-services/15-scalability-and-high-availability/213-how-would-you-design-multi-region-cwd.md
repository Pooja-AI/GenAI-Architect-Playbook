# How would you design multi-region CWD?

## Short answer
Design multi-region with a routing layer and per-region stacks built from the same IaC.

## Key points
- Route 53 or Global Accelerator with health checks and latency or failover routing.
- DynamoDB global tables; S3 cross-region replication; ECR replication; secret replication; KMS multi-Region keys.
- Rebuild or replicate the OpenSearch index per region; confirm Bedrock model availability in each region.
- SQS is regional, so state design must tolerate a region switch; watch data residency.

## CWD context
Start active-passive; go active-active only if justified.
