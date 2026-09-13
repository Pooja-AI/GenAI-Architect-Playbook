# Azure Agentic RAG

For your **CWD project**, Agentic RAG goes beyond a simple `question → search → LLM` pipeline.

The key idea is:

> **The agent decides how to retrieve information, which sources/tools to use, whether more retrieval is needed, and whether the final answer is sufficiently grounded.**

---

## 1. Traditional RAG vs Agentic RAG

### Traditional RAG

```text
User Question
     ↓
Embedding
     ↓
Vector / Hybrid Search
     ↓
Top-K Documents
     ↓
LLM
     ↓
Answer
```

The retrieval pipeline is mostly fixed.

### Agentic RAG

```text
User Question
      ↓
RAG Agent
      ↓
Understand Intent
      ↓
Create Retrieval Plan
      ↓
Select Search Strategy
      ↓
Search Multiple Sources
      ↓
Evaluate Results
      ↓
Rerank
      ↓
Need More Information?
      ↓
Yes ─────────→ Additional Retrieval
      ↓ No
Grounding Validation
      ↓
Generate Answer + Citations
```

The agent can **reason about the retrieval process itself**.

---

# 2. Query Planning

Query planning means the agent determines:

> **What information do I need, where should I get it, and in what order?**

Suppose the user asks:

> "Why did equipment EQ-102 fail, and has the same failure happened before?"

That's not a simple search.

The agent may create:

```text
Task 1 → Get current EQ-102 alarm history
Task 2 → Get EQ-102 maintenance history
Task 3 → Search historical failures
Task 4 → Find similar RCA reports
Task 5 → Correlate evidence
Task 6 → Generate conclusion
```

This is **query decomposition**.

---

# 3. Retrieval Agent

A retrieval agent is an agent whose responsibility is to obtain the right information.

It can decide:

```text
Should I use:
    ↓
Azure AI Search?
    ↓
SQL?
    ↓
ServiceNow?
    ↓
SharePoint?
    ↓
Enterprise API?
    ↓
Another agent/tool?
```

For example:

```text
User Question
      ↓
RAG Agent
      ↓
"Historical knowledge needed"
      ↓
Azure AI Search
```

But:

```text
User Question
      ↓
RAG Agent
      ↓
"Current equipment status needed"
      ↓
Equipment API
```

This is why Agentic RAG is powerful for enterprise environments.

---

# 4. Search Agent

A **Search Agent** specializes in finding information.

It can decide:

* keyword search
* vector search
* hybrid search
* metadata filters
* ACL filters
* query rewriting
* query expansion
* multiple searches
* reranking
* whether another search is required

Example:

```text
Original Query:
"Why did EQ-102 overheat?"

        ↓

Search Agent

        ↓

Query 1:
EQ-102 E104 alarm

Query 2:
EQ-102 thermal excursion

Query 3:
equipment overheating cooling failure

        ↓

Azure AI Search
```

The Search Agent is essentially an **intelligent retrieval controller**.

---

# 5. Query Rewriting

Users don't always provide good search queries.

User:

> "Why did that machine have the same issue again?"

The system may not know what "that machine" or "same issue" means from the raw query.

Using conversation context:

```text
Machine = EQ-102
Previous issue = thermal excursion
```

The agent can rewrite:

```text
"EQ-102 recurring thermal excursion failure"
```

Then send that to Azure AI Search.

---

# 6. Query Decomposition

Some enterprise questions contain multiple independent information needs.

Example:

> "Compare the last three EQ-102 failures, identify the common root cause, and tell me whether maintenance fixed the problem."

The agent decomposes:

```text
Q1 → Find last 3 EQ-102 failures
Q2 → Retrieve RCA for each failure
Q3 → Retrieve maintenance records
Q4 → Compare root causes
Q5 → Determine whether maintenance resolved recurrence
```

Then execute:

```text
Q1 ──┐
Q2 ──┤
Q3 ──┤ → Correlation → Final Answer
     ┘
```

Some tasks can execute **in parallel**.

---

# 7. Multi-Source Retrieval

Enterprise RAG often needs more than one data source.

For CWD:

```text
                  RAG Agent
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
 Azure AI Search   ServiceNow    Equipment API
        ↓             ↓             ↓
 Historical Docs   Tickets      Live Status
        └─────────────┼─────────────┘
                      ↓
                 Evidence
                      ↓
                     LLM
```

Example:

> "Why is EQ-102 failing repeatedly?"

The agent needs:

**Azure AI Search**
→ historical RCA reports

**ServiceNow**
→ incidents and maintenance tickets

**Equipment API**
→ current equipment status

