## How does LangGraph support state persistence?

**LangGraph supports state persistence through checkpointers.** A checkpointer saves the graph's state at different points in the workflow so the workflow can **resume after failure, interruption, or a later request**.

### Simple idea

```text
Graph State
     ↓
Checkpoint
     ↓
Persistent Storage
     ↓
Failure / Restart
     ↓
Load Checkpoint
     ↓
Resume Workflow
```

In your **CWD architecture**, this is important because the workflow can involve multiple Delegators and Workers.

---

## CWD example

Suppose Customer Briefing requires:

```text
Coordinator
    ↓
 ┌───────────────┐
 ↓               ↓
Sales           IT
 ↓               ↓
W1              W3
W2              W4
```

Assume:

```text
Sales Workers → SUCCESS
IT Worker W3  → SUCCESS
IT Worker W4  → FAILURE
```

LangGraph can persist the workflow state/checkpoints.

```text
Checkpoint
{
    customer_id: "C12345",
    sales_result: "...",
    w3_result: "...",
    completed_workers: ["W1", "W2", "W3"],
    failed_workers: ["W4"]
}
```

After W4 is fixed, you can **resume from the persisted workflow state rather than starting the entire Customer Briefing from the beginning**.

---

# How does it work?

### 1. Define your graph state

```python
from typing import TypedDict

class CWDState(TypedDict):
    customer_id: str
    worker_results: list
    errors: list
```

### 2. Configure a checkpointer

For example, conceptually:

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()

app = graph.compile(
    checkpointer=checkpointer
)
```

For production, you would use a **durable checkpointer/storage backend** rather than relying on in-memory state.

---

### 3. Use a thread/workflow ID

```python
config = {
    "configurable": {
        "thread_id": "CWD-C12345-001"
    }
}

result = app.invoke(
    {
        "customer_id": "C12345",
        "worker_results": [],
        "errors": []
    },
    config
)
```

The `thread_id` identifies the workflow execution whose state should be persisted and later recovered.

Think of it as:

```text
thread_id
    ↓
CWD workflow
    ↓
multiple graph steps
    ↓
checkpoints
```

---

# Where is the state stored?

There are two concepts to distinguish:

### LangGraph checkpointer

Responsible for saving/restoring **graph execution state and checkpoints**.

### External application database

You may also use something like:

```text
Azure Cosmos DB
Redis
PostgreSQL
DynamoDB
```

for broader application data such as:

* Customer/session metadata
* Business results
* Audit records
* Task status
* Long-term application state

So don't say:

> "Redis is LangGraph's checkpointer."

Instead say:

> **"LangGraph uses a checkpointer for workflow-state persistence, and in our production architecture we can back persistence with a durable database appropriate to our deployment."**

---

# Checkpoint vs Graph State

This is a common interview question.

### Graph State

What the workflow currently knows:

```text
customer_id
intent
worker_results
errors
status
```

### Checkpoint

A **persisted snapshot of that state at a point in the workflow**.

```text
State
 ↓
Checkpoint
 ↓
Storage
```

Easy way to remember:

> **State = current workflow information**
> **Checkpoint = saved snapshot of that state**

---

# What happens after failure?

Example:

```text
Coordinator
    ↓
Sales Delegator ── SUCCESS
    ↓
IT Delegator
    ↓
W1 ── SUCCESS
W2 ── SUCCESS
W3 ── FAILURE
```

Checkpoint contains the successful progress.

After recovery:

```text
Load Checkpoint
      ↓
Resume
      ↓
Retry W3
      ↓
Validate
      ↓
Aggregate
      ↓
Final Response
```

This prevents unnecessary re-execution of already completed work, assuming the workflow is designed with appropriate checkpoint/retry boundaries and idempotent operations.

---

# Persistence + CWD architecture

A production flow could look like:

```text
User
 ↓
Coordinator
 ↓
LangGraph
 ↓
Checkpoint
 ↓
Durable Storage
 ↓
Delegators
 ↓
Workers
 ↓
MCP
 ↓
Enterprise Systems
```

For example:

```text
LangGraph Checkpointer
        ↓
   Cosmos DB
        ↓
workflow state
task state
checkpoint state
```

Separately:

```text
MCP Audit Logs
      ↓
Log Analytics
```

and:

```text
LLM / Agent traces
      ↓
Langfuse / Application Insights
```

These solve different problems.

---

## Interview-ready answer

> **“LangGraph supports state persistence through checkpointers. The checkpointer saves snapshots of the graph state during workflow execution, associated with a workflow or thread identifier. In our CWD architecture, if the Customer Briefing workflow completes some Workers but another Worker fails, we can persist the successful progress and resume from the appropriate checkpoint instead of restarting the entire workflow. For production, we use durable persistence rather than relying only on in-memory state, and we keep workflow state separate from business data, audit logs, and observability data.”**

### Easy memory

**State → current data**
**Checkpoint → saved state**
**Checkpointer → saves/restores checkpoints**
**Thread ID → identifies the workflow execution**
**Resume → continue from persisted progress**
