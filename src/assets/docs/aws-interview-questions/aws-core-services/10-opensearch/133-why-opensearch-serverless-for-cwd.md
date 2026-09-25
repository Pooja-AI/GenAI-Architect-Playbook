# Why OpenSearch Serverless for CWD?

For CWD, I would use **Amazon OpenSearch Serverless as the RAG retrieval layer** because it supports **vector search, keyword search, metadata filtering, and scalable search without managing OpenSearch clusters manually**.

### CWD flow

```text
Enterprise Documents
        ↓
       S3
        ↓
Extract → Chunk → Embed
        ↓
OpenSearch Serverless
        ↓
 Hybrid Search
 ┌──────┴──────┐
 ▼             ▼
BM25        Vector Search
 └──────┬──────┘
        ↓
   Reranking
        ↓
Authorized Chunks
        ↓
      Bedrock
        ↓
     Response
```

## 1. Vector search

CWD needs semantic search.

Example:

```text
User:
"Why was the customer's shipment delayed?"

Document:
"Order fulfillment was impacted by a manufacturing
capacity constraint."
```

The wording is different, but vector search can identify the semantic relationship.

---

## 2. Hybrid search

I wouldn't rely only on vector search.

I can combine:

```text
BM25 keyword search
        +
Vector semantic search
        ↓
     Candidates
        ↓
     Reranking
```

### BM25 is useful for:

* Customer IDs
* Ticket IDs
* Product numbers
* Exact names
* Technical codes

### Vector search is useful for:

* Similar meaning
* Natural-language questions
* Different wording

---

## 3. Metadata and ACL filtering

For CWD, chunks can contain:

```text
document_id
tenant_id
department
classification
allowed_groups
version
created_at
```

Then retrieval can apply filters:

```text
tenant_id = current_user.tenant_id
AND
user has required entitlement
AND
active = true
```

This prevents unauthorized documents from reaching the LLM.

---

## 4. Serverless scalability

With OpenSearch Serverless, AWS manages much of the underlying search infrastructure.

That means I don't have to manually manage:

```text
Cluster sizing
Node provisioning
Node replacement
Shard capacity planning
```

This is useful when CWD traffic changes significantly.

---

## 5. Good fit for enterprise RAG

CWD has potentially large document collections:

```text
PDF
Word
Excel
PowerPoint
Images/OCR
Policies
Technical documents
```

The architecture becomes:

```text
S3 = Source of truth
       ↓
OpenSearch = Searchable/vector representation
       ↓
Bedrock = Generation
```

---

## 6. Separate storage from search

I wouldn't store the original large documents in OpenSearch.

Instead:

```text
S3
 └── Original PDF

OpenSearch
 ├── chunk text
 ├── embedding
 ├── document_id
 ├── metadata
 └── ACL
```

This keeps responsibilities clear.

---

## 7. AWS-native integration

For an AWS-based CWD architecture:

```text
S3
 ↓
EventBridge
 ↓
SQS
 ↓
Ingestion Worker
 ↓
OpenSearch Serverless
 ↓
Bedrock
```

It integrates naturally with the AWS ecosystem and security model.

---

# 🎯 Strong interview answer

> **“I chose OpenSearch Serverless for CWD because it provides the capabilities we need for enterprise RAG: vector search, BM25 keyword search, metadata and ACL filtering, and scalable search without manually managing OpenSearch clusters. We store original documents in S3, generate embeddings during ingestion, and store searchable chunks and metadata in OpenSearch. At query time, we use hybrid keyword and vector retrieval, apply authorization filters, rerank the results, and pass only the relevant authorized context to Bedrock. Serverless also helps us handle variable workloads without managing the underlying search infrastructure ourselves.”**

### Easy memory trick

**OpenSearch = Search + Vector + Filter + Scale**

### Key distinction

**S3 → stores the original documents**
**OpenSearch → retrieves relevant documents/chunks**
**Bedrock → generates the final answer**
