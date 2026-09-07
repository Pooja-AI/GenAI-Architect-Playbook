Yes. In your **CWD architecture, Azure AI Search can act as the enterprise retrieval layer** between the RAG Worker and enterprise knowledge. It supports multiple retrieval modes—**keyword, vector, hybrid, filtering, and semantic ranking**—so CWD does not have to depend on a single search strategy.

# Azure AI Search as the Enterprise Retrieval Layer in CWD

## 1. Core Principle

**Azure AI Search is the search and retrieval engine; CWD is the orchestration and governance layer.**

The separation is:

```text
CWD
 │
 ├── Coordinator
 │
 ├── Delegator
 │
 └── RAG Worker
          │
          ▼
    Azure AI Search
          │
          ├── Keyword Search
          ├── Vector Search
          ├── Hybrid Search
          ├── Filtering
          └── Semantic Ranking
          │
          ▼
   Authorized Enterprise Context
          │
          ▼
         LLM
```

Azure AI Search therefore sits primarily in the **knowledge/retrieval plane**, while LangGraph controls workflow and CWD controls enterprise orchestration.

---

# 2. What Azure AI Search Provides

Azure AI Search can provide the following capabilities for an enterprise RAG platform:

| Capability                 | Purpose                                         |
| -------------------------- | ----------------------------------------------- |
| Indexing                   | Store searchable enterprise content             |
| Keyword search             | Exact/lexical matching                          |
| Vector search              | Semantic similarity search                      |
| Hybrid search              | Combine keyword + vector retrieval              |
| Filters                    | Restrict results using metadata                 |
| Facets                     | Aggregate/filter by metadata                    |
| Semantic ranking           | Improve relevance of search results             |
| Search scoring             | Rank candidate documents                        |
| Metadata search            | Filter by domain, date, classification, etc.    |
| Security trimming patterns | Restrict retrieval according to access metadata |
| AI enrichment              | Process/enrich content during indexing          |
| Synonyms                   | Improve lexical matching                        |
| Geo search                 | Location-aware retrieval where required         |

The important architectural point is:

> **Azure AI Search retrieves and ranks knowledge; it does not replace CWD's authorization, workflow, agent orchestration, or business policy layers.**

---

# 3. Position in CWD

A typical architecture is:

```text
                         USER
                           │
                           ▼
                    API / Gateway
                           │
                           ▼
                     COORDINATOR
                           │
                           ▼
                      DELEGATOR
                           │
                           ▼
                      RAG WORKER
                           │
             ┌─────────────┴──────────────┐
             │                            │
             ▼                            ▼
       Query Processing             Authorization
             │                            │
             └─────────────┬──────────────┘
                           ▼
                   Azure AI Search
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          Keyword       Vector        Filters
           Search        Search
             │             │
             └──────┬──────┘
                    ▼
              Hybrid Results
                    │
                    ▼
             Semantic Ranking
                    │
                    ▼
             Top Relevant Chunks
                    │
                    ▼
             Context Construction
                    │
                    ▼
                   LLM
                    │
                    ▼
             Grounded Response
```

---

# 4. Azure AI Search Index

The **search index** is the central data structure used by Azure AI Search.

For enterprise RAG, an index can conceptually contain:

```json
{
  "chunk_id": "CH-00123",
  "document_id": "DOC-1001",
  "title": "Remote Work Policy",
  "content": "Employees may work remotely...",
  "content_vector": [0.021, -0.184, 0.731],
  "domain": "HR",
  "classification": "INTERNAL",
  "department": "Human Resources",
  "document_version": "7",
  "effective_date": "2026-01-01",
  "access_groups": [
    "employees"
  ],
  "source": "SharePoint",
  "section": "Remote Work"
}
```

The actual embedding vector may contain hundreds or thousands of dimensions.

Conceptually:

```text
                  SEARCH INDEX
┌──────────────────────────────────────────────┐
│                                              │
│ Text fields                                  │
│      │                                       │
│      ├── title                               │
│      ├── content                             │
│      └── section                             │
│                                              │
│ Vector fields                                │
│      │                                       │
│      └── content_vector                      │
│                                              │
│ Metadata                                     │
│      │                                       │
│      ├── domain                              │
│      ├── classification                      │
│      ├── department                          │
│      ├── document_id                         │
│      └── access_groups                       │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 5. Indexing Pipeline

Before users can search enterprise knowledge, content needs to be indexed.

```text
Enterprise Sources
      │
      ├── SharePoint
      ├── Databases
      ├── PDFs
      ├── Internal Websites
      ├── Knowledge Bases
      └── Enterprise Applications
                │
                ▼
          Ingestion Layer
                │
                ▼
             Parsing
                │
                ▼
            Chunking
                │
                ▼
       Metadata + ACL Extraction
                │
                ▼
          Embedding Generation
                │
                ▼
        Azure AI Search Index
```

For example:

```text
Employee Handbook
       │
       ▼
    100 pages
       │
       ▼
    400 chunks
       │
       ▼
  400 embeddings
       │
       ▼
Azure AI Search
```

Each chunk becomes a searchable unit.

---

# 6. Keyword Search

Keyword search looks for lexical matches between the query and indexed text.

Example:

```text
Query:

"HR-4721 remote work policy"
```

Keyword search can identify:

```text
Document 1:
HR-4721 Remote Work Policy

Document 2:
Remote Work Guidelines

Document 3:
Employee Benefits
```

Keyword search is particularly useful for:

```text
Employee IDs
Policy IDs
Part numbers
Error codes
Product names
Exact terminology
Acronyms
Legal references
Technical identifiers
```

For example:

```text
"INC-948271"
"SKU-AX100"
"HR-4721"
"API-502"
```

Exact lexical matching can be extremely valuable for these cases.

---

# 7. Vector Search

Vector search uses embeddings.

The query:

```text
"Can employees work from home?"
```

is converted into a vector:

```text
Query
  │
  ▼
Embedding Model
  │
  ▼
Query Vector
```

Azure AI Search compares the query vector against vector fields in the index.

```text
Query Vector
      │
      ▼
Vector Search
      │
      ├── Chunk A → 0.94
      ├── Chunk B → 0.89
      ├── Chunk C → 0.73
      └── Chunk D → 0.21
```

The highest-scoring chunks become candidates for retrieval.

---

# 8. Why Vector Search Is Important

Consider:

```text
Query:
"Can I work from home?"
```

Document:

```text
"Employees are permitted to work remotely
up to three days per week."
```

There may be limited exact word overlap.

But semantically:

```text
work from home
        ≈
work remotely
```

Vector search can identify that relationship.

Therefore:

```text
Keyword Search
     ↓
Matches words

Vector Search
     ↓
Matches meaning
```

---

# 9. Hybrid Search

For enterprise systems, **hybrid search is often more powerful than relying exclusively on either keyword or vector search**.

Hybrid retrieval combines:

```text
                Query
                  │
          ┌───────┴────────┐
          ▼                ▼
     Keyword Search    Vector Search
          │                │
          ▼                ▼
    Lexical Results   Semantic Results
          │                │
          └───────┬────────┘
                  ▼
             Result Fusion
                  │
                  ▼
             Ranked Results
```

For example:

```text
Query:

"What is the policy for SKU AX-100?"

Keyword search
→ exact SKU match

Vector search
→ semantic policy matches

