# Understand Conditional Routing in LangGraph for CWD

**Conditional routing** is the mechanism that allows a LangGraph workflow to dynamically determine **which node should execute next based on the current state and execution outcome**.

In CWD, this is what transforms the workflow from a fixed sequence:

```text
A → B → C → D
```

into an adaptive execution graph:

```text
                  A
                  ↓
             Evaluate State
            /      |       \
           ↓       ↓        ↓
        Success   Retry    Recovery
           ↓       ↓        ↓
           B       A        END
```

> **Conditional routing = Evaluate current state → determine next valid path → transition to the appropriate node.**

---

# 1. Why Conditional Routing Is Important in CWD

A production CWD workflow cannot assume that every request follows the same path.

For example:

* One user may request a simple information lookup.
* Another may require multiple Delegators.
* A Worker may be unavailable.
* A tool may return an error.
* Authorization may be denied.
* A result may fail validation.
* Human approval may be required.
* A task may succeed immediately.
* A transient failure may require retry.

Therefore:

```text
User Request
     ↓
Same starting workflow
     ↓
State Evaluation
     ↓
Different execution paths
```

The graph adapts according to **runtime state**.

---

# 2. Basic Conditional Routing Model

Conceptually:

$$
NextNode = f(State)
$$

Where:

* `State` = current CWD execution context
* \(f\) = routing decision
* `NextNode` = node selected for the next execution step

For example:

```python
def route(state):

    if state["status"] == "success":
        return "aggregate"

    elif state["status"] == "retryable_failure":
        return "retry"

    elif state["status"] == "approval_required":
        return "human_review"

    else:
        return "recovery"
```

The graph then routes accordingly.

---

# 3. State Drives the Decision

Remember the three fundamental concepts:

```text
Node
 ↓
performs work

State
 ↓
contains execution context

Edge
 ↓
controls progression
```

Conditional routing combines them:

```text
                 Current State
                      ↓
                Routing Logic
                      ↓
             ┌────────┼────────┐
             ↓        ↓        ↓
          Node A    Node B    Node C
```

The routing logic does not perform the primary business operation.

It determines **which operation should happen next**.

---

# 4. Routing Based on User Intent

The first major routing decision can be based on user intent.

Suppose the user asks:

> "Show me last month's sales."

The intent may be:

```text
sales_lookup
```

Another request:

> "Why did sales decline?"

may produce:

```text
sales_analysis
```

The graph can route accordingly:

```text
                   Intent
                     ↓
             ┌───────┼────────┐
             ↓       ↓        ↓
       Sales Lookup Analysis  Forecast
             │       │        │
             ↓       ↓        ↓
          Worker   Delegator Worker
```

Conceptually:

```python
def route_by_intent(state):

    intent = state["intent"]

    if intent == "sales_lookup":
        return "lookup_workflow"

    if intent == "sales_analysis":
        return "analysis_delegator"

    if intent == "forecast":
        return "forecast_worker"
```

This allows the same Coordinator workflow to support multiple execution patterns.

---

# 5. Routing Based on Authorization State

Authorization is another critical routing point.

```text
Request
   ↓
Intent
   ↓
Authorization
   ↓
Evaluate
```

Possible outcomes:

```text
             Authorization
                  │
          ┌───────┴────────┐
          ↓                ↓
       Approved           Denied
          ↓                ↓
      Continue             END
```

State:

```json
{
  "authorization": {
    "approved": true
  }
}
```

could route to:

```text
Planning
```

while:

```json
{
  "authorization": {
    "approved": false
  }
}
```

routes to:

```text
Access Denied / END
```

This ensures authorization is part of the workflow path rather than an optional side operation.

---

# 6. Routing Based on Task Status

A task may have different states:

```text
PENDING
RUNNING
COMPLETED
FAILED
WAITING
CANCELLED
```

The graph can route based on these states.

```text
                 Task Status
                     ↓
        ┌────────────┼─────────────┐
        ↓            ↓             ↓
    COMPLETED      FAILED       WAITING
        ↓            ↓             ↓
    Aggregate      Recovery    Wait/Resume
```

For example:

```python
def task_router(state):

    status = state["task_status"]

    if status == "completed":
        return "aggregate"

    if status == "failed":
        return "recovery"

    if status == "waiting":
        return "wait"

    return "monitor"
```

---

# 7. Routing Based on Agent Decisions

The LLM may produce a decision that influences routing.

For example:

```text
User Request
     ↓
LLM Reasoning
     ↓
Recommended Plan
     ↓
State
     ↓
Conditional Router
```

