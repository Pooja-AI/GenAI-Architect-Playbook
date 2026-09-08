# Replay-Based Recovery in CWD

Replay-based recovery allows CWD to reconstruct a workflow from durable execution state, checkpoints, events, and messages instead of starting the entire request from scratch.

It serves two related purposes:

1. Recovery: Continue a failed production execution from its last safe point.

2. Reproduction: Reconstruct what happened to debug, audit, test, or explain a workflow.

> Persisted state tells CWD where the workflow is. Events explain what happened. Checkpoints provide safe restart points. Messages represent work that must be delivered or processed. Replay reconstructs the execution history.

## 1. Why replay is needed

Consider a CWD workflow:

```
User Request
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker A: Retrieve customer data
    ↓
Worker B: Analyze issue
    ↓
Worker C: Generate response
```

Suppose Worker B succeeds, but the Coordinator crashes before recording that success.

After restart, CWD must determine:

* Did Worker A complete?

* Did Worker B complete?

* Was Worker C dispatched?

* Was the response already generated?

* Which messages were acknowledged?

* Which side effects may have occurred?

* What should be retried?

* What should not be repeated?

Without durable history, the Coordinator may either lose work or execute the same side effect twice.

## 2. The four recovery building blocks

|
Building block

|

What it stores

|

Main purpose

|
| --- | --- | --- |
|

Persisted execution state

|

Current workflow status, task states, context, assignments

|

Know the latest durable state

|
|

Checkpoint

|

A consistent restart point

|

Resume without replaying everything

|
|

Event

|

A fact that occurred

|

Reconstruct history and audit behavior

|
|

Message

|

A command or event delivered between components

|

Recover pending or unacknowledged work

|

These are related but not interchangeable.

```
Events → explain history
Checkpoints → accelerate recovery
State → represent current durable status
Messages → transport work and facts
```

# 3. Persisted execution state

The execution state is the durable representation of the workflow.

Python

Run

```
execution_state = {
    "request_id": "req-1001",
    "workflow_id": "wf-2001",
    "status": "running",
    "current_step": "analyze_customer_issue",
    "completed_steps": [
        "retrieve_customer_data"
    ],
    "pending_steps": [
        "generate_response"
    ],
    "task_states": {
        "retrieve_customer_data": "completed",
        "analyze_customer_issue": "completed",
        "generate_response": "pending",
    },
    "worker_assignments": {
        "retrieve_customer_data": "worker-1",
        "analyze_customer_issue": "worker-2",
    },
    "context": {
        "customer_id": "cust-123",
        "user_goal": "Resolve delivery issue",
    },
    "last_checkpoint_id": "cp-004",
}
```

The state should be stored in a durable database or state store rather than only in Coordinator memory.

# 4. Checkpoints

A checkpoint is a known safe recovery point.

For example:

```
Checkpoint 1:
    Request accepted

Checkpoint 2:
    Customer data retrieved

Checkpoint 3:
    Issue analysis completed

Checkpoint 4:
    Final response persisted
```

If the Coordinator fails during response generation, CWD can resume from Checkpoint 3.

```
Checkpoint 3
    ↓
Resume response generation
    ↓
Persist final response
    ↓
Complete workflow
```

## What a checkpoint should contain

Python

Run

```
checkpoint = {
    "checkpoint_id": "cp-004",
    "request_id": "req-1001",
    "workflow_id": "wf-2001",
    "sequence_number": 4,
    "workflow_status": "running",
    "current_step": "generate_response",
    "completed_tasks": [
        "retrieve_customer_data",
        "analyze_customer_issue",
    ],
    "pending_tasks": [
        "generate_response",
    ],
    "task_outputs": {
        "retrieve_customer_data": {
            "customer_id": "cust-123",
            "order_status": "delayed",
        },
        "analyze_customer_issue": {
            "classification": "delivery_delay",
        },
    },
    "context": {
        "user_goal": "Resolve delivery issue",
    },
}
```

A checkpoint should be created after meaningful state transitions, not necessarily after every line of code.

# 5. Events

An event records something that has already happened.

Examples:

```
WorkflowStarted
TaskAssigned
TaskStarted
TaskCompleted
TaskFailed
CheckpointCreated
MessagePublished
MessageAcknowledged
CompensationRequested
WorkflowResumed
WorkflowCompleted
```

An event should be immutable.

Python

Run

```
event = {
    "event_id": "evt-008",
    "event_type": "TaskCompleted",
    "request_id": "req-1001",
    "workflow_id": "wf-2001",
    "task_id": "task-3002",
    "sequence_number": 8,
    "timestamp": "2026-09-07T21:20:00Z",
    "payload": {
        "worker_id": "worker-2",
        "result": {
            "classification": "delivery_delay",
        },
    },
}
```

The event says:

> “This task completed.”

It does not mean:

> “Please execute this task again.”

That distinction is critical during replay.

# 6. Event sourcing versus ordinary state persistence

CWD can use two common approaches.

## State persistence

Store the latest state:

```
Workflow ID → Current workflow state
```

Example:

```
wf-2001 → RUNNING, current_step=generate_response
```

This is simple and efficient for recovery.

## Event sourcing

Store the sequence of events:

```
WorkflowStarted
TaskAssigned
TaskCompleted
TaskAssigned
TaskCompleted
CheckpointCreated
```

The current state is reconstructed by applying events in order.

```
Initial state
    ↓
Apply WorkflowStarted
    ↓
Apply TaskAssigned
    ↓
Apply TaskCompleted
    ↓
Apply CheckpointCreated
    ↓
Current state
```

## Hybrid approach

A practical CWD design often uses both:

```
Event log → Complete history
Checkpoint → Fast recovery
Current state → Efficient queries
```

The checkpoint avoids replaying thousands of historical events every time a workflow resumes.

# 7. Event replay

Replay means reading historical events and applying their state transitions again.

Python

Run

