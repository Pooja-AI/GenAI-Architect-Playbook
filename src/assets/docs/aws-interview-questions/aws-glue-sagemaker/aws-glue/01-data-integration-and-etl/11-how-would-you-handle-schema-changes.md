## How would you handle schema changes?

I would use **schema versioning + validation + backward-compatible changes**.

```text
Source Schema Change
        ↓
   Glue Crawler
        ↓
Detect New Schema
        ↓
Validate / Compare
        ↓
Update Data Catalog
        ↓
ETL Transformation
        ↓
S3 / OpenSearch
```

### Example

Suppose Salesforce adds:

```text
customer_id
name
region
industry   ← new column
```

I would:

1. Detect the new column.
2. Compare with the existing schema.
3. Update the Glue Catalog.
4. Update ETL mappings if required.
5. Test downstream RAG/OpenSearch pipelines.
6. Version the schema.

### For breaking changes

If Salesforce **renames or removes** a column:

```text
Schema v1 → Schema v2
```

I would **not immediately overwrite production**. I would validate the change, update the ETL pipeline, test it in lower environments, and then promote it.

### Interview answer

> “I handle schema changes through schema detection, validation, versioning, and backward-compatible transformations. Glue Crawler can detect changes, but I would validate the change before updating production pipelines. For breaking changes, I would version the schema and update downstream ETL and RAG pipelines through CI/CD.”

**Memory:**
**Detect → Compare → Validate → Version → Test → Deploy**
