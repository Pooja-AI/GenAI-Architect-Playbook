# Intent-Aware Retrieval in Enterprise RAG

## Core Principle

In an enterprise RAG system, **retrieval should not be driven by the query text alone**.

The same words can require completely different retrieval strategies depending on:

* **User intent** — What does the user actually want?
* **Domain** — Which business/technical area is involved?
* **Query type** — Is this a factual lookup, policy question, comparison, troubleshooting request, analytical question, etc.?
* **Task context** — What workflow, agent, previous conversation, business object, constraints, and expected output are involved?

The core idea is:

```text
User Query
    │
    ▼
Intent Understanding
    │
    ├── Domain
    ├── Query Type
    ├── Task Context
    ├── User Entitlements
    └── Business Constraints
          │
          ▼
    Retrieval Strategy
          │
    ┌─────┼───────────────┐
    ▼     ▼               ▼
  Search Filters      Ranking       Knowledge Sources
    │                   │               │
    └───────────────────┼───────────────┘
                        ▼
               Relevant + Authorized
                     Evidence
                        │
                        ▼
                       LLM
```

A useful formula is:

```text
Retrieval Strategy
=
f(Intent, Domain, Query Type, Task Context, Entitlements)
```

---

# 1. Why Query Text Alone Is Not Enough

Consider the query:

> “What is the latest procedure?”

That query is ambiguous.

It could mean:

```text
Engineering procedure
Quality procedure
HR procedure
Manufacturing procedure
Security procedure
Finance procedure
```

Even after identifying the domain, **“latest procedure”** could mean:

```text
latest modified
latest approved
latest effective
latest published
```

Therefore, enterprise retrieval needs contextual understanding.

```text
Query
"What is the latest procedure?"
       │
       ▼
Context
├── User = Engineer
├── Domain = Manufacturing
├── Plant = Plant A
├── Task = Quality investigation
└── Current date = ...
       │
       ▼
Retrieval Strategy
├── domain = manufacturing
├── plant = plant-a
├── document_type = procedure
├── status = approved
└── sort/rank by effective_date
```

The result is dramatically better than unrestricted vector search.

---

# 2. Four Important Retrieval Signals

## 2.1 User Intent

Intent answers:

> **What does the user want to accomplish?**

Examples:

```text
"Find the travel policy"
→ policy_lookup

"Why did shipment X get delayed?"
→ root_cause_analysis

"Compare these two procedures"
→ comparison

"How do I reset the equipment?"
→ procedural_instruction

"What changed in the policy?"
→ change_analysis

"Summarize this document"
→ summarization
```

Intent determines the retrieval behavior.

---

## 2.2 Domain

Domain answers:

> **Which business or technical area owns the knowledge?**

Examples:

```text
HR
Finance
Engineering
Manufacturing
Supply Chain
Quality
Legal
Security
IT
Customer Support
Procurement
```

For example:

```text
"What is the escalation process?"
```

could mean:

```text
IT escalation
Customer escalation
Manufacturing escalation
Security escalation
HR escalation
```

Domain identification allows the search space to be narrowed.

---

## 2.3 Query Type

Query type describes the nature of the information request.

Examples:

| Query Type      | Example                            | Retrieval Behavior                  |
| --------------- | ---------------------------------- | ----------------------------------- |
| Fact lookup     | "What is the warranty period?"     | Exact + semantic                    |
| Policy          | "What is our remote-work policy?"  | Authoritative policy docs           |
| Procedure       | "How do I calibrate this machine?" | Procedure/SOP retrieval             |
| Troubleshooting | "Why is the sensor failing?"       | Technical docs + known issues       |
| Comparison      | "Compare A and B"                  | Retrieve evidence for both          |
| Historical      | "What was the policy in 2024?"     | Time/version filtering              |
| Analytical      | "What caused the increase?"        | Multiple sources                    |
| Summarization   | "Summarize this report"            | Document-scoped retrieval           |
| Definition      | "What is OEE?"                     | Knowledge/definition sources        |
| Recommendation  | "Which process should we use?"     | Multi-source + policy + constraints |

