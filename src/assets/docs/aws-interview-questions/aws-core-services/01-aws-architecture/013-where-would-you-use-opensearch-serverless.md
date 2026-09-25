# Where would you use OpenSearch Serverless?

## Short answer

I would use **Amazon OpenSearch Serverless** in the AWS version of CWD as the **search and vector retrieval layer for RAG**.

It allows CWD to perform **keyword search, vector search, and hybrid search** over enterprise documents without managing OpenSearch clusters manually.

## Key points

* Primary search layer for CWD RAG.
* Vector/semantic search.
* Keyword search using BM25.
* Hybrid search.
* Metadata filtering.
* Scales without managing clusters.
* Good fit for enterprise document retrieval.
* Integrates with S3 and AWS data pipelines.
* Useful for RAG applications.
* Supports high-volume search workloads.

### CWD flow

```text id="w7m3kp"
Enterprise Documents
       ↓
      S3
       ↓
Ingestion Pipeline
       ↓
Extract → Clean → Chunk
       ↓
Generate Embeddings
       ↓
OpenSearch Serverless
       ↓
 ┌─────────────────────────┐
 │ Keyword / BM25 Search   │
 │ Vector Search           │
 │ Metadata Filtering      │
 │ Hybrid Search           │
 └─────────────────────────┘
       ↓
    Reranking
       ↓
 Top relevant chunks
       ↓
     Worker
       ↓
   Bedrock LLM
       ↓
 Grounded Response
```

## Where would I use it?

### 1. Vector search for RAG

Documents are converted into embeddings:

```text id="k2r8vq"
Document
   ↓
Chunk
   ↓
Embedding
   ↓
OpenSearch Vector Index
```

When the user asks a question:

```text id="s4n7mc"
User Query
    ↓
Query Embedding
    ↓
Vector Search
    ↓
Similar chunks
```

This finds information based on **meaning**, not just exact words.

---

### 2. BM25 keyword search

Vector search isn't always enough.

Suppose the user asks:

> "What happened to incident INC12345?"

The exact incident number is important.

BM25 can perform keyword-based matching:

```text id="r6p2xz"
INC12345
   ↓
BM25
   ↓
Documents containing INC12345
```

So OpenSearch can support both:

**Vector = semantic meaning**

**BM25 = exact keyword relevance**

---

### 3. Hybrid search

For CWD, I would commonly combine both:

```text id="f8m3yn"
             Query
               ↓
        ┌──────┴──────┐
        ↓             ↓
     BM25          Vector
        ↓             ↓
   Keyword       Semantic
   results        results
        └──────┬──────┘
               ↓
         Combine / Rank
               ↓
          Top results
```

This is useful because enterprise queries often contain both natural language and exact identifiers.

---

### 4. Metadata filtering

Each chunk can have metadata:

```json id="n5x8qc"
{
  "document_id": "DOC123",
  "department": "Engineering",
  "product": "A100",
  "year": 2026,
  "allowed_groups": ["Engineering"]
}
```

The Worker can apply filters before constructing the LLM context.

```text id="p7k4mv"
User Identity
     ↓
ACL / Metadata Filter
     ↓
OpenSearch
     ↓
Authorized results
```

---

### 5. RAG retrieval

A typical CWD retrieval pipeline:

```text id="y3q9ws"
User Question
      ↓
Query Understanding
      ↓
ACL / Metadata Filtering
      ↓
BM25 + Vector Search
      ↓
Top 30–50 candidates
      ↓
Reranking
      ↓
Top 5–10
      ↓
Context Builder
      ↓
Bedrock
```

This keeps irrelevant information out of the LLM prompt.

---

### 6. Serverless operations

The **Serverless** part is important.

Instead of managing:

```text id="m8v2rx"
Clusters
Nodes
Capacity
Scaling
Patching
```

OpenSearch Serverless provides a managed/serverless experience where AWS handles much of the underlying infrastructure management.

That lets the team focus more on the CWD search and RAG application.

---

## Example: Customer Briefing

Suppose the user asks:

> "Give me a summary of the customer's previous product issues."

```text id="q6n3kp"
User
 ↓
Coordinator
 ↓
IT / Service Delegator
 ↓
Service Worker
 ↓
OpenSearch Serverless
 ↓
Hybrid Search
 ↓
Incident / Knowledge Documents
 ↓
Reranking
 ↓
Relevant context
 ↓
Bedrock
 ↓
Customer briefing
```

For **current open incidents**, however, I would query ServiceNow directly through **MCP/API**, rather than depending on potentially stale indexed data.

---

## OpenSearch vs DynamoDB vs Redis

| Service                   | CWD responsibility                 |
| ------------------------- | ---------------------------------- |
| **OpenSearch Serverless** | Search + vector/RAG                |
| **DynamoDB**              | Durable application/workflow state |
| **Redis**                 | Cache + fast temporary state       |
| **S3**                    | Documents/object storage           |
| **Bedrock**               | Foundation models                  |

Think:

```text id="v9r4mc"
S3        → Store
OpenSearch → Search
Redis     → Cache
DynamoDB  → State
Bedrock   → Generate
```

---

## 🎯 Strong interview answer

> **“I would use Amazon OpenSearch Serverless as the primary search and vector retrieval layer for the AWS version of CWD. During ingestion, we extract documents from sources such as S3, chunk them, generate embeddings, and index the chunks and metadata in OpenSearch. At query time, Workers can perform vector search, BM25 keyword search, or hybrid search, apply metadata and ACL filters, and then rerank the results before sending the most relevant context to Bedrock. We chose the serverless option to reduce infrastructure-management overhead while still supporting the search requirements of our RAG architecture.”**

## Easy memory trick

**OpenSearch = Search + Vector + Hybrid + RAG**

```text id="d3k7vp"
BM25      → Exact words
Vector    → Meaning
Hybrid    → Both
Metadata  → Filter
Reranking → Best results first
```

## Key distinction

> **“OpenSearch Serverless retrieves the evidence; Bedrock generates the answer.”**

And for CWD:

> **“OpenSearch is for searchable knowledge; MCP is for current transactional data such as live Salesforce or ServiceNow information.”**