```
def apply_event(state: dict, event: dict) -> dict:
    event_type = event["event_type"]

    if event_type == "WorkflowStarted":
        state["status"] = "running"

    elif event_type == "TaskAssigned":
        task_id = event["task_id"]
        state["task_states"][task_id] = "assigned"

    elif event_type == "TaskCompleted":
        task_id = event["task_id"]
        state["task_states"][task_id] = "completed"
        state["completed_steps"].append(task_id)

    elif event_type == "TaskFailed":
        task_id = event["task_id"]
        state["task_states"][task_id] = "failed"

    elif event_type == "WorkflowCompleted":
        state["status"] = "completed"

    return state
```

Replay:

Python

Run

```
def replay_events(events: list[dict]) -> dict:
    state = {
        "status": "created",
        "task_states": {},
        "completed_steps": [],
    }

    for event in sorted(
        events,
        key=lambda item: item["sequence_number"],
    ):
        state = apply_event(state, event)

    return state
```

The replay function should be deterministic: the same event sequence should produce the same reconstructed state.

# 8. Replay must not repeat side effects

This is one of the most important principles.

Suppose the event log contains:

```
PaymentCharged
```

During replay, CWD must reconstruct the fact that payment was charged. It must not charge the customer again.

Incorrect:

Python

Run

```
def replay_event(event):
    if event["event_type"] == "PaymentCharged":
        payment_service.charge(...)  # Dangerous
```

Correct:

Python

Run

```
def replay_event(state, event):
    if event["event_type"] == "PaymentCharged":
        state["payment_status"] = "charged"
        state["payment_id"] = event["payload"]["payment_id"]

    return state
```

Replay should normally update local state only.

External side effects should happen through new, explicitly controlled commands.

```
Event replay:
    Reconstruct state

New command:
    Execute an external action
```

# 9. Commands versus events

|
Type

|

Meaning

|

Example

|
| --- | --- | --- |
|

Command

|

Request an action

|

`ChargePayment`

|
|

Event

|

Record a completed fact

|

`PaymentCharged`

|
|

Query

|

Read current information

|

`GetPaymentStatus`

|

Example:

```
Coordinator → ChargePayment command
Payment Service → PaymentCharged event
```

During replay:

```
PaymentCharged event
    ↓
Update workflow state
    ↓
Do not issue ChargePayment again
```

This separation prevents accidental duplicate execution.

# 10. Message replay

Messages may be lost, delayed, duplicated, or delivered before a consumer crashes.

A durable messaging system should track:

* Message ID

* Correlation ID

* Workflow ID

* Task ID

* Message type

* Delivery attempt

* Processing status

* Acknowledgment status

* Idempotency key

* Visibility or lease expiration

Example:

Python

Run

```
message = {
    "message_id": "msg-5001",
    "message_type": "ExecuteWorkerTask",
    "request_id": "req-1001",
    "workflow_id": "wf-2001",
    "task_id": "task-3003",
    "idempotency_key": "wf-2001:task-3003",
    "payload": {
        "worker_type": "response_generator",
    },
    "status": "pending",
}
```

# 11. Message acknowledgment and recovery

Consider this sequence:

```
1. Coordinator publishes task message
2. Worker receives message
3. Worker executes task
4. Worker persists result
5. Worker crashes before acknowledgment
```

The message broker may redeliver the message.

```
Redelivered message
    ↓
Worker checks task status
    ↓
Result already persisted?
    ├── Yes → Return existing result, do not execute again
    └── No  → Execute task
```

This is why message processing must be idempotent.

Python

Run

```
async def process_message(message, state_store):
    task_id = message["task_id"]

    existing = await state_store.get_task_result(task_id)

    if existing is not None:
        return existing

    result = await execute_task(message["payload"])

    await state_store.save_task_result(
        task_id=task_id,
        result=result,
    )

    return result
```

In production, the check and result persistence should be protected by an atomic operation or unique constraint to avoid concurrent duplicate execution.

