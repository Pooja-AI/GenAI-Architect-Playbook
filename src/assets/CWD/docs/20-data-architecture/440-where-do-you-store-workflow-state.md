## Where do you store workflow state?

In CWD, **workflow state is the execution state of the Coordinator → Delegator → Worker workflow**.

Because workflow state is required for **failure recovery, checkpointing, retry, replay, and resume**, I store the authoritative state in **durable storage**.

For your Azure CWD architecture:

```text
Coordinator
     ↓
LangGraph
     ↓
Checkpointer
     ↓
Cosmos DB  ← durable workflow state
     ↑
Redis      ← optional fast/temporary state
```

### 1. What do I store?

For example:

```json
{
  "workflow_id": "WF-1001",
  "tenant_id": "T001",
  "intent": "customer_briefing",
  "customer_id": "C12345",
  "status": "PARTIALLY_COMPLETED",

  "completed_tasks": [
    "customer_worker",
    "opportunity_worker"
  ],

  "pending_tasks": [
    "incident_worker"
  ],

  "failed_tasks": [],

  "retry_count": 0,
  "current_node": "incident_worker"
}
```

This tells the Coordinator exactly **where the workflow stopped**.

---

### 2. Why use a durable store?

Suppose:

```text
Customer Worker      ✓
Opportunity Worker   ✓
Incident Worker      ⏳
```

Then the Coordinator crashes.

Without persisted state:

```text
Coordinator restart
       ↓
Start everything again ❌
```

With persisted state:

```text
Coordinator restart
       ↓
Load WF-1001
       ↓
Customer Worker       ✓ already done
Opportunity Worker    ✓ already done
Incident Worker       ⏳ pending
       ↓
Resume Incident Worker
```

This avoids unnecessary duplicate work.

---

### 3. LangGraph checkpointer

Because CWD uses LangGraph, I use its **checkpointer mechanism** to persist graph execution state.

Conceptually:

```python
workflow = graph.compile(
    checkpointer=checkpointer
)
```

Then the workflow is associated with a `thread_id` / workflow identifier.

```text
thread_id = WF-1001
```

At important graph transitions, the state can be checkpointed.

---

### 4. What does the checkpoint contain?

Typically, the state contains things like:

```text
workflow_id
current_node
intent
entities
completed_workers
pending_workers
worker_results/references
retry information
workflow status
timestamps
error information
```

I avoid putting unnecessary large documents or sensitive payloads into the checkpoint.

Instead:

```text
Checkpoint
   ↓
result_reference
   ↓
Actual data
   ↓
System of record / appropriate storage
```

This keeps workflow state smaller and cheaper.

---

### 5. Redis vs Cosmos DB

This is an important interview distinction.

| Storage                     | Purpose                                     |
| --------------------------- | ------------------------------------------- |
| **Cosmos DB**               | Durable workflow state / recovery           |
| **Redis**                   | Fast cache / temporary state / coordination |
| **LangGraph Checkpointer**  | Persists graph execution state              |
| **Salesforce / ServiceNow** | Business system of record                   |

I would **not** make Redis the only copy of critical workflow state.

---

### 6. Workflow state enables partial recovery

Suppose:

```text
Sales Delegator
 ├── Customer Worker ✓
 └── Opportunity Worker ✓

IT Delegator
 └── Incident Worker ❌
```

The checkpoint records:

```text
completed = [
  Customer Worker,
  Opportunity Worker
]

failed = [
  Incident Worker
]
```

After fixing the ServiceNow/MCP problem:

```text
Replay WF-1001
       ↓
Load checkpoint
       ↓
Skip completed Workers
       ↓
Retry Incident Worker
       ↓
Aggregate results
       ↓
Complete workflow
```

This is one of the most important reasons workflow state must be durable.

---

## 🎯 Interview-ready answer

> **“In CWD, I store workflow state using LangGraph's checkpointer backed by durable storage such as Cosmos DB. The workflow state contains the workflow ID, current graph node, intent, entities, completed and pending Workers, task status, retry information, errors, and references to results. I checkpoint the workflow at important execution boundaries so if the Coordinator or a Worker fails, the new Coordinator can load the checkpoint and resume from the last successful state instead of restarting the entire workflow. Redis can be used for low-latency temporary state or caching, but I don't use it as the sole source of truth for critical workflow state.”**

### Easy memory

**LangGraph → Checkpointer → Cosmos DB → Recover → Resume**

> **Strong architect line:**
> **“The Coordinator is replaceable; the workflow state is durable.”**
