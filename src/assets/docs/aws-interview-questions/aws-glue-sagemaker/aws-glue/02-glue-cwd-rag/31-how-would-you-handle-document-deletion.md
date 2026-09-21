# How would you handle document deletion?

## Short answer
Handle deletions with delete signals and reconciliation.

## Key points
- S3 events, source tombstones and a periodic reconciliation job.
- Delete chunks by document ID in OpenSearch; update manifests; purge caches.
- Verify and record for compliance.

## CWD context
Erasure requests must reach the index and any caches.
