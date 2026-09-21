# How would you handle deleted records?

## Short answer
Handle deletions with source signals plus a reconciliation safety net.

## Key points
- Soft-delete flags and audit tables; CDC delete operations.
- Key comparison between source and target with an anti-join; tombstones.
- Propagate to curated tables (Iceberg MERGE DELETE) and to the OpenSearch index.

## CWD context
Fast deletion from the index matters most for confidentiality.
