# Why use DynamoDB for CWD state?

## Short answer
DynamoDB offers serverless, low-latency, key-based storage that fits CWD's operational state.

## Key points
- Single-digit millisecond access at any scale; multi-AZ durability.
- Conditional writes, TTL, streams, global tables and point-in-time recovery.
- Fine-grained IAM access control.

## CWD context
A natural store for session state, checkpoints and idempotency keys.
