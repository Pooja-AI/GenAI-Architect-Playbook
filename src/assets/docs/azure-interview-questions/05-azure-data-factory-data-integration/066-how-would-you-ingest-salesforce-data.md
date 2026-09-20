# How would you ingest Salesforce data?

## Short answer
Ingest Salesforce data with the Salesforce connector in a Copy activity landing Parquet in ADLS.

## Key points
- Query objects with SOQL; use the Bulk API for large volumes.
- Credentials in Key Vault; respect API limits.
- Incremental load on LastModifiedDate / SystemModstamp watermark.
- Capture deletions with IsDeleted (queryAll) or reconciliation.

## CWD context
Live lookups still go through MCP; ingestion is for searchable knowledge.
