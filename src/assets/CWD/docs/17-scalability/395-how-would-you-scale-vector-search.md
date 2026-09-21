## How would you scale vector search?

In CWD, I would scale vector search by **partitioning/sharding the index, adding replicas, optimizing retrieval, and controlling query load**.

For your Azure CWD architecture, think of **Azure AI Search** as the main vector/hybrid search layer.

```text id="x6n4qa"
                    Workers
                       ↓
                  RAG Service
                       ↓
               Azure AI Search
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
     Replica 1      Replica 2      Replica 3
        ↓              ↓              ↓
      Index          Index          Index
```

### 1. Add replicas for query throughput

If search traffic increases:

```text id="v4d8qz"
1 Search replica
       ↓
3 Search replicas
       ↓
10 Search replicas
```

Replicas primarily help handle **more concurrent search queries** and improve availability.

For example:

```text
100 concurrent searches
        ↓
Search replicas
        ↓
Queries distributed across replicas
```

---

### 2. Add partitions/shards for large data

Replicas help with **query capacity**; partitions help with **data/index capacity**.

```text id="9n2x6c"
Large Enterprise Corpus
          ↓
     Partitioning
     /    |     \
    P1    P2     P3
```

For example:

```text
P1 → Sales documents
P2 → Manufacturing documents
P3 → IT documents
```

The exact partitioning strategy depends on the search platform and workload.

### Key interview distinction

> **“Replicas primarily scale query throughput; partitions scale data/index capacity.”**

---

## 3. Use hybrid search instead of vector-only

For enterprise CWD search, I would typically use:

```text id="2x7n8m"
User Query
    ↓
 ┌──────────────┐
 │              │
Vector Search  BM25
 │              │
 └──────┬───────┘
        ↓
 Semantic / Reranking
        ↓
 Top-K results
        ↓
 LLM
```

Hybrid search can improve retrieval quality for enterprise terms such as:

* Customer IDs
* Ticket numbers
* Product names
* Part numbers
* Error codes

These can be difficult for pure semantic similarity.

---

## 4. Control Top-K

Don't retrieve hundreds of documents unnecessarily.

Instead:

```text id="q3k8mh"
Query
 ↓
Retrieve top 20
 ↓
Filter/rerank
 ↓
Top 5–10
 ↓
LLM
```

This reduces:

* Search latency
* Network traffic
* Token consumption
* LLM latency
* Cost

But I would determine the appropriate K through retrieval evaluation rather than choosing a number arbitrarily.

---

## 5. Filter before expensive retrieval where appropriate

CWD has enterprise metadata such as:

```text id="d7q1kx"
tenant_id
customer_id
document_type
department
classification
ACL
source
last_modified
```

For example:

```text id="0jv3pa"
Query
 ↓
ACL / tenant filter
 ↓
Vector + keyword retrieval
 ↓
Reranking
 ↓
Top-K
```

This reduces the search space and, more importantly, enforces **data isolation**.

The LLM should never be responsible for deciding whether the user is authorized to see a document.

---

## 6. Scale ingestion separately from query serving

This is very important.

```text id="8m0h2e"
                Enterprise Sources
                       ↓
                  Ingestion
                       ↓
                Chunk + Embed
                       ↓
                  Indexing
                       ↓
              Vector Search Index
                       ↑
                       │
                  Query traffic
                       ↑
                    Workers
```

I don't want a large ingestion job to starve production search queries.

So I separate:

* **Indexing/ingestion workload**
* **Online query workload**

and control indexing throughput.

---

## 7. Optimize embeddings

At large scale, embedding generation itself can become a bottleneck.

```text id="1k2j8f"
Documents
   ↓
Chunking
   ↓
Embedding service
   ↓
Vectors
   ↓
Index
```

I would use:

* Batch embedding
* Incremental indexing
* Change detection
* Content hashes
* Embedding caching
* Versioned embedding models

For example:

```text id="w8g3sn"
Document unchanged
      ↓
Don't re-embed
```

Only changed documents need new embeddings.

---

## 8. Use incremental indexing

