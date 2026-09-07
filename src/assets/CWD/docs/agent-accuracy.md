# Agent Accuracy Measurement in CWD

**Core principle:**

> **Agent accuracy measures how correctly an individual CWD agent performs its assigned responsibility against an expected behavior or outcome.**

The key is to evaluate the **agent's responsibility**, not simply whether the final answer sounds good.

```text
                         AGENT ACCURACY
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
         Coordinator        Delegator          Worker
              │                │                │
              ▼                ▼                ▼
        Intent / Route     Decomposition      Task Result
        Planning           Worker Selection    Tool Selection
        Decision            Aggregation         RAG / Logic
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                         Agent Outcome
                               │
                               ▼
                         Accuracy Score
```

---

## 1. What Exactly Are We Measuring?

For every agent, define:

```text
Expected Agent Behavior
          ↓
       Execute
          ↓
Actual Agent Behavior
          ↓
      Compare
          ↓
Correct / Incorrect
```

For example, if the Coordinator is expected to route a logistics request to `shipping-delegator`:

```text
Expected:
intent = shipment_tracking
agent = shipping-delegator

Actual:
intent = shipment_tracking
agent = inventory-delegator
```

Then:

```text
Intent Accuracy   = PASS
Routing Accuracy  = FAIL
```

This is much more useful than simply saying:

> "Coordinator accuracy = 50%."

---

# 2. Agent Accuracy Is Responsibility-Specific

Different CWD agents need different accuracy metrics.

| Agent           | Primary Accuracy                                 |
| --------------- | ------------------------------------------------ |
| Coordinator     | Intent, domain, planning, routing                |
| Delegator       | Decomposition, dependencies, Worker selection    |
| Worker          | Task correctness, tool selection, business logic |
| RAG Worker      | Retrieval, evidence, groundedness                |
| Tool/MCP Worker | Tool selection, arguments, result interpretation |

So there is **no universal agent accuracy metric**.

---

# 3. Coordinator Accuracy

The Coordinator answers:

> **"What does the user want, and which agent should handle it?"**

Measure:

### Intent accuracy

Did it understand the user's objective?

### Domain accuracy

Did it identify the correct business domain?

### Routing accuracy

Did it select the correct Delegator/agent?

### Planning accuracy

Did it create an appropriate execution plan?

Example:

```json
{
  "expected": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "target_agent": "shipping-delegator"
  },

  "actual": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "target_agent": "shipping-delegator"
  }
}
```

All three decisions are correct.

---

# 4. Delegator Accuracy

The Delegator answers:

> **"How should this domain-level objective be executed?"**

Suppose the Coordinator gives:

```text
Investigate shipment delay
```

Expected Delegator plan:

```text
Shipment Investigation
       │
       ├── Tracking Worker
       ├── Carrier Worker
       └── Delay Analysis Worker
```

Actual:

```text
Shipment Investigation
       │
       └── Tracking Worker
```

The Delegator may have selected a valid Worker but failed to decompose the objective completely.

Therefore:

```text
Decomposition Accuracy = FAIL
```

Measure:

```text
Task Decomposition
Dependency Identification
Worker Selection
Parallelization
Aggregation
Recovery Decision
```

---

# 5. Worker Accuracy

The Worker answers:

> **"Did I correctly execute my assigned task?"**

Example:

```text
Task:
Retrieve latest shipment status.
```

Expected:

```text
SHIP123 → delayed
```

Actual:

```text
SHIP123 → delivered
```

Therefore:

```text
Worker Task Accuracy = 0
```

Formula:

$$
WorkerAccuracy =
\frac{CorrectTaskResults}{TotalTasks}
$$

---

# 6. Tool-Calling Accuracy

For a Worker using MCP tools:

```text
Worker
  ↓
Select Tool
  ↓
Generate Arguments
  ↓
MCP
  ↓
Enterprise API
```

Measure three separate things:

```text
Tool Selection Accuracy
Argument Accuracy
Result Interpretation Accuracy
```

Example:

Expected:

```json
{
  "tool": "get_tracking_events",
  "shipment_id": "SHIP123"
}
```

Actual:

```json
{
  "tool": "get_tracking_events",
  "shipment_id": "SHIP132"
}
```

Tool selection is correct, but the argument is wrong.

Therefore:

```text
Tool Selection Accuracy    = 100%
Argument Accuracy          = 0%
```

