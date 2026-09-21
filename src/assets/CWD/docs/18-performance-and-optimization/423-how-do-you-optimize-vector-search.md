## How do you optimize vector search in CWD?

The main principle is:

> **I optimize vector search by reducing the search space, improving retrieval quality, controlling Top-K, and scaling the index based on the actual bottleneck.**

### 1. Apply metadata filters first

In CWD, I don't search the entire enterprise index.

For example:

```text
Query
 ↓
tenant_id = T001
customer_id = C12345
document_type = incident
ACL = user's authorized groups
 ↓
Vector search
```

This reduces the number of candidates and also prevents irrelevant or unauthorized documents from being considered.

---

### 2. Use hybrid search

I don't rely only on vector similarity.

```text id="vsearch1"
User Query
     ↓
 ┌──────────────┐
 │              │
Vector Search  BM25
 │              │
 └──────┬───────┘
        ↓
     Combine
        ↓
    Reranking
        ↓
    Top results
```

**Vector search** handles semantic meaning.

**BM25** is useful for exact terms such as:

```text
C12345
INC0012345
OSD-4521
error code
part number
```

For CWD enterprise search, hybrid retrieval is particularly useful because users can ask both conceptual questions and exact-ID questions.

---

### 3. Optimize Top-K

Don't retrieve 50 documents and send all 50 to the LLM.

For example:

```text
Vector/BM25 retrieval
        ↓
Top 10–20 candidates
        ↓
Reranker
        ↓
Top 3–5
        ↓
LLM
```

The exact values should come from evaluation.

Too small:

```text
Top-K = 1
```

may miss relevant information.

Too large:

```text
Top-K = 50
```

increases latency, noise, and LLM token consumption.

---

### 4. Use reranking

Initial vector search gives candidate documents.

Then I rerank them using semantic relevance:

```text id="rrank1"
100K documents
      ↓
Vector + BM25
      ↓
20 candidates
      ↓
Reranker
      ↓
Top 5 relevant chunks
```

This improves precision without requiring the expensive reranking step over the entire corpus.

---

### 5. Optimize chunking

Search quality depends heavily on how documents were chunked.

Bad:

```text
Entire 100-page document → one vector
```

Better:

```text
Document
 ↓
Meaningful sections
 ↓
Chunks
 ↓
Embeddings
```

I evaluate chunk size and overlap based on document type and retrieval results.

---

### 6. Remove duplicates

Duplicate documents or chunks can consume search capacity and crowd out useful results.

During ingestion:

```text
Document
 ↓
Content hash
 ↓
Already indexed?
 ├── Yes → skip
 └── No → embed + index
```

For changed documents, I update only the affected chunks.

---

### 7. Scale Azure AI Search correctly

For CWD, if using **Azure AI Search**, I think about two dimensions:

```text
Replicas
   → query throughput / availability

Partitions
   → index/data capacity
```

So if query traffic increases, I investigate replicas.

If the index becomes too large, I investigate partitions.

I don't simply add infrastructure without identifying the bottleneck.

---

### 8. Separate ingestion from online search

I don't want heavy ingestion activity to unnecessarily interfere with user queries.

```text id="ingsearch"
Enterprise Sources
       ↓
Ingestion Pipeline
       ↓
Embedding
       ↓
Index
       ↑
       │
Online Query
       ↓
Azure AI Search
       ↓
CWD Worker
```

I monitor indexing throughput and freshness separately from online query latency.

---

### 9. Cache repeated searches

For repeated safe queries, I can use semantic caching:

```text id="scache1"
Query
 ↓
Semantic Cache
 ↓
HIT → cached retrieval
MISS
 ↓
Vector Search
 ↓
Store result
```

The cache key/context must account for **tenant, authorization scope, filters, and index version**.

I never allow caching to bypass authorization.

---

### 10. Optimize query vectors

The query embedding itself can add latency.

I monitor:

```text
Query embedding latency
Search latency
Reranking latency
Total retrieval latency
```

If embedding generation is expensive, I investigate appropriate embedding models, batching where applicable, and safe caching of repeated query embeddings.

---

### 11. Monitor retrieval quality—not just latency

This is critical in an AI Architect interview.

I track:

```text
Recall@K
Precision@K
MRR
NDCG
Context precision
Context recall
Empty-result rate
Search P50/P95/P99
Index freshness
```

For example:

```text id="evalsearch"
Search optimization
      ↓
Latency improved
      ↓
But Recall@5 decreased
      ↓
Optimization rejected
```

The goal is **quality + performance**, not performance alone.

---

## CWD example

User asks:

> **“Show me previous ServiceNow incidents for customer C12345 related to overheating.”**

I would do:

```text id="cwdsearch"
User Query
     ↓
Incident Worker
     ↓
Generate query embedding
     ↓
Tenant + customer + ACL filters
     ↓
Hybrid Search
 ┌───────────────┐
 │ Vector + BM25 │
 └───────┬───────┘
         ↓
   Top candidates
         ↓
      Rerank
         ↓
   Top 3–5 chunks
         ↓
      LLM
         ↓
Validated response
```

### 🎯 Interview-ready answer

> **“In CWD, I optimize vector search by first reducing the search space with tenant, customer, metadata, and ACL filters. I use hybrid vector plus BM25 search because enterprise queries often contain both semantic questions and exact identifiers. I tune Top-K based on retrieval evaluation, use reranking on a smaller candidate set, optimize chunking and deduplication, and use incremental indexing for changed documents. With Azure AI Search, I scale replicas for query throughput and partitions for index capacity. I also use semantic caching for safe repeated queries and monitor both retrieval quality—such as Recall@K, Precision@K, MRR and NDCG—and P95/P99 search latency.”**

### Easy memory

**Filter → Hybrid → Top-K → Rerank → Chunk → Deduplicate → Scale → Cache → Measure quality + latency**

