## How would you implement backpressure?

**Backpressure means controlling incoming work when a downstream component cannot process work as fast as it is arriving.**

In CWD, I would implement it **at multiple boundaries**, especially between the Coordinator → Delegators → Workers → MCP → enterprise systems.

### CWD example

Suppose ServiceNow can safely process only **50 concurrent requests**, but suddenly 500 Incident Workers want to call it.

Without backpressure:

```text
500 Workers
    ↓
MCP
    ↓
ServiceNow
    ↓
Overload → timeouts → retries → more overload ❌
```

With backpressure:

```text
500 requests
     ↓
Concurrency limiter = 50
     ↓
┌─────────────────┐
│ 50 active calls │
└─────────────────┘
     ↓
ServiceNow

Remaining work
     ↓
Queue / wait
```

---

# 1. Put a queue between producers and consumers

For asynchronous CWD workloads:

```text
Coordinator
    ↓
Service Bus / Queue
    ↓
Delegator
    ↓
Worker pool
```

If requests arrive faster than Workers can process them:

```text
Incoming rate = 1,000/min
Processing rate = 300/min

Queue absorbs the difference
```

Instead of crashing, the queue grows temporarily.

---

# 2. Limit Worker concurrency

Don't allow unlimited Worker execution.

```text
Incident Worker Pool
       ↓
Concurrency = 50
       ↓
MCP
       ↓
ServiceNow
```

If 500 tasks are waiting:

```text
50 → running
450 → waiting
```

This protects ServiceNow.

---

# 3. Limit MCP concurrency

I would also enforce limits at the MCP boundary.

```text
Workers
   ↓
MCP Client
   ↓
MCP concurrency limiter
   ↓
MCP Server
   ↓
ServiceNow
```

This is important because multiple Workers may share the same MCP capability.

---

# 4. Respect downstream rate limits

Suppose Salesforce allows only a certain request rate.

I don't let CWD send unlimited calls:

```text
Workers
   ↓
Rate limiter
   ↓
Salesforce
```

If Salesforce starts returning `429`:

```text
429
 ↓
Slow down
 ↓
Backoff
 ↓
Queue
```

I would respect the provider's `Retry-After` guidance where available.

---

# 5. Use queue-depth-based autoscaling

Queue depth can drive Worker scaling.

```text
Queue depth
    ↓
100
    ↓
500
    ↓
1000
    ↓
Scale Worker replicas
```

For example:

```text
Queue = 100
    → 3 Workers

Queue = 500
    → 8 Workers

Queue = 1000
    → 15 Workers
```

Those thresholds would be established through load testing.

But I would still enforce the **downstream concurrency limit**.

---

# 6. Don't scale beyond downstream capacity

This is a very important interview point.

Suppose:

```text
Queue = 10,000
```

I cannot simply create:

```text
500 Worker replicas ❌
```

if ServiceNow can only safely handle 50 concurrent calls.

Instead:

```text
10,000 queued tasks
        ↓
Worker replicas
        ↓
Concurrency limit = 50
        ↓
ServiceNow
```

**The downstream system determines the safe processing rate.**

---

# 7. Use bounded queues

A queue should not grow forever.

For example:

```text
Queue capacity = 10,000
```

If it reaches capacity:

```text
Queue full
   ↓
Apply admission control
   ↓
429 / retry-later / lower-priority queue
```

This prevents memory exhaustion and uncontrolled backlog.

---

# 8. Prioritize workloads

CWD could have different priorities:

```text
             Queue
              │
      ┌───────┼────────┐
      ↓       ↓        ↓
   Critical  Normal   Background
```

During overload:

```text
Critical     → process first
Normal       → process next
Background   → delayed
```

This is useful when capacity is temporarily constrained.

---

# 9. Use timeouts

Backpressure should be combined with timeouts.

Example:

```text
Worker
  ↓
Wait for queue slot
  ↓
Maximum wait = 30 sec
  ↓
No capacity
  ↓
Return controlled failure/retry-later
```

Otherwise requests can wait indefinitely.

---

# 10. Use circuit breakers

If the downstream dependency is unhealthy:

```text
ServiceNow
    ↓
Repeated 503/timeouts
    ↓
Circuit OPEN
```

Then:

```text
New Incident requests
        ↓
Don't call ServiceNow
        ↓
Queue / approved fallback / partial result
```

This is backpressure plus **failure isolation**.

---

# 11. Apply backpressure to LLM calls too

For CWD:

```text
Workers
   ↓
LLM Gateway
   ↓
Concurrency + TPM/RPM limits
   ↓
Azure OpenAI
```

Suppose the model has reached its token capacity.

Instead of:

```text
More Workers
 ↓
More LLM calls
 ↓
429
 ↓
Retries
 ↓
More 429 ❌
```

I:

```text
Detect throttling
      ↓
Reduce concurrency
      ↓
Backoff
      ↓
Queue
      ↓
Process gradually
```

---

# 12. Backpressure across CWD

A complete design looks like:

```text
                     Users
                       ↓
                 APIM / Gateway
                       ↓
                 Rate limiting
                       ↓
                  Coordinator
                       ↓
                 A2A / Queue
                       ↓
                  Delegators
                       ↓
               Worker concurrency
                       ↓
                    MCP
                       ↓
              MCP rate/concurrency
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
         Salesforce          ServiceNow
```

Each boundary can protect the next layer.

---

## Example: ServiceNow spike

Suppose:

```text
Normal:
50 Incident calls/sec

Spike:
500 Incident calls/sec
```

I would do:

```text
500 requests
     ↓
Rate limiter
     ↓
Queue
     ↓
Worker pool
     ↓
Concurrency = 50
     ↓
MCP
     ↓
ServiceNow
```

The queue absorbs the burst, while only a safe number of requests reach ServiceNow.

As the spike disappears:

```text
Traffic ↓
Queue drains
Workers process backlog
System returns to normal
```

---

# Technologies in your CWD Azure architecture

| Backpressure requirement | Technology/pattern               |
| ------------------------ | -------------------------------- |
| Entry rate limiting      | Azure APIM                       |
| Async buffering          | Azure Service Bus                |
| Worker concurrency       | Application-level semaphore/pool |
| MCP protection           | MCP concurrency/rate limits      |
| LLM protection           | RPM/TPM/concurrency limits       |
| Autoscaling              | AKS / Container Apps             |
| Dependency protection    | Circuit breaker                  |
| Retry control            | Exponential backoff + jitter     |
| Queue monitoring         | Azure Monitor / App Insights     |
| Failed work              | DLQ                              |
| Recovery                 | Checkpoint + replay              |

---

## Interview-ready answer

> **“I implement backpressure by controlling work at every capacity boundary. At the edge, I use APIM rate limiting. For asynchronous workloads, I put tasks on Service Bus so bursts are absorbed instead of immediately reaching downstream systems. I limit Worker and MCP concurrency, enforce LLM RPM/TPM limits, and respect Salesforce or ServiceNow rate limits. Queue depth can drive autoscaling, but I never scale beyond downstream capacity. I also use bounded queues, timeouts, circuit breakers, and priority handling. This allows CWD to slow down safely instead of turning a traffic spike into cascading failures.”**

### Strong interview line

> **“Backpressure means the producer must respect the consumer's capacity; I don't allow CWD to generate work faster than the next layer can safely process it.”**

### Easy memory

**Limit → Queue → Control concurrency → Respect downstream limits → Autoscale → Circuit breaker → Drain safely.**