---

# 3. Task Context

Task context answers:

> **What larger business workflow is this retrieval supporting?**

This is particularly important in CWD.

Suppose the Worker is handling:

```text
Task:
Analyze shipment delay
```

Then the query:

```text
"Why is shipment delayed?"
```

should not search the entire enterprise.

The context may already contain:

```json
{
  "domain": "logistics",
  "task": "shipment_delay_analysis",
  "shipment_id": "SHIP123",
  "carrier": "Carrier-A",
  "region": "US"
}
```

The retrieval system can use this information to select:

```text
Logistics knowledge
Carrier documentation
Shipment events
Delay procedures
Regional policies
```

rather than unrelated enterprise documents.

---

# 4. Context-Enriched Retrieval

Instead of:

```text
Retrieve(query)
```

CWD should conceptually perform:

```text
Retrieve(
    query,
    intent,
    domain,
    query_type,
    task_context,
    user_entitlements,
    business_constraints
)
```

For example:

```json
{
  "query": "What caused the shipment delay?",
  "intent": "root_cause_analysis",
  "domain": "logistics",
  "query_type": "analytical",
  "task_context": {
    "shipment_id": "SHIP123",
    "carrier": "Carrier-A",
    "region": "US"
  },
  "entitlements": {
    "groups": [
      "logistics",
      "shipping-operations"
    ]
  }
}
```

This becomes the input to the retrieval planner.

---

# 5. Intent Determines Retrieval Strategy

Different intents should produce different retrieval strategies.

### Policy lookup

```text
Intent = policy_lookup
```

Prefer:

```text
Document Type = Policy
Status = Approved
Effective Date = Current
Domain = Relevant Domain
```

---

### Troubleshooting

```text
Intent = troubleshooting
```

Prefer:

```text
SOPs
Troubleshooting Guides
Known Issues
Engineering Documentation
Incident Reports
```

---

### Historical question

```text
Intent = historical_lookup
```

Prefer:

```text
Version filtering
Effective dates
Historical documents
Archived policies
```

---

### Comparison

```text
Intent = comparison
```

Retrieve:

```text
Source A
+
Source B
```

and ensure that both are represented in the final context.

---

# 6. Domain Influences Search Filters

Suppose the user asks:

> “What is the procedure?”

Intent:

```text
procedure_lookup
```

Domain:

```text
manufacturing
```

Then the search can apply:

```text
domain = manufacturing
document_type = procedure
status = approved
```

Conceptually:

```text
User Query
    │
    ▼
Intent = Procedure
Domain = Manufacturing
    │
    ▼
Search Filter
    │
    ├── domain = manufacturing
    ├── document_type = procedure
    └── status = approved
```

This reduces irrelevant search candidates.

---

# 7. Query Type Influences Search Mode

Not every question should use the same retrieval method.

### Exact lookup

Example:

> “What is shipment ID SHIP123?”

Use:

```text
Keyword / exact matching
```

because identifiers are poorly suited to purely semantic retrieval.

---

### Conceptual question

> “What are the causes of semiconductor yield loss?”

Use:

```text
Vector / semantic retrieval
```

---

### Technical identifier + semantic meaning

> “Why is error E104 occurring on the deposition system?”

Use:

```text
Hybrid Search
```

because:

```text
"E104"
```

requires lexical matching while:

```text
"deposition system failure"
```

benefits from semantic matching.

---

# 8. Retrieval Strategy Selection

A CWD retrieval planner can conceptually select:

```text
Strategy
├── keyword
├── vector
├── hybrid
├── metadata-filtered
├── document-specific
├── temporal
├── multi-query
├── graph/relationship retrieval
└── structured data/API retrieval
```

For example:

```python
def choose_strategy(intent, query_type, domain):

    if intent == "exact_lookup":
        return "keyword"

    if query_type == "historical":
        return "temporal_hybrid"

    if intent == "comparison":
        return "multi_source_hybrid"

    if query_type == "technical":
        return "hybrid"

    return "hybrid"
```

