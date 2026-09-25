## How would you optimize Glue cost?

Main idea: **process less data and use fewer compute resources.**

```text
Reduce Data
    ↓
Incremental Processing
    ↓
Filter Early
    ↓
Parquet + Partitioning
    ↓
Right-size Workers
    ↓
Schedule Efficiently
```

### Key techniques

1. **Incremental ingestion** – process only new/changed records instead of full loads.
2. **Filter early** – don't move/process unnecessary records.
3. **Use Parquet** – compressed columnar format reduces data scanned.
4. **Partition S3 data** – enables partition pruning.
5. **Right-size Glue workers** – don't over-provision workers.
6. **Avoid small files** – compact files to reduce processing overhead.
7. **Use job bookmarks** – avoid reprocessing already processed data where applicable.
8. **Optimize Spark joins** – broadcast small lookup datasets when appropriate.
9. **Schedule only when needed** – avoid unnecessary frequent Glue runs.
10. **Monitor cost and runtime** – identify expensive jobs and optimize them.

### Interview answer

> “I optimize Glue cost mainly by processing less data and using the right amount of compute. I use incremental ingestion, early filtering, partitioned Parquet data, job bookmarks, optimized joins, and right-sized workers. I also monitor job duration and resource utilization to identify over-provisioned or unnecessarily frequent jobs.”

**Memory:**
**Less Data → Parquet → Partition → Optimize Spark → Right-size → Monitor**