Hybrid
→ combines both signals
```

This is especially useful for enterprise content containing:

```text
Natural language
+
Technical terminology
+
Identifiers
+
Codes
+
Product names
+
Policy references
```

---

# 10. Why Hybrid Retrieval Matters in CWD

Enterprise queries are rarely purely semantic.

Consider:

### Query 1

```text
"What is our remote work policy?"
```

Semantic retrieval is useful.

### Query 2

```text
"What is the status of INC-92831?"
```

Keyword/exact matching is important.

### Query 3

```text
"Explain the failure associated with INC-92831."
```

Both matter.

Therefore:

```text
Enterprise Retrieval
=
Keyword Retrieval
+
Vector Retrieval
+
Ranking
```

---

# 11. Metadata Filtering

Azure AI Search can also filter results using metadata.

Suppose the index contains:

```json
{
  "domain": "HR",
  "classification": "INTERNAL",
  "region": "US",
  "department": "Engineering"
}
```

A search can conceptually apply:

```text
domain = "HR"
AND
region = "US"
AND
classification = "INTERNAL"
```

before or during result selection according to the retrieval design.

This reduces irrelevant results.

---

# 12. Security Filtering

This is especially important in CWD.

Suppose:

```text
Document A
access_groups = ["employees"]

Document B
access_groups = ["hr-admin"]

Document C
access_groups = ["finance"]
```

The user belongs to:

```text
employees
```

The retrieval layer should return:

```text
Document A
```

but not:

```text
Document B
Document C
```

The fundamental rule is:

```text
Semantic Relevance
        ≠
Authorization
```

Therefore:

```text
Query
  │
  ▼
Identity
  │
  ▼
Entitlements
  │
  ▼
Search
  │
  ▼
Authorized Results
```

Security filtering must be designed carefully; merely storing an `access_groups` field does not by itself enforce authorization.

---

# 13. Semantic Ranking

Initial retrieval produces candidates.

For example:

```text
Top 50 candidates
```

But the top candidate from vector/keyword retrieval isn't necessarily the best final result.

A semantic ranking stage can improve relevance.

```text
Query
  │
  ▼
Initial Retrieval
  │
  ▼
50 candidates
  │
  ▼
Semantic Ranking
  │
  ▼
Top 5–10
```

Conceptually:

```text
Retrieval
=
Find candidates

Semantic Ranking
=
Determine which candidates
are most relevant to the query
```

This two-stage architecture is extremely useful for enterprise RAG.

---

# 14. Complete Retrieval Pipeline

A production pipeline can look like:

```text
                 USER QUERY
                      │
                      ▼
               Query Analysis
                      │
                      ▼
               Query Embedding
                      │
                      ▼
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
    Keyword Search          Vector Search
          │                       │
          └───────────┬───────────┘
                      ▼
                Hybrid Fusion
                      │
                      ▼
              Metadata Filtering
                      │
                      ▼
             Security Filtering
                      │
                      ▼
              Candidate Results
                      │
                      ▼
             Semantic Ranking
                      │
                      ▼
                 Top-K Chunks
                      │
                      ▼
             Context Construction
                      │
                      ▼
                     LLM
                      │
                      ▼
             Grounded Response
```

---

# 15. Azure AI Search + RAG

The role of Azure AI Search becomes clearer when separating ingestion and runtime.

## Ingestion

```text
Enterprise Documents
        │
        ▼
Document Processing
        │
        ▼
Chunking
        │
        ▼
Embeddings
        │
        ▼
Azure AI Search
```

## Runtime

```text
User Question
      │
      ▼
Query Embedding
      │
      ▼
Azure AI Search
      │
      ├── Keyword
      ├── Vector
      ├── Hybrid
      ├── Filter
      └── Semantic Ranking
             │
             ▼
        Relevant Chunks
             │
             ▼
        Context Builder
             │
             ▼
             LLM
```

---

# 16. Azure AI Search + CWD + LangGraph

LangGraph should orchestrate the retrieval workflow rather than Azure AI Search controlling the overall agent workflow.

For example:

```text
START
  │
  ▼
Validate Request
  │
  ▼
Identify Intent
  │
  ▼
Check Authorization
  │
  ▼
Generate Query
  │
  ▼
Retrieve from Azure AI Search
  │
  ▼
