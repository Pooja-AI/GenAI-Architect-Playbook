# How Do You Prevent Agents From Repeatedly Calling Each Other?

## Interview Question

**“In a multi-agent system, how do you prevent agents from repeatedly calling each other and creating an infinite loop?”**

---

## Strong Interview Answer

I prevent agent-to-agent loops using **deterministic orchestration controls rather than relying on the LLM to decide when to stop**.

In my architecture, the orchestration layer maintains the workflow state and enforces controls such as:

* Maximum agent hops
* Maximum iterations
* Task status
* Visited-agent tracking
* Correlation IDs
* Timeout limits
* Retry limits
* Cycle detection
* Explicit termination conditions
* Circuit breakers

For example, if the Coordinator invokes a Delegator, which invokes a Worker, I don't allow the Worker to arbitrarily invoke the Coordinator again unless that transition is explicitly allowed by the workflow.

The important principle is:

> **Agents can reason, but the orchestrator controls execution boundaries.**

---

# Why Can Agent Loops Happen?

Consider:

```text
Coordinator
    ↓
Delegator A
    ↓
Worker B
    ↓
Delegator A
    ↓
Worker B
    ↓
Delegator A
    ↓
...
```

This can happen because:

* An agent cannot complete its task
* Two agents keep delegating to each other
* An LLM incorrectly decides another agent is required
* A routing rule is ambiguous
* A failure causes repeated retries
* An agent doesn't recognize that the task is already completed
* Circular dependencies exist between agents

This is why **agent autonomy must be bounded by orchestration policy**.

---

# 1. Maximum Hop Limit

I maintain a maximum number of agent-to-agent transitions.

For example:

```text
max_hops = 10
```

Example:

```text
Coordinator → Delegator → Worker → Validator
```

Each transition increments the hop counter:

```text
hop = 1
hop = 2
hop = 3
...
```

If:

```text
hop >= max_hops
```

the workflow stops or escalates.

This prevents an infinite communication chain.

---

# 2. Maximum Iteration Limit

For loops inside an agent workflow, I also define a maximum iteration count.

```python
MAX_ITERATIONS = 5

if state["iteration"] >= MAX_ITERATIONS:
    return "ESCALATE"
```

For example:

```text
Agent
  ↓
Evaluate
  ↓
Need more information?
  ↓ YES
Call Worker
  ↓
Evaluate
  ↓
Need more information?
  ↓ YES
...
```

After the configured limit:

```text
STOP → Escalate / Return partial result
```

---

# 3. Track Visited Agents

I maintain the agents that have already participated in the current workflow.

Example:

```json
{
  "visited_agents": [
    "coordinator",
    "manufacturing-delegator",
    "vision-worker"
  ]
}
```

If:

```text
vision-worker → manufacturing-delegator
```

and the workflow tries:

```text
manufacturing-delegator → vision-worker
```

the orchestrator can detect a previously visited transition.

For more precise cycle detection, I track **agent + task + transition**, not just the agent name.

For example:

```text
A → B → A
```

is a cycle.

But:

```text
A(task1) → B(task1) → A(task2)
```

may be a legitimate workflow.

So cycle detection should be **context-aware**.

---

# 4. Define an Explicit State Machine

This is particularly important in my LangGraph-based architecture.

Instead of allowing agents to call arbitrary agents:

```text
Agent A
   ↓
"Who should I call?"
   ↓
Any Agent ❌
```

I define allowed transitions:

```text
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
Validator
     ↓
END
```

For example:

```text
Coordinator → Manufacturing Delegator
Manufacturing Delegator → Vision Worker
Manufacturing Delegator → RAG Worker
Vision Worker → RCA Worker
RCA Worker → END
```

The worker cannot arbitrarily create:

```text
RCA Worker → Coordinator
```

unless that transition is explicitly defined.

This makes the architecture much more predictable.

---

# 5. Use Task Status

Every task should have a lifecycle.

For example:

```text
CREATED
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
COMPLETED
```

or:

```text
CREATED
   ↓
IN_PROGRESS
   ↓
FAILED
   ↓
RETRY
```

Once a task reaches:

```text
COMPLETED
```

another agent should not execute the same task again unless there is a legitimate reason.

Example:

```json
{
  "task_id": "TASK-123",
  "status": "COMPLETED",
  "result": "Overheating identified as probable cause"
}
```

If another agent receives `TASK-123`, the orchestrator can return the existing result rather than executing it again.

---

# 6. Use Idempotency

For distributed agent systems, idempotency is extremely important.

Suppose:

```text
Coordinator
     ↓
Worker
```

The Coordinator retries because it didn't receive a response.

The Worker might receive the same request twice.

Without idempotency:

```text
TASK-123
   ↓
Execute
   ↓
Execute again
```

With idempotency:

```text
TASK-123
   ↓
Already processed?
   ↓ YES
Return previous result
```

A unique:

```text
request_id
task_id
operation_id
```

can be used to identify duplicate execution.

---

# 7. Separate Retry Limits From Agent Loops

Retries themselves can create loops.

For example:

```text
Agent A
   ↓
Agent B
   ↓
Failure
   ↓
Retry
   ↓
Agent B
   ↓
Failure
   ↓
Retry
```

Therefore I don't use unlimited retries.

Example:

```text
max_retries = 3
```

Combined with:

```text
timeout
+
exponential backoff
+
circuit breaker
```

This prevents retry storms.

---

# 8. Use Timeouts

Every agent invocation should have an execution timeout.

For example:

```text
Worker timeout = 30 seconds
```

If the Worker doesn't respond:

```text
Timeout
   ↓
Retry?
   ↓
Fallback?
   ↓
Escalate
```

