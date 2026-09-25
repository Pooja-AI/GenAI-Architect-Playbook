# How would you monitor OpenSearch?

For CWD, I would monitor **availability, latency, throughput, errors, indexing, capacity, and search quality**.

```text
CWD
 ↓
OpenSearch
 ↓
CloudWatch + OpenSearch Monitoring
 ↓
Metrics + Logs + Alerts
 ↓
Dashboard / SNS / Incident Response
```

## 1. Monitor search performance

Key metrics:

* **P50 / P95 / P99 search latency**
* Queries per second
* Search throughput
* Slow queries
* Vector search latency
* Hybrid search latency

Example:

```text
P95 search latency > 500 ms
        ↓
CloudWatch Alarm
        ↓
Investigate
```

## 2. Monitor indexing

For CWD RAG ingestion:

```text
S3
 ↓
SQS
 ↓
Ingestion Worker
 ↓
OpenSearch
```

Monitor:

* Documents indexed
* Indexing latency
* Indexing failures
* Bulk request failures
* Rejected/throttled indexing requests
* Queue depth

This helps identify whether document ingestion is falling behind.

## 3. Monitor errors

Track:

```text
4xx
5xx
Timeouts
Throttling
Rejected requests
Failed indexing operations
```

For example:

```text
OpenSearch throttling
       ↓
Reduce ingestion concurrency
       ↓
Backoff + retry
       ↓
Process remaining SQS messages
```

## 4. Monitor capacity

For OpenSearch Serverless, monitor the service's capacity/resource utilization and workload behavior rather than treating it like a manually managed cluster.

Look for:

* Capacity consumption
* Sudden traffic increases
* Indexing spikes
* Search spikes
* Throttling
* Sustained high resource usage

## 5. Monitor RAG quality

Infrastructure monitoring alone isn't enough for CWD.

I would also monitor:

```text
Query
 ↓
Retrieved Documents
 ↓
Answer
```

Metrics include:

* Recall@K
* Precision@K
* MRR / NDCG
* Retrieval relevance
* RAGAS context precision/recall
* Faithfulness
* Answer relevance
* Empty/insufficient retrieval rate

For example, if OpenSearch is healthy but retrieves irrelevant chunks, that's a **RAG quality problem**, not an infrastructure problem.

## 6. Monitor security

I would monitor:

* Unauthorized access attempts
* ACL-filter failures
* Tenant-isolation violations
* Authentication/authorization failures
* Configuration/policy changes
* Audit logs

A particularly important CWD check is:

```text
User entitlement
      ↓
ACL filter
      ↓
Retrieved documents
```

Make sure unauthorized documents never reach the LLM.

## 7. Monitoring stack

For AWS CWD:

```text
OpenSearch
    ↓
CloudWatch Metrics / Logs
    ↓
Dashboards + Alarms
    ↓
SNS / Incident Management
```

And for AI-specific tracing:

```text
User Request
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
OpenSearch
 ↓
Bedrock
```

Use **correlation IDs** so I can trace one request across the entire flow.

### 🎯 Strong interview answer

> **“I would monitor OpenSearch at three levels: infrastructure, application, and RAG quality. At the infrastructure level, I monitor search and indexing latency, throughput, errors, throttling and capacity. At the application level, I monitor query failures, ingestion failures and queue backlog. For the RAG layer, I monitor retrieval metrics such as Recall@K, relevance, RAGAS context precision and faithfulness. I would use CloudWatch for AWS monitoring and correlation IDs with distributed tracing or Langfuse for end-to-end CWD observability.”**

### Easy memory trick

**Latency → Throughput → Errors → Capacity → Security → RAG Quality**
