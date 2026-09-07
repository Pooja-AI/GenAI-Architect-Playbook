# Agent Latency Measurement in CWD

**Core principle:**

> **Agent latency measures how long an individual CWD agent takes to process and complete its assigned responsibility, from the time the agent receives a task until it produces a usable result.**

For CWD, latency must be measured at **agent, step, task, workflow, and end-to-end levels**.

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
 ┌───┼────┐
 ▼   ▼    ▼
RAG MCP  LLM
 │   │    │
 └───┼────┘
     ▼
  Result
     │
     ▼
Final Response
```

The objective is not simply:

> "How fast is the LLM?"

It is:

> **"How quickly does the agent accomplish its assigned business objective?"**

---

## 1. What Is Agent Latency?

For an individual agent:

$$
AgentLatency = T_{completion} - T_{start}
$$

Example:

```text
Agent receives task
       ↓
10:00:00.000
       │
       │ processing
       │
10:00:02.350
       ↓
Agent returns result
```

Therefore:

```text
Agent Latency = 2.350 seconds
```

---

# 2. Agent Latency vs Workflow Latency

This distinction is critical.

### Agent latency

Measures one agent:

```text
Delegator
   ↓
start
   ↓
execute
   ↓
result
```

### Workflow latency

Measures the complete CWD workflow:

```text
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
Aggregation
 ↓
Response
```

So:

```text
Agent latency = How long did this agent take?

Workflow latency = How long did the entire business process take?
```

A fast Worker does not necessarily mean a fast workflow.

---

# 3. What Should Be Included in Agent Latency?

For an agent, measure the complete processing boundary:

```text
Agent Latency
│
├── Queue / Message Wait
├── Input Validation
├── Context Assembly
├── Planning / Reasoning
├── Agent Selection
├── RAG
├── Tool Calls
├── LLM Calls
├── Business Logic
├── Output Validation
├── Aggregation
└── Response Serialization
```

Whether queue wait is included depends on the metric definition. For example, you may track both:

```text
Queue Wait Time
+
Agent Processing Time
=
Task End-to-End Latency
```

This avoids hiding bottlenecks.

---

# 4. Start and End Boundaries Must Be Defined

A common mistake is measuring latency inconsistently.

For example:

```text
Start:
message enters Service Bus

End:
result written to Cosmos DB
```

versus:

```text
Start:
Worker begins execution

End:
Worker returns result
```

These are different metrics.

Define explicit boundaries:

### Agent processing latency

```text
Agent receives task
        ↓
Agent returns result
```

### Task latency

```text
Task submitted
      ↓
Queue wait
      ↓
Agent execution
      ↓
Task completed
```

### Workflow latency

```text
User request
      ↓
Final response
```

---

# 5. Coordinator Latency

Coordinator latency can include:

```text
id="v1p7m2"
Request validation
       ↓
Intent classification
       ↓
Domain identification
       ↓
Planning
       ↓
Agent Registry lookup
       ↓
Policy checks
       ↓
Delegation
       ↓
Coordinator response
```

Example:

```json id="6c7f9p"
{
  "agent_id": "coordinator",
  "latency_ms": 450,
  "breakdown": {
    "intent": 80,
    "planning": 150,
    "registry": 40,
    "policy": 30,
    "delegation": 150
  }
}
```

---

# 6. Delegator Latency

Delegator latency measures:

```text
Receive task
     ↓
Validate
     ↓
Decompose
     ↓
Select Workers
     ↓
Execute
     ↓
Aggregate
     ↓
Return domain result
```

Example:

```text
id="x6g3p1"
Delegator latency = 3.2 sec

Decomposition       = 300 ms
Worker selection     = 100 ms
Worker execution     = 2.1 sec
Aggregation          = 500 ms
Output validation    = 200 ms
```

This allows you to identify the actual bottleneck.

---

# 7. Worker Latency

Worker latency can be decomposed into:

```text
Worker
 │
 ├── Input validation
 ├── RAG
 ├── MCP
 ├── LLM
 ├── Business logic
 └── Output validation
