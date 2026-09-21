## How do you monitor cost by Worker?

The main principle is:

> **Every Worker execution gets a `worker_id`, so I can track exactly how many tokens, LLM calls, MCP calls, RAG queries, and compute resources that Worker consumes.**

In CWD:

```text
Coordinator
   ↓
Delegator
   ↓
 ┌─────────────────────┐
 │ Workers             │
 │                     │
 │ Customer Worker     │
 │ Opportunity Worker  │
 │ Incident Worker     │
 └─────────────────────┘
```

### 1. Give every Worker a unique identity

For every execution I capture:

```text
worker_id
workflow_id
task_id
tenant_id
trace_id
```

Example:

```json
{
  "worker_id": "incident_worker",
  "workflow_id": "WF-1001",
  "task_id": "TASK-3001",
  "tenant_id": "T001"
}
```

This lets me attribute every downstream operation back to the Worker.

---

### 2. Track LLM cost

For each Worker, capture:

```text
model
input_tokens
output_tokens
total_tokens
llm_call_count
```

Then:

```text
LLM Cost
=
Σ(input token cost + output token cost)
```

Example:

```text
Incident Worker
 ├─ LLM call 1 → 3,000 tokens
 ├─ LLM call 2 → 2,000 tokens
 └─ LLM call 3 → 1,000 tokens

Total = 6,000 tokens
```

---

### 3. Track MCP/tool usage

For your CWD Worker:

```text
Incident Worker
      ↓
MCP Client
      ↓
ServiceNow MCP Server
      ↓
ServiceNow
```

I capture:

```text
worker_id
mcp_server
tool_name
call_count
latency
status
retry_count
```

If the MCP/downstream service has a usage-based charge, I include that cost. Otherwise, I use the usage metrics for internal cost allocation.

---

### 4. Track RAG/search costs

If the Worker uses Azure AI Search:

```text
Incident Worker
      ↓
Query embedding
      ↓
Azure AI Search
      ↓
Reranking
      ↓
LLM
```

I associate:

* embedding usage
* search queries
* retrieval volume
* reranking usage where applicable

with that Worker.

---

### 5. Track compute cost

If Workers run on AKS/Container Apps, I measure their resource consumption:

```text
CPU
Memory
Execution time
Replica usage
```

For shared compute:

```text
Worker compute cost
≈
Resource usage × allocated infrastructure rate
```

This is an **internal allocation**, not necessarily the exact amount shown on the cloud invoice.

---

### 6. Calculate total Worker cost

Conceptually:

```text
Worker Cost
=
LLM
+ Embedding
+ Search
+ MCP/Tool usage
+ Compute
+ Observability allocation
```

For example:

| Worker             |   LLM | RAG/Search |   MCP | Compute | Total |
| ------------------ | ----: | ---------: | ----: | ------: | ----: |
| Customer Worker    | $0.02 |      $0.01 | $0.01 |   $0.01 | $0.05 |
| Opportunity Worker | $0.04 |      $0.01 | $0.01 |   $0.01 | $0.07 |
| Incident Worker    | $0.08 |      $0.02 | $0.02 |   $0.02 | $0.14 |

These numbers are illustrative.

Now I can see that the Incident Worker is consuming more resources.

---

### 7. Investigate why a Worker is expensive

Suppose:

```text
Incident Worker
Normal cost = $0.05
Current cost = $0.30
```

I drill into the trace:

```text
Incident Worker
 ├── LLM calls: 8       ← abnormal
 ├── RAG chunks: 30     ← too much context
 ├── MCP calls: 12      ← repeated calls
 └── Retries: 4         ← dependency problem
```

Then I can optimize the actual cause instead of simply increasing infrastructure.

---

### 8. Monitor cost per successful task

This is particularly important.

Don't only measure:

```text
Cost / Worker execution
```

Also measure:

```text
Cost / successful Worker task
```

For example:

```text
Worker A
$0.05 / execution
95% success

Worker B
$0.03 / execution
50% success
```

Worker B may appear cheaper, but its retries and failures can make its **cost per successful outcome** higher.

---

## CWD implementation

```text
User
 ↓
Coordinator
 ↓
Sales Delegator
 ↓
Customer Worker
 ├── LLM
 ├── RAG
 └── MCP → Salesforce
          │
          └── Usage telemetry
 ↓
Cost Meter
 ↓
Worker Cost Dashboard
```

Every telemetry record contains:

```text
tenant_id
workflow_id
task_id
worker_id
trace_id
timestamp
model
tokens
tool
latency
status
```

Then I can query:

```text
WHERE worker_id = "incident_worker"
```

and calculate its total and average cost.

---

## 🎯 Interview-ready answer

> **“I monitor cost by Worker by giving every Worker a unique Worker ID and propagating it with the workflow, task, tenant, and trace IDs. For each Worker, I capture LLM input and output tokens, number of model calls, embedding usage, RAG/search queries, MCP tool calls, retries, execution time, and compute usage. I calculate direct usage-based costs and allocate shared infrastructure costs based on measurable resource consumption. I then aggregate the data by Worker and monitor metrics such as cost per execution, cost per successful task, tokens per Worker, LLM calls, MCP calls, retries, and latency. If a Worker becomes expensive, distributed tracing lets me identify whether the cause is excessive LLM calls, large RAG context, repeated MCP calls, retries, or inefficient execution.”**

### Easy memory

**Worker ID → Tokens → RAG → MCP → Compute → Cost → Success rate → Investigate**

> **Strong interview line:**
> **“I don't treat Worker cost as just LLM cost; I measure the complete execution path of the Worker.”**
