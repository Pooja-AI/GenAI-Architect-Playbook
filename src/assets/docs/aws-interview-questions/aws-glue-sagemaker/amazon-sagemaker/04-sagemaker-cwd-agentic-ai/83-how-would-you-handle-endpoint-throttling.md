# How would you handle endpoint throttling?

## Short answer
Handle endpoint throttling with retries, queuing, capacity and fallback.

## Key points
- Backoff with jitter and a circuit breaker.
- Autoscale headroom or more instances; per-tenant rate limits.
- Queue work through SQS to an asynchronous endpoint; fall back to another model.

## CWD context
Throttling under load means capacity planning is due.
