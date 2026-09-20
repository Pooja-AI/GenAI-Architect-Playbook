# How do you handle document deletion?

## Short answer
Handle deletions explicitly, because indexes do not notice missing source documents by themselves.

## Key points
- Detect deletes with source delete signals, blob-deleted events, indexer deletion tracking or a periodic key reconciliation.
- Delete all chunks by parent document ID and verify.
- Purge related caches; honour erasure requests, including in logs where required.

## CWD context
Run a scheduled reconciliation job as a safety net.
