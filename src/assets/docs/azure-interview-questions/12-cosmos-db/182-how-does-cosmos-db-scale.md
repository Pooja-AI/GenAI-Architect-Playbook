# How does Cosmos DB scale?

## Short answer
Cosmos DB scales horizontally by automatically splitting physical partitions.

## Key points
- Throughput is provisioned in RU/s (manual or autoscale) or consumed serverless.
- Storage and throughput scale independently.
- Multi-region replication scales reads and availability.

## CWD context
Design for the partition key; the service handles the rest.
