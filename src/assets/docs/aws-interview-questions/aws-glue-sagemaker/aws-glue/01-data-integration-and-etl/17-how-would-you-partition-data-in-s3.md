## How would you partition data in S3?

I would partition data based on **common query/filter fields**, usually date and sometimes business dimensions.

```text
s3://cwd-data/salesforce/
    ├── year=2026/
    │   ├── month=09/
    │   │   ├── day=25/
    │   │   └── day=24/
```

### Example for CWD

For Salesforce data:

```text
s3://cwd-data/salesforce/accounts/
    year=2026/month=09/day=25/
```

For multi-tenant CWD data, we could also consider:

```text
s3://cwd-data/
    tenant=onsemi/
    source=salesforce/
    year=2026/
    month=09/
```

### Why partition?

Instead of scanning the entire dataset:

```text
10 TB
 ↓
Query September
 ↓
Scan only September partition
```

This reduces **data scanned, processing time, and cost**.

### Important

Don't create too many tiny partitions. Choose partition columns based on actual access patterns and data volume.

### Interview answer

> “I would partition S3 data based on common query patterns, typically by date such as year, month, and day. For CWD, I could partition Salesforce data by ingestion date and optionally tenant or source when those are useful filters. This allows Glue or Athena to perform partition pruning and reduces the amount of data scanned.”

**Memory:**
**Query Pattern → Partition → Prune → Less Scan → Lower Cost**
