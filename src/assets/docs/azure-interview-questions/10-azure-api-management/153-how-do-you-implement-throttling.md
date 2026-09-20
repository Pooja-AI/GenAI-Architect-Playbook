# How do you implement throttling?

## Short answer
Throttle LLM usage by tokens, not just calls, and limit concurrency.

## Key points
- llm-token-limit per key (tokens per minute) protects Azure OpenAI quota.
- limit-concurrency and backend circuit breakers for spikes.
- Return 429 with Retry-After; ensure per-tenant fairness.

## CWD context
Distinguish burst limits from sustained quotas.
