## What is the bottleneck?

In **CWD**, the bottleneck is the component that **limits the overall throughput or increases latency** of the workflow.

It is not necessarily the Coordinator. We identify it using distributed tracing and load testing.

### CWD example

```text id="8x4mqp"
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
 ┌─────────────┬──────────────┐
 LLM           MCP            RAG
 ↓             ↓              ↓
Azure OpenAI  Salesforce    AI Search
              /ServiceNow
```

Suppose we measure:

```text id="5p7zvk"
Coordinator      → 300 ms
A2A              → 200 ms
LLM              → 1.2 sec
RAG              → 500 ms
MCP              → 300 ms
ServiceNow       → 4 sec  ← BOTTLENECK
```

Even if everything else is fast, the **ServiceNow dependency** can dominate the workflow latency.

---

## Common CWD bottlenecks

### 1. LLM

Could be caused by:

* High token volume
* Large prompts
* Multiple LLM calls per Worker
* Slow model
* Rate limiting / 429
* Too many agent iterations

```text
Worker
 ↓
LLM
 ↓
8 seconds
```

### 2. MCP / Enterprise API

For example:

```text id="q2v6dn"
Incident Worker
      ↓
MCP
      ↓
ServiceNow
      ↓
5 seconds
```

The MCP server itself may be fast, while ServiceNow is slow.

So tracing helps distinguish:

**MCP bottleneck vs downstream bottleneck.**

### 3. RAG / Search

Possible causes:

* Large top-K
* Complex hybrid search
* Slow reranking
* Large documents
* Index problems
* Poorly optimized filters

### 4. Database

Cosmos DB / Redis / other persistence can become a bottleneck because of:

* High request volume
* Hot partitions
* Throttling
* Connection limits
* Poor partition-key design

### 5. Coordinator

The Coordinator can become a bottleneck if:

* Too much orchestration logic is centralized
* Too many synchronous operations
* Too many workflows share one instance
* State operations are slow

That's why I would keep the Coordinator **stateless where possible, horizontally scalable, and avoid unnecessary synchronous work**.

---

## How do I identify the bottleneck?

I use **distributed tracing**.

```text id="6y8m2c"
Trace: CWD-5001

Coordinator        0.3s
 ├─ Sales A2A      0.2s
 │   ├─ Customer   0.8s
 │   └─ Opportunity 4.5s  ←
 │        └─ Salesforce 4.1s ← ROOT BOTTLENECK
 │
 └─ IT A2A         0.2s
     └─ Incident   1.5s
```

Then I look at:

* P50 / P95 / P99 latency
* CPU/memory
* Queue depth
* Error rate
* LLM token throughput
* MCP latency
* Database latency
* Downstream API latency
* Rate limits / throttling

### Important interview point

**Don't just look at average latency.**

For production CWD, I care especially about **P95/P99** because a small percentage of very slow requests can significantly affect user experience.

---

### Interview-ready answer

> **“The bottleneck in CWD is whichever component limits overall throughput or latency. It could be the LLM, RAG, MCP, downstream systems like Salesforce or ServiceNow, the database, or even the Coordinator. I identify it using distributed tracing and P95/P99 latency rather than guessing. For example, if an Incident Worker takes 5 seconds and tracing shows 4 seconds is spent waiting on ServiceNow through MCP, then ServiceNow is the bottleneck. I would optimize or isolate that dependency using concurrency limits, caching where appropriate, circuit breakers, asynchronous processing, or scaling.”**

### Strong interview line

> **“I don't assume the Coordinator is the bottleneck; I trace the entire critical path and identify where the most time or capacity is actually being consumed.”**

**Easy memory:**
**Trace → Measure → Find slowest/limited component → Confirm with load test → Optimize → Re-measure.**
