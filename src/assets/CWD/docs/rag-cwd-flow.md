# End-to-End RAG Integration with the CWD Workflow

## Core Principle

In the CWD architecture, **RAG is not a standalone chatbot component**. It is a governed knowledge-retrieval capability that specialized Workers invoke as part of a larger Coordinator–Delegator–Worker workflow.

The complete relationship is:

```text id="q2c6v1"
User
 │
 ▼
Gateway
 │
 ▼
Coordinator
 │
 │  Understand intent / plan
 ▼
Delegator
 │
 │  Decompose domain task
 ▼
Specialized Worker
 │
 │  Need enterprise knowledge
 ▼
RAG Retrieval
 │
 ├── Enterprise Data Sources
 ├── Ingestion / Processing
 ├── Azure AI Search
 ├── ACL / Entitlement Filtering
 ├── Ranking / Deduplication
 └── Context Building
        │
        ▼
     LLM
        │
        ▼
Validated Grounded Result
        │
        ▼
Worker
        │
        ▼
Delegator
        │
        ▼
Coordinator
        │
        ▼
Gateway
        │
        ▼
User
```

The key architectural idea is:

> **CWD decides what needs to be done; RAG supplies authorized enterprise evidence needed to perform that work; the LLM reasons over that evidence.**

---

# 1. Where RAG Fits in CWD

CWD has two major planes.

### Execution plane

```text id="s7r1my"
User
 ↓
Gateway
 ↓
Coordinator
 ↓
Delegator
 ↓
Workers
 ↓
Enterprise systems
```

### Knowledge plane

```text id="e3q8hz"
Enterprise Sources
 ↓
Ingestion
 ↓
Parsing
 ↓
Chunking
 ↓
Metadata + ACL
 ↓
Embedding
 ↓
Azure AI Search
```

RAG connects these two planes:

```text id="qj5w4n"
Knowledge Plane
      │
      │ authorized retrieval
      ▼
Execution Plane
      │
      ▼
Worker + LLM
```

This separation is important because **the search index is not the enterprise system of record**. It is a retrieval representation of governed enterprise knowledge.

---

# 2. Complete CWD + RAG Architecture

```text id="x2c7qk"
                       ┌──────────────────┐
                       │      USER        │
                       └────────┬─────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │     GATEWAY      │
                       │ API / WebSocket  │
                       └────────┬─────────┘
                                │
                         Authentication
                                │
                                ▼
                       ┌──────────────────┐
                       │   COORDINATOR   │
                       │                  │
                       │ Intent           │
                       │ Planning         │
                       │ Authorization    │
                       │ Routing          │
                       └────────┬─────────┘
                                │
                              A2A
                                │
                                ▼
                       ┌──────────────────┐
                       │    DELEGATOR     │
                       │                  │
                       │ Domain Planning  │
                       │ Decomposition    │
                       │ Worker Selection │
                       └────────┬─────────┘
                                │
                                ▼
                  ┌─────────────────────────────┐
                  │      SPECIALIZED WORKER     │
                  │                             │
                  │ Business Logic              │
                  │ Retrieval Strategy           │
                  │ Tool / MCP Calls             │
                  └─────────────┬───────────────┘
                                │
                         Need Knowledge?
                                │
                                ▼
                       ┌──────────────────┐
                       │   RAG WORKFLOW   │
                       └────────┬─────────┘
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
              Intent         Entitlement    Task Context
                 │              │              │
                 └──────────────┼──────────────┘
                                ▼
                         Query Transformation
                                │
                                ▼
                       Azure AI Search
                         ┌──────┴──────┐
                         ▼             ▼
                      Vector       Keyword
                         │             │
                         └──────┬──────┘
                                ▼
                         Hybrid Results
                                │
                                ▼
                         ACL Filtering
                                │
                                ▼
                            Ranking
                                │
                                ▼
                         Deduplication
                                │
                                ▼
                       Context Assembly
                                │
                                ▼
                               LLM
                                │
                                ▼
                       Response Validation
                                │
                                ▼
                            Worker
                                │
                                ▼
                           Delegator
                                │
                                ▼
                          Coordinator
                                │
                                ▼
                            Gateway
                                │
                                ▼
                             USER
```

---

# 3. Gateway's Role

The Gateway is the entry point.

Typical responsibilities:

```text id="4s2hmg"
Authentication
Authorization
Request validation
Rate limiting
Correlation ID
Tenant/environment routing
Request size limits
```

Example:

```json id="ak8c7u"
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "user_id": "user-123",
  "message": "What is the latest manufacturing procedure?"
}
```

The Gateway should establish trusted identity context.

It should **not** perform the entire RAG process.

---

# 4. Coordinator's Role

The Coordinator determines the enterprise-level objective.

For example:

```text id="q5pvq4"
User:
"What is the latest procedure for inspecting equipment X?"
```

The Coordinator determines:

```text id="gq2c5a"
Intent:
procedure_lookup

Domain:
manufacturing

Task:
retrieve current approved procedure

Required capability:
manufacturing-knowledge
```

The Coordinator may create:

```json id="e3j3ae"
{
  "task_id": "TASK-1001",
  "intent": "procedure_lookup",
  "domain": "manufacturing",
  "required_capability": "manufacturing_knowledge",
  "expected_output": "approved_current_procedure"
}
```

Then it delegates the task.

---

# 5. Delegator's Role

The Delegator understands the domain-specific execution.

For example:

```text id="7f2kfz"
Coordinator
     │
     ▼
Manufacturing Delegator
```

The Delegator determines:

```text id="ibv0pd"
Need:
├── Equipment information
├── Manufacturing procedure
├── Safety requirements
└── Current approved version
```

It may choose:

```text id="mb4bkw"
Procedure Retrieval Worker
```

rather than directly interacting with the search engine.

This maintains separation of responsibilities.

---

# 6. Specialized Worker

The Worker is where RAG usually becomes an actual execution capability.

For example:

```text id="2d2h86"
Manufacturing Knowledge Worker
```

The Worker receives:

```json id="4rv1cn"
{
  "task_id": "TASK-1001",
  "domain": "manufacturing",
  "intent": "procedure_lookup",
  "query": "latest procedure for equipment X",
  "context": {
    "plant": "Plant-A",
    "equipment": "Equipment-X"
  }
}
```

The Worker then determines:

> “I need authorized enterprise knowledge to complete this task.”

This triggers the RAG workflow.

---

# 7. Worker Does Not Directly Give the LLM the Whole Enterprise Database

A dangerous architecture would be:

```text id="n4p0ma"
Worker
  ↓
Enterprise Database
  ↓
LLM
```

Instead:

```text id="qv0mga"
Worker
  ↓
Retrieval Layer
  ↓
Authorized Evidence
  ↓
Context Builder
  ↓
LLM
```

The Worker controls the task, while the retrieval layer controls which knowledge is retrieved.

---

# 8. Enterprise Data Sources

The knowledge plane can ingest from:

```text id="6tq8ne"
SharePoint
Confluence
Document Management Systems
Internal Websites
PDF / Word / PowerPoint
Engineering Documentation
Manufacturing Procedures
Quality Systems
Knowledge Bases
CRM
ERP
Service Management
Databases
Data Lakes
Object Storage
Internal APIs
```

But an important distinction is:

### Knowledge-oriented information

Use RAG:

```text id="1h35u8"
Policies
Procedures
Manuals
Standards
FAQs
Engineering documentation
Historical reports
```

### Live transactional information

Usually use API/MCP/tool execution:

```text id="7i8vkm"
Current inventory
Current shipment status
Current production quantity
Current ticket status
Current account balance
```

Therefore:

```text id="h7e5kj"
Static / Slow-changing Knowledge
          ↓
         RAG

Live Operational State
          ↓
       API / MCP
```

A Worker can use **both** in the same task.

---

# 9. RAG Ingestion Pipeline

Before runtime retrieval, enterprise content must be prepared.

```text id="0g7rxy"
Enterprise Sources
       │
       ▼
Source Connectors
       │
       ▼
Authentication
       │
       ▼
Authorization
       │
       ▼
Document Extraction
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
Metadata
       │
       ▼
ACL / Security Metadata
       │
       ▼
Embeddings
       │
       ▼
Azure AI Search
```

Each chunk should retain enough lineage to determine:

```text id="8b0d0x"
Where did this come from?
What version is it?
Who owns it?
What domain does it belong to?
Who can access it?
When is it valid?
```

---

# 10. Azure AI Search as the Retrieval Layer

At runtime, the Worker can invoke Azure AI Search.

The search layer can support:

```text id="u3qz7v"
Keyword Search
Vector Search
Hybrid Search
Metadata Filtering
Security Filtering
Semantic Ranking
```

Conceptually:

```text id="ak9b6e"
Query
 │
 ├───────────────┐
 ▼               ▼
Keyword        Vector
Search         Search
 │               │
 └───────┬───────┘
         ▼
       Hybrid
         │
         ▼
      Filtering
         │
         ▼
       Ranking
```

---

# 11. Entitlement-Aware Retrieval

The Worker must know the user's authorization context.

For example:

```text id="8u8d6g"
User:
Alice

Groups:
engineering
plant-a
quality
```

The search index contains:

```text id="d0sm6j"
Chunk A
ACL = engineering

Chunk B
ACL = finance

Chunk C
ACL = plant-a
```

Results:

```text id="z4u7w1"
A ✓
B ✗
C ✓
```

The unauthorized content should never enter the LLM context.

Therefore:

```text id="p2w7qm"
Relevant
   ∩
Authorized
   ∩
Applicable
```

defines the usable evidence.

---

# 12. Context-Aware Retrieval

The Worker does not just send the raw query.

It can use:

```text id="6n3yby"
User Intent
Domain
Query Type
Task Context
User Entitlements
Business Filters
Temporal Requirements
```

For example:

```json id="a9w8se"
{
  "query": "What is the latest inspection procedure?",
  "intent": "procedure_lookup",
  "domain": "manufacturing",
  "query_type": "current_policy_or_procedure",
  "task_context": {
    "plant": "Plant-A",
    "equipment": "Equipment-X"
  },
  "filters": {
    "status": "approved",
    "document_type": "procedure"
  }
}
```

This produces much better retrieval than:

```text
vector_search("What is the latest inspection procedure?")
```

---

# 13. Retrieved Chunks Are Candidates

Suppose Azure AI Search returns 20 chunks.

They are not automatically sent to the LLM.

CWD processes them:

```text id="3xjvnm"
20 candidates
     │
     ▼
ACL filtering
     │
     ▼
16 authorized
     │
     ▼
Business filtering
     │
     ▼
12 applicable
     │
     ▼
Ranking
     │
     ▼
Deduplication
     │
     ▼
8 unique chunks
     │
     ▼
Diversity / coverage
     │
     ▼
5 selected
     │
     ▼
Token budget
     │
     ▼
Final context
```

---

# 14. Context Assembly

The context builder transforms selected chunks into structured evidence.

For example:

```text id="7g8d3p"
ENTERPRISE CONTEXT

Source: Manufacturing Procedure
Document: Equipment-X Inspection Procedure
Version: 4.2
Status: Approved
Effective Date: 2026-06-01
Section: Inspection Steps

[Chunk 1]
...

Source: Equipment Manual
Document: Equipment-X Operations Manual
Version: 8.1
Section: Safety Requirements

[Chunk 2]
...
```

This is much better than simply concatenating raw text.

---

# 15. Why Provenance Is Important

The Worker should preserve:

```text id="y69w3b"
document_id
chunk_id
source
section
version
page
effective_date
classification
```

This enables the final response to say:

```text id="0h7wmt"
According to the approved Equipment-X inspection procedure,
the inspection must be performed...
```

and provide appropriate source references where the application supports them.

It also makes the answer reproducible.

---

# 16. Prompt Registry Integration

The final generation prompt should ideally come from the centralized Prompt Registry.

For example:

```text id="d0r5uw"
Prompt ID:
manufacturing-procedure-answer

Version:
3.1.0

Status:
approved
```

The Worker resolves:

```text id="f1n5kr"
Task
 ↓
Approved Prompt
 ↓
Authorized Context
 ↓
LLM
```

The prompt version should be captured as part of workflow execution metadata.

This gives:

```text id="7p1i6f"
Prompt
+
Model
+
Retrieved Evidence
+
Task
```

a reproducible execution record.

---

# 17. LLM's Role

The LLM should not be responsible for:

```text id="8h7f6r"
Finding enterprise documents
Authorizing users
Selecting ACLs
Determining permissions
Executing unrestricted tools
```

Its primary responsibility here is:

```text id="0etj1p"
Understand Context
       +
Reason
       +
Synthesize
       +
Generate
```

The architecture is:

```text id="r5p9yd"
RAG
→ Provides evidence

Policy
→ Controls access

Prompt Registry
→ Provides governed instructions

LLM
→ Reasons over evidence
```

---

# 18. Response Validation

The generated answer should pass validation before being returned.

Possible checks:

```text id="4gr6m0"
Schema validation
Grounding
Citation/provenance
Sensitive-data leakage
Safety
Policy compliance
Unsupported claims
```

For example:

```text id="vb9r4x"
LLM Answer
   │
   ▼
Grounding Validator
   │
   ├── Supported → Continue
   │
   └── Unsupported → Retry / Correct / Escalate
```

---

# 19. Worker Result

The Worker should return a structured result to the Delegator rather than raw LLM output alone.

```json id="z9j8l4"
{
  "task_id": "TASK-1001",
  "status": "completed",
  "result": {
    "answer": "The latest approved inspection procedure...",
    "sources": [
      {
        "document_id": "DOC-5001",
        "version": "4.2",
        "section": "Inspection Steps"
      }
    ]
  },
  "retrieval": {
    "strategy": "hybrid",
    "initial_candidates": 20,
    "final_chunks": 5
  }
}
```

The Worker has now converted:

```text id="7x9k2c"
Enterprise Knowledge
      ↓
Retrieved Evidence
      ↓
Grounded Answer
      ↓
Structured Domain Result
```

---

# 20. Delegator Aggregation

Suppose the Delegator has three Workers:

```text id="k3n8rp"
Procedure Worker
Equipment Worker
Safety Worker
```

They may execute in parallel:

```text id="f7f3yt"
                  Delegator
                 /    |     \
                /     |      \
               ▼      ▼       ▼
         Procedure Equipment Safety
            Worker    Worker   Worker
               │        │       │
               ▼        ▼       ▼
             RAG      API/RAG   RAG
                \       |       /
                 \      |      /
                  ▼     ▼     ▼
                  Domain Result
```

The Delegator aggregates these results.

---

# 21. Coordinator Aggregation

The Coordinator receives:

```text id="e2jv89"
Domain Result
```

and combines it with other domain results if necessary.

For example:

```text id="x7dy6b"
Manufacturing Result
+
Quality Result
+
Safety Result
```

The Coordinator determines the enterprise-level response.

---

# 22. Complete Request Lifecycle

Let's walk through a realistic example.

User asks:

> **“Why did the production line experience a yield drop, and what procedure should we follow?”**

### Step 1 — Gateway

```text id="j4g7m0"
Authenticate user
Create/propagate correlation ID
```

### Step 2 — Coordinator

Determines:

```text id="1aqc2d"
Intent = root_cause_analysis + procedure_lookup
Domain = manufacturing
```

### Step 3 — Delegator

Decomposes:

```text id="f0b8u4"
Task A → Analyze yield issue
Task B → Retrieve applicable procedure
```

### Step 4 — Workers

```text id="x8p3c2"
Yield Analysis Worker
Procedure Retrieval Worker
```

### Step 5 — Retrieval

Procedure Worker determines:

```text id="x3q5d1"
Plant = Plant-A
Equipment = Equipment-X
Document Type = Procedure
Status = Approved
```

### Step 6 — Authorization

```text id="e7h3cx"
User Entitlements
        +
Document ACL
        ↓
Authorized Search Space
```

### Step 7 — Search

```text id="m2r5q6"
Hybrid Search
```

### Step 8 — Ranking

```text id="h5n1dz"
Relevance
+
Authority
+
Freshness
+
Business Applicability
```

### Step 9 — Deduplication

Remove repeated chunks.

### Step 10 — Context Assembly

Combine the best evidence.

### Step 11 — LLM

Generate grounded analysis.

### Step 12 — Validation

Check grounding and policy.

### Step 13 — Worker

Return structured result.

### Step 14 — Delegator

Aggregate.

### Step 15 — Coordinator

Synthesize final enterprise response.

### Step 16 — Gateway

Return response to user.

---

# 23. CWD + RAG + MCP

MCP can optionally standardize how Workers access retrieval capabilities.

For example:

```text id="p0y5y1"
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
```

The MCP server could expose capabilities such as:

```text id="5qf4mz"
search_knowledge
get_document
get_document_metadata
find_related_documents
```

But remember:

```text id="g1r4dp"
MCP
=
Integration Protocol

Azure AI Search
=
Retrieval Engine

Policy/IAM
=
Authorization

LangGraph
=
Workflow Orchestration
```

MCP does not replace the security model.

---

# 24. CWD + RAG + A2A

A2A handles agent boundaries:

```text id="x1r3dy"
Coordinator
      │
      │ A2A
      ▼
Manufacturing Delegator
      │
      ▼
Knowledge Worker
```

RAG operates inside the Worker:

```text id="2q8v1a"
Knowledge Worker
      │
      ▼
RAG
      │
      ▼
Azure AI Search
```

