# Azure AI Search in CWD Enterprise RAG

In the **CWD (Coordinator–Delegator–Worker)** architecture, Azure AI Search acts as the **enterprise retrieval layer** that turns large volumes of enterprise documents into searchable, filterable, rankable evidence for RAG.

The key principle is:

> **Azure AI Search finds and ranks enterprise evidence; CWD and Policy/IAM determine how that evidence may be used; the LLM reasons over the authorized evidence.**

The mental model is:

```text
Enterprise Documents
       │
       ▼
   Ingestion
       │
       ├── Parse
       ├── Chunk
       ├── Metadata
       ├── ACL / Security Metadata
       └── Embeddings
       │
       ▼
┌──────────────────────┐
│  Azure AI Search     │
│                      │
│ Keyword Search       │
│ Vector Search        │
│ Hybrid Search        │
│ Filters              │
│ Ranking               │
│ Semantic Ranking      │
└──────────┬───────────┘
           │
           ▼
    Authorized Evidence
           │
           ▼
          LLM
           │
           ▼
    Grounded Response
```

---

# 1. Why Azure AI Search Is Needed

An enterprise may have millions of:

```text
PDFs
Word documents
SharePoint documents
Engineering specifications
Policies
SOPs
Knowledge articles
Tickets
Reports
Technical manuals
Product documentation
```

A normal relational database query isn't enough for questions such as:

> "What procedure should I follow when this equipment reports a thermal alarm?"

The answer may be semantically related to the question without containing the exact words.

Therefore, CWD needs a retrieval system that supports multiple search approaches.

Azure AI Search provides that retrieval foundation.

---

# 2. Its Role in CWD

A typical architecture is:

```text
User
 │
 ▼
Gateway
 │
 ▼
Coordinator
 │
 ▼
Delegator
 │
 ▼
RAG Worker
 │
 ├── Query Understanding
 │
 ├── Entitlement Check
 │
 ├── Query Transformation
 │
 ▼
Azure AI Search
 │
 ├── Keyword Search
 ├── Vector Search
 ├── Hybrid Search
 ├── Metadata Filtering
 └── Ranking
 │
 ▼
Authorized Chunks
 │
 ▼
Context Construction
 │
 ▼
Governed Prompt
 │
 ▼
LLM
 │
 ▼
Response Validation
 │
 ▼
User
```

So Azure AI Search is **inside the retrieval portion of the Worker execution path**.

It is not the Coordinator.

It is not the LLM.

It is not the workflow engine.

---

# 3. Enterprise Document Indexing

Before retrieval can happen, documents need to be transformed into searchable representations.

The ingestion pipeline is:

```text
Enterprise Sources
       │
       ▼
Document Ingestion
       │
       ▼
Parsing / OCR
       │
       ▼
Cleaning / Normalization
       │
       ▼
Chunking
       │
       ▼
Metadata Extraction
       │
       ▼
ACL / Security Metadata
       │
       ▼
Embedding Generation
       │
       ▼
Azure AI Search Index
```

For example, a 100-page engineering document should generally not be indexed as one enormous retrieval unit.

Instead:

```text
Document
   │
   ├── Chunk 1
   ├── Chunk 2
   ├── Chunk 3
   ├── ...
   └── Chunk 250
```

Each chunk can contain both content and metadata.

---

# 4. What Goes Into the Index?

A conceptual Azure AI Search document might look like:

```json
{
  "chunk_id": "DOC123-CHUNK-07",
  "document_id": "DOC123",

  "title": "Thermal Alarm Procedure",

  "content": "When the equipment reports...",
  
  "content_vector": [0.012, -0.034, 0.081],

  "domain": "manufacturing",
  "document_type": "SOP",

  "department": "Engineering",
  "business_unit": "Operations",

  "classification": "CONFIDENTIAL",

  "version": "3.2",
  "effective_date": "2026-08-01",

  "owner": "Engineering",
  
  "access_groups": [
    "engineering-users",
    "operations-users"
  ]
}
```

