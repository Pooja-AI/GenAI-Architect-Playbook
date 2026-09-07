# Agent & Workflow Evaluation in CWD

**Core principle:**

> **A production agent is not considered good merely because it produces a good answer. CWD must evaluate the complete execution across quality, reliability, latency, cost, safety, and operational behavior.**

The evaluation should happen at **multiple levels**:

```text
User Request
     │
     ▼
Coordinator
     │
     ▼
Delegator
     │
     ▼
Worker
     │
     ├── RAG
     ├── MCP
     └── Enterprise APIs
     │
     ▼
Final Response
```

And therefore:

```text
Agent Evaluation
        +
Workflow Evaluation
        +
System Evaluation
        ↓
Enterprise CWD Evaluation
```

---

# 1. What Are We Evaluating?

There are two different things to evaluate.

### Agent-level evaluation

Measures whether an individual agent performs its assigned responsibility correctly.

Examples:

* Does the Worker select the correct tool?
* Does the RAG agent retrieve relevant documents?
* Does the Delegator decompose the task correctly?
* Does the Coordinator select the correct domain agent?

### Workflow-level evaluation

Measures whether the **entire CWD workflow** achieves the user's objective.

```text
Coordinator
    ↓
Delegator
    ↓
Worker A
    ↓
Worker B
    ↓
Aggregation
    ↓
Final Answer
```

Even if every individual agent performs reasonably well, the overall workflow can still fail.

---

# 2. Four Primary Evaluation Dimensions

The core evaluation framework is:

```text
                    CWD EVALUATION
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
    QUALITY          RELIABILITY          LATENCY
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
                        COST
```

In an enterprise environment, I would expand this to:

```text
Quality
Reliability
Latency
Cost
Safety
Security
Groundedness
Scalability
Observability
User Satisfaction
```

---

# 3. Quality Evaluation

Quality answers:

> **Did the agent produce the correct and useful result?**

Quality is not a single metric.

It depends on the type of agent.

---

## 3.1 Coordinator Quality

Evaluate:

```text
Intent classification
Domain identification
Planning
Agent selection
Delegation
Workflow routing
Result aggregation
Final response
```

Example:

User asks:

> "Why is shipment SHIP123 delayed?"

Coordinator should identify:

```json id="8vph0f"
{
  "intent": "root_cause_analysis",
  "domain": "logistics",
  "required_capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ]
}
```

If it routes to an HR agent:

```text
Quality = FAIL
```

---

# 4. Delegator Quality

Evaluate:

```text
Task decomposition
Dependency identification
Worker selection
Parallelization
Result aggregation
Recovery decisions
```

For example:

```text
Shipment Investigation
       │
       ├── Tracking
       ├── Carrier Status
       └── Delay Analysis
```

A good Delegator identifies independent tasks and executes them appropriately.

---

# 5. Worker Quality

Evaluate:

```text
Input validation
Tool selection
Tool arguments
RAG retrieval
Business logic
Output validation
Result correctness
```

For a Worker:

```text
Correct tool
+
Correct parameters
+
Correct data
+
Correct business logic
+
Correct result
```

---

# 6. RAG Quality

For RAG Workers, evaluate retrieval separately from generation.

### Retrieval metrics

```text
Recall@K
Precision@K
MRR
NDCG
Context Precision
Context Recall
Context Relevance
```

Example:

```text
Relevant documents = 10
Retrieved documents = 5
Relevant retrieved = 4
```

Then:

```text
Precision@5 = 4 / 5 = 0.80
```

The exact evaluation set and K should be designed for the business use case.

---

# 7. Generation Quality

After retrieval:

```text
Retrieved Evidence
       ↓
LLM
       ↓
Generated Answer
```

Evaluate:

* correctness
* relevance
* completeness
* groundedness
* faithfulness
* citation accuracy
* instruction following
* schema validity

For enterprise RAG:

> **The answer should be supported by authorized enterprise evidence.**

---

# 8. Tool-Calling Quality

For MCP/tool-using agents, evaluate:

```text
Tool selection accuracy
Argument correctness
Tool execution success
Tool sequencing
Unauthorized tool attempts
Result interpretation
```

Example:

```text
User:
"Get shipment tracking status."

Expected:
get_tracking_events

Actual:
delete_shipment

→ Critical failure
```

Tool selection should therefore be explicitly evaluated.

---

# 9. Workflow Quality

Workflow quality asks:

> **Did the entire workflow achieve the business objective?**

For example:

```text
User Request
     ↓
Coordinator
     ↓
Shipping Delegator
     ↓
Tracking Worker
     ↓
Carrier Worker
     ↓
Delay Analysis Worker
     ↓
Aggregation
     ↓
Answer
```

Potential workflow metrics:

| Metric                      | Meaning                                  |
| --------------------------- | ---------------------------------------- |
| Task Success Rate           | % workflows successfully completed       |
| Goal Completion Rate        | % requests achieving intended objective  |
| Correct Routing Rate        | Correct agent/domain selection           |
| Correct Decomposition Rate  | Correct task breakdown                   |
| Result Aggregation Accuracy | Correct combination of results           |
| Recovery Success Rate       | Failed executions successfully recovered |
| Human Escalation Rate       | % workflows requiring intervention       |

---

# 10. Reliability Evaluation

Reliability answers:

> **Does the system consistently execute correctly under normal and abnormal conditions?**

Important metrics:

```text
Success Rate
Failure Rate
Retry Rate
Timeout Rate
Availability
Recovery Rate
Error Rate
Duplicate Execution Rate
```

For example:

```text
Total workflows = 10,000
Successful = 9,700
Failed = 200
Timed out = 100
```

Then:

```text
Success Rate = 97%
Failure Rate = 2%
Timeout Rate = 1%
```

---

# 11. Reliability Must Include Failure Injection

Don't evaluate only happy paths.

Test:

```text
Worker unavailable
MCP timeout
API timeout
RAG unavailable
Cosmos unavailable
Service Bus redelivery
LLM timeout
Invalid tool response
Malformed Worker output
Agent version mismatch
Policy rejection
Human approval timeout
```

For example:

```text
Worker A
   ↓
Crash
   ↓
Delegator
   ↓
Rediscover
   ↓
Worker B
   ↓
Continue
```

Measure whether the workflow recovers successfully.

---

# 12. Retry Evaluation

Retries themselves must be evaluated.

Bad system:

```text
Failure
 ↓
Retry
 ↓
Failure
 ↓
Retry
 ↓
Retry forever
```

Good system:

```text
Failure
 ↓
Classify
 ↓
Retryable?
 ├── No → Fail
 └── Yes
      ↓
Check deadline
      ↓
Check idempotency
      ↓
Backoff
      ↓
Retry
```

Metrics:

```text
Retry success rate
Average retries/workflow
Retry amplification
Duplicate operation rate
Dead-letter rate
```

---

# 13. Latency Evaluation

Latency answers:

> **How long does it take to produce the result?**

Do not evaluate only average latency.

Use:

```text
P50
P90
P95
P99
```

For example:

```text
P50 = 2.1 sec
P95 = 6.8 sec
P99 = 12.4 sec
```

P95/P99 are especially important for enterprise workflows because averages can hide tail latency.

---

# 14. End-to-End Latency

For CWD:

```text
T_total =
T_gateway
+ T_coordinator
+ T_delegator
+ T_worker
+ T_RAG
+ T_MCP
+ T_LLM
+ T_aggregation
```

But parallel execution changes this.

If:

```text
Worker A = 2 sec
Worker B = 5 sec
Worker C = 3 sec
```

and they execute in parallel:

```text
Parallel latency ≈ max(2,5,3)
                 ≈ 5 sec
```

rather than:

```text
2 + 5 + 3 = 10 sec
```

Therefore workflow design directly affects latency.

---

# 15. Critical Path Latency

For a DAG:

```text
        Worker A ── 2s ──┐
                         │
Coordinator ──┬──────────┼── Aggregation
              │          │
        Worker B ── 5s ──┤
                         │
        Worker C ── 3s ──┘
```

Critical path is approximately:

```text
Coordinator
+
max(parallel workers)
+
Aggregation
```

This is much more useful than simply measuring individual Worker latency.

---

# 16. Latency Breakdown

Capture:

```json id="7sy2nf"
{
  "workflow_latency_ms": 6800,

  "breakdown": {
    "coordinator": 450,
    "delegator": 320,
    "rag": 900,
    "mcp": 1200,
    "llm": 3500,
    "aggregation": 430
  }
}
```

Now the team can identify the bottleneck.

---

# 17. Cost Evaluation

Cost answers:

> **How much does each execution cost?**

For GenAI systems, cost includes more than LLM tokens.

```text
Total Cost
=
LLM Cost
+ Embedding Cost
+ RAG/Search Cost
+ Compute Cost
+ Storage Cost
+ Messaging Cost
+ Observability Cost
+ External API Cost
```

---

# 18. LLM Cost

Track:

```text
Input tokens
Output tokens
Model
Model version
Number of calls
Cost per token
```

Example:

```json id="e9h7q7"
{
  "model": "approved-model",
  "input_tokens": 4200,
  "output_tokens": 800,
  "llm_calls": 3
}
```

The important metric is not simply:

> "How many tokens did the model use?"

It is:

> **How many tokens were required to successfully complete the business objective?**

---

# 19. Cost per Successful Workflow

This is a powerful enterprise metric.

Suppose:

```text
Total cost = $1,000
Successful workflows = 500
```

Then:

```text
Cost per successful workflow
= $1,000 / 500
= $2
```

This is more meaningful than cost per LLM call.

---

# 20. Agent-Level Cost

Track:

```text
Coordinator cost
Delegator cost
Worker cost
RAG cost
Tool/API cost
```

Example:

```text
Coordinator     $0.04
Delegator       $0.03
RAG             $0.02
Worker A        $0.05
Worker B        $0.08
Final LLM       $0.10
----------------------
Total           $0.32
```

This helps identify expensive agents.

---

# 21. Workflow-Level Cost

A complex workflow might execute:

```text
1 Coordinator call
2 Delegator calls
5 Worker calls
3 RAG calls
4 MCP calls
6 LLM calls
```

The total cost can grow quickly.

Therefore:

```text
Workflow Cost
=
Σ Agent Calls
+
Σ Tool Calls
+
Σ Retrieval
+
Σ Infrastructure
```

---

# 22. Context Size and Cost

Context growth directly affects:

```text
Token cost
Latency
Memory consumption
LLM reasoning quality
```

For example:

```text
Bad:
10,000 tokens context
```

versus:

```text
Better:
2,500 relevant tokens
```

while maintaining the same answer quality.

Therefore evaluate:

```text
Tokens per successful workflow
Context tokens / request
Average context size
Maximum context size
Repeated-context ratio
```

---

# 23. Quality vs Cost

You should not optimize cost independently.

Consider:

```text
Model A
Quality = 90
Cost = $0.10

Model B
Quality = 92
Cost = $0.40
```

Is Model B worth it?

It depends on business requirements.

Therefore evaluate the trade-off:

```text
Quality
  ▲
  │            ● B
  │
  │      ● A
  │
  └──────────────────► Cost
```

This becomes a **quality-cost frontier**.

---

# 24. Quality vs Latency

Similarly:

```text
Model A
Quality = 90
Latency = 2 sec

Model B
Quality = 94
Latency = 8 sec
```

For an interactive application, Model A might be preferable.

For high-value analysis, Model B might be justified.

Therefore evaluate:

```text
Quality
  ▲
  │
  │        ●
  │
  │   ●
  └──────────────────► Latency
```

---

# 25. Reliability vs Cost

Aggressive retries can improve reliability but increase cost.

```text
More retries
     ↓
Higher success rate
     ↓
Higher token/API/compute cost
```

Therefore:

```text
Reliability
     ▲
     │
     │       ●
     │   ●
     │ ●
     └──────────────────► Cost
```

CWD should optimize the **overall operating point**, not one metric in isolation.

---

# 26. Evaluation Dataset

A serious evaluation framework requires a curated test dataset.

For example:

```json id="c6v3m5"
{
  "test_id": "TC-001",
  "user_query": "Why is shipment SHIP123 delayed?",

  "expected": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "required_capabilities": [
      "shipment_tracking",
      "delay_analysis"
    ]
  }
}
```

The dataset should contain:

```text
Normal cases
Edge cases
Ambiguous requests
Failures
Security cases
Long-context cases
Tool failures
RAG cases
Multi-agent cases
Adversarial cases
```

---

# 27. Golden Dataset

For important use cases, create **golden test cases**.

Example:

```text
Input
Expected intent
Expected domain
Expected agent
Expected tool
Expected evidence
Expected answer
Expected policy outcome
Latency target
Cost target
```

Then every prompt/model/agent/workflow change can be tested against the same benchmark.

---

# 28. Offline Evaluation

Before production:

```text
Code
 ↓
Unit Tests
 ↓
Agent Tests
 ↓
Workflow Tests
 ↓
Golden Dataset
 ↓
Evaluation
 ↓
Release
```

Evaluate:

```text
Quality
Safety
Tool correctness
RAG quality
Latency
Cost
Reliability
```

This is **offline evaluation**.

---

# 29. Online Evaluation

Production execution should also be evaluated.

```text
Production Request
       ↓
Agent Workflow
       ↓
Telemetry
       ↓
Evaluation Pipeline
       ↓
Metrics
```

Track:

```text
Real-world success
Latency
Cost
Errors
Retries
User feedback
Escalations
Hallucinations
Tool failures
RAG quality
```

---

# 30. Continuous Evaluation

The production lifecycle becomes:

```text
Build
 ↓
Evaluate
 ↓
Deploy
 ↓
Monitor
 ↓
Collect Production Data
 ↓
Evaluate
 ↓
Improve
 ↓
Re-evaluate
 ↓
Deploy
```

This is essential because agent behavior can change when:

* prompts change
* models change
* tools change
* data changes
* RAG corpus changes
* policies change
* agent versions change

---

# 31. Regression Evaluation

Suppose Worker v1 performs:

```text
Accuracy = 92%
```

Worker v2:

```text
Accuracy = 95%
```

Looks better.

But:

```text
Latency: 2 sec → 7 sec
Cost: $0.10 → $0.35
```

Therefore v2 is not automatically a better production version.

You need multi-dimensional regression testing.

---

# 32. Agent Version Evaluation

Agent Registry should track:

```text
Agent
Version
Model
Prompt
Tools
RAG configuration
Dependencies
Evaluation score
```

Example:

```json id="1n8j2p"
{
  "agent_id": "tracking-worker",
  "version": "2.4.1",

  "evaluation": {
    "quality": 0.96,
    "reliability": 0.995,
    "p95_latency_ms": 1800,
    "avg_cost": 0.08
  }
}
```

This allows routing and deployment decisions based on evaluated versions.

---

# 33. Prompt Evaluation

Prompt Registry should evaluate prompt changes.

For example:

```text
Prompt v1
Accuracy = 91%

Prompt v2
Accuracy = 95%

Prompt v3
Accuracy = 94%
```

Don't deploy v3 merely because it is newest.

Use:

```text
Prompt
+
Model
+
Dataset
+
Evaluation Results
```

as the release decision.

---

# 34. Model Evaluation

A model change can affect the entire workflow.

Evaluate:

```text
Model quality
Tool calling
Structured output
Latency
Token usage
Cost
Safety
Reasoning
```

For example:

```text
Model A
Quality 92
Latency 2.5s
Cost $0.10

Model B
Quality 95
Latency 5.0s
Cost $0.30
```

Select based on workload and SLA rather than model popularity.

---

# 35. Reliability Testing with Fault Injection