Instead of rebuilding the entire index:

```text id="8c4m2p"
10 million documents
      ↓
Full re-embedding ❌
```

track:

```text id="r6s7vx"
document_id
version
last_modified
content_hash
embedding_version
```

Then:

```text id="5a8z3n"
Changed documents
      ↓
Chunk
      ↓
Embed
      ↓
Update index
```

This reduces indexing cost and operational load.

---

## 9. Cache repeated queries carefully

If many users ask the same common query:

```text id="5j0qka"
Query
 ↓
Cache
 ↓
Cached result
```

But in CWD, caching must include **authorization context**.

For example, don't return a cached result generated for User A to User B if their permissions differ.

A safer cache key can incorporate relevant authorization/tenant context:

```text id="0e2r8w"
hash(
  normalized_query +
  tenant_id +
  entitlement_scope +
  index_version
)
```

And cache only approved result metadata/content.

---

## 10. Protect the search service from traffic spikes

Use:

* Rate limiting
* Concurrency limits
* Request timeouts
* Queueing for non-interactive indexing
* Circuit breakers where appropriate
* Autoscaling
* Backpressure

For example:

```text id="5s1m4q"
1000 Workers
     ↓
Search concurrency limit
     ↓
Azure AI Search
```

This prevents a sudden Agentic AI workload from overwhelming the search layer.

---

## 11. Monitor the actual bottleneck

I would monitor:

### Query performance

* Search P50/P95/P99 latency
* Queries/sec
* Concurrent queries
* Timeout rate
* Error rate

### Retrieval quality

* Recall
* Precision
* Context precision
* Context recall
* Empty-result rate
* Reranking quality

### Infrastructure

* Replica utilization
* Partition utilization
* Index size
* Indexing throughput
* Indexing failures
* Index freshness

### GenAI impact

* Retrieved tokens
* Context size
* Groundedness
* Answer relevance
* Hallucination rate

---

## Example: finding the bottleneck

Suppose:

```text id="r9v3zc"
CWD request                    8 sec
 ↓
RAG Worker                     6 sec
 ↓
Azure AI Search                5 sec
 ↓
Vector retrieval               4 sec  ←
Reranking                      1 sec
```

I investigate Search.

But suppose instead:

```text id="p4x1jd"
CWD request                    8 sec
 ↓
RAG Worker                     6 sec
 ↓
Azure AI Search                0.8 sec
 ↓
LLM generation                 5 sec  ←
```

Then adding Search replicas won't solve the problem.

**Trace first, scale second.**

---

## Azure CWD scaling model

```text id="q2h8vm"
                 CWD Workers
                      ↓
                 RAG Service
                      ↓
             Azure AI Search
                      ↓
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
   Replica 1      Replica 2      Replica 3
       │              │              │
       └──────────────┼──────────────┘
                      ↓
              Partitioned Index
              /       |       \
             P1       P2       P3
```

For a very large enterprise corpus, I would evaluate partitioning, replicas, index design, filtering strategy, vector configuration, and workload patterns together rather than simply adding replicas.

---

## Interview-ready answer

> **“I would scale vector search at both the query and data layers. For Azure AI Search, I would use replicas to increase concurrent query throughput and partitions to handle larger indexes and indexing capacity. I would use hybrid vector plus BM25 search, metadata and ACL filtering, controlled Top-K, and reranking to keep retrieval efficient and relevant. I would separate online query traffic from ingestion, use incremental indexing and embedding caching, and apply rate limits and concurrency controls. Finally, I would monitor P95/P99 search latency, query throughput, index size, freshness, and retrieval quality to determine whether the bottleneck is the search service, indexing pipeline, or downstream LLM.”**

### Strong interview line

> **“For vector search, I scale both dimensions: replicas for query throughput and partitions for data/index capacity—but I optimize retrieval before simply adding infrastructure.”**

### Easy memory

**Replicas → Query throughput | Partitions → Data capacity | Hybrid search → Quality | Top-K → Efficiency | Incremental indexing → Scale | Filters → Security | Trace → Optimize.**