# 12. Recovery after Coordinator failure

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_16a_%22%20width%3D%221169.5%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%22879%22%20viewBox%3D%22-50%20-10%201169.5%20879%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22sequence%22%3E%3Cg%3E%3Crect%20x%3D%22891%22%20y%3D%22793%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22C2%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22966%22%20y%3D%22825.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22966%22%20dy%3D%220%22%3ECoordinator%202%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Crect%20x%3D%22610%22%20y%3D%22793%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22Q%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22685%22%20y%3D%22825.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22685%22%20dy%3D%220%22%3EMessage%20Broker%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Crect%20x%3D%22410%22%20y%3D%22793%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22E%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22485%22%20y%3D%22825.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22485%22%20dy%3D%220%22%3EEvent%20Log%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Crect%20x%3D%22210%22%20y%3D%22793%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22S%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22285%22%20y%3D%22825.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22285%22%20dy%3D%220%22%3EState%20Store%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Crect%20x%3D%220%22%20y%3D%22793%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22C1%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2275%22%20y%3D%22825.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%2275%22%20dy%3D%220%22%3ECoordinator%201%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor8%22%20x1%3D%22966%22%20y1%3D%2265%22%20x2%3D%22966%22%20y2%3D%22793%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22C2%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-8%22%3E%3Crect%20x%3D%22891%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22C2%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22966%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22966%22%20dy%3D%220%22%3ECoordinator%202%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor7%22%20x1%3D%22685%22%20y1%3D%2265%22%20x2%3D%22685%22%20y2%3D%22793%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22Q%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-7%22%3E%3Crect%20x%3D%22610%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22Q%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22685%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22685%22%20dy%3D%220%22%3EMessage%20Broker%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor6%22%20x1%3D%22485%22%20y1%3D%2265%22%20x2%3D%22485%22%20y2%3D%22793%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22E%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-6%22%3E%3Crect%20x%3D%22410%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22E%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22485%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22485%22%20dy%3D%220%22%3EEvent%20Log%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor5%22%20x1%3D%22285%22%20y1%3D%2265%22%20x2%3D%22285%22%20y2%3D%22793%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22S%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-5%22%3E%3Crect%20x%3D%22210%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22S%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22285%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22285%22%20dy%3D%220%22%3EState%20Store%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor4%22%20x1%3D%2275%22%20y1%3D%2265%22%20x2%3D%2275%22%20y2%3D%22793%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22C1%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-4%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22C1%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2275%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%2275%22%20dy%3D%220%22%3ECoordinator%201%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cstyle%3E%23mermaid-_r_16a_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_16a_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_16a_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_16a_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_16a_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_16a_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_16a_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_16a_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_16a_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_16a_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_16a_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_16a_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_16a_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_16a_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_16a_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_16a_%20.actor%7Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bfill%3Argb\(9%2C%2023%2C%2044\)%3B%7D%23mermaid-_r_16a_%20text.actor%26gt%3Btspan%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_16a_%20.actor-line%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_16a_%20.innerArc%7Bstroke-width%3A1.5%3Bstroke-dasharray%3Anone%3B%7D%23mermaid-_r_16a_%20.messageLine0%7Bstroke-width%3A1.5%3Bstroke-dasharray%3Anone%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_16a_%20.messageLine1%7Bstroke-width%3A1.5%3Bstroke-dasharray%3A2%2C2%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_16a_%20%23arrowhead%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_16a_%20.sequenceNumber%7Bfill%3A%23323232%3B%7D%23mermaid-_r_16a_%20%23sequencenumber%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_16a_%20%23crosshead%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_16a_%20.messageText%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_16a_%20.labelBox%7Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_16a_%20.labelText%2C%23mermaid-_r_16a_%20.labelText%26gt%3Btspan%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_16a_%20.loopText%2C%23mermaid-_r_16a_%20.loopText%26gt%3Btspan%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_16a_%20.loopLine%7Bstroke-width%3A2px%3Bstroke-dasharray%3A2%2C2%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bfill%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3B%7D%23mermaid-_r_16a_%20.note%7Bstroke%3Argb\(58%2C%20132%2C%2063\)%3Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_16a_%20.noteText%2C%23mermaid-_r_16a_%20.noteText%26gt%3Btspan%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_16a_%20.activation0%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Ahsl\(0%2C%200%25%2C%202.9411764706%25\)%3B%7D%23mermaid-_r_16a_%20.activation1%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Ahsl\(0%2C%200%25%2C%202.9411764706%25\)%3B%7D%23mermaid-_r_16a_%20.activation2%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Ahsl\(0%2C%200%25%2C%202.9411764706%25\)%3B%7D%23mermaid-_r_16a_%20.actorPopupMenu%7Bposition%3Aabsolute%3B%7D%23mermaid-_r_16a_%20.actorPopupMenuPanel%7Bposition%3Aabsolute%3Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bbox-shadow%3A0px%208px%2016px%200px%20rgba\(0%2C0%2C0%2C0.2\)%3Bfilter%3Adrop-shadow\(3px%205px%202px%20rgb\(0%200%200%20%2F%200.4\)\)%3B%7D%23mermaid-_r_16a_%20.actor-man%20line%7Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bfill%3Argb\(9%2C%2023%2C%2044\)%3B%7D%23mermaid-_r_16a_%20.actor-man%20circle%2C%23mermaid-_r_16a_%20line%7Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke-width%3A2px%3B%7D%23mermaid-_r_16a_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_16a_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3C%2Fg%3E%3Cdefs%3E%3Csymbol%20id%3D%22computer%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20transform%3D%22scale\(.5\)%22%20d%3D%22M2%202v13h20v-13h-20zm18%2011h-16v-9h16v9zm-10.228%206l.466-1h3.524l.467%201h-4.457zm14.228%203h-24l2-6h2.104l-1.33%204h18.45l-1.297-4h2.073l2%206zm-5-10h-14v-7h14v7z%22%3E%3C%2Fpath%3E%3C%2Fsymbol%3E%3C%2Fdefs%3E%3Cdefs%3E%3Csymbol%20id%3D%22database%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%3E%3Cpath%20transform%3D%22scale\(.5\)%22%20d%3D%22M12.258.001l.256.004.255.005.253.008.251.01.249.012.247.015.246.016.242.019.241.02.239.023.236.024.233.027.231.028.229.031.225.032.223.034.22.036.217.038.214.04.211.041.208.043.205.045.201.046.198.048.194.05.191.051.187.053.183.054.18.056.175.057.172.059.168.06.163.061.16.063.155.064.15.066.074.033.073.033.071.034.07.034.069.035.068.035.067.035.066.035.064.036.064.036.062.036.06.036.06.037.058.037.058.037.055.038.055.038.053.038.052.038.051.039.05.039.048.039.047.039.045.04.044.04.043.04.041.04.04.041.039.041.037.041.036.041.034.041.033.042.032.042.03.042.029.042.027.042.026.043.024.043.023.043.021.043.02.043.018.044.017.043.015.044.013.044.012.044.011.045.009.044.007.045.006.045.004.045.002.045.001.045v17l-.001.045-.002.045-.004.045-.006.045-.007.045-.009.044-.011.045-.012.044-.013.044-.015.044-.017.043-.018.044-.02.043-.021.043-.023.043-.024.043-.026.043-.027.042-.029.042-.03.042-.032.042-.033.042-.034.041-.036.041-.037.041-.039.041-.04.041-.041.04-.043.04-.044.04-.045.04-.047.039-.048.039-.05.039-.051.039-.052.038-.053.038-.055.038-.055.038-.058.037-.058.037-.06.037-.06.036-.062.036-.064.036-.064.036-.066.035-.067.035-.068.035-.069.035-.07.034-.071.034-.073.033-.074.033-.15.066-.155.064-.16.063-.163.061-.168.06-.172.059-.175.057-.18.056-.183.054-.187.053-.191.051-.194.05-.198.048-.201.046-.205.045-.208.043-.211.041-.214.04-.217.038-.22.036-.223.034-.225.032-.229.031-.231.028-.233.027-.236.024-.239.023-.241.02-.242.019-.246.016-.247.015-.249.012-.251.01-.253.008-.255.005-.256.004-.258.001-.258-.001-.256-.004-.255-.005-.253-.008-.251-.01-.249-.012-.247-.015-.245-.016-.243-.019-.241-.02-.238-.023-.236-.024-.234-.027-.231-.028-.228-.031-.226-.032-.223-.034-.22-.036-.217-.038-.214-.04-.211-.041-.208-.043-.204-.045-.201-.046-.198-.048-.195-.05-.19-.051-.187-.053-.184-.054-.179-.056-.176-.057-.172-.059-.167-.06-.164-.061-.159-.063-.155-.064-.151-.066-.074-.033-.072-.033-.072-.034-.07-.034-.069-.035-.068-.035-.067-.035-.066-.035-.064-.036-.063-.036-.062-.036-.061-.036-.06-.037-.058-.037-.057-.037-.056-.038-.055-.038-.053-.038-.052-.038-.051-.039-.049-.039-.049-.039-.046-.039-.046-.04-.044-.04-.043-.04-.041-.04-.04-.041-.039-.041-.037-.041-.036-.041-.034-.041-.033-.042-.032-.042-.03-.042-.029-.042-.027-.042-.026-.043-.024-.043-.023-.043-.021-.043-.02-.043-.018-.044-.017-.043-.015-.044-.013-.044-.012-.044-.011-.045-.009-.044-.007-.045-.006-.045-.004-.045-.002-.045-.001-.045v-17l.001-.045.002-.045.004-.045.006-.045.007-.045.009-.044.011-.045.012-.044.013-.044.015-.044.017-.043.018-.044.02-.043.021-.043.023-.043.024-.043.026-.043.027-.042.029-.042.03-.042.032-.042.033-.042.034-.041.036-.041.037-.041.039-.041.04-.041.041-.04.043-.04.044-.04.046-.04.046-.039.049-.039.049-.039.051-.039.052-.038.053-.038.055-.038.056-.038.057-.037.058-.037.06-.037.061-.036.062-.036.063-.036.064-.036.066-.035.067-.035.068-.035.069-.035.07-.034.072-.034.072-.033.074-.033.151-.066.155-.064.159-.063.164-.061.167-.06.172-.059.176-.057.179-.056.184-.054.187-.053.19-.051.195-.05.198-.048.201-.046.204-.045.208-.043.211-.041.214-.04.217-.038.22-.036.223-.034.226-.032.228-.031.231-.028.234-.027.236-.024.238-.023.241-.02.243-.019.245-.016.247-.015.249-.012.251-.01.253-.008.255-.005.256-.004.258-.001.258.001zm-9.258%2020.499v.01l.001.021.003.021.004.022.005.021.006.022.007.022.009.023.01.022.011.023.012.023.013.023.015.023.016.024.017.023.018.024.019.024.021.024.022.025.023.024.024.025.052.049.056.05.061.051.066.051.07.051.075.051.079.052.084.052.088.052.092.052.097.052.102.051.105.052.11.052.114.051.119.051.123.051.127.05.131.05.135.05.139.048.144.049.147.047.152.047.155.047.16.045.163.045.167.043.171.043.176.041.178.041.183.039.187.039.19.037.194.035.197.035.202.033.204.031.209.03.212.029.216.027.219.025.222.024.226.021.23.02.233.018.236.016.24.015.243.012.246.01.249.008.253.005.256.004.259.001.26-.001.257-.004.254-.005.25-.008.247-.011.244-.012.241-.014.237-.016.233-.018.231-.021.226-.021.224-.024.22-.026.216-.027.212-.028.21-.031.205-.031.202-.034.198-.034.194-.036.191-.037.187-.039.183-.04.179-.04.175-.042.172-.043.168-.044.163-.045.16-.046.155-.046.152-.047.148-.048.143-.049.139-.049.136-.05.131-.05.126-.05.123-.051.118-.052.114-.051.11-.052.106-.052.101-.052.096-.052.092-.052.088-.053.083-.051.079-.052.074-.052.07-.051.065-.051.06-.051.056-.05.051-.05.023-.024.023-.025.021-.024.02-.024.019-.024.018-.024.017-.024.015-.023.014-.024.013-.023.012-.023.01-.023.01-.022.008-.022.006-.022.006-.022.004-.022.004-.021.001-.021.001-.021v-4.127l-.077.055-.08.053-.083.054-.085.053-.087.052-.09.052-.093.051-.095.05-.097.05-.1.049-.102.049-.105.048-.106.047-.109.047-.111.046-.114.045-.115.045-.118.044-.12.043-.122.042-.124.042-.126.041-.128.04-.13.04-.132.038-.134.038-.135.037-.138.037-.139.035-.142.035-.143.034-.144.033-.147.032-.148.031-.15.03-.151.03-.153.029-.154.027-.156.027-.158.026-.159.025-.161.024-.162.023-.163.022-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.011-.178.01-.179.008-.179.008-.181.006-.182.005-.182.004-.184.003-.184.002h-.37l-.184-.002-.184-.003-.182-.004-.182-.005-.181-.006-.179-.008-.179-.008-.178-.01-.176-.011-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.022-.162-.023-.161-.024-.159-.025-.157-.026-.156-.027-.155-.027-.153-.029-.151-.03-.15-.03-.148-.031-.146-.032-.145-.033-.143-.034-.141-.035-.14-.035-.137-.037-.136-.037-.134-.038-.132-.038-.13-.04-.128-.04-.126-.041-.124-.042-.122-.042-.12-.044-.117-.043-.116-.045-.113-.045-.112-.046-.109-.047-.106-.047-.105-.048-.102-.049-.1-.049-.097-.05-.095-.05-.093-.052-.09-.051-.087-.052-.085-.053-.083-.054-.08-.054-.077-.054v4.127zm0-5.654v.011l.001.021.003.021.004.021.005.022.006.022.007.022.009.022.01.022.011.023.012.023.013.023.015.024.016.023.017.024.018.024.019.024.021.024.022.024.023.025.024.024.052.05.056.05.061.05.066.051.07.051.075.052.079.051.084.052.088.052.092.052.097.052.102.052.105.052.11.051.114.051.119.052.123.05.127.051.131.05.135.049.139.049.144.048.147.048.152.047.155.046.16.045.163.045.167.044.171.042.176.042.178.04.183.04.187.038.19.037.194.036.197.034.202.033.204.032.209.03.212.028.216.027.219.025.222.024.226.022.23.02.233.018.236.016.24.014.243.012.246.01.249.008.253.006.256.003.259.001.26-.001.257-.003.254-.006.25-.008.247-.01.244-.012.241-.015.237-.016.233-.018.231-.02.226-.022.224-.024.22-.025.216-.027.212-.029.21-.03.205-.032.202-.033.198-.035.194-.036.191-.037.187-.039.183-.039.179-.041.175-.042.172-.043.168-.044.163-.045.16-.045.155-.047.152-.047.148-.048.143-.048.139-.05.136-.049.131-.05.126-.051.123-.051.118-.051.114-.052.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.051.07-.052.065-.051.06-.05.056-.051.051-.049.023-.025.023-.024.021-.025.02-.024.019-.024.018-.024.017-.024.015-.023.014-.023.013-.024.012-.022.01-.023.01-.023.008-.022.006-.022.006-.022.004-.021.004-.022.001-.021.001-.021v-4.139l-.077.054-.08.054-.083.054-.085.052-.087.053-.09.051-.093.051-.095.051-.097.05-.1.049-.102.049-.105.048-.106.047-.109.047-.111.046-.114.045-.115.044-.118.044-.12.044-.122.042-.124.042-.126.041-.128.04-.13.039-.132.039-.134.038-.135.037-.138.036-.139.036-.142.035-.143.033-.144.033-.147.033-.148.031-.15.03-.151.03-.153.028-.154.028-.156.027-.158.026-.159.025-.161.024-.162.023-.163.022-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.011-.178.009-.179.009-.179.007-.181.007-.182.005-.182.004-.184.003-.184.002h-.37l-.184-.002-.184-.003-.182-.004-.182-.005-.181-.007-.179-.007-.179-.009-.178-.009-.176-.011-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.022-.162-.023-.161-.024-.159-.025-.157-.026-.156-.027-.155-.028-.153-.028-.151-.03-.15-.03-.148-.031-.146-.033-.145-.033-.143-.033-.141-.035-.14-.036-.137-.036-.136-.037-.134-.038-.132-.039-.13-.039-.128-.04-.126-.041-.124-.042-.122-.043-.12-.043-.117-.044-.116-.044-.113-.046-.112-.046-.109-.046-.106-.047-.105-.048-.102-.049-.1-.049-.097-.05-.095-.051-.093-.051-.09-.051-.087-.053-.085-.052-.083-.054-.08-.054-.077-.054v4.139zm0-5.666v.011l.001.02.003.022.004.021.005.022.006.021.007.022.009.023.01.022.011.023.012.023.013.023.015.023.016.024.017.024.018.023.019.024.021.025.022.024.023.024.024.025.052.05.056.05.061.05.066.051.07.051.075.052.079.051.084.052.088.052.092.052.097.052.102.052.105.051.11.052.114.051.119.051.123.051.127.05.131.05.135.05.139.049.144.048.147.048.152.047.155.046.16.045.163.045.167.043.171.043.176.042.178.04.183.04.187.038.19.037.194.036.197.034.202.033.204.032.209.03.212.028.216.027.219.025.222.024.226.021.23.02.233.018.236.017.24.014.243.012.246.01.249.008.253.006.256.003.259.001.26-.001.257-.003.254-.006.25-.008.247-.01.244-.013.241-.014.237-.016.233-.018.231-.02.226-.022.224-.024.22-.025.216-.027.212-.029.21-.03.205-.032.202-.033.198-.035.194-.036.191-.037.187-.039.183-.039.179-.041.175-.042.172-.043.168-.044.163-.045.16-.045.155-.047.152-.047.148-.048.143-.049.139-.049.136-.049.131-.051.126-.05.123-.051.118-.052.114-.051.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.052.07-.051.065-.051.06-.051.056-.05.051-.049.023-.025.023-.025.021-.024.02-.024.019-.024.018-.024.017-.024.015-.023.014-.024.013-.023.012-.023.01-.022.01-.023.008-.022.006-.022.006-.022.004-.022.004-.021.001-.021.001-.021v-4.153l-.077.054-.08.054-.083.053-.085.053-.087.053-.09.051-.093.051-.095.051-.097.05-.1.049-.102.048-.105.048-.106.048-.109.046-.111.046-.114.046-.115.044-.118.044-.12.043-.122.043-.124.042-.126.041-.128.04-.13.039-.132.039-.134.038-.135.037-.138.036-.139.036-.142.034-.143.034-.144.033-.147.032-.148.032-.15.03-.151.03-.153.028-.154.028-.156.027-.158.026-.159.024-.161.024-.162.023-.163.023-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.01-.178.01-.179.009-.179.007-.181.006-.182.006-.182.004-.184.003-.184.001-.185.001-.185-.001-.184-.001-.184-.003-.182-.004-.182-.006-.181-.006-.179-.007-.179-.009-.178-.01-.176-.01-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.023-.162-.023-.161-.024-.159-.024-.157-.026-.156-.027-.155-.028-.153-.028-.151-.03-.15-.03-.148-.032-.146-.032-.145-.033-.143-.034-.141-.034-.14-.036-.137-.036-.136-.037-.134-.038-.132-.039-.13-.039-.128-.041-.126-.041-.124-.041-.122-.043-.12-.043-.117-.044-.116-.044-.113-.046-.112-.046-.109-.046-.106-.048-.105-.048-.102-.048-.1-.05-.097-.049-.095-.051-.093-.051-.09-.052-.087-.052-.085-.053-.083-.053-.08-.054-.077-.054v4.153zm8.74-8.179l-.257.004-.254.005-.25.008-.247.011-.244.012-.241.014-.237.016-.233.018-.231.021-.226.022-.224.023-.22.026-.216.027-.212.028-.21.031-.205.032-.202.033-.198.034-.194.036-.191.038-.187.038-.183.04-.179.041-.175.042-.172.043-.168.043-.163.045-.16.046-.155.046-.152.048-.148.048-.143.048-.139.049-.136.05-.131.05-.126.051-.123.051-.118.051-.114.052-.11.052-.106.052-.101.052-.096.052-.092.052-.088.052-.083.052-.079.052-.074.051-.07.052-.065.051-.06.05-.056.05-.051.05-.023.025-.023.024-.021.024-.02.025-.019.024-.018.024-.017.023-.015.024-.014.023-.013.023-.012.023-.01.023-.01.022-.008.022-.006.023-.006.021-.004.022-.004.021-.001.021-.001.021.001.021.001.021.004.021.004.022.006.021.006.023.008.022.01.022.01.023.012.023.013.023.014.023.015.024.017.023.018.024.019.024.02.025.021.024.023.024.023.025.051.05.056.05.06.05.065.051.07.052.074.051.079.052.083.052.088.052.092.052.096.052.101.052.106.052.11.052.114.052.118.051.123.051.126.051.131.05.136.05.139.049.143.048.148.048.152.048.155.046.16.046.163.045.168.043.172.043.175.042.179.041.183.04.187.038.191.038.194.036.198.034.202.033.205.032.21.031.212.028.216.027.22.026.224.023.226.022.231.021.233.018.237.016.241.014.244.012.247.011.25.008.254.005.257.004.26.001.26-.001.257-.004.254-.005.25-.008.247-.011.244-.012.241-.014.237-.016.233-.018.231-.021.226-.022.224-.023.22-.026.216-.027.212-.028.21-.031.205-.032.202-.033.198-.034.194-.036.191-.038.187-.038.183-.04.179-.041.175-.042.172-.043.168-.043.163-.045.16-.046.155-.046.152-.048.148-.048.143-.048.139-.049.136-.05.131-.05.126-.051.123-.051.118-.051.114-.052.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.051.07-.052.065-.051.06-.05.056-.05.051-.05.023-.025.023-.024.021-.024.02-.025.019-.024.018-.024.017-.023.015-.024.014-.023.013-.023.012-.023.01-.023.01-.022.008-.022.006-.023.006-.021.004-.022.004-.021.001-.021.001-.021-.001-.021-.001-.021-.004-.021-.004-.022-.006-.021-.006-.023-.008-.022-.01-.022-.01-.023-.012-.023-.013-.023-.014-.023-.015-.024-.017-.023-.018-.024-.019-.024-.02-.025-.021-.024-.023-.024-.023-.025-.051-.05-.056-.05-.06-.05-.065-.051-.07-.052-.074-.051-.079-.052-.083-.052-.088-.052-.092-.052-.096-.052-.101-.052-.106-.052-.11-.052-.114-.052-.118-.051-.123-.051-.126-.051-.131-.05-.136-.05-.139-.049-.143-.048-.148-.048-.152-.048-.155-.046-.16-.046-.163-.045-.168-.043-.172-.043-.175-.042-.179-.041-.183-.04-.187-.038-.191-.038-.194-.036-.198-.034-.202-.033-.205-.032-.21-.031-.212-.028-.216-.027-.22-.026-.224-.023-.226-.022-.231-.021-.233-.018-.237-.016-.241-.014-.244-.012-.247-.011-.25-.008-.254-.005-.257-.004-.26-.001-.26.001z%22%3E%3C%2Fpath%3E%3C%2Fsymbol%3E%3C%2Fdefs%3E%3Cdefs%3E%3Csymbol%20id%3D%22clock%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20transform%3D%22scale\(.5\)%22%20d%3D%22M12%202c5.514%200%2010%204.486%2010%2010s-4.486%2010-10%2010-10-4.486-10-10%204.486-10%2010-10zm0-2c-6.627%200-12%205.373-12%2012s5.373%2012%2012%2012%2012-5.373%2012-12-5.373-12-12-12zm5.848%2012.459c.202.038.202.333.001.372-1.907.361-6.045%201.111-6.547%201.111-.719%200-1.301-.582-1.301-1.301%200-.512.77-5.447%201.125-7.445.034-.192.312-.181.343.014l.985%206.238%205.394%201.011z%22%3E%3C%2Fpath%3E%3C%2Fsymbol%3E%3C%2Fdefs%3E%3Cdefs%3E%3Cmarker%20id%3D%22arrowhead%22%20refX%3D%227.9%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2212%22%20markerHeight%3D%2212%22%20orient%3D%22auto-start-reverse%22%3E%3Cpath%20d%3D%22M%20-1%200%20L%2010%205%20L%200%2010%20z%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3Cdefs%3E%3Cmarker%20id%3D%22crosshead%22%20markerWidth%3D%2215%22%20markerHeight%3D%228%22%20orient%3D%22auto%22%20refX%3D%224%22%20refY%3D%224.5%22%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%23000000%22%20stroke-width%3D%221pt%22%20d%3D%22M%201%2C2%20L%206%2C7%20M%206%2C2%20L%201%2C7%22%20style%3D%22stroke-dasharray%3A%200%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3Cdefs%3E%3Cmarker%20id%3D%22filled-head%22%20refX%3D%2215.5%22%20refY%3D%227%22%20markerWidth%3D%2220%22%20markerHeight%3D%2228%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%2018%2C7%20L9%2C13%20L14%2C7%20L9%2C1%20Z%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3Cdefs%3E%3Cmarker%20id%3D%22sequencenumber%22%20refX%3D%2215%22%20refY%3D%2215%22%20markerWidth%3D%2260%22%20markerHeight%3D%2240%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%226%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3Ctext%20x%3D%22179%22%20y%3D%2280%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ESave%20workflow%20state%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22119%22%20x2%3D%22281%22%20y2%3D%22119%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22279%22%20y%3D%22134%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EAppend%20TaskCompleted%20event%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22173%22%20x2%3D%22481%22%20y2%3D%22173%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22179%22%20y%3D%22188%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ESave%20checkpoint%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22227%22%20x2%3D%22281%22%20y2%3D%22227%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22379%22%20y%3D%22242%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EPublish%20next%20task%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22281%22%20x2%3D%22681%22%20y2%3D%22281%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%2276%22%20y%3D%22296%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EProcess%20crashes%3C%2Ftext%3E%3Cpath%20d%3D%22M%2076%2C335%20C%20136%2C325%20136%2C365%2076%2C355%22%20class%3D%22messageLine1%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23crosshead\)%22%20style%3D%22stroke-dasharray%3A%203%2C%203%3B%20fill%3A%20none%3B%22%3E%3C%2Fpath%3E%3Ctext%20x%3D%22627%22%20y%3D%22380%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ELoad%20latest%20checkpoint%3C%2Ftext%3E%3Cline%20x1%3D%22965%22%20y1%3D%22419%22%20x2%3D%22289%22%20y2%3D%22419%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22727%22%20y%3D%22434%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EReplay%20events%20after%20checkpoint%3C%2Ftext%3E%3Cline%20x1%3D%22965%22%20y1%3D%22473%22%20x2%3D%22489%22%20y2%3D%22473%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22827%22%20y%3D%22488%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EInspect%20pending%20messages%3C%2Ftext%3E%3Cline%20x1%3D%22965%22%20y1%3D%22527%22%20x2%3D%22689%22%20y2%3D%22527%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22627%22%20y%3D%22542%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EReconcile%20task%20statuses%3C%2Ftext%3E%3Cline%20x1%3D%22965%22%20y1%3D%22581%22%20x2%3D%22289%22%20y2%3D%22581%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22967%22%20y%3D%22596%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EDetermine%20safe%20resume%20point%3C%2Ftext%3E%3Cpath%20d%3D%22M%20967%2C635%20C%201027%2C625%201027%2C665%20967%2C655%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fpath%3E%3Ctext%20x%3D%22827%22%20y%3D%22680%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ERetry%20or%20dispatch%20missing%20task%3C%2Ftext%3E%3Cline%20x1%3D%22965%22%20y1%3D%22719%22%20x2%3D%22689%22%20y2%3D%22719%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22627%22%20y%3D%22734%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EPersist%20resumed%20state%3C%2Ftext%3E%3Cline%20x1%3D%22965%22%20y1%3D%22773%22%20x2%3D%22289%22%20y2%3D%22773%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3C%2Fsvg%3E)

