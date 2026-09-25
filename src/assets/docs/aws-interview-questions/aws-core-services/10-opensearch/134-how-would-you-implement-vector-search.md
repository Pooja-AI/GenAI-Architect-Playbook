# How would you implement vector search in CWD?

I would implement vector search as part of the **RAG pipeline** using embeddings and OpenSearch Serverless.

```text id="vec01"
Document
   ↓
S3
   ↓
Extract Text
   ↓
Chunk
   ↓
Embedding Model
   ↓
Vector Embeddings
   ↓
OpenSearch Serverless
   ↓
Vector Index
```

At query time:

```text id="vec02"
User Query
    ↓
Query Embedding
    ↓
OpenSearch Vector Search
    ↓
Top-K Chunks
    ↓
Reranking
    ↓
Bedrock
    ↓
Answer
```

## 1. Chunk the documents

Suppose the document contains:

```text id="vec03"
Customer shipment policy...
Warranty policy...
Return policy...
```

I split it into meaningful chunks.

Example starting point:

```text id="vec04"
500–700 tokens
10–15% overlap
```

I would tune these values based on retrieval evaluation.

---

## 2. Generate embeddings

For every chunk, generate an embedding.

```text id="vec05"
"Warranty period is two years..."
              ↓
        Embedding Model
              ↓
[0.12, -0.43, 0.87, ...]
```

The embedding represents the **semantic meaning** of the text.

---

## 3. Store vectors in OpenSearch

I would store something like:

```text id="vec06"
{
  "chunk_id": "C123",
  "document_id": "DOC45",
  "text": "Warranty period is two years...",
  "embedding": [0.12, -0.43, 0.87, ...],
  "tenant_id": "ON",
  "department": "Sales",
  "active": true
}
```

The vector is indexed for efficient similarity search.

---

## 4. Convert the user's query to a vector

User asks:

```text id="vec07"
"What is the warranty duration?"
```

Generate an embedding for the query using the **same embedding model used for the documents**.

```text id="vec08"
User Query
    ↓
Embedding Model
    ↓
Query Vector
```

---

## 5. Perform similarity search

OpenSearch compares the query vector against document vectors.

Conceptually:

```text id="vec09"
Query Vector
     ↓
Compare against document vectors
     ↓
Similarity score
     ↓
Top-K results
```

For example:

```text id="vec10"
Chunk A → 0.94
Chunk B → 0.89
Chunk C → 0.82
Chunk D → 0.61
```

Return the highest-scoring relevant chunks.

---

## 6. Apply metadata/ACL filters

Before giving results to the LLM, apply authorization filters.

```text id="vec11"
Vector Search
      ↓
ACL Filter
      ↓
Tenant Filter
      ↓
Active Version Filter
      ↓
Authorized Results
```

This is important for CWD because **semantic similarity does not mean the user is authorized to see the document**.

---

## 7. Use hybrid search

I would usually combine vector search with keyword search.

```text id="vec12"
                 Query
                   ↓
          ┌────────┴────────┐
          ↓                 ↓
    Vector Search       BM25 Search
          ↓                 ↓
     Semantic            Exact terms
          └────────┬────────┘
                   ↓
              Rank Fusion
                   ↓
               Reranker
                   ↓
                Top-K
```

For example:

* `"What caused shipment delays?"` → vector search is useful.
* `"Ticket INC12345"` → BM25/exact matching is useful.

---

## 8. Send context to Bedrock

Finally:

```text id="vec13"
Top relevant chunks
        ↓
Context + User Question
        ↓
      Bedrock
        ↓
Grounded Answer
```

I would also include source/document metadata so the answer can provide citations.

---

# 🎯 Strong interview answer

> **“I would implement vector search as part of the CWD RAG pipeline. During ingestion, I extract documents from S3, split them into meaningful chunks, generate embeddings using an embedding model, and store the vectors along with document metadata and ACL information in OpenSearch Serverless. At query time, I generate an embedding for the user query and perform similarity search to retrieve the top relevant chunks. I then apply tenant and authorization filters, combine vector search with BM25 for hybrid retrieval, rerank the candidates, and send the authorized context to Bedrock for generation.”**

### Easy memory trick

**Chunk → Embed → Index → Query → Similarity → Filter → Rerank → Generate**

### Key distinction

**Embedding model:** converts text → vectors
**OpenSearch:** searches vectors
**Reranker:** improves ordering of retrieved candidates
**Bedrock:** generates the final answer