The LLM might determine:

```json
{
  "required_domain": "finance"
}
```

The graph can then route:

```text
                  Domain
                    ↓
          ┌─────────┼─────────┐
          ↓         ↓         ↓
       Finance     Sales     HR
       Delegator  Delegator Delegator
```

But there is an important architectural principle:

> **An agent/LLM decision can recommend a route; runtime controls and policy determine whether that route is actually permitted.**

The LLM should not bypass authorization or governance.

---

# 8. Routing Based on Worker Availability

This is particularly important in production CWD.

Suppose the required capability is:

```text
sales_analysis
```

The Agent Registry reports:

```text
Worker A → healthy
Worker B → unavailable
Worker C → overloaded
```

The routing logic can select an available execution path:

```text
              Worker Selection
                     ↓
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       Worker A   Worker B   Worker C
        Healthy   Unavailable Overloaded
          ↓          X          ↓
       Execute     Skip      Defer/Retry
```

A dynamic routing decision might consider:

```text
Capability
Health
Availability
Current Load
Permissions
Version
Deadline
Priority
```

Thus:

```text
Worker unavailable
        ↓
Select another Worker
        ↓
Continue execution
```

instead of immediately failing the entire workflow.

---

# 9. Routing Based on Tool Results

Suppose a Worker calls an enterprise API through MCP.

```text
Worker
  ↓
Tool Invocation
  ↓
MCP
  ↓
Enterprise API
  ↓
Tool Result
```

The result might be:

```text
SUCCESS
NOT_FOUND
TIMEOUT
RATE_LIMITED
UNAUTHORIZED
SYSTEM_ERROR
```

The graph can route each outcome differently:

```text
                  Tool Result
                      ↓
           ┌──────────┼───────────┐
           ↓          ↓           ↓
        Success    Timeout     Unauthorized
           ↓          ↓           ↓
       Continue     Retry       Recovery
```

For example:

```python
def tool_result_router(state):

    result = state["tool_result"]

    if result["status"] == "success":
        return "validate"

    if result["status"] == "timeout":
        return "retry"

    if result["status"] == "unauthorized":
        return "stop"

    return "recovery"
```

---

# 10. Routing Based on Validation Outcome

Validation nodes are another major decision point.

```text
Worker Execution
       ↓
Output Validation
       ↓
      Result
```

Possible paths:

```text
                 Validation
                     ↓
          ┌──────────┼──────────┐
          ↓          ↓          ↓
        Valid      Invalid    Partial
          ↓          ↓          ↓
      Aggregate    Retry      Review
```

For example:

```python
if state["validation_status"] == "valid":
    return "aggregate"

elif state["validation_status"] == "invalid":
    return "retry"

elif state["validation_status"] == "partial":
    return "human_review"
```

This prevents invalid Worker output from automatically flowing into downstream processing.

---

# 11. Routing Based on Failure Conditions

Failure routing is one of the most important production capabilities.

Not every failure should be treated equally.

```text
                     Failure
                        ↓
                  Classify Error
                        │
       ┌────────────────┼─────────────────┐
       ↓                ↓                 ↓
   Retryable         Policy          Permanent
       ↓             Failure           Failure
     Retry              ↓                 ↓
       │               Stop            Recovery
       ↓
    Execute
```

For example:

| Failure                      | Routing               |
| ---------------------------- | --------------------- |
| Timeout                      | Retry                 |
| Temporary network failure    | Retry                 |
| Worker overloaded            | Reassign              |
| Worker unhealthy             | Select another Worker |
| Invalid output               | Retry/repair          |
| Authorization failure        | Stop                  |
| Policy violation             | Stop                  |
| Invalid request              | Return error          |
| Permanent dependency failure | Recovery              |

This gives CWD **failure-aware execution**.

---

# 12. Retry Routing

A retry itself is conditional.

```text
Worker
  ↓
Failure
  ↓
Is Retryable?
  ↓
Yes
  ↓
Retry Count < Maximum?
  │
 ┌┴─────────────┐
 ↓              ↓
Yes             No
 ↓              ↓
Retry         Recovery
```

State might contain:

```json
{
  "retry_count": 2,
  "max_retries": 3,
  "error_type": "timeout"
}
```

The routing decision becomes:

$$
Retry =
(error\_retryable)
\land
(retry\_count < max\_retries)
$$

This prevents infinite retry loops.

---

# 13. Routing Based on Deadline

Enterprise workflows often have deadlines.

