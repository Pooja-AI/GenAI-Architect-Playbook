## What data sources would CWD ingest using Glue?

In CWD, I would use Glue mainly for **batch-oriented enterprise data**, not real-time transactional requests.

```text
Enterprise Sources
      ↓
     Glue
      ↓
Clean / Transform
      ↓
      S3
      ↓
RAG / OpenSearch / Analytics
```

### Typical sources

* **S3** → documents, CSV, JSON, historical files
* **Relational databases** → Oracle, PostgreSQL, SQL Server
* **Data warehouses** → Snowflake or other analytical stores
* **Enterprise data lakes**
* **CRM/IT exports** → Salesforce or ServiceNow historical/batch data
* **ERP/manufacturing data** → batch extracts
* **Application logs / historical datasets**

### Important distinction

For **current transactional information**, I would use **MCP/API integration**:

```text
Current customer ticket
       ↓
Worker → MCP → ServiceNow
```

For **large historical/batch datasets**:

```text
Historical ServiceNow data
       ↓
Glue → S3 → OpenSearch
```

### Interview answer

> “I would use Glue for batch-oriented enterprise sources such as S3 files, relational databases, historical CRM and ServiceNow exports, data warehouses, and manufacturing datasets. Glue would clean, transform, and catalog this data before storing it in S3 and preparing it for RAG or analytics. For real-time customer or ticket information, I would use MCP or APIs instead of Glue.”

**Memory:**
**Glue = Batch/Historical | MCP = Real-time**
