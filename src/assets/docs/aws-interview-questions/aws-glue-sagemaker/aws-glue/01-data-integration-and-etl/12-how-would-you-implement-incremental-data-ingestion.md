# How would you implement incremental data ingestion?

## Short answer
Implement incremental ingestion with bookmarks, watermarks or change data capture.

## Key points
- Glue job bookmarks for S3 files and JDBC keys; a watermark table in DynamoDB.
- DMS CDC and AppFlow incremental transfer; upserts into Iceberg or Hudi.
- Idempotent writes so reruns are safe.

## CWD context
Update the watermark only after a successful run.
