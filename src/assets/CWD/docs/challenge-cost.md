# LLM & Infrastructure Cost Optimization in CWD

## 1. Core Principle

In an enterprise multi-agent system, cost is not simply:

> **“How much does one LLM call cost?”**

The real question is:

> **“How much does it cost to successfully complete one business workflow?”**

A single user request may trigger:

```text id="2c8q8n"
1 User Request
      ↓
1 Coordinator
      ↓
2 Delegators
      ↓
5 Workers
      ↓
8 LLM Calls
      ↓
4 RAG Queries
      ↓
6 Tool Calls
      ↓
2 Retries
      ↓
Final Response
```

Therefore, agentic architecture can create **cost amplification**.

---

# 2. Total CWD Cost

A useful model is:

$$
\boxed{
C_{CWD} =
C_{LLM}
+
C_{Embedding}
+
C_{RAG}
+
C_{Compute}
+
C_{Storage}
+
C_{Messaging}
+
C_{Network}
+
C_{Observability}
+
C_{External}
}
$$

And more importantly:

$$
\boxed{
CostPerSuccessfulWorkflow =
\frac{TotalCost}{SuccessfulWorkflows}
}
$$

This is more useful than looking only at the price of an individual model call.

---

# 3. Where Cost Comes From

```text id="8q0p1l"
                    CWD COST
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
      LLM          Infrastructure    External
       │               │                │
   ┌───┼───┐       ┌───┼────┐           │
   ▼   ▼   ▼       ▼   ▼    ▼           ▼
 Input Output Calls Compute Storage    APIs
 Tokens Tokens Retries Redis Cosmos
             │       Search Service Bus
             │       Observability
             ▼
          Embeddings
```

---

# 4. LLM Cost

For an LLM call:

$$
C_{LLM}
=
InputTokens \times InputPrice
+
OutputTokens \times OutputPrice
$$

Example:

```text id="rppq2v"
Input = 10,000 tokens
Output = 2,000 tokens
```

The cost becomes significant when this happens across:

```text id="x0x5s3"
100,000 requests
×
multiple agent hops
×
multiple LLM calls
```

---

# 5. Agent Cost Amplification

Suppose:

```text id="m38c2p"
1 user request
    ↓
Coordinator → 1 LLM call
    ↓
Delegator → 1 LLM call
    ↓
Worker A → 2 LLM calls
Worker B → 2 LLM calls
Worker C → 1 LLM call
    ↓
Final response → 1 LLM call
```

Total:

$$
1+1+2+2+1+1=8
$$

LLM calls for one request.

If each call consumes 5,000 tokens:

$$
8 \times 5,000 = 40,000
$$

tokens per workflow.

This is why **controlling unnecessary agent execution** is one of the most important cost controls.

---

# 6. Model Selection

Not every task requires the largest model.

Use model routing:

```text id="j0z6dd"
                    Task
                      │
                      ▼
                Complexity Check
                      │
             ┌────────┼────────┐
             ▼        ▼        ▼
          Simple    Medium   Complex
             │        │        │
             ▼        ▼        ▼
          Small     Medium    Large
          Model     Model     Model
```

Example:

| Task                     | Model Strategy |
| ------------------------ | -------------- |
| Intent classification    | Small          |
| Simple extraction        | Small          |
| Summarization            | Small/medium   |
| Tool argument generation | Small/medium   |
| Complex planning         | Large          |
| Difficult reasoning      | Large          |
| Final synthesis          | Medium/large   |

The goal is:

$$
\boxed{
MinimumModelCapacity
\text{ that satisfies QualityRequirement}
}
$$

---

# 7. Model Routing

Conceptually:

```python id="y2hm1a"
def select_model(task):

    if task.type == "classification":
        return "small-model"

    if task.type == "simple-extraction":
        return "small-model"

    if task.complexity == "medium":
        return "medium-model"

    return "large-model"
```

But model selection should also consider:

```text id="k9m5fo"
Quality
Latency
Cost
Context size
Tool capability
Reasoning requirement
Data/security requirements
Availability
```

So the real decision is:

```text
Best Model
=
Quality
+
Capability
+
Latency
+
Cost
+
Policy
```

---

# 8. Token Optimization

Tokens are one of the biggest controllable LLM costs.

Bad:

```text id="a5n6ne"
User Query
+
Entire Conversation
+
Entire Workflow State
+
50 RAG Chunks
+
All Tool Results
+
All Memory
```

Better:

```text id="2bd1nd"
User Query
+
Relevant Conversation
+
Relevant Memory
+
Authorized RAG Evidence
+
Required Tool Results
+
Governed Prompt
```

The principle is:

> **Send the minimum sufficient context, not the maximum available context.**

---

# 9. Context Optimization

Use:

```text id="3ggx7u"
Retrieve
   ↓
Filter
   ↓
Rank
   ↓
Deduplicate
   ↓
Summarize
   ↓
Select
   ↓
LLM
```

Instead of:

```text id="m3p7nj"
Retrieve 100 documents
       ↓
Send all 100 to LLM
```

---

# 10. Conversation Compaction

Long conversations can become expensive.

Instead of sending:

```text id="8h31j7"
Turn 1
Turn 2
Turn 3
...
Turn 100
```

maintain a bounded summary:

```json id="e8qpl6"
{
  "conversation_summary":
    "User is investigating shipment SHIP123. "
    "Previous checks showed carrier capacity "
    "constraints. Current task is to determine "
    "rerouting options.",

  "active_entities": [
    "SHIP123"
  ],

  "pending_tasks": [
    "Evaluate alternate route"
  ]
}
```

Then send:

```text id="7v8p6d"
Current Request
+
Conversation Summary
+
Relevant Recent Turns
```

---

# 11. RAG Token Optimization

Suppose retrieval returns:

```text id="4r5glv"
Top 20 chunks
```

Don't automatically send all 20.

Use:

```text id="f4o1ti"
20 candidates
   ↓
Security filter
   ↓
Reranking
   ↓
Deduplication
   ↓
Top 5 useful chunks
   ↓
Context
```

This reduces:

* input tokens
* latency
* LLM cost
* context noise

and can actually **improve answer quality**.

---

# 12. Caching

Caching avoids repeating expensive work.

Potential cache layers:

```text id="x4i3b6"
                 CACHE
                   │
       ┌───────────┼────────────┐
       ▼           ▼            ▼
    LLM Cache    RAG Cache   Tool Cache
       │           │            │
       ▼           ▼            ▼
   Responses    Retrieval    API Results
```

Also:

```text id="2y6y6f"
Prompt Cache
Embedding Cache
Agent Registry Cache
Session Cache
Configuration Cache
```

---

# 13. RAG Caching

Suppose users repeatedly ask:

```text
"What is the travel policy?"
```

Instead of:

```text id="i0n0i7"
Query
 ↓
Embedding
 ↓
Search
 ↓
Reranking
```

every time:

```text id="b7y5h4"
Query
 ↓
Cache
 ↓
Cached authorized result
```

But cache keys must include relevant authorization scope.

Bad:

```text id="4u6xfr"
cache["travel_policy"]
```

because different users may have different permissions.

Better conceptually:

```text id="m0b2ka"
cache_key =
tenant
+
user_scope
+
query
+
index_version
```

---

# 14. Tool Result Caching

Suppose:

```text id="1u1pkl"
get_product_catalog()
```

is called 1,000 times per minute.

If the data changes only every 10 minutes, caching can dramatically reduce backend calls.

```text
Worker
 ↓
Cache
 ├── HIT → Return
 └── MISS
       ↓
      API
       ↓
     Cache
       ↓
     Return
```

But never cache sensitive results without considering:

```text
User
Tenant
Permissions
Data classification
Expiration
Freshness
```

---

# 15. Embedding Cache

Repeated queries may generate identical embeddings.

```python id="8b9azq"
embedding_cache = {}


def get_embedding(text):

    if text in embedding_cache:
        return embedding_cache[text]

    vector = embedding_model.embed(text)

    embedding_cache[text] = vector

    return vector
```

Production systems should use a distributed cache such as Redis and an appropriate normalized/hash-based key rather than an unbounded process-local dictionary.

---

# 16. Batching

Batching means processing multiple operations together.

Without batching:

```text id="g7c3u2"
Document 1 → Embedding API
Document 2 → Embedding API
Document 3 → Embedding API
Document 4 → Embedding API
```

With batching:

```text id="s9a5kd"
Documents
  1
  2
  3
  4
  ↓
Batch Embedding
  ↓
Vectors
```

Benefits:

```text
Lower overhead
Higher throughput
Better resource utilization
Potentially lower cost
```

---

# 17. Embedding Batching

Example:

```python id="e1zv2d"
documents = [
    "Document A",
    "Document B",
    "Document C",
    "Document D"
]

vectors = embedding_model.embed(
    documents
)
```

Rather than calling the embedding service individually.

Batch size should be controlled by:

```text
API limits
Payload size
Memory
Latency requirements
Throughput
Failure isolation
```

---

# 18. Agent Execution Control

One of the largest cost optimizations is:

> **Don't invoke an agent unless its capability is actually required.**

Bad:

```text id="c8c7wa"
User
 ↓
Coordinator
 ↓
ALL Delegators
 ↓
ALL Workers
```

Better:

```text id="h6jy7a"
User
 ↓
Intent
 ↓
Required Capabilities
 ↓
Relevant Delegators
 ↓
Required Workers
```

For example:

```text
Question:
"What is shipment SHIP123's current status?"
```

Do not execute:

```text id="c7grw3"
Finance Worker
HR Worker
Sales Worker
Inventory Worker
Shipping Worker
```

Only:

```text id="zzh5xu"
Shipping Delegator
       ↓
Tracking Worker
```

---

# 19. Capability-Based Routing

The Coordinator should determine:

```json id="7cvp3h"
{
  "intent": "shipment_status",
  "required_capabilities": [
    "shipment_tracking"
  ]
}
```

Then Agent Registry:

```text id="x2xk9q"
Required Capability
       ↓
Agent Registry
       ↓
Eligible Agents
       ↓
Best Agent
```

This prevents unnecessary agent execution.

---

# 20. Avoid Agent Ping-Pong

Bad architecture:

```text id="l7my9d"
Coordinator
 ↓
Agent A
 ↓
Agent B
 ↓
Agent A
 ↓
Agent C
 ↓
Agent B
 ↓
Coordinator
```

Every hop may introduce:

```text
LLM calls
Network calls
Serialization
Tokens
Latency
Failure risk
```

Prefer:

```text id="cz5nko"
Coordinator
      ↓
Delegator
      ↓
Worker A
      ↓
Worker B
      ↓
Result
```

Only use additional agents when they provide meaningful capability.

---

# 21. Control Recursive Agent Execution

Agents should not be allowed to spawn unlimited work.

Use:

```text id="1r5y7v"
Max Agent Depth
Max Tasks
Max Parallel Tasks
Max Workflow Steps
Max LLM Calls
Max Token Budget
Max Cost
Deadline
```

Example:

```python id="d3o2a4"
if state.llm_calls >= 10:
    raise CostLimitExceeded()

if state.agent_depth >= 5:
    raise AgentDepthExceeded()

if state.total_cost >= 1.00:
    raise WorkflowBudgetExceeded()
```

---

# 22. Cost Budget Per Workflow

A workflow can have a budget:

```json id="g7f6t0"
{
  "workflow_id": "WF-1001",
  "budget": {
    "max_llm_calls": 8,
    "max_tokens": 40000,
    "max_cost": 1.50,
    "max_duration_seconds": 30
  }
}
```

Then each step checks the remaining budget.

```text id="8d4tpk"
Before execution
      ↓
Budget Check
      │
 ┌────┴────┐
 ▼         ▼
Within    Exceeded
Budget       │
 │           ▼
Execute     Stop/Fallback
```

---

# 23. Infrastructure Cost

LLM cost is only part of the bill.

CWD may use:

```text id="9tv7be"
Azure Container Apps / AKS
Cosmos DB
Redis
Azure AI Search
Service Bus
Storage
Networking
Key Vault
Monitoring
External APIs
```

Conceptually:

$$
C_{Infrastructure}
=
C_{Compute}
+
C_{DB}
+
C_{Cache}
+
C_{Search}
+
C_{Messaging}
+
C_{Storage}
+
C_{Network}
+
C_{Observability}
$$

---

# 24. Horizontal Scaling vs Cost

Scaling isn't automatically cheaper.

Bad:

```text id="fy1qhz"
Traffic low
 ↓
20 Worker instances
 ↓
Large idle cost
```

Better:

```text id="3zzc4w"
Low traffic
 ↓
Few instances

High traffic
 ↓
Autoscale
 ↓
More instances
```

Autoscaling signals can include:

```text
Queue depth
Request rate
Active tasks
Concurrency
P95 latency
CPU
Memory
LLM utilization
```

CPU alone is often insufficient for agentic workloads.

---

# 25. Worker Pool Cost Optimization

Instead of:

```text id="4kq7mz"
1 Worker capability
=
1 permanent instance
```

use:

```text id="u0bl9u"
Logical Capability
      ↓
Worker Pool
 ├── Instance 1
 ├── Instance 2
 ├── Instance 3
 └── Instance N
```

Autoscale based on demand.

This improves:

```text
Utilization
Availability
Throughput
Cost efficiency
```

---

# 26. Async Processing

Long-running tasks don't need to hold an expensive synchronous connection.

Instead:

```text id="0x0r2d"
Request
  ↓
Coordinator
  ↓
Service Bus
  ↓
Worker
  ↓
Execute
  ↓
Result
```

This enables:

```text
Queue-based load leveling
Worker autoscaling
Better resource utilization
Long-running execution
```

---

# 27. Observability Cost

Observability itself costs money.

If every LLM call logs:

```text id="h6r7x9"
Full prompt
Full context
Full RAG documents
Full tool result
Full LLM response
```

logging volume can become enormous.

Prefer:

```text id="f6j1v4"
IDs
Metadata
Token counts
Latency
Status
Hashes/references
Error information
```

with controlled sampling and retention.

---

# 28. Cost Attribution

Every cost should be traceable.

```text id="ps4qg8"
Tenant
  ↓
User
  ↓
Session
  ↓
Turn
  ↓
Workflow
  ↓
Task
  ↓
Run
  ↓
Step
  ↓
Agent
  ↓
LLM / Tool / Infrastructure
```

Example:

```json id="8q1z9b"
{
  "workflow_id": "WF-1001",
  "task_id": "TASK-002",
  "run_id": "RUN-003",
  "step_id": "STEP-008",

  "agent_id": "shipping-worker",

  "llm": {
    "model": "model-v4",
    "input_tokens": 4200,
    "output_tokens": 650,
    "cost": 0.031
  },

  "tool": {
    "name": "get_tracking_events",
    "cost": 0.002
  },

  "total_step_cost": 0.033
}
```

---

# 29. Cost Optimization Decision Flow

```text id="s3j6cm"
              Workflow
                  │
                  ▼
           Analyze Complexity
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      Simple    Medium    Complex
        │         │         │
        ▼         ▼         ▼
      Small     Medium     Large
       LLM       LLM        LLM
        │         │         │
        └─────────┼─────────┘
                  ▼
           Minimize Context
                  │
                  ▼
            Check Cache
                  │
                  ▼
          Need Agent Execution?
             │          │
            No         Yes
             │          │
             ▼          ▼
          Return      Execute
                        │
                 ┌──────┴──────┐
                 ▼             ▼
              Cached        Fresh
               Data          Data
                 │             │
                 └──────┬──────┘
                        ▼
                   Validate
                        │
                        ▼
                     Result
```

---

# 30. Cost vs Quality Trade-off

Never optimize cost independently.

For example:

```text id="p8tdm7"
Model A
Cost = $0.01
Accuracy = 75%

Model B
Cost = $0.05
Accuracy = 94%
```

For a high-risk workflow:

```text
$0.05 model may be cheaper overall
```

if Model A creates:

```text
retries
wrong decisions
human escalations
failed workflows
```

Therefore:

$$
\boxed{
OptimalCost =
MinimumCost
\text{ subject to }
Quality \ge Q_{required}
}
$$

---

# 31. Cost Optimization Strategy

The practical sequence is:

```text id="q0k4n6"
Measure
   ↓
Attribute
   ↓
Identify Biggest Cost
   ↓
Optimize
   ↓
Evaluate Quality
   ↓
Measure Again
```

Don't optimize based on assumptions.

---

# 32. Cost Optimization Checklist

### LLM

```text
✓ Model routing
✓ Smaller model where appropriate
✓ Reduce unnecessary LLM calls
✓ Reduce input tokens
✓ Reduce output tokens
✓ Prompt optimization
✓ Context compression
✓ Structured outputs
✓ Avoid redundant reasoning calls
```

