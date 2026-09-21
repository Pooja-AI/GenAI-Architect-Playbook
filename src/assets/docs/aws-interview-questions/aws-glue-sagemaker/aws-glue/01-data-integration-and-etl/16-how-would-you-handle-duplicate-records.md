# How would you handle duplicate records?

## Short answer
Handle duplicates by deduplicating on a business key and making writes idempotent.

## Key points
- Window functions to keep the latest record; dropDuplicates.
- MERGE upserts in Iceberg or Hudi; deterministic IDs.
- Partition-level overwrite for repeatable reruns.

## CWD context
Idempotency is what makes retries safe.
