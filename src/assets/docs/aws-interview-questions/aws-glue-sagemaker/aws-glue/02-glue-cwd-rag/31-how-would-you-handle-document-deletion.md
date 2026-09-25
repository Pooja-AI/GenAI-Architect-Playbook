## How would you handle document deletion?

I would detect the deletion from the **source system** and propagate it to the RAG index.

```text id="h6v4ry"
Source System
     ↓
Delete Detected
     ↓
Glue / Delete Processing
     ↓
Find document_id
     ↓
Remove / Deactivate chunks
     ↓
OpenSearch
```

### Example

If:

```text id="7y6m0d"
document_id = DOC-123
```

is deleted from SharePoint, I would find all chunks:

```text id="l5h7pc"
DOC-123-C01
DOC-123-C02
DOC-123-C03
```

and **delete or mark them inactive** in OpenSearch.

### Important

I would also remove the document from the **retrievable RAG dataset**, not just S3.

```text id="d7ghg8"
Source deleted
      ↓
S3 copy → delete/archive
      ↓
OpenSearch chunks → delete/deactivate
      ↓
Cache → invalidate
```

Otherwise, the RAG system could still retrieve deleted information from OpenSearch or cache.

### Interview answer

> “When a document is deleted from the source, I would detect the deletion through CDC, a delete flag, or periodic reconciliation. Using the document ID, I would remove or deactivate all associated chunks in OpenSearch and invalidate related caches. I would also handle the S3 copy according to the organization's retention policy.”

**Memory:**
**Detect Delete → Find Document ID → Remove Chunks → Invalidate Cache → Verify**
