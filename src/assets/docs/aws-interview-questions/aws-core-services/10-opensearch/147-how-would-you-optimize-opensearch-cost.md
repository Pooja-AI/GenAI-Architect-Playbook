# How would you optimize OpenSearch cost?

For CWD, I would optimize cost by **reducing unnecessary data, queries, indexing work, and capacity usage** while maintaining retrieval quality.

```text
Reduce Data
    ↓
Reduce Queries
    ↓
Reduce Indexing
    ↓
Optimize Retrieval
    ↓
Control Capacity
    ↓
Monitor Cost
```

### 1. Reduce unnecessary data

Don't put everything into OpenSearch.

```text
S3 → Original documents
OpenSearch → Searchable chunks + embeddings + metadata
```

Keep large original files in **S3**, not OpenSearch.

---

### 2. Reduce unnecessary queries

Use caching for repeated queries.

```text
Query
 ↓
Semantic Cache
 ├── Hit → Return cached result
 └── Miss → OpenSearch
```

This reduces repeated vector/BM25 searches.

---

### 3. Optimize chunking

Don't create extremely small chunks.

For example:

```text
Bad:
Document → thousands of tiny chunks

Better:
Document → meaningful chunks
```

Fewer unnecessary chunks means less:

* Embedding generation
* Indexing
* Storage
* Search workload

Chunk size should be tuned using retrieval-quality evaluation rather than choosing the smallest possible chunk.

---

### 4. Use incremental indexing

Don't re-index the entire document collection every time a document changes.

```text
New document
    ↓
Detect changed version
    ↓
Re-index only affected chunks
```

Use:

```text
document_id + version_id
```

for idempotency/version tracking.

---

### 5. Reduce retrieval candidates

For example:

```text
Before:
Vector Search → 500 candidates
                    ↓
                 Reranker

After:
Vector Search → 50 candidates
                    ↓
                 Reranker
                    ↓
                  Top 5-10
```

This reduces downstream processing and overall latency/cost.

---

### 6. Filter before expensive retrieval

Use:

```text
tenant_id
department
region
ACL
active
document_type
```

to narrow the search population where appropriate.

For CWD:

```text
User
 ↓
Tenant + ACL filters
 ↓
Vector/BM25 search
 ↓
Top-K
```

This can reduce unnecessary search work.

---

### 7. Choose OpenSearch Serverless vs managed cluster based on workload

For variable CWD workloads, **OpenSearch Serverless** can reduce operational overhead and avoid manually maintaining cluster capacity.

For a predictable, sustained workload, I would also evaluate whether a traditional OpenSearch deployment provides a more economical capacity model.

I would make this decision using **actual workload measurements**, not assume one is always cheaper.

---

### 8. Monitor cost drivers

I would track:

```text
Search requests
Indexing volume
Data size
Vector count
Capacity consumption
Query latency
Throttling
Unused indexes
```

Then identify the biggest cost contributors.

---

# 🎯 Strong interview answer

> **“I would optimize OpenSearch cost at four levels: data, queries, indexing and capacity. I would keep original documents in S3 and only store searchable chunks, embeddings and required metadata in OpenSearch. I would use semantic caching for repeated queries, incremental indexing instead of full re-indexing, efficient chunking, metadata filtering and smaller retrieval candidate sets. For CWD, I would also evaluate Serverless versus traditional OpenSearch based on actual traffic and utilization. Finally, I would monitor capacity consumption, indexing volume, query volume and latency to continuously identify cost hotspots.”**

### Easy memory trick

**Less Data → Less Indexing → Less Searching → Less Capacity → Lower Cost**