The replacement Coordinator does not reconstruct the workflow from the original user prompt alone. It loads the durable execution context and reconciles the last known state.

# 13. Recovery algorithm

A practical recovery sequence is:

```
1. Identify the failed workflow.
2. Load the latest checkpoint.
3. Load events after that checkpoint.
4. Replay those events.
5. Inspect pending and running tasks.
6. Reconcile uncertain external operations.
7. Check message delivery and acknowledgment state.
8. Determine the next safe task.
9. Resume, retry, reroute, or compensate.
10. Persist a WorkflowResumed event.
```

Example:

Python

Run

```
async def recover_workflow(workflow_id, state_store, event_store):
    checkpoint = await state_store.get_latest_checkpoint(workflow_id)

    state = checkpoint["state"]

    events = await event_store.get_events_after(
        workflow_id=workflow_id,
        sequence_number=checkpoint["sequence_number"],
    )

    for event in events:
        state = apply_event(state, event)

    await reconcile_uncertain_tasks(state)

    next_action = determine_recovery_action(state)

    await event_store.append({
        "event_type": "WorkflowResumed",
        "workflow_id": workflow_id,
        "payload": {
            "resumed_from_checkpoint": checkpoint["checkpoint_id"],
            "next_action": next_action,
        },
    })

    return next_action
```

