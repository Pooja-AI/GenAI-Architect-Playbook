## How would you handle document updates?

I would use **incremental ingestion + document versioning**.

```text
Document Updated
      ↓
Detect change
      ↓
Glue incremental job
      ↓
Re-process document
      ↓
Re-chunk + Re-embed
      ↓
Update OpenSearch
      ↓
Keep new version active
```

### Example

```text
DOC-123
Version 1 → old
Version 2 → updated
```

When the source document changes:

1. Detect using `LastModifiedDate`, version ID, or CDC.
2. Retrieve the updated document.
3. Re-extract and re-chunk it.
4. Generate new embeddings.
5. Update/replace its OpenSearch chunks.
6. Keep the old version inactive or remove it.
7. Preserve lineage: `document_id + version + ingestion_timestamp`.

### Important

I would **not append the updated chunks blindly**, because the RAG index could contain both old and new content.

```text
❌ Old chunks + New chunks

✅ Only current active version
```

### Interview answer

> “I would detect document changes using a timestamp or version ID, then incrementally reprocess only the changed document. I would re-extract, re-chunk, and re-embed it, update the corresponding OpenSearch records, and mark the previous version inactive or remove it. I would maintain document version and lineage metadata for traceability.”

**Memory:**
**Detect → Reprocess → Re-chunk → Re-embed → Replace → Version**
