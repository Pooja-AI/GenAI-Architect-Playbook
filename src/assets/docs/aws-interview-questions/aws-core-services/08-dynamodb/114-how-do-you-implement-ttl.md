# How do you implement TTL?

## Short answer
TTL expires items automatically, without consuming write capacity.

## Key points
- Store an expiry timestamp in epoch seconds on a designated attribute.
- Deletion is background and not instant, so filter expired items in queries.
- Use for idempotency keys, old checkpoints and sessions; streams show TTL deletions.

## CWD context
Align TTL with retention and privacy commitments.
