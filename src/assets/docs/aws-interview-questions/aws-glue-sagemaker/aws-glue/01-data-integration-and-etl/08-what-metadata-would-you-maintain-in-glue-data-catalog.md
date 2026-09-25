## What metadata would you maintain in Glue Data Catalog?

I would maintain metadata that helps AWS understand **what the data is, where it is, and how it is structured**.

```text
Glue Data Catalog
│
├── Database
├── Table
├── Columns + Data Types
├── S3 Location
├── File Format
├── Partition Information
└── Schema Version
```

### Example — Salesforce Customer data

```text
Database: cwd_salesforce
Table: customer_accounts

Columns:
  customer_id → string
  customer_name → string
  industry → string
  region → string

Location:
  s3://cwd-data/salesforce/accounts/

Format:
  Parquet

Partitions:
  year / month
```

### For CWD, I would also track

* **Source system** → Salesforce
* **Last ingestion/update time**
* **Schema version**
* **Partition information**
* **Data classification** where appropriate
* **Table/column descriptions**

### Interview answer

> “I would maintain database and table definitions, column names and data types, S3 location, file format, partitions, schema version, source system, and ingestion metadata. This allows downstream Glue jobs and analytics services to discover and correctly interpret the data.”

**Memory:**
**What + Where + Structure + Format + Partition + Source**
