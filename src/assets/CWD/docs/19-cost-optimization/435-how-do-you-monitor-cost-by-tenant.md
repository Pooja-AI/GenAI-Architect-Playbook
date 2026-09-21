## How do you monitor cost by tenant?

The main principle is:

> **Every CWD resource-consuming operation must carry a trusted `tenant_id`, so I can attribute cost from the end-user request down to LLM, RAG, Worker, MCP, and infrastructure usage.**

### 1. Propagate `tenant_id` through the entire CWD flow

```text id="1j6x4q"
User
 ↓
Coordinator
 ↓
Sales / IT Delegator
 ↓
Workers
 ↓
MCP
 ↓
Salesforce / ServiceNow
```

I propagate:

```text
tenant_id
workflow_id
task_id
trace_id
```

through every layer.

**Important:** `tenant_id` comes from the authenticated identity/token or trusted gateway context—not from an LLM-generated value.

---

### 2. Capture usage at each layer

For every workflow, I record things such as:

```text id="2v1gqk"
tenant_id
workflow_id
worker_id
model
input_tokens
output_tokens
LLM calls
embedding tokens
search queries
MCP calls
compute usage
storage usage
duration
```

Example:

```json id="kqf1jh"
{
  "tenant_id": "T001",
  "workflow_id": "WF-1001",
  "worker_id": "incident_worker",
  "model": "approved-model",
  "input_tokens": 3200,
  "output_tokens": 700,
  "mcp_calls": 2,
  "search_queries": 1
}
```

---

### 3. Calculate LLM cost per tenant

For each LLM call:

```text id="d5z9i3"
LLM Cost =
(input tokens × input price)
+
(output tokens × output price)
```

Then aggregate:

```text id="qjlyp0"
T001
 ├── Coordinator LLM       $0.02
 ├── Customer Worker       $0.03
 ├── Incident Worker       $0.05
 └── Final synthesis       $0.04
                         ─────
                         $0.14
```

The exact pricing depends on the model/provider.

---

### 4. Track infrastructure costs

I don't monitor only LLM cost.

For each tenant, I try to attribute:

```text id="z8iz4e"
LLM
Embeddings
Azure AI Search
Compute
Storage
MCP/API workload
Observability
```

For shared infrastructure such as AKS or Azure AI Search, exact per-tenant billing isn't always directly available.

So I use **usage-based allocation**.

For example:

```text id="d7x5w2"
Search service monthly cost = $1,000

Tenant T001
→ 30% of queries

Allocated search cost ≈ $300
```

That's an internal cost-allocation estimate, not necessarily the cloud provider's actual invoice breakdown.

---

### 5. Build a tenant cost dashboard

I would expose metrics such as:

```text id="s4f2g0"
Tenant
 ├── Cost / request
 ├── Cost / workflow
 ├── LLM cost
 ├── Embedding cost
 ├── Search cost
 ├── Compute cost
 ├── MCP usage
 ├── Token consumption
 └── Request volume
```

Example:

| Tenant | Requests | Tokens | LLM Cost | Total Allocated Cost |
| ------ | -------: | -----: | -------: | -------------------: |
| T001   |   10,000 |    25M |     $420 |                 $610 |
| T002   |    5,000 |     9M |     $160 |                 $250 |
| T003   |    2,000 |     3M |      $55 |                 $100 |

These numbers are illustrative.

---

### 6. Monitor cost per workflow

This is especially useful for CWD because one request can involve multiple Agents and Workers.

```text id="a5c7r1"
Tenant T001
   ↓
Workflow WF-1001
   ├── Sales Delegator
   │    ├── Customer Worker
   │    └── Opportunity Worker
   │
   └── IT Delegator
        └── Incident Worker
```

I can calculate:

```text
Cost / workflow
Cost / Worker
Cost / model
Cost / MCP capability
```

This helps identify expensive workflows or Workers.

---

### 7. Set tenant budgets and alerts

Once cost is measurable, I can enforce policies:

```text id="6u7y8x"
Tenant monthly budget = $10,000

80% → warning
90% → alert
100% → throttle / queue / policy action
```

I can also monitor:

* cost per day
* cost per request
* cost growth
* token growth
* unusual spikes

---

### 8. Detect abnormal tenant behavior

For example:

```text id="d3h1ka"
T001
Normal:
$0.05 / workflow

Suddenly:
$1.20 / workflow
```

I investigate:

```text
More LLM calls?
More agent iterations?
Larger RAG context?
Repeated MCP calls?
Retry storm?
Runaway agent?
```

This connects **cost monitoring with observability**.

---

## CWD implementation architecture

```text id="1f0r8d"
                ┌───────────────────┐
                │ Cost Metering     │
                │                   │
                │ tenant_id         │
                │ workflow_id       │
                │ tokens            │
                │ LLM calls         │
                │ MCP calls         │
                │ Search            │
                │ Compute           │
                └─────────▲─────────┘
                          │
User → Coordinator → Delegator → Worker → MCP
                          │
                          ↓
                 Cost aggregation
                          ↓
                 Tenant Dashboard
                          ↓
                  Alerts / Quotas
```

In Azure, I could combine **Application Insights / Azure Monitor / Log Analytics** for telemetry with application-level cost-metering records and the relevant Azure billing/usage data.

---

## 🎯 Interview-ready answer

> **“I monitor tenant-level cost by propagating a trusted tenant ID from the authenticated request through the Coordinator, Delegators, Workers, MCP calls, and telemetry. For every workflow, I capture LLM input and output tokens, model, embedding usage, search operations, MCP calls, compute usage, and workflow duration. I calculate direct costs such as LLM and embedding costs from usage and allocate shared infrastructure costs based on measurable usage such as requests, compute time, or search volume. I then aggregate the data by tenant, workflow, Worker, and model and expose metrics such as cost per request, cost per workflow, total monthly cost, and token consumption. Finally, I set tenant budgets and alerts and investigate abnormal cost spikes through distributed tracing.”**

### Easy memory

**Identify tenant → Meter usage → Calculate cost → Allocate shared cost → Aggregate → Dashboard → Alert → Control**

> **Strong architect line:**
> **“If I can't attribute resource consumption to a tenant and workflow, I can't effectively control or optimize multi-tenant GenAI cost.”**
