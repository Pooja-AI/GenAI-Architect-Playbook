## How would you design multi-region CWD?

For CWD, I would design **active-active for stateless services** and use **durable, replicated state** for workflow recovery.

The main goal is: **if Region 1 fails, traffic can move to Region 2 without losing an in-progress workflow.**

```text
                         Global Traffic Manager
                                  |
                    ┌─────────────┴─────────────┐
                    ↓                           ↓
              Region 1                     Region 2
              US-East                      US-West
                    |                           |
              ┌─────┴─────┐               ┌─────┴─────┐
              ↓             ↓               ↓             ↓
         Coordinator    Delegators      Coordinator    Delegators
              ↓             ↓               ↓             ↓
           Workers        MCP            Workers        MCP
              |             |               |             |
              └──────┬──────┘               └──────┬──────┘
                     ↓                              ↓
                  Regional                      Regional
                  Services                       Services
```

### 1. Global traffic routing

I would put a global routing layer in front, such as **Azure Front Door**.

It can route users to the appropriate healthy region.

```text
User
 ↓
Azure Front Door
 ↓
Healthy Region
```

Routing can consider:

* Region health
* Latency
* Availability
* Geographic requirements
* Maintenance

If Region 1 becomes unhealthy:

```text
Region 1 ❌
     ↓
Front Door
     ↓
Region 2 ✅
```

---

### 2. Coordinator should be stateless

I would run multiple Coordinator instances in **each region**.

```text
Region 1
Coordinator-1
Coordinator-2
Coordinator-3

Region 2
Coordinator-1
Coordinator-2
Coordinator-3
```

The Coordinator itself should not hold critical workflow state in local memory.

Instead:

```text
Coordinator
    ↓
Durable workflow state
    ↓
Checkpoint
```

That is critical for failover.

---

### 3. Persist LangGraph checkpoints

Suppose Customer Briefing is running:

```text
Coordinator
   ↓
Sales Delegator
   ├── Customer Worker ✅
   └── Opportunity Worker ✅
   ↓
IT Delegator
   └── Incident Worker ⏳
```

The workflow state is checkpointed.

If Region 1 fails:

```text
Region 1 ❌
     ↓
Region 2
     ↓
Load workflow_id
     ↓
Read checkpoint
     ↓
Resume Incident Worker
```

I don't restart the entire workflow unnecessarily.

### Strong interview line

> **"The compute is replaceable; the workflow state is durable."**

---

## 4. Multi-region database strategy

For critical state, I would use a database with multi-region replication.

For example:

```text
Region 1 DB  ←→  Region 2 DB
```

The exact consistency model depends on the data.

### Strong consistency

Use where correctness is critical, such as:

* Workflow ownership
* Idempotency records
* Transaction state
* Authorization-related state

### Eventual consistency

Can be acceptable for:

* Analytics
* Metrics
* Non-critical caches
* Some read models

I would **not automatically make every piece of data strongly consistent**, because that can increase latency and cross-region coordination.

---

## 5. Redis should not be the only source of truth

For CWD:

```text
Durable DB
   ↓
Source of truth

Redis
   ↓
Cache / fast state / short-lived coordination
```

If Redis in Region 1 disappears, I should be able to reconstruct critical workflow state from durable storage.

---

## 6. Delegators and Workers

I would deploy Delegators and Workers in every active region.

```text
Region 1
Coordinator
   ↓
Sales Delegator
   ↓
Customer Worker
Incident Worker

Region 2
Coordinator
   ↓
Sales Delegator
   ↓
Customer Worker
Incident Worker
```

They should be as **stateless as practical**.

Long-running state is persisted externally.

---

## 7. MCP architecture

MCP servers should also be region-aware.

```text
Region 1
Salesforce MCP
ServiceNow MCP
SharePoint MCP

Region 2
Salesforce MCP
ServiceNow MCP
SharePoint MCP
```

But there is an important consideration:

> **Not every enterprise dependency is automatically multi-region.**

For example, Salesforce or ServiceNow may have their own availability architecture.

Therefore, I would understand their supported failover model before claiming that CWD is fully multi-region.

---

## 8. Avoid duplicate writes during failover

This is one of the most important interview questions.

Imagine:

```text
Region 1
Worker → Salesforce
       ↓
Request sent
       ↓
Region crashes before response
```