A mature CWD platform should intentionally introduce failures.

For example:

```text
Kill Worker
 ↓
Does Delegator recover?
```

Or:

```text
Delay MCP
 ↓
Does timeout handling work?
```

Or:

```text
Drop Service Bus message
 ↓
Does redelivery/recovery work?
```

Or:

```text
Corrupt Worker output
 ↓
Does validation reject it?
```

This tests real reliability rather than theoretical reliability.

---

# 36. Security and Safety Evaluation

Quality alone is insufficient.

Test:

```text
Unauthorized data access
Prompt injection
Tool misuse
Cross-tenant leakage
Sensitive-data exposure
Privilege escalation
Malicious retrieved content
Invalid tool arguments
Policy bypass
```

Example:

```text
User
 ↓
RAG
 ↓
Malicious Document
 ↓
"Ignore previous instructions..."
```

The Worker should treat retrieved content as **data**, not authority.

---

# 37. Evaluation Observability

Every execution should carry:

```text
correlation_id
workflow_id
task_id
run_id
step_id
agent_id
agent_version
prompt_id
prompt_version
model
model_version
tool
MCP server
retrieval index
latency
tokens
cost
status
error
retry count
```

Example:

```json id="y4d0ls"
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",

  "agent_id": "tracking-worker",
  "agent_version": "2.4.1",

  "prompt_id": "shipment-analysis",
  "prompt_version": "3.1.0",

  "model": "approved-model-v4",

  "latency_ms": 1240,
  "input_tokens": 2300,
  "output_tokens": 450,

  "status": "completed"
}
```

This makes evaluation reproducible.

---

# 38. CWD Evaluation Dashboard

A production dashboard can look conceptually like:

```text
=================================================
              CWD EVALUATION DASHBOARD
=================================================

QUALITY
  Goal Completion          96.2%
  Answer Correctness       94.8%
  Groundedness             97.1%
  Tool Selection           98.4%
  RAG Recall@10            93.7%

RELIABILITY
  Workflow Success         99.1%
  Worker Failure            0.7%
  Timeout                   0.2%
  Recovery Success         96.5%

LATENCY
  P50                      2.1 sec
  P95                      6.8 sec
  P99                     12.4 sec

COST
  Avg / Workflow           $0.31
  Avg Tokens              4,250
  Avg LLM Calls             3.2

SAFETY
  Policy Violations         0
  Unauthorized Retrieval    0
  Tool Violations            0
=================================================
```

These values are illustrative; production thresholds should be established from actual business SLAs and evaluation datasets.

---

# 39. Evaluation at Every CWD Layer

```text
                 CWD EVALUATION
                       │
        ┌──────────────┼───────────────┐
        ▼              ▼               ▼
   Coordinator      Delegator        Worker
        │              │               │
        ▼              ▼               ▼
   Intent          Decomposition     Tool
   Routing         Dependencies      RAG
   Planning        Selection         Business Logic
   Aggregation     Recovery          Validation
        │              │               │
        └──────────────┼───────────────┘
                       ▼
                  WORKFLOW
                       │
                       ▼
              End-to-End Outcome
```

---

# 40. Evaluation Data Model

A useful evaluation record:

```json id="r2x7rj"
{
  "evaluation_id": "EVAL-1001",

  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",

  "agent": {
    "id": "shipping-delegator",
    "version": "1.8.0"
  },

  "model": {
    "id": "approved-model",
    "version": "4.0"
  },

  "prompt": {
    "id": "shipping-analysis",
    "version": "2.2.0"
  },

  "metrics": {
    "quality": 0.95,
    "reliability": 0.99,
    "latency_ms": 4200,
    "cost_usd": 0.31
  },

  "outcome": "success"
}
```

---

# 41. Composite Evaluation Score

You can define a conceptual score:

```text id="v2p2m6"
CWD Score =
    wq × Quality
  + wr × Reliability
  + wl × LatencyScore
  + wc × CostScore
  + ws × SafetyScore
```

However, I would **not** blindly collapse everything into one number.

