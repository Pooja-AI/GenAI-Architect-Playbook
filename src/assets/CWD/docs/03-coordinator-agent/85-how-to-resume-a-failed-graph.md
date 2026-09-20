In **CWD**, we resume a failed LangGraph workflow from its **latest persisted checkpoint**, rather than starting the entire workflow from the beginning.

### 1. Example failure

Suppose the Customer Briefing workflow is:

```text
Coordinator
    ↓
SalesDelegator
    ↓
 ┌──────────────┬──────────────┬──────────────┐
 ↓              ↓              ↓
Profile       Support        Contract
Worker        Worker         Worker
SUCCESS       SUCCESS        FAILED
                              ↓
                           Timeout
```

The checkpoint contains:

```python
{
    "request_id": "REQ-123",
    "intent": "CustomerBriefing",
    "selected_delegator": "SalesDelegator",

    "worker_status": {
        "ProfileWorker": "SUCCESS",
        "SupportWorker": "SUCCESS",
        "ContractWorker": "FAILED"
    },

    "retry_counts": {
        "ContractWorker": 2
    },

    "current_step": "ContractWorker"
}
```

---

### 2. Persist the checkpoint

LangGraph maintains the graph state and uses a **checkpointer** to persist snapshots.

Conceptually:

```text
LangGraph
    ↓
Coordinator State
    ↓
Checkpoint
    ↓
Durable Store
    ↓
Cosmos DB / PostgreSQL / Redis
```

The important part is that the checkpoint is associated with a **workflow/thread/run ID**, so we can identify the specific execution to resume.

---

### 3. Resume using the same workflow ID

When the failure is recoverable, we resume the existing execution context.

Conceptually:

```python
config = {
    "configurable": {
        "thread_id": "REQ-123"
    }
}

# Resume the existing graph execution
graph.invoke(resume_input, config=config)
```

The exact resume API depends on the LangGraph version and whether you're resuming after an exception, interrupt, or explicit pause, but the architecture is the same: **load the persisted checkpoint and continue from the saved state**.

---

### 4. Successful Workers are not executed again

When the checkpoint is loaded:

```text
ProfileWorker  → SUCCESS → SKIP
SupportWorker  → SUCCESS → SKIP
ContractWorker → FAILED  → RETRY
```

So we don't unnecessarily call Salesforce or ServiceNow again.

This is especially important for Workers that have side effects.

---

### 5. Retry the failed Worker

The Delegator can retry `ContractWorker`:

```text
Checkpoint
    ↓
Load state
    ↓
Check Worker statuses
    ↓
ContractWorker = FAILED
    ↓
Retry policy
    ↓
ContractWorker
    ↓
SUCCESS
```

Then the state becomes:

```python
{
    "worker_status": {
        "ProfileWorker": "SUCCESS",
        "SupportWorker": "SUCCESS",
        "ContractWorker": "SUCCESS"
    },
    "final_status": "SUCCESS"
}
```

The graph then continues to:

```text
Validate Results
      ↓
Aggregate Results
      ↓
Generate Customer Briefing
      ↓
END
```

---

### 6. What if the process itself crashes?

This is where checkpointing becomes particularly valuable.

For example:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → RUNNING
      ↓
Application crashes
```

After restart:

```text
Load latest checkpoint
        ↓
Recover Coordinator state
        ↓
W1 = SUCCESS → don't rerun
W2 = SUCCESS → don't rerun
W3 = RUNNING/unfinished → recover according to policy
        ↓
Continue workflow
```

For Workers that perform external side effects, we also need **idempotency**, because a process could crash after the external operation succeeds but before CWD records the success.

---

### 7. If retry is exhausted

Suppose:

```text
ContractWorker
   ↓
Retry 1 → timeout
Retry 2 → timeout
Retry 3 → timeout
```

Then the workflow policy decides:

```text
Optional Worker
    → continue with partial result

Mandatory Worker
    → workflow remains incomplete/failed
```

The checkpoint is still retained so the workflow can be investigated or potentially recovered according to the application's recovery policy.

---

## Technologies in CWD

| Requirement          | CWD approach                   |
| -------------------- | ------------------------------ |
| Workflow             | **LangGraph**                  |
| Runtime state        | LangGraph State                |
| Persistence          | LangGraph Checkpointer         |
| Durable store        | Cosmos DB / PostgreSQL / Redis |
| Resume identity      | Thread/Run/Request ID          |
| Retry                | Delegator/Worker retry policy  |
| Duplicate protection | Idempotency                    |
| Monitoring           | App Insights / Log Analytics   |
| Distributed tracing  | OpenTelemetry / Langfuse       |



> **“In CWD, we resume a failed graph from the latest LangGraph checkpoint. Each workflow has a unique execution or thread ID, and the Coordinator state is persisted through a durable checkpointer. When the workflow needs to resume, we load that checkpoint, inspect the Worker statuses, skip Workers that already completed successfully, and retry or recover the failed or incomplete Worker according to the workflow policy. Once the failed Worker succeeds, LangGraph continues the graph to validation, aggregation, and final response. We also use idempotency to prevent duplicate side effects during recovery.”**

### One line to memorize

> **“Load the latest checkpoint, identify completed and failed work, skip successful Workers, recover the failed step, and continue the graph from the persisted state.”**
