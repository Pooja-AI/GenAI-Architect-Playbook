# What is S3 versioning?

## Short answer
S3 versioning keeps every version of an object, protecting against overwrites and deletes.

## Key points
- Deletes create delete markers; older versions can be restored.
- Lifecycle rules expire non-current versions to control cost.
- Required for cross-region replication.

## CWD context
Useful for audit and rollback of documents.
