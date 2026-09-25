## How would Glue ingest data from Salesforce?

For **batch Salesforce data**, I would use an AWS Glue job with a Salesforce connector to extract records, transform them, and land them in S3.

```text
Salesforce
    ↓
Glue Connector
    ↓
Glue ETL Job
    ↓
Clean / Transform
    ↓
S3
    ↓
OpenSearch / Analytics
```

### Practical flow

1. **Authenticate** Glue to Salesforce using the appropriate Salesforce credentials/connection configuration.
2. **Extract** objects such as:

   * Account
   * Contact
   * Opportunity
   * Case
3. **Transform** → clean, normalize, deduplicate.
4. **Write to S3** in formats such as Parquet.
5. **Catalog** the data using Glue Data Catalog.
6. **Index selected data into OpenSearch** if it is needed for RAG/search.
7. Schedule the job for periodic refresh.

### Important

For **real-time Salesforce data**, I would not wait for a Glue batch job.

```text
Customer request
      ↓
Worker → MCP → Salesforce
```

That gives CWD the current Salesforce information.

### Interview answer

> “For batch ingestion, I would configure an AWS Glue Salesforce connection, extract required objects such as Accounts, Opportunities and Cases, transform and normalize the data, and land it in S3. I would catalog it with Glue Data Catalog and optionally index the required data into OpenSearch. For real-time customer information, I would use MCP or Salesforce APIs instead of Glue.”