### RAG

```text
✓ Better retrieval
✓ Smaller Top-K
✓ Deduplication
✓ Reranking
✓ Context compression
✓ Embedding cache
✓ Retrieval cache
```

### Agents

```text
✓ Capability-based routing
✓ Avoid unnecessary Workers
✓ Avoid agent ping-pong
✓ Limit recursion
✓ Limit parallel fan-out
✓ Reuse results
✓ Cache deterministic operations
```

### Infrastructure

```text
✓ Autoscaling
✓ Right-sizing
✓ Worker pooling
✓ Queue-based load leveling
✓ Efficient database access
✓ Redis caching
✓ Batch processing
✓ Observability sampling
```

---

# 33. CWD Cost Architecture

```text id="l4a0lh"
                         USER
                           │
                           ▼
                     COORDINATOR
                           │
                  Cost / Budget Check
                           │
                           ▼
                     DELEGATOR
                           │
                 Capability Selection
                           │
                           ▼
                       WORKER
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
            RAG           MCP            LLM
             │             │             │
          Cache?         Cache?       Model Route?
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    Result Validation
                           │
                           ▼
                      Cost Metering
                           │
                           ▼
                    Observability
                           │
                           ▼
                 Cost + Quality Analysis
```

---

# 34. The Most Important Optimization

The biggest cost reduction is often not:

> **“Use a cheaper model.”**

It is:

> **“Do less unnecessary work.”**

For example:

```text
Bad:

User
 ↓
Coordinator LLM
 ↓
3 Delegator LLMs
 ↓
10 Worker LLMs
 ↓
20 Tool Calls
 ↓
Final LLM
```

Better:

```text
User
 ↓
Coordinator
 ↓
Required Capability
 ↓
One Delegator
 ↓
Two Workers
 ↓
Required Tools
 ↓
Final LLM
```

Reducing execution fan-out can simultaneously reduce:

```text
LLM cost
Infrastructure cost
Latency
Failure probability
Tool/API load
Observability volume
```

---

# 35. Interview-Ready Answer

> **“For CWD, I measure cost at the LLM-call, step, agent, task, run, workflow, and successful business-outcome levels. LLM cost is driven primarily by model choice, input/output tokens, number of calls, retries, and context size. I use model routing so simple classification or extraction uses smaller models while complex reasoning uses larger models. I optimize tokens through context selection, conversation summarization, RAG filtering, reranking, deduplication, and bounded prompts. I use caching for embeddings, retrieval, tool results, session context, and other safely cacheable data, with authorization-aware cache keys. I use batching for embedding and suitable bulk operations to improve throughput and reduce overhead. Most importantly, I control unnecessary agent execution through capability-based routing, bounded fan-out, recursion limits, workflow budgets, and avoiding unnecessary agent-to-agent hops. On infrastructure, I use stateless horizontally scalable Workers, autoscaling, worker pools, asynchronous Service Bus processing, Redis caching, and right-sized Cosmos/Search/compute resources. Finally, I correlate cost with quality, reliability, latency, and business success because the cheapest workflow is not useful if it produces incorrect or unreliable results.”**

# Final Formula

$$
\boxed{
CWD\ CostOptimization =
ModelSelection
+
TokenOptimization
+
Caching
+
Batching
+
ControlledAgentExecution
+
EfficientRAG
+
Autoscaling
+
WorkloadDistribution
+
CostAttribution
+
ContinuousEvaluation
}
$$

### Final Mental Model

```text id="v9c5by"
             DO ONLY THE WORK
                THAT IS NEEDED
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Right       Right       Right
       Model      Context      Agents
          │           │           │
          └───────────┼───────────┘
                      ▼
                 CACHE / BATCH
                      │
                      ▼
              EXECUTE EFFICIENTLY
                      │
                      ▼
               MEASURE COST
                      │
                      ▼
             MEASURE QUALITY
                      │
                      ▼
                 OPTIMIZE
```

**In one sentence:**
**Enterprise cost optimization in CWD means completing the required business objective with the minimum necessary model capacity, tokens, agent executions, tool calls, retrieval operations, and infrastructure resources while maintaining required quality, reliability, security, latency, and business outcomes.**
