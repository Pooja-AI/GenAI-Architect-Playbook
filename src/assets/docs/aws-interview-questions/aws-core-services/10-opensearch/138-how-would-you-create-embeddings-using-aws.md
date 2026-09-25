# How would you create embeddings using AWS?

For CWD, I would use **Amazon Bedrock's embedding model** to convert each document chunk into a vector, then store that vector in **OpenSearch Serverless**.

```text id="awsemb01"
S3 Document
     ↓
Ingestion Worker
     ↓
Extract + Chunk
     ↓
Amazon Bedrock
Embedding Model
     ↓
Embedding Vector
     ↓
OpenSearch Serverless
```

## 1. Get the document from S3

Example:

```text id="awsemb02"
s3://cwd-documents/raw/customer_policy.pdf
```

The ingestion Worker reads the document from S3.

---

## 2. Extract and chunk the document

```text id="awsemb03"
PDF
 ↓
Text Extraction / OCR
 ↓
Clean Text
 ↓
Chunks
```

Example:

```text id="awsemb04"
Chunk 1 → "Warranty period is two years..."
Chunk 2 → "Returns are accepted within..."
Chunk 3 → "Customer support is available..."
```

---

## 3. Call a Bedrock embedding model

The Worker sends each chunk to a Bedrock embedding model.

Conceptually:

```text id="awsemb05"
Chunk
 ↓
Bedrock Embedding Model
 ↓
[0.12, -0.43, 0.87, ...]
```

The exact model and vector dimension should be selected based on the current AWS/Bedrock model catalog and CWD retrieval requirements.

---

## 4. Store the embedding in OpenSearch

```text id="awsemb06"
{
    "chunk_id": "C123",
    "document_id": "DOC456",
    "text": "Warranty period is two years...",
    "embedding": [0.12, -0.43, 0.87, ...],
    "tenant_id": "ON",
    "active": true
}
```

OpenSearch then supports vector similarity search.

---

## 5. Query-time embedding

The same embedding model should be used for the user's query.

```text id="awsemb07"
User Query
   ↓
Bedrock Embedding Model
   ↓
Query Vector
   ↓
OpenSearch Vector Search
   ↓
Top-K Chunks
```

Then:

```text id="awsemb08"
Retrieved Context
      ↓
    Bedrock
      ↓
Final Answer
```

---

## 6. Important: use the same embedding model

For example:

```text id="awsemb09"
Documents
   ↓
Embedding Model A
   ↓
Vectors

User Query
   ↓
Embedding Model A
   ↓
Query Vector
```

Don't generate document embeddings with one incompatible embedding model and query embeddings with another.

If I change the embedding model, I would generally create a **new index/version and re-embed the documents**.

---

# 🎯 Strong interview answer

> **“In CWD, I would create embeddings using Amazon Bedrock's embedding model. During ingestion, the document is read from S3, extracted and split into chunks. Each chunk is sent to the Bedrock embedding model, which returns a numerical vector. I store that vector along with the chunk text, document ID, ACL, tenant and version metadata in OpenSearch Serverless. At query time, I generate an embedding for the user's query using the same embedding model and perform vector similarity search. I would also version the embedding index if we change the embedding model.”**

### Easy memory trick

**S3 → Chunk → Bedrock Embedding → OpenSearch**

### Key distinction

**Bedrock embedding model = creates vectors**

**OpenSearch = stores and searches vectors**

**Bedrock foundation model = generates the final answer**
