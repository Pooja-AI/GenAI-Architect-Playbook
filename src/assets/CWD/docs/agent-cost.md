# LLM and Infrastructure Cost Measurement in CWD

**Core principle:**

> **CWD cost measurement determines how much it costs to execute an agent or complete workflow, including LLM inference, embeddings, RAG/search, compute, storage, networking, messaging, observability, and other platform services.**

The key architectural principle is:

> **Measure cost per LLM call, step, agent, task, run, workflow, and successful business outcome—not just the monthly Azure bill.**

---

## 1. CWD Cost Model

At a high level:

```text id="4w5j3q"
                    CWD COST
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      LLM          Infrastructure   External
      Cost             Cost          Services
        │              │              │
   ┌────┴────┐    ┌────┴─────┐       │
   ▼         ▼    ▼          ▼       APIs
Inference  Embedding Compute Storage
                 │
                 ├── Redis
                 ├── Cosmos DB
                 ├── AI Search
                 ├── Service Bus
                 ├── Networking
                 └── Observability
```

A useful conceptual formula is:

$$
Total\ CWD\ Cost =
LLM + Embedding + Compute + Storage + Search + Messaging + Network + Observability + External\ Services
$$

---

# 2. LLM Cost

LLM cost is usually driven primarily by:

```text id="t8r0e9"
Input Tokens
+
Output Tokens
+
Number of Model Calls
+
Model Pricing
```

Conceptually:

$$
LLMCost =
InputTokens \times InputPrice
+
OutputTokens \times OutputPrice
$$

If a workflow makes multiple LLM calls:

$$
WorkflowLLMCost =
\sum_{i=1}^{n}
(InputTokens_i \times InputPrice_i
+
OutputTokens_i \times OutputPrice_i)
$$

---

# 3. Example LLM Cost

Suppose a workflow performs:

```text id="7z4l9q"
Coordinator      → 4,000 tokens
Delegator        → 3,000 tokens
Worker           → 8,000 tokens
Final synthesis  → 3,000 tokens
```

Total:

$$
18,000\ tokens
$$

But don't stop there.

You need:

```text id="4q9d0x"
Which model?
Which version?
Input/output token split?
How many calls?
Was there a retry?
Was the result successful?
```

because these determine actual cost.

---

# 4. Input vs Output Cost

Many LLM providers price input and output differently.

Therefore capture separately:

```json id="2f6t5a"
{
  "input_tokens": 12000,
  "output_tokens": 2500,
  "total_tokens": 14500,
  "llm_calls": 4
}
```

Don't only store:

```text
total_tokens = 14500
```

because you lose important cost information.

---

# 5. Model Selection Affects Cost

Consider:

```text id="0gk5j3"
Simple classification
        ↓
Small/efficient model

Complex reasoning
        ↓
More capable model
```

A common enterprise optimization pattern is **model routing**:

```text id="1u3k9v"
Request
  ↓
Complexity classification
  │
  ├── Simple → Efficient Model
  │
  ├── Medium → Standard Model
  │
  └── Complex → Advanced Model
```

The decision should be governed and evaluated—not simply delegated to the LLM.

---

# 6. LLM Call Multiplication

This is especially important in multi-agent CWD.

Suppose one user request triggers:

```text id="6r5x7k"
Coordinator
  ├── LLM call
  │
  ↓
Delegator
  ├── LLM call
  │
  ↓
Worker A
  ├── LLM call
  │
Worker B
  ├── LLM call
  │
  ↓
Coordinator
  └── Final LLM call
```

That's **5 LLM calls for one user request**.

Therefore:

$$
WorkflowCost =
\sum Cost_{all\ LLM\ calls}
$$

A multi-agent architecture can improve specialization and reliability but also introduce additional inference cost.

---

# 7. Retry Cost

Retries consume resources.

Example:

```text id="l3a7mz"
LLM Call
   ↓
Timeout
   ↓
Retry
   ↓
Success
```