In production, this should be governed by policies and evaluated configurations rather than relying blindly on an LLM.

---

# 9. User Intent Influences Query Transformation

The original query may be transformed before retrieval.

Example:

```text
User:
"Why did shipment 123 get delayed?"
```

Intent:

```text
root_cause_analysis
```

The retrieval planner may generate several retrieval queries:

```text
Query 1:
shipment 123 delay events

Query 2:
carrier capacity constraints

Query 3:
shipment delay procedures

Query 4:
shipping disruption causes
```

This is essentially **multi-query retrieval**.

The goal is to retrieve evidence covering different aspects of the user's intent.

---

# 10. Domain-Aware Query Expansion

Suppose:

```text
Domain = Semiconductor Manufacturing
```

User asks:

> “What caused the yield drop?”

The system might recognize domain terminology:

```text
yield
defect rate
process excursion
equipment issue
wafer
lot
process parameter
```

A domain-aware retrieval strategy can use these concepts to improve recall.

But this expansion should be controlled.

```text
LLM
 ↓
Suggested Query Expansion
 ↓
Policy / Retrieval Rules
 ↓
Approved Search Queries
```

The LLM should not be allowed to invent arbitrary access filters.

---

# 11. Task Context Influences Knowledge Sources

Different tasks may require different source types.

For example:

### Shipment investigation

```text
Shipment Events
+
Carrier APIs
+
Shipping Procedures
+
Historical Incidents
```

### HR policy question

```text
HR Policies
+
Employee Handbook
+
Benefits Documentation
```

### Engineering troubleshooting

```text
Engineering Manuals
+
SOPs
+
Known Issues
+
Incident Reports
+
Equipment Data
```

Therefore:

```text
Task Type
   ↓
Knowledge Source Selection
```

is an important enterprise retrieval capability.

---

# 12. RAG Is Not Always the Correct Retrieval Mechanism

This is an important architect-level distinction.

Suppose the user asks:

> “What is the current inventory quantity?”

A static RAG document may be inappropriate.

Instead:

```text
User
 ↓
Coordinator
 ↓
Intent = live_inventory_lookup
 ↓
Inventory Worker
 ↓
MCP/API
 ↓
ERP / Inventory System
```

Whereas:

> “What is the inventory policy?”

may use:

```text
RAG
 ↓
Policy Documents
```

Therefore:

```text
Intent
   ↓
Knowledge Retrieval vs Live Tool/API
```

can be part of the routing decision.

---

# 13. Knowledge Source Selection

CWD can maintain a conceptual source registry:

```json
{
  "domain": "logistics",
  "sources": [
    {
      "name": "shipping-policies",
      "type": "rag",
      "supported_queries": [
        "policy",
        "procedure"
      ]
    },
    {
      "name": "shipment-system",
      "type": "api",
      "supported_queries": [
        "live_status",
        "tracking"
      ]
    },
    {
      "name": "carrier-system",
      "type": "mcp",
      "supported_queries": [
        "carrier_status"
      ]
    }
  ]
}
```

This lets CWD determine:

```text
What knowledge source should answer this question?
```

---

# 14. Ranking Is Also Context-Aware

After filtering, ranking should consider more than vector similarity.

Conceptually:

```text
Final Relevance
=
Semantic Relevance
+
Lexical Relevance
+
Domain Relevance
+
Intent Relevance
+
Business Applicability
+
Authority
+
Freshness
```

Security is different:

```text
Authorization = Eligibility Constraint
```

It should generally not simply be treated as a positive ranking signal.

---

# 15. Authority Matters

Suppose retrieval returns:

```text
Document A
Official Corporate Policy
Similarity = 0.91

Document B
Employee Discussion
Similarity = 0.95
```

For a policy question, Document A may deserve higher priority because it is authoritative.

Metadata could contain:

```json
{
  "document_type": "policy",
  "authority_level": "official",
  "status": "approved",
  "owner": "HR"
}
```

Therefore:

```text
Similarity
+
Authority
```