---

# 7. RAG Agent Accuracy

For a RAG Worker, don't only evaluate the final answer.

Measure:

```text
Query Transformation
        ↓
Retrieval
        ↓
Security Filtering
        ↓
Ranking
        ↓
Context Construction
        ↓
Generation
```

Important metrics include:

* Recall@K
* Precision@K
* MRR
* NDCG
* context relevance
* citation accuracy
* groundedness

Example:

```text
Expected relevant documents = 5
Retrieved relevant documents@10 = 4

Recall@10 = 4 / 5 = 80%
```

Also remember:

> A highly relevant document that the user is not authorized to access is **not a successful retrieval result** for the enterprise workflow.

---

# 8. Accuracy of Agent Decisions

Agentic systems make many decisions:

```text
Should I call a tool?
Which tool?
Which agent?
Which Worker?
Which data?
Should I retry?
Should I ask for clarification?
Should I escalate?
```

Each decision can become an evaluation point.

For example:

```text
User request
     ↓
Need RAG?
     ↓
YES
     ↓
Need MCP?
     ↓
YES
     ↓
Need HITL?
     ↓
NO
```

Expected decision:

```text
RAG = YES
MCP = YES
HITL = NO
```

Actual:

```text
RAG = NO
MCP = YES
HITL = NO
```

The agent's decision accuracy is reduced because it incorrectly skipped RAG.

---

# 9. Exact Accuracy vs Semantic Accuracy

This distinction is important for LLM agents.

### Deterministic decisions

Use exact comparison.

Examples:

```text
intent
domain
agent ID
Worker ID
tool name
policy decision
status
structured fields
```

Example:

```text
expected = "shipping-delegator"
actual   = "shipping-delegator"

PASS
```

### Natural-language output

Don't require exact string equality.

Expected:

> Shipment is delayed because of carrier capacity constraints.

Actual:

> The carrier's limited capacity is causing the shipment delay.

These can both be correct.

Use:

```text
Semantic Correctness
Groundedness
Relevance
Completeness
```

---

# 10. Agent Accuracy Using a Golden Dataset

This is where your previous concept connects directly.

```text
                  GOLDEN DATASET
                        │
                  Test Case 001
                        │
                        ▼
                   CWD AGENT
                        │
                        ▼
                  ACTUAL RESULT
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        EXPECTED RESULT       ACTUAL RESULT
             │                     │
             └──────────┬──────────┘
                        ▼
                     COMPARE
                        │
                  PASS / FAIL
```

Example:

```json
{
  "test_id": "TC-001",

  "expected": {
    "intent": "shipment_tracking",
    "domain": "logistics",
    "agent": "shipping-delegator"
  },

  "actual": {
    "intent": "shipment_tracking",
    "domain": "logistics",
    "agent": "shipping-delegator"
  }
}
```

Result:

```text
Intent       ✓
Domain       ✓
Agent Route  ✓
```

---

# 11. Basic Agent Accuracy Formula

For a simple classification-type agent:

$$
Accuracy =
\frac{Correct\ Decisions}
{Total\ Decisions}
$$

Example:

```text
1,000 routing decisions
950 correct

Accuracy = 950 / 1000
         = 95%
```

---

# 12. Precision, Recall and F1 for Agents

For some agent decisions, especially classification or capability detection, simple accuracy isn't enough.

Suppose an agent decides whether a request requires a particular capability.

You can measure:

### Precision

$$
Precision = \frac{TP}{TP+FP}
$$

### Recall

$$
Recall = \frac{TP}{TP+FN}
$$

### F1

$$
F1 = 2 \times
\frac{Precision \times Recall}
{Precision + Recall}
$$

This is useful when classes are imbalanced.

For example, if only 5% of requests require a particular specialist Worker, an agent could achieve high raw accuracy by almost never selecting it.

Precision/recall exposes that problem.

---

# 13. Multi-Dimensional Agent Accuracy

A mature agent evaluation should look like:

```text
Agent Accuracy
│
├── Decision Accuracy
│     ├── Intent
│     ├── Domain
│     ├── Routing
│     └── Planning
│
├── Execution Accuracy
│     ├── Task
│     ├── Tool
│     ├── Arguments
│     └── Business Logic
│
├── Knowledge Accuracy
│     ├── Retrieval
│     ├── Evidence
│     └── Groundedness
│
└── Outcome Accuracy
      ├── Correct Result
      ├── Complete Result
      └── Business Outcome
```

