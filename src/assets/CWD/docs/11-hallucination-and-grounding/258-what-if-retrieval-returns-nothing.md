## What if retrieval returns nothing?

If retrieval returns **no relevant documents**, I **do not let the LLM guess**. In CWD, I treat this as a controlled **no-evidence / abstention** scenario.

### CWD flow

```text id="y4m9mx"
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
RAG Search
 ↓
No relevant results
 ↓
Check alternative source
 ↓
 ├── Data available → Continue
 └── No data → Abstain
```

### 1. First, verify it is really a retrieval miss

Before giving up, I can check:

* Query quality
* Customer ID/entity extraction
* Search filters
* ACL filters
* Date/freshness filters
* Vector search
* Keyword/BM25 search

For example:

```text id="l2y1oh"
"Customer C12345 contract"

        ↓

Vector search → 0
BM25 search   → 2
```

The hybrid search can recover relevant information.

### 2. Try an alternative trusted source

For CWD, I don't always depend on RAG.

For example:

```text id="d5b6yv"
Question: "What are C12345's open incidents?"

RAG → No result
        ↓
Incident Worker
        ↓
MCP
        ↓
ServiceNow
```

If ServiceNow has the information, we use it.

### 3. If no trusted evidence exists, abstain

Suppose:

```text id="p3g0bf"
RAG → No results
MCP → No results
```

The system should return something like:

> “I couldn't find sufficient information to answer this question from the available enterprise sources.”

**It should not generate an answer from the LLM's general knowledge.**

### 4. Log the retrieval miss

I would capture:

```text id="b7w1rm"
correlation_id
task_id
worker_id
query
retrieval_method
filters
top_k
result_count
latency
```

This helps identify whether the problem is:

* Missing data
* Bad query
* Incorrect indexing
* ACL filtering
* Embedding problem
* Stale index
* Wrong metadata

### 5. Monitor retrieval-miss rate

A high no-result rate can indicate an ingestion or search-quality problem.

Useful metrics include:

* Retrieval success rate
* No-result rate
* Recall@K
* Precision@K
* Relevance score
* Query latency
* Index freshness

### Interview-ready answer

> **“If retrieval returns nothing, I don't allow the LLM to fill the gap from its own knowledge. First, I verify the query, entity extraction, filters, and search strategy, and I can fall back from vector search to hybrid or keyword search. If appropriate, I use another authoritative source—for example, MCP to ServiceNow for current incident data. If no trusted source has the information, the Worker returns a controlled no-evidence result and the system abstains rather than hallucinating. I also log and monitor retrieval misses because a high miss rate can indicate an ingestion or search-quality problem.”**

### Easy memory

**No retrieval → Retry search → Check authoritative source → If still nothing → Abstain, don't guess.**
