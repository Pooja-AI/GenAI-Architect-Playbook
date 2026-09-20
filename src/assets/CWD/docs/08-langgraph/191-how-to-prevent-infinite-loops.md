## How do you prevent infinite loops in LangGraph?

In LangGraph, I prevent infinite loops by combining **bounded retry/loop counters, explicit exit conditions, timeouts, and failure handling**.

In your **CWD architecture**, this is especially important for retrying Workers, validation, and human-approval flows.

### Example: Worker retry loop

```text id="gcr7zv"
Worker
  ↓
Validate
  ↓
Failed?
  ├── No ──→ Aggregate
  │
  └── Yes
       ↓
    Retry?
       ↓
   Attempt < 3?
    ├── Yes → Worker
    └── No  → Failure Handler
```

The key is that **every loop must have a termination condition**.

---

### 1. Limit retry attempts

Maintain an attempt counter:

```python id="q4r6fa"
class CWDState(TypedDict):
    retry_count: int
    worker_results: list
    errors: list
```

Then:

```python id="5ayq1v"
def retry_route(state):
    if state["retry_count"] < 3:
        return "retry_worker"

    return "failure_handler"
```

So the workflow cannot retry forever.

```text
Attempt 1 → Retry
Attempt 2 → Retry
Attempt 3 → Retry
Attempt 4 → STOP
```

---

### 2. Use explicit termination conditions

For every conditional edge, define an exit path.

```python id="6d9f0d"
def validation_route(state):
    if state["validation_passed"]:
        return "aggregate"

    if state["retry_count"] >= 3:
        return "failure_handler"

    return "retry"
```

Never design:

```text
Validate → Retry → Validate → Retry → ...
```

without a terminating condition.

---

### 3. Use timeouts

Suppose an MCP call to ServiceNow hangs.

```text id="yqg0du"
Worker
 ↓
MCP
 ↓
ServiceNow
 ↓
Timeout
 ↓
Retry
```

Set a maximum timeout so the workflow doesn't remain stuck indefinitely.

For example:

```python id="x5pk6y"
try:
    result = await asyncio.wait_for(
        call_mcp_tool(),
        timeout=10
    )
except asyncio.TimeoutError:
    # Handle retry/failure
    ...
```

---

### 4. Limit the overall workflow

Retries might individually be bounded, but the entire workflow should also have an operational deadline.

Example:

```text id="k8z1ko"
Customer Briefing
       ↓
Maximum execution time = 5 minutes
       ↓
Timeout
       ↓
Recovery / HITL / Failure
```

This protects against unexpected loops across multiple nodes.

---

### 5. Prevent circular routing

Consider:

```text id="1qg6tq"
A → B → C → A → B → C → ...
```

This can happen if routing logic is poorly designed.

For example:

```python id="x5qv1m"
def route(state):
    if state["status"] == "retry":
        return "worker"

    if state["status"] == "completed":
        return "aggregate"

    return "failure"
```

The important thing is that state eventually moves toward a terminal condition:

```text
SUCCESS → Aggregate → END
FAILURE → Failure Handler → END
MAX RETRIES → END
```

---

### 6. Use recursion/step limits as a safety net

For complex agentic workflows, you can also configure execution limits so runaway graph execution is stopped rather than allowed to continue indefinitely.

Think:

```text
Normal termination
       ↓
END
```

or, as a safety mechanism:

```text
Unexpected repeated execution
       ↓
Execution limit reached
       ↓
Stop / investigate
```

This should be a **safety net**, not your primary loop-control mechanism.

---

## CWD example

Imagine the Incident Worker calls ServiceNow:

```text id="l4v4xq"
Coordinator
    ↓
IT Delegator
    ↓
Incident Worker
    ↓
MCP → ServiceNow
    ↓
Failure
    ↓
Retry
    ↓
MCP → ServiceNow
    ↓
Failure
    ↓
Retry
    ↓
MCP → ServiceNow
    ↓
Failure
    ↓
MAX RETRIES
    ↓
Failure Handler
    ↓
Coordinator
    ↓
Partial Result / HITL / DLQ
```

The workflow **does not return to the Worker indefinitely**.

---

## Important distinction: Retry vs Loop

**Retry** is controlled re-execution after a failure:

```text
Worker → failure → retry → Worker
```

**Loop** is repeated workflow routing:

```text
A → B → C → A
```

Both need termination conditions.

---

## Interview-ready answer

> **“I prevent infinite loops in LangGraph by making every loop bounded and explicitly terminating. For example, in CWD, if a Worker fails, I use a maximum retry count with exponential backoff. I also define explicit success and failure exit paths, apply timeouts to long-running operations, and enforce an overall workflow execution limit as a safety mechanism. If retries are exhausted, we route to a failure handler, DLQ, fallback, or HITL instead of looping indefinitely.”**

### Easy memory

**Max retries + Exit condition + Timeout + Execution limit + Failure path**

Or remember:

> **Every loop must answer: ‘When do I stop?’**
