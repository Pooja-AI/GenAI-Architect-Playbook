# How do you retry failed messages?

## Short answer
Retry with backoff first, and replay from the DLQ once the cause is fixed.

## Key points
- Abandon for immediate redelivery, or schedule re-enqueue with a delay for backoff.
- Bounded attempts, then dead-letter.
- Replay tool re-submits with the original ID and attempt count; handlers must be idempotent.

## CWD context
Replay is a controlled, audited operation.
