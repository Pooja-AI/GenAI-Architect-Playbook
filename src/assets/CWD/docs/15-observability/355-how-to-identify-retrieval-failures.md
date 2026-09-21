## How do you identify retrieval failures?

In CWD, I identify retrieval failures by monitoring the **RAG retrieval stage separately from the LLM stage**.

The key question is:

> **Did we retrieve the right enterprise information before asking the LLM to generate the answer?**

### CWD flow

```text
Worker
  ↓
User Query
  ↓
Query Processing
  ↓
Azure AI Search
  ├── BM25 / Keyword
  ├── Vector Search
  ├── Semantic Ranking
  └── ACL / Tenant Filtering
  ↓
Retrieved Documents
  ↓
Reranking
  ↓
LLM
```

### What do I monitor?

For every retrieval operation, I capture:

```text
query_id
trace_id
worker
search_type
top_k
documents_returned
retrieval_latency
relevance_score
reranker_score
tenant_filter
ACL_filter
index_version
index_freshness
empty_result
retrieval_error
```

For example:

```json id="z4qk8d"
{
  "query_id": "Q-1001",
  "worker": "CustomerWorker",
  "search_type": "hybrid",
  "top_k": 5,
  "documents_returned": 0,
  "retrieval_latency_ms": 420,
  "empty_result": true,
  "acl_filter": "applied",
  "status": "success"
}
```

Notice that `status = success` doesn't necessarily mean retrieval was successful from a business perspective. The search API can return HTTP 200 while retrieving **zero or irrelevant documents**.

---

## 1. Empty retrieval

Example:

```text id="h8v1ps"
Query: "Customer C12345 latest incidents"

Azure AI Search
       ↓
0 documents
       ↓
❌ Retrieval failure
```

I check:

* Is the document actually indexed?
* Is the index current?
* Is `customer_id` metadata correct?
* Did ACL filtering remove the documents?
* Did tenant filtering remove them?
* Was the query transformed incorrectly?

---

## 2. Low relevance

Sometimes documents are returned, but they're the wrong documents.

```text id="2stn2r"
Query
 ↓
Top 5 documents
 ↓
Relevant documents = 1
Irrelevant documents = 4
```

I monitor retrieval-quality metrics such as:

* **Context precision**
* **Context recall**
* Retrieval relevance
* Ranking/reranker scores
* Recall@K / Precision@K where appropriate

This helps distinguish:

> **“Search returned documents”**

from:

> **“Search returned the right documents.”**

---

## 3. ACL / entitlement filtering failure

This is especially important in CWD.

Suppose Salesforce/SharePoint contains:

```text
Customer C12345
   ├── Public document
   ├── Sales document
   └── Confidential HR document
```

The user should only receive the authorized documents.

So I monitor:

```text id="xk8kq1"
Query
 ↓
ACL filter
 ↓
Tenant filter
 ↓
Authorized documents
```

If the expected document exists but isn't retrieved, I investigate whether **authorization filtering** incorrectly excluded it.

I never solve this by simply removing the ACL filter—that would create a security problem.

---

## 4. Index freshness failure

The source may contain new information, but the RAG index hasn't received it.

```text id="t8q4ps"
SharePoint
   ↓
New document
   ↓
❌ Ingestion failed
   ↓
Azure AI Search
   ↓
Old data
```

I monitor:

```text
source_last_modified
index_last_updated
ingestion_status
embedding_status
index_version
document_version
```

This helps detect **stale retrieval**.

---

## 5. Embedding/indexing failures

During ingestion:

```text id="8qj5fs"
Document
 ↓
Chunk
 ↓
Embedding
 ↓
Index
```

If embedding or indexing fails, the document won't be available during retrieval.

I monitor:

* Documents processed
* Chunks created
* Embedding failures
* Indexing failures
* Quarantined documents
* Duplicate documents
* Indexing latency

---

## 6. Retrieval latency

Retrieval can also fail from a performance perspective.

Example:

```text id="0b4vya"
RAG retrieval P50 = 200 ms
RAG retrieval P95 = 400 ms
RAG retrieval P99 = 5 sec  ← investigate
```

I trace:

```text
Worker
 ↓
Query embedding
 ↓
Hybrid search
 ↓
Semantic ranking
 ↓
Reranking
```

to find the slow component.

---

## What happens when retrieval fails?

I **don't allow the LLM to guess**.

For example:

```text id="6x9f0e"
Retrieval
   ↓
No authoritative evidence
   ↓
Retry / alternate approved retrieval
   ↓
Still no evidence?
   ↓
Abstain
```

The Worker can return:

```json id="6r1l9p"
{
  "answerable": false,
  "confidence": "insufficient_evidence",
  "evidence": [],
  "reason": "No authoritative customer incident information was retrieved."
}
```

---

## Interview-ready answer

> **“I identify retrieval failures by tracing and monitoring the RAG stage independently from the LLM. I track empty-result rate, retrieval relevance, context precision and recall, top-K results, retrieval latency, ACL and tenant filtering, index freshness, embedding and indexing failures. For example, if Customer Worker returns no incident information, I check whether the documents are indexed, whether the customer metadata is correct, whether ACL filtering excluded them, and whether the index is stale. If authoritative evidence still cannot be retrieved, I don't let the LLM guess—I return an insufficient-evidence response.”**

### Strong interview line

> **“A successful search API response doesn't mean successful retrieval. I need to verify that the right evidence was retrieved, was authorized, was fresh, and was relevant enough for the LLM to answer.”**

**Easy memory:**
**Empty? → Relevant? → Authorized? → Fresh? → Indexed? → Fast enough? → If not, don't guess.**
