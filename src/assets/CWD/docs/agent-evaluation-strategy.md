# Overall Evaluation Strategy for CWD

**Core principle:**

> **CWD evaluation should measure the complete agentic system—not just the LLM—by continuously evaluating quality, reliability, latency, cost, safety, and business outcomes at agent, workflow, and end-to-end levels.**

The overall strategy is:

```text id="r9f4qx"
                    CWD EVALUATION STRATEGY
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
          OFFLINE           ONLINE          CONTINUOUS
         EVALUATION        EVALUATION       EVALUATION
              │               │                │
              └───────────────┼────────────────┘
                              ▼
                     RELEASE / QUALITY GATE
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                  PASS                 FAIL
                    │                   │
                    ▼                   ▼
                 DEPLOY             FIX / ROLLBACK
```

---

## 1. What the Strategy Evaluates

CWD should evaluate at **four levels**:

| Level                | Question                                                           |
| -------------------- | ------------------------------------------------------------------ |
| **Model**            | Is the LLM capable enough?                                         |
| **Agent**            | Does each agent perform its responsibility correctly?              |
| **Workflow**         | Does the Coordinator → Delegator → Worker workflow work correctly? |
| **Business outcome** | Did the system actually solve the user's problem?                  |

For example:

```text id="w0f4jg"
User Request
     │
     ▼
Coordinator
     │
     ├── Intent Accuracy
     ├── Planning Quality
     └── Routing Accuracy
     │
     ▼
Delegator
     │
     ├── Decomposition
     ├── Worker Selection
     └── Dependency Management
     │
     ▼
Workers
     │
     ├── RAG
     ├── MCP
     ├── Business Logic
     └── Validation
     │
     ▼
Final Response
     │
     ├── Correctness
     ├── Groundedness
     ├── Completeness
     └── User Satisfaction
```

---

# 2. Multi-Dimensional Evaluation

Do not use only accuracy.

The evaluation scorecard should include:

```text id="4x2q0b"
                    EVALUATION
                        │
     ┌──────────────────┼──────────────────┐
     ▼                  ▼                  ▼
   QUALITY         RELIABILITY          LATENCY
     │                  │                  │
     └──────────────────┼──────────────────┘
                        ▼
                       COST
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
            SAFETY             SECURITY
```

### Quality

* correctness
* relevance
* groundedness
* tool selection
* RAG retrieval
* task completion
* response quality

### Reliability

* success rate
* failure rate
* timeout rate
* retry behavior
* recovery success
* duplicate execution

### Latency

* P50
* P95
* P99
* critical-path latency
* agent-level latency

### Cost

* LLM tokens
* number of LLM calls
* embedding cost
* RAG/search
* compute
* external APIs
* cost per successful workflow

### Safety/Security

* authorization violations
* sensitive-data leakage
* prompt injection
* unsafe tool calls
* policy violations
* cross-tenant leakage

---

# 3. Evaluation Starts with Business Objectives

Don't start with:

> "Which LLM is best?"

Start with:

> **"What does success mean for this CWD use case?"**

Example:

### Business objective

```text
Identify why a shipment is delayed
and recommend an appropriate action.
```

Define:

```text id="8p8q3m"
Expected Intent
Expected Domain
Expected Agents
Expected Tools
Expected Evidence
Expected Answer
Expected SLA
Expected Cost
Expected Security Policy
```

This becomes the evaluation contract.

---

# 4. Build a Golden Evaluation Dataset

Create representative test cases:

```text id="v1y5cp"
Golden Dataset
     │
     ├── Normal cases
     ├── Edge cases
     ├── Ambiguous requests
     ├── RAG cases
     ├── Tool-calling cases
     ├── Multi-agent cases
     ├── Failure cases
     ├── Security cases
     └── Adversarial cases
```

Each case should contain:

```json id="j8f4u3"
{
  "test_id": "TC-001",
  "input": "Why is shipment SHIP123 delayed?",

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

For high-value workflows, maintain **golden answers/evidence** where practical.

---

# 5. Evaluate Offline Before Deployment

The first gate is:

```text id="7h5vgo"
Code / Prompt / Model Change
          ↓
Unit Tests
          ↓
Agent Evaluation
          ↓
Workflow Evaluation
          ↓
Golden Dataset
          ↓
Security/Safety Tests
          ↓
Performance Tests
          ↓
Release Decision
```

This prevents an untested change from reaching production.

---

# 6. Agent-Level Evaluation

Each CWD agent gets its own evaluation suite.

### Coordinator

```text
Intent accuracy
Domain classification
Planning quality
Agent selection accuracy
Routing accuracy
```

### Delegator

```text
Task decomposition
Dependency correctness
Worker selection
Parallelization
Aggregation
Recovery
```

### Worker

```text
Task correctness
Tool selection
Tool arguments
RAG retrieval
Business logic
Output validation
```

This makes failures easier to localize.

---

# 7. Workflow-Level Evaluation

Individual agent scores aren't enough.

Consider:

```text id="v1v8gq"
Coordinator       95%
Delegator         95%
Worker A          98%
Worker B          97%
```

Yet the workflow could still fail because the Coordinator selected the wrong Delegator or the Delegator aggregated results incorrectly.

Therefore measure:

```text
Workflow Goal Completion
Workflow Success Rate
Correct Routing
Correct Decomposition
Correct Aggregation
Recovery Success
```

---

# 8. End-to-End Business Evaluation

Ultimately:

> **Did the user get the right business outcome?**

Example:

```text id="8w8y0l"
User
 ↓
