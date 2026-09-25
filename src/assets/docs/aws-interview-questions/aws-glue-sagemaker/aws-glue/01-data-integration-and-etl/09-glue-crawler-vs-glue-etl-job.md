## Glue Crawler vs Glue ETL Job

Simple difference:

```text
Crawler = DISCOVER
ETL Job  = PROCESS
```

### Glue Crawler

A **Crawler discovers the structure of data** and creates/updates tables in the Glue Data Catalog.

```text
S3 / Salesforce / DB
        ↓
   Glue Crawler
        ↓
 Glue Data Catalog
   (schema/metadata)
```

It identifies:

* Tables
* Columns
* Data types
* Partitions
* S3 locations

### Glue ETL Job

An **ETL job actually processes the data**.

```text
Source
  ↓
Glue ETL Job
  ↓
Clean → Transform → Join → Filter
  ↓
S3 / OpenSearch
```

It performs:

* Data extraction
* Transformation
* Cleansing
* Deduplication
* Format conversion
* Loading

### CWD example

```text
Salesforce
    ↓
Crawler → discovers schema
    ↓
Data Catalog
    ↓
ETL Job → clean/transform
    ↓
S3
    ↓
OpenSearch / RAG
```

### Interview answer

> “A Glue Crawler is mainly for discovering data structure and populating the Glue Data Catalog, whereas a Glue ETL job performs the actual data processing and transformation. In CWD, I could use the crawler to discover Salesforce or S3 data schemas, then use an ETL job to clean and transform that data before storing it in S3 or preparing it for RAG.”

**Memory:** **Crawler = Discover | ETL = Transform**