For example:

```text
Task Deadline = 30 seconds
Elapsed Time = 28 seconds
```

The graph may decide:

```text
Continue expensive operation?
        ↓
      No
        ↓
Fallback / Partial Result
```

Conceptually:

```python
if remaining_time < minimum_required_time:
    return "fallback"
```

This prevents a workflow from spending unlimited time on one operation.

---

# 14. Routing Based on Human Approval

Some actions require human approval.

```text
Worker Recommendation
        ↓
Approval Required?
        ↓
       YES
        ↓
Human Review
```

Then:

```text
                 Human Decision
                 /            \
                ↓              ↓
            Approved         Rejected
                ↓              ↓
            Continue           END
```

The workflow can persist the state while waiting:

```text
status = "waiting_for_approval"
```

and resume when an authorized approval event arrives.

---

# 15. Routing to Downstream Processing

Conditional routing can determine which downstream processing stage is appropriate.

For example:

```text
Validated Result
      ↓
Determine Result Type
      │
 ┌────┼──────────┐
 ↓    ↓          ↓
Data Insight Recommendation Alert
 ↓    ↓          ↓
A      B          C
 └─────┼──────────┘
       ↓
   Aggregation
```

So downstream processing isn't necessarily one fixed path.

---

# 16. CWD Coordinator Conditional Routing

At the Coordinator level:

```text
                     Request
                        ↓
                      Intent
                        ↓
                  Authorization
                        ↓
                     Planning
                        ↓
                  Agent Discovery
                        ↓
                 Conditional Route
                  /      |       \
                 ↓       ↓        ↓
             Delegator  Worker   Human
                 A       Direct   Review
                 │
                 ↓
              Monitor
```

The Coordinator decides which execution model is appropriate.

For example:

```text
Simple task
   → Worker

Complex domain task
   → Delegator

Sensitive operation
   → Human approval
```

---

# 17. Delegator Conditional Routing

Inside a Delegator:

```text
Domain Task
    ↓
Decompose
    ↓
Worker Selection
    ↓
Worker Availability
    ↓
Conditional Route
     │
 ┌───┼────────┐
 ↓   ↓        ↓
A    B        C
│    │        │
Healthy Busy  Down
│    │        │
↓    ↓        ↓
Run Queue   Reassign
```

The Delegator therefore adapts execution to runtime Worker conditions.

---

# 18. Worker Conditional Routing

A complex Worker can have its own conditional flow:

```text
Receive Task
     ↓
Validate Input
     ↓
Retrieve Data
     ↓
Tool Selection
     ↓
Policy
     ↓
MCP
     ↓
Tool Result
     ↓
Validation
     │
 ┌───┼─────────┐
 ↓   ↓         ↓
OK  Retry    Failure
 ↓   ↓         ↓
Next Tool     Recovery
```

This allows even individual Workers to be resilient.

---

# 19. Conditional Routing and Shared State

The router makes decisions from the current state.

Example:

```json
{
  "intent": "sales_analysis",
  "authorization": {
    "approved": true
  },
  "worker_status": "unavailable",
  "retry_count": 1,
  "validation_status": "pending"
}
```

The router evaluates this state:

```text
                State
                  ↓
          Conditional Router
                  ↓
        Worker unavailable
                  ↓
           Select another
                  ↓
             Continue
```

After the state changes:

```json
{
  "worker_status": "completed"
}
```

the same graph can take another path:

```text
Completed
   ↓
Validation
   ↓
Aggregation
```

Therefore:

> **The graph is static in structure, but its execution path can be dynamic.**

---

# 20. Static Graph, Dynamic Execution

This is an important LangGraph concept.

The graph can be defined ahead of time:

```text
A
├── B
├── C
└── D
```

But runtime state determines which branch executes:

```text
             A
             ↓
          State
          /   \
         ↓     ↓
        B      C
```

The graph defines the **possible paths**.

The state determines the **actual path**.

Therefore:

$$
\boxed{
Static\ Graph + Dynamic\ State = Dynamic\ Workflow\ Execution
}
$$

---

# 21. Conditional Routing Does Not Mean Uncontrolled Routing

In enterprise CWD, routing should remain governed.

A good model is:

```text
LLM / Agent Decision
        ↓
Candidate Route
        ↓
State Evaluation
        ↓
Policy / Authorization
        ↓
Registry / Availability
        ↓
Conditional Router
        ↓
Approved Next Node
```

So even if an LLM recommends:

```text
"Use FinanceWorker"
```

the runtime can determine:

```text
FinanceWorker
    ↓
Unavailable
    ↓
Select approved alternative
```

Or:

```text
FinanceWorker
    ↓
Not authorized
    ↓
Reject route
```

---

# 22. Complete Conditional Routing Example

Consider:

> "Analyze the sales decline and recommend corrective actions."

The workflow might look like:

```text
                         Request
                            ↓
                      Intent Analysis
                            ↓
                      Authorization
                            ↓
                         Planning
                            ↓
                      Agent Discovery
                            ↓
                     Delegator Routing
                            ↓
                     Worker Selection
                            ↓
                  ┌─────────┴──────────┐
                  ↓                    ↓
              Available            Unavailable
                  ↓                    ↓
              Execute              Reassign
                  ↓                    ↓
                  └──────────┬─────────┘
                             ↓
                       Tool/Retrieval
                             ↓
                           Result
                             ↓
                         Validation
                             │
                ┌────────────┼─────────────┐
                ↓            ↓             ↓
             Valid        Retryable      Invalid
                ↓            ↓             ↓
            Aggregate      Retry         Recovery
                │            │
                │            └──────→ Execute
                ↓
        Recommendations
                ↓
       Response Generation
                ↓
               END
```

Every branch is driven by runtime state.

---

# 23. The Seven Major Routing Inputs in CWD

The conditions you mentioned can be organized as follows:

| Routing Input           | Example                   | Possible Next Path |
| ----------------------- | ------------------------- | ------------------ |
| **User Intent**         | `sales_analysis`          | Sales Delegator    |
| **Task Status**         | `completed`               | Aggregation        |
| **Agent Decision**      | Finance analysis required | Finance Delegator  |
| **Worker Availability** | Worker unavailable        | Reassignment       |
| **Tool Result**         | Timeout                   | Retry              |
| **Validation Outcome**  | Invalid output            | Retry/Recovery     |
| **Failure Condition**   | Policy violation          | Stop               |

Together:

```text
User Intent
     │
Task Status
     │
Agent Decision
     │
Worker Availability
     │
Tool Result
     │
Validation
     │
Failure
     │
     ↓
Conditional Router
     ↓
Next Workflow Path
```

---

# 24. Conditional Routing + CWD Resilience

This is why conditional routing is so important to production CWD.

Without it:

```text
Failure
  ↓
Workflow stops
```

With it:

```text
Failure
  ↓
Classify
  ↓
 ┌──────────┬──────────┬──────────┐
 ↓          ↓          ↓          ↓
Retry     Reassign   Human      Stop
                      Review
```

The system can adapt rather than treating every failure as terminal.

---

# 25. Final Architectural Model

The complete relationship is:

```text
                     SHARED STATE
                          │
                          ↓
                  Conditional Router
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
   Success Path       Recovery Path      Approval Path
        │                 │                 │
        ↓                 ↓                 ↓
   Aggregation          Retry            Human Review
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ↓
                   Downstream Node
```

And across CWD:

```text
                 Coordinator
                      │
                StateGraph
                      │
             Conditional Routing
                      │
          ┌───────────┼────────────┐
          ↓           ↓            ↓
      Delegator     Worker       Human
          │           │           Review
          ↓           ↓
       Workers     Tools/MCP
          │           │
          └──────┬────┘
                 ↓
             Validation
                 │
        ┌────────┼────────┐
        ↓        ↓        ↓
     Success   Retry    Recovery
        │
        ↓
    Aggregation
        ↓
    Response
        ↓
       END
```

## Final Definition

> **Conditional routing in LangGraph is the mechanism that dynamically selects the next workflow node by evaluating the current CWD state. The routing decision can depend on user intent, authorization, task status, agent decisions, Worker capability and availability, tool results, validation outcomes, deadlines, human-approval requirements, and failure classifications. This allows CWD to follow successful paths, retry transient failures, reassign unavailable Workers, pause for human approval, route to recovery, or terminate safely when execution cannot continue.**

The core formula is:

$$
\boxed{
NextNode = f(
State,
Intent,
TaskStatus,
AgentDecision,
WorkerAvailability,
ToolResult,
Validation,
Failure
)
}
$$

And the key CWD principle is:

$$
\boxed{
\text{State determines the path}
\quad+\quad
\text{Edges enforce the path}
\quad+\quad
\text{Nodes execute the path}
}
$$

**In short: conditional routing is what makes CWD's LangGraph workflow adaptive—rather than simply sequential—while keeping execution controlled, recoverable, and governed.**
