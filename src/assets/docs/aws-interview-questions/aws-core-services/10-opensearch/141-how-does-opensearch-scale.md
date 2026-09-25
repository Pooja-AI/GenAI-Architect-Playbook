# How does OpenSearch scale?

For CWD, **OpenSearch scales horizontally** by distributing indexes and search workload across multiple nodes/compute resources. With **OpenSearch Serverless**, AWS manages much of the underlying capacity and scaling for you.

```text
                 CWD Applications
                       ↓
              OpenSearch Serverless
                 ↙          ↘
          Search/Vector    Indexing
              ↓              ↓
        Distributed      Distributed
        Capacity         Capacity
              ↓              ↓
          More data / more traffic
                  ↓
             Scale out
```

### 1. Data scales horizontally

Documents are divided into **shards**.

```text
Index
 ├── Shard 1
 ├── Shard 2
 ├── Shard 3
 └── Shard 4
```

The data can be distributed across the underlying infrastructure.

As the dataset grows, OpenSearch can distribute the workload rather than keeping everything on one machine.

---

### 2. Search traffic scales

Suppose CWD receives:

```text
100 queries/sec
        ↓
OpenSearch
```

and later:

```text
5,000 queries/sec
        ↓
OpenSearch
```

The search workload can be distributed across the underlying compute capacity.

For CWD, this is especially important because we may have:

* Vector searches
* BM25 searches
* Hybrid searches
* Metadata filtering
* Reranking

---

### 3. Indexing also scales

When many documents arrive:

```text
S3
 ↓
SQS
 ↓
Ingestion Workers
 ↓
OpenSearch
```

Multiple ingestion Workers can process documents concurrently.

SQS provides buffering so a large document-ingestion spike doesn't overwhelm the search layer.

---

### 4. OpenSearch Serverless reduces infrastructure management

With traditional OpenSearch, I may need to think about:

```text
Cluster
Nodes
Instance sizes
Shard allocation
Scaling policies
Capacity planning
```

With **OpenSearch Serverless**, AWS manages much of the underlying infrastructure and automatically adjusts capacity based on workload.

That is useful for CWD because traffic and document ingestion can be unpredictable.

---

### 5. I still need to design for scale

Serverless does **not** mean unlimited capacity.

I would monitor:

```text
Query latency
Indexing latency
Search throughput
4xx / 5xx
Capacity utilization
Throttling
Vector search performance
```

And optimize:

* Number of retrieved documents
* Vector `k`
* Metadata filtering
* Chunk size
* Embedding dimension/model
* Query concurrency
* Index design
* Reranking candidate count

---

# 🎯 Strong interview answer

> **“OpenSearch scales horizontally by distributing data and search workloads across the underlying infrastructure. In CWD, documents are indexed into OpenSearch and vector, BM25, hybrid and metadata-filtered searches are distributed across the search capacity. For OpenSearch Serverless, AWS manages the underlying capacity and automatically scales resources based on workload, reducing the amount of cluster management we need to perform. I would still monitor search latency, indexing throughput, throttling and capacity, and optimize query concurrency, vector K, filtering and index design.”**

### Easy memory trick

**More Data → More Shards → More Capacity → More Throughput**

**Key distinction:**
**OpenSearch = distributes search/indexing workload**
**SQS = buffers ingestion workload**
**ECS = scales application/Worker compute**