# 14. Replay and workflow determinism

Replay is reliable only when state transitions are deterministic.

Potential sources of nondeterminism include:

* Current time

* Random numbers

* External API responses

* LLM outputs

* Tool results

* Network-dependent decisions

* Concurrent task completion order

For reproducible behavior, CWD should persist important inputs and outputs.

Python

Run

```
replay_metadata = {
    "model": "selected-model",
    "model_version": "provider-version",
    "prompt_version": "prompt-v3",
    "tool_arguments": {
        "customer_id": "cust-123",
    },
    "tool_result": {
        "order_status": "delayed",
    },
    "routing_decision": "delivery_support_worker",
}
```

During audit replay, CWD can use the recorded tool result instead of calling the live tool again.

```
Recorded tool result → Deterministic replay
```

For an actual new execution, CWD may intentionally call the live tool and produce a new event.

# 15. LLM workflow replay

LLM outputs may vary even with the same prompt.

To reproduce an agent decision, CWD should persist:

* Model and provider

* Model version

* System prompt version

* User prompt

* Conversation context

* Tool definitions

* Tool results

* Sampling parameters

* Routing decision

* Output

* Token usage

* Correlation and trace IDs

Example:

Python

Run

```
llm_execution = {
    "task_id": "task-3002",
    "model": "gpt-model",
    "prompt_version": "support-v5",
    "input_messages": [
        {
            "role": "user",
            "content": "Where is my order?",
        }
    ],
    "tool_results": [
        {
            "tool": "get_order_status",
            "result": {
                "status": "delayed",
            },
        }
    ],
    "output": "Your order is delayed.",
    "usage": {
        "input_tokens": 120,
        "output_tokens": 35,
    },
}
```

