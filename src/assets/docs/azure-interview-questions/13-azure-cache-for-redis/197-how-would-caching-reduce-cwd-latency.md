# How would caching reduce CWD latency?

## Short answer
Caching reduces latency by replacing repeated remote calls with in-memory reads.

## Key points
- Embeddings, retrieval results and registry lookups become sub-millisecond.
- Cached LLM responses turn seconds into milliseconds.
- Less load on downstream services.

## CWD context
Track cache hit ratio and its effect on p95.
