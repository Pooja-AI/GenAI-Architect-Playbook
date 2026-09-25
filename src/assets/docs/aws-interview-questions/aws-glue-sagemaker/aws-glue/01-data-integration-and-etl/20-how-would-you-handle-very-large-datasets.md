## How would you handle very large datasets?

I would **avoid loading the entire dataset into memory** and process it in a distributed, incremental way.

```text
Very Large Data
      ↓
Incremental Extraction
      ↓
S3 Partitioned Data
      ↓
Parquet
      ↓
Glue Spark Distributed Processing
      ↓
S3 / OpenSearch
```

### Key techniques

* **Incremental ingestion** → process only new/changed records.
* **Partition S3 data** → year/month/day or appropriate business partition.
* **Parquet** → compressed, columnar format.
* **Distributed Spark processing** → use multiple Glue workers.
* **Filter early** → reduce data before expensive transformations.
* **Avoid collecting data to the driver** → keep processing distributed.
* **Handle data skew** → optimize problematic partitions/joins.
* **Control file sizes** → avoid millions of tiny files.
* **Scale Glue workers** based on workload.

### Interview answer

> “For very large datasets, I would use incremental ingestion, partition the data in S3, store it as Parquet, and use Glue Spark's distributed processing across multiple workers. I would filter early, optimize joins and data skew, avoid driver-side processing, and tune worker capacity based on the workload.”

**Memory:**
**Incremental → Partition → Parquet → Distributed → Filter → Scale**