```

Example:

```json id="l8h3d2"
{
  "agent_id": "tracking-worker",
  "latency_ms": 1240,

  "breakdown": {
    "validation_ms": 50,
    "rag_ms": 300,
    "mcp_ms": 250,
    "llm_ms": 550,
    "output_validation_ms": 90
  }
}
```

Now you know:

> LLM latency isn't necessarily the biggest problem.

---

# 8. P50, P95, and P99

**Never rely only on average latency.**

Suppose 100 requests produce:

```text
Most requests → 1–2 seconds
A few requests → 15–20 seconds
```

Average may hide the problem.

Use percentiles:

### P50

Median latency.

50% of requests are faster than this.

### P95

95% of requests complete within this time.

### P99

99% complete within this time.

For enterprise SLAs, P95/P99 are particularly important.

---

# 9. Example

Suppose:

```text
1,000 agent executions
```

Results:

```text
P50 = 1.8 sec
P95 = 4.5 sec
P99 = 8.2 sec
```

Interpretation:

```text
Typical request → 1.8 sec
Slow tail        → 4.5 sec
Extreme tail     → 8.2 sec
```

This is much more useful than:

```text
Average = 2.4 sec
```

---

# 10. Latency Distribution

You should understand the distribution:

```text
Latency
  │
  │        █
  │       ███
  │      █████
  │   █████████
  │██████████████
  └──────────────────→ Time
     P50  P95  P99
```

Agent systems often have long-tail latency because of:

* retries
* slow tools
* RAG
* network calls
* overloaded Workers
* queue delays
* LLM variability
* downstream enterprise systems

---

# 11. Critical Path Latency

This is one of the most important concepts for CWD.

Suppose a Delegator launches three Workers in parallel:

```text
                Delegator
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      Worker A    Worker B    Worker C
        1 sec       3 sec       2 sec
        │           │           │
        └───────────┼───────────┘
                    ▼
                Aggregate
```

You don't normally wait:

$$
1 + 3 + 2 = 6s
$$

If they truly execute in parallel:

$$
T_{parallel} = \max(1,3,2)=3s
$$

plus coordination/aggregation overhead.

This is why **workflow DAG design directly affects latency**.

---

# 12. Sequential vs Parallel Latency

### Sequential

```text
Worker A → 2 sec
      ↓
Worker B → 3 sec
      ↓
Worker C → 2 sec
```

Approximate:

$$
T = 2+3+2=7s
$$

### Parallel

```text
       ┌→ Worker A → 2 sec ─┐
       ├→ Worker B → 3 sec ─┤
       └→ Worker C → 2 sec ─┘
                ↓
             Aggregate
```

Approximate:

$$
T = max(2,3,2)=3s
$$

plus overhead.

This is one reason LangGraph's dependency/parallel execution model is important in CWD.

---

# 13. Queue Latency

With Azure Service Bus:

```text
Producer
   ↓
Service Bus
   ↓
Queue wait
   ↓
Consumer
   ↓
Agent
```

You should separate:

```text
Queue Wait
```

from:

```text
Agent Processing
```

Example:

```text
Queue wait       = 1.5 sec
Agent processing = 2.0 sec

Task latency     = 3.5 sec
```

If processing is fast but queue wait is growing:

> The problem is capacity/backpressure, not the agent itself.

---

# 14. RAG Latency

For a RAG Worker:

```text
Query
 ↓
Embedding
 ↓
Azure AI Search
 ↓
Filtering
 ↓
Ranking
 ↓
Context assembly
```

Measure each component:

```text
Embedding        50 ms
Search          180 ms
Filtering        40 ms
Reranking       220 ms
Context          60 ms
```

Total:

```text
550 ms
```

You can then optimize the actual bottleneck.

---

# 15. MCP / Tool Latency

For a tool-enabled Worker:

```text
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Enterprise API
  ↓
Database
  ↓
Response
```

Measure:

```text
MCP serialization
MCP network
Enterprise API
Database
Response processing
```

Example:

```text
MCP overhead       = 50 ms
Enterprise API     = 700 ms
Database           = 300 ms
Worker processing  = 190 ms

Total              = 1,240 ms
```

---

# 16. LLM Latency

LLM latency should be broken down where possible:

```text
Request
   ↓
Queue
   ↓
Model processing
   ↓
Time to first token
   ↓
Token generation
   ↓
Complete response
```

Useful metrics include:

* time to first token
* time to last token
* total model latency
* input tokens
* output tokens
* number of model calls

A workflow with five LLM calls can be much slower than one with a single call.

---

# 17. Retry-Induced Latency

Retries can dramatically increase latency.

Example:

```text
Worker
 ↓
Attempt 1 → timeout after 2 sec
 ↓
Backoff → 500 ms
 ↓
Attempt 2 → timeout after 2 sec
 ↓
Backoff → 1 sec
 ↓