---

# 14. Agent Accuracy vs Workflow Accuracy

This distinction is critical.

Suppose:

```text
Coordinator = 98%
Delegator   = 97%
Worker A    = 99%
Worker B    = 98%
```

It does **not** automatically mean:

```text
Workflow = 98%
```

Why?

Because errors can compound across the workflow.

```text
Coordinator
     ↓
Correct
     ↓
Delegator
     ↓
Correct
     ↓
Worker
     ↓
Incorrect
     ↓
Final Workflow
     ↓
Incorrect
```

Therefore measure both:

```text
Agent Accuracy
        +
Workflow Goal Accuracy
```

---

# 15. Agent Accuracy vs Reliability

Accuracy and reliability are different.

Example:

```text
Worker executes successfully
but returns wrong result.
```

Then:

```text
Execution Reliability = PASS
Business Accuracy     = FAIL
```

Another case:

```text
Worker initially fails
→ retry
→ succeeds with correct result
```

Then:

```text
Accuracy = PASS
Reliability = degraded/recovered
```

So:

```text
Accuracy    = Was the result correct?
Reliability = Did execution succeed consistently?
```

---

# 16. Agent Accuracy vs Groundedness

For RAG-enabled agents:

```text
Accuracy
   ↓
Is the answer correct?

Groundedness
   ↓
Is the answer supported by retrieved evidence?
```

For enterprise systems, you generally want both.

```text
Correct + Grounded = Strong result
Correct + Ungrounded = Risk
Incorrect + Grounded = Bad evidence/reasoning
Incorrect + Ungrounded = Worst case
```

---

# 17. Agent Accuracy Should Include Business Outcome

The strongest measurement is:

> **Did the agent accomplish its assigned business objective?**

For example:

```text
Worker Task:
Identify shipment delay cause.
```

Expected:

```text
Root cause = carrier capacity
```

Agent output:

```text
Root cause = carrier capacity
```

Good.

But if the task is:

```text
Identify cause + recommend action
```

and the agent identifies the cause but provides no recommendation:

```text
Task Accuracy = Partial
Business Outcome = Incomplete
```

This is why test cases should define **expected business outcomes**, not only expected text.

---

# 18. Partial Accuracy

Agent tasks can sometimes have multiple components.

For example:

```text
Expected:
Intent        ✓
Domain        ✓
Agent         ✓
Tool          ✓
Root cause    ✗
Recommendation ✓
```

You may calculate component-level scores:

```text
5 evaluation dimensions
4 correct

Component Accuracy = 80%
```

But for critical workflows, define a **business-success rule** separately.

For example:

```text
Security must PASS
+
Correct root cause required
+
Recommendation required
```

Otherwise a weighted average can hide an important failure.

---

# 19. Agent Accuracy Evaluation Record

A useful evaluation record is:

```json
{
  "test_id": "TC-001",
  "agent_id": "shipping-agent",
  "agent_version": "2.4.1",

  "expected": {
    "intent": "root_cause_analysis",
    "tool": "get_tracking_events",
    "root_cause": "carrier_capacity"
  },

  "actual": {
    "intent": "root_cause_analysis",
    "tool": "get_tracking_events",
    "root_cause": "carrier_capacity"
  },

  "metrics": {
    "intent_accuracy": 1.0,
    "tool_accuracy": 1.0,
    "business_accuracy": 1.0
  },

  "result": "PASS"
}
```

This can be stored alongside:

```text
agent_version
prompt_version
model_version
workflow_version
RAG index version
tool version
```

so the result is reproducible.

---

# 20. Agent Accuracy Regression

Suppose:

```text
Agent v1
Intent Accuracy = 96%

Agent v2
Intent Accuracy = 91%
```

You have a regression.

The evaluation system should identify:

```text
Agent changed
       ↓
Golden Dataset
       ↓
Accuracy dropped
       ↓
Which test cases failed?
       ↓
Failure analysis
```

You can then determine whether the problem came from:

* prompt change
* model change
* routing logic
* tool schema
* RAG
* context
* workflow logic

---

# 21. Production Agent Accuracy

Accuracy should continue after deployment.

```text
Production Request
       ↓
Agent Execution
       ↓
Telemetry
       ↓
Automated Evaluation
       +
User Feedback
       +
Expert Review
       ↓
Production Accuracy
```

