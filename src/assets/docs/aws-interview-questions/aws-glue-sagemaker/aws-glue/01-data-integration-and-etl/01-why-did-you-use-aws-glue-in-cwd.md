## Why did you use AWS Glue in CWD?

**AWS Glue is used for data preparation and ETL**, not for the real-time agent orchestration.

```text
Enterprise Data
(S3 / DB / APIs)
       ↓
     Glue
       ↓
Clean / Transform / Catalog
       ↓
   S3 Data Lake
       ↓
RAG / Analytics / ML
```

### In CWD, I would use Glue for:

1. **ETL** → extract and transform enterprise data.
2. **Data cleansing** → normalize inconsistent data.
3. **Data cataloging** → Glue Data Catalog tracks datasets/schema.
4. **Batch ingestion** → prepare large datasets for downstream processing.
5. **RAG preparation** → create clean document/data datasets before chunking and indexing into OpenSearch.
6. **Scheduled pipelines** → refresh data periodically rather than making expensive real-time calls.

### Important distinction

**Glue ≠ real-time agent orchestration**

```text
Real-time request:
User → Coordinator → Delegator → Worker → MCP

Batch data preparation:
Enterprise Data → Glue → S3 → RAG/OpenSearch
```

### Interview answer

> “We use AWS Glue for batch data integration and preparation in CWD. It extracts data from enterprise sources, cleans and transforms it, and catalogs the datasets before storing them in S3 or feeding downstream RAG and analytics pipelines. The real-time Coordinator, Delegator, and Worker orchestration is handled separately; Glue is mainly for data engineering and batch processing.”

**Memory:**
**Glue = Extract → Clean → Transform → Catalog → Prepare**
