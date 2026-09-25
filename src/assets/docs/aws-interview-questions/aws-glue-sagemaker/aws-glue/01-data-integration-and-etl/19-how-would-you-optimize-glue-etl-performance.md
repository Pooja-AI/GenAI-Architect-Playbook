## How would you optimize Glue ETL performance?

I would optimize **data volume, partitioning, Spark processing, and infrastructure**.

```text
Source
  ↓
Filter early
  ↓
Partitioned Parquet
  ↓
Parallel Glue Workers
  ↓
S3 / OpenSearch
```

### Key techniques

1. **Incremental ingestion** → process only new/changed records.
2. **Filter early** → don't load unnecessary data.
3. **Use Parquet** → columnar + compressed.
4. **Partition data** → enable partition pruning.
5. **Avoid small files** → compact files where appropriate.
6. **Optimize joins** → broadcast small lookup datasets when appropriate.
7. **Right-size Glue workers** → don't over-provision.
8. **Parallelize independent transformations** where possible.
9. **Use Glue job bookmarks** for supported incremental workloads.
10. **Monitor Spark stages** to identify slow transformations or data skew.

### Interview answer

> “I would optimize Glue ETL by using incremental ingestion, filtering early, partitioning the data, and using compressed Parquet instead of CSV. I would optimize joins, avoid small files, right-size Glue workers, and monitor Spark stages for data skew or expensive transformations.”

**Memory:**
**Less Data → Partition → Parquet → Optimize Spark → Right-size → Monitor**