is more useful than similarity alone.

---

# 16. Freshness Matters

Suppose:

```text
Policy A
Modified: 2024
Similarity = 0.95

Policy B
Modified: 2026
Similarity = 0.92
```

For:

> “What is the current policy?”

Policy B should normally be favored if it is approved and effective.

This is where task context and query intent influence ranking.

```text
Intent = current_policy
        ↓
Freshness / effective-date signal
        ↓
Current approved document
```

For:

> “What was the policy in 2024?”

the ranking behavior changes.

---

# 17. Temporal Intent

Temporal words are important:

```text
current
latest
today
historical
in 2024
last year
previous version
at that time
effective from
```

These should influence retrieval filters.

Example:

```text
"What was the travel policy in 2024?"
```

Conceptually:

```text
domain = HR
document_type = policy
effective_date <= 2024-12-31
expiration_date >= 2024-01-01
```

The exact temporal logic depends on the enterprise's document lifecycle model.

---

# 18. Business Context

Suppose the enterprise operates:

```text
Plant A
Plant B
Plant C
```

Query:

> “What is the maintenance procedure?”

Task context:

```json
{
  "plant": "Plant-A",
  "equipment": "etching-system"
}
```

Retrieval should prefer:

```text
plant = Plant-A
equipment = etching-system
document_type = maintenance_procedure
```

rather than generic enterprise maintenance documentation.

---

# 19. Entitlements Still Apply

Intent and domain do **not** override security.

Suppose:

```text
Intent = engineering_analysis
Domain = engineering
```

but the user has:

```text
Engineering
Plant-A
```

The search must still apply:

```text
User Entitlements
+
ACL
```

Therefore:

```text
Intent
+
Domain
+
Query Type
+
Task Context
+
Authorization
```

all contribute to retrieval.

---

# 20. Complete Retrieval Decision Model

A useful CWD architecture model is:

```text
                         USER QUERY
                              │
                              ▼
                    ┌──────────────────┐
                    │ Intent Analysis  │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
          Domain         Query Type       Task Context
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                   Retrieval Planner
                             │
               ┌─────────────┼───────────────┐
               ▼             ▼               ▼
           Search Mode    Search Filters   Sources
               │             │               │
               └─────────────┼───────────────┘
                             ▼
                      Entitlement Filter
                             │
                             ▼
                  Azure AI Search / APIs
                             │
                             ▼
                         Candidates
                             │
                             ▼
                         Re-ranking
                             │
                             ▼
                    Relevant Evidence
                             │
                             ▼
                    Context Construction
                             │
                             ▼
                            LLM
```

---

# 21. Where This Fits in CWD

The architecture can be mapped directly to CWD.

### Coordinator

Understands:

```text
Enterprise intent
Business objective
Risk
Required domain
High-level task
```

### Delegator

Understands:

```text
Domain
Domain-specific task
Required knowledge
Required Workers
```

### RAG Worker

Determines:

```text
Query transformation
Retrieval strategy
Search filters
Ranking configuration
Knowledge sources
```

### Policy/IAM

Determines:

```text
What the user/agent is allowed to access
```

### Azure AI Search

Performs:

```text
Keyword
Vector
Hybrid
Filtering
Ranking
```

### LLM

Performs:

```text
Reasoning
Synthesis
Answer generation
```

---

# 22. LangGraph Workflow

LangGraph can orchestrate this process:

```text
START
  │
  ▼
Analyze Intent
  │
  ▼
Identify Domain
  │
  ▼
Classify Query Type
  │
  ▼
Load Task Context
  │
  ▼
Resolve Entitlements
  │
  ▼
Select Retrieval Strategy
  │
  ▼
Build Search Filters
  │
  ▼
Retrieve
  │
  ▼
Security Filter
  │
  ▼
Re-rank
  │
  ▼
Enough Evidence?
 ┌──────┴───────┐
 │              │
Yes             No
 │              │
 ▼              ▼
Context      Query Rewrite
 │              │
 │              └──────→ Retrieve
 ▼
Generate
 │
 ▼
Validate Grounding
 │
 ▼
END
```

