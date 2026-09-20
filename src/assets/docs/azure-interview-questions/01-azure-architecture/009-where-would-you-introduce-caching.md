# Where would you introduce caching?

## Short answer
Cache where data is expensive to produce and safe to reuse: Azure Cache for Redis is the main layer.

## Key points
- Session and conversation window for fast Coordinator start-up.
- Embeddings for repeated text, and short-TTL retrieval results.
- Tool schemas, Agent Registry and prompt versions.
- Exact and semantic caching of LLM responses for repeatable questions.
- Avoid long-lived caching of authorization decisions or user-specific sensitive data.

## CWD context
Cache keys must include tenant and user entitlement scope to avoid leaks.
