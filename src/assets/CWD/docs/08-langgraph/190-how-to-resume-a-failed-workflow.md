## How do you resume a failed workflow in LangGraph?

In your **CWD architecture**, we use **checkpointing + a workflow/thread ID + retry/resume logic** to continue a failed workflow without unnecessarily restarting completed work.

### CWD example

Suppose Customer Briefing requires three Workers:

```text
Coordinator
    ↓
Sales Delegator
    ├── W1 Customer Worker → SUCCESS
    └── W2 Opportunity Worker → SUCCESS

IT Delegator
    └── W3 Incident Worker → FAILED
```

The workflow has a checkpoint containing the progress:

```text
thread_id = CWD-C12345-001

W1 = completed
W2 = completed
W3 = failed
customer_id = C12345
```

---

## 1. Persist the workflow state

We compile the graph with a checkpointer:

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()

app = graph.compile(
    checkpointer=checkpointer
)
```

In production, use a durable persistence backend rather than `InMemorySaver`.

---

## 2. Use a stable thread ID

```python
config = {
    "configurable": {
        "thread_id": "CWD-C12345-001"
    }
}
```

This identifies the particular workflow execution.

```text
CWD-C12345-001
       ↓
Customer Briefing workflow
       ↓
Checkpoint 1
Checkpoint 2
Checkpoint 3
```

---

## 3. Detect the failure

For example:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → TIMEOUT
```

The workflow records the failure:

```python
{
    "completed_workers": ["W1", "W2"],
    "failed_workers": ["W3"],
    "errors": [
        {
            "worker": "W3",
            "error": "ServiceNow timeout"
        }
    ]
}
```

---

## 4. Retry the failed operation

If the failure is transient:

```text
W3
 ↓
Retry
 ↓
ServiceNow
 ↓
SUCCESS
```

If retries are exhausted, the workflow can move to a recovery/HITL/DLQ path.

---

## 5. Resume from the checkpoint

Once the failure is resolved, use the same workflow/thread context to continue.

Conceptually:

```text
Load checkpoint
      ↓
Restore CWD state
      ↓
Resume W3
      ↓
Validate
      ↓
Aggregate W1 + W2 + W3
      ↓
Final Customer Briefing
```

The key idea is:

> **Use the same workflow identity and persisted state; don't create a brand-new workflow with an empty state.**

---

# Example with LangGraph

A simplified pattern:

```python
config = {
    "configurable": {
        "thread_id": "CWD-C12345-001"
    }
}

# Initial execution
result = app.invoke(
    {
        "customer_id": "C12345",
        "intent": "customer_briefing"
    },
    config
)
```

If the workflow is interrupted/paused, you can resume using the same `config` and appropriate resume command/input.

For example, with an interrupt-based workflow:

```python
from langgraph.types import Command

result = app.invoke(
    Command(resume="approved"),
    config
)
```

For a failure, the exact resume mechanism depends on **where the graph stopped and how the failure/retry path was designed**. In many production designs, the failed node is routed through a retry/recovery node rather than blindly replaying the whole graph.

---

# What happens to completed Workers?

This is the important part.

Suppose:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → FAILURE
```

We don't want:

```text
Resume
 ↓
W1 again
 ↓
W2 again
 ↓
W3
```

Instead:

```text
Checkpoint
 ↓
W1 already completed
W2 already completed
W3 failed
 ↓
Retry/Resume W3
 ↓
Aggregate
```

This is why **checkpointing** is valuable.

---

# But what about external side effects?

Suppose W3 does:

```text
Worker
 ↓
MCP
 ↓
ServiceNow CREATE ticket
 ↓
Success
 ↓
Response lost
```

The Worker may think it failed even though ServiceNow created the ticket.

If we simply resume and execute the create operation again:

```text
CREATE ticket
CREATE ticket
```

we could create duplicates.

Therefore, for state-changing operations, use:

```text
Checkpointing
+
Idempotency key
+
Transaction/correlation ID
```

Example:

```python
{
    "customer_id": "C12345",
    "operation": "create_incident",
    "idempotency_key": "CWD-C12345-W3"
}
```

---

# CWD production recovery flow

```text
                    ┌───────────────┐
                    │   Checkpoint  │
                    └───────┬───────┘
                            ↓
Coordinator → Delegator → Worker
                            ↓
                           MCP
                            ↓
                       Enterprise API
                            ↓
                         FAILURE
                            ↓
                  Is failure retryable?
                     ↙             ↘
                   YES              NO
                    ↓                ↓
                  Retry         Recovery/HITL
                    ↓
                Success?
                ↙      ↘
              YES       NO
               ↓         ↓
          Continue     DLQ/Fallback
               ↓
           Aggregate
```

---

## Interview-ready answer

> **“We resume a failed LangGraph workflow using the persisted checkpoint and the same workflow or thread ID. In our CWD example, if W1 and W2 complete but W3 fails, the checkpoint preserves the completed state. We retry or recover W3 and then continue to the validation and aggregation steps instead of restarting the entire workflow. For production, we combine checkpointing with durable persistence, bounded retries, idempotency for external write operations, and DLQ or human intervention when recovery isn't possible.”**

### Easy memory

**Detect failure → Load checkpoint → Retry failed work → Resume → Validate → Aggregate**

And the senior-level distinction:

> **Checkpointing tells us where to resume; retry logic determines how to recover; idempotency prevents duplicate external actions.**