If the first request consumed:

```text
5K tokens
```

and the retry consumes:

```text
5K tokens
```

then:

```text
Total = 10K tokens
```

Therefore track:

```text id="0b8j5v"
initial_calls
retry_calls
retry_tokens
retry_cost
```

A high retry rate can become a significant hidden cost.

---

# 8. Embedding Cost

RAG introduces embedding costs.

During ingestion:

```text id="2w9j4p"
Documents
   ↓
Chunking
   ↓
Embedding Model
   ↓
Vectors
   ↓
Index
```

During runtime:

```text id="2q5q89"
User Query
   ↓
Query Embedding
   ↓
Vector Search
```

So distinguish:

```text id="s2u1f7"
Document Embedding Cost
+
Query Embedding Cost
```

For large enterprise corpora, ingestion embedding cost can be significant.

---

# 9. RAG / Search Infrastructure Cost

RAG can introduce:

```text id="6h4v3r"
Azure AI Search
Vector indexes
Semantic ranking
Storage
Indexing
Query operations
```

The cost model therefore becomes:

```text id="0x4qhz"
RAG Cost
│
├── Document processing
├── Embeddings
├── Indexing
├── Search
├── Semantic ranking
└── Storage
```

You should measure:

```text id="m3y5sj"
Cost / document
Cost / indexed GB
Cost / query
Cost / successful RAG workflow
```

---

# 10. Infrastructure Cost

LLM cost is only part of the CWD platform.

Infrastructure can include:

| Component                  | Cost Driver                          |
| -------------------------- | ------------------------------------ |
| Container Apps / AKS       | CPU, memory, replicas, runtime       |
| Cosmos DB                  | Requests, storage, throughput        |
| Redis                      | Instance size, memory, tier          |
| Azure AI Search            | Search capacity, replicas/partitions |
| Service Bus                | Messaging operations/tier            |
| Storage                    | Data volume, operations              |
| Networking                 | Data transfer, private networking    |
| Key Vault                  | Operations                           |
| App Insights               | Ingestion/storage                    |
| Log Analytics              | Log ingestion/storage                |
| Load balancers/API Gateway | Requests/throughput                  |
| Databases                  | Compute/storage/requests             |

Exact Azure pricing changes over time, so production cost models should use the current pricing for the selected Azure services and region.

---

# 11. Compute Cost

CWD services run somewhere:

```text id="q7eqe4"
Coordinator
Delegator
Worker
RAG Worker
MCP Server
Evaluation Service
```

Each consumes compute.

Conceptually:

$$
ComputeCost =
RuntimeDuration \times ResourceRate
$$

For containerized workloads:

$$
ComputeCost \approx
CPUUsage \times CPUPrice
+
MemoryUsage \times MemoryPrice
$$

depending on the service's pricing model.

---

# 12. Idle Capacity Is Also Cost

Consider:

```text id="v4d9hf"
Worker Pool
│
├── Worker 1 → 80%
├── Worker 2 → 70%
├── Worker 3 → 10%
├── Worker 4 → 5%
└── Worker 5 → 0%
```

If all instances remain provisioned:

```text id="0y2zq1"
Capacity Cost ↑
```

This is why autoscaling matters.

```text id="4p7d6s"
Low demand
   ↓
Fewer replicas

High demand
   ↓
More replicas
```

But autoscaling itself must be balanced against:

* cold-start latency
* SLA
* concurrency
* workload bursts
* minimum capacity

---

# 13. Worker Pool Cost

You previously separated **logical Worker capability** from physical Worker instances.

That distinction is very useful for cost measurement.

```text id="j5q9hv"
Logical Capability
      │
      ▼
Worker Pool
 ┌────┼────┐
 ▼    ▼    ▼
W1   W2   W3
```

Measure:

```text id="4j6q31"
Cost / Worker pool
Cost / Worker instance
Cost / task
Cost / successful task
Utilization
Idle capacity
```

This helps determine whether a Worker should be:

* dedicated
* shared
* autoscaled
* serverless
* pooled

---

# 14. Cosmos DB Cost

Cosmos DB cost can be associated with:

```text id="1o3r5x"
Sessions
Conversations
Turns
Workflows
Tasks
Runs
Steps
Execution history
Results/references
```

Track:

```text id="f7v2x9"
Requests
Storage
Throughput
Data volume
Cross-region usage
Retention
```

A major anti-pattern is using Cosmos as a high-volume telemetry sink.

Instead:

```text id="t6j2we"
Operational State
       ↓
Cosmos DB

High-volume telemetry
       ↓
Azure Monitor / App Insights / Log Analytics
```

---

# 15. Redis Cost

Redis cost is generally associated with:

```text id="8qk4h1"
Memory capacity
Instance/tier
Availability configuration
Throughput
Data retention
```

In CWD, Redis should primarily support:

```text id="p3y9sk"
Session context
Short-term memory
Cache
Locks
Temporary state
Coordination
```

Avoid storing unlimited conversation history or permanent data there.

---

# 16. Service Bus Cost

Service Bus introduces messaging cost:

```text id="e0d4ap"
Coordinator
   ↓
Service Bus
   ↓
Delegator
   ↓
Service Bus
   ↓
Worker
```

Measure:

```text id="1m8x0n"
Messages
Message size
Operations
Retries
Dead-letter messages
Queue utilization
```

A poorly designed workflow can create excessive messages:

```text id="j9y5m4"
One business request
      ↓
50 tiny messages
      ↓
50 processing operations
```

Messaging overhead should be part of the workflow cost model.

---

# 17. Observability Cost

Observability is often overlooked.

CWD may generate:

```text id="h3j6p8"
Logs
Metrics
Traces
LLM telemetry
Tool events
Agent events
Workflow events
Security events
Audit events
```

If you log huge prompts and tool outputs:

```text id="w9r2v6"
Large payload
   ↓
Large logs
   ↓
Higher ingestion
   ↓
Higher storage
   ↓
Higher observability cost
```

Therefore use:

```text id="s8x4md"
Metadata + References
```

instead of blindly logging entire payloads.

---

# 18. External API Cost

Workers may call:

```text id="r8m2v0"
ERP
CRM
Shipping
Finance
Manufacturing
Cloud APIs
Third-party APIs
```

These can have their own costs.

Therefore:

$$
WorkflowCost =
PlatformCost + ExternalServiceCost
$$

External API calls should be attributed to the correct:

```text id="v7n2s4"
correlation_id
workflow_id
task_id
agent_id
```

---

# 19. Cost Attribution Hierarchy

Use the same state hierarchy you've been building:

```text id="9w4m1e"
Tenant
  ↓
User / Application
  ↓
Session
  ↓
Conversation Turn
  ↓
Workflow
  ↓
Task
  ↓
Run
  ↓
Step
  ↓
Agent / Worker
  ↓
LLM / Tool / Infrastructure
```

This lets you answer:

> "How much did this business workflow cost?"

rather than:

> "How much did Azure cost this month?"

---

# 20. Cost per Agent

Example:

```json id="k3d5z7"
{
  "agent_id": "shipping-worker",

  "llm_cost": 0.12,
  "compute_cost": 0.03,
  "rag_cost": 0.01,
  "mcp_cost": 0.00,
  "observability_cost": 0.005,

  "total_cost": 0.165
}
```

These numbers are illustrative.

---

# 21. Cost per Task

Suppose:

```text id="f5v2x6"
Task WT-1001
```

consumes:

```text id="7u1q9a"
LLM          $0.12
Compute      $0.03
RAG          $0.01
Messaging    $0.005
Observability $0.005
--------------------
Total        $0.17
```

