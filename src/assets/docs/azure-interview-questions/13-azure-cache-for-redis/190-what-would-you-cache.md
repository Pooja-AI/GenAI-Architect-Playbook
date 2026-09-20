# What would you cache?

## Short answer
Cache data that is expensive to compute and safe to reuse.

## Key points
- Embeddings, retrieval results (short TTL), tool schemas and registries.
- Session window, intent classifications and Entra group lookups.
- LLM responses for stable, non-personalised queries.

## CWD context
Scope every key by tenant and entitlement.
