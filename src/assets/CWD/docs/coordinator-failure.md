## Coordinator Failure Recovery in CWD

Advanced · ~60 minutes

The Coordinator is the component responsible for the overall workflow lifecycle. It knows what the user requested, which domain tasks must be completed, what has already succeeded, and what remains.

When the Coordinator fails, the main risk is not just that the process stops. The real risk is that the system loses the overall request context, repeats completed work, or cannot determine how to continue.

> Core principle: The Coordinator process may fail, but the workflow state must survive. A new Coordinator should recover the existing execution—not create a new request from scratch.

### 1. What must survive a Coordinator failure?

Consider a customer request:

> “Find my order status, check whether it is delayed, and notify me if necessary.”

The Coordinator may have already completed part of the workflow:

```
Request ID: req-123
    |
    v
Coordinator
    |
    v
Order lookup                 ✓
    |
    v
Delay analysis               ✓
    |
    v
Notification decision        ✗ Coordinator crashes
```

After recovery, CWD should know:

* Original request: What the user asked.

* Request ID: Which execution this belongs to.

* Workflow state: Which steps are complete.

* Task state: Which Workers were assigned.

* Checkpoint: Where execution can safely resume.

* Retry count: How many attempts have already occurred.

* Pending work: What still needs to be completed.

* Execution deadline: Whether the request is still allowed to continue.

Without this information, the system may start over and repeat the order lookup, delay analysis, or notification.


## 2. Persisted execution state: The source of truth

The Coordinator should not rely only on in-memory variables.

Python

Run

```
execution_state = {
    "request_id": "req-123",
    "workflow_id": "order-support",
    "status": "running",
    "current_step": "notification_decision",
    "completed_steps": [
        "order_lookup",
        "delay_analysis"
    ],
    "pending_steps": [
        "notification_decision"
    ],
    "context": {
        "customer_id": "cust-456",
        "order_id": "order-789"
    },
    "retry_count": 0,
    "checkpoint_id": "cp-002"
}
```

This state should be stored in durable storage such as a database or workflow-state store.

Important: The exact storage technology is an implementation choice. The reliability requirement is that the state must survive a Coordinator restart.

### Why persisted state matters

```
Coordinator A
    |
    v
Workflow state saved
    |
    X
Coordinator crashes
    |
    v
Coordinator B starts
    |
    v
Loads request state
    |
    v
Continues existing execution
```

The new Coordinator is a recovery process, not a new business request.

## 3. Checkpointing: Save progress at safe points

A checkpoint records the last known safe execution state.

### Example

```
Workflow: Customer Order Support

Step 1: Retrieve order data       ✓ checkpoint
Step 2: Analyze delay             ✓ checkpoint
Step 3: Decide notification       ✗ Coordinator crashes
```

After recovery:

```
Coordinator restarts
        |
        v
Load checkpoint
        |
        v
Resume from notification decision
```

### What a checkpoint should contain

|
Field

|

Purpose

|
| --- | --- |
|

Request ID

|

Preserve the original user request

|
|

Workflow ID

|

Identify the workflow

|
|

Current step

|

Know where execution stopped

|
|

Completed steps

|

Avoid unnecessary repetition

|
|

Task IDs

|

Correlate Worker executions

|
|

Worker assignments

|

Know who was already assigned

|
|

Outputs

|

Preserve completed results

|
|

Retry counts

|

Avoid exceeding retry limits

|
|

Status

|

Know whether recovery is needed

|

Important: Checkpointing should happen after meaningful successful steps, not only at the very end.

## 4. Retries: Recover transient Coordinator failures

A Coordinator may fail because of a temporary database connection problem, messaging timeout, or dependency outage.

```
Coordinator
    |
    v
Persist execution state
    |
    X
Temporary database timeout
    |
    v
Retry state operation
    |
    ✓
Continue workflow
```

### Example retry policy

Python

Run

