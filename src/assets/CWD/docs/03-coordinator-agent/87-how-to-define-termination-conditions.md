In **CWD**, termination conditions are **deterministic rules that define when the Coordinator/Delegator workflow has achieved its required outcome or can no longer make useful progress**.

The important point is:

> **The LLM can suggest that the task is complete, but the application validates completion against deterministic conditions before ending the graph.**

### 1. Define success criteria for the workflow

For each workflow, we define what must be completed.

For **Customer Briefing**:

```text
Required:
  CustomerProfileWorker → SUCCESS
  ContractWorker        → SUCCESS

Optional:
  SupportHistoryWorker  → SUCCESS / FAILED

Then:
  Validate results
  → Aggregate
  → Generate response
  → END
```

So the termination condition isn't simply:

> “The LLM says I'm done.”

It's:

```python
def is_complete(state):
    return (
        state["customer_profile_status"] == "SUCCESS"
        and state["contract_status"] == "SUCCESS"
    )
```

---

### 2. Check mandatory vs optional Workers

This is very important in your CWD architecture.

Suppose:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → SUCCESS
SupportHistoryWorker  → FAILED
```

If SupportHistory is **optional**:

```text
Required workers complete
        ↓
Accept partial result
        ↓
Aggregate
        ↓
END
```

If Contract is **mandatory** and fails:

```text
Mandatory Worker failed
        ↓
Retry/recovery
        ↓
Retry exhausted
        ↓
Workflow = INCOMPLETE
        ↓
END
```

So termination can mean either:

* **SUCCESS**
* **PARTIAL_SUCCESS**
* **FAILED**
* **INCOMPLETE**

---

### 3. Define explicit LangGraph routing

For example:

```text
                 validate_results
                       |
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      COMPLETE      RETRYABLE    BLOCKED
          ↓            ↓            ↓
      aggregate       retry       failure
          ↓            ↓            ↓
         END        validate       END
                       |
                       ↓
                    success
```

Conceptually:

```python
def route_after_validation(state):
    if state["mandatory_failed"]:
        return "failure"

    if state["all_required_complete"]:
        return "aggregate"

    if state["retryable_failure"]:
        return "retry"

    return "failure"
```

LangGraph's conditional edge then determines the next node.

---

### 4. Use safety limits as termination conditions

Even if the workflow hasn't completed successfully, we must stop it when execution limits are reached.

For example:

```python
MAX_ITERATIONS = 10
MAX_TOOL_CALLS = 20
MAX_EXECUTION_TIME = 60
```

Then:

```python
if state["iteration_count"] >= MAX_ITERATIONS:
    return "terminate"

if state["tool_call_count"] >= MAX_TOOL_CALLS:
    return "terminate"

if elapsed_time >= MAX_EXECUTION_TIME:
    return "terminate"
```

These are **safety termination conditions**.

---

### 5. Detect no-progress loops

Consider:

```text
Worker A
 ↓
LLM
 ↓
Worker A
 ↓
LLM
 ↓
Worker A
```

If the same action keeps happening without changing the state, we terminate.

For example:

```python
if state["same_action_count"] >= 3:
    return "terminate"
```

We can track:

```text
last_action
action_count
state_change
progress
```

This prevents an agent from repeatedly doing the same thing.

---

### 6. Define failure termination

Some conditions should immediately stop execution.

For example:

```text
Unauthorized request
Invalid customer ID
Unsupported intent
Required Delegator unavailable
Security policy violation
Non-retryable Worker failure
```

Example:

```text
User request
    ↓
Authorization check
    ↓
DENIED
    ↓
STOP
```

We don't retry an authorization failure.

---

### 7. Define human-in-the-loop termination/pause

For sensitive operations:

```text
Agent proposes action
        ↓
Human approval required
        ↓
Pause workflow
        ↓
Wait for approval
        ↓
Resume OR terminate
```

For example, if a Worker wants to perform a destructive enterprise operation, the workflow can terminate or pause until approval.

---

## Where do we define these conditions?

I would define them at **two levels**:

### Workflow policy

Business/application rules:

```python
WORKFLOW_POLICY = {
    "CustomerBriefing": {
        "mandatory_workers": [
            "CustomerProfileWorker",
            "ContractWorker"
        ],
        "optional_workers": [
            "SupportHistoryWorker"
        ],
        "max_iterations": 10,
        "max_tool_calls": 20,
        "timeout_seconds": 60
    }
}
```

### LangGraph routing

LangGraph implements the state transitions:

```python
workflow.add_conditional_edges(
    "validate_results",
    route_after_validation,
    {
        "aggregate": "aggregate_results",
        "retry": "retry_worker",
        "failure": "failure_handler",
        "terminate": "finalize"
    }
)
```

So:

```text
Business Policy
      ↓
Defines termination rules
      ↓
LangGraph
      ↓
Evaluates current state
      ↓
Chooses next node
```

---

## Very important interview distinction

Don't say:

> “The LLM decides when to stop.”

Better:

> **“The LLM can propose completion, but deterministic workflow conditions decide whether the graph is actually allowed to terminate.”**

For example, the LLM might say:

```text
"I have enough information."
```

But CWD checks:

```text
CustomerProfile → SUCCESS ✓
Contract        → SUCCESS ✓
SupportHistory  → FAILED
                 ↓
Is SupportHistory mandatory?
                 ↓
NO
                 ↓
Complete
```

Only then does the graph terminate.



> **“In CWD, I define termination conditions as deterministic workflow policies. First, I define the business completion criteria—for example, all mandatory Workers must complete successfully, while optional Workers can fail with a partial-result warning. Then LangGraph evaluates the current state through conditional edges and routes to aggregation or failure. We also have safety termination conditions such as maximum iterations, tool-call limits, execution deadlines, recursion depth, and token or cost budgets. Non-retryable failures and security violations terminate immediately. The LLM can propose completion, but deterministic policy and workflow state make the final termination decision.”**

**One line to memorize:**

> **“Termination = business completion criteria + failure conditions + safety limits, evaluated deterministically from the LangGraph state.”**
