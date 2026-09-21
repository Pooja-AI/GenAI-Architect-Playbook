## How do you implement rate limiting in CWD?

In CWD, I implement **layered rate limiting** so one user, tenant, Worker, or downstream system cannot overwhelm the platform.

```text
Client
   ↓
APIM
   ↓  Rate limit
FastAPI
   ↓
Coordinator
   ↓  Concurrency control
Delegator
   ↓
Workers
   ↓  Tool-level limits
MCP
   ↓
Salesforce / ServiceNow / Snowflake
```

### 1. API-level rate limiting

At **Azure API Management**, I can limit requests per subscription, user, or client.

For example, conceptually:

```text
Tenant T001
    ↓
100 requests / minute
```

If the tenant exceeds the limit:

```text
HTTP 429 Too Many Requests
```

This protects the CWD entry point.

---

### 2. Per-user / per-tenant limits

I don't want one customer to consume all platform capacity.

For example:

```text
TenantQuota
 ├── requests_per_minute
 ├── max_concurrent_workflows
 ├── max_worker_tasks
 ├── MCP_calls_per_minute
 └── LLM_token_budget
```

This provides **tenant isolation / noisy-neighbor protection**.

---

### 3. Worker-level concurrency control

Suppose 1,000 requests arrive and all require Salesforce.

I don't allow 1,000 simultaneous Salesforce calls.

```text
1000 requests
      ↓
Queue / concurrency limit
      ↓
Only N Salesforce calls
      ↓
Salesforce
```

In Python, I can use a semaphore:

```python
salesforce_limit = asyncio.Semaphore(20)

async def call_salesforce():
    async with salesforce_limit:
        return await mcp_client.call_tool(
            "get_customer",
            {"customer_id": "C12345"}
        )
```

The exact value, such as `20`, should come from **load testing and Salesforce's allowed capacity**, not an arbitrary fixed number.

---

### 4. MCP tool-level rate limiting

Different enterprise systems have different limits.

For example:

```text
Salesforce MCP
   → Salesforce-specific limit

ServiceNow MCP
   → ServiceNow-specific limit

Snowflake MCP
   → workload/concurrency limit
```

So I can have separate controls:

```text
Salesforce → 20 concurrent
ServiceNow → 30 concurrent
Snowflake  → 10 concurrent
```

The actual values are environment-specific.

---

### 5. Handle HTTP 429 correctly

If an enterprise API returns:

```http
429 Too Many Requests
Retry-After: 5
```

I don't immediately retry in a tight loop.

I use:

```text
429
 ↓
Read Retry-After
 ↓
Exponential backoff + jitter
 ↓
Bounded retry
 ↓
Success / failure
```

Example:

```python
async def call_with_retry():
    for attempt in range(3):
        try:
            return await call_mcp()

        except RateLimitError as e:
            await asyncio.sleep(
                e.retry_after or 2 ** attempt
            )

    raise DependencyRateLimited()
```

Retries should be **bounded**.

---

### 6. Use queues for traffic spikes

For long-running operations, I don't need every request to execute synchronously.

```text
Traffic spike
     ↓
APIM rate limit
     ↓
Service Bus
     ↓
Workers consume at controlled rate
     ↓
MCP
     ↓
Enterprise system
```

This creates **backpressure**.

Instead of allowing the spike to crash Salesforce or ServiceNow, the queue absorbs work and Workers process it at a safe rate.

---

### 7. Avoid retry amplification

This is an important Agentic AI consideration.

Suppose:

```text
Coordinator → 3 retries
Delegator   → 3 retries
Worker      → 3 retries
MCP         → 3 retries
```

You can accidentally create a huge number of attempts.

So I define **clear retry ownership** and an overall workflow retry budget.

```text
Workflow
   ↓
Retry budget
   ↓
Worker/MCP
   ↓
Bounded retries
```

I don't allow every layer to independently retry without coordination.

---

### 8. Rate limiting vs quota

A useful interview distinction:

**Rate limit = how fast**

```text
100 requests/minute
```

**Quota = how much**

```text
10,000 requests/day
```

For CWD, I can use both.

---

### 9. Monitor rate limiting

I monitor:

```text
429 rate
Retry count
Queue depth
Worker concurrency
MCP latency
Downstream utilization
Circuit-breaker state
Per-tenant consumption
LLM token usage
```

For example:

```text
429 ↑
  ↓
Retries ↑
  ↓
Queue depth ↑
  ↓
Latency ↑
```

This tells me whether the problem is simply traffic volume or a downstream capacity issue.

---

## Customer Briefing example

Suppose 500 users simultaneously request:

> "Give me a briefing for customer C12345."

Many workflows may call Salesforce.

Instead of:

```text
500 workflows
   ↓
500 Salesforce calls
   ↓
Salesforce overloaded
```

I use:

```text
500 workflows
      ↓
APIM rate limit
      ↓
Coordinator
      ↓
Salesforce concurrency limit
      ↓
MCP
      ↓
Controlled Salesforce traffic
```

If Salesforce starts returning `429`, I back off and let queued work drain gradually.

---

## Interview-ready answer

> **“I implement rate limiting in multiple layers. At the API boundary, APIM controls request rates per client or tenant. Inside CWD, I use per-tenant and Worker-level concurrency limits so one tenant or capability cannot consume all resources. At the MCP layer, I apply downstream-specific limits and handle 429 responses with Retry-After, exponential backoff, jitter, and bounded retries. For large spikes or long-running workflows, I use queues such as Service Bus to provide backpressure. I also monitor 429s, retries, queue depth, concurrency, latency, and downstream utilization. Importantly, I coordinate retry budgets across layers to avoid retry amplification.”**

### Easy memory

**Limit → Queue → Control concurrency → Backoff → Retry safely → Monitor**

**Strong interview line:**

> **“I don't solve rate limiting by simply adding retries; I control traffic before it reaches the bottleneck and use backpressure when demand exceeds downstream capacity.”**