This is where LangGraph becomes valuable: **it coordinates the retrieval lifecycle and conditional paths; it does not replace Azure AI Search or the authorization system.**

---

# 23. Example Retrieval State

Conceptually:

```python
state = {
    "query": "What caused shipment SHIP123 to be delayed?",

    "intent": "root_cause_analysis",

    "domain": "logistics",

    "query_type": "analytical",

    "task_context": {
        "shipment_id": "SHIP123",
        "carrier": "Carrier-A",
        "region": "US"
    },

    "entitlements": {
        "groups": [
            "logistics",
            "shipping-operations"
        ]
    },

    "retrieval_strategy": {
        "mode": "hybrid",
        "top_k": 20,
        "rerank": True
    },

    "filters": {
        "domain": "logistics",
        "region": "US",
        "status": "approved"
    }
}
```

The state captures **why** the retrieval system made its retrieval decisions.

---

# 24. Intent-to-Retrieval Matrix

| Intent              | Query Type  | Search Strategy     | Important Filters       | Ranking Signals           |
| ------------------- | ----------- | ------------------- | ----------------------- | ------------------------- |
| Policy lookup       | Policy      | Hybrid              | domain, type, approved  | authority, effective date |
| Procedure           | Instruction | Hybrid              | domain, type, equipment | authority, relevance      |
| Exact lookup        | Fact        | Keyword             | entity ID               | exact match               |
| Conceptual question | Knowledge   | Vector/Hybrid       | domain                  | semantic relevance        |
| Troubleshooting     | Technical   | Hybrid              | equipment, error code   | lexical + semantic        |
| Historical          | Temporal    | Hybrid              | effective date/version  | temporal relevance        |
| Comparison          | Analytical  | Multi-source hybrid | entities A/B            | coverage + relevance      |
| Current status      | Live data   | API/MCP             | business object         | freshness                 |
| Root-cause analysis | Analytical  | Multi-query hybrid  | domain/context          | evidence coverage         |
| Recommendation      | Decision    | Multi-source        | domain/policy           | authority + applicability |

---

# 25. Retrieval Should Be Intent-Specific, Not One-Size-Fits-All

A weak RAG architecture does:

```text
Every Query
    ↓
Vector Search Top-5
    ↓
LLM
```

An enterprise architecture does:

```text
Query
 ↓
Intent
 ↓
Domain
 ↓
Query Type
 ↓
Task Context
 ↓
Entitlements
 ↓
Retrieval Strategy
 ↓
Search
 ↓
Filtering
 ↓
Ranking
 ↓
Grounding
```

This is a major difference between a **basic RAG application** and an **enterprise retrieval architecture**.

---

# 26. Retrieval Strategy Formula

A useful conceptual model is:

```text
Retrieval Strategy
=
f(
    User Intent,
    Domain,
    Query Type,
    Task Context,
    User Entitlements,
    Business Constraints,
    Freshness Requirements
)
```

And:

```text
Relevant Knowledge
=
Search Relevance
∩
Business Applicability
∩
User Entitlement
∩
Policy Constraints
∩
Temporal Validity
```

---

# 27. Important Separation of Responsibilities

```text
LLM
→ Understand / reason / suggest

CWD Coordinator
→ Enterprise intent + task planning

Delegator
→ Domain interpretation

RAG Worker
→ Retrieval execution

Retrieval Planner
→ Search strategy

Policy / IAM
→ Authorization

Azure AI Search
→ Search + filtering + ranking

RAG Context Builder
→ Evidence assembly

LLM
→ Grounded answer generation
```

The LLM can **recommend** a retrieval strategy, but the platform should enforce allowed strategies and security constraints.

---

# 28. Common Anti-Patterns

### ❌ One retrieval strategy for every query

```text
Every query → vector top-K
```

---

### ❌ Ignore task context

```text
"maintenance procedure"
```

searched globally even though the task already identifies:

```text
Plant A + Equipment X
```

---

### ❌ Use domain only

