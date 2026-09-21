# How would Glue ingest data from ServiceNow?

## Short answer
Ingest ServiceNow through the Glue connector or Amazon AppFlow using the Table API.

## Key points
- Filter on sys_updated_on for incremental loads; paginate.
- OAuth credentials in Secrets Manager; watch API rate limits.
- Handle deletions through the audit-delete table or reconciliation; keep assignment groups as ACL metadata.

## CWD context
Land as Parquet in S3 for reprocessing.
