# How would you handle deleted records?

## Short answer
Handle deleted records with source signals plus a reconciliation safety net.

## Key points
- Soft-delete flags, audit-delete tables or Graph delta deletions.
- Periodic key comparison between source and target.
- Propagate deletion as a tombstone to ADLS and delete chunks in AI Search.

## CWD context
Deleting from the index quickly matters most for confidentiality.
