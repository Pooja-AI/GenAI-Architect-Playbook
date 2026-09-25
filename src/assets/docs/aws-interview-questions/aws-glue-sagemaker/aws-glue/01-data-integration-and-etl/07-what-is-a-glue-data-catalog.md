## What is Glue Data Catalog?

**Glue Data Catalog is a central metadata repository** that tells AWS **what data exists, where it is, and what its structure looks like**.

```text
Salesforce / DB / S3
        ↓
   Glue Crawler
        ↓
 Glue Data Catalog
        ↓
 Tables + Schema + Location
        ↓
 Athena / Glue / EMR / Analytics
```

### What does it store?

For example, for Salesforce data:

```text
Table: customer_accounts

Columns:
customer_id
customer_name
industry
region

Location:
s3://cwd-data/salesforce/accounts/
Format:
Parquet
```

It stores **metadata**, not the actual business data.

### In CWD

```text
Salesforce
    ↓
Glue ETL
    ↓
S3  ← actual data
    ↓
Data Catalog ← metadata/schema
```

### Interview answer

> “Glue Data Catalog is a centralized metadata repository. It stores table definitions, schemas, columns, data types, and S3 locations. In CWD, after Glue processes Salesforce or other enterprise data into S3, the Data Catalog allows downstream services like Glue and Athena to understand and query that data.”

**Memory:**
**S3 = Data | Glue Catalog = Information about the Data**
