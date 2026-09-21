# Why use Parquet instead of CSV?

## Short answer
Parquet is columnar, compressed and typed, so it reads less data than CSV.

## Key points
- Column and predicate pruning make Athena and Glue faster and cheaper.
- Schema is embedded and supports evolution.
- CSV is row-based, untyped and larger; use it only for exchange.

## CWD context
Consider Iceberg on Parquet for table features.