For enterprise systems, some dimensions are **hard constraints**.

For example:

```text
Safety violation → automatic failure
Unauthorized access → automatic failure
Reliability below SLA → release blocked
```

Only after mandatory gates pass should quality/cost/latency optimization occur.

---

# 42. Better Enterprise Evaluation Model

Use two layers:

### Layer 1 — Mandatory gates

```text
Security      PASS
Safety        PASS
Authorization PASS
Schema        PASS
Compliance    PASS
```

If any fail:

```text
RELEASE = BLOCKED
```

### Layer 2 — Optimization metrics

```text
Quality
Reliability
Latency
Cost
```

Then:

```text
              RELEASE DECISION
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Safety Gates           Performance
          │                     │
       PASS?                Quality
          │                 Reliability
          │                 Latency
          │                 Cost
          └──────────┬──────────┘
                     ▼
                  Deploy
```

This is much safer than optimizing a single composite score.

---

# 43. Evaluation Lifecycle

The complete enterprise evaluation lifecycle is:

```text
Define Business Objective
          ↓
Create Golden Dataset
          ↓
Define Metrics
          ↓
Offline Evaluation
          ↓
Agent Evaluation
          ↓
Workflow Evaluation
          ↓
Security/Safety Testing
          ↓
Load/Fault Testing
          ↓
Cost/Latency Analysis
          ↓
Release Gate
          ↓
Deploy
          ↓
Canary
          ↓
Production Monitoring
          ↓
Continuous Evaluation
          ↓
Regression Detection
          ↓
Improve / Rollback
```

---

# 44. Canary Evaluation

Suppose:

```text
Agent v1 → 95% traffic
Agent v2 → 5% traffic
```

Monitor:

```text
Quality
Failure rate
P95 latency
Cost
Safety
```

If v2 performs better:

```text
5%
 ↓
20%
 ↓
50%
 ↓
100%
```

If it performs worse:

```text
Rollback → v1
```

This connects evaluation directly to deployment governance.

---

# 45. What Each CWD Component Should Measure

| Component          | Primary Metrics                                                 |
| ------------------ | --------------------------------------------------------------- |
| Coordinator        | Intent accuracy, routing accuracy, planning quality, latency    |
| Delegator          | Decomposition quality, Worker selection, dependency correctness |
| Worker             | Task accuracy, tool accuracy, business correctness              |
| RAG Worker         | Recall, precision, groundedness, citation accuracy              |
| MCP integration    | Tool success, argument validity, timeout/error rate             |
| LangGraph workflow | Completion rate, transition failures, recovery                  |
| Agent Registry     | Discovery accuracy, stale-agent routing                         |
| Service Bus        | Delivery, redelivery, DLQ, queue latency                        |
| Redis              | Cache hit rate, state access latency                            |
| Cosmos DB          | Persistence latency, conflicts, availability                    |
| LLM                | Quality, tokens, latency, cost                                  |
| Entire CWD         | Goal completion, SLA, reliability, cost/user                    |

---

# 46. Evaluation vs Observability

They are related but different.

### Observability

Answers:

> **What happened?**

```text
Worker took 3.2 sec
MCP timed out
Retry occurred
```

### Evaluation

Answers:

> **Was what happened good enough?**

```text
Was the answer correct?
Was the right tool used?
Was the workflow successful?
Was the latency acceptable?
Was the cost acceptable?
```

Therefore:

```text
Observability → Evidence
Evaluation    → Judgment
```

---

# 47. Evaluation vs Testing

Also distinguish:

```text
Testing
→ Does the system behave according to expected rules?

Evaluation
→ How good is the system's behavior against quality/business criteria?

Observability
→ What actually happened in production?
```

All three are required.

---

# 48. Most Important Enterprise Metrics

If you need a concise KPI set, I recommend:

### Quality

```text
Goal Completion Rate
Answer Correctness
Groundedness
Tool Selection Accuracy
RAG Recall/Precision
```

### Reliability

