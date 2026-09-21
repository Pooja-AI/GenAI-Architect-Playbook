## How would you scale MCP Servers?

In CWD, I would scale MCP servers **horizontally and by capability**, because MCP is the tool-access layer between Workers and enterprise systems.

```text
                  Worker
                    ↓
                MCP Client
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
   MCP Salesforce       MCP ServiceNow
    Server Pool          Server Pool
     ┌──┼──┐              ┌──┼──┐
     ↓  ↓  ↓              ↓  ↓  ↓
    M1  M2  M3            M1  M2  M3
     ↓                     ↓
 Salesforce             ServiceNow
```

### 1. Horizontal scaling

Instead of one MCP server:

```text
MCP Server × 1
```

run multiple replicas:

```text
MCP Server × 5
```

A load balancer/service-discovery layer distributes MCP requests across healthy instances.

If one instance fails:

```text
MCP-1 ❌
   ↓
MCP-2 / MCP-3 / MCP-4
   ↓
Continue serving requests
```

---

## 2. Scale MCP servers by capability

I would **not put every enterprise tool into one giant MCP server**.

For example:

```text
MCP Platform
│
├── Salesforce MCP
│    ├── get_customer
│    ├── get_opportunity
│    └── update_customer
│
├── ServiceNow MCP
│    ├── get_incidents
│    ├── create_incident
│    └── update_incident
│
└── SharePoint MCP
     ├── search_documents
     └── get_document
```

Then each MCP server pool can scale independently.

If Salesforce receives heavy traffic:

```text
Salesforce MCP × 10
ServiceNow MCP × 3
SharePoint MCP × 2
```

Illustrative numbers only—the actual capacity comes from load testing and downstream limits.

---

## 3. Don't let MCP scaling overwhelm the enterprise system

This is one of the **most important interview points**.

Suppose I have:

```text
20 MCP replicas
   ↓
100 Workers
   ↓
10,000 requests
   ↓
Salesforce
```

Scaling MCP doesn't mean Salesforce can handle 10,000 concurrent requests.

So I enforce:

```text
Workers
   ↓
MCP Server Pool
   ↓
Concurrency / rate limit
   ↓
Salesforce
```

For example:

```text
1000 incoming requests
       ↓
MCP concurrency limit = 50
       ↓
Salesforce
```

The remaining requests can wait in a queue when the operation is asynchronous.

**The downstream system is often the real bottleneck.**

---

## 4. Connection pooling

MCP servers should efficiently manage connections to enterprise APIs.

Instead of:

```text
Every request
    ↓
Create connection
    ↓
API call
    ↓
Destroy connection
```

use:

```text
MCP Server
    ↓
Connection Pool
 ┌──┼──┼──┐
 C1 C2 C3 C4
    ↓
Enterprise API
```

This reduces connection setup overhead and improves throughput.

---

## 5. Stateless MCP servers where possible

I prefer MCP servers to be stateless for request processing.

```text
MCP-1 ─┐
MCP-2 ─┼──→ Shared / durable state where required
MCP-3 ─┘
```

That allows replicas to be added or removed without losing important workflow state.

Authentication and authorization should also be evaluated for **every tool invocation**, rather than trusting that a request reached a particular replica.

---

## 6. Circuit breakers

Suppose ServiceNow starts returning 503s:

```text
MCP
 ↓
ServiceNow ❌
```

After repeated failures:

```text
Circuit OPEN
     ↓
Stop sending unnecessary requests
     ↓
Protect MCP + ServiceNow
```

After a cooldown:

```text
HALF-OPEN
    ↓
Test request
    ↓
Success → CLOSED
Failure → OPEN
```

This prevents an unhealthy dependency from causing a retry storm.

---

## 7. Bounded retries

MCP should retry only **transient failures**.

```text
Timeout / 503 / 429
       ↓
Retry
       ↓
Exponential backoff + jitter
       ↓
Retry limit
       ↓
Fail / queue / fallback
```

I would not retry:

* 401
* 403
* invalid parameters
* schema validation failures
* security authorization failures
* business-rule failures

---

## 8. Idempotency for write tools

This becomes critical when MCP tools perform writes.

Example:

```text
Worker
 ↓
MCP → create_incident
 ↓
ServiceNow creates INC-1001
 ↓
Response is lost
 ↓
Worker retries
```

Without idempotency, we could create:

```text
INC-1001
INC-1002  ❌ duplicate
```

Instead:

```text
idempotency_key = CWD-5001:TASK-101:create_incident
```

The second request returns the existing transaction/result rather than creating another ticket.

---

## 9. Autoscaling

For MCP servers, I would monitor:

* Requests/sec
* Active tool calls
* P95/P99 tool latency
* CPU/memory
* Connection pool utilization
* Queue depth
* 429/5xx rates
* Timeout rate
* Downstream API latency
* Downstream throttling

Then:

```text
Tool traffic ↑
      +
P95 latency ↑
      ↓
Scale MCP replicas ↑
```

But if the downstream system is already throttling:

```text
Salesforce 429 ↑
      ↓
Don't blindly add MCP replicas
      ↓
Reduce concurrency / apply backpressure
```

**Scaling upstream cannot fix a downstream capacity limit.**

---

## 10. MCP Server vs MCP Client scaling

This distinction is useful in interviews.

```text
Worker
  │
  │ MCP Client
  ↓
MCP Server
  ↓
Enterprise Tool
```

* **MCP Client** is usually part of the Worker/agent runtime and scales with Worker instances.
* **MCP Server** is an independent tool gateway/service and can have its own replica pool.
* **Enterprise system** has its own limits.

So scaling must be coordinated across all three.

---

## Example: Salesforce in CWD

Suppose Customer Workers increase:

```text
Customer Worker × 20
        ↓
MCP Client
        ↓
Salesforce MCP × 5
        ↓
Concurrency limit
        ↓
Salesforce API
```

If Salesforce becomes the bottleneck, I don't simply scale Salesforce MCP from 5 → 20.

Instead I might:

1. Apply concurrency limits.
2. Respect Salesforce rate limits.
3. Cache approved read-only data where appropriate.
4. Queue asynchronous operations.
5. Use circuit breakers.
6. Optimize unnecessary API calls.
7. Scale MCP only when MCP itself is the bottleneck.

---

## Azure CWD implementation

A typical deployment could look like:

```text
                    Workers
                       ↓
                  MCP Clients
                       ↓
                 MCP Service
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
      Salesforce MCP       ServiceNow MCP
        Container Pool       Container Pool
             ↓                   ↓
       Salesforce API       ServiceNow API
```

The MCP services could run as containerized workloads on **AKS or Azure Container Apps**, with health probes, autoscaling, centralized telemetry, and controlled concurrency.

---

## How do I know MCP is actually the bottleneck?

Use distributed tracing:

```text
Trace: CWD-5001

Incident Worker       5.2 sec
   ↓
MCP Client             0.1 sec
   ↓
MCP Server              0.2 sec
   ↓
ServiceNow API          4.7 sec  ← bottleneck
```

In this case, **scaling MCP servers won't solve the main latency problem**. ServiceNow is the bottleneck.

But if tracing shows:

```text
Incident Worker       5.2 sec
   ↓
MCP Client             0.1 sec
   ↓
MCP Server              4.5 sec  ← bottleneck
   ↓
ServiceNow API          0.6 sec
```

then MCP infrastructure itself is a candidate for scaling/optimization.

---

## Interview-ready answer

> **“I would scale MCP servers horizontally and by capability. For example, Salesforce MCP and ServiceNow MCP would have independent replica pools and scaling policies. I would keep MCP servers stateless where possible, use connection pooling, health checks, autoscaling, bounded retries, circuit breakers, and concurrency limits. Most importantly, I would protect downstream systems from being overwhelmed by enforcing rate limits and backpressure. For write operations, I would use idempotency keys. I would use distributed tracing to determine whether MCP itself or the downstream enterprise system is the actual bottleneck before scaling.”**

### Strong interview line

> **“MCP should scale independently, but I never scale MCP blindly—the downstream enterprise system ultimately determines how much traffic I can safely send.”**

### Easy memory

**Horizontal replicas → Capability-based pools → Connection pooling → Rate/concurrency limits → Retry → Circuit breaker → Idempotency → Autoscale → Trace the real bottleneck.**
