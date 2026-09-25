## Why use Parquet instead of CSV?

**Parquet is better for analytical workloads** because it is **columnar, compressed, and stores schema information**.

```text id="bfx5ue"
CSV
 └── Row-based + larger files

Parquet
 └── Column-based + compressed + typed
```

### Main advantages

* **Smaller storage size** → compression reduces S3 storage.
* **Faster queries** → reads only required columns.
* **Lower query cost** → less data scanned by Athena/Glue.
* **Schema included** → column names and data types are preserved.
* **Better for Glue/Spark** → efficient processing of large datasets.

### Example

If CWD needs only:

```text
customer_id, region
```

from a table containing 50 columns, Parquet can read primarily those required columns instead of scanning every column.

### Interview answer

> “I prefer Parquet for CWD's curated data because it is columnar, compressed, schema-aware, and efficient for Glue, Spark, Athena, and analytics workloads. It reduces storage and data scanned compared with CSV, which improves both performance and cost.”

**Memory:**
**Parquet = Columnar + Compressed + Schema + Faster + Cheaper**
