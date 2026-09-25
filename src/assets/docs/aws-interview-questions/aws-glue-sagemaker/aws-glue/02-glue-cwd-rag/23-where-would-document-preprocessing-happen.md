## Where would document preprocessing happen?

For CWD, I would do **batch document preprocessing in the Glue ETL pipeline**.

```text
Documents
   ↓
S3
   ↓
Glue ETL
   ├── Extract
   ├── Clean
   ├── Chunk
   ├── Metadata / ACL
   └── Deduplicate
   ↓
Embedding
   ↓
OpenSearch
```

### Important distinction

* **S3** → stores original documents.
* **Glue** → batch preprocessing and transformation.
* **Embedding service/model** → converts chunks into vectors.
* **OpenSearch** → stores chunks + vectors + metadata.
* **RAG Worker** → performs runtime retrieval.

### Interview answer

> “I would perform batch document preprocessing in AWS Glue. Glue would extract, clean, chunk, deduplicate, and enrich documents with metadata and ACL information. After preprocessing, I would generate embeddings and index the chunks into OpenSearch. The original documents remain in S3.”

**Memory:**
**S3 = Store → Glue = Preprocess → Embedding = Vectorize → OpenSearch = Index**
