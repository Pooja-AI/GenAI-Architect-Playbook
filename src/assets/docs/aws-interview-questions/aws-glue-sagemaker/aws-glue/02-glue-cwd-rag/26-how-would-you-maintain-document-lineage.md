## How would you maintain document lineage?

I would maintain a **unique document ID and ingestion metadata** from the original document in S3 all the way to the RAG chunk in OpenSearch.

```text
S3 Document
   ↓
document_id
   ↓
Glue ETL
   ↓
chunk_id + metadata
   ↓
Embedding
   ↓
OpenSearch
   ↓
RAG Response / Citation
```

### Metadata I would maintain

```text
document_id
source_system
source_path
file_name
version
ingestion_timestamp
last_modified_timestamp
chunk_id
page_number
schema_version
processing_job_id
```

For example:

```text
document_id = DOC-123
version     = 3
chunk_id    = DOC-123-C07
source      = SharePoint
page        = 12
```

So if the LLM returns information from that chunk, we can trace it back to the **exact source document and version**.

### Interview answer

> “I would maintain end-to-end lineage using a unique document ID, version, source location, ingestion timestamp, processing job ID, and chunk ID. These identifiers would travel from S3 through Glue preprocessing and OpenSearch indexing. This allows us to trace any RAG result back to the exact source document and version.”

**Memory:**
**Document ID → Version → Chunk ID → Source → RAG Citation**
