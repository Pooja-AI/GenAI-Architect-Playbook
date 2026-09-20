## How do you debug a LangGraph workflow?

I debug a LangGraph workflow by tracing **state → node → edge → tool/agent call → result → next state**.

For CWD, I don't just look at the final error. I identify **where the workflow diverged from the expected path**.

### 1. First, trace the workflow

```text
User Request
     ↓
Coordinator Node
     ↓
Conditional Routing
     ↓
 ┌───────────────┐
 ↓               ↓
Sales           IT
Delegator       Delegator
 ↓               ↓
Workers         Workers
 ↓               ↓
MCP             MCP
 ↓               ↓
Salesforce      ServiceNow
 └───────┬───────┘
         ↓
     Aggregation
         ↓
       Final
```

I check:

* Which node executed?
* Which node was expected?
* What state entered the node?
* What state did the node return?
* Which edge was selected?
* Did the Worker/tool call succeed?
* Did the workflow stop, retry, or loop?

---

## 2. Inspect the LangGraph state

Suppose the Coordinator should route a Customer Briefing request to Sales and IT.

I inspect:

```python
print(state)
```

Expected:

```python
{
    "intent": "customer_briefing",
    "customer_id": "C12345",
    "delegators": ["sales", "it"],
    "worker_results": [],
    "errors": []
}
```

If I see:

```python
{
    "intent": "unknown",
    "customer_id": None
}
```

then the problem is probably **before routing**, such as intent/entity extraction.

---

## 3. Debug node execution

I add structured logs around important nodes.

```python
def sales_delegator(state):

    logger.info(
        "Starting sales delegator",
        extra={
            "workflow_id": state["workflow_id"],
            "customer_id": state["customer_id"]
        }
    )

    result = call_sales_worker(state["customer_id"])

    logger.info(
        "Sales delegator completed",
        extra={"result": result}
    )

    return {
        "worker_results": [result]
    }
```

I want every node to have:

```text
workflow_id
correlation_id
task_id
node_name
agent_id
start_time
end_time
status
error
```

---

## 4. Debug conditional edges

A very common problem is incorrect routing.

```python
def route_request(state):

    print("Intent:", state["intent"])

    if state["intent"] == "customer_briefing":
        return ["sales", "it"]

    if state["intent"] == "incident":
        return ["it"]

    return ["error"]
```

I verify:

```text
Intent
  ↓
Routing function
  ↓
Expected Delegator?
  ↓
Actual Delegator?
```

For example:

```text
Expected:
customer_briefing → Sales + IT

Actual:
customer_briefing → IT only
```

Then I know the problem is in the routing logic rather than Salesforce or ServiceNow.

---

## 5. Debug parallel execution and reducers

In CWD, Sales and IT may run in parallel.

```text
Coordinator
   ├── Sales Delegator ──→ result
   │
   └── IT Delegator ─────→ result
              ↓
          Aggregator
```

If the aggregator receives only one result, I check the state reducer.

For example:

```python
class CWDState(TypedDict):
    worker_results: Annotated[list, operator.add]
```

Without proper state merging, parallel updates can overwrite each other instead of being combined.

So I check:

```text
Sales result ✓
IT result ✓
      ↓
Reducer
      ↓
worker_results
      ↓
Aggregator
```

---

## 6. Debug Worker → MCP failures

If the LangGraph node executed correctly but the Worker failed, I go deeper:

```text
LangGraph Node
     ↓
Worker
     ↓
MCP Client
     ↓
MCP Server
     ↓
Enterprise API
```

For example:

```text
Coordinator ✓
Sales Delegator ✓
Customer Worker ✓
MCP Client ✓
MCP Server ✓
Salesforce ✗ 401 Unauthorized
```

Now I know the LangGraph workflow itself is not the primary problem.

I investigate:

* authentication
* authorization
* tool parameters
* token expiration
* customer entitlement
* MCP server availability
* Salesforce API response

---

## 7. Use checkpoints for failed workflows

For long-running CWD workflows, I use checkpointing.

Example:

```text
Coordinator ✓
   ↓
Sales Worker ✓
   ↓ checkpoint
IT Worker ✗
```

After fixing the IT issue, I want to resume from the checkpoint rather than execute Salesforce again.

```text
checkpoint
   ↓
resume
   ↓
IT Worker
   ↓
Aggregation
```

This is especially important when Workers perform expensive or state-changing operations.

For state-changing operations, I also use **idempotency keys** so a retry doesn't create duplicate transactions.

---

## 8. Look for infinite loops

For example:

```text
Worker
 ↓
Validation
 ↓
Retry
 ↓
Worker
 ↓
Validation
 ↓
Retry
 ↓
...
```

I inspect:

* retry count
* loop condition
* timeout
* terminal condition

Example:

```python
if state["retry_count"] >= 3:
    return "failure_handler"

return "retry_worker"
```

Every loop needs a clear exit path.

---

## 9. Use distributed tracing

For production debugging, logs alone aren't enough.

I propagate:

```text
trace_id
correlation_id
task_id
workflow_id
```

Example:

```text
TR-9001
 │
 ├── Coordinator
 │
 ├── A2A → Sales Delegator
 │      └── Customer Worker
 │             └── MCP → Salesforce
 │
 └── A2A → IT Delegator
        └── Incident Worker
               └── MCP → ServiceNow
```

With OpenTelemetry/Application Insights/Langfuse, I can determine whether the problem is:

```text
LangGraph
   OR
A2A
   OR
Worker
   OR
MCP
   OR
Enterprise API
   OR
LLM
```

---

## 10. My debugging checklist

I generally follow this order:

```text
1. Reproduce the issue
        ↓
2. Check workflow state
        ↓
3. Check node execution
        ↓
4. Check conditional edges
        ↓
5. Check parallel branches/reducers
        ↓
6. Check Worker execution
        ↓
7. Check MCP/tool calls
        ↓
8. Check external API
        ↓
9. Check retries/checkpoints
        ↓
10. Check traces + logs + metrics
```

### Interview-ready answer

> **“I debug LangGraph workflows by tracing the complete execution path: state, node, edge, Worker, tool call, and resulting state. First I verify the graph state and routing decision, then I inspect individual node inputs and outputs. For parallel branches, I verify reducers and aggregation. If a Worker fails, I trace downstream into MCP and the enterprise API. For production issues, I use correlation IDs, task IDs, distributed tracing, structured logs, and metrics through OpenTelemetry, Application Insights, and Langfuse. For long-running workflows, I use checkpoints to resume from the last successful state instead of rerunning completed work.”**

### Easy memory

**Debug LangGraph = State → Node → Edge → Worker → MCP → API → Trace → Checkpoint.**