```
retry_policy = {
    "max_attempts": 3,
    "initial_delay": 1,
    "max_delay": 8,
    "retryable_errors": [
        "TIMEOUT",
        "SERVICE_UNAVAILABLE",
        "CONNECTION_ERROR"
    ]
}
```

Important: Retry the failed Coordinator operation, not automatically the entire workflow.

For example, if saving a checkpoint fails, retrying the checkpoint write is different from rerunning all previous Worker tasks.

## 5. Failover: Restore the Coordinator service

Failover means that another Coordinator instance takes over when the current one becomes unavailable.

```
                    +------------------+
                    |   Coordinator A  |
                    |     ACTIVE       |
                    +--------+---------+
                             |
                             X
                          Crash
                             |
                             v
                    +------------------+
                    |   Coordinator B  |
                    |     RECOVERING   |
                    +--------+---------+
                             |
                             v
                    Load persisted state
                             |
                             v
                    Resume workflows
```

### What failover must accomplish

* Detect that the active Coordinator is unavailable.

* Start or promote a replacement.

* Load persisted execution state.

* Recover pending workflows.

* Avoid duplicate ownership of the same execution.

* Continue or safely stop workflows according to their state.

Important: Failover alone does not guarantee continuity. The replacement must also recover the workflow state.

## 6. Workflow resumption: Continue from the correct point

This is the most important recovery behavior.

### Unsafe approach

```
Coordinator crashes
    |
    v
New Coordinator starts
    |
    v
Restart entire workflow
```

This may repeat completed work and duplicate side effects.

### Safe approach

```
Coordinator crashes
    |
    v
New Coordinator loads execution state
    |
    v
Check completed steps
    |
    v
Check active Worker tasks
    |
    v
Resume from last safe checkpoint
```

### Example

```
Request: req-123

Completed:
    ✓ Order lookup
    ✓ Delay analysis

Pending:
    → Notification decision
```

The Coordinator should continue with the notification decision rather than repeating the order lookup.

## 7. Preserving the overall request context

The request context is the information that gives the workflow its meaning.

For example:

Python

Run

```
request_context = {
    "request_id": "req-123",
    "user_goal": "Find order status and notify if delayed",
    "customer_id": "cust-456",
    "order_id": "order-789",
    "conversation_context": {
        "language": "English",
        "priority": "normal"
    }
}
```

This context should remain associated with the execution throughout its lifecycle.

### Why this matters

Without the original context, the recovered Coordinator may know:

> “There is a pending task.”

But it may not know:

> “This task belongs to the customer’s original order-support request.”

That can lead to incorrect routing, missing information, or an unrelated response.

The Coordinator should preserve the original request identity and context across retries, failover, and resumption.

## 8. Advanced scenario: Coordinator crashes after dispatching a Worker

This is a classic distributed-systems problem.

### Scenario

```
1. Coordinator creates task-123
2. Delegator selects Order Worker A
3. Task is dispatched
4. Worker A receives the task
5. Coordinator crashes before recording completion
```

Now the replacement Coordinator must determine:

> “Did the Worker execute the task, or is the task still pending?”

### Safe recovery

```
Coordinator B starts
        |
        v
Load task-123
        |
        v
Check persisted assignment state
        |
        v
Check Worker acknowledgment / execution status
        |
        v
Check idempotency / side-effect state
        |
        v
Resume tracking OR safely retry
```

Never assume that a missing response means the task never executed.

This is especially important for operations such as:

* Creating CRM records.

* Sending notifications.

* Updating order status.

* Triggering external workflows.

## 9. Coordinator vs Delegator recovery

These responsibilities must remain separate.

|
Component

|

What it preserves

|

Recovery responsibility

|
| --- | --- | --- |
|

Coordinator

|

Overall workflow and request context

|

Resume the business workflow

|
|

Delegator

|

Task assignments and Worker selection

|

Recover or reroute execution

|
|

Worker

|

Local task progress

|

Retry or resume specialized work

|

### Example

