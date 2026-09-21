# How do you implement retries for Bedrock?

## Short answer
Retry only transient failures, with backoff, jitter and an overall deadline.

## Key points
- Retry throttling, service-unavailable, internal-server and timeout errors.
- Do not retry validation, access-denied or guardrail-blocked calls.
- SDK standard or adaptive retry modes with a capped attempt count.
- Retry at one layer only; inference calls are read-only and safe to repeat.

## CWD context
Tool calls with side effects need idempotency keys before retrying.
