## How do you monitor cost by Agent?

The main principle is:

> **Every Agent execution in CWD gets a unique `agent_id` and `workflow_id`, so I can attribute LLM, tool, retrieval, and infrastructure costs to that Agent.**

In your CWD architecture:

```text id="h8qv4m"
Coordinator
   ↓
Sales Delegator
   ├── Customer Worker
   └── Opportunity Worker

IT Delegator
   └── Incident Worker
```

I can treat the **Coordinator, Delegators, and Workers as separately measurable agent components**.

---

### 1. Assign an identity to every Agent

For example:

```text id="3v0c0n"
agent_id = incident_worker
workflow_id = WF-1001
task_id = T-2001
tenant_id = T001
```

Every LLM/tool operation carries this context.

---

### 2. Track LLM usage per Agent

For every LLM call:

```text id="k1z7x4"
agent_id
model
input_tokens
output_tokens
total_tokens
latency
```

Example:

```text id="p0q9xw"
Incident Worker
 ├── LLM call #1 → 3,000 tokens
 ├── LLM call #2 → 1,500 tokens
 └── LLM call #3 → 2,000 tokens

Total = 6,500 tokens
```

Then calculate:

```text id="2c5y1h"
Agent LLM Cost =
Σ(input token cost + output token cost)
```

---

### 3. Track tool/MCP costs

An Agent's cost isn't only LLM inference.

For example:

```text id="k8b2m4"
Incident Worker
    ↓
MCP
    ├── ServiceNow call
    ├── ServiceNow call
    └── Azure AI Search
```

I record:

```text id="7w3p5x"
agent_id
tool
mcp_server
call_count
latency
status
```

If a downstream service has usage-based charges, those can be included directly. Otherwise, I track the usage for operational cost allocation.

---

### 4. Track embedding and RAG usage

For RAG-enabled Workers:

```text id="z3p7q1"
Agent
 ↓
Query embedding
 ↓
Azure AI Search
 ↓
Reranking
 ↓
LLM
```

I attribute:

* embedding tokens/calls
* search queries
* retrieval volume
* reranking usage where applicable
* associated infrastructure allocation

to the Agent that initiated the operation.

---

### 5. Track Agent execution cost

Conceptually:

```text id="n5s8j2"
Agent Cost
=
LLM Cost
+ Embedding Cost
+ Search Allocation
+ Tool/MCP Cost
+ Compute Allocation
+ Observability Allocation
```

Not every environment will have a direct bill for every component, so shared services are allocated based on usage.

---

### 6. Example CWD cost breakdown

Suppose one Customer Briefing produces:

| Agent              | LLM Cost | MCP/Search | Compute | Total |
| ------------------ | -------: | ---------: | ------: | ----: |
| Coordinator        |    $0.03 |      $0.00 |   $0.01 | $0.04 |
| Customer Worker    |    $0.02 |      $0.01 |   $0.01 | $0.04 |
| Opportunity Worker |    $0.04 |      $0.01 |   $0.01 | $0.06 |
| Incident Worker    |    $0.08 |      $0.02 |   $0.02 | $0.12 |

Numbers are illustrative.

Now I can immediately investigate why **Incident Worker** is consuming more.

Maybe:

```text id="b0h8x3"
Incident Worker
 ↓
Too many LLM calls
 ↓
Large RAG context
 ↓
Repeated MCP calls
 ↓
High token usage
```

---

### 7. Use distributed tracing

This is where observability becomes very useful.

```text id="y4k2n8"
Trace: TR-1001
Tenant: T001
Workflow: WF-1001

Coordinator
 ├── Sales Delegator
 │    ├── Customer Worker
 │    │    └── LLM → 2K tokens
 │    └── Opportunity Worker
 │         └── LLM → 4K tokens
 │
 └── IT Delegator
      └── Incident Worker
           ├── LLM → 3K
           ├── MCP → ServiceNow
           ├── RAG
           └── LLM → 3K
```

The trace lets me connect **cost with the actual Agent execution path**.

---

### 8. Monitor useful Agent-level metrics

I would dashboard:

```text id="1c4q6k"
Cost / Agent
Cost / workflow
Tokens / Agent
LLM calls / Agent
MCP calls / Agent
RAG queries / Agent
Average latency
P95/P99 latency
Retry count
Agent iterations
Tool-call count
Failure rate
```

Especially:

> **Cost per successful task**

A cheap Agent that frequently fails and retries may actually be more expensive than a slightly more expensive Agent that succeeds on the first attempt.

---

### 9. Detect expensive Agent behavior

For example:

```text id="3h9m1s"
Incident Worker
Normal:
5K tokens / workflow

Current:
35K tokens / workflow
```

I investigate:

* runaway loops
* excessive tool calls
* excessive RAG context
* prompt growth
* unnecessary retries
* wrong model selection
* duplicate work

This connects **cost monitoring to Agent observability**.

---

## 🎯 Interview-ready answer

> **“I monitor cost by Agent by assigning every Coordinator, Delegator, and Worker a unique agent ID and propagating it with the workflow and task IDs. For every Agent execution, I capture LLM input and output tokens, model, number of LLM calls, embedding usage, RAG/search operations, MCP calls, retries, latency, and compute usage. I calculate direct usage-based costs and allocate shared infrastructure costs based on measurable usage. I then aggregate the data by Agent, workflow, tenant, and model and monitor metrics such as cost per workflow, cost per successful task, tokens per Agent, LLM calls, MCP calls, and retries. Distributed tracing lets me drill into an expensive Agent and determine whether the cost comes from excessive LLM calls, large RAG context, repeated tool calls, retries, or inefficient execution.”**

### Easy memory

**Agent ID → Track tokens → Track tools → Track RAG → Allocate compute → Calculate → Dashboard → Investigate**

> **Strong interview line:**
> **“I don't just monitor how much an Agent costs; I correlate cost with its execution path so I can explain why it costs that much.”**
