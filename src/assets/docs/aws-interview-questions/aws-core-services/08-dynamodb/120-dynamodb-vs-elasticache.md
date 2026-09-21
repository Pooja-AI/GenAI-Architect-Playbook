# DynamoDB vs ElastiCache?

## Short answer
DynamoDB is a durable system of record; ElastiCache is a fast, volatile cache.

## Key points
- DynamoDB: durable, queryable, millisecond latency (DAX for microseconds).
- ElastiCache: in-memory, sub-millisecond, cache and counters.
- MemoryDB is a durable in-memory alternative.

## CWD context
Use both: DynamoDB for truth, ElastiCache for speed.