**SQL/Data Warehouse**
→ operational metrics

This is much closer to real enterprise Agentic RAG.

---

# 8. Reranking

Suppose retrieval returns 50 documents.

Not all 50 are equally useful.

```text
Search
 ↓
50 candidates
 ↓
Reranker
 ↓
10 highly relevant documents
 ↓
Top 5
 ↓
LLM
```

The reranker considers the relationship between:

```text
Query ↔ Retrieved Document
```

and improves the ordering.

### Why reranking matters

Vector similarity alone may return something semantically similar but not actually useful.

Example:

```text
Query:
"Root cause of EQ-102 E104 failure"

Result A:
EQ-102 E104 Failure Analysis Report
→ Very relevant

Result B:
Generic equipment temperature guide
→ Semantically related

Result C:
EQ-103 temperature incident
→ Similar but different equipment
```

Reranking should push **Result A** higher.

---

# 9. Grounding

Grounding means the answer is based on **retrieved evidence**, rather than the model simply relying on its learned knowledge.

Bad:

```text
User Question
      ↓
LLM
      ↓
"Probably the cooling system failed."
```

No evidence.

Good:

```text
User Question
      ↓
Search
      ↓
Failure Report
Maintenance Record
Alarm History
      ↓
LLM
      ↓
"Based on FA-2026-104 and the EQ-102
maintenance record, the probable cause
was a cooling-system failure."
```

Now the answer is grounded.

---

# 10. Grounding Validation

In production, don't simply trust the generated answer.

You can have a validation step:

```text
Retrieved Evidence
       ↓
      LLM
       ↓
Generated Answer
       ↓
Grounding Validator
       ↓
Does evidence support the answer?
       ↓
Yes → Return
No  → Retrieve More / Regenerate / Escalate
```

For example:

```text
Claim:
"Cooling-system failure caused the issue."

Evidence:
FA report says cooling-system degradation.
       ↓
Supported → Yes
```

But:

```text
Claim:
"EQ-102 will fail again tomorrow."

Evidence:
No such prediction exists.
       ↓
Unsupported → Reject / revise
```

This helps reduce hallucinations.

---

# 11. Citations

Citations allow the user to see **where the answer came from**.

Example:

```text
Answer:

The probable root cause was a thermal excursion
associated with cooling-system degradation.

Sources:
[1] FA-2026-104
[2] EQ-102 Maintenance Report
[3] ServiceNow INC-45821
```

For enterprise applications, citations can contain:

```text
document_id
document_title
page_number
chunk_id
URL
source_system
timestamp
```

Example:

```json
{
  "document_id": "FA-2026-104",
  "source": "Quality Repository",
  "chunk_id": "CH-3821"
}
```

The important point:

> **Citations should point back to the evidence used to generate the answer.**

---

# 12. Agentic RAG Multi-Step Workflow

Let's use your CWD failure-analysis scenario.

User asks:

> **"Analyze this equipment failure, find similar historical failures, identify the probable root cause, and tell me what action was taken previously."**

### Step 1 — Coordinator

Understands intent:

```text
Intent = Failure Analysis
```

Routes to:

```text
Quality / Failure Analysis Delegator
```

---

### Step 2 — Delegator

Creates tasks:

```text
Task 1 → Analyze failure information
Task 2 → Search historical failures
Task 3 → Retrieve previous RCA
Task 4 → Retrieve corrective actions
Task 5 → Correlate evidence
```

---

### Step 3 — Retrieval Agent

Determines sources:

```text
Historical failure
       ↓
Azure AI Search

Current equipment status
       ↓
Equipment API

Previous actions
       ↓
ServiceNow
```

---

### Step 4 — Query Planning

Creates multiple queries:

```text
Q1:
EQ-102 failure history

Q2:
EQ-102 thermal excursion

Q3:
similar failure root cause

Q4:
previous corrective actions
```

---

### Step 5 — Hybrid Retrieval

For each query:

```text
Keyword Search
      +
Vector Search
      ↓
Hybrid Results
```

---

### Step 6 — Security Filtering

Before results reach the LLM:

```text
User Identity
      ↓
Entitlements
      ↓
ACL Filtering
      ↓
Authorized Documents
```

---

### Step 7 — Reranking

Suppose:

```text
100 candidates
       ↓
Reranking
       ↓
20 relevant
       ↓
Top 5
```

---

### Step 8 — Evidence Evaluation

The agent asks:

> "Do I have enough evidence?"

If **No**:

```text
Additional Search
      ↓
More Evidence
```

If **Yes**:

```text
Continue
```

This is one of the major differences from traditional RAG.

---

# 13. Agentic Retrieval Loop

