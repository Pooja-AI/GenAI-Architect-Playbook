# How would you handle duplicate records?

## Short answer
Handle duplicates by deduplicating on a business key and making writes idempotent.

## Key points
- Keep the latest record per key using modified time.
- MERGE upserts into Delta tables; deterministic chunk IDs in the index.
- Assume at-least-once delivery and design for repeats.

## CWD context
Idempotency is what makes safe retries possible.