So:

```text id="m5z7g2"
A2A
→ Agent-to-Agent communication

RAG
→ Enterprise knowledge retrieval

MCP
→ Tool/system integration

LangGraph
→ Workflow/state management
```

---

# 25. CWD + RAG + LangGraph

A Worker can implement its retrieval workflow using LangGraph:

```text id="g7q2ps"
START
  │
  ▼
Receive Task
  │
  ▼
Analyze Query
  │
  ▼
Determine Intent
  │
  ▼
Resolve Entitlements
  │
  ▼
Select Retrieval Strategy
  │
  ▼
Retrieve
  │
  ▼
ACL Filter
  │
  ▼
Rank
  │
  ▼
Deduplicate
  │
  ▼
Build Context
  │
  ▼
Generate
  │
  ▼
Validate
  │
  ├── Good → Return
  │
  └── Poor → Rewrite Query
                    │
                    └── Retrieve
```

This is a good example of **LangGraph orchestrating RAG rather than being the retrieval engine itself**.

---

# 26. Failure Handling

Production RAG must handle failures.

### No results

```text id="s2s0nz"
Search
 ↓
0 authorized results
 ↓
Query refinement
 ↓
Retry
 ↓
Still none
 ↓
Controlled "No evidence found"
```

The LLM should not invent an answer.

---

### Search unavailable

```text id="1cy4gk"
Azure AI Search unavailable
       ↓
Retry
       ↓
Fallback / Recovery
       ↓
Escalation
```

---

### Poor retrieval

```text id="l8u4xa"
Low evidence quality
       ↓
Query rewrite
       ↓
Hybrid search
       ↓
Re-rank
```

---

### Authorization failure

```text id="n8p5i0"
Authorization failure
       ↓
STOP
```

Do **not** retry authorization failures as if they were transient search failures.

---

# 27. Observability Across the Entire Flow

A single correlation ID should follow:

```text id="v8y6d0"
Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
RAG
  ↓
Azure AI Search
  ↓
LLM
  ↓
Worker
  ↓
Delegator
  ↓
Coordinator
  ↓
Gateway
```

Example telemetry:

```json id="j0t2r6"
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "TASK-1001",
  "agent_id": "manufacturing-agent",
  "worker_id": "procedure-worker",
  "intent": "procedure_lookup",
  "domain": "manufacturing",
  "retrieval_mode": "hybrid",
  "initial_candidates": 30,
  "authorized_candidates": 18,
  "final_chunks": 6,
  "prompt_id": "procedure-answer",
  "prompt_version": "3.1.0",
  "model": "approved-model",
  "duration_ms": 4200
}
```

This allows the enterprise to reproduce and investigate a response.

---

# 28. Security Architecture

The complete security path should look like:

```text id="6t4z8a"
User Identity
      │
      ▼
Gateway Authentication
      │
      ▼
Coordinator Authorization
      │
      ▼
Agent Identity
      │
      ▼
Worker Authorization
      │
      ▼
User Entitlements
      │
      ▼
Document ACL
      │
      ▼
Search Security Filter
      │
      ▼
Authorized Context
      │
      ▼
LLM
      │
      ▼
Output Validation
```

This gives defense in depth.

---

# 29. Critical Separation of Responsibilities

| Component       | RAG Responsibility                         |
| --------------- | ------------------------------------------ |
| Gateway         | Authentication, ingress authorization      |
| Coordinator     | Intent, enterprise planning, risk          |
| Delegator       | Domain decomposition and Worker selection  |
| Worker          | Retrieval execution and business reasoning |
| RAG pipeline    | Knowledge retrieval and grounding          |
| Azure AI Search | Search, filtering, ranking                 |
| IAM/Policy      | Entitlement and authorization decisions    |
| Prompt Registry | Governed generation instructions           |
| LangGraph       | RAG workflow/state/recovery                |
| MCP             | Optional standardized integration          |
| LLM             | Reasoning and response generation          |
| Observability   | Retrieval/execution telemetry              |
| Audit           | Governance evidence                        |

---

# 30. What RAG Does Not Do

RAG should **not** be confused with:

```text id="0qf8z9"
❌ Authentication
❌ Authorization
❌ Agent orchestration
❌ Workflow management
❌ Tool execution
❌ Enterprise system of record
❌ Business-rule enforcement
❌ LLM reasoning
```

Instead:

```text id="p8q4m7"
RAG
=
Enterprise Evidence Retrieval + Context Grounding
```

---

