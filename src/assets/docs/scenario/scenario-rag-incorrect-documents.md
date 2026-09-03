## Strong Interview Answer

> **“I would troubleshoot RAG retrieval as a pipeline rather than immediately changing the LLM. I would trace one incorrect query end-to-end: query transformation, embedding, metadata filtering, vector search, hybrid search, reranking, and finally the context passed to the LLM. My goal is to determine whether the problem is in retrieval, ranking, indexing, or generation.”**

### 1. First, reproduce the failure

Take a real query:

```text
User:
"What is the company's parental leave policy?"
```

Expected:

```text
HR → Leave Policy → Parental Leave
```

Actual:

```text
HR → Vacation Policy
```

I would capture the complete retrieval trace.

```text
Query
 ↓
Query Rewrite
 ↓
Embedding
 ↓
Metadata Filter
 ↓
Vector Search
 ↓
Top-K Documents
 ↓
Reranker
 ↓
Final Context
 ↓
LLM
```

---

## 2. Check whether the query itself is being changed

Sometimes the retrieval issue is actually a **query-rewriting problem**.

For example:

```text
Original:
"What is parental leave?"

Rewritten:
"What is vacation leave?"
```

Now the vector search is behaving correctly—but against the wrong query.

So I would log:

```text
original_query
rewritten_query
search_query
```

and compare them.

---

## 3. Check chunking

Poor chunking can produce poor retrieval.

For example, a document might contain:

```text
Parental Leave Policy
Eligibility...
Duration...
Employee requirements...
Exceptions...
```

If the chunking separates the heading from the actual content:

```text
Chunk 1:
"Parental Leave Policy"

Chunk 2:
"Employees are eligible for..."
```

the embedding may lose important semantic context.

I would evaluate:

* chunk size
* overlap
* semantic vs fixed-size chunking
* heading preservation
* document boundaries
* tables
* PDFs
* repeated headers/footers

I often prefer **semantic/document-aware chunking** for enterprise documents.

---

# 4. Check embeddings

The embedding model determines how semantic similarity is represented.

I would verify:

```text
Query embedding
      ↕
Document embedding
```

Questions I'd investigate:

* Is the embedding model appropriate for the domain?
* Are query and document embeddings generated using the same model?
* Are embeddings stale?
* Was the embedding model changed without re-indexing?
* Are domain-specific terms represented correctly?

For example:

```text
"401(k)"
"retirement plan"
"pension"
```

may need strong semantic relationships in an HR/enterprise knowledge base.

---

# 5. Check metadata filtering

This is one of the **most important enterprise RAG checks**.

Suppose documents contain:

```json
{
  "department": "HR",
  "document_type": "policy",
  "region": "US",
  "version": "2026"
}
```

The query might require:

```text
department = HR
region = US
version = latest
```

If metadata filtering is incorrect, the vector search may retrieve:

```text
2022 policy
India policy
Old employee handbook
```

instead of the current US policy.

So I would validate:

```text
Metadata extraction
        ↓
Metadata storage
        ↓
Filter construction
        ↓
Filter execution
```

---

# 6. Check Top-K

Maybe the correct document exists, but we're retrieving too few documents.

Example:

```text
Top-K = 3
```

Correct document is ranked #7.

I would temporarily increase:

```text
Top-K = 10 or 20
```

and see whether the correct document appears.

If it appears at #7, the problem is likely **ranking/retrieval configuration**, not missing data.

But I wouldn't blindly increase K in production because too much context increases:

* latency
* token usage
* noise
* hallucination risk

---

# 7. Add a Reranker

Vector similarity isn't always enough.

Architecture:

```text
Query
  ↓
Vector Search
  ↓
Top 20
  ↓
Reranker
  ↓
Top 5
  ↓
LLM
```

The vector database performs fast candidate retrieval.

The reranker performs a more precise query-document relevance assessment.

For enterprise RAG, this two-stage approach is often much better than:

```text
Vector Search → LLM
```

---

# 8. Consider Hybrid Search

Pure vector search can struggle with exact enterprise terminology.

For example:

```text
"POL-4587"
"Azure ML"
"401(k)"
"Employee ID 73921"
```

These may be better handled using keyword/BM25 search.

So I might use:

```text
                 Query
                   |
          ┌────────┴────────┐
          ↓                 ↓
    Vector Search       Keyword Search
          ↓                 ↓
       Semantic           Exact
       relevance          matching
          └────────┬────────┘
                   ↓
              Fusion/Rerank
                   ↓
                Top-K
```

This is **hybrid retrieval**.

---

# 9. Validate the Index

Sometimes the retrieval system isn't the problem—the index is.

I would check:

```text
Source documents
      ↓
Parsing
      ↓
Chunking
      ↓
Metadata
      ↓
Embedding
      ↓
Vector DB
```

Potential problems:

* documents missing
* duplicate documents
* stale documents
* failed ingestion
* corrupted parsing
* incorrect metadata
* old versions still indexed
* documents indexed multiple times

For example:

```text
2026 HR Policy       ✓
2025 HR Policy       ✓
2024 HR Policy       ✓
```

If version filtering isn't working, the retriever may return all three.

---

# 10. Separate Retrieval Failure from Generation Failure

This is a **very important interview point**.

Suppose:

```text
Query
 ↓
Retriever
 ↓
Top 5 documents
 ↓
Correct information IS present
 ↓
LLM gives wrong answer
```

Then this is **not a retrieval problem**.

It's a generation/context-utilization problem.

I would test:

```text
Question + Retrieved Context
             ↓
         LLM response
```

If the answer is still wrong, investigate:

* prompt
* context ordering
* conflicting documents
* context length
* model behavior
* grounding instructions

So I classify the failure:

```text
Wrong Answer
     |
     ├── Correct document NOT retrieved
     |       → Retrieval problem
     |
     └── Correct document retrieved
             → Generation/grounding problem
```

---

# 11. Build a Retrieval Evaluation Dataset

I wouldn't troubleshoot RAG only manually.

I'd create a golden dataset:

```text
Query                         Expected Document
------------------------------------------------
"What is parental leave?"     HR-Leave-2026
"401k eligibility?"           Benefits-401k-2026
"Expense policy?"             Finance-Expense-2026
```

Then measure:

```text
Recall@K
Precision@K
MRR
NDCG
Hit Rate
Answer Faithfulness
```

For example:

```text
Recall@5 = 82%
Precision@5 = 71%
MRR = 0.78
```

Now I can compare retrieval performance before and after changes.

---

# 12. Add Observability

For every request, I want a trace like:

```text
Trace ID: abc123

Original Query: ...
Rewritten Query: ...

Embedding Model: ...
Vector Search: 120 ms

Retrieved:
1. doc_45 → score 0.91
2. doc_72 → score 0.87
3. doc_19 → score 0.84

Reranker:
1. doc_72 → 0.94
2. doc_45 → 0.89

Final Context:
doc_72, doc_45

LLM:
TTFT = 0.8 sec
Total = 2.4 sec
```

This makes the problem diagnosable instead of guessing.

---

# Enterprise Troubleshooting Flow

```text
              Incorrect Answer
                     |
                     v
           ┌──────────────────┐
           │ Reproduce Query  │
           └────────┬─────────┘
                    ↓
             Inspect Trace
                    |
          ┌─────────┴──────────┐
          ↓                    ↓
 Correct Doc Retrieved?      No
          |                    |
         Yes                   ↓
          |              Check Retrieval
          ↓                    |
 Check LLM Grounding           ├─ Query Rewrite
          |                    ├─ Chunking
          ↓                    ├─ Embeddings
   Prompt / Context            ├─ Metadata
   / Model Issue               ├─ Top-K
                               ├─ Hybrid Search
                               ├─ Reranking
                               └─ Index Quality
```

## ⭐ 30-Second Interview Version

> **“I would first reproduce the query and trace the complete RAG pipeline. I would verify the original and rewritten query, chunk quality, embeddings, metadata filters, vector-search scores, Top-K results, reranking, and the final context sent to the LLM. I would determine whether the correct document was never retrieved or was retrieved but ignored by the LLM. For retrieval problems, I would tune chunking, metadata filtering, Top-K, hybrid search and reranking, and verify index freshness. Finally, I would create a golden evaluation dataset and track Recall@K, Precision@K, MRR and faithfulness through observability. I wouldn't optimize blindly—I would identify exactly which stage is causing the retrieval failure.”**

### One key line to remember

> **“First determine whether it's a retrieval failure or a generation failure—because the fix is completely different.”**