CWD
 ↓
Multiple Agents
 ↓
Enterprise Systems
 ↓
Final Answer
```

The final evaluation should consider:

```text
Correct?
Grounded?
Authorized?
Complete?
Actionable?
Within SLA?
Within Cost Budget?
```

This is the most important evaluation layer.

---

# 9. Failure Evaluation

A mature strategy deliberately tests failure.

```text id="z4p3mm"
Worker unavailable
MCP timeout
API failure
RAG unavailable
LLM timeout
Invalid Worker output
Service Bus redelivery
Cosmos conflict
Agent unavailable
Policy rejection
Human approval timeout
```

Then verify:

```text
Retry?
Rediscover?
Failover?
Resume?
Escalate?
Terminate?
```

This tests the actual resilience of CWD.

---

# 10. Evaluate Recovery, Not Just Failure

Suppose:

```text id="nq8c3h"
Worker A
   ↓
FAILED
   ↓
Delegator
   ↓
Agent Registry
   ↓
Worker B
   ↓
SUCCESS
```

The important metric isn't merely:

```text
Worker A failure = 1
```

It is:

```text
Recovery Success Rate
```

This measures whether CWD can continue execution after failure.

---

# 11. Performance Evaluation

Run load/performance tests.

Evaluate:

```text id="f9m4fr"
10 requests
100 requests
1,000 requests
10,000 requests
```

Measure:

```text
P50
P95
P99
Throughput
Queue depth
Concurrency
CPU
Memory
LLM latency
RAG latency
MCP latency
End-to-end latency
```

Also test the critical path of parallel workflows.

---

# 12. Cost Evaluation

Every execution should carry cost metadata.

```text id="7d7xay"
Workflow
   │
   ├── Coordinator LLM
   ├── Delegator LLM
   ├── Worker LLM
   ├── RAG
   ├── MCP/API
   └── Infrastructure
```

Calculate:

```text
Cost per Request
Cost per Workflow
Cost per Successful Workflow
Cost per Agent
Cost per Task
Cost per Business Outcome
```

The last one is particularly useful for enterprise optimization.

---

# 13. Security and Safety as Hard Gates

This is extremely important.

Do not treat security as just another weighted metric.

For example:

```text id="b4n4de"
Quality       = 98%
Latency       = Excellent
Cost          = Low

BUT

Unauthorized Data Access = TRUE
```

Result:

```text
                 RELEASE
                    │
             Security FAIL
                    │
                    ▼
                 BLOCK
```

So:

```text
Security / Safety / Compliance
              ↓
       Mandatory Gates
```

---

# 14. Observability Feeds Evaluation

Every execution should produce structured telemetry:

```json id="g5o4aj"
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",

  "agent_id": "tracking-worker",
  "agent_version": "2.4.1",

  "prompt_version": "3.1.0",
  "model_version": "4.0",

  "latency_ms": 1240,
  "input_tokens": 2300,
  "output_tokens": 450,

  "status": "completed"
}
```

This gives the evaluation system the evidence needed to determine:

```text
What happened?
Why did it happen?
Was it correct?
How much did it cost?
How long did it take?
```

---

# 15. Offline + Online Evaluation

A strong strategy uses both.

### Offline

```text
Known Dataset
     ↓
Controlled Environment
     ↓
Repeatable Evaluation
```

Useful for:

* prompt changes
* model changes
* agent changes
* RAG changes
* workflow changes

### Online

```text
Real Production Traffic
        ↓
Telemetry
        ↓
Evaluation
```

Useful for:

* real-world behavior
* user feedback
* drift
* unexpected failures
* production latency
* actual cost

---

# 16. Continuous Evaluation

The strategy should become a closed loop:

```text id="l8eq0g"
             BUILD
               ↓
            EVALUATE
               ↓
            DEPLOY
               ↓
           MONITOR
               ↓
        PRODUCTION DATA
               ↓
           EVALUATE
               ↓
        DETECT REGRESSION
               ↓
       ┌───────┴────────┐
       ▼                ▼
    IMPROVE           ROLLBACK
       │
       ▼
    RE-EVALUATE
       │
       └──────→ DEPLOY
