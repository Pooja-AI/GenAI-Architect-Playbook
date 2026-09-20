# How would you ingest Oracle data?

## Short answer
Ingest Oracle data with the Oracle connector, using a self-hosted integration runtime if the database is on-premises or private.

## Key points
- Partition options for parallel reads of large tables.
- Incremental by timestamp or change tracking; CDC tooling for lower latency.
- Land as Parquet in ADLS; credentials in Key Vault.

## CWD context
Avoid heavy queries against production databases in business hours.