Then:

$$
TaskCost = \$0.17
$$

---

# 22. Cost per Workflow

Suppose:

```text id="2x7r4p"
Coordinator      $0.03
Delegator        $0.04
Worker A         $0.12
Worker B         $0.08
RAG              $0.02
Infrastructure   $0.04
Messaging        $0.01
Observability    $0.01
```

Then:

$$
WorkflowCost = \$0.35
$$

This is a much more useful production KPI.

---

# 23. Cost per Successful Workflow

This is one of the most important enterprise metrics.

Suppose:

```text id="0n5v8d"
1000 workflows
900 successful

Total cost = $350
```

Then:

$$
CostPerSuccessfulWorkflow
=
\frac{350}{900}
=
\$0.389
$$

The metric captures both:

* resource consumption
* execution effectiveness

---

# 24. Failed Workflow Cost

Failures still consume money.

Suppose:

```text id="q2x5z8"
100 failed workflows
Average cost = $0.30
```

Then:

$$
FailureCost = 100 \times 0.30 = \$30
$$

Reasons may include:

```text
LLM failure
MCP timeout
Worker failure
RAG failure
Policy rejection
Agent unavailable
Retry exhaustion
```

Tracking failure cost helps identify expensive failure patterns.

---

# 25. Retry Cost

Suppose:

```text id="3r9h5t"
Normal workflow = $0.30

Retry 1 = $0.12
Retry 2 = $0.12
```

Then:

$$
Total = 0.30 + 0.12 + 0.12 = \$0.54
$$

Therefore:

> **Reliability problems can become cost problems.**

This connects your previous reliability evaluation directly to cost evaluation.

---

# 26. Cost of Over-Context

Consider:

```text id="u4h6q2"
Prompt
+
20 RAG chunks
+
full conversation
+
all memory
+
large tool response
```

Result:

```text id="g6v3n8"
Input tokens ↑
      ↓
LLM cost ↑
      ↓
Latency ↑
```

This is why:

```text
Context Engineering
```

is simultaneously:

```text
Quality Engineering
+
Latency Engineering
+
Cost Engineering
```

---

# 27. Cost of Multi-Agent Orchestration

Multi-agent systems can increase cost because:

```text id="m6t2k4"
One request
   ↓
Coordinator LLM
   ↓
Delegator LLM
   ↓
Worker A LLM
   ↓
Worker B LLM
   ↓
Reviewer LLM
   ↓
Final LLM
```

The architecture should therefore justify every additional agent/model call.

A useful question is:

> **Does this additional agent improve business outcome enough to justify its incremental cost and latency?**

---

# 28. Cost vs Quality

Never optimize cost independently.

Consider:

| Version | Accuracy | Tokens |  Cost | Latency |
| ------- | -------: | -----: | ----: | ------: |
| V1      |      90% |     8K | $0.20 |      3s |
| V2      |      94% |    12K | $0.32 |      4s |
| V3      |    94.2% |    25K | $0.65 |      7s |

V3 may not be worth the additional cost for only a tiny quality improvement.

The objective is:

$$
Maximize\ BusinessValue
$$

subject to:

$$
Quality \ge Threshold
$$

$$
Latency \le SLA
$$

$$
Cost \le Budget
$$

$$
Security = PASS
$$

$$
Safety = PASS
$$

---

# 29. Cost Efficiency

A useful conceptual metric is:

$$
CostEfficiency =
\frac{SuccessfulBusinessOutcomes}{TotalCost}
$$

Another practical metric:

$$
CostPerSuccessfulWorkflow =
\frac{TotalCost}{SuccessfulWorkflows}
$$

The second is usually easier to operationalize.

---

# 30. CWD Cost Telemetry

Each meaningful execution should carry cost metadata:

```json id="w8n4c6"
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-005",

  "agent_id": "tracking-worker",

  "llm": {
    "model": "approved-model",
    "input_tokens": 4200,
    "output_tokens": 850,
    "llm_cost": 0.12
  },

  "infrastructure": {
    "compute_cost": 0.03,
    "storage_cost": 0.002,
    "messaging_cost": 0.005,
    "observability_cost": 0.003
  },

  "total_step_cost": 0.16,

  "status": "completed"
}
```

Again, monetary values are illustrative.

---

# 31. Cost Aggregation

The system can aggregate:

```text id="w2h5t9"
Step Cost
    ↓
Run Cost
    ↓
Task Cost
    ↓
Agent Cost
    ↓
Workflow Cost
    ↓
Session Cost
    ↓
Tenant Cost
    ↓
Platform Cost
```

This gives FinOps and platform engineering teams visibility at multiple levels.

---

# 32. Cost Dashboard

A useful CWD dashboard could contain:

| Metric                   | Example |
| ------------------------ | ------: |
| Total platform cost      |      $X |
| LLM cost                 |      $X |
| Infrastructure cost      |      $X |
| Embedding cost           |      $X |
| Search cost              |      $X |
| Messaging cost           |      $X |
| Observability cost       |      $X |
| Cost/request             |      $X |
| Cost/task                |      $X |
| Cost/workflow            |      $X |
| Cost/successful workflow |      $X |
| Retry cost               |      $X |
| Failed workflow cost     |      $X |
| Tokens/workflow          |       X |
| P95 latency              |   X sec |
| Success rate             |      X% |

---

# 33. Cost Allocation

In an enterprise, allocate costs by:

```text id="h6q2n9"
Tenant
Business Unit
Application
Agent
Workflow
Capability
Environment
Model
Team
Project
```

For example:

```text id="e8x3p4"
Finance
 ├── Invoice Agent
 ├── Forecast Agent
 └── Reporting Agent

Manufacturing
 ├── Quality Agent
 ├── Maintenance Agent
 └── Supply Chain Agent
```

Now platform owners can see which capabilities consume the most resources.

---

# 34. Environment Cost

Separate:

```text id="m2x6v7"
DEV
UAT
PROD
```

Otherwise development experimentation can distort production economics.

For example:

```text id="0z7j5h"
DEV
10,000 evaluation runs
      ↓
Large LLM consumption
```

This should not be confused with:

```text
PROD
10,000 business workflows
```

---

# 35. Cost Regression

You should evaluate cost whenever you change:

* model
* prompt
* agent
* workflow
* RAG configuration
* chunking
* retrieval `K`
* context size
* tool strategy
* retry policy

Example:

```text id="y8t3p6"
Before:
8K tokens
$0.20/workflow
92% accuracy

After:
15K tokens
$0.40/workflow
93% accuracy
```

You can now determine whether the change is economically justified.

---

# 36. Cost Optimization Lifecycle

```text id="y6n2q8"
Measure
   ↓
Attribute
   ↓
Break Down
   ↓
Identify Cost Drivers
   ↓
Optimize
   ↓
Evaluate Quality
   ↓
Evaluate Latency
   ↓
Recalculate Cost
   ↓
Deploy
   ↓
Monitor
```

---

# 37. Major CWD Cost Optimization Techniques

### LLM

```text
Model routing
Prompt optimization
Context reduction
Output limits
Caching
Reduce redundant calls
```

### RAG

```text
Better chunking
Better retrieval
Metadata filtering
Deduplication
Context compression
```

### Agents

```text
Avoid unnecessary agent hops
Use deterministic logic where appropriate
Parallelize independent work
Avoid redundant planning
```

### Infrastructure

```text
Autoscaling
Right-sizing
Worker pooling
Serverless where appropriate
Remove idle resources
```

### Messaging

```text
Avoid unnecessary messages
Batch where appropriate
Tune retry/DLQ policies
```

### Observability

```text
Structured metadata
Sampling
Payload references
Retention policies
```

---

