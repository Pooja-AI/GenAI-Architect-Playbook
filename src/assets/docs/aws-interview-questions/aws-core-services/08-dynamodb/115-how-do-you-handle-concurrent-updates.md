# How do you handle concurrent updates?

## Short answer
Handle concurrent updates with conditional writes and optimistic locking.

## Key points
- Version attribute with a condition that it equals the expected value.
- Atomic counters through update expressions; transactions for multi-item atomicity.
- On conflict, re-read and retry.

## CWD context
Needed when several Workers update the same run.
