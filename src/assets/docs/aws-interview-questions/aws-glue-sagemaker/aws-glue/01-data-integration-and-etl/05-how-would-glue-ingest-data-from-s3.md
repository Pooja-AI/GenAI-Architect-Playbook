# How would Glue ingest data from S3?

## Short answer
Read S3 data in Glue through the catalog or direct paths, processing only what is new.

## Key points
- DynamicFrames or Spark DataFrames; job bookmarks to skip processed files.
- Push-down predicates and partition pruning; IAM role for access.
- Triggered by schedule or S3 events.

## CWD context
Keep the same layout for raw, curated and consumption zones.