Evaluate Results
  │
  ├──── sufficient ────► Build Context
  │
  └──── insufficient ──► Query Refinement
                              │
                              ▼
                         Search Again
                              │
                              ▼
                         Build Context
                              │
                              ▼
                             LLM
                              │
                              ▼
                       Validate Response
                              │
                              ▼
                            END
```

This is where the responsibilities remain clean:

```text
Azure AI Search
→ Search and rank knowledge

LangGraph
→ Control workflow and state

RAG Worker
→ Execute retrieval capability

Policy/IAM
→ Authorization

CWD
→ Enterprise orchestration
```

---

# 17. Azure AI Search + MCP

If the architecture uses MCP, the RAG Worker can access the search capability through an MCP server.

```text
CWD
 │
 ▼
RAG Worker
 │
 ▼
MCP Client
 │
 ▼
Knowledge/Search MCP Server
 │
 ▼
Azure AI Search
 │
 ▼
Enterprise Knowledge
```

For example, the MCP server might expose a narrow tool:

```text
search_enterprise_knowledge
```

rather than exposing unrestricted infrastructure operations.

Conceptually:

```json
{
  "tool": "search_enterprise_knowledge",
  "input": {
    "query": "remote work policy",
    "domain": "HR",
    "top_k": 10
  }
}
```

The MCP layer standardizes the interaction; it does **not** replace Azure AI Search's search capabilities or CWD's authorization model.

---

# 18. Azure AI Search + Agent Registry

The Agent Registry answers:

```text
"Which agent can perform enterprise knowledge retrieval?"
```

For example:

```text
Agent Registry
      │
      ▼
Knowledge Agent
      │
      ▼
RAG Worker
      │
      ▼
Azure AI Search
```

The responsibilities remain distinct:

```text
Agent Registry
→ Which agent?

Azure AI Search
→ Which knowledge?

Policy/IAM
→ Is access allowed?

LangGraph
→ What happens next?

LLM
→ How should the evidence be interpreted?
```

---

# 19. Azure AI Search + Prompt Registry

The Prompt Registry governs the prompt used after retrieval.

For example:

```text
Prompt Registry
       │
       ▼
RAG Answer Prompt v3.2
       │
       ▼
Context + User Question
       │
       ▼
LLM
```

A production workflow might record:

```json
{
  "prompt_id": "enterprise-rag-answer",
  "prompt_version": "3.2.0",
  "search_index": "enterprise-kb-prod",
  "embedding_model": "embedding-v2",
  "reranker_version": "2.1"
}
```

This helps reproduce and audit an answer.

---

# 20. Azure AI Search Index Design

A practical enterprise index might conceptually contain:

```text
Document Identity
├── document_id
├── document_version
├── chunk_id
└── source_id

Content
├── title
├── content
├── section
└── keywords

Vector
└── content_vector

Business Metadata
├── domain
├── department
├── region
├── document_type
└── effective_date

Security Metadata
├── classification
├── access_groups
├── allowed_roles
└── security_label

Lineage
├── source_system
├── source_location
└── ingestion_timestamp
```

This creates a retrieval record that supports:

```text
Semantic Search
+
Lexical Search
+
Filtering
+
Security
+
Provenance
```

---

# 21. Retrieval Example

Suppose the user asks:

```text
"What is the current policy for remote work?"
```

### Step 1 — Query

```text
User Query
```

### Step 2 — Query embedding

```text
Query
 ↓
Embedding Model
 ↓
Query Vector
```

### Step 3 — Search

```text
Azure AI Search
 │
 ├── Keyword Search
 └── Vector Search
```

### Step 4 — Candidate retrieval

```text
50 candidates
```

### Step 5 — Filtering

```text
domain = HR
classification allowed
user entitlement = employee
```

### Step 6 — Semantic ranking

```text
50
 ↓
