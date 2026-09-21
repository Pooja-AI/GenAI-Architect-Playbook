# How would you replay failed CWD requests?

## Short answer
Replay failed requests by redriving from the DLQ after fixing the cause.

## Key points
- SQS DLQ redrive moves messages back to the source queue.
- Rate-limit the redrive; handlers must be idempotent.
- Keep original IDs and attempt counts; archive requests older than DLQ retention.

## CWD context
Replay should be a controlled, audited action.
