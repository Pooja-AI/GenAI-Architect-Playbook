# How would you identify new or changed records?

## Short answer
Identify changes through timestamps, versions, CDC logs or hashes.

## Key points
- Modified-date columns, row versions, DMS change records.
- S3 LastModified, ETag or version ID; content hash compared with a manifest.
- Iceberg snapshots for incremental reads.

## CWD context
Prefer a real change signal over comparing full copies.