Attempt 3 → success after 1 sec
```

Total:

$$
T = 2 + 0.5 + 2 + 1 + 1 = 6.5s
$$

So track:

```text
Initial latency
Retry count
Retry wait
Final latency
```

Otherwise you may incorrectly blame the LLM or Worker.

---

# 18. Timeout Measurement

Track:

```text
Timeout Rate
Timeout Duration
Component Causing Timeout
Retry After Timeout
Recovery Success
```

Example:

```text
MCP timeout → 5 sec
Retry → 2 sec
Total → 7 sec
```

A system that frequently approaches timeout thresholds needs investigation even if the final success rate remains high.

---

# 19. Latency Budget

Define a latency budget for the workflow.

Example:

```text
Total SLA = 8 seconds
```

Budget:

```text
Gateway       = 200 ms
Coordinator   = 500 ms
Delegator     = 500 ms
Workers       = 3,000 ms
RAG           = 800 ms
MCP           = 1,000 ms
Aggregation   = 500 ms
Buffer        = 1,500 ms
```

The budget should be based on actual architecture and business SLA—not arbitrary numbers.

---

# 20. Agent Latency Budget

For a Worker:

```text
id="m9a5q3"
Worker SLA = 2 seconds
```

Break it down:

```text
Validation       100 ms
RAG              400 ms
MCP              500 ms
LLM              800 ms
Validation       100 ms
----------------------
Total           1900 ms
```

Only 100 ms remains as headroom.

That tells you the Worker is close to its latency limit.

---

# 21. Latency and Cost Are Connected

Usually:

```text
More LLM calls
      ↓
More latency
      ↓
More tokens
      ↓
More cost
```

Similarly:

```text
Huge RAG context
      ↓
More tokens
      ↓
More LLM processing
      ↓
Higher latency
      ↓
Higher cost
```

So evaluate:

```text
Quality
Latency
Cost
```

together.

---

# 22. Latency and Accuracy Are Also Connected

Optimizing latency blindly can reduce quality.

Example:

```text
Before:
Top 20 retrieval results
→ high quality
→ 5 sec

After:
Top 5 retrieval results
→ 2 sec
→ lower recall
```

Therefore:

> **The goal is not minimum latency; it is the required quality within the business latency SLA.**

---

# 23. Agent Latency Test Cases

Your golden dataset can contain latency expectations.

Example:

```json id="t8q5g0"
{
  "test_id": "TC-SHIP-001",

  "expected": {
    "business_outcome": "carrier_capacity",
    "max_latency_ms": 5000
  },

  "actual": {
    "business_outcome": "carrier_capacity",
    "latency_ms": 4200
  },

  "evaluation": {
    "accuracy": "PASS",
    "latency": "PASS"
  }
}
```

Another case:

```text
Correct answer = PASS
Latency = 7.2 sec
Maximum = 5 sec

Overall test = FAIL
```

This demonstrates why accuracy and latency are separate dimensions.

---

# 24. Agent Latency Telemetry

Every execution should carry latency information.

```json id="0i6lq6"
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",

  "agent_id": "tracking-worker",

  "started_at": "2026-09-06T15:00:00Z",
  "completed_at": "2026-09-06T15:00:01.240Z",

  "latency_ms": 1240,

  "breakdown": {
    "validation_ms": 50,
    "rag_ms": 300,
    "mcp_ms": 250,
    "llm_ms": 550,
    "output_validation_ms": 90
  },

  "retry_count": 0,
  "status": "completed"
}
```

This works particularly well with the CWD correlation hierarchy you've defined:

```text
Correlation ID
   ↓
Workflow ID
   ↓
Task ID
   ↓
Run ID
   ↓
Step ID
```

---

# 25. Agent Latency Evaluation Dashboard

A useful dashboard:

| Agent              |    P50 |    P95 |   P99 | Timeout | Retries |
| ------------------ | -----: | -----: | ----: | ------: | ------: |
| Coordinator        | 300 ms | 650 ms | 1.2 s |    0.1% |    0.2% |
| Shipping Delegator |  1.2 s |  2.8 s | 4.1 s |    0.5% |    1.1% |
| Tracking Worker    | 800 ms |  1.8 s | 3.2 s |    0.4% |    0.8% |
| RAG Worker         | 900 ms |  2.1 s | 3.5 s |    0.3% |    0.5% |

These are illustrative values.

---

# 26. Finding Latency Bottlenecks

Suppose:

```text
Workflow P95 = 8.5 sec
```

Breakdown:

```text
Coordinator       0.5 sec
Delegator         0.7 sec
RAG               0.8 sec
MCP               1.2 sec
LLM               4.5 sec
Aggregation       0.3 sec
Other             0.5 sec
```

The obvious candidate is:

```text
LLM = 4.5 sec
```

But investigate whether:

```text
Too many LLM calls?
Large context?
Slow model?
Repeated reasoning?
Unnecessary summarization?
```

before simply changing the model.

---

# 27. Latency Optimization Strategy

Use this sequence:

```text
Measure
  ↓
Break Down
  ↓
Identify Critical Path
  ↓
Find Bottleneck
  ↓
Optimize
  ↓
