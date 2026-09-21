## How do you prevent cascading failures?

**Cascading failure** happens when one failing dependency causes failures to spread across multiple components and eventually brings down the whole CWD workflow.

### CWD example

Suppose ServiceNow becomes unavailable:

```text id="r7n3pk"
ServiceNow ❌
     ↓
MCP Server timeouts
     ↓
Incident Worker timeouts
     ↓
IT Delegator waits
     ↓
Coordinator waits
     ↓
More requests accumulate
     ↓
CWD becomes overloaded ❌
```

The goal is to **contain the failure at the affected boundary**.

---

## How I prevent it in CWD

### 1. Circuit breakers

Repeated ServiceNow failures should open the circuit:

```text id="9q4x8d"
ServiceNow
   ↓
Repeated failures
   ↓
Circuit OPEN
   ↓
Stop calling ServiceNow
```

This prevents continued pressure on the unhealthy dependency.

---

### 2. Bounded retries + exponential backoff + jitter

Don't retry indefinitely:

```text id="2v7k5m"
Failure
 ↓
Retry 1 → wait
 ↓
Retry 2 → longer wait
 ↓
Retry 3 → longer wait
 ↓
Stop
```

Jitter prevents thousands of Workers from retrying simultaneously.

---

### 3. Timeouts

Every remote call gets a timeout:

```text id="n4c8sj"
Worker
  ↓
MCP
  ↓
ServiceNow
  ↓
10-second timeout
  ↓
Fail fast
```

Without timeouts, threads/workers can remain stuck waiting for a dependency.

---

### 4. Bulkheads / resource isolation

Separate resources for independent capabilities.

For example:

```text id="w9k2fx"
Sales Workers
   ↓
Sales connection/thread pool

IT Workers
   ↓
IT connection/thread pool
```

If ServiceNow consumes all available connections, it shouldn't prevent Salesforce-related work from running.

**This is called the bulkhead pattern.**

---

### 5. Limit concurrency

Don't allow unlimited Workers to call a struggling dependency:

```text id="s5x8qp"
1000 Workers
     ↓
Concurrency limit = 20
     ↓
ServiceNow
```

This protects both CWD and the downstream system.

---

### 6. Queue asynchronous work

For operations that don't need an immediate response:

```text id="k8p2mz"
Worker
  ↓
Service Bus
  ↓
Consumer
  ↓
ServiceNow
```

The queue absorbs temporary traffic spikes and allows controlled processing.

---

### 7. Graceful degradation

If ServiceNow is unavailable:

```text id="f3x7qa"
Customer Worker      → ✅
Opportunity Worker   → ✅
Incident Worker      → ❌
```

Don't fail the entire Customer Briefing if Incident information is optional.

Return a controlled partial result.

---

### 8. Fallback

If there is an **approved** fallback:

```text id="p6n1vw"
ServiceNow ❌
     ↓
Approved cache / secondary source
     ↓
Continue
```

For critical writes, prefer durable queuing and replay rather than an unsafe fallback.

---

### 9. Idempotency

Retries and replay must not create duplicate transactions:

```text id="v4m8kc"
Retry
 ↓
Same idempotency key
 ↓
Existing transaction recognized
 ↓
No duplicate
```

---

### 10. Backpressure

If downstream capacity is limited, don't allow unlimited work into the system.

```text id="z1q6rx"
Incoming requests
       ↓
Queue
       ↓
Concurrency limit
       ↓
Workers
       ↓
Enterprise systems
```

This prevents overload from propagating upstream.

---

## CWD protection model

```text id="m9x3tf"
                 Coordinator
                     │
              ┌──────┴──────┐
              ↓             ↓
        Sales Delegator  IT Delegator
              │             │
          Workers       Incident Worker
              │             │
          Salesforce    MCP → ServiceNow ❌
                            │
                       Circuit Breaker
                            │
                         OPEN
                            │
                    Partial/Fallback
```

The **IT/ServiceNow failure remains isolated** rather than taking down Sales capabilities.

### Technologies/patterns

| Protection           | CWD implementation              |
| -------------------- | ------------------------------- |
| Circuit breaker      | Dependency-specific             |
| Retry control        | Bounded retry                   |
| Backoff              | Exponential + jitter            |
| Timeout              | Per dependency/call             |
| Bulkhead             | Separate pools/resources        |
| Concurrency control  | Worker/dependency limits        |
| Backpressure         | Service Bus / queue             |
| Async processing     | Service Bus                     |
| Graceful degradation | Partial result                  |
| Fallback             | Approved cache/secondary source |
| Duplicate protection | Idempotency                     |
| Recovery             | Checkpoint + replay             |
| Monitoring           | App Insights + Langfuse         |

### Interview-ready answer

> **“I prevent cascading failures by isolating dependencies and controlling how failures propagate. In CWD, I use timeouts, bounded retries with exponential backoff and jitter, dependency-specific circuit breakers, bulkheads, concurrency limits, queues for asynchronous work, and backpressure. I also use graceful degradation and approved fallbacks so one failed Worker doesn't bring down unrelated capabilities. Finally, idempotency and checkpoints make retries and recovery safe.”**

### Strong interview line

> **“My goal is failure containment: one unhealthy dependency should degrade only the affected capability, not propagate through the entire CWD workflow.”**

### Easy memory

**Timeout → Retry → Backoff → Circuit Breaker → Bulkhead → Limit concurrency → Queue → Degrade/Fallback → Recover.**
