# How would you design CWD for 10,000 concurrent users?

## Short answer
Size from request rate and tokens, not headcount: 10,000 concurrent users rarely means 10,000 simultaneous LLM calls.

## Key points
- Estimate: users × requests per minute × tokens per request gives required TPM.
- Stateless Coordinator scales horizontally on Container Apps with KEDA HTTP or queue rules.
- The bottleneck is usually Azure OpenAI throughput: use PTU for baseline plus multiple deployments for spillover.
- Scale AI Search replicas for query load, Cosmos DB autoscale RU/s, Redis size, and Service Bus for async load.
- Add per-tenant quotas, backpressure and load testing to confirm.

## CWD context
Present the sizing arithmetic and name the bottleneck first.
