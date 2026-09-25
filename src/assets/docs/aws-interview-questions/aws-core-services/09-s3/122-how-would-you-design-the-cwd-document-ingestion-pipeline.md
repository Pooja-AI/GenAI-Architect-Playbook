# How would you design the CWD document ingestion pipeline?

For CWD, I would design it as an **event-driven pipeline** where S3 is the source of truth, documents are processed asynchronously, and the final content is indexed into OpenSearch for RAG.

### End-to-end architecture

```text
 Enterprise Sources
       │
       ▼
 ┌─────────────┐
 │     S3      │  ← Raw documents
 └──────┬──────┘
        │ ObjectCreated
        ▼
 ┌─────────────┐
 │ EventBridge │
 └──────┬──────┘
        ▼
 ┌─────────────┐
 │     SQS     │  ← Buffer / retry / DLQ
 └──────┬──────┘
        ▼
 ┌────────────────────┐
 │ Ingestion Worker   │
 │ ECS / Lambda       │
 └─────────┬──────────┘
           │
     ┌─────┴───────────────┐
     ▼                     ▼
 Extract/OCR           Metadata
     │                     │
     └──────────┬──────────┘
                ▼
          Clean + Chunk
                │
                ▼
           Embeddings
                │
                ▼
       ┌─────────────────┐
       │    OpenSearch   │
       │ Vector + BM25   │
       └─────────────────┘
                │
                ▼
             RAG
                │
                ▼
            Bedrock
```

## 1. Upload documents to S3

Documents can come from:

* SharePoint
* Enterprise file systems
* User uploads
* Manufacturing systems
* Sales documents
* IT documentation

They are stored in S3:

```text
s3://cwd-documents/raw/...
```

I would enable:

* Encryption with KMS
* Versioning
* Block Public Access
* Access controls
* Lifecycle policies

---

## 2. Generate an ingestion event

When a document arrives:

```text
S3 ObjectCreated
       ↓
EventBridge
       ↓
SQS
```

I prefer SQS between the event and processing layer because it gives me:

* Buffering
* Retry
* Backpressure
* DLQ
* Controlled concurrency

---

## 3. Ingestion Worker processes the document

The Worker reads the S3 object and determines its type.

```text
PDF
Word
Excel
Image
Scanned PDF
```

Then performs extraction.

For scanned documents:

```text
Document
   ↓
OCR
   ↓
Text + layout
```

For images:

```text
Image
  ↓
Vision/OCR
  ↓
Text + metadata
```

---

## 4. Preserve metadata and security information

This is extremely important for enterprise RAG.

I would attach metadata such as:

```text
document_id
source
file_name
department
document_type
version
created_at
updated_at
classification
tenant_id
ACL
```

For example:

```text
document_id = DOC123
department = Sales
customer_id = C456
ACL = [SalesTeam]
version = 3
```

The **ACL must travel with the chunks**.

---

## 5. Clean and chunk the content

After extraction:

```text
Raw text
   ↓
Clean
   ↓
Remove unnecessary noise
   ↓
Chunk
```

For example, I might start around **500–700 tokens with 10–15% overlap**, then tune based on retrieval evaluation.

For tables, I preserve the relationship between:

```text
Column → Row → Value
```

rather than blindly splitting every row.

---

## 6. Generate embeddings

For each chunk:

```text
Chunk
  ↓
Embedding model
  ↓
Vector
```

The embedding is associated with the original metadata and ACL.

---

## 7. Index into OpenSearch

Store:

```text
chunk_id
document_id
text
embedding
metadata
ACL
version
```

Then CWD can perform:

```text
User Query
    ↓
Hybrid Search
 ┌──────────────┐
 │ BM25         │
 │ Vector       │
 └──────┬───────┘
        ↓
    Reranking
        ↓
    Top chunks
        ↓
      Worker
        ↓
     Bedrock
```

This supports both:

* **Keyword/exact search**
* **Semantic search**

---

## 8. Handle document updates

Don't blindly insert a new copy.

Use:

```text
DOC123 v1
   ↓
DOC123 v2
   ↓
Reprocess changed document
   ↓
Update affected chunks
```

I would maintain document version/hash information so unchanged documents don't get reprocessed unnecessarily.

---

## 9. Handle deleted documents

If a source document is deleted:

```text
Source deletion
      ↓
Deletion event
      ↓
Find document_id
      ↓
Delete/deactivate its chunks
      ↓
OpenSearch updated
```

This prevents deleted information from continuing to appear in RAG.

---

## 10. Handle failures

```text
Ingestion Worker
      ↓
Failure
      ↓
SQS retry
      ↓
Retry succeeds? ── Yes → OpenSearch
      │
      No
      ↓
DLQ
      ↓
Investigate → Fix → Replay
```

I would also make ingestion **idempotent** using:

```text
document_id + version/hash
```

so the same document event doesn't create duplicate chunks.

---

## 11. Monitor the pipeline

I would monitor:

```text
Documents received
Documents processed
Processing failures
Queue depth
Oldest message age
Processing latency
OCR failures
Embedding failures
OpenSearch indexing failures
DLQ count
```

For AI/RAG quality:

```text
Retrieval Recall@K
Precision@K
MRR / NDCG
RAGAS metrics
Answer faithfulness
```

---

# 🎯 Strong interview answer

> **“I would design CWD document ingestion as an event-driven pipeline. Documents from enterprise sources land in S3, which is the source of truth. S3 events go through EventBridge into SQS for buffering, retries, and DLQ handling. An ingestion Worker extracts text using parsers or OCR, cleans and chunks the content, preserves document metadata and ACLs, generates embeddings, and indexes the chunks into OpenSearch using hybrid BM25 and vector search. I would make the pipeline idempotent using document IDs and versions or hashes, handle updates and deletions, and monitor both pipeline health and RAG retrieval quality. Large source documents remain in S3, while OpenSearch stores the searchable representation.”**

### Easy memory trick

**S3 → Event → Queue → Extract → Metadata → Chunk → Embed → Index → Monitor**

### Key distinction

**S3 = source of truth**
**SQS = ingestion buffer**
**Ingestion Worker = processing**
**OpenSearch = retrieval index**
**Bedrock = generation**