A useful interview diagram:

```text
              ┌─────────────────────┐
              │     User Query      │
              └──────────┬──────────┘
                         ↓
                  Query Planning
                         ↓
                Retrieval Strategy
                         ↓
             ┌───────────┴───────────┐
             ↓                       ↓
       Azure AI Search          Enterprise APIs
             ↓                       ↓
             └───────────┬───────────┘
                         ↓
                     Reranking
                         ↓
                  Evidence Check
                         ↓
              ┌──────────┴──────────┐
              ↓                     ↓
           Enough?                 No
              ↓                     ↓
             Yes               Search Again
              ↓                     │
           Grounding ←──────────────┘
              ↓
           Generate
              ↓
        Validate Claims
              ↓
        Answer + Citations
```

---

# 14. Multi-Step RAG Example

Question:

> **"Why did Fab-X yield decrease last week, and is it related to the recent equipment failures?"**

This requires multiple steps.

### Step 1

Retrieve yield data.

```text
Yield Data
↓
Yield dropped 8%
```

### Step 2

Find top defect contributors.

```text
Defect A → 42%
Defect B → 25%
```

### Step 3

Search equipment failures.

```text
EQ-102
EQ-118
EQ-124
```

### Step 4

Retrieve historical RCA.

```text
EQ-102 → thermal excursion
EQ-118 → unrelated
EQ-124 → process instability
```

### Step 5

Correlate data.

```text
Yield drop
    ↓
Defect A
    ↓
Process step X
    ↓
EQ-102
    ↓
Thermal excursion
```

### Step 6

Grounding validation.

The agent checks whether the evidence actually supports the relationship.

### Step 7

Final answer.

```text
Yield decreased by 8%.

The strongest correlation was between
Defect A and EQ-102's thermal excursion.

Evidence:
- Yield report
- EQ-102 failure report
- Historical RCA

Confidence: High
```

---

# 15. Agentic RAG vs Simple RAG

| Simple RAG        | Agentic RAG                             |
| ----------------- | --------------------------------------- |
| Fixed retrieval   | Dynamic retrieval                       |
| Usually one query | Multiple queries                        |
| One search source | Multiple sources                        |
| Fixed Top-K       | Dynamic retrieval                       |
| No planning       | Query planning                          |
| Limited reasoning | Retrieval reasoning                     |
| Search → LLM      | Plan → Search → Evaluate → Search again |
| Basic grounding   | Grounding validation                    |
| Basic citations   | Evidence-based citations                |
| Simple use cases  | Complex enterprise workflows            |

---

# 16. Where Each Component Fits in CWD

```text
Coordinator
     ↓
Intent + High-Level Plan
     ↓
Delegator
     ↓
Task Decomposition
     ↓
RAG / Retrieval Agent
     ↓
Query Planning
     ↓
Search Agent
     ↓
Azure AI Search / APIs / DB
     ↓
Reranking
     ↓
Evidence Validation
     ↓
Grounding
     ↓
Worker / Agent
     ↓
Coordinator
     ↓
Final Answer + Citations
```

### Remember the roles

**Coordinator**

> "Which domain should handle this?"

**Delegator**

> "What tasks need to be performed?"

**Retrieval Agent**

> "What information do I need?"

**Search Agent**

> "Where and how should I search?"

**Reranker**

> "Which retrieved evidence is most relevant?"

**Grounding**

> "Does the answer actually come from the evidence?"

**Citation**

> "Can I show the user exactly where the evidence came from?"

---

# 17. Strong Solution Architect Interview Answer

> **"For enterprise Agentic RAG, I would not use a fixed question-to-vector-search pipeline. In my CWD architecture, the Coordinator identifies the intent and routes the request to the appropriate Delegator. The Delegator decomposes the request into domain-specific tasks, and a Retrieval or Search Agent creates a retrieval plan. Depending on the task, it can perform query rewriting, keyword search, vector or hybrid search in Azure AI Search, metadata and ACL filtering, or retrieve live information from enterprise APIs such as ServiceNow or operational systems. I would then use reranking to improve the relevance of the candidate evidence. The agent evaluates whether sufficient evidence has been retrieved; if not, it can perform another retrieval step. Once sufficient evidence is available, the LLM generates a grounded response, and a validation step checks whether important claims are supported by the retrieved evidence. Finally, I return citations containing document or source metadata so the user can trace the answer back to the enterprise source."**

### Interview mental model

> **Plan → Retrieve → Rerank → Evaluate → Retrieve Again if Needed → Ground → Validate → Cite → Answer**

That is the core architecture you should remember for **Azure Agentic RAG**.
