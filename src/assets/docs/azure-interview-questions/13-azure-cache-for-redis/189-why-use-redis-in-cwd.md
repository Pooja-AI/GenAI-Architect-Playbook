# Why use Redis in CWD?

## Short answer
Redis reduces latency and cost by keeping hot, reusable data in memory.

## Key points
- Cache embeddings, retrieval results and registry lookups.
- Rate-limit counters and short-lived locks.
- Optionally a semantic cache when using a Redis tier with vector search.

## CWD context
Redis is an accelerator, never the only copy of important data.
