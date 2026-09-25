# How would you troubleshoot slow retrieval?

I would **first measure where the latency is coming from**, instead of immediately changing OpenSearch settings.

```text
User Query
   ↓
Embedding Generation
   ↓
OpenSearch Retrieval
   ↓
Reranking
   ↓
Context Preparation
   ↓
LLM
```

I would measure each step separately.

### 1. Check P50/P95/P99 latency

Example:

```text
Embedding      → 150 ms
OpenSearch     → 900 ms  ← Problem
Reranker       → 200 ms
LLM            → 2 sec
```

Now I know OpenSearch retrieval is the bottleneck.

---

### 2. Check OpenSearch itself

I would investigate:

* Search latency
* Query throughput
* Throttling/rejected requests
* Capacity utilization
* Slow queries
* Index/shard design
* Vector search performance
* Concurrent search requests

---

### 3. Reduce the search workload

For example, if I'm retrieving too many candidates:

```text
Before:
Vector search → Top 1000
              ↓
          Reranker

After:
Vector search → Top 50
              ↓
          Reranker → Top 5-10
```

This reduces downstream processing.

---

### 4. Apply metadata filters early

Instead of searching the entire enterprise index:

```text
All Documents
      ↓
Vector Search
      ↓
ACL Filter
```

I prefer:

```text
Tenant / ACL / Department / Active
              ↓
        Vector Search
              ↓
          Top-K
```

This reduces the candidate search space where supported by the query/index design.

---

### 5. Check embedding latency

Sometimes OpenSearch isn't actually the problem.

```text
User Query
   ↓
Bedrock Embedding
   ↓
OpenSearch
```

If embedding generation takes 1 second, optimizing OpenSearch won't solve the overall problem.

For repeated queries, a semantic cache can also avoid generating a new embedding/search when a valid cached result exists.

---

### 6. Check reranking

A common pattern is:

```text
OpenSearch → 100 candidates
                  ↓
              Reranker
                  ↓
                Top 5
```

If reranking is slow, reduce the candidate count or optimize the reranking strategy.

---

### 7. Check network latency

I would verify:

```text
ECS/Fargate
     ↓
VPC / Network
     ↓
OpenSearch
```

Keep services in the appropriate AWS region/network path and avoid unnecessary network hops.

---

### 8. Compare before and after

I would establish a baseline:

```text
P50 = 200 ms
P95 = 800 ms
P99 = 1.5 sec
```

After optimization:

```text
P50 = 120 ms
P95 = 400 ms
P99 = 800 ms
```

Then validate that **retrieval quality did not decrease**.

### 🎯 Strong interview answer

> **“I would troubleshoot slow retrieval by tracing the complete retrieval path and measuring embedding, OpenSearch, reranking and network latency separately. If OpenSearch is the bottleneck, I would check P95/P99 latency, throttling, capacity, query complexity and index design. Then I would optimize candidate count, apply tenant and ACL filters efficiently, and reduce unnecessary reranking. I would also check whether embedding generation or network latency is actually the bottleneck. Finally, I would compare P50/P95/P99 before and after and verify that retrieval quality such as Recall@K has not degraded.”**

### Easy memory trick

**Measure → Identify bottleneck → Optimize → Validate quality**
