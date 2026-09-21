## How would you handle sudden traffic spikes?

In CWD, I would use **rate limiting, backpressure, queues, autoscaling, concurrency limits, and graceful degradation** so a sudden spike doesn't cascade through the entire system.

### Example

Suppose normal traffic is:

```text
100 requests/min
```

Suddenly:

```text
5,000 requests/min
```

I don't allow all 5,000 requests to hit the Coordinator → Workers → LLM → MCP → Salesforce/ServiceNow simultaneously.

```text id="9s4k2m"
                    5,000 requests
                          ↓
                    APIM / Gateway
                          ↓
                  Rate limiting
                          ↓
                  Load balancing
                          ↓
              Coordinator replicas
                          ↓
                     Queue
                          ↓
                Delegators / Workers
                          ↓
             Concurrency controls
                          ↓
              LLM / MCP / RAG
                          ↓
          Salesforce / ServiceNow
```

---

## 1. Rate limiting at the entry point

First, protect CWD from an uncontrolled flood.

For example:

```text id="8h2n6q"
5,000 requests
      ↓
APIM
      ↓
Allowed rate
      ↓
CWD
```

Excess traffic can receive `429 Too Many Requests` or be handled according to the application's queueing policy.

I would also consider:

* Per-user limits
* Per-tenant limits
* Per-API limits
* Burst limits

---

## 2. Autoscale the Coordinator

If traffic remains high:

```text id="r7v3px"
Coordinator × 3
       ↓
Traffic ↑
       ↓
Coordinator × 8
```

The Coordinator should be stateless enough that replicas can be added quickly.

Important workflow state remains in durable storage.

---

## 3. Use queues for asynchronous work

Don't force every request to execute synchronously.

```text id="k1m9sz"
Coordinator
    ↓
Service Bus
    ↓
┌────┬────┬────┐
W1   W2   W3
```

The queue absorbs the traffic spike.

Instead of:

```text
Spike → overload → failure ❌
```

we get:

```text
Spike → queue → controlled processing → recovery
```

---

## 4. Apply backpressure

Backpressure means **slowing admission when downstream capacity is reached**.

For example:

```text id="f2w8kc"
Workers
   ↓
ServiceNow capacity = 50 concurrent
   ↓
Concurrency limit = 50
   ↓
Extra work → Queue
```

This is critical because scaling upstream components without considering downstream capacity can make the spike worse.

---

## 5. Protect the LLM

Suppose 2,000 Workers suddenly call Azure OpenAI.

I would control:

```text id="x6q3vm"
Workers
   ↓
LLM Gateway
   ↓
Concurrency limiter
   ↓
RPM / TPM limiter
   ↓
LLM
```

If the provider starts returning `429`:

* Respect `Retry-After`
* Exponential backoff
* Jitter
* Bounded retries
* Queue where appropriate
* Approved fallback model if suitable

---

## 6. Protect MCP and enterprise systems

The same principle applies to:

```text id="n8c4za"
Workers
   ↓
MCP
   ↓
Salesforce / ServiceNow
```

I use:

* Concurrency limits
* Rate limits
* Connection pooling
* Circuit breakers
* Timeouts
* Bounded retries

For example:

```text id="j3p7wd"
1,000 Incident requests
        ↓
IT Delegator
        ↓
Concurrency = 50
        ↓
ServiceNow
```

The remaining requests wait rather than overwhelming ServiceNow.

---

## 7. Use graceful degradation

If the spike causes an optional capability to become unavailable:

```text id="m5v9sq"
Customer Worker       → ✅
Opportunity Worker    → ✅
Incident Worker       → temporarily unavailable
```

CWD can return:

```text
Customer information  ✓
Opportunity information ✓
Incident information   unavailable
```

rather than failing the entire Customer Briefing.

**Never fabricate the missing information.**

---

## 8. Use caching where appropriate

For frequently requested, non-sensitive or approved read-only data:

```text id="b7q2kx"
Request
  ↓
Cache
  ↓
Cache hit → return
```

This reduces pressure on:

* LLM
* RAG
* MCP
* Salesforce
* ServiceNow

But cache keys and authorization must respect tenant/user entitlements.

---

## 9. Circuit breakers

If a dependency becomes unhealthy during the spike:

```text id="p8x1vr"
ServiceNow
    ↓
Repeated failures
    ↓
Circuit OPEN
    ↓
Stop unnecessary calls
```

This prevents the dependency failure from propagating through CWD.

---

## 10. Prioritize critical workloads

If the system is severely overloaded, I can use workload priority:

```text id="j6s4qt"
Critical request
     ↓
High priority

Normal request
     ↓
Normal queue

Background processing
     ↓
Low priority
```

This allows critical business workflows to continue while non-critical workloads wait.

---

## 11. Monitor the spike in real time

I would monitor:

* Requests/sec
* Active workflows
* Queue depth
* Coordinator P95/P99
* Worker concurrency
* LLM 429 rate
* Token consumption
* MCP latency
* Salesforce/ServiceNow throttling
* Error rate
* CPU/memory
* Task completion rate

Example:

```text id="q2v5nm"
Traffic ↑
Queue depth ↑
LLM 429 ↑
ServiceNow latency ↑
       ↓
Apply backpressure
       ↓
Scale where capacity exists
       ↓
Protect constrained dependencies
```

---

## 12. Recovery after the spike

Once traffic returns to normal:

```text id="w3k7yp"
Spike
 ↓
Queue builds
 ↓
Traffic normalizes
 ↓
Workers process backlog
 ↓
Queue drains
 ↓
System returns to normal
```

Successful tasks should remain checkpointed, so recovery doesn't require restarting completed work.

---

## Interview-ready answer

> **“For sudden traffic spikes, I protect CWD from the outside in. I use APIM rate limiting and load balancing at the edge, horizontally scale Coordinator, Delegator and Worker replicas, and use queues and backpressure for workloads that don't need synchronous processing. At the LLM and MCP layers, I enforce concurrency and RPM/TPM limits and protect downstream systems such as Salesforce and ServiceNow with circuit breakers, timeouts and bounded retries. If capacity is still constrained, I prioritize critical workloads and gracefully degrade optional capabilities. I monitor queue depth, P95/P99 latency, 429s, downstream throttling and task completion to dynamically adjust capacity.”**

### Strong interview line

> **“During a traffic spike, my priority is not to process everything immediately; it's to keep the system healthy, protect downstream dependencies, and process the backlog safely.”**

### Easy memory

**Rate limit → Autoscale → Queue → Backpressure → Concurrency limits → Protect LLM/MCP → Circuit breaker → Prioritize → Degrade → Recover.**