```text
domain = engineering
```

but ignore:

```text
procedure vs policy vs incident report
```

---

### ❌ Ignore temporal intent

Returning an old policy for:

> “What is the current policy?”

---

### ❌ Ignore authority

Returning employee discussion instead of the official approved policy.

---

### ❌ Let the LLM construct unrestricted security filters

Authorization must come from trusted policy/IAM mechanisms.

---

### ❌ Treat RAG as the answer to every question

Live operational data may require:

```text
MCP / API / database
```

rather than static RAG.

---

# 29. End-to-End Example

User asks:

> **“Why did the shipment to Plant A get delayed, and what should we do?”**

### Step 1 — Intent

```text
root_cause_analysis
+
recommendation
```

### Step 2 — Domain

```text
logistics
```

### Step 3 — Query type

```text
analytical + decision
```

### Step 4 — Task context

```text
plant = Plant-A
shipment = SHIP123
```

### Step 5 — Entitlements

```text
logistics
plant-a
shipping-operations
```

### Step 6 — Retrieval strategy

```text
Hybrid
+
multi-query
+
metadata filtering
```

### Step 7 — Sources

```text
Shipment events
Carrier status
Shipping procedures
Historical incidents
Plant-specific policies
```

### Step 8 — Search

```text
Vector + keyword
```

### Step 9 — Security

```text
ACL filter
```

### Step 10 — Ranking

```text
semantic relevance
+
exact shipment ID
+
Plant A
+
current information
+
authoritative sources
```

### Step 11 — Context

```text
Authorized shipment events
+
Carrier information
+
Relevant procedure
+
Applicable Plant A policy
```

### Step 12 — LLM

The LLM synthesizes the evidence into:

```text
Root Cause
+
Evidence
+
Recommended Action
+
Sources
```

That is **context-aware enterprise retrieval**.

---

# 30. Interview-Ready Answer

> **“In our CWD RAG architecture, retrieval is context-aware rather than being a simple vector similarity lookup. We first determine the user's intent, domain, query type, and task context. These signals influence whether we use keyword, vector, hybrid, temporal, multi-query, document-specific, or live API/MCP retrieval. They also determine metadata filters such as domain, document type, plant, region, status, effective date, and business object. We then apply user entitlement and ACL filtering so only authorized knowledge is eligible. Among the authorized candidates, ranking can consider semantic relevance, lexical relevance, authority, freshness, and business applicability. LangGraph orchestrates these retrieval steps and conditional retries, while Policy/IAM controls authorization and Azure AI Search performs search and ranking. The resulting authorized evidence is then assembled into context and provided to the LLM for grounded generation.”**

---

# Final Definition

**Context-aware enterprise retrieval is the process of dynamically selecting and executing a retrieval strategy based on the user's intent, business domain, query type, task context, entitlements, and business constraints, while applying appropriate search modes, metadata filters, security controls, ranking signals, and knowledge-source selection to retrieve the most relevant, current, authoritative, and authorized enterprise evidence for downstream LLM reasoning.**

### Final Mental Model

```text
              USER QUERY
                   │
                   ▼
              USER INTENT
                   │
                   ▼
               DOMAIN
                   │
                   ▼
             QUERY TYPE
                   │
                   ▼
            TASK CONTEXT
                   │
                   ▼
          USER ENTITLEMENTS
                   │
                   ▼
        RETRIEVAL STRATEGY
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
    Search       Filters     Sources
       │           │           │
       └───────────┼───────────┘
                   ▼
          AUTHORIZED RESULTS
                   │
                   ▼
              RE-RANKING
                   │
                   ▼
          RELEVANT EVIDENCE
                   │
                   ▼
           GROUNDED CONTEXT
                   │
                   ▼
                  LLM
                   │
                   ▼
          GROUNDED RESPONSE
```

**The key architect principle is:**

> **Intent determines what the user needs; domain determines where to look; query type determines how to search; task context determines what is applicable; entitlements determine what is permissible; and ranking determines which authorized evidence should reach the LLM.**