10
```

### Step 7 — Context

```text
Remote Work Policy
Section: Flexible Work
Version: 7
Effective: 2026-01-01
```

### Step 8 — LLM

```text
Question
+
Authorized Evidence
+
Governed Prompt
```

### Step 9 — Answer

```text
Employees may work remotely
up to three days per week,
subject to manager approval.
```

The answer can include provenance back to the source document/chunk.

---

# 22. Retrieval Quality

Azure AI Search provides retrieval capabilities, but the **overall RAG quality still needs evaluation**.

Important retrieval metrics include:

```text
Recall@K
Precision@K
MRR
NDCG
Context Precision
Context Recall
```

For example:

```text
Query
 │
 ▼
Top 10 retrieved chunks
 │
 ▼
How many truly relevant chunks
were retrieved?
 │
 ▼
Recall@10
```

Then generation should be evaluated separately:

```text
Retrieved Context
       │
       ▼
      LLM
       │
       ▼
Answer
       │
       ▼
Groundedness
Citation Accuracy
Answer Relevance
```

---

# 23. Azure AI Search Does Not Solve Everything

It is important not to treat Azure AI Search as the complete RAG system.

### Azure AI Search is not:

```text
❌ LLM
❌ Agent
❌ Workflow engine
❌ Identity provider
❌ Enterprise authorization system
❌ Prompt registry
❌ Agent registry
❌ MCP server
❌ A2A protocol
❌ Business rules engine
```

Instead:

```text
Azure AI Search
=
Enterprise Search + Retrieval Layer
```

---

# 24. Responsibility Matrix

| Component                  | Responsibility                         |
| -------------------------- | -------------------------------------- |
| Coordinator                | Enterprise orchestration               |
| Delegator                  | Domain orchestration                   |
| RAG Worker                 | Retrieval execution                    |
| LangGraph                  | Workflow/state/routing/recovery        |
| Agent Registry             | Agent discovery                        |
| Prompt Registry            | Prompt lifecycle                       |
| Policy/IAM                 | Authorization                          |
| MCP                        | Standardized tool/resource interaction |
| Azure AI Search            | Search/index/retrieval/ranking         |
| Vector embedding model     | Text → vector                          |
| Reranker                   | Improve relevance                      |
| LLM                        | Reasoning/generation                   |
| Service Bus                | Async messaging                        |
| Key Vault                  | Secrets                                |
| App Insights/Azure Monitor | Runtime observability                  |

This separation prevents architectural coupling.

---

# 25. Security Architecture

A secure CWD RAG flow should look like:

```text
User
 │
 ▼
Gateway Authentication
 │
 ▼
Coordinator Authorization
 │
 ▼
Delegator
 │
 ▼
RAG Worker
 │
 ├── User identity
 ├── Agent identity
 ├── Data classification
 └── Access scope
 │
 ▼
Azure AI Search
 │
 ├── Metadata filtering
 ├── Security trimming
 └── Retrieval
 │
 ▼
Authorized Context
 │
 ▼
LLM
 │
 ▼
Output Validation
 │
 ▼
User
```

The important principle is:

> **Never assume that because Azure AI Search found a document, the user is authorized to see it.**

Authorization must be deliberately enforced.

---

# 26. Performance Architecture

At enterprise scale, retrieval performance depends on:

```text
Index size
+
Vector dimensions
+
ANN configuration
+
Top-K
+
Filters
+
Hybrid search
+
Semantic ranking
+
Network latency
+
Embedding latency
```

A common architecture is:

```text
Query
 │
 ▼
Embedding
 │
 ▼
Fast candidate retrieval
 │
 ▼
Top N
 │
 ▼
Semantic ranking
 │
 ▼
Top K
```

This avoids sending thousands of irrelevant chunks into the LLM.

---

# 27. Why Top-K Is Important

Suppose:

```text
Top-K = 100
```

You may retrieve many relevant candidates, but the context becomes noisy.

If:

```text
Top-K = 2
```

you may miss important supporting information.

Therefore:

```text
Too Small
→ Poor Recall

