# How do you handle Bedrock throttling?

## Short answer

**Bedrock throttling means our application is sending requests faster than the allowed Bedrock request/token capacity.** In CWD, I handle it using:

**Detect → Limit → Queue → Retry → Backoff → Reduce → Fallback → Monitor**

---

## Key points

### 1. Detect throttling

A throttled request can return a **429 / throttling-related error**.

I monitor:

* 429/throttling count
* Requests per minute
* Token usage
* Concurrent model calls
* Queue depth
* Retry count
* P95/P99 latency

---

### 2. Control concurrency

This is especially important in CWD because multiple Workers can execute in parallel.

Example:

```text id="x7n4kp"
Coordinator
     ↓
Delegator
     ↓
10 Workers
     ↓
10 Bedrock calls ❌
```

Instead, control concurrency:

```text id="q4r8mz"
10 Workers
     ↓
Concurrency Controller
     ↓
3 active Bedrock calls
     ↓
Remaining requests queued
```

This prevents a sudden burst from overwhelming the model capacity.

---

### 3. Use exponential backoff + jitter

When Bedrock throttles:

```text id="b8k2vz"
Request
  ↓
429
  ↓
Wait
  ↓
Retry
  ↓
429
  ↓
Longer wait
  ↓
Retry
```

Use **bounded exponential backoff with jitter**.

For example:

```text id="t9m3cx"
Retry 1 → ~0.5 sec
Retry 2 → ~1 sec
Retry 3 → ~2 sec
Retry 4 → ~4 sec
```

The actual values should be configurable.

**Jitter** prevents many Workers from retrying at exactly the same time.

---

### 4. Respect `Retry-After` when provided

If the service tells us when to retry, I use that information rather than immediately retrying.

```text id="r5v8qn"
Bedrock
   ↓
Throttled
   ↓
Retry-After
   ↓
Wait
   ↓
Retry
```

---

### 5. Queue requests

For asynchronous workloads, I can use **SQS**:

```text id="k3d9wx"
Workers
   ↓
SQS
   ↓
Controlled consumers
   ↓
Bedrock
```

This absorbs traffic spikes.

For example, if 100 requests arrive at once, I don't necessarily send 100 Bedrock calls simultaneously.

---

### 6. Reduce token consumption

Throttling can also be related to token capacity.

So I reduce unnecessary tokens:

* Limit conversation history
* Summarize old history
* Reduce RAG Top-K
* Remove duplicate context
* Rerank before sending context
* Limit output tokens
* Use structured Worker results
* Avoid unnecessary LLM calls
* Use semantic caching where appropriate

Example:

```text id="h8q2yd"
10,000 tokens/request ❌
        ↓
Remove unnecessary context
        ↓
3,000 tokens/request ✅
```

---

### 7. Use model routing

If the workload allows it, use different models based on complexity.

```text id="v4r7js"
Request
   ↓
Model Router
   ├── Simple → lower-cost/faster model
   └── Complex → higher-capability model
```

This prevents sending every task to the most expensive/high-demand model.

Any fallback model should be **pre-approved and validated** to meet the task's quality requirements.

---

### 8. Use circuit breaker for persistent failures

If throttling becomes severe:

```text id="p2m6rx"
Bedrock
   ↓
Repeated throttling
   ↓
Circuit Breaker
   ↓
Stop sending requests temporarily
   ↓
Recover gradually
```

This prevents the application from continuously hammering an already-throttled dependency.

---

### 9. Monitor and tune capacity

I monitor:

```text id="j5q8vn"
429 rate
Token/minute
Request/minute
Concurrency
Queue depth
Retry rate
Latency
Cost
```

If throttling is consistently high, I investigate whether we need to **adjust capacity/quotas, reduce concurrency, optimize token usage, or change the workload/model strategy**.

---

# CWD example

Suppose:

```text
Customer Briefing
       ↓
Coordinator
       ↓
2 Delegators
       ↓
10 Workers
       ↓
10 Bedrock requests
```

If all 10 Workers call Bedrock simultaneously:

```text
Bedrock capacity
       ↑
       │
10 concurrent requests
       ↓
   Throttling
```

I would implement:

```text id="z6k4pt"
10 Workers
    ↓
Concurrency Limit = 3
    ↓
┌───────────────┐
│ 3 active      │ → Bedrock
│ 7 queued      │
└───────────────┘
```

If one receives 429:

```text id="s8n3qv"
429
 ↓
Retry-After / Backoff
 ↓
Retry with jitter
 ↓
Success
```

If repeated retries fail:

```text id="a2m7kc"
Retry exhausted
      ↓
Fallback / partial result
      ↓
Delegator
      ↓
Coordinator
```

---

# 🎯 Strong interview answer

> **“In CWD, multiple Workers can call Bedrock concurrently, so I handle throttling at both the request and token level. First, I control concurrency so we don't send an uncontrolled burst of requests. For throttled calls, I respect Retry-After when available and use bounded exponential backoff with jitter. For asynchronous workloads, I use SQS to buffer requests. I also reduce token consumption through prompt optimization, RAG Top-K control, context compression and avoiding unnecessary LLM calls. If appropriate, I use model routing or an approved fallback model. Finally, I monitor 429 rate, token usage, concurrency, queue depth, retry rate and P95/P99 latency, and adjust the capacity and routing strategy based on production behavior.”**

## Easy memory trick

**D → L → Q → R → B → R → M**

**Detect → Limit → Queue → Retry → Backoff → Reduce → Monitor**

### Key distinction

**API rate limiting** controls **how many requests** enter the system.

**Bedrock throttling** can involve exceeding the model's **request or token capacity**.

So in CWD, I control **both request concurrency and token consumption**.
