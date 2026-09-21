## How would you implement tenant-level quotas in CWD?

**Tenant-level quota means giving each customer a defined maximum amount of resources they can consume over a period of time.**

For CWD, I would make the quota **tenant-aware and enforce it before expensive work starts**.

```text id="6o9v2p"
User
 ↓
Entra ID / Identity
 ↓
APIM
 ↓
Quota Service / Policy
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
Enterprise Systems
```

### 1. Define quotas per tenant

For example:

```text id="z3nq5a"
Tenant A
  Requests/min       = 1,000
  Concurrent workflows = 50
  LLM tokens/hour    = 1M
  Worker tasks       = 100 concurrent
  MCP calls/min      = 500

Tenant B
  Requests/min       = 500
  Concurrent workflows = 20
  LLM tokens/hour    = 500K
  Worker tasks       = 50 concurrent
  MCP calls/min      = 200
```

These numbers are illustrative. In production, I would derive them from business tier, load testing, provider limits, and cost budgets.

---

## 2. Identify the tenant from trusted identity

I would get `tenant_id` from the authenticated identity/token, not from an LLM-generated value.

```python
tenant_id = authenticated_user.tenant_id
```

Then attach it to the workflow context:

```python
state = {
    "tenant_id": tenant_id,
    "workflow_id": workflow_id,
    "intent": "Customer Briefing"
}
```

The LLM cannot change this value.

---

## 3. Store quota configuration centrally

For example:

```text id="b7m2mx"
TenantQuota
--------------------------------
tenant_id
requests_per_minute
max_concurrent_workflows
max_worker_tasks
llm_tokens_per_hour
mcp_calls_per_minute
monthly_cost_limit
```

This can be stored in a durable configuration store/database.

I would also cache quota configuration for low-latency reads.

---

## 4. Track current usage

For fast counters, Redis is a good fit.

For example:

```text id="l4q6f0"
quota:{tenant_id}:requests:minute
quota:{tenant_id}:workflows:active
quota:{tenant_id}:llm_tokens:hour
quota:{tenant_id}:mcp_calls:minute
```

Conceptually:

```python
usage = redis.incr(f"quota:{tenant_id}:requests:minute")

if usage > quota.requests_per_minute:
    raise RateLimitExceeded()
```

For counters with a time window, I would use **atomic operations with TTL**, or a sliding-window/token-bucket implementation.

---

## 5. Check quota before starting expensive work

This is important.

Don't do:

```text
Request
 ↓
LLM
 ↓
RAG
 ↓
MCP
 ↓
Check quota ❌
```

Instead:

```text
Request
 ↓
Authenticate
 ↓
Check tenant quota
 ↓
Allowed?
 ├── No → 429 / queue
 └── Yes
       ↓
   Coordinator
       ↓
   Delegator
       ↓
   Worker
```

This avoids wasting LLM, Worker, and MCP resources.

---

## 6. Use different quota types

I wouldn't have only one quota.

### Request quota

```text
1000 requests/minute
```

Protects the API.

### Concurrency quota

```text
Maximum 50 active workflows
```

Protects compute and orchestration.

### Token quota

```text
Maximum 1M LLM tokens/hour
```

Controls LLM consumption and cost.

### Worker quota

```text
Maximum 100 active Worker tasks
```

Protects Worker capacity.

### MCP quota

```text
Maximum 500 tool calls/minute
```

Protects enterprise systems.

### Cost quota

For example:

```text
Monthly AI budget = $5,000
```

I would track estimated/actual model and infrastructure consumption and trigger controls or alerts when thresholds are reached.

---

## 7. Use soft and hard quotas

This is useful in enterprise systems.

```text
80% → Warning
90% → Alert
100% → Hard limit
```

For example:

```text
LLM quota = 1M tokens/hour

800K → monitoring alert
900K → notify tenant/admin
1M   → throttle/reject/queue
```

For some workloads, instead of immediately rejecting at 100%, I might queue lower-priority work.

---

## 8. Combine quotas with fair scheduling

Suppose:

```text
Tenant A → 50 workflows
Tenant B → 10 workflows
Tenant C → 5 workflows
```

Tenant A should not consume every Worker.

So I combine:

```text
Tenant quota
      +
Per-tenant concurrency
      +
Fair queue
      +
Global system capacity
```

This gives both **tenant isolation** and **overall system protection**.

---

## 9. Important: tenant quota vs global quota

You need both.

Example:

```text
Global Worker capacity = 500

Tenant A max = 100
Tenant B max = 100
Tenant C max = 100
...
```

Even if every tenant stays within its own quota, the system still needs a **global limit**.

```text
Tenant quota
     ↓
Global capacity
     ↓
Downstream capacity
```

The effective limit is the smallest safe capacity.

---

## 10. What happens when quota is exceeded?

I would return something like:

```json
{
  "error": "TENANT_QUOTA_EXCEEDED",
  "tenant_id": "T123",
  "resource": "llm_tokens",
  "retry_after": 120
}
```

For asynchronous workloads:

```text
Quota exceeded
      ↓
Queue request
      ↓
Wait for quota availability
      ↓
Process
```

For synchronous requests where waiting isn't appropriate:

```text
HTTP 429
Retry-After: 120
```

---

# CWD example

Customer A sends a Customer Briefing request:

```text
customer_id = C12345
tenant_id   = T001
```

The Coordinator receives it.

```text
1. Authenticate T001
2. Read T001 quota
3. Check active workflow count
4. Reserve workflow capacity
5. Create workflow
6. Execute Sales + IT Delegators
7. Track Worker/MCP/LLM consumption
8. Release concurrency when complete
```

For parallel execution:

```text
                 Coordinator
                     |
          tenant = T001
                     |
          ┌──────────┴──────────┐
          ↓                     ↓
   Sales Delegator        IT Delegator
          ↓                     ↓
   Customer Worker       Incident Worker
          ↓                     ↓
   Salesforce MCP        ServiceNow MCP
```

Every layer carries the trusted tenant context.

---

## Interview-ready answer

> **"I would implement tenant-level quotas using a centralized quota policy combined with fast usage counters. The tenant identity comes from the authenticated token, not from the LLM. I would define separate quotas for requests, concurrent workflows, Worker tasks, LLM tokens, MCP calls, and potentially cost. At the Coordinator entry point, I check and reserve the required quota before starting expensive work. Redis can maintain atomic time-window counters and active-concurrency counters, while durable storage maintains the quota configuration and usage history. I would combine per-tenant quotas with global capacity limits and fair queues so one tenant cannot become a noisy neighbor. When a quota is exceeded, synchronous requests receive a controlled 429 response or asynchronous work is queued."**

### Easy memory

**Identify → Check → Reserve → Execute → Meter → Release**

And remember:

> **Rate limit controls how fast a tenant sends requests; quota controls how much total resource that tenant can consume.**
