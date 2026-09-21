# How would Glue ingest data from Salesforce?

## Short answer
Ingest Salesforce through a Glue Salesforce connection or Amazon AppFlow into S3.

## Key points
- OAuth credentials in Secrets Manager; query objects with filters.
- Incremental on LastModifiedDate or SystemModstamp; respect API limits.
- Write Parquet to S3; capture deletions through IsDeleted or reconciliation.

## CWD context
Keep raw and curated layers separate.
