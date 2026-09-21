# What CWD data would you store in DynamoDB?

## Short answer
Store durable, key-addressed operational data in DynamoDB.

## Key points
- Sessions, turns, steps, workflow state and checkpoints, run records.
- Agent and prompt registries, idempotency keys, quotas and counters, tenant configuration, audit metadata.
- Not large blobs (400 KB item limit; use S3), vectors or analytics.

## CWD context
Keep items small and store big payloads in S3 with pointers.