There are two different replay modes:

|
Replay mode

|

Behavior

|
| --- | --- |
|

State replay

|

Reconstruct state using recorded outputs

|
|

Re-execution

|

Call the LLM or tool again

|

State replay is safer for recovery and auditing. Re-execution is useful for testing changes, but it may produce a different result.

# 16. Event replay versus task re-execution

These should not be confused.

## Event replay

```
TaskCompleted event
    ↓
Mark task completed
```

## Task re-execution

```
TaskCompleted event missing or task status uncertain
    ↓
Check external state
    ↓
Execute task again if safe
```

The Coordinator should not re-execute a task merely because it is replaying historical events.

# 17. Checkpoint frequency

Checkpointing too rarely increases recovery work.

Checkpointing too frequently increases storage and write overhead.

Good checkpoint boundaries include:

* After workflow initialization

* After each major domain task

* After important external side effects

* Before entering a long-running step

* After compensation actions

* Before and after human approval

* Before waiting for asynchronous work

* After final response persistence

For long-running workflows:

```
Checkpoint → Long task → Checkpoint → Next task
```

For short workflows, checkpointing after major steps may be sufficient.

# 18. Exactly-once versus at-least-once execution

Distributed systems commonly provide at-least-once delivery:

```
A message may be delivered more than once.
```