# 38. Cost Architecture

A mature CWD architecture can look like:

```text
                         USER
                           │
                           ▼
                      COORDINATOR
                           │
                      ┌────┴────┐
                      ▼         ▼
                 DELEGATOR   DELEGATOR
                    │           │
              ┌─────┴─────┐ ┌──┴────┐
              ▼     ▼     ▼ ▼       ▼
             W1    W2    W3 W4      W5
              │     │     │
        ┌─────┴─────┴─────┴─────┐
        ▼                       ▼
       LLM                    MCP/RAG
        │                       │
        └──────────┬────────────┘
                   ▼
             INFRASTRUCTURE
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
   Cosmos        Redis       Service Bus
      │
      ▼
 Observability
```

Every layer should emit cost-attribution metadata.

---

# 39. Important Distinction

You should keep these concepts separate:

| Concept             | Question                                         |
| ------------------- | ------------------------------------------------ |
| Token usage         | How many tokens did we consume?                  |
| LLM cost            | How much did model inference cost?               |
| Infrastructure cost | How much did platform execution cost?            |
| Workflow cost       | How much did this workflow cost?                 |
| Cost efficiency     | How much business value did we get for the cost? |
| FinOps              | How do we control and optimize spending?         |

---

# 40. Relationship With Your Previous Metrics

You now have four connected evaluation dimensions:

```text id="k3z7v2"
              CWD Evaluation
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Accuracy     Consistency   Reliability
       │            │            │
       └────────────┼────────────┘
                    ▼
                  Latency
                    │
                    ▼
                  Tokens
                    │
                    ▼
                   Cost
```

The important relationship is:

```text
More context
    ↓
More tokens
    ↓
Higher LLM cost
    ↓
Potentially higher latency
```

but also:

```text
Too little context
    ↓
Lower accuracy
    ↓
More retries / failures
    ↓
Potentially higher total cost
```

Therefore **cost optimization must be outcome-aware**.

---

# 41. Enterprise Cost Formula

A useful CWD model is:

$$
CWD_{TotalCost}
=
C_{LLM}
+
C_{Embedding}
+
C_{Compute}
+
C_{Storage}
+
C_{Search}
+
C_{Messaging}
+
C_{Network}
+
C_{Observability}
+
C_{External}
$$

And:

$$
C_{Workflow}
=
\sum C_{LLM}
+
\sum C_{Infrastructure}
+
\sum C_{External}
$$

Finally:

$$
CostPerSuccessfulWorkflow
=
\frac{TotalWorkflowCost}
{SuccessfulWorkflows}
$$

---

# 42. Final Definition

> **LLM and infrastructure cost measurement in CWD is the systematic measurement, attribution, and optimization of all resources consumed to execute agents and complete business workflows. LLM cost includes input/output token consumption, model selection, embedding usage, repeated calls, and retries. Infrastructure cost includes compute, Worker pools, Cosmos DB, Redis, Azure AI Search, Service Bus, storage, networking, observability, and external services. Costs are correlated through tenant, session, turn, workflow, task, run, step, agent, and model identifiers so that CWD can calculate cost per agent, task, workflow, and successful business outcome. Cost is evaluated together with quality, accuracy, consistency, reliability, latency, and security rather than optimized independently.**

### Interview-ready answer

> **“In CWD, I measure cost at LLM-call, step, agent, task, run, workflow, and business-outcome levels. For LLMs, I capture input and output tokens, model, number of calls, retries, and embedding consumption. For infrastructure, I attribute compute, Worker capacity, Cosmos DB, Redis, Azure AI Search, Service Bus, networking, storage, observability, and external API costs. All measurements are correlated using workflow and task identifiers so we can calculate cost per successful workflow. We then evaluate cost against accuracy, reliability, latency, and business value. The goal is not simply to minimize spend, but to achieve the required business quality and reliability at the lowest sustainable cost.”**
