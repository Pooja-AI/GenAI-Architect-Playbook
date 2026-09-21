## How would you design Disaster Recovery for CWD?

For CWD, I would design DR around **RTO, RPO, durable workflow state, multi-region failover, and replay**.

The most important principle is:

> **I don't just recover the infrastructure; I recover the workflow safely from its last durable checkpoint.**

### 1. Define RTO and RPO first

Before choosing the DR architecture:

* **RTO** = how quickly CWD must recover.
* **RPO** = how much data/work we can afford to lose.

Example:

```text
RTO = 15 minutes
RPO = near-zero for critical workflow state
```

These are example targets; actual values should come from business requirements.

---

## 2. Use multi-region deployment

```text id="l8xqjv"
                  Global Traffic Manager
                         /       \
                        /         \
                 Region 1       Region 2
                 Primary        DR/Secondary
                    |               |
              Coordinator      Coordinator
              Delegators        Delegators
              Workers           Workers
              MCP              MCP
                    \             /
                     \           /
                  Durable State
```

For higher availability, both regions can be **active-active**.

For simpler DR, Region 1 can be active and Region 2 warm standby.

---

## 3. Make workflow state durable

This is probably the **most important part for CWD**.

LangGraph checkpoints should not exist only in Coordinator memory.

```text id="u5fk3v"
Coordinator
     ↓
LangGraph checkpoint
     ↓
Durable database
```

Example checkpoint:

```json id="m2j5qa"
{
  "workflow_id": "WF-1001",
  "tenant_id": "T001",
  "completed_tasks": [
    "customer_worker",
    "opportunity_worker"
  ],
  "pending_tasks": [
    "incident_worker"
  ],
  "status": "PARTIALLY_COMPLETED"
}
```

If Region 1 fails, Region 2 loads this checkpoint.

---

## 4. Don't rerun completed Workers

Suppose:

```text id="9pq0k1"
Customer Worker       ✅
Opportunity Worker    ✅
Incident Worker       ❌
```

After disaster recovery:

```text id="v2d6gz"
Region 2
   ↓
Load checkpoint
   ↓
Skip Customer Worker
Skip Opportunity Worker
   ↓
Resume Incident Worker
```

This reduces duplicate work and LLM/tool costs.

---

## 5. Use idempotency for writes

The dangerous case is an ambiguous failure:

```text id="x4h7ye"
Worker
  ↓
Salesforce write
  ↓
SUCCESS
  ↓
Network failure
  ↓
Worker never receives response
```

CWD doesn't know whether Salesforce committed the transaction.

If DR blindly retries, it could create a duplicate.

So every write should have an idempotency key:

```text id="c7j3pa"
tenant_id + workflow_id + task_id + operation_id
```

For example:

```text
operation_id = OP-12345
```

The downstream system or integration layer checks whether that operation has already been processed.

---

## 6. Back up critical data

I would classify data by importance.

### Critical

* Workflow state
* LangGraph checkpoints
* Task status
* Idempotency records
* Configuration
* Agent/Prompt versions
* Security policies

### Recoverable / rebuildable

* Search indexes
* Embedding indexes
* Caches
* Analytics data

For example:

```text id="5kzq0m"
Primary data
     ↓
Replication / backup
     ↓
DR region
```

Caches such as Redis should **not be the only source of truth** for critical workflow state.

---

## 7. Protect queues

CWD may use Service Bus for asynchronous work:

```text id="g9txa7"
Worker
  ↓
Service Bus
  ↓
MCP
```

For DR, I need to ensure messages are recoverable and that a regional failure doesn't permanently lose work.

I would use:

* Durable queues
* DLQ
* Message IDs
* Idempotent consumers
* Replay capability
* Appropriate cross-region recovery strategy

---

## 8. Disaster recovery of MCP

MCP services should also have regional instances:

```text id="s8y3kq"
Region 1
Salesforce MCP
ServiceNow MCP

Region 2
Salesforce MCP
ServiceNow MCP
```

