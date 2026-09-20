In **CWD**, I prevent infinite agent loops by combining **LangGraph graph controls, deterministic policies, iteration limits, tool-call limits, timeouts, and state-based termination conditions**.

The key principle is:

> **The LLM can propose the next action, but deterministic controls decide whether it is allowed to continue.**

### 1. Set a maximum iteration limit

For example:

```python
MAX_ITERATIONS = 10
```

State tracks:

```python
{
    "iteration_count": 7
}
```

Before another agent/tool call:

```python
if state["iteration_count"] >= MAX_ITERATIONS:
    return "terminate"
```

So even if the LLM keeps requesting another action, the workflow stops.

---

### 2. Define explicit termination conditions

CWD should have clear end states.

For example:

```text
Agent execution
      ↓
Did we get required results?
      ├── YES → Validate → Aggregate → END
      │
      └── NO
           ↓
       Can continue?
       ├── YES → next Worker/tool
       └── NO → failure/partial result → END
```

For Customer Briefing:

```text
Profile Worker → SUCCESS
Support Worker → SUCCESS
Contract Worker → SUCCESS
        ↓
Required results available
        ↓
Aggregate
        ↓
Generate response
        ↓
END
```

The agent doesn't decide to keep working after the completion criteria are satisfied.

---

### 3. Limit tool calls

An agent could theoretically do:

```text
LLM → Tool
LLM → Tool
LLM → Tool
LLM → Tool
...
```

So we track:

```python
state["tool_call_count"]
```

and enforce:

```python
if tool_call_count >= MAX_TOOL_CALLS:
    terminate()
```

We can also have **per-Worker and per-run limits**.

---

### 4. Detect repeated actions

Suppose the agent repeatedly calls:

```text
ServiceNow(customer_id=C123)
ServiceNow(customer_id=C123)
ServiceNow(customer_id=C123)
```

without making progress.

We can track execution signatures:

```python
(
    worker_name,
    tool_name,
    input_hash
)
```

If the same action repeats beyond an allowed threshold:

```text
Repeated action detected
        ↓
Stop loop
        ↓
Return controlled failure/partial result
```

---

### 5. Use LangGraph conditional edges

This is especially useful in CWD.

Instead of allowing an agent to freely call itself:

```text
Agent → Agent → Agent → Agent ...
```

we define controlled graph transitions:

```text
execute_worker
      ↓
check_completion
   ├── complete → aggregate
   ├── retryable → retry
   ├── needs_next_worker → next_worker
   └── max_iterations → terminate
```

The graph itself defines the valid execution paths.

---

### 6. Separate retries from agent loops

This is an important interview distinction.

A **retry** is controlled:

```text
Worker fails
 ↓
Retry 1
 ↓
Retry 2
 ↓
Retry 3
 ↓
STOP
```

An **agent loop** is something like:

```text
Reason
 ↓
Tool
 ↓
Reason
 ↓
Tool
 ↓
Reason
 ↓
Tool
 ↓
...
```

So I control both independently:

```text
Retry limit
+
Iteration limit
+
Tool-call limit
+
Timeout
+
Termination condition
```

---

### 7. Use timeouts and overall execution budgets

Even if the agent stays within its iteration limit, individual calls can consume too much time.

For example:

```text
Maximum workflow time = 60 seconds
Maximum Worker time   = 10 seconds
Maximum LLM call      = 15 seconds
```

If the overall deadline is exceeded:

```text
Deadline exceeded
       ↓
Stop execution
       ↓
Persist state
       ↓
Return controlled result
```

---

### 8. Use token and cost budgets

Agent loops can also cause **token and cost explosion**.

We can track:

```python
{
    "iteration_count": 6,
    "tool_call_count": 12,
    "input_tokens": 18000,
    "output_tokens": 7000,
    "estimated_cost": 0.42
}
```

Then enforce budgets:

```text
Token budget exceeded → terminate
Cost budget exceeded  → terminate
Tool budget exceeded  → terminate
```

---

### 9. Prevent recursive agent calls

In your CWD hierarchy:

```text
Coordinator
   ↓
Delegator
   ↓
Worker
```

I would **not** allow arbitrary recursion such as:

```text
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
...
```

Agent-to-agent calls should be controlled through **A2A contracts and routing policies**.

For example:

```text
Allowed:
Coordinator → SalesDelegator
SalesDelegator → Worker

Not automatically allowed:
Worker → Coordinator → SalesDelegator → Worker
```

If agent-to-agent recursion is required for a specific workflow, we still enforce depth and iteration limits.

---

## Production controls

| Control                       | Purpose                          |
| ----------------------------- | -------------------------------- |
| **Max iterations**            | Prevent reasoning loops          |
| **Max tool calls**            | Prevent excessive tool execution |
| **Max recursion depth**       | Prevent agent-to-agent recursion |
| **Timeout/deadline**          | Prevent indefinite execution     |
| **Token budget**              | Control LLM usage                |
| **Cost budget**               | Control spend                    |
| **Repeated-action detection** | Detect no-progress loops         |
| **Conditional edges**         | Control valid workflow paths     |
| **Completion criteria**       | Define when workflow should stop |
| **Retry limit**               | Prevent endless retries          |
| **Circuit breaker**           | Stop calls to unhealthy services |



> **“In CWD, I prevent infinite agent loops by not giving the LLM unrestricted control over the workflow. LangGraph defines the allowed execution paths, while deterministic policies enforce maximum iterations, tool-call limits, recursion depth, timeouts, token and cost budgets. We also define explicit completion criteria and detect repeated actions that aren't making progress. Retries are separately bounded. If any execution budget is exceeded, we persist the current state and terminate with a controlled failure or partial result.”**

### One line to memorize

> **“I prevent agent loops using bounded iterations, tool-call and recursion limits, timeouts, token/cost budgets, explicit termination conditions, and deterministic LangGraph routing.”**