Region 2 doesn't know whether the write succeeded.

If it blindly retries:

```text
Region 2
Worker → Salesforce
```

we could create a duplicate transaction.

So I use:

### Idempotency keys

```text
tenant_id + workflow_id + task_id + operation
```

or a dedicated transaction ID.

```text
operation_id = OP-98765
```

The downstream operation checks whether `OP-98765` has already been processed.

### Strong interview line

> **"In multi-region failover, I assume an ambiguous write may have succeeded. I use idempotency keys so replaying the task is safe."**

---

## 9. Regional queues

For long-running/asynchronous work, I would use regional queues.

```text
Region 1
Service Bus
   ↓
Workers

Region 2
Service Bus
   ↓
Workers
```

For disaster recovery, messages should be replicated or recoverable according to the required RPO/RTO.

The important point is:

> **A queue should not become a single-region single point of failure.**

---

## 10. Tenant-aware regional routing

For enterprise CWD, I might also maintain a **preferred region** per tenant.

```text
Tenant A → US-East
Tenant B → US-West
```

But the routing policy must also consider:

* Region health
* Data residency
* Compliance
* Latency
* Capacity

If Tenant A's preferred region is unavailable:

```text
Tenant A
   ↓
US-East ❌
   ↓
Approved US-West
```

Only if the tenant's data and compliance policies allow it.

---

## 11. RAG / vector search

I would maintain regional search infrastructure.

```text
Region 1
Azure AI Search
   ↑
Regional index

Region 2
Azure AI Search
   ↑
Regional index
```

The indexes should be synchronized from a common source of truth.

I would track:

* Index version
* Document version
* ACL metadata
* Embedding version
* Last successful synchronization

This prevents Region 2 from serving an outdated or incorrectly authorized document.

---

## 12. Observability across regions

Every request should carry:

```text
trace_id
correlation_id
tenant_id
workflow_id
task_id
region
```

Then I can see:

```text
TR-9001

Region: US-East
Coordinator
  ↓
Sales Delegator
  ↓
Customer Worker
  ↓
Salesforce MCP
```

If failover occurs:

```text
TR-9001

US-East
  ↓
failure

US-West
  ↓
resume from checkpoint
```

This makes troubleshooting much easier.

---

# CWD failover example

Suppose Customer Briefing is executing:

```text
US-East

Coordinator
   ↓
Sales Delegator
   ├── Customer Worker ✅
   └── Opportunity Worker ✅
   ↓
IT Delegator
   └── Incident Worker ⏳
```

Region 1 suddenly fails.

```text
US-East ❌
    ↓
Azure Front Door
    ↓
US-West
    ↓
New Coordinator
    ↓
workflow_id = WF-1001
    ↓
Load checkpoint
    ↓
Customer Worker → already completed
Opportunity Worker → already completed
Incident Worker → resume/retry
    ↓
Aggregate
```

So we **don't rerun successful work unnecessarily**.

---

# Active-active vs active-passive

For CWD, I would generally prefer:

### Active-active

```text
Region 1 → serving traffic
Region 2 → serving traffic
```

Advantages:

* Better resource utilization
* Lower failover time
* Both regions continuously tested
* Better availability

But it requires more complexity around:

* State replication
* Data consistency
* Idempotency
* Routing
* Queue management

### Active-passive

```text
Region 1 → active
Region 2 → standby
```

Simpler, but standby capacity may be underutilized and failover can take longer.

The choice should be driven by **RTO/RPO, cost, compliance, and consistency requirements**, rather than assuming active-active is always necessary.

---

## Interview-ready answer

> **"For CWD, I would deploy the stateless Coordinator, Delegators, Workers, and MCP services across at least two regions behind a global traffic manager such as Azure Front Door. I would keep critical LangGraph workflow state and checkpoints in a multi-region durable data store so another region can resume an interrupted workflow. I would use regional queues and replicated search indexes, and propagate tenant, workflow, task, and correlation IDs across regions. For write operations, I would use idempotency keys because during failover we may not know whether the original write succeeded. I would also make tenant routing aware of data residency and compliance requirements. The key principle is that compute can fail over, but durable workflow state and business correctness must survive the failover."**

### Easy memory

**Global routing → Regional compute → Durable state → Replicated data → Idempotent writes → Resume from checkpoint → Cross-region observability.**