Re-measure
```

Possible optimizations:

### Workflow

* parallelize independent tasks
* remove unnecessary steps
* avoid redundant agent calls

### RAG

* reduce unnecessary retrieval
* optimize indexing
* filter early
* reduce context size

### LLM

* use appropriate model
* reduce unnecessary calls
* optimize prompts/context
* use structured output

### Tools

* optimize APIs
* connection pooling
* caching
* reduce round trips

### Infrastructure

* scale Workers
* reduce queue wait
* colocate dependent services where appropriate
* tune concurrency

---

# 28. Consistency of Latency

Since you just covered **agent consistency**, latency consistency is also useful.

Suppose:

```text
Run 1 → 1.2 sec
Run 2 → 1.3 sec
Run 3 → 1.1 sec
Run 4 → 8.5 sec
```

Average may hide the instability.

Therefore monitor:

```text
P50
P95
P99
Latency variance
Tail latency
```

A production agent should not only be fast—it should have **predictable latency**.

---

# 29. Agent Latency vs Throughput

These are different.

### Latency

How long one request takes.

### Throughput

How many requests the system can process per unit time.

Example:

```text
Agent latency = 2 seconds
Throughput = 50 requests/second
```

A high-throughput system can still have unacceptable individual latency.

---

# 30. Agent Latency vs Queue Backpressure

Consider:

```text
100 requests
     ↓
Service Bus
     ↓
Worker Pool
```

If Workers cannot keep up:

```text
Queue depth ↑
      ↓
Queue wait ↑
      ↓
Task latency ↑
```

The Worker's internal processing latency may remain constant.

This is why CWD should track both:

```text
Agent Processing Latency
+
Queue Waiting Latency
```

---

# 31. CWD End-to-End Latency

Ultimately:

$$
T_{E2E} =
T_{Gateway}
+
T_{Coordinator}
+
T_{Delegator}
+
T_{CriticalPath}
+
T_{Aggregation}
+
T_{Response}
$$

For parallel Workers:

$$
T_{CriticalPath}
=
\max(T_{parallel\ branches})
+
T_{dependent\ steps}
$$

This is more accurate than simply adding every Worker duration.

---

# 32. Latency Evaluation Lifecycle

```text
Golden Dataset
      ↓
Execute CWD
      ↓
Capture timestamps
      ↓
Measure agent latency
      ↓
Measure step latency
      ↓
Measure queue/tool/RAG/LLM latency
      ↓
Calculate P50/P95/P99
      ↓
Compare against SLA
      ↓
Identify bottleneck
      ↓
Optimize
      ↓
Regression test
```

---

# 33. Where Agent Latency Fits in Overall Evaluation

```text
                    CWD EVALUATION
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
     QUALITY          RELIABILITY          LATENCY
       │                  │                  │
   Accuracy            Success %           P50
   Consistency         Recovery            P95
   Groundedness        Retry               P99
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
                         COST
                          │
                          ▼
                   SAFETY / SECURITY
```

Latency is therefore one of the major evaluation dimensions alongside the accuracy and consistency concepts you've just covered.

---

# 34. Final Formula

### Basic agent latency

$$
AgentLatency = T_{completion} - T_{start}
$$

### Detailed agent latency

```text
Agent Latency
=
Queue Wait
+
Validation
+
Context Assembly
+
Reasoning
+
RAG
+
Tool/MCP Calls
+
LLM Calls
+
Business Logic
+
Output Validation
```

### Workflow latency

```text
CWD Workflow Latency
=
Gateway
+
Coordinator
+
Delegator
+
Critical Path
+
Aggregation
+
Response
```

---

# 35. Final Definition

> **Agent-latency measurement in CWD is the systematic measurement of the time required for an individual Coordinator, Delegator, or Worker to receive a task, perform its assigned processing, and produce a usable result. It captures total processing time and breaks it down into queue wait, validation, reasoning, RAG, MCP/tool calls, LLM calls, business logic, aggregation, retries, and output validation. Latency is evaluated using P50, P95, and P99 percentiles, critical-path analysis for parallel workflows, timeout and retry measurements, and defined latency budgets. Agent latency is then correlated with workflow latency, reliability, accuracy, and cost to ensure that performance optimization does not compromise business correctness or security.**

### Interview-ready answer

> **“For CWD, we measure latency at step, agent, task, workflow, and end-to-end levels. For each Coordinator, Delegator, and Worker we capture start/end timestamps and break latency down into queue wait, LLM, RAG, MCP, business logic, retries, and validation. We use P50, P95, and P99 rather than averages, identify the critical path in parallel workflows, and compare the results against business SLA budgets. This lets us determine whether latency comes from the agent itself, queue backpressure, RAG, tools, LLMs, or downstream systems, and optimize the actual bottleneck without sacrificing accuracy or reliability.”**
