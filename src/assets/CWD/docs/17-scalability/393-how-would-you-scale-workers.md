## How would you scale Workers?

In CWD, I would scale **Workers independently based on their capability and workload**. I would not scale all Workers equally.

For example, if the **Incident Worker** receives much more traffic than the Customer Worker, I scale only the Incident Worker.

### CWD flow

```text
                    Coordinator
                         ↓ A2A
                    IT Delegator
                         ↓
              ┌──────────┼──────────┐
              ↓          ↓          ↓
        Incident W1   Incident W2  Incident W3
              ↓          ↓          ↓
             MCP        MCP        MCP
              └──────────┼──────────┘
                         ↓
                    ServiceNow
```

---

## 1. Horizontal scaling

Instead of making one Worker extremely large:

```text
Incident Worker × 1
        ↓
Incident Worker × 5
        ↓
Incident Worker × 10
```

A load balancer, queue consumers, or service layer distributes tasks across replicas.

This gives better availability and throughput.

---

## 2. Scale each Worker type independently

Suppose:

```text
Customer Worker       → 100 requests/min
Opportunity Worker    → 50 requests/min
Incident Worker       → 500 requests/min
```

I might scale:

```text
Customer Worker       → 2 replicas
Opportunity Worker    → 1 replica
Incident Worker       → 10 replicas
```

The numbers are illustrative; I would determine the actual values through load testing.

---

## 3. Queue-based scaling

For asynchronous Workers, I prefer:

```text
Delegator
    ↓
Service Bus / Queue
    ↓
┌──────┬──────┬──────┐
W1     W2     W3
```

If queue depth increases:

```text
Queue depth ↑
     ↓
More Worker replicas
     ↓
Queue drains
```

This is particularly useful for long-running operations.

---

## 4. Control concurrency

Scaling Workers doesn't mean unlimited calls to the downstream system.

For example:

```text
Incident Workers × 20
        ↓
Concurrency limit = 5
        ↓
MCP
        ↓
ServiceNow
```

The other tasks remain queued rather than overwhelming ServiceNow.

This is important because the **downstream dependency can become the real bottleneck**.

---

## 5. MCP calls should be scalable and resilient

Each Worker uses MCP rather than directly embedding Salesforce/ServiceNow integration.

```text
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Enterprise API
```

When scaling Workers, I also need to consider:

* MCP connection limits
* MCP server capacity
* downstream API rate limits
* timeout limits
* retries
* circuit breakers
* connection pools

---

## 6. LLM-based Workers

Some Workers may make multiple LLM calls.

For example:

```text
Customer Worker
     ↓
LLM
     ↓
RAG
     ↓
MCP
```

Scaling the Worker does **not** automatically mean the LLM can handle unlimited traffic.

I monitor:

* Requests/minute
* Tokens/minute
* 429 rate
* LLM latency
* Token consumption
* Cost
* Concurrent LLM calls

Then I apply rate limiting, batching, caching where appropriate, and model-specific scaling strategies.

---

## 7. Stateless Workers

Workers should ideally be stateless at runtime.

```text
Worker-1 ─┐
Worker-2 ─┼──→ Durable state
Worker-3 ─┘
```

If Worker-1 fails:

```text
Worker-1 ❌
    ↓
Queue / checkpoint
    ↓
Worker-2
    ↓
Resume task
```

The workflow state should not disappear with the Worker process.

---

## 8. Idempotency is critical

When Workers scale horizontally, duplicate execution can happen.

Example:

```text
Incident Worker-1
       ↓
Create ServiceNow ticket
       ↓
Request succeeds
       ↓
Worker crashes before acknowledgment
       ↓
Queue redelivers
       ↓
Incident Worker-2
```

Without idempotency, you could create **two tickets**.

So I use:

```text
workflow_id
task_id
event_id
idempotency_key
```

and durable deduplication.

---

## 9. Autoscaling signals

I wouldn't use CPU alone.

For Workers, I would monitor:

| Metric             | Why                 |
| ------------------ | ------------------- |
| Queue depth        | Work waiting        |
| Active tasks       | Current concurrency |
| Requests/sec       | Traffic             |
| P95/P99 latency    | User experience     |
| Worker error rate  | Reliability         |
| Retry rate         | Dependency health   |
| MCP latency        | Tool performance    |
| LLM latency        | Model bottleneck    |
| Token rate         | LLM capacity        |
| Downstream 429/5xx | Enterprise capacity |

Example:

```text
Queue depth ↑
P95 latency ↑
       ↓
Scale Worker replicas ↑
```

---

## 10. Scale based on capability

This is especially important in your CWD architecture.

```text
Sales Delegator
    │
    ├── Customer Worker × 5
    └── Opportunity Worker × 2

IT Delegator
    │
    ├── Incident Worker × 10
    └── Service Worker × 3
```

If Incident workload increases, I scale **Incident Worker only**.

I don't need to scale Customer, Opportunity, or Service Workers.

---

## Azure example

For CWD on Azure:

```text
                Delegator
                    ↓
              Service Bus
                    ↓
          ┌─────────┼─────────┐
          ↓         ↓         ↓
        Worker    Worker    Worker
          ↓         ↓         ↓
        MCP       MCP       MCP
          ↓         ↓         ↓
     Salesforce ServiceNow Search
```

Workers can run as containers on **AKS or Azure Container Apps**, with autoscaling based on queue depth, active tasks, latency, and resource utilization.

---

## Interview-ready answer

> **“I would scale Workers horizontally and independently by capability. For example, if the Incident Worker has higher traffic than the Customer Worker, I scale only the Incident Worker. For asynchronous workloads, I use Service Bus or another queue and scale Worker consumers based on queue depth and active tasks. I also enforce concurrency limits because Worker capacity must respect downstream limits such as Salesforce, ServiceNow, MCP, and LLM rate limits. Workers should be stateless with durable checkpoints, and idempotency is important so retries or duplicate messages don't create duplicate transactions.”**

### Strong interview line

> **“I don't scale Workers blindly based on CPU. I scale each Worker according to workload, queue depth, latency, and—most importantly—the capacity of the dependency it calls.”**

### Easy memory

**Independent Workers → Horizontal replicas → Queue → Autoscale → Concurrency limit → Dependency limits → Idempotency → Checkpoint/recover.**
