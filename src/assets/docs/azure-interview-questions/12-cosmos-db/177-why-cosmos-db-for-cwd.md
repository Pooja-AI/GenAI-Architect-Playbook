# Why Cosmos DB for CWD?

## Short answer
Cosmos DB gives low-latency, elastic, globally distributed document storage that fits CWD's state, which is JSON-shaped and accessed by key.

## Key points
- Single-digit-millisecond point reads and writes; automatic indexing.
- Multi-region replication, tunable consistency, TTL and change feed.
- Elastic throughput with autoscale or serverless options.

## CWD context
It is the natural store for LangGraph checkpoints and session state.