Therefore, CWD should design for:

```
At-least-once execution
+
Idempotent task handling
+
Deduplicated side effects
```

This is often more realistic than assuming exactly-once execution across all services.

Example:

```
Message delivered twice
    ↓
Same task ID and idempotency key
    ↓
Second execution detects existing result
    ↓
No duplicate business effect
```

# 19. Replay and compensation

Replay is also useful for recovering incomplete compensation.

```
PaymentCharged
OrderCreationFailed
RefundRequested
RefundTimedOut
```

After recovery, CWD can reconstruct:

```
Payment: charged
Order: not created
Refund: status unknown
```

It should then reconcile the refund status before issuing another refund.

```
Replay history
    ↓
Identify incomplete compensation
    ↓
Query payment provider
    ↓
Confirm refund or retry safely
```

# 20. Audit and debugging

Replay allows CWD to answer:

* Which Worker made the decision?

* What context was provided?

* Which tools were called?

* Which task failed?

* What state existed before failure?

* Why was a fallback selected?

* Was a message delivered twice?

* Why did the workflow resume from a particular checkpoint?

* Which compensation actions were executed?

Example timeline:

```
21:00:00 WorkflowStarted
21:00:01 TaskAssigned: retrieve_customer_data
21:00:03 TaskCompleted: retrieve_customer_data
21:00:04 TaskAssigned: analyze_issue
21:00:08 TaskCompleted: analyze_issue
21:00:09 CheckpointCreated: cp-004
21:00:10 TaskAssigned: generate_response
21:00:15 CoordinatorFailed
21:00:20 WorkflowResumed
21:00:22 TaskCompleted: generate_response
21:00:23 WorkflowCompleted
```

