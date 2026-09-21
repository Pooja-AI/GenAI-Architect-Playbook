# How would you optimize Glue ETL performance?

## Short answer
Optimise Glue by reducing data read, shuffles and small files, and by sizing workers well.

## Key points
- Worker type (G.1X, G.2X and larger) and auto scaling.
- Push-down predicates, partition pruning, file grouping, compacted output.
- Avoid unnecessary shuffles and UDFs; broadcast small joins; use Parquet and bookmarks.
- Check the Spark UI and job metrics.

## CWD context
Measure first; most gains come from a few stages.
