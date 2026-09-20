# How would you design CWD for multi-region deployment?

## Short answer
Deploy regional stamps behind Azure Front Door, active-active or active-passive depending on RTO/RPO and cost.

## Key points
- Each region has its own Container Apps, APIM (Premium multi-region), AI Search, Azure OpenAI and Redis.
- Cosmos DB replicated across regions; Service Bus geo-replication; ACR geo-replication.
- Ingestion pipelines populate each region's index; keep data residency rules in mind.
- Health probes drive failover; state design must tolerate a request landing in a different region.

## CWD context
Start active-passive; move to active-active only if the business case justifies the complexity.
