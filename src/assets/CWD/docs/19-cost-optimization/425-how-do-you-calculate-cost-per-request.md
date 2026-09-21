## How do you calculate cost per request in CWD?

I calculate **all the resources consumed by one end-to-end workflow**, not just the LLM cost.

### Basic formula

```text
Cost per request
=
LLM cost
+ Embedding cost
+ Vector Search cost
+ Compute cost
+ MCP / downstream cost
+ Storage cost
+ Observability cost
```

The exact components depend on the cloud and pricing model.

---

### 1. Calculate LLM cost

For each LLM call:

```text
LLM cost
=
(input tokens / 1M × input price)
+
(output tokens / 1M × output price)
```

If one CWD request makes multiple LLM calls:

```text
Total LLM cost
=
LLM Call 1
+ LLM Call 2
+ LLM Call 3
+ ...
```

For example:

```text
Coordinator LLM       → 2,000 tokens
Worker LLM             → 1,500 tokens
Final synthesis        → 3,000 tokens
```

I calculate the cost for each call and sum them.

---

### 2. Embedding cost

For RAG:

```text
Embedding cost
=
embedding tokens / 1M × embedding price
```

For online requests, query-embedding cost is included.

For document ingestion, I generally treat embedding/indexing cost separately from the end-user request unless I'm allocating infrastructure costs across workloads.

---

### 3. Vector search cost

For Azure AI Search, the service is generally provisioned rather than simply priced as a per-query API call.

So I calculate an allocated request cost such as:

```text
Search cost per request
=
Search service cost for period
÷
Number of requests during period
```

I can make the allocation more granular by tenant, workload, or request type if needed.

---

### 4. Compute cost

CWD may use:

```text
FastAPI
Coordinator
Delegators
Workers
AKS / Container Apps
Functions
```

For allocated compute cost:

```text
Compute cost/request
=
Total compute cost for period
÷
Total requests for period
```

For more accurate allocation, I can use CPU/memory seconds or workflow execution time.

---

### 5. MCP / enterprise calls

If MCP or downstream services have usage-based costs, I include them.

For example:

```text
Customer Worker
    ↓
MCP
    ↓
Salesforce

Incident Worker
    ↓
MCP
    ↓
ServiceNow
```

I track:

```text
MCP calls / request
MCP latency
downstream calls
usage-based charges, if applicable
```

---

### 6. Observability cost

I also account for:

```text
Application Insights
Log Analytics
Langfuse
OpenTelemetry traces
```

Especially if we're logging large prompts, responses, traces, and payloads.

This is why I avoid logging sensitive full payloads unnecessarily.

---

## CWD example

Suppose one Customer Briefing request produces:

```text
LLM calls             $0.025
Embedding             $0.001
Vector Search         $0.003
Compute               $0.004
MCP/other usage       $0.002
Observability         $0.001
--------------------------------
Total                  $0.036
```

So:

```text
Cost per request = $0.036
```

These numbers are **illustrative**, not actual cloud pricing.

---

## What I monitor in production

I attach cost information to the workflow:

```json
{
  "workflow_id": "WF-1001",
  "tenant_id": "T001",
  "llm_calls": 4,
  "input_tokens": 8200,
  "output_tokens": 2100,
  "embedding_tokens": 900,
  "mcp_calls": 3,
  "search_queries": 2,
  "total_cost": 0.036
}
```

Then I can calculate:

```text
Cost / request
Cost / workflow
Cost / Worker
Cost / tenant
Cost / model
Cost / successful task
```

This is particularly useful for identifying expensive Workers or agent workflows.

### 🎯 Interview-ready answer

> **“I calculate CWD cost per request by tracking the resources consumed by the complete workflow. I start with each LLM call and calculate input-token plus output-token cost, then add embedding, vector-search, compute, MCP or downstream usage, storage where applicable, and observability costs. For provisioned services such as Azure AI Search or compute, I allocate the service cost over the workload or use more granular usage-based allocation such as request count or resource seconds. I attach these measurements to the workflow ID so I can calculate cost per request, Worker, model, tenant, and successful task. This lets me identify where the largest cost drivers are and optimize them.”**

### Easy memory

**LLM + Embedding + Search + Compute + MCP + Observability = Cost/request**

And the important architect-level point:

> **Don't optimize only LLM token cost—measure the entire end-to-end CWD workflow cost.**
