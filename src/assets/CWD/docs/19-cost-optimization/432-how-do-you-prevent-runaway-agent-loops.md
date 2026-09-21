## How do you prevent runaway agent loops in CWD?

A **runaway agent loop** happens when an Agent/Worker keeps calling the LLM or tools repeatedly without reaching a valid completion state.

For example:

```text
Coordinator
   ↓
Worker
   ↓
LLM
   ↓
MCP → Salesforce
   ↓
LLM
   ↓
MCP → Salesforce
   ↓
LLM
   ↓
MCP → Salesforce
   ↓
... ❌
```

The main principle is:

> **Never allow an Agent to have unlimited iterations or unlimited tool calls.**

### 1. Set maximum iterations

In CWD, I set a limit on how many reasoning/agent iterations are allowed.

```python id="2tdp2d"
MAX_ITERATIONS = 5

if state["iterations"] >= MAX_ITERATIONS:
    return "MAX_ITERATIONS_EXCEEDED"
```

For example:

```text
Iteration 1 → Think → Tool
Iteration 2 → Think → Tool
Iteration 3 → Think → Tool
Iteration 4 → Think → Tool
Iteration 5 → Stop
```

The exact limit should be determined through testing for the particular workflow.

---

### 2. Limit tool calls

An agent might not loop through reasoning but repeatedly call the same MCP tool.

So I also maintain:

```text id="q8q8hx"
max_tool_calls = 10
```

Example:

```python id="x8m7af"
if state["tool_calls"] >= MAX_TOOL_CALLS:
    raise WorkflowLimitExceeded("Tool call limit reached")
```

This protects Salesforce, ServiceNow, SharePoint, etc.

---

### 3. Set a workflow timeout

Even if iteration limits aren't reached, the workflow should have an overall deadline.

```text id="b3j0xw"
Workflow starts
     ↓
30-second deadline
     ↓
Exceeded?
     ↓
Stop safely
```

For example:

```python id="h7x9s1"
asyncio.wait_for(
    run_workflow(),
    timeout=30
)
```

The actual timeout should be based on the CWD SLO and dependency behavior.

---

### 4. Detect repeated actions

Suppose the Worker keeps doing:

```text
get_customer(C12345)
get_customer(C12345)
get_customer(C12345)
get_customer(C12345)
```

I track a signature such as:

```text id="7b1v3q"
worker + tool + normalized_parameters
```

If the same operation is repeated beyond an allowed threshold:

```text
Repeated tool call detected
        ↓
Stop / replan / escalate
```

---

### 5. Define explicit termination conditions

The Agent should know what **success** looks like.

For example:

```text id="8p4y9h"
Customer Briefing
      ↓
Customer data ✓
Opportunity data ✓
Incident data ✓
      ↓
Validation ✓
      ↓
Aggregate ✓
      ↓
COMPLETED
```

Instead of allowing the LLM to decide indefinitely whether it should continue.

In LangGraph, I use **conditional edges** to determine whether the workflow should:

```text
continue
   OR
complete
   OR
retry
   OR
fail
   OR
HITL
```

---

### 6. Use state-based guards

CWD maintains workflow state such as:

```json id="g9r1fj"
{
  "iteration": 3,
  "tool_calls": 5,
  "completed_workers": [
    "customer_worker",
    "opportunity_worker"
  ],
  "pending_workers": [
    "incident_worker"
  ],
  "status": "RUNNING"
}
```

The next node checks these limits before continuing.

---

### 7. Prevent retry loops

Retries can themselves create runaway behavior.

Bad:

```text
Worker
 ↓
Failure
 ↓
Retry
 ↓
Failure
 ↓
Retry
 ↓
Failure
 ↓
Retry forever ❌
```

Instead:

```text
Failure
 ↓
Classify error
 ↓
Transient?
 ├── Yes → bounded retry
 └── No  → fail
```

For example:

```text
Attempt 1
Attempt 2
Attempt 3
   ↓
DLQ / structured failure / HITL
```

Use exponential backoff + jitter for transient failures.

---

### 8. Use circuit breakers

If ServiceNow is continuously failing:

```text id="w3s8k2"
Incident Worker
      ↓
MCP
      ↓
ServiceNow ❌
      ↓
Circuit Breaker OPEN
      ↓
Stop sending requests
```

This prevents the agent from repeatedly hammering the unhealthy dependency.

---

### 9. Monitor loop behavior

I monitor:

```text
Agent iterations
Tool calls / workflow
Repeated tool calls
LLM calls / workflow
Workflow duration
Retries
Timeouts
Token consumption
Cost / workflow
Task completion rate
```

With CWD tracing:

```text id="9c6y5v"
Trace: TR-1001
Coordinator
 └── IT Delegator
      └── Incident Worker
           ├── LLM #1
           ├── MCP #1
           ├── LLM #2
           ├── MCP #2
           ├── LLM #3
           └── ...
```

If I see an abnormal number of iterations or tool calls, I can identify the problematic Worker or prompt.

---

## How LangGraph helps

LangGraph is useful because I can explicitly control the workflow rather than allowing an unconstrained agent loop.

Conceptually:

```python id="k9qz8x"
def should_continue(state):

    if state["iterations"] >= 5:
        return "stop"

    if state["tool_calls"] >= 10:
        return "stop"

    if state["workflow_deadline_exceeded"]:
        return "timeout"

    if state["validation_passed"]:
        return "complete"

    return "continue"
```

Then:

```text
Worker
  ↓
Conditional Edge
 ├── Continue
 ├── Complete
 ├── Retry
 ├── Timeout
 └── HITL
```

---

## 🎯 Interview-ready answer

> **“I prevent runaway agent loops using multiple guardrails. In CWD, I set maximum agent iterations, maximum tool calls, and an overall workflow timeout. I also define explicit termination conditions in LangGraph using conditional edges, detect repeated tool calls using operation signatures, and limit retries with exponential backoff and jitter. If a downstream dependency such as ServiceNow repeatedly fails, I use a circuit breaker to stop additional calls. I persist the workflow state and monitor iterations, tool calls, retries, latency, token consumption, and cost through distributed tracing. If the limits are exceeded, I stop safely and return a structured failure or route to HITL rather than allowing the agent to continue indefinitely.”**

### Easy memory

**Iteration limit → Tool limit → Timeout → Termination condition → Retry limit → Duplicate detection → Circuit breaker → Monitor**

### Strong architect line

> **“I don't rely on the LLM to decide when to stop. The workflow engine enforces hard execution limits and deterministic termination conditions.”**