Without timeouts, a workflow can remain stuck indefinitely.

---

# 9. Use Circuit Breakers

If an agent repeatedly fails, I temporarily stop sending requests to it.

Conceptually:

```text
CLOSED
   ↓
Repeated failures
   ↓
OPEN
   ↓
Stop calling agent
   ↓
Wait
   ↓
HALF-OPEN
   ↓
Test request
   ↓
Healthy → CLOSED
Unhealthy → OPEN
```

This protects the overall system from cascading failures.

---

# 10. Define a Clear Termination Condition

Every workflow must have a defined completion condition.

For example:

```text
IF RCA confidence >= threshold
    → COMPLETE

IF required evidence unavailable
    → ESCALATE

IF max_hops exceeded
    → STOP

IF max_iterations exceeded
    → STOP

IF task completed
    → END
```

The LLM should not be the only component deciding whether the workflow terminates.

---

# How I Would Implement It in LangGraph

Conceptually:

```text
START
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
Validate Result
  |
  +---- Valid ----> END
  |
  +---- Need More Information
  |             ↓
  |        Check Limits
  |             |
  |       +-----+-----+
  |       |           |
  |    Within      Exceeded
  |       |           |
  |       ↓           ↓
  |    Continue    ESCALATE
  |
  +---- Failed
              ↓
        Retry / Fallback
```

The important part is that **the graph controls which transitions are possible**.

---

# Example State

I would maintain control metadata such as:

```python
state = {
    "request_id": "REQ-123",
    "task_id": "TASK-456",

    "current_agent": "vision-worker",

    "visited_agents": [
        "coordinator",
        "manufacturing-delegator",
        "vision-worker"
    ],

    "hop_count": 3,
    "iteration_count": 2,

    "retry_count": {
        "vision-worker": 1
    },

    "task_status": "IN_PROGRESS",

    "max_hops": 10,
    "max_iterations": 5
}
```

The orchestration layer uses this state to determine whether the next transition is allowed.

---

# Important: Don't Let Agents Freely Call Each Other

A weak architecture would be:

```text
Agent A
  ↕
Agent B
  ↕
Agent C
  ↕
Agent D
```

where every agent can call every other agent.

This creates a communication mesh and makes cycle detection, debugging, security, and governance much harder.

Instead, I prefer:

```text
              Coordinator
                   |
          +--------+--------+
          |                 |
     Delegator A       Delegator B
          |                 |
       Workers           Workers
```

The orchestration layer controls the allowed communication paths.

---

# Role of LangGraph, A2A and MCP

It is important to separate their responsibilities.

### LangGraph

Controls:

```text
Workflow
State
Transitions
Loops
Retries
Checkpoints
Termination
```

### A2A

Handles:

```text
Agent ↔ Agent communication
```

It does **not** automatically prevent an infinite loop.

### MCP

Handles:

```text
Agent ↔ Tool/Data/Resource
```

It also does not solve agent-loop prevention.

Therefore:

> **A2A provides communication; LangGraph/orchestration provides execution control.**

---

# Enterprise-Level Control Strategy

I normally use multiple layers of protection:

```text
                    Agent Invocation
                           |
                    Authorization
                           |
                    Allowed Transition?
                           |
                    Cycle Detection
                           |
                    Hop Limit
                           |
                    Task Status
                           |
                    Retry Limit
                           |
                      Timeout
                           |
                    Circuit Breaker
                           |
                    Termination Rule
                           |
                         END
```

This is **defense in depth**.

If one mechanism fails, another boundary still protects the workflow.

---

# What If Agents Still Keep Looping?

I don't allow the loop to continue indefinitely.

For example:

```text
A → B → A → B → A
```

After the configured limit:

```text
Cycle detected
      ↓
Stop workflow
      ↓
Persist state
      ↓
Log / trace
      ↓
Fallback or HITL
```

I also monitor metrics such as:

* Agent hop count
* Average iterations
* Cycle detection rate
* Retry rate
* Agent-to-agent call count
* Workflow timeout rate
* Escalation rate
* Failed workflow rate

A sudden increase in these metrics can indicate a routing or prompt-design problem.

---

# Strong Architect-Level Answer

> **“I prevent agent-to-agent loops by making agent communication bounded and policy-controlled. I maintain workflow state with request and task IDs, track agent transitions, enforce maximum hops and iterations, define explicit allowed transitions, and use task completion status and idempotency to prevent duplicate execution. Retries are bounded with timeouts, exponential backoff, and circuit breakers. If the workflow exceeds its limits or a cycle is detected, I stop execution and either use a fallback path or escalate to human review. In my architecture, A2A provides agent-to-agent communication, but it does not control looping; LangGraph and the orchestration layer enforce the execution boundaries. The principle is that agents can reason about what to do next, but the orchestrator decides what they are actually allowed to execute.”**

---

# 30-Second Interview Version

> **“I prevent agent loops using bounded orchestration. I track request IDs, task IDs, visited transitions, hop count, iteration count, and retry count. I define explicit allowed transitions in the workflow rather than allowing agents to call any other agent arbitrarily. I also use timeouts, bounded retries, idempotency, circuit breakers, and explicit termination conditions. If a cycle or limit is detected, the workflow stops and can fall back or escalate. A2A handles communication, while LangGraph controls the workflow and execution boundaries.”**

---

# Memory Trick

## **L-I-M-I-T**

**L — Loop detection**
**I — Iteration limit**
**M — Maximum hops**
**I — Idempotency**
**T — Timeout / Termination**

### One-line memory:

> **“Detect the loop, limit the hops, make execution idempotent, and always have a timeout and termination condition.”**

### Architect Principle

> **Agents should have autonomy within boundaries—not unlimited autonomy.**