Too Large
→ Context Noise + Cost
```

The correct value must be evaluated against the enterprise corpus.

A useful architecture is:

```text
Vector/Hybrid Search
       ↓
Top 20–50 candidates
       ↓
Semantic Ranking
       ↓
Top 5–10
       ↓
Context Builder
```

The exact numbers should be treated as configuration, not universal defaults.

---

# 28. Failure Handling

Production CWD should handle search failures explicitly.

```text
Azure AI Search
      │
      ├── Success
      │      ↓
      │   Continue
      │
      ├── Timeout
      │      ↓
      │   Retry / fallback
      │
      ├── No Results
      │      ↓
      │   Query refinement
      │
      ├── Poor Results
      │      ↓
      │   Rewrite query
      │
      └── Service Unavailable
             ↓
          Recovery
```

LangGraph can represent these branches explicitly.

---

# 29. Observability

Every retrieval request should be traceable.

Useful fields include:

```json
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "agent_id": "knowledge-agent",
  "worker_id": "rag-worker",
  "query": "remote work policy",
  "search_mode": "hybrid",
  "top_k": 20,
  "rerank_count": 10,
  "index": "enterprise-kb-prod",
  "embedding_model": "embedding-v2",
  "result_count": 8,
  "latency_ms": 240
}
```

This allows you to answer:

```text
Which query?
Which user/workflow?
Which index?
Which embedding model?
Which search mode?
Which chunks?
Which ranking?
How long?
What answer?
```

---

# 30. Reproducibility

A production RAG response should ideally be reproducible from:

```text
Correlation ID
+
Prompt Version
+
Model Version
+
Embedding Model Version
+
Search Index Version/State
+
Retrieval Configuration
+
Metadata Filters
+
Retrieved Chunk IDs
+
Reranker Version
```

Conceptually:

```text
             Reproducible RAG
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
    Prompt       Search      Model
    Version      Config      Version
       │           │           │
       └───────────┼───────────┘
                   ▼
            Retrieved Evidence
                   │
                   ▼
                 Answer
```

---

# 31. Complete CWD Azure Architecture

A production-oriented architecture can therefore look like:

```text
                           USER
                             │
                             ▼
                    ┌─────────────────┐
                    │ API Management  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   COORDINATOR   │
                    │   + LangGraph   │
                    └────────┬────────┘
                             │
                       Agent Registry
                             │
                             ▼
                    ┌─────────────────┐
                    │   DELEGATOR     │
                    │   + LangGraph   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    RAG WORKER   │
                    └────────┬────────┘
                             │
                       Policy / IAM
                             │
                             ▼
                    ┌─────────────────┐
                    │ MCP Client      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Knowledge MCP   │
                    │ Server           │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │      Azure AI Search         │
              │                              │
              │  Keyword Search              │
              │  Vector Search               │
              │  Hybrid Retrieval            │
              │  Metadata Filtering           │
              │  Semantic Ranking             │
              └──────────────┬───────────────┘
                             │
                             ▼
                    Authorized Context
                             │
                             ▼
                    ┌─────────────────┐
                    │  Azure OpenAI   │
                    │      / LLM      │
                    └────────┬────────┘
                             │
                             ▼
                    Response Validation
                             │
                             ▼
                    Coordinator Result
                             │
                             ▼
                           USER
```

Supporting services:

```text
Entra ID
   │
   ├── Identity
   └── Authorization

Key Vault
   │
   └── Secrets

Service Bus
   │
   └── Async Agent Messaging

Prompt Registry
   │
   └── Governed Prompts

Agent Registry
   │
   └── Agent Discovery

Azure Monitor / App Insights
   │
   └── Observability

Storage / SharePoint / Enterprise Systems
   │
   └── Knowledge Sources
