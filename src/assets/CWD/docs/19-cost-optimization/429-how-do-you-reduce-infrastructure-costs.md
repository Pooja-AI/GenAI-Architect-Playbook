## How do you reduce infrastructure costs in CWD?

The main principle is:

> **I don't reduce cost by simply using smaller infrastructure. I optimize resource utilization while maintaining the required performance, reliability, security, and SLOs.**

### 1. Right-size compute

CWD has:

```text id="inf1"
Coordinator
Delegators
Workers
MCP Servers
RAG/Search
Databases
```

I monitor CPU, memory, concurrency, latency, and throughput and right-size each component.

For example, if a Worker is consistently using 20% CPU, I don't provision unnecessarily large instances.

---

### 2. Use autoscaling

Instead of running maximum capacity 24/7:

```text id="inf2"
Low traffic
   ↓
Few replicas

High traffic
   ↓
More replicas
```

Scale based on meaningful signals such as:

* Requests/sec
* Active workflows
* Queue depth
* P95/P99 latency
* Worker concurrency
* CPU/memory where relevant

For asynchronous Workers, **queue depth** can be a better scaling signal than CPU.

---

### 3. Scale each CWD layer independently

Don't scale everything together.

```text id="inf3"
Coordinator      → 3 replicas
Sales Worker     → 5 replicas
Incident Worker  → 10 replicas
MCP Salesforce   → 4 replicas
```

These numbers are illustrative.

If Incident Worker has much higher traffic, scale only that capability.

> **Independent scaling avoids paying for capacity that isn't being used.**

---

### 4. Use queues for bursty workloads

For long-running or non-interactive tasks:

```text id="inf4"
Coordinator
     ↓
Service Bus
     ↓
Worker
```

Instead of keeping compute running continuously waiting for work.

Queues also provide:

* buffering
* backpressure
* retry
* DLQ
* controlled concurrency

---

### 5. Reduce unnecessary compute

Before adding servers, optimize the workload.

For example:

```text id="inf5"
Duplicate request
      ↓
Cache HIT
      ↓
No Worker execution
```

Also:

* avoid unnecessary agent loops
* avoid duplicate tool calls
* parallelize independent work
* use efficient data processing
* reduce unnecessary RAG retrieval
* reduce unnecessary LLM calls

This can reduce infrastructure **and** LLM costs.

---

### 6. Optimize vector search infrastructure

For Azure AI Search:

```text id="inf6"
More query traffic
      → investigate replicas

More data/index capacity
      → investigate partitions
```

I don't automatically increase both.

I first identify whether the bottleneck is **query throughput or index capacity**.

---

### 7. Use caching

Redis can reduce repeated expensive operations:

```text id="inf7"
Worker
  ↓
Redis
  ↓ HIT → return
  ↓ MISS
MCP / Search / LLM
```

This reduces:

* downstream calls
* search workload
* LLM calls
* compute utilization

But Redis isn't the source of truth for critical workflow state.

---

### 8. Optimize storage

I separate data based on how it is used:

```text id="inf8"
Hot data       → fast storage
Warm data      → lower-cost storage
Archive        → cheaper long-term storage
```

I also implement appropriate retention policies for:

* logs
* traces
* old workflow data
* temporary files
* historical artifacts

---

### 9. Control observability costs

GenAI systems can generate huge amounts of telemetry.

I avoid logging:

```text id="inf9"
❌ Full prompts unnecessarily
❌ Full sensitive documents
❌ Secrets/tokens
❌ Large MCP payloads
```

Instead, log useful metadata:

```text id="inf10"
trace_id
workflow_id
task_id
worker_id
model
token counts
latency
status
error type
tool name
```

Use sampling for high-volume traces where appropriate while retaining enough telemetry for troubleshooting and audit requirements.

---

### 10. Use serverless for suitable workloads

For event-driven or intermittent workloads, services such as:

```text id="inf11"
Azure Functions
```

can be more cost-efficient than continuously running compute.

But for consistently high-throughput workloads, continuously provisioned compute may be more appropriate.

So I choose based on the workload rather than assuming serverless is always cheaper.

---

### 11. Schedule non-production environments

Development/test environments don't always need production capacity.

For example:

```text id="inf12"
Production
→ always available

Dev/Test
→ scale down outside working hours
```

This can significantly reduce non-production infrastructure spend.

---

### 12. Monitor cost per workload

I track:

```text id="inf13"
Cost / workflow
Cost / request
Cost / Worker
Cost / tenant
Cost / successful task
Compute utilization
Search utilization
Storage growth
```

Then I can identify expensive components.

---

## CWD example

Suppose:

```text id="inf14"
Customer Briefing
       ↓
Coordinator
       ↓
Sales Delegator ──→ Customer Worker
       │
       └──────────→ Opportunity Worker

IT Delegator ─────→ Incident Worker
```

If Incident Worker receives most of the traffic:

```text id="inf15"
Don't do:

Scale entire CWD × 5 ❌

Instead:

Incident Worker      ↑ scale
Sales Workers        → normal
Coordinator          → normal
MCP ServiceNow       ↑ carefully
```

And I make sure the additional Worker capacity doesn't exceed ServiceNow's allowed throughput.

---

## 🎯 Interview-ready answer

> **“I reduce infrastructure costs by right-sizing each CWD component and scaling independently based on actual workload. I use autoscaling for Coordinator, Delegators, Workers, and MCP services, with signals such as active workflows, queue depth, throughput, and P95 latency. For bursty workloads, I use Service Bus for buffering and controlled asynchronous processing. I use caching to avoid repeated downstream and LLM work, optimize Azure AI Search replicas and partitions based on the actual bottleneck, and apply storage and telemetry retention policies. I also reduce observability costs through selective logging and sampling while retaining the telemetry needed for troubleshooting and audit. Finally, I track cost per request, workflow, Worker, and tenant so optimization is measurable.”**

### Easy memory

**Right-size → Autoscale → Scale independently → Queue → Cache → Optimize Search → Storage lifecycle → Control logs → Monitor cost**

> **Architect-level answer:** *“I reduce infrastructure cost by reducing wasted capacity, not by compromising the SLO.”*
