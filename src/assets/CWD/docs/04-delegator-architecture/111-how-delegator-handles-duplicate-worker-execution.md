In **CWD**, duplicate Worker execution is prevented mainly through **idempotency, execution state, unique execution IDs, and checkpointing**.

This is important because in a distributed agent system, a Worker might accidentally be invoked twice because of a retry, network timeout, workflow resume, or duplicate message.

### 1. Give every Worker execution a unique ID

CWD can create an execution identity such as:

```text
request_id = REQ-123
run_id     = RUN-456
worker_id  = ContractWorker
execution_id = RUN-456-ContractWorker
```

So the system can identify:

> “Has `ContractWorker` already executed for this particular workflow run?”

---

### 2. Check execution state before running

The Delegator/LangGraph state tracks Worker status:

```python
state["worker_status"] = {
    "CustomerProfileWorker": "SUCCESS",
    "ContractWorker": "SUCCESS",
    "SalesHistoryWorker": "PENDING"
}
```

Before executing `ContractWorker`:

```text
ContractWorker
      ↓
Check state
      ↓
Already SUCCESS?
   /       \
 Yes        No
 ↓           ↓
Skip       Execute
```

So if the workflow resumes after a failure, successful Workers are **not executed again unnecessarily**.

---

### 3. Checkpointing prevents duplicate execution during resume

Suppose:

```text
CustomerProfileWorker → SUCCESS
ContractWorker        → SUCCESS
SalesHistoryWorker    → FAILED
```

LangGraph checkpoints this state.

After recovery:

```text
Checkpoint
    ↓
CustomerProfileWorker → SKIP
ContractWorker        → SKIP
SalesHistoryWorker    → RETRY
```

So CWD resumes from the failed portion rather than restarting the entire workflow.

---

### 4. Use idempotency keys

For operations that change data, state checking alone isn't enough.

Example:

```text
Create ServiceNow ticket
```

If the request is retried, we don't want:

```text
Attempt 1 → Ticket #1001 created
Attempt 2 → Ticket #1002 created   ❌
```

Instead, the Worker sends an idempotency key:

```text
idempotency_key = REQ-123-create-ticket
```

The downstream system or an idempotency store checks:

```text
Has this operation already been completed?
       /              \
     Yes               No
      ↓                 ↓
Return existing      Execute
result
```

Result:

```text
Attempt 1 → Ticket #1001 created
Attempt 2 → Existing Ticket #1001 returned
```

---

### 5. Separate "started" from "completed"

A Worker shouldn't simply use:

```text
SUCCESS / NOT SUCCESS
```

For reliable distributed execution, it is useful to track:

```text
PENDING
RUNNING
SUCCESS
FAILED
TIMED_OUT
BLOCKED
```

For example:

```text
ContractWorker
     ↓
RUNNING
     ↓
Salesforce request
     ↓
TIMEOUT
```

The difficult case is:

```text
Worker → Salesforce
        ↓
Salesforce created the ticket
        ↓
Network response was lost
        ↓
Worker thinks it failed
```

CWD may retry, even though the operation actually succeeded.

This is why **idempotency keys are critical for side-effecting operations**.

---

### 6. Use a unique operation key

For example:

```python
operation_key = (
    request_id,
    run_id,
    worker_id,
    business_operation
)
```

Conceptually:

```text
REQ-123
   +
RUN-456
   +
CreateServiceTicket
   ↓
Unique operation key
```

Store the result:

```python
{
    "operation_key": "REQ-123:RUN-456:CreateServiceTicket",
    "status": "SUCCESS",
    "result": {
        "ticket_id": "INC001234"
    }
}
```

If the same operation arrives again, CWD can return the existing result.

---

### 7. Duplicate messages are also possible

Suppose CWD uses a queue:

```text
Service Bus
    ↓
Worker
```

A message may occasionally be delivered again.

The Worker should therefore use **deduplication/idempotency**, rather than assuming:

> “I will receive this message exactly once.”

The processing pattern becomes:

```text
Message
   ↓
Check operation key
   ↓
Already processed?
  /       \
Yes        No
 ↓          ↓
Return     Execute
existing
result
```

---

### 8. Don't blindly deduplicate every retry

This distinction is important.

Suppose:

```text
Attempt 1 → TIMEOUT before execution
```

It is usually safe to retry.

But:

```text
Attempt 1 → operation may have completed
```

The system should first determine whether the operation already happened.

So:

```text
Transient failure
      ↓
Retry
      ↓
Idempotency check
      ↓
Execute only if not already completed
```

---

### 9. Parallel execution needs duplicate protection too

Suppose two branches accidentally try to invoke the same Worker:

```text
Delegator
   ├── Branch A → ContractWorker
   └── Branch B → ContractWorker
```

Both may see `PENDING` at nearly the same time.

A simple read-then-write check can have a race condition.

Therefore, the execution record should use an **atomic claim/lock**:

```text
Branch A → claim execution key → SUCCESSFUL CLAIM
Branch B → claim execution key → ALREADY CLAIMED
```

Only Branch A executes the Worker.

This can be implemented with a datastore supporting conditional writes/transactions, depending on the platform.

---

## Technology mapping

| Mechanism                    | Purpose                                            |
| ---------------------------- | -------------------------------------------------- |
| **LangGraph State**          | Tracks Worker execution status                     |
| **Checkpointing**            | Prevents unnecessary rerunning during resume       |
| **Execution ID**             | Uniquely identifies a Worker execution             |
| **Idempotency Key**          | Prevents duplicate side effects                    |
| **Atomic claim / lock**      | Prevents concurrent duplicate execution            |
| **Redis/Cosmos DB/DynamoDB** | Stores execution/idempotency records               |
| **Service Bus**              | Queue delivery; consumers still need deduplication |
| **Worker**                   | Enforces idempotent operation behavior             |
| **Observability**            | Detects duplicate execution attempts               |

### CWD example

For a ServiceNow ticket Worker:

```text
Coordinator
    ↓
IT Delegator
    ↓
IncidentWorker
    ↓
MCP
    ↓
ServiceNow
```

Request:

```text
REQ-123
Create incident for customer C123
```

The Worker creates:

```text
idempotency_key = REQ-123:CreateIncident:C123
```

First attempt:

```text
Key not found
    ↓
Create incident
    ↓
INC001234
    ↓
Store result
```

Duplicate attempt:

```text
Same key found
    ↓
Do NOT create another incident
    ↓
Return INC001234
```



> **“In CWD, we prevent duplicate Worker execution using execution state, unique execution IDs, checkpointing, and idempotency keys. Before executing, the Delegator checks whether that Worker has already completed for the current workflow run. For side-effecting operations such as creating a ServiceNow ticket, we use an idempotency key so even if a timeout or duplicate message causes a retry, the operation is performed only once and the existing result is returned. For concurrent duplicate attempts, we use an atomic execution claim or lock. This gives us safe retry and resume behavior without creating duplicate business side effects.”**

**One line to remember:**

**State prevents unnecessary reruns; idempotency prevents duplicate side effects; atomic claims prevent concurrent duplicates.**
