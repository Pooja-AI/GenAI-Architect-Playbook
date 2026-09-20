# How would you eliminate the single points of failure?

## Short answer
Remove single points of failure with redundancy at every tier and a tested failover.

## Key points
- Zone redundancy and at least 2 replicas for Container Apps, APIM and Redis.
- Multiple Azure OpenAI deployments across regions behind APIM with a circuit breaker.
- AI Search with 2+ replicas (3 for read/write SLA) and zone redundancy.
- Cosmos DB multi-region; Service Bus Premium with geo-replication or geo-DR; ACR geo-replication.
- Front Door for regional failover; everything in Bicep or Terraform so a region can be rebuilt.

## CWD context
A failover you have never tested is not a failover; schedule game days.