```

This is the essence of **continuous evaluation** for agentic systems.

---

# 17. Regression Evaluation

Every change should answer:

```text
Did quality improve?
Did reliability improve?
Did latency worsen?
Did cost increase?
Did safety regress?
```

Example:

| Version | Quality | Reliability |  P95 |  Cost |
| ------- | ------: | ----------: | ---: | ----: |
| v1      |     92% |       98.5% | 4.2s | $0.20 |
| v2      |     95% |       99.0% | 5.1s | $0.27 |

v2 is better quality/reliability but more expensive/slower.

The release decision depends on business SLAs.

---

# 18. Evaluation Gates

A production release can use:

```text id="8m3y8c"
                 CHANGE
                   ↓
           ┌───────────────┐
           │ Security Gate │
           └───────┬───────┘
                   ↓ PASS
           ┌───────────────┐
           │ Quality Gate  │
           └───────┬───────┘
                   ↓ PASS
           ┌────────────────┐
           │ Reliability    │
           │ Gate           │
           └───────┬────────┘
                   ↓ PASS
           ┌────────────────┐
           │ Latency / Cost │
           │ Gate           │
           └───────┬────────┘
                   ↓ PASS
                CANARY
                   ↓
             PRODUCTION
```

---

# 19. Canary Evaluation

For a new agent/model/prompt:

```text id="9b4q6z"
Version 1 → 95%
Version 2 → 5%
```

Compare:

```text
Quality
Reliability
P95 latency
Cost
Safety
User feedback
```

If healthy:

```text
5% → 20% → 50% → 100%
```

If degraded:

```text
Version 2
    ↓
ROLLBACK
    ↓
Version 1
```

---

# 20. Evaluation Matrix

A useful enterprise scorecard is:

| Dimension         | Agent | Workflow | Production |
| ----------------- | ----- | -------- | ---------- |
| Quality           | ✓     | ✓        | ✓          |
| Reliability       | ✓     | ✓        | ✓          |
| Latency           | ✓     | ✓        | ✓          |
| Cost              | ✓     | ✓        | ✓          |
| Safety            | ✓     | ✓        | ✓          |
| Security          | ✓     | ✓        | ✓          |
| RAG               | ✓     | ✓        | ✓          |
| Tool usage        | ✓     | ✓        | ✓          |
| User satisfaction | —     | ✓        | ✓          |
| Business outcome  | —     | ✓        | ✓          |

---

# 21. CWD Evaluation Architecture

Putting everything together:

```text id="t0q2f6"
                         CWD
                          │
                 ┌────────┴────────┐
                 │                 │
          Agent Execution     Workflow Execution
                 │                 │
                 └────────┬────────┘
                          ▼
                    TELEMETRY
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
       QUALITY        RELIABILITY       PERFORMANCE
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                        COST
                          │
                    SAFETY/SECURITY
                          │
                          ▼
                 EVALUATION ENGINE
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
       OFFLINE          ONLINE          REGRESSION
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                    RELEASE GATE
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                  DEPLOY      ROLLBACK
                    │
                    ▼
                  CANARY
                    │
                    ▼
                PRODUCTION
```

---

# 22. Role of the Major CWD Components

The evaluation strategy connects directly to the architecture:

```text id="3p9xuw"
Agent Registry
      │
      └── Agent/version identity

Prompt Registry
      │
      └── Prompt/version identity

LangGraph
      │
      └── Workflow/step execution

A2A
      │
      └── Agent interaction

MCP
      │
      └── Tool interaction

RAG
      │
      └── Retrieval quality

Service Bus
      │
      └── Messaging reliability

Cosmos DB
      │
      └── Durable execution state

Redis
      │
      └── Working state/cache

Observability
      │
      └── Execution evidence

Evaluation Engine
      │
      └── Quality judgment
```

---

# 23. The Most Important Concept

Don't think:

```text
LLM Evaluation
```

Think:

```text
Model
   +
Prompt
   +
Agent
   +
Tools
   +
RAG
   +
Workflow
   +
Policies
   +
Infrastructure
   +
Business Outcome
```

Therefore:

> **Agent evaluation is a subset of workflow evaluation, and workflow evaluation is a subset of overall CWD system evaluation.**

---

# 24. Overall Evaluation Formula

```text id="q8g1yn"
CWD Evaluation Strategy
=
Business Objective Definition
+
Golden Dataset
+
Agent Evaluation
+
Workflow Evaluation
+
Quality Measurement
+
Reliability Testing
+
Latency Measurement
+
Cost Measurement
+
Safety/Security Validation
+
Offline Evaluation
+
Online Evaluation
+
Regression Testing
+
Production Monitoring
+
Release Gates
+
Continuous Improvement
```

### Final definition

> **The overall CWD evaluation strategy is a continuous, multi-dimensional evaluation framework that validates individual agents, complete workflows, and end-to-end business outcomes across quality, reliability, latency, cost, safety, and security. It combines golden datasets, offline testing, workflow and agent evaluation, fault injection, performance testing, production telemetry, online evaluation, regression detection, canary releases, and automated release gates. Security, safety, and compliance act as mandatory gates, while quality, reliability, latency, and cost are optimized against defined enterprise SLAs and business objectives.**

### Interview-ready one-liner

> **“Our CWD evaluation strategy is not just LLM evaluation; we evaluate the model, prompt, agent, tools, RAG, and complete Coordinator–Delegator–Worker workflow against business outcomes, using offline golden datasets and online production telemetry, with quality, reliability, latency, cost, and safety/security gates driving continuous improvement, canary deployment, and rollback.”**