Notice that the index contains more than text.

It contains:

```text
Content
+
Vector
+
Metadata
+
Security attributes
+
Version
+
Lineage
```

That is what makes it suitable for enterprise RAG.

---

# 5. Keyword Search

Keyword search is useful when the user uses exact terminology.

Example:

> "What is procedure SOP-8472?"

Keyword search can identify:

```text
SOP-8472
```

very effectively.

It is also useful for:

* product IDs
* part numbers
* policy numbers
* ticket IDs
* error codes
* names
* exact technical terminology

For example:

```text
"ERR-1047"
```

may be much better handled through lexical search than semantic similarity.

---

# 6. Vector Search

Vector search addresses semantic similarity.

Suppose the document says:

> "The equipment automatically enters a protective shutdown state when thermal thresholds are exceeded."

The user asks:

> "What happens when the machine gets too hot?"

There may be no exact phrase match.

Vectorization maps both the query and chunks into embedding space:

```text
Query
  │
  ▼
Embedding Model
  │
  ▼
Query Vector
```

and:

```text
Document Chunk
      │
      ▼
Embedding Model
      │
      ▼
Document Vector
```

Then semantic similarity is calculated.

Conceptually:

$$
Similarity(q,d)=cosine(Embed(q),Embed(d))
$$

The highest-scoring relevant chunks become candidates.

---

# 7. Why Vector Search Alone Is Not Enough

Suppose the user asks:

> "Find SOP-8472 for manufacturing line 3."

Vector search might find documents about:

```text
SOP-8472
SOP-8473
SOP-8401
thermal procedures
manufacturing procedures
```

Semantic similarity doesn't understand all enterprise constraints.

We need metadata filtering:

```text
document_type = SOP
AND
line = "line-3"
AND
domain = manufacturing
```

And security filtering:

```text
user ∈ access_groups
```

Therefore:

> **Semantic relevance is not authorization.**

---

# 8. Hybrid Search

This is one of the strongest reasons to use Azure AI Search.

Hybrid search combines:

```text
Keyword / lexical retrieval
+
Vector / semantic retrieval
```

Conceptually:

```text
                    Query
                      │
             ┌────────┴────────┐
             ▼                 ▼
      Keyword Search      Vector Search
             │                 │
             └────────┬────────┘
                      ▼
                 Candidate Set
                      │
                      ▼
                   Ranking
                      │
                      ▼
               Final Results
```

Why?

Because enterprise queries contain both:

### Exact information

```text
"ERR-1047"
"SOP-8472"
"MX-5000"
```

and:

### Semantic information

```text
"Why does the machine shut down when it overheats?"
```

Hybrid retrieval gives CWD both capabilities.

---

# 9. Metadata Filtering

Metadata allows the RAG Worker to constrain retrieval.

Example:

```text
domain = manufacturing
```

or:

```text
document_type = SOP
```

or:

```text
business_unit = semiconductor
```

or:

```text
effective_date <= current_date
```

or:

```text
region = US
```

This changes the search space before the final evidence is selected.

---

# 10. Security / ACL Filtering

This is even more important.

Suppose the search index contains:

```text
Document A → Engineering
Document B → Finance
Document C → HR
```

The user has access only to Engineering.

The retrieval process should conceptually be:

```text
All indexed documents
        │
        ▼
User entitlements
        │
        ▼
Authorized documents
        │
        ▼
Keyword/vector/hybrid retrieval
        │
        ▼
Relevant authorized chunks
```

Not:

```text
All documents
    │
    ▼
Retrieve everything
    │
    ▼
LLM decides what user can see
```

The second design is unsafe.

The LLM should never be the security boundary.

---

# 11. Entitlement-Aware Retrieval

A useful conceptual equation is:

$$
\boxed{
Authorized\ Retrieval =
Relevant\ Content
\cap
User\ Entitlements
\cap
Resource\ ACL
\cap
Business\ Scope
\cap
Policy\ Constraints
}
$$

Therefore:

```text
Relevance
   ∩
Authorization
   ∩
Business Scope
   ∩
Policy
   =
Allowed Evidence
```

Only the resulting evidence should reach the LLM.

---

# 12. Semantic Ranking

Initial retrieval may produce:

```text
100 candidate chunks
```

The system then needs to identify the strongest evidence.

Conceptually:

```text
100 candidates
      │
      ▼
Ranking
      │
      ▼
Top 20
      │
      ▼
Deduplication
      │
      ▼
Top 8
      │
      ▼
Context Assembly
```

Semantic ranking can improve the ordering of candidates based on query/document meaning.

This is different from simply retrieving vectors.

Think:

```text
Vector retrieval
→ Find likely candidates

Ranking
→ Determine which candidates are strongest
```

---

# 13. Retrieval Pipeline in CWD

A production RAG Worker can use:

```text
User Query
    │
    ▼
Intent Analysis
    │
    ▼
Domain Detection
    │
    ▼
Query Type
    │
    ▼
Authorization / Entitlements
    │
    ▼
Query Transformation
    │
    ├── Query Rewrite
    └── Multi-Query
    │
    ▼
Azure AI Search
    │
    ├── Keyword
    ├── Vector
    └── Hybrid
    │
    ▼
Metadata / Security Filtering
    │
    ▼
Ranking
    │
    ▼
Deduplication
    │
    ▼
Context Selection
    │
    ▼
LLM
```

---

# 14. Query Transformation

The original query isn't always the best search query.

User:

> "Why did the production line stop yesterday?"

The RAG Worker might identify:

```text
Intent:
root_cause_analysis

Domain:
manufacturing

Query type:
analytical

Entities:
production line
date = yesterday
```

It may generate search variants such as:

```text
production line shutdown incident
production line stop root cause
manufacturing downtime yesterday
line shutdown incident report
```

These can improve recall.

---

# 15. Multi-Query Retrieval

One query can miss relevant documents.

Therefore:

```text
Original Query
     │
     ▼
Query Transformation
     │
     ├── Query A
     ├── Query B
     ├── Query C
     └── Query D
             │
             ▼
      Azure AI Search
             │
             ▼
      Candidate Results
             │
             ▼
       Merge + Rank
```

This is particularly useful for complex questions.

---

# 16. Chunk-Level Retrieval

Azure AI Search typically retrieves indexed chunks rather than entire documents for RAG.

Example:

```text
Document: Manufacturing_SOP.pdf

Chunk 01
Chunk 02
Chunk 03
Chunk 04
...
Chunk 100
```

The search might return:

```text
Chunk 37
Chunk 41
Chunk 42
Chunk 78
```

The RAG Worker can then optionally retrieve surrounding/parent context if necessary.

This gives:

```text
Precision
+
Context
```

without sending the entire document to the LLM.

---

# 17. Deduplication

Hybrid or multi-query retrieval can return duplicates.

For example:

```text
Query A → Chunk 37
Query B → Chunk 37
Query C → Chunk 41
```

The Worker should deduplicate:

```text
Chunk 37
Chunk 41
```

before constructing LLM context.

Otherwise the model receives redundant information.

---

# 18. Context Assembly

The final retrieved chunks should be converted into controlled context.

Instead of:

```text
100 chunks
```

use:

```text
Top relevant authorized chunks
        │
        ▼
Deduplicate
        │
        ▼
Select diverse evidence
        │
        ▼
Parent/neighbor context if needed
        │
        ▼
Token budget
        │
        ▼
LLM context
```

A context block might preserve:

```text
Document title
Section
Version
Effective date
Source
Relevant text
Document ID
Chunk ID
```

This supports provenance.

---

# 19. Provenance

Enterprise RAG should be able to answer:

> "Where did this answer come from?"

Therefore, retrieval results should retain:

```text
document_id
chunk_id
source
title
section
version
effective_date
```

Then the response can provide citations or references.

Conceptually:

```text
Answer
  │
  ├── Evidence A → SOP-8472
  ├── Evidence B → Engineering Guide
  └── Evidence C → Incident Report
```

This improves:

* trust
* auditability
* debugging
* governance
* user verification

---

# 20. Azure AI Search Is Not the RAG System

This distinction is important for architecture interviews.

RAG is the **complete architecture**.

Azure AI Search is the **retrieval component**.

```text
RAG
│
├── Ingestion
├── Parsing
├── Chunking
├── Metadata
├── ACL preservation
├── Embeddings
├── Azure AI Search
├── Retrieval
├── Filtering
├── Ranking
├── Context assembly
├── Prompt
├── LLM
└── Response validation
```

Therefore:

> **Azure AI Search enables the retrieval part of RAG; it does not constitute the entire RAG architecture.**

---

# 21. Azure AI Search vs Vector Database

You can think of a specialized vector database as:

```text
Vector similarity
```

while an enterprise search platform can provide:

```text
Keyword
+
Vector
+
Hybrid
+
Filtering
+
Ranking
+
Faceting
+
Enterprise search capabilities
```

For CWD, enterprise documents often require all of these capabilities.

For example:

```text
Query:
"Find the current confidential manufacturing SOP
for product MX-5000 in Texas."
```

Potential constraints:

```text
Semantic relevance
+
Exact product ID
+
Document type
+
Region
+
Classification
+
Current version
+
User entitlement
```

A robust enterprise retrieval layer needs to combine those dimensions.

---

# 22. Azure AI Search + RAG + MCP

These technologies also have distinct roles.

```text
Worker
  │
  ▼
MCP Client
  │
  ▼
Knowledge MCP Server
  │
  ▼
Azure AI Search
  │
  ├── Keyword
  ├── Vector
  ├── Hybrid
  └── Filters
```

MCP standardizes the **tool/resource integration boundary**.

Azure AI Search performs the **search/retrieval work**.

---

# 23. Azure AI Search + LangGraph

LangGraph can orchestrate the retrieval workflow:

```text
START
  │
  ▼
Analyze Query
  │
  ▼
Authorize
  │
  ▼
Rewrite Query
  │
  ▼
Search
  │
  ▼
Filter
  │
  ▼
Rank
  │
  ▼
Enough Evidence?
 ┌┴─────────────┐
 │              │
NO             YES
 │              │
Rewrite/       Context
Retry           │
 │              ▼
 └──────────►   LLM
```

Azure AI Search performs retrieval.

LangGraph determines **what happens before and after retrieval**.

---

# 24. Azure AI Search + Prompt Registry

The prompt used for generation should be governed.

```text
Prompt Registry
       │
       ▼
Approved Prompt v2.3
       │
       ▼
RAG Context
       │
       ▼
LLM
```

The workflow should record:

```text
prompt_id
prompt_version
model
model_version
retrieval configuration
index/version
```

This improves reproducibility.

---

# 25. Azure AI Search + Agent Registry

Agent Registry answers:

```text
Which agent can perform knowledge retrieval?
```

Azure AI Search answers:

```text
Which indexed enterprise evidence matches this query?
```

Therefore:

```text
Agent Registry
→ Who can retrieve?

Azure AI Search
→ What evidence is relevant?

Policy
→ What evidence is allowed?

LLM
→ What can we conclude from that evidence?
```

---

# 26. Search vs Authorization

This distinction is critical:

```text
Azure AI Search
      ↓
Can find document
```

does **not** mean:

```text
User
      ↓
Can access document
```

A document may exist in the index but still be inaccessible to the current user.

Therefore:

$$
\boxed{
Searchability \neq Authorization
}
$$

The retrieval architecture must preserve and enforce access controls.

---

# 27. Document Updates

Enterprise information changes.

Suppose:

```text
SOP v3.0
```

becomes:

```text
SOP v3.1
```

The ingestion pipeline should detect the change:

```text
Source
  │
  ▼
Change Detection
  │
  ▼
Reprocess
  │
  ▼
Chunk
  │
  ▼
Embed
  │
  ▼
Update Index
```