# 31. The Most Important Architectural Boundary

The cleanest mental model is:

```text id="q6k4we"
                  CWD
                   │
          "What needs to be done?"
                   │
                   ▼
               Worker
                   │
          "What evidence do I need?"
                   │
                   ▼
                 RAG
                   │
       "What authorized evidence exists?"
                   │
                   ▼
                Search
                   │
          "Find relevant evidence"
                   │
                   ▼
              Context
                   │
        "What should the LLM see?"
                   │
                   ▼
                 LLM
                   │
           "What does it mean?"
                   │
                   ▼
               Result
```

This separation prevents architecture from becoming a monolithic “LLM application.”

---

# 32. End-to-End Formula

A useful CWD formula is:

```text id="4v5w9x"
CWD + RAG
=
Gateway
+
Intent & Planning
+
Domain Delegation
+
Specialized Worker
+
Authorized Knowledge Retrieval
+
Filtering
+
Ranking
+
Context Assembly
+
Governed Prompt
+
LLM Generation
+
Response Validation
+
Aggregation
+
Observability
```

Or more specifically:

```text id="1y9p2m"
Enterprise Grounded Response
=
CWD Orchestration
+
Authorized Enterprise Evidence
+
Governed Prompt
+
LLM Reasoning
+
Validation
```

---

# 33. Interview-Ready Answer

> **“In our CWD architecture, RAG is integrated as a governed knowledge capability used by specialized Workers rather than being embedded directly into the Coordinator. The Gateway authenticates the user and establishes the correlation context. The Coordinator determines the intent, domain, and high-level task, and the Delegator decomposes that task and selects the appropriate specialized Worker. When a Worker needs enterprise knowledge, it invokes the RAG workflow. The RAG layer uses the user's intent, domain, query type, task context, and entitlements to determine the retrieval strategy and search filters. Enterprise content has previously been ingested from sources such as SharePoint, applications, databases, and document repositories, parsed, chunked, enriched with metadata and ACLs, embedded, and indexed in Azure AI Search. At runtime, the Worker retrieves candidates using keyword, vector, or hybrid search, applies entitlement and business filters, ranks and deduplicates the chunks, and assembles a provenance-aware context within the token budget. An approved prompt from the Prompt Registry and that authorized context are then supplied to the LLM. The generated answer is validated for grounding, security, and policy compliance before the Worker returns a structured result to the Delegator, which aggregates domain results and returns them to the Coordinator for final response synthesis. LangGraph manages the stateful workflow and recovery, A2A handles agent communication, MCP can standardize tool or knowledge-system integration, and Policy/IAM remains the authorization authority.”**

---

# Final Definition

**RAG integration with CWD is the architecture in which the Gateway establishes trusted user context, the Coordinator determines enterprise intent and task objectives, the Delegator decomposes domain work, and specialized Workers invoke a governed retrieval workflow to obtain relevant and authorized enterprise evidence. The RAG layer retrieves from indexed enterprise knowledge using intent-, domain-, task-, and entitlement-aware strategies; filters, ranks, deduplicates, and assembles the evidence into a controlled context; and supplies that context through an approved prompt to the LLM for grounded generation. The validated Worker result then flows back through the Delegator and Coordinator to the Gateway and user.**

### The Complete Mental Model

```text id="z0m7ap"
USER
  │
  ▼
GATEWAY
  │
  │ Identity + Correlation
  ▼
COORDINATOR
  │
  │ Intent + Plan
  ▼
DELEGATOR
  │
  │ Domain Decomposition
  ▼
SPECIALIZED WORKER
  │
  │ Need Enterprise Knowledge
  ▼
RAG
  │
  ├── Query Understanding
  ├── Entitlement Resolution
  ├── Search Strategy
  ├── Azure AI Search
  ├── ACL Filtering
  ├── Ranking
  ├── Deduplication
  ├── Context Assembly
  └── Provenance
       │
       ▼
  APPROVED PROMPT
       │
       ▼
      LLM
       │
       ▼
RESPONSE VALIDATION
       │
       ▼
   WORKER RESULT
       │
       ▼
   DELEGATOR
       │
       ▼
  COORDINATOR
       │
       ▼
    GATEWAY
       │
       ▼
      USER
```

> **CWD orchestrates the work, Workers invoke knowledge capabilities, RAG retrieves authorized evidence, Azure AI Search finds and ranks it, the Context Builder determines what the LLM sees, the LLM reasons over that evidence, and CWD returns the validated result.**