This provides a complete operational history rather than only the final error message.

# 21. Recommended CWD architecture

```
                    ┌─────────────────────┐
                    │     Coordinator     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       State Store        Event Log       Message Broker
              │                │                │
              ▼                ▼                ▼
        Checkpoints       Event Replay      Pending Tasks
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    Recovery Manager
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
           Resume            Retry          Compensate
```

The Recovery Manager should coordinate:

* Checkpoint loading

* Event replay

* Message reconciliation

* Task-state reconciliation

* External status checks

* Safe resumption

* Compensation recovery

* Audit logging

# 22. Best practices

```
1. Persist workflow state outside Coordinator memory.
2. Assign stable request, workflow, and task IDs.
3. Use immutable events with sequence numbers.
4. Create checkpoints at meaningful state boundaries.
5. Replay events only to reconstruct state.
6. Never execute external side effects during ordinary event replay.
7. Store tool results and LLM outputs for reproducibility.
8. Make message processing idempotent.
9. Reconcile uncertain external operations before retrying.
10. Persist compensation state and recovery decisions.
11. Use checkpoints to avoid replaying the entire history.
12. Preserve the original request context across recovery.
13. Record workflow version and prompt/model versions.
14. Make recovery actions observable and auditable.
15. Distinguish state replay from live task re-execution.
```

## Interview-ready explanation

> CWD uses persisted execution state, checkpoints, events, and durable messages to recover failed workflows and reproduce their behavior. The Coordinator stores the current workflow state and creates checkpoints after meaningful execution boundaries. Immutable events record task assignments, completions, failures, messages, and compensation actions. When a Coordinator or Worker fails, the Recovery Manager loads the latest checkpoint, replays subsequent events, reconciles pending messages and uncertain external operations, and resumes from the next safe step. Replay reconstructs state but does not re-execute external side effects. Idempotency keys, deduplication, and recorded tool or LLM outputs prevent duplicate actions and improve reproducibility. This allows CWD to recover production executions without losing request context while also supporting debugging, auditing, and deterministic workflow analysis.


## Simple mental model

```
Persisted state = Where are we now?
Checkpoint       = Where can we safely restart?
Event log        = What happened?
Message          = What work was requested or delivered?
Replay           = Reconstruct the workflow state
Recovery         = Decide what to resume, retry, reconcile, or compensate
```

The central rule: replay historical facts; do not blindly replay side effects.

For example, replaying `PaymentCharged` should restore the payment state, not charge the customer again. If the payment result is uncertain, CWD must reconcile the external payment status before taking another action.

This design allows CWD to recover failed production workflows, preserve the original request context, avoid duplicate business effects, and reproduce the reasoning and execution history for debugging and audit.