Metadata such as:

```text
version
effective_date
modified_at
status
```

allows retrieval to prefer current approved information.

---

# 28. Deletion and Permission Changes

Suppose a document is deleted:

```text
Enterprise Repository
       │
       ▼
Document Deleted
       │
       ▼
Ingestion Pipeline
       │
       ▼
Azure AI Search
       │
       ▼
Remove/disable indexed content
```

Likewise, if a user's access changes, the security metadata and retrieval behavior must reflect that change.

This is why enterprise RAG is more than just embeddings.

---

# 29. Retrieval Quality Metrics

Azure AI Search retrieval should be evaluated.

Important metrics include:

### Recall@K

Did we retrieve relevant evidence?

$$
Recall@K =
\frac{Relevant\ Retrieved}{Total\ Relevant}
$$

### Precision@K

How much of what we retrieved is relevant?

$$
Precision@K =
\frac{Relevant\ Retrieved}{Retrieved}
$$

### MRR

How high is the first relevant result?

### NDCG

How well are results ranked according to relevance?

Also evaluate:

```text
Context relevance
Context precision
Context recall
Groundedness
Citation accuracy
Answer correctness
```

---

# 30. Security Metrics

For enterprise RAG, retrieval quality alone isn't enough.

Track:

```text
Unauthorized documents retrieved
Cross-tenant leakage
ACL filtering failures
Sensitive-data exposure
Stale authorization metadata
Incorrect classification filtering
```

A system retrieving the "right" document for the wrong user is still a failure.

---

# 31. Latency

RAG latency can be decomposed:

```text
Query transformation
       +
Embedding
       +
Azure AI Search
       +
Ranking
       +
Filtering
       +
Context construction
       +
LLM
```

For example:

```text
Query processing      50 ms
Embedding             100 ms
Search                150 ms
Reranking             120 ms
Context construction   30 ms
LLM                  1200 ms
```

The RAG Worker should measure each stage.

---

# 32. Cost

Retrieval also contributes to cost.

Potential cost drivers include:

```text
Document processing
Embedding generation
Index storage
Search operations
Semantic ranking
RAG query volume
LLM context tokens
```

An important optimization is:

> **Don't retrieve more information than the task requires.**

Instead:

```text
Retrieve
 ↓
Filter
 ↓
Rank
 ↓
Deduplicate
 ↓
Select
 ↓
Generate
```

rather than:

```text
Retrieve everything
 ↓
Send everything to LLM
```

---

# 33. Complete Enterprise RAG Flow

```text
                 ENTERPRISE SOURCES
                         │
                         ▼
                  Ingestion Pipeline
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Parsing      Chunking    Metadata
             │           │           │
             └───────────┼───────────┘
                         ▼
                  ACL Preservation
                         │
                         ▼
                   Embeddings
                         │
                         ▼
              ┌─────────────────────┐
              │  Azure AI Search    │
              │                     │
              │ Keyword             │
              │ Vector              │
              │ Hybrid              │
              │ Metadata Filters    │
              │ Security Filters    │
              │ Semantic Ranking    │
              └──────────┬──────────┘
                         │
                         ▼
                  Authorized Chunks
                         │
                         ▼
                    Deduplicate
                         │
                         ▼
                  Context Assembly
                         │
                         ▼
                   Prompt Registry
                         │
                         ▼
                        LLM
                         │
                         ▼
                Response Validation
                         │
                         ▼
                        User
```

---

# 34. Responsibility Separation

| Component           | Responsibility                                                |
| ------------------- | ------------------------------------------------------------- |
| **CWD Coordinator** | Enterprise orchestration                                      |
| **Delegator**       | Domain orchestration                                          |
| **RAG Worker**      | Retrieval workflow                                            |
| **Azure AI Search** | Search, vector retrieval, hybrid retrieval, ranking/filtering |
| **Policy/IAM**      | Authorization                                                 |
| **Agent Registry**  | Agent discovery                                               |
| **Prompt Registry** | Prompt governance                                             |
| **LangGraph**       | Workflow state and routing                                    |
| **MCP**             | Tool/resource integration                                     |
| **LLM**             | Reasoning and generation                                      |
| **Cosmos DB**       | Durable operational state                                     |
| **Redis**           | Fast working/cache state                                      |
| **Service Bus**     | Async task delivery                                           |

