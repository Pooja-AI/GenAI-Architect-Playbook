## How would you implement rate limiting in CWD?

**Rate limiting means controlling how many requests or tool calls are allowed in a given period so one layer doesn't overwhelm the next layer.**

In CWD, I would apply it at **multiple boundaries**, not just at the API layer.

```text
User
 ↓
APIM / API Gateway          ← 1. User/API rate limit
 ↓
Coordinator                 ← 2. Workflow concurrency
 ↓ A2A
Delegator                   ← 3. Agent/task rate limit
 ↓
Worker                      ← 4. Worker concurrency
 ↓ MCP
MCP Server                  ← 5. Tool rate limit
 ↓
Salesforce / ServiceNow     ← 6. Downstream API limit
```

### 1. API-level rate limiting

At the entry point, I would use **Azure API Management**.

For example:

```text
User/API Client
      ↓
Azure APIM
      ↓
100 requests/minute/user
      ↓
Coordinator
```

If the limit is exceeded:

```text
HTTP 429 Too Many Requests
```

I can also apply different limits:

```text
Premium client   → 1000 req/min
Standard client  → 200 req/min
Background job   → 50 req/min
```

---

### 2. Limit Coordinator concurrency

Rate limiting is not only requests/minute.

Suppose 100 requests arrive simultaneously and every request launches multiple agents.

I can limit active workflows:

```python
coordinator_semaphore = Semaphore(100)

async with coordinator_semaphore:
    await execute_workflow()
```

This prevents the Coordinator from creating unlimited downstream work.

---

### 3. Limit Worker concurrency

Suppose the Incident Worker calls ServiceNow.

Instead of allowing 500 simultaneous calls:

```text
Incident Worker
      ↓
Concurrency limit = 20
      ↓
MCP
      ↓
ServiceNow
```

Only 20 calls execute concurrently.

The remaining requests can wait in a queue.

---

### 4. MCP-level rate limiting

I would also protect MCP servers.

For example:

```text
Salesforce MCP
    ↓
Max 50 calls/sec
    ↓
Salesforce
```

And separately:

```text
ServiceNow MCP
    ↓
Max 20 calls/sec
    ↓
ServiceNow
```

This is important because **different enterprise systems have different limits**.

---

### 5. Handle downstream `429`

Suppose ServiceNow returns:

```text
429 Too Many Requests
Retry-After: 5
```

I would:

```text
429
 ↓
Read Retry-After
 ↓
Backoff
 ↓
Retry within bounded limit
```

For example:

```text
Attempt 1 → 429
     ↓
wait 5 sec
     ↓
Attempt 2 → success
```

I would **not immediately retry thousands of requests**, because that creates a retry storm.

---

### 6. Use queues for sustained overload

If requests continue arriving faster than the downstream system can process:

```text
Worker
   ↓
Service Bus Queue
   ↓
MCP
   ↓
ServiceNow
```

The queue acts as a buffer.

Then I control Worker concurrency:

```text
Queue depth = 10,000
Worker concurrency = 20
```

Workers process the queue at a safe rate.

---

### 7. Rate limiting + autoscaling must work together

A common mistake is:

> "Traffic increased, so I'll just add more Worker replicas."

That could make things worse.

Example:

```text
ServiceNow limit = 100 calls/sec

10 Workers × 20 calls/sec
= 200 calls/sec
```

Now ServiceNow starts returning `429`.

So I would use:

```text
Autoscaling
     +
Rate limiting
     +
Concurrency control
     +
Backpressure
     +
Circuit breaker
```

The key is that **autoscaling should never exceed downstream capacity**.

---

## CWD example

Customer Briefing requires:

```text
Coordinator
   ↓
Sales Delegator
   ├── Customer Worker → Salesforce MCP
   └── Opportunity Worker → Salesforce MCP
   ↓
IT Delegator
   └── Incident Worker → ServiceNow MCP
```

I might configure illustrative limits such as:

```text
APIM:
  200 requests/min/user

Coordinator:
  100 concurrent workflows

Salesforce MCP:
  50 concurrent calls

ServiceNow MCP:
  20 concurrent calls

LLM:
  controlled by RPM/TPM + concurrency limits
```

These are **example values**, not fixed production limits; I would determine the actual values from load testing and dependency/provider quotas.

### Interview-ready answer

> **"In CWD, I implement rate limiting at multiple boundaries. At the API layer I use APIM to limit requests per client or user. At the application layer I control Coordinator and Worker concurrency. At the MCP layer I enforce tool-specific limits so we don't overwhelm Salesforce or ServiceNow. For 429 responses, I respect Retry-After and use bounded exponential backoff with jitter. For sustained overload, I use Service Bus queues and backpressure. I also make sure autoscaling doesn't exceed downstream capacity. This protects the entire CWD workflow from traffic spikes and retry storms."**

### Easy memory

**Rate limit = `Limit → Queue → Backoff → Retry → Protect downstream`**.
