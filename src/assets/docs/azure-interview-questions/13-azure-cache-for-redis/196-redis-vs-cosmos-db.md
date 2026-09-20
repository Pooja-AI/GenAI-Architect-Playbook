# Redis vs Cosmos DB?

## Short answer
Redis is fast and volatile; Cosmos DB is durable and queryable.

## Key points
- Redis: caching, counters, locks, sub-millisecond reads.
- Cosmos: system of record, TTL, rich queries, multi-region.

## CWD context
Never make Redis the only place a workflow state lives.