---

# 35. Why Azure AI Search Was Selected

### Enterprise problem

Enterprise knowledge is:

```text
Large
Distributed
Heterogeneous
Frequently changing
Security-sensitive
Semantically complex
Metadata-rich
```

A basic keyword database is insufficient.

### Architectural decision

Use Azure AI Search as the enterprise retrieval layer because it can combine:

```text
Keyword search
+
Vector search
+
Hybrid search
+
Metadata filtering
+
Security filtering patterns
+
Ranking
+
Enterprise indexing
```

### Result

CWD can provide:

```text
Relevant
+
Authorized
+
Current
+
Ranked
+
Traceable
enterprise evidence
```

to the LLM.

---

# 36. Core Formula

$$
\boxed{
Enterprise\ Retrieval =
Keyword\ Search
+
Vector\ Search
+
Hybrid\ Retrieval
+
Metadata\ Filtering
+
Security\ Filtering
+
Ranking
+
Provenance
}
$$

And the complete CWD RAG architecture:

$$
\boxed{
CWD\ RAG =
Secure\ Retrieval
+
Azure\ AI\ Search
+
Authorized\ Context
+
Governed\ Prompt
+
LLM
+
Response\ Validation
}
$$

---

# 37. Interview-Ready Answer

> **"We use Azure AI Search in CWD as the enterprise retrieval layer for RAG. Enterprise documents are ingested, parsed, chunked, enriched with metadata and access-control information, embedded, and indexed. At runtime, the RAG Worker transforms the user's query and performs keyword, vector, or hybrid retrieval through Azure AI Search.**
>
> **Hybrid search is important because enterprise queries contain both semantic questions and exact identifiers such as policy numbers, product IDs, error codes, and document names. Metadata filtering allows us to constrain retrieval by domain, document type, business unit, region, version, date, and other business attributes. Security metadata and entitlement filtering ensure that semantic relevance never overrides user authorization.**
>
> **After retrieval, the Worker filters, ranks, deduplicates, and selects the most useful authorized chunks within the context budget. Those chunks are then passed to the LLM through a governed prompt, with provenance maintained so the response can be traced back to enterprise evidence.**
>
> **Azure AI Search itself is not the complete RAG system. It provides the search and retrieval capabilities; CWD orchestrates the workflow, Policy/IAM controls authorization, LangGraph controls state and routing, the RAG Worker manages retrieval logic and context construction, and the LLM performs reasoning and generation."**

# Final Mental Model

```text
              AZURE AI SEARCH IN CWD

Enterprise Documents
        │
        ▼
   Parse + Chunk
        │
        ▼
Metadata + ACL + Embedding
        │
        ▼
┌─────────────────────────────┐
│      Azure AI Search        │
│                             │
│  Keyword Search             │
│       +                     │
│  Vector Search              │
│       ↓                     │
│  Hybrid Retrieval           │
│       ↓                     │
│  Metadata Filtering         │
│       ↓                     │
│  Security Filtering         │
│       ↓                     │
│  Ranking                    │
└──────────────┬──────────────┘
               │
               ▼
      Authorized Evidence
               │
               ▼
       Context Assembly
               │
               ▼
        Governed Prompt
               │
               ▼
              LLM
               │
               ▼
     Validated + Grounded
            Response
```

> **One sentence to remember:**
> **Azure AI Search is the enterprise retrieval engine in CWD that indexes document chunks and metadata, combines keyword and vector search through hybrid retrieval, applies business and security filters, ranks relevant evidence, and supplies authorized, traceable context to the RAG workflow so the LLM can generate grounded enterprise responses.**
