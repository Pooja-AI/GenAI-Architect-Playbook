## What is Latency?

**Latency is the time taken from when the user sends a request until CWD returns the final response.**

In simple terms:

> **“How long does the user have to wait?”**

### CWD example

User asks:

> **“Give me a customer briefing for C12345.”**

The request flows through multiple components:

```text id="m7v2kx"
User
 ↓
Coordinator
 ↓
Sales Delegator ─→ Customer Worker ─→ MCP → Salesforce
 ↓
IT Delegator ────→ Incident Worker ─→ MCP → ServiceNow
 ↓
Aggregate + Validate
 ↓
Final Response
```

Suppose:

```text id="c9k4wp"
Coordinator          = 400 ms
Sales branch         = 1.8 sec
IT branch            = 2.2 sec
Aggregation          = 300 ms
LLM final response   = 500 ms
```

Because Sales and IT run **in parallel**, the total isn't:

```text
1.8 + 2.2
```

Instead, it is approximately:

```text
Coordinator
+ longest parallel branch
+ aggregation
+ final LLM
≈ 0.4 + 2.2 + 0.3 + 0.5
≈ 3.4 seconds
```

---

## What latency do I track?

I don't track only total latency. I break it down.

```text id="v3n8qa"
End-to-End Latency
│
├── Coordinator latency
├── A2A latency
├── Delegator latency
├── Worker latency
├── RAG/search latency
├── MCP latency
├── Salesforce/ServiceNow latency
├── LLM latency
├── Queue latency
└── Aggregation/validation latency
```

This helps answer:

> **“Where is CWD spending most of its time?”**

---

## p50, p95 and p99

In production, I track percentile latency.

```text id="z8k3mp"
p50 = 50% of requests complete within this time
p95 = 95% complete within this time
p99 = 99% complete within this time
```

Example:

```text id="j2f6rw"
p50 = 2.1 sec
p95 = 4.8 sec
p99 = 8.5 sec
```

This tells me that most requests are fast, but some requests have significant tail latency.

For enterprise systems, **p95/p99 are especially useful** because averages can hide slow requests.

---

## How do I troubleshoot high latency?

Suppose CWD p95 latency increases from 4 seconds to 9 seconds.

I trace the request:

```text id="k6m9sa"
Correlation ID
      ↓
Coordinator
      ↓
Delegator
      ↓
Worker
      ↓
MCP
      ↓
ServiceNow
```

Then identify where the time increased.

For example:

```text id="t3x8vp"
Coordinator      400 ms
RAG              500 ms
MCP              300 ms
ServiceNow      6,000 ms  ← bottleneck
LLM              800 ms
```

Now I know the primary issue is the downstream ServiceNow call rather than the LLM.

---

## How do I reduce latency in CWD?

I can use:

* Parallel Delegator/Worker execution
* Async MCP calls
* Streaming where appropriate
* Caching frequently accessed data
* Reduce unnecessary LLM calls
* Smaller/optimized prompts
* Better RAG top-K
* Faster retrieval/reranking
* Connection pooling
* Timeouts
* Circuit breakers
* Appropriate model selection
* Avoid unnecessary agent hops

Example:

```text id="r4p8cx"
Sequential:

Sales → 2 sec
IT    → 3 sec

Total ≈ 5 sec


Parallel:

Sales ──→ 2 sec
IT    ──→ 3 sec

Total ≈ 3 sec + overhead
```

---

## Latency vs throughput

Another common interview question:

**Latency** = How long does **one request** take?

**Throughput** = How many requests can the system process in a given period?

```text id="n7c5md"
Latency    → 3 seconds/request
Throughput → 100 requests/minute
```

They are related but different performance metrics.

---

## Interview-ready answer

> **“Latency is the time from receiving a user request until CWD returns the final response. I track both end-to-end latency and component-level latency across the Coordinator, A2A, Delegators, Workers, RAG, MCP, downstream systems, LLM, and aggregation. In production I monitor p50, p95, and p99 rather than only average latency. For example, if ServiceNow is taking six seconds while the other components are fast, distributed tracing helps me identify it as the bottleneck. I reduce latency using parallel agent execution, async calls, caching, optimized retrieval and prompts, model selection, timeouts, and circuit breakers.”**

### Easy memory

**Latency = “How long does the user wait?”**

**Measure → Trace → Find bottleneck → Optimize.**
