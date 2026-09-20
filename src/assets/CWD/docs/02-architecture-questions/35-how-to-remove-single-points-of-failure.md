In your **CWD architecture**, I would remove or reduce single points of failure by using **redundancy, horizontal scaling, durable state, retries, failover, and graceful degradation**.

### 1. Coordinator — multiple instances

Instead of:

```text
User → Coordinator
```

use:

```text
                    Load Balancer
                   /             \
                  ↓               ↓
          Coordinator-1    Coordinator-2
                  \               /
                   ↓             ↓
                    Shared State
```

If Coordinator-1 fails, new requests go to Coordinator-2.

**Key design:** Keep the Coordinator as stateless as practical and store workflow state externally.

---

### 2. Delegators — multiple replicas

```text
Coordinator
     ↓
 Load Balancer
   /       \
  ↓         ↓
Delegator-1 Delegator-2
```

If one Delegator instance fails, another instance handles the request.

For example, your **Sales Delegator** could have multiple replicas.

---

### 3. Workers — don't depend on one instance

For Workers:

```text
Salesforce Worker
       ↓
   Worker Pool
 ┌─────┼─────┐
 ↓     ↓     ↓
 W1    W2    W3
```

Use multiple Worker instances and distribute work between them.

If one Worker instance fails:

```text
W1 ❌
 ↓
Retry / another replica
 ↓
W2 ✅
```

---

### 4. Worker failure — retry + timeout + circuit breaker

Suppose:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → FAILURE
```

Don't let W3 block forever.

Use:

```text
W3
 ↓
Timeout
 ↓
Retry
 ↓
Retry
 ↓
Circuit Breaker / DLQ
```

If W3 is **optional**, continue with partial results.

If W3 is **mandatory**, mark the workflow as incomplete and resume after recovery.

---

### 5. LLM — model/provider fallback

Your Coordinator may depend heavily on an LLM.

Instead of:

```text
Coordinator → One LLM Endpoint
```

use a fallback strategy:

```text
                ┌→ Primary LLM
Coordinator ────┤
                └→ Fallback LLM
```

For example:

```text
Primary model
     ↓
Timeout / unavailable
     ↓
Fallback model
```

Use this carefully because different models may have different capabilities and output quality.

---

### 6. MCP Server — multiple instances

Don't make one MCP server instance the only path to a critical tool.

```text
Worker
   ↓
MCP Load Balancer
   ├── MCP-1
   ├── MCP-2
   └── MCP-3
        ↓
   Enterprise APIs
```

If MCP-1 fails, traffic can go to MCP-2 or MCP-3.

---

### 7. Salesforce / ServiceNow — graceful degradation

External systems are often outside your direct control.

For example:

```text
Salesforce ❌
     ↓
Retry
     ↓
Timeout
     ↓
Partial result / fallback
```

If Salesforce is unavailable but ServiceNow is available:

```text
Salesforce Worker → ❌
ServiceNow Worker → ✅

        ↓

Partial Customer Briefing
```

**Only do this when the business rules permit partial results.**

---

### 8. Redis — don't make cache the source of truth

If Redis fails:

```text
Redis ❌
   ↓
Durable Store
   ↓
Recover state
```

For your architecture, Redis should generally be used for **fast access/cache/active state**, while durable state should have a persistent backing store such as Cosmos DB.

Use replication/failover for Redis itself.

---

### 9. Cosmos DB / persistent state

For durable workflow state:

```text
CWD
 ↓
Cosmos DB
 ↓
Replicated durable storage
```

The important architectural principle is:

> **Don't keep the only copy of workflow state inside a Coordinator or Worker process.**

Otherwise, when the process dies, the workflow state disappears.

---

### 10. Service Bus — retries + DLQ

For asynchronous processing:

```text
Producer
   ↓
Service Bus
   ↓
Consumer
   ↓
Failure
   ↓
Retry
   ↓
DLQ
```

This prevents a temporary Worker failure from losing the message.

---

## Overall HA design

Your CWD can look like:

```text
                         Users
                           │
                    Load Balancer
                           │
                ┌──────────┴──────────┐
                ↓                     ↓
          Coordinator-1        Coordinator-2
                │                     │
                └──────────┬──────────┘
                           ↓
                    Shared State
                 Redis + Cosmos DB
                           │
                    ┌──────┴──────┐
                    ↓             ↓
             Sales Delegator   IT Delegator
                    │             │
              ┌─────┴─────┐   ┌──┴──────┐
              ↓           ↓   ↓         ↓
          Worker-1    Worker-2 W3       W4
              │           │     │         │
              └─────┬─────┘     └────┬────┘
                    ↓                ↓
               MCP Cluster       MCP Cluster
                    │                │
                    ↓                ↓
              Enterprise Systems
```

And alongside the workflow:

```text
Failures
   ↓
Retry → Timeout → Circuit Breaker → DLQ
```

### Strong interview answer

> **“I would remove single points of failure through redundancy at every critical layer. The Coordinator and Delegators would run as multiple stateless replicas behind a load balancer. Workers would run as scalable pools rather than single instances. Workflow state would be persisted externally so another instance can resume a failed workflow. For transient failures, I would use retries, exponential backoff, timeouts, and circuit breakers. MCP services would also be deployed redundantly. For external dependencies such as Salesforce and ServiceNow, I would use graceful degradation and partial-result handling where the business rules allow it. For asynchronous processing, Service Bus with retries and a Dead-Letter Queue prevents message loss. Finally, Redis would be treated as a cache or fast state layer rather than the only durable source of truth.”**

### The architect-level principle

Remember this sequence:

**Redundancy → Failover → Retry → Timeout → Circuit Breaker → Durable State → Graceful Degradation**

And don't claim that redundancy makes the system **“failure-proof.”** The goal is:

> **“A single component failure should not cause an unacceptable system-wide outage or loss of workflow state.”**