```text
Workflow Success Rate
Failure Rate
Timeout Rate
Recovery Success Rate
Duplicate Execution Rate
```

### Latency

```text
P50
P95
P99
Critical Path Latency
```

### Cost

```text
Cost / Workflow
Cost / Successful Workflow
Tokens / Workflow
LLM Calls / Workflow
```

### Safety

```text
Unauthorized Access
Policy Violations
Sensitive Data Leakage
Unsafe Tool Calls
Prompt Injection Success
```

---

# 49. Final CWD Evaluation Architecture

```text id="z7d6ik"
                       USER REQUEST
                            │
                            ▼
                       CWD WORKFLOW
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
       QUALITY          RELIABILITY        LATENCY
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                           COST
                            │
                            ▼
                    SAFETY / SECURITY
                            │
                            ▼
                      OBSERVABILITY
                            │
                            ▼
                    EVALUATION ENGINE
                            │
               ┌────────────┼────────────┐
               ▼            ▼            ▼
            Offline       Online       Regression
            Eval          Eval         Detection
               │            │            │
               └────────────┼────────────┘
                            ▼
                     RELEASE GATE
                            │
                     ┌──────┴──────┐
                     ▼             ▼
                   PASS           FAIL
                     │             │
                     ▼             ▼
                  Deploy        Fix/Rollback
```

---

# 50. Final Formula

A useful enterprise formula is:

```text id="8gjxgk"
CWD Agent/Workflow Evaluation
=
Quality
+ Reliability
+ Latency
+ Cost
+ Safety
+ Security
+ User Satisfaction
+ Operational Stability
```

But the better decision model is:

```text id="c3s0fq"
Release Decision
=
Mandatory Safety/Security/Compliance Gates
+
Quality Threshold
+
Reliability SLA
+
Latency SLA
+
Cost Budget
```

---

# 51. Interview-Ready Answer

> **CWD evaluates agents and workflows across multiple dimensions rather than measuring only whether an LLM generated a good response. At the agent level, we evaluate intent classification, planning, task decomposition, agent and tool selection, RAG retrieval, tool execution, business correctness, and output validation. At the workflow level, we evaluate end-to-end goal completion, orchestration correctness, recovery, partial failures, and aggregation quality. Reliability is measured through success rate, failure rate, timeout rate, retry behavior, recovery success, and fault-injection testing. Latency is measured at P50, P95, and P99 and decomposed across Coordinator, Delegator, Workers, RAG, MCP, LLM, and aggregation, with particular attention to the workflow critical path. Cost includes LLM tokens and calls, embeddings, retrieval, compute, storage, messaging, and external services, with cost per successful workflow being more meaningful than cost per model call. Evaluation uses golden datasets, offline benchmarks, regression tests, production telemetry, and online evaluation. Agent, prompt, model, and workflow versions are tracked so changes can be evaluated and canary-released or rolled back. Security, authorization, safety, and compliance are treated as mandatory release gates rather than trade-offs against cost or quality.**

# Final Definition

> **Agent and workflow evaluation in CWD is the systematic measurement of whether individual agents and complete multi-agent workflows achieve their intended business objectives with acceptable quality, reliability, latency, cost, safety, and security. It combines golden datasets, offline evaluation, regression testing, fault injection, production observability, online evaluation, and release gates to continuously validate Coordinator, Delegator, Worker, RAG, MCP, prompt, model, and workflow behavior throughout the production lifecycle.**

### Mental Model

```text
                 CWD EVALUATION
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      QUALITY      RELIABILITY      LATENCY
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                      COST
                       │
                       ▼
                SAFETY / SECURITY
                       │
                       ▼
              OFFLINE + ONLINE EVAL
                       │
                       ▼
              RELEASE / CANARY / ROLLBACK
```

**In one sentence:**

> **CWD evaluation answers four fundamental questions—“Did it achieve the right result?”, “Did it execute reliably?”, “Did it meet the latency requirement?”, and “Did it do so at an acceptable cost?”—while enforcing safety and security as non-negotiable gates.**
