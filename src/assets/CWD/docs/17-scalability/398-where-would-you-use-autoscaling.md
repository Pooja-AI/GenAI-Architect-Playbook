## Where would you use autoscaling in CWD?

I would use **autoscaling at the stateless, independently scalable layers** where workload can fluctuate.

### CWD example

```text
Users
  ↓
APIM
  ↓
Coordinator  ← Autoscale
  ↓
Delegators   ← Autoscale
  ↓
Workers      ← Autoscale
  ↓
MCP Servers  ← Autoscale
  ↓
Salesforce / ServiceNow
```

### 1. Coordinator — Yes

I would run multiple Coordinator instances behind a load balancer/APIM.

```text
Coordinator-1
Coordinator-2
Coordinator-3
       ↑
   Autoscaling
```

Scale based on:

* Active workflows
* Requests/sec
* CPU/memory
* P95 latency
* Number of concurrent tasks

The workflow state/checkpoints remain in durable storage, so a new Coordinator instance can continue an existing workflow.

---

### 2. Delegators — Yes

Each domain can scale independently.

```text
Sales Delegator   → scale based on Sales workload
IT Delegator      → scale based on IT workload
Manufacturing     → scale based on Manufacturing workload
```

For example, if IT requests suddenly increase, I scale **IT Delegator** without unnecessarily scaling Sales.

---

### 3. Workers — Yes, this is one of the most important places

Workers are usually the best candidates for independent autoscaling because different capabilities have different workloads.

```text
Customer Worker     → 2 replicas
Opportunity Worker  → 3 replicas
Incident Worker     → 10 replicas
```

These numbers are illustrative.

I would scale based on:

* Queue depth
* Active tasks
* Requests/sec
* P95/P99 latency
* Error/retry rate
* MCP latency
* LLM latency

For asynchronous Workers, **queue depth is a very useful autoscaling signal**.

---

### 4. MCP Servers — Yes, but carefully

I can independently scale MCP servers:

```text
Salesforce MCP
   ├── Instance 1
   ├── Instance 2
   └── Instance 3

ServiceNow MCP
   ├── Instance 1
   └── Instance 2
```

But there is an important limitation:

> **I cannot scale MCP faster than Salesforce or ServiceNow can handle the traffic.**

If ServiceNow supports only a certain request rate, adding 20 MCP replicas could actually make throttling worse.

So I combine autoscaling with:

* Concurrency limits
* Rate limiting
* Backpressure
* Circuit breakers
* Retry with exponential backoff

---

### 5. LLM calls — Controlled scaling, not simply more replicas

LLMs are provider-managed, so I don't normally "autoscale the LLM."

Instead I control:

```text
Concurrency
   ↓
RPM / TPM limits
   ↓
Queueing
   ↓
Model routing
   ↓
Approved fallback model
```

For example, if Azure OpenAI starts returning `429`, I reduce concurrency, respect `Retry-After`, queue work, and gradually increase concurrency when capacity becomes available.

---

### 6. Vector Search — Scale based on workload

For Azure AI Search:

* **Replicas** → increase query throughput
* **Partitions** → increase data/index capacity

So if CWD has more concurrent RAG queries, I can increase replicas.

---

## Where I would NOT blindly autoscale

I wouldn't blindly scale:

* Salesforce
* ServiceNow
* Databases
* LLM provider
* External APIs

These have their own capacity and throttling limits.

The architecture should therefore be:

```text
Autoscale
    ↓
Concurrency Control
    ↓
Queue / Backpressure
    ↓
Rate Limit
    ↓
Downstream Dependency
```

### Interview-ready answer

> **"In CWD, I would use autoscaling mainly for the stateless Coordinator, Delegators, Workers, MCP servers, and search infrastructure. I would scale each layer independently based on its actual workload—for example, queue depth and active tasks for Workers, concurrent workflows and latency for Coordinators, and tool-call throughput for MCP. For downstream systems like Salesforce, ServiceNow, and LLM providers, I would respect their rate and concurrency limits rather than simply adding more replicas. Autoscaling would therefore work together with backpressure, rate limiting, circuit breakers, and queues."**

**Easy memory:**
**Coordinator → Delegator → Worker → MCP → Search = autoscale; downstream dependencies = respect their limits.**
