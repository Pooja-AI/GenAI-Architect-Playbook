# What happens if Redis becomes unavailable?

## Short answer
Treat Redis as an optimisation: if it fails, CWD keeps working, more slowly.

## Key points
- Fail open to the source (Cosmos, AI Search, LLM) with short timeouts.
- Circuit breaker so a dead cache does not add delay.
- Protect backends from a thundering herd with request coalescing and rate limits.
- Zone-redundant tier and alerts; no critical state only in Redis.

## CWD context
Test the behaviour with Redis switched off.