```

---

# 32. Key Architectural Distinction

Remember this five-part model:

```text
                 CWD
                  │
       ┌──────────┼───────────┐
       │          │           │
   LangGraph    Policy      Registry
       │          │           │
   Workflow    Security    Discovery
       │
       ▼
    RAG Worker
       │
       ▼
Azure AI Search
       │
       ├── Keyword
       ├── Vector
       ├── Hybrid
       ├── Filters
       └── Semantic Ranking
       │
       ▼
  Enterprise Evidence
       │
       ▼
      LLM
```

The mental model is:

```text
Agent Registry
→ Who can perform retrieval?

Policy/IAM
→ Who is allowed to retrieve what?

LangGraph
→ What retrieval step happens next?

RAG Worker
→ Execute retrieval.

Azure AI Search
→ Find and rank knowledge.

LLM
→ Reason over retrieved evidence.
```

---

# 33. Common Anti-Patterns

### ❌ Using only vector search

You may lose exact matches for:

```text
IDs
codes
SKUs
error numbers
policy numbers
```

### ❌ Using only keyword search

You may miss semantic relationships:

```text
"work from home"
        vs
"remote working"
```

### ❌ Sending unrestricted search results to the LLM

This creates a data leakage risk.

### ❌ Treating semantic ranking as authorization

```text
Relevant
≠
Authorized
```

### ❌ Putting business logic inside the search index

Search should retrieve knowledge, not become the enterprise business rules engine.

### ❌ Hardcoding search indexes

Use environment/configuration and governed deployment:

```text
enterprise-kb-dev
enterprise-kb-uat
enterprise-kb-prod
```

### ❌ Ignoring document versions

A stale indexed document can produce a stale answer.

### ❌ No retrieval evaluation

A functioning search API does not necessarily mean good RAG.

---

# 34. Final Formula

For CWD:

```text
Enterprise Retrieval
=
Keyword Search
+
Vector Search
+
Hybrid Retrieval
+
Metadata Filtering
+
Security Filtering
+
Semantic Ranking
+
Provenance
```

And the complete RAG architecture becomes:

```text
Enterprise Knowledge
       ↓
Ingestion
       ↓
Chunking
       ↓
Embedding
       ↓
Azure AI Search Index
       ↓
────────────────────────
       ↓
User Query
       ↓
Query Embedding
       ↓
Keyword + Vector Search
       ↓
Hybrid Retrieval
       ↓
Metadata + Security Filtering
       ↓
Semantic Ranking
       ↓
Top Relevant Chunks
       ↓
Context Construction
       ↓
Governed Prompt
       ↓
LLM
       ↓
Grounded + Validated Answer
```

# Final Definition

**Azure AI Search is the enterprise retrieval layer in CWD that indexes governed enterprise knowledge and provides keyword search, vector similarity search, hybrid retrieval, metadata filtering, and semantic ranking to identify relevant evidence for RAG workflows. The RAG Worker, under CWD and LangGraph orchestration, uses Azure AI Search to retrieve authorized knowledge, applies security and business policies, constructs grounded context, and supplies that evidence to the LLM for response generation.**

### Interview-Ready Answer

> **“In our CWD architecture, Azure AI Search serves as the enterprise retrieval layer for RAG. During ingestion, enterprise documents are parsed, chunked, enriched with metadata and access-control information, embedded, and indexed. At runtime, the user's query can be processed through keyword, vector, or hybrid retrieval. Metadata and security filters restrict the candidate set, and semantic ranking improves the relevance of the final results. The RAG Worker then constructs authorized context from the retrieved chunks and passes it to the LLM through a governed prompt. LangGraph manages the retrieval workflow and recovery, while Policy/IAM handles authorization. Azure AI Search therefore focuses on finding and ranking enterprise knowledge rather than performing orchestration or making authorization decisions.”**

### One-Line Mental Model

```text
Azure AI Search = "Find the most relevant enterprise knowledge;
CWD + Policy = "Decide how and whether it may be used";
LLM = "Reason over that authorized evidence."
```
