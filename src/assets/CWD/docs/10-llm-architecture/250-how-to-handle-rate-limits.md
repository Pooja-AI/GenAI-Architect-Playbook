## How do you handle rate limits?

In CWD, rate limiting can happen when **too many LLM requests are sent to Azure OpenAI within a short period**. I handle it with **backoff, concurrency control, queuing, and fallback**.

### CWD flow

```text id="9p4k2m"
Coordinator
     ↓
Multiple Delegators
     ↓
Multiple Workers
     ↓
LLM Requests
     ↓
Rate Limit / 429
     ↓
Retry-After / Backoff
     ↓
Retry
     ↓
Still limited?
 ↙             ↘
YES             NO
 ↓               ↓
Queue /          Continue
Fallback
```

### 1. Detect 429 responses

When Azure OpenAI returns a throttling response such as **HTTP 429**, I treat it differently from an application error.

```text
429 → Rate limited
5xx → Service/transient failure
401/403 → Authentication/authorization problem
400 → Invalid request
```

I don't blindly retry all of them.

---

### 2. Respect `Retry-After`

If the service provides a retry interval, I use it.

```text id="r6m2q8"
429
 ↓
Retry-After = 2 sec
 ↓
Wait
 ↓
Retry
```

If no useful value is available, use exponential backoff with jitter.

```text id="n7x3vc"
Retry 1 → 1 sec + jitter
Retry 2 → 2 sec + jitter
Retry 3 → 4 sec + jitter
```

Retries remain **bounded**.

---

### 3. Control concurrency

This is especially important in CWD because multiple Workers can execute in parallel.

For example:

```text id="a8k5pz"
Delegator
 ├── Worker 1 ──┐
 ├── Worker 2 ──┤
 ├── Worker 3 ──┼──→ LLM
 ├── Worker 4 ──┤
 └── Worker 5 ──┘
```

If every Worker calls the model simultaneously, we can exceed the provider's throughput.

So I use:

* Concurrency limits
* Request throttling
* Connection/request pools
* Per-model quotas

```text id="v5j2hx"
10 Workers
    ↓
Concurrency Controller
    ↓
Only 3 requests at a time
    ↓
Azure OpenAI
```

---

### 4. Queue excess requests

If demand is higher than the available model capacity:

```text id="k3c8nm"
Workers
   ↓
Queue
   ↓
Rate / Concurrency Controller
   ↓
Azure OpenAI
```

For asynchronous workloads, Azure Service Bus can be used to buffer work.

This prevents traffic spikes from overwhelming the model endpoint.

---

### 5. Use model/deployment fallback

If the primary deployment remains throttled:

```text id="z4w7qy"
Primary deployment
       ↓
429
       ↓
Retry
       ↓
Still throttled
       ↓
Approved fallback deployment/model
```

The fallback must have the required capability and available capacity.

---

### 6. Reduce unnecessary token consumption

Rate limits are often affected by throughput/token consumption.

So I also control:

* Prompt size
* RAG Top-K
* Output token limits
* Duplicate context
* Conversation history
* Unnecessary LLM calls

```text id="s6k9rw"
Smaller useful prompt
        ↓
Fewer tokens/request
        ↓
Higher throughput
        ↓
Lower cost
```

---

### 7. Monitor throttling

I track:

* 429 rate
* Requests/minute
* Tokens/minute
* Concurrent requests
* Queue depth
* Retry count
* Retry latency
* Fallback rate
* P95/P99 latency

This helps determine whether we need to **reduce concurrency, optimize prompts, or provision more model capacity**.

---

### 🎯 Strong interview answer

> **“I handle rate limits by detecting 429 responses and respecting the provider's Retry-After guidance. If needed, we use bounded exponential backoff with jitter. Because CWD can have multiple Workers executing in parallel, we also control concurrency and use queues for asynchronous workloads. If the primary deployment remains throttled, we can route eligible requests to a prevalidated fallback deployment. We also reduce unnecessary token consumption and monitor 429 rate, token throughput, concurrency, queue depth, retries, and fallback rate.”**

### Easy memory trick

**Detect → Wait → Retry → Throttle → Queue → Fallback → Monitor**

Key interview line:

> **“Rate-limit handling is not just retry logic; it is also controlling how much concurrent traffic we generate.”**
