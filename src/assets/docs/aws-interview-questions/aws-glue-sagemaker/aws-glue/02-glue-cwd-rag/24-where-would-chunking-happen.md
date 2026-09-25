## Where would chunking happen?

In the **batch ingestion pipeline**, I would perform chunking in the **Glue ETL layer** after extracting and cleaning the document.

```text
Document
   ↓
S3
   ↓
Glue ETL
   ↓
Extract → Clean → Chunk
             ↓
        Metadata + ACL
             ↓
         Embeddings
             ↓
         OpenSearch
```

### Example

A 100-page document:

```text
Document
   ↓
Clean text
   ↓
Chunk 1
Chunk 2
Chunk 3
...
Chunk 100
```

Each chunk gets metadata:

```text
chunk_id
document_id
page_number
source
ACL
```

### Important practical point

For **simple text documents**, Glue/Spark can perform chunking.

For **complex PDFs, tables, images, scanned documents**, I would use a specialized document extraction service/process first, then perform semantic chunking before embedding.

### Interview answer

> “For CWD, chunking happens during the offline document-ingestion pipeline, after extraction and cleaning. For simple documents, Glue can perform the chunking as part of ETL. For complex PDFs or scanned documents, I would use a document extraction service first, then apply semantic chunking before generating embeddings and indexing into OpenSearch.”

**Memory:**
**Extract → Clean → Chunk → Metadata → Embed → Index**