For example:

```text
Coordinator Intent Accuracy       97.4%
Routing Accuracy                  96.8%
Delegator Decomposition           94.9%
Worker Task Accuracy              97.2%
Tool Accuracy                     95.8%
RAG Groundedness                  94.6%
Business Outcome Accuracy         93.7%
```

These metrics tell you where the platform is actually struggling.

---

# 22. Agent Accuracy Dashboard

A useful dashboard:

| Agent       | Metric                 | Score |
| ----------- | ---------------------- | ----: |
| Coordinator | Intent accuracy        |   97% |
| Coordinator | Routing accuracy       |   96% |
| Delegator   | Decomposition accuracy |   94% |
| Delegator   | Worker selection       |   97% |
| Worker      | Task accuracy          |   98% |
| Worker      | Tool accuracy          |   96% |
| RAG Worker  | Recall@10              |   92% |
| RAG Worker  | Groundedness           |   95% |
| End-to-end  | Business outcome       |   94% |

The dashboard should also show:

```text
Version
Prompt
Model
Failure cases
Regression
Latency
Cost
Security violations
```

---

# 23. How Agent Accuracy Fits Into CWD Evaluation

```text
                         CWD
                          │
                          ▼
                 Agent Execution
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
 Coordinator          Delegator           Worker
       │                  │                  │
 Intent              Decomposition        Task
 Domain              Worker Selection     Tool
 Routing             Dependencies         RAG
 Planning            Aggregation          Logic
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
                   AGENT ACCURACY
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
         Correct       Incorrect      Partial
            │             │             │
            └─────────────┼─────────────┘
                          ▼
                  Workflow Evaluation
                          │
                          ▼
                  Business Outcome
```

---

# 24. Recommended Measurement Strategy

For your CWD architecture, I would structure agent accuracy into **five layers**:

### Layer 1 — Decision accuracy

```text
Intent
Domain
Planning
Routing
```

### Layer 2 — Coordination accuracy

```text
Decomposition
Dependencies
Worker selection
Aggregation
```

### Layer 3 — Execution accuracy

```text
Task result
Tool
Arguments
Business logic
```

### Layer 4 — Knowledge accuracy

```text
RAG retrieval
Evidence
Groundedness
Citations
```

### Layer 5 — Business accuracy

```text
Goal completion
Correct outcome
Completeness
Actionability
```

```text
Decision
   ↓
Coordination
   ↓
Execution
   ↓
Knowledge
   ↓
Business Outcome
```

---

# 25. The Most Important Rule

Don't optimize for:

> **"How often does the agent produce a good-looking answer?"**

Optimize for:

> **"How often does the agent correctly perform its assigned responsibility and achieve the expected business outcome under the required security and policy constraints?"**

That distinction is fundamental for enterprise agent evaluation.

---

# 26. Final Formula

### Basic agent accuracy

$$
AgentAccuracy =
\frac{CorrectAgentOutcomes}
{TotalAgentEvaluations}
$$

### Enterprise agent accuracy

```text
Agent Accuracy
=
Decision Accuracy
+
Coordination Accuracy
+
Execution Accuracy
+
Knowledge Accuracy
+
Business Outcome Accuracy
```

These should generally be **reported separately**, rather than blindly combined.

### Final definition

> **Agent accuracy measurement in CWD is the systematic evaluation of whether an individual Coordinator, Delegator, or Worker correctly performs its assigned responsibility against expected behavior defined by golden test cases. It measures decision accuracy, routing, decomposition, Worker selection, task execution, tool usage, retrieval, groundedness, and business outcomes using deterministic assertions where possible and semantic or rubric-based evaluation for natural-language behavior. Agent accuracy is tracked by agent and version and is combined with reliability, latency, cost, safety, and security measurements to evaluate the overall CWD workflow.**

### Interview-ready answer

> **“For CWD, agent accuracy is responsibility-specific. We don't use one generic accuracy number. We evaluate the Coordinator on intent, domain, planning, and routing; the Delegator on decomposition, dependencies, Worker selection, and aggregation; and Workers on task correctness, tool usage, RAG, and business logic. We compare actual execution against golden test cases using exact assertions for deterministic decisions and semantic evaluation for natural-language results. We then track accuracy by agent, prompt, model, and version, while separately measuring workflow success, reliability, latency, cost, and security.”**