If Region 1 MCP fails:

```text id="6j1zfd"
Worker
 ↓
MCP Region 1 ❌
 ↓
MCP Region 2
```

But I would verify that the downstream system itself supports the required failover model.

---

## 9. RAG recovery

For CWD's enterprise RAG:

```text id="y7e5mn"
Enterprise Source
       ↓
Canonical data
       ↓
Embedding pipeline
       ↓
Regional indexes
```

The source data should be the recovery authority.

If the vector index is lost:

```text id="x5v8cz"
Lost Search Index
       ↓
Rebuild from source
       ↓
Re-embed
       ↓
Re-index
```

I would track:

```text
document_version
content_hash
embedding_version
index_version
ACL_metadata
```

so I can verify the rebuilt index.

---

## 10. Secrets and configuration

I would not depend on manually recreated configuration after a disaster.

Use:

* Key Vault for secrets
* Managed Identity
* Infrastructure as Code
* Version-controlled application configuration
* Versioned prompts/agent definitions
* Automated deployment pipelines

So the DR environment can be recreated consistently.

---

## 11. Observability during DR

Every event should include:

```text id="2k3r9p"
trace_id
correlation_id
tenant_id
workflow_id
task_id
region
```

During failover:

```text id="5i9k2a"
WF-1001

Region 1
   ↓
FAILURE
   ↓
Region 2
   ↓
CHECKPOINT LOADED
   ↓
WORKFLOW RESUMED
```

I can trace exactly what happened before and after the disaster.

---

# Example: CWD region failure

Customer Briefing is running:

```text id="v0gqj6"
Region 1

Coordinator
   ↓
Sales Delegator
   ├── Customer Worker ✅
   └── Opportunity Worker ✅
   ↓
IT Delegator
   └── Incident Worker ⏳
```

Suddenly Region 1 goes down.

### DR flow

```text id="k4b0p8"
Region 1 ❌
    ↓
Global traffic manager
    ↓
Region 2
    ↓
New Coordinator
    ↓
Load WF-1001 checkpoint
    ↓
Validate task states
    ↓
Customer Worker       → SKIP ✅
Opportunity Worker    → SKIP ✅
Incident Worker       → RESUME
    ↓
Coordinator aggregates
    ↓
Return Customer Briefing
```

If Incident Worker's previous MCP call was ambiguous, I first check the **idempotency/transaction status** before retrying the operation.

---

# DR testing is critical

I would not consider DR complete just because backups exist.

I would regularly perform:

* Region failure tests
* Database restore tests
* Queue recovery tests
* Checkpoint recovery tests
* MCP failover tests
* RAG/index rebuild tests
* Secret/configuration recovery
* Idempotency/replay tests
* Full workflow recovery tests

This is essentially **DR game-day / disaster-recovery drills**.

---

## Interview-ready answer

> **"For CWD disaster recovery, I start with business-defined RTO and RPO. I deploy the Coordinator, Delegators, Workers, and MCP services across multiple regions and use global traffic management for failover. The critical part is making LangGraph workflow state and checkpoints durable and recoverable, so a new Coordinator can resume an interrupted workflow instead of restarting it. I use replicated backups for critical data, durable queues with DLQ and replay, and idempotency keys for writes because a failure can leave us uncertain whether a downstream transaction succeeded. Search indexes and caches are treated as rebuildable where appropriate. Finally, I regularly test regional failure, checkpoint recovery, queue replay, database restore, and end-to-end workflow recovery rather than assuming that having backups means DR works."**

### Easy memory

**RTO/RPO → Multi-region → Durable checkpoint → Backup/replicate → Idempotency → Queue/DLQ → Failover → Resume → Test**

And the strongest CWD-specific line:

> **"My DR strategy is not to restart the workflow; it's to recover the durable workflow state and resume safely from the last successful checkpoint."**