```
Coordinator:
"Customer needs order status."

Delegator:
"Assign order lookup to Order Worker."

Worker:
"Retrieve order data."

Coordinator:
"Order lookup completed. Continue to delay analysis."
```

If the Coordinator fails, the Delegator should not redefine the business objective. It should continue executing the task assigned to it.

## 10. End-to-end example: Customer Support workflow

### Scenario: Coordinator crashes during notification

```
User
  |
  v
Gateway
  |
  v
Coordinator
  |
  v
Create workflow state
  |
  v
Delegator
  |
  v
Order Worker
  |
  v
Order lookup ✓
  |
  v
Checkpoint saved
  |
  v
Delay analysis ✓
  |
  v
Checkpoint saved
  |
  X
Coordinator crashes
  |
  v
Failover / replacement Coordinator
  |
  v
Load persisted execution state
  |
  v
Recover request context
  |
  v
Check active Worker tasks
  |
  v
Resume notification decision
  |
  v
Delegator selects Notification Worker
  |
  v
Notification sent ✓
  |
  v
Coordinator marks workflow COMPLETED
```

The user’s original request remains the same throughout the recovery.

## 11. Important advanced concept: Exactly-once business effect

Distributed systems often cannot guarantee that every execution step runs exactly once. A Coordinator may crash after a side effect succeeds but before recording the result.

Therefore, CWD should aim for:

> At-least-once execution with exactly-once business effects where required.

### Example

```
Coordinator
    |
    v
Notification Worker
    |
    v
Send notification ✓
    |
    X
Coordinator crashes before recording completion
    |
    v
Coordinator restarts
    |
    v
Checks notification idempotency key
    |
    v
Notification already sent
    |
    v
Mark task completed
```

This prevents duplicate notifications while still allowing the workflow to recover.

## 12. Practical implementation pattern

A recovery manager can combine state loading, checkpoint recovery, and workflow resumption.

Python

Run

```
class CoordinatorRecoveryManager:

    async def recover(self, execution_id):

        state = await load_execution_state(execution_id)

        if state is None:
            raise RecoveryError("Execution state not found")

        if state["status"] == "completed":
            return state

        if state["status"] == "failed":
            return await handle_failed_execution(state)

        if state["status"] == "running":
            return await resume_workflow(state)

        return await recover_pending_tasks(state)
```

The exact implementation may vary, but the responsibility should remain clear:

```
Load state
    ↓
Validate execution identity
    ↓
Recover request context
    ↓
Check completed steps
    ↓
Check active assignments
    ↓
Resume / retry / reroute
    ↓
Update state
    ↓
Continue workflow
```

## 13. Interview-ready explanation

> Coordinator Failure Recovery in CWD is the capability that ensures the overall workflow continues even when the Coordinator process crashes or becomes unavailable. CWD uses persisted execution state and checkpoints to preserve the original request context, completed steps, task assignments, and pending work. When a failure occurs, retries handle transient errors, failover restores Coordinator availability, and workflow resumption continues from the last safe checkpoint. The Coordinator checks existing Worker assignments before retrying or rerouting, preventing duplicate work and preserving execution continuity. The key is that the business request remains the source of truth, while the Coordinator recovers the workflow state and continues execution safely.

## 14. Practical exercise

Design the recovery strategy for this workflow:

```
User
  ↓
Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
Order Worker
  ↓
CRM Tool
  ↓
LLM
  ↓
Response
```

Answer these questions:

1. What happens if the Coordinator crashes after creating the workflow?

2. How does CWD preserve the original request context?

3. What should be stored in persisted execution state?

4. When should checkpoints be created?

5. How does the replacement Coordinator recover pending tasks?

6. How does it know whether the Worker already executed a task?

7. When should it retry the same task?

8. When should it reroute to another Worker?

9. How does it prevent duplicate CRM updates?

10. How does the workflow resume without repeating completed steps?

Main takeaway: Coordinator reliability is about preserving the overall request, recovering durable workflow state, and resuming execution from the correct point without losing context or duplicating side effects.
