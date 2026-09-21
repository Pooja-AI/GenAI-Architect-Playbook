## How would you prevent one customer from consuming all resources in CWD?

This is a **multi-tenant fairness / noisy-neighbor problem**.

I would use **tenant-aware quotas, rate limits, concurrency limits, queues, and workload isolation**.

```text
Customer A ──┐
Customer B ──┼──> APIM ──> Coordinator ──> Delegators ──> Workers ──> MCP
Customer C ──┘
                │
                └── Tenant-aware limits
```

### 1. Rate limit per customer

At APIM/API Gateway, maintain limits by `tenant_id` or customer identity.

```text
Customer A → 100 requests/min
Customer B → 100 requests/min
Customer C → 100 requests/min
```

So Customer A cannot send 10,000 requests and starve everyone else.

---

### 2. Limit concurrent workflows per customer

Rate limiting alone isn't enough.

Suppose Customer A sends 100 requests, and each request launches 10 Workers.

I would maintain a per-tenant concurrency limit:

```text
Customer A
  ├── Workflow 1
  ├── Workflow 2
  ├── ...
  └── Workflow 20   ← maximum active workflows
```

Additional requests wait in a queue or receive `429`.

---

### 3. Limit Worker concurrency per tenant

This is especially important in CWD.

```text
Customer A → max 20 active Worker tasks
Customer B → max 20
Customer C → max 20
```

Otherwise one customer's complex Agentic AI workflows could consume all Worker capacity.

---

### 4. Use fair queues

Instead of:

```text
Customer A:
████████████████████████████

Customer B:
█
```

I would use **fair scheduling / per-tenant queues**:

```text
Queue A → A1 → A2 → A3
Queue B → B1 → B2
Queue C → C1 → C2
             ↓
        Worker Pool
```

Workers process work fairly across tenants.

For higher-priority business workloads, I can also use **priority queues**, while still maintaining tenant quotas.

---

### 5. Control expensive LLM usage

One customer could consume resources simply by triggering very large LLM workloads.

I would enforce:

* Requests/minute
* Concurrent LLM calls
* Tokens/minute
* Maximum tokens/request
* Maximum workflow duration
* Maximum agent/tool iterations

For example:

```text
Customer A
   ↓
LLM Gateway
   ↓
Token quota + concurrency quota
```

This prevents an agentic loop from generating unlimited LLM calls.

---

### 6. Protect MCP and enterprise systems

Tenant limits should continue down to the tool layer.

```text
Customer
   ↓
Worker
   ↓
MCP
   ↓
Salesforce / ServiceNow
```

For example, Customer A shouldn't be able to consume all Salesforce API capacity.

So I use:

* Per-tenant concurrency
* Global MCP limits
* Downstream rate limits
* Backpressure
* Circuit breakers

---

### 7. Keep tenant identity throughout the workflow

I would propagate a trusted `tenant_id`:

```text
tenant_id
   ↓
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
MCP
   ↓
Enterprise system
```

I would **not let the LLM decide or modify the tenant identity**.

The identity comes from the authenticated request/token and is carried as trusted workflow metadata.

---

### 8. Monitor resource consumption per tenant

I would track:

```text
tenant_id
requests
active_workflows
worker_tasks
LLM_calls
input_tokens
output_tokens
MCP_calls
queue_depth
latency
errors
cost
```

Then I can identify:

```text
Customer A
→ 80% of LLM tokens
→ 70% of Worker concurrency
→ 90% of queue consumption
```

and enforce the appropriate quota.

---

## CWD example

Suppose Customer A submits 500 Customer Briefing requests.

Without protection:

```text
Customer A
   ↓
500 workflows
   ↓
Thousands of Worker calls
   ↓
LLM + Salesforce + ServiceNow overloaded
```

With tenant controls:

```text
Customer A
   ↓
APIM: rate limit
   ↓
Coordinator: concurrency limit
   ↓
Service Bus: queue excess work
   ↓
Worker: per-tenant concurrency
   ↓
LLM: token/concurrency quota
   ↓
MCP: tool rate limit
   ↓
Salesforce / ServiceNow
```

Other customers continue receiving capacity.

### Interview-ready answer

> **"I would prevent one customer from becoming a noisy neighbor by enforcing tenant-aware limits at multiple layers. At APIM, I apply per-tenant rate limits. At the Coordinator and Worker layers, I enforce per-tenant concurrency limits. For asynchronous workloads, I use fair per-tenant queues so one customer cannot consume the entire Worker pool. I also control LLM requests using token and concurrency quotas and protect MCP and downstream systems with rate limits and backpressure. Finally, I propagate the trusted tenant identity throughout the workflow and monitor resource consumption per tenant."**

### Easy memory

**Tenant → Rate limit → Concurrency limit → Fair queue → Token quota → MCP limit → Monitor**

The key interview phrase is:

> **"I don't only limit requests; I limit the resources that each tenant can consume."**
