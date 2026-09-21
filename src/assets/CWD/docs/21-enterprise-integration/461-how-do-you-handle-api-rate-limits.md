## How do you handle API rate limits in CWD?

In CWD, I handle rate limits at **multiple layers** because we have several potential bottlenecks: LLM APIs, MCP servers, Salesforce, ServiceNow, Oracle, Snowflake, and other enterprise APIs.

The goal is not just to retry `429` errors. The goal is to **protect downstream systems and control concurrency before we hit the limit**.

### CWD flow

```text
User
 ↓
API Gateway / APIM
 ↓  Rate Limit
Coordinator
 ↓  Concurrency Control
Delegator
 ↓
Worker
 ↓
MCP
 ↓  Tool-specific Rate Limit
Enterprise API
```

---

## 1. Detect rate limiting

Most APIs indicate rate limiting with:

```text
HTTP 429 Too Many Requests
```

Some APIs also provide:

```text
Retry-After: 5
```

If I receive `429`, I don't immediately send another request.

```text
API Call
   ↓
429
   ↓
Read Retry-After
   ↓
Wait
   ↓
Retry with backoff + jitter
```

---

## 2. Use exponential backoff + jitter

For transient throttling:

```text
Attempt 1 → wait ~1 sec
Attempt 2 → wait ~2 sec
Attempt 3 → wait ~4 sec
```

with random **jitter** added.

Conceptually:

```python
delay = min(base * (2 ** attempt), max_delay)
delay += random_jitter()
```

And I use **bounded retries**, typically a small number such as 2–3 as a starting configuration.

I don't retry forever.

---

## 3. Respect `Retry-After`

If Salesforce, ServiceNow, or another API returns:

```text
429
Retry-After: 10
```

I respect that server-provided delay rather than immediately applying my own retry interval.

```text
429
 ↓
Retry-After = 10 seconds
 ↓
Wait
 ↓
Retry
```

---

# 4. Control concurrency before calling the API

This is more important than retrying.

Suppose ServiceNow allows only a certain level of concurrent traffic.

I don't allow:

```text
100 Workers
   ↓
100 simultaneous ServiceNow calls
```

Instead:

```text
100 Worker tasks
       ↓
Concurrency limiter
       ↓
20 ServiceNow calls
       ↓
ServiceNow
```

The exact number is **configuration/load-test dependent**, not a universal value.

---

# 5. Put rate limits at different CWD layers

### API entry

Protect the platform from excessive user traffic:

```text
User
 ↓
APIM
 ↓
Rate limit per user/client/tenant
 ↓
Coordinator
```

### Worker

Control expensive or high-volume operations:

```text
Incident Workers
      ↓
Concurrency = configured limit
      ↓
ServiceNow MCP
```

### MCP

Apply **tool-specific** limits:

```text
Salesforce MCP
 ├── get_customer       → limit A
 ├── get_opportunities  → limit B
 └── update_customer    → limit C
```

### Enterprise system

Finally, respect the actual downstream API limits.

---

# 6. Queue requests instead of overwhelming the API

For asynchronous work, I use a queue such as **Azure Service Bus**.

```text
Workers
   ↓
Service Bus
   ↓
Controlled Consumers
   ↓
MCP
   ↓
Salesforce / ServiceNow / Oracle
```

If traffic suddenly increases:

```text
1000 requests
      ↓
Queue
      ↓
Controlled processing
      ↓
Enterprise API
```

This creates **backpressure** instead of allowing the spike to directly hit the downstream system.

---

# 7. Circuit breaker

If the dependency continuously returns `429` or becomes unhealthy, I can temporarily stop sending traffic.

```text
CLOSED
  ↓
Repeated throttling
  ↓
OPEN
  ↓
Stop calls temporarily
  ↓
HALF-OPEN
  ↓
Test request
  ↓
Healthy → CLOSED
Unhealthy → OPEN
```

This prevents CWD from making the situation worse.

---

# 8. Reduce unnecessary API calls

Rate limiting is also an **architecture optimization problem**.

For example, instead of:

```text
LLM
 ↓
get_customer
 ↓
LLM
 ↓
get_customer
 ↓
LLM
 ↓
get_customer
```

I would maintain the required state and avoid duplicate calls.

For Customer Briefing:

```text
Customer Worker
     ↓
get_customer(C12345)
     ↓
Cache if appropriate
     ↓
Reuse validated result
```

Other techniques:

* Batch requests where supported
* Parallelize independent calls within safe concurrency limits
* Cache safe read-heavy data
* Avoid repeated identical MCP calls
* Reduce unnecessary Worker loops
* Use pagination carefully
* Request only required fields

---

# 9. Tenant-level rate limiting

In an enterprise platform, one tenant shouldn't consume all capacity.

For example:

```text
Tenant A → 100 requests/min
Tenant B → 100 requests/min
Tenant C → 100 requests/min
```

These are **illustrative configuration values**, not fixed limits.

I can maintain:

```text
TenantQuota
 ├── requests_per_minute
 ├── max_concurrent_workflows
 ├── max_worker_tasks
 ├── MCP calls/minute
 └── token budget
```

This prevents a **noisy neighbor** from affecting other tenants.

---

# 10. Rate limit vs quota

This is a useful interview distinction.

### Rate limit

Controls **how fast** requests can happen.

```text
100 requests / minute
```

### Quota

Controls **how much total usage** is allowed.

```text
1 million tokens / month
```

In CWD I can use both.

---

# 11. Don't retry every error

This is very important.

### Usually retryable

```text
429
502
503
504
temporary network timeout
```

### Usually not retryable

```text
400 → Invalid request
401 → Authentication problem
403 → Authorization problem
404 → Missing resource
schema validation failure
business validation failure
```

For example:

```text
403 from ServiceNow
      ↓
Don't retry 3 times
      ↓
Return authorization failure
```

---

# 12. Avoid retry amplification

This is a common distributed-system problem.

Suppose:

```text
Coordinator retries 3 times
Delegator retries 3 times
Worker retries 3 times
MCP retries 3 times
```

You could accidentally generate:

```text
3 × 3 × 3 × 3 = 81 attempts
```

That's dangerous.

So I define **clear retry ownership** and an overall workflow/request budget.

For example:

```text
Coordinator
   ↓
Worker
   ↓
MCP → owns dependency retry
   ↓
Enterprise API
```

The upper layers shouldn't blindly retry every failure again.

---

# 13. Observability

I monitor rate limiting separately.

Example telemetry:

```json
{
  "workflow_id": "WF-1001",
  "worker_id": "incident_worker",
  "mcp_server": "servicenow-mcp",
  "tool": "get_open_incidents",
  "status": "THROTTLED",
  "http_status": 429,
  "retry_count": 1,
  "retry_after_ms": 5000,
  "latency_ms": 5200
}
```

Metrics include:

* 429 count
* 429 rate
* Retry count
* Retry success rate
* Queue depth
* Request latency
* Concurrency
* API utilization
* Circuit-breaker state
* Per-tenant usage

This helps identify whether we're hitting the limit because of **traffic volume, excessive retries, inefficient Worker behavior, or a downstream capacity change**.

---

# Example: ServiceNow rate limit

Imagine 50 Incident Workers are active.

Instead of:

```text
50 Workers
   ↓
50 simultaneous ServiceNow calls
```

I use:

```text
50 Workers
    ↓
Concurrency limiter
    ↓
ServiceNow MCP
    ↓
Controlled API calls
```

If ServiceNow starts returning `429`:

```text
429
 ↓
Respect Retry-After
 ↓
Exponential backoff + jitter
 ↓
Bounded retry
 ↓
Still throttled?
 ↓
Queue / circuit breaker
 ↓
Structured failure
```

The Coordinator can then decide whether to return a partial result.

---

# Interview-ready answer

> **“In CWD, I handle API rate limits using layered throttling, concurrency control, bounded retries, backoff, and backpressure. At the API gateway I can enforce per-user or per-tenant limits, while Workers and MCP servers apply capability-specific concurrency limits based on downstream capacity. When an enterprise API returns 429, I respect the Retry-After header when available and use bounded exponential backoff with jitter. For asynchronous workloads, I use a queue such as Azure Service Bus to absorb spikes rather than overwhelming Salesforce, ServiceNow, Oracle, or other dependencies. I also use circuit breakers for sustained throttling and avoid retrying non-transient errors such as 400, 401, 403, and validation failures. Finally, I monitor 429 rates, retries, queue depth, latency, and per-tenant usage so we can tune capacity and identify the actual bottleneck.”**

### Easy memory

**Limit → Queue → Control concurrency → Respect Retry-After → Backoff → Retry → Circuit breaker → Monitor**

### Strong interview line

> **“I don't solve rate limiting by simply adding retries. I control traffic before the downstream limit, use backpressure when necessary, and make retries bounded and coordinated.”**
