# How do you implement idempotency?

## Short answer
Implement idempotency by recording the operation ID before the side effect.

## Key points
- DynamoDB conditional put keyed by message or business operation ID, with TTL.
- Powertools idempotency utility; downstream idempotency tokens or upserts.
- Mark complete after success.

## CWD context
Critical for write tools such as creating tickets.
