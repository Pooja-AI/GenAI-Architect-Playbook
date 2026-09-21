# How would you handle very large datasets?

## Short answer
Handle very large datasets with distributed processing, incremental loads and good partitioning.

## Key points
- Scale workers with auto scaling; process by partition or time window.
- Columnar formats; skew handling; table compaction in Iceberg.
- Consider EMR when you need deeper Spark control.

## CWD context
Avoid full reloads of large tables.
