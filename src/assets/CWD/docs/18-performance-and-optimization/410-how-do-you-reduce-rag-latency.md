## How do you reduce RAG latency in CWD?

The goal is to make **retrieval faster without sacrificing retrieval quality**.

In CWD, the flow is:

```text
Worker
  ↓
RAG Query
  ↓
Azure AI Search
  ├─ Keyword/BM25
  ├─ Vector Search
  └─ Semantic Ranking
  ↓
Top relevant chunks
  ↓
LLM
```

### 1. Reduce the number of documents retrieved

Don't retrieve 50–100 chunks if 5–10 relevant chunks are enough.

```text
Query
 ↓
Top-K retrieval
 ↓
Reranking
 ↓
Small relevant context
 ↓
LLM
```

This reduces both **search latency and LLM latency**.

---

### 2. Use metadata filtering

In CWD, if the request contains:

```text
customer_id = C12345
```

use metadata filters before retrieving broadly:

```text
customer_id == "C12345"
AND tenant_id == "T001"
AND user_has_access == true
```

This reduces the search space and improves relevance.

**Important:** authorization filtering must be enforced by the application/search layer—not decided by the LLM.

---

### 3. Use hybrid search efficiently

For enterprise data, I can combine:

```text
BM25 keyword search
        +
Vector similarity
        ↓
Candidate results
        ↓
Semantic reranking
```

But I avoid unnecessary expensive ranking on a huge candidate set.

---

### 4. Optimize chunking

Bad chunking increases retrieval work.

Instead of very large chunks:

```text
10,000-token document
```

create meaningful chunks based on:

* Sections
* Paragraphs
* Tables
* Semantic boundaries

This allows the retriever to find smaller, more relevant pieces.

---

### 5. Precompute embeddings

Don't generate embeddings during every user request.

During ingestion:

```text
Document
 ↓
Chunk
 ↓
Embedding
 ↓
Store in index
```

At query time:

```text
User Query
 ↓
Query embedding
 ↓
Vector search
```

Only the **query embedding** needs to be generated at request time.

---

### 6. Cache repeated queries

For safe, frequently repeated queries:

```text
Worker
 ↓
RAG cache?
 ├── HIT  → return results
 └── MISS → Azure AI Search
```

The cache key should consider things like:

```text
tenant + user/entitlement context + query + index version
```

so one user doesn't receive another user's authorized data.

---

### 7. Scale Azure AI Search appropriately

For Azure AI Search:

* **Replicas** → increase query-serving capacity
* **Partitions** → increase data/index capacity

Don't simply add infrastructure first. Measure whether the bottleneck is actually search.

---

### 8. Keep ingestion separate from online retrieval

Don't allow heavy document ingestion/indexing workloads to unnecessarily interfere with user queries.

```text
                ┌── Online Query → Search
Enterprise Data ┤
                └── Ingestion → Index
```

Use incremental indexing and batch embedding during ingestion.

---

### 9. Parallelize independent retrieval

If a Worker needs independent searches:

```text
Customer information ──┐
                       ├── Aggregate
Incident information ──┤
                       │
Opportunity information┘
```

execute them concurrently where appropriate.

---

### 10. Measure RAG latency

I would track:

* Query embedding latency
* Search latency
* Vector search latency
* BM25 latency
* Semantic reranking latency
* P50/P95/P99 retrieval latency
* Number of retrieved chunks
* Empty-result rate
* Retrieval relevance
* Index freshness
* Cache hit rate

Example:

```text
RAG Trace

Query embedding       100 ms
Azure AI Search       250 ms
Semantic reranking    300 ms
Context preparation   100 ms
                     ───────
Total                 750 ms
```

Now I can identify exactly where the RAG latency is coming from.

### 🎯 Interview-ready answer

> **“I reduce RAG latency by reducing the search space and the amount of context sent downstream. In CWD, I use metadata and entitlement filters, optimized chunking, precomputed embeddings, efficient hybrid retrieval, controlled Top-K and reranking, caching for safe repeated queries, and parallel retrieval where searches are independent. I also separate ingestion from online retrieval and scale Azure AI Search based on the actual bottleneck. Finally, I monitor P95/P99 retrieval latency, search latency, embedding latency, cache hit rate, and retrieval quality to make sure optimization doesn't reduce accuracy.”**

**Easy memory:**

**Filter → Optimize chunks → Precompute embeddings → Top-K → Rerank less → Cache → Parallelize → Scale → Measure.**
