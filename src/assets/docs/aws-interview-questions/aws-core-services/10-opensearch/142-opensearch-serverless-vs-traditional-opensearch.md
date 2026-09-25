# OpenSearch Serverless vs Traditional OpenSearch

The main difference is **who manages the infrastructure and how you control capacity**.

| Area              | OpenSearch Serverless                             | Traditional OpenSearch                     |
| ----------------- | ------------------------------------------------- | ------------------------------------------ |
| Infrastructure    | AWS managed                                       | You manage/configure cluster               |
| Scaling           | More automatic                                    | You plan/configure scaling                 |
| Nodes             | No direct node management                         | Choose instance types/count                |
| Capacity planning | Less operational work                             | More responsibility                        |
| Shards            | Still relevant logically                          | Directly manage shard/index strategy       |
| Control           | Lower infrastructure control                      | More infrastructure control                |
| Operations        | Simpler                                           | More operational responsibility            |
| Cost model        | Capacity-based serverless model                   | Instance/storage/data-transfer based       |
| Best for          | Variable workloads, less ops                      | Predictable/highly customized workloads    |
| CWD fit           | **Good fit for RAG/search with variable traffic** | Good when we need detailed cluster control |

### Traditional OpenSearch

You typically manage a cluster:

```text
OpenSearch Cluster
 ├── Data Nodes
 ├── Dedicated Master Nodes
 ├── Shards
 ├── Replicas
 └── Storage
```

You need to think about:

* Instance sizing
* Node count
* Scaling
* Shard allocation
* Replicas
* Cluster health
* Capacity planning
* Upgrades/operations

### OpenSearch Serverless

Conceptually:

```text
CWD
 ↓
OpenSearch Serverless Collection
 ↓
AWS-managed search capacity
 ↓
Vector / BM25 / Hybrid Search
```

AWS handles much of the underlying infrastructure management and capacity scaling.

### Why I would choose Serverless for CWD

CWD has potentially variable:

```text
User traffic
+
Document ingestion
+
Vector searches
+
Hybrid searches
```

So I don't want the team spending significant operational effort managing search clusters.

I'd choose **OpenSearch Serverless when operational simplicity and elastic capacity are more important than deep cluster-level control**.

### When traditional OpenSearch makes sense

I would consider traditional OpenSearch when I need:

* Detailed cluster configuration
* Specific instance/storage choices
* Fine-grained shard/node management
* Predictable sustained workloads where capacity can be carefully planned
* Specialized operational requirements

### 🎯 Strong interview answer

> **“The key difference is infrastructure control versus operational simplicity. With traditional OpenSearch, we manage the cluster, nodes, instance sizing, shard allocation and scaling strategy. With OpenSearch Serverless, AWS manages much of the underlying search infrastructure and automatically adjusts capacity based on workload. For CWD, I would choose Serverless when we have variable RAG traffic and want to minimize cluster operations. If we had strong requirements for cluster-level control or specialized capacity planning, I would evaluate traditional OpenSearch.”**

**Memory trick:**
**Serverless = Less Infrastructure Management**
**Traditional = More Control**
