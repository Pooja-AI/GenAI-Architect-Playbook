# How do you implement idempotency?

## Short answer
Implement idempotency by recording each operation ID before performing its side effect.

## Key points
- Conditional insert or ETag check in Cosmos DB.
- Pass idempotency keys or external IDs to downstream systems; prefer upserts.
- Design operations to be safely repeatable.

## CWD context
Critical for write tools such as creating tickets or updating records.
