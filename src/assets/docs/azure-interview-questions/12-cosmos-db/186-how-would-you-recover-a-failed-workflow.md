# How would you recover a failed workflow?

## Short answer
Recover a failed workflow by resuming from its latest good checkpoint.

## Key points
- Find failed runs via status queries, change feed or the DLQ.
- Load the checkpoint and resume from the failed node; side effects must be idempotent.
- Cap retries; compensate partial writes; escalate to a human when unrecoverable.

## CWD context
Record attempt counts so retries do not loop forever.
