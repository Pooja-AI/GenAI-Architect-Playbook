# How would you trigger processing when a document arrives in S3?

## Short answer
Trigger processing with S3 event notifications, preferably through EventBridge or SQS.

## Key points
- EventBridge gives richer filtering, multiple targets and replay; SQS adds buffering.
- Filter by prefix and suffix; expect duplicates and out-of-order events.
- Add a DLQ.

## CWD context
Idempotent handlers make event duplication harmless.
