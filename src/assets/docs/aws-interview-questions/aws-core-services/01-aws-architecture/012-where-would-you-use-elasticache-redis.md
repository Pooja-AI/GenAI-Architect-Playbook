# Where would you use ElastiCache/Redis?

## Short answer
Use ElastiCache (Redis or Valkey) as a low-latency cache and counter store, never as the source of truth.

## Key points
- Embeddings, retrieval results, tool schemas and the session window.
- Rate-limit counters, locks and optional semantic cache.
- MemoryDB if a durable in-memory store is needed.

## CWD context
If the cache fails, CWD slows down but keeps working.
