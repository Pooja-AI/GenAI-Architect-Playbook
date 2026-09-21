# How would you handle document deletion?

## Short answer
Handle deletions with events and a reconciliation safety net.

## Key points
- ObjectRemoved events trigger deletion of chunks in OpenSearch by document ID and manifest cleanup.
- Permanently delete versions for erasure requests; purge caches.
- Periodic reconciliation between the S3 listing and the index.

## CWD context
Fast index deletion matters most for confidentiality.
