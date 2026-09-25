## How would you identify the source system for each document?

I would assign a **source_system metadata field during ingestion** based on the ingestion connection/path.

```text id="o5m9fp"
Salesforce ──┐
SharePoint ──┤
ServiceNow ──┼→ Ingestion → Glue → OpenSearch
S3 ──────────┘
                  ↓
             source_system
```

### Example

```text id="e3hm3m"
document_id = DOC-123
source_system = SharePoint
source_path = /policies/security.pdf
```

Another document:

```text id="m5fb1r"
document_id = DOC-456
source_system = ServiceNow
source_path = /knowledge/article/456
```

### Where is it added?

During the **Glue preprocessing step**:

```text id="v8y7gk"
Source
  ↓
Identify source
  ↓
Add source_system metadata
  ↓
Chunk
  ↓
OpenSearch
```

For S3, the bucket/prefix can identify the source. For connectors such as Salesforce or SharePoint, the ingestion job/connection configuration can assign the source system explicitly.

### Interview answer

> “I would maintain a `source_system` metadata field for every document. The ingestion pipeline knows which connector or S3 prefix produced the document, so Glue adds that source information during preprocessing. I would store it along with the document ID, source path, version, and chunk ID in OpenSearch.”

**Memory:**
**Connector/Path → Identify Source → Add Metadata → Preserve Through RAG**
