# Would you cache LLM responses?

## Short answer
Cache LLM responses only for repeatable, non-personalised questions, with careful keys and invalidation.

## Key points
- Key includes prompt version, model, tenant and entitlement scope.
- TTL plus invalidation when source documents change.
- Semantic caching needs a tuned similarity threshold to avoid wrong hits.
- Never cache personalised or sensitive answers across users.

## CWD context
Measure hit rate and correctness, not just cost savings.
