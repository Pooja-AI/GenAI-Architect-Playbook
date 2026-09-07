# Agent Failure Scenarios & Recovery Strategies in CWD

This is a critical **production reliability concept** for the Coordinator–Delegator–Worker architecture.

The key idea is:

> **An agentic system should not assume that every agent, tool, LLM, database, or workflow step will succeed. CWD must detect failures, classify them, and select the appropriate recovery strategy without blindly retrying everything.**

---

## 1. Failure Management Model

```text
                Agent Task
                    │
                    ▼
               Execute Step
                    │
              ┌─────┴─────┐
              │            │
           Success       Failure
              │            │
              ▼            ▼
           Continue    Classify Error
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
           Retry        Fallback       Escalate
             │             │             │
             ▼             ▼             ▼
          Recover      Alternate      Human
             │          Path           Review
             └─────────────┬─────────────┘
                           ▼
                     Continue / Stop
```

The recovery decision should be based on:

```text
Error Type
+ Retryability
+ Deadline
+ Attempt Count
+ Idempotency
+ Agent Health
+ Dependency Health
+ Business Risk
+ Policy
```

---

# 2. Common Agent Failure Scenarios

| Failure                | Example                       | Typical Recovery            |
| ---------------------- | ----------------------------- | --------------------------- |
| LLM timeout            | Model doesn't respond         | Retry/fallback              |
| LLM rate limit         | Too many requests             | Backoff/retry/model routing |
| Tool timeout           | API takes too long            | Retry/circuit breaker       |
| Tool failure           | API returns 500               | Retry/fallback              |
| Invalid tool arguments | Wrong shipment ID             | Correct/replan              |
| Worker unavailable     | Worker offline                | Rediscover/reassign         |
| Agent overload         | Queue growing                 | Load balancing/autoscaling  |
| RAG failure            | Search unavailable            | Retry/fallback              |
| Bad retrieval          | Wrong documents               | Re-query/re-rank            |
| Malformed output       | Worker returns invalid schema | Retry/replan                |
| Authorization failure  | Access denied                 | Stop/escalate               |
| Policy violation       | Action not permitted          | Stop                        |
| Dependency failure     | DB unavailable                | Retry/circuit breaker       |
| Network failure        | Connection lost               | Retry                       |
| Duplicate execution    | Message redelivered           | Idempotency                 |
| Human approval timeout | No approval                   | Escalate/cancel             |
| Context overflow       | Too much context              | Summarize/retrieve less     |
| Infinite loop          | Agent repeatedly retries      | Max-step/deadline           |
| Partial failure        | One branch fails              | Partial result/fallback     |

---

# 3. Error Classification Comes First

Never immediately retry an exception.

First classify it.

```python
def classify_error(error):

    if error.timeout:
        return "TRANSIENT"

    if error.status_code == 429:
        return "RATE_LIMIT"

    if error.status_code >= 500:
        return "DEPENDENCY_FAILURE"

    if error.status_code in (401, 403):
        return "AUTHORIZATION_FAILURE"

    if error.validation_error:
        return "INVALID_INPUT"

    if error.business_rule_violation:
        return "BUSINESS_FAILURE"

    return "UNKNOWN"
```

Then:

```text
TRANSIENT
   ↓
Retry

RATE_LIMIT
   ↓
Backoff + Retry

DEPENDENCY_FAILURE
   ↓
Retry / Circuit Breaker

INVALID_INPUT
   ↓
Replan / Ask User

AUTHORIZATION
   ↓
STOP

BUSINESS_FAILURE
   ↓
Business Recovery

HIGH-RISK
   ↓
Human Escalation
```

---

# 4. Retry Strategy

Retry is appropriate when failure is likely temporary.

Examples:

```text
Network timeout
HTTP 503
Temporary database failure
LLM transient failure
Rate limit
Temporary MCP failure
```

### Basic retry

```python
import time


def retry_operation(operation, max_attempts=3):

    for attempt in range(1, max_attempts + 1):

        try:
            return operation()

        except Exception as error:

            if attempt == max_attempts:
                raise

            time.sleep(2 ** attempt)
```

This gives:

```text
Attempt 1 → failure
     ↓
2 sec
     ↓
Attempt 2 → failure
     ↓
4 sec
     ↓
Attempt 3 → success
```

---

# 5. Exponential Backoff + Jitter

In production, don't make thousands of agents retry at exactly the same time.

Bad:

```text
All agents
   ↓
retry after 5 seconds
   ↓
dependency receives huge traffic spike
```

Use:

```text
Exponential Backoff
+
Random Jitter
```

Conceptually:

$$
Delay =
min(MaxDelay,\ BaseDelay \times 2^{attempt})
+
Jitter
$$

Example:

```python
import random


def retry_delay(attempt):

    base = 2 ** attempt

    jitter = random.uniform(0, 1)

    return min(base + jitter, 30)
```

---

# 6. Never Blindly Retry

Consider:

```text
create_payment()
```

If the first request succeeds but the response is lost, retrying could create a duplicate payment.

Therefore:

```text
Retry
+
Idempotency Key
```

Example:

```json
{
  "operation": "create_payment",
  "idempotency_key": "PAY-REQ-12345"
}
```

The backend can recognize:

```text
PAY-REQ-12345 already processed
```

and avoid duplicate execution.

---

# 7. Timeout Strategy

Every distributed operation should have a deadline.

Example:

```text
Coordinator
   timeout = 30 sec

Delegator
   timeout = 20 sec

Worker
   timeout = 10 sec

MCP
   timeout = 5 sec

Enterprise API
   timeout = 3 sec
```

Don't let downstream timeout exceed the parent deadline.

Example:

```python
def execute_with_timeout(operation, timeout_seconds):

    # Conceptual implementation
    result = run_with_deadline(
        operation,
        timeout_seconds
    )

    return result
```

A timeout should produce structured state:

```json
{
  "status": "timeout",
  "retryable": true,
  "attempt": 2,
  "deadline_exceeded": true
}
```

---

# 8. Timeout ≠ Failure of the Business Operation

This is subtle and important.

Suppose:

```text
Worker
 ↓
Create Ticket API
 ↓
Ticket created
 ↓
Network response lost
 ↓
Worker timeout
```

The Worker sees:

```text
TIMEOUT
```

but the business operation may actually be:

```text
SUCCESS
```

This is why idempotency and reconciliation are important.

---

# 9. Fallback Strategy

Fallback means:

> **Use an alternative approved execution path when the preferred path cannot complete.**

Example:

```text
Primary Worker
      │
      ▼
Unavailable
      │
      ▼
Agent Registry
      │
      ▼
Alternative Worker
      │
      ▼
Execute
```

Example:

```text
tracking-worker-v2
       ↓
   unavailable
       ↓
tracking-worker-v1
       ↓
   execute
```

But the fallback must satisfy:

```text
Capability
+
Authorization
+
Version Compatibility
+
Health
+
Readiness
+
Policy
```

---

# 10. Agent Failover

Suppose:

```text
Coordinator
     ↓
Agent Registry
     ↓
Shipping Agent A
     ↓
FAILED
```

CWD can rediscover:

```text
Agent Registry
      ↓
Shipping Agent B
      ↓
A2A
      ↓
Continue
```

LangGraph can represent this as:

```text
Execute Agent
     │
     ├── success ──────→ Aggregate
     │
     └── failure
            │
            ▼
       Rediscover
            │
            ▼
      Alternate Agent
```

---

# 11. Circuit Breaker

A circuit breaker protects a failing dependency.

Without one:

```text
Worker
 ↓
API failing
 ↓
Retry
 ↓
Retry
 ↓
Retry
 ↓
More Workers retry
 ↓
API overloaded further
```

This can create a **retry storm**.

Circuit breaker:

```text
              ┌─────────────┐
              │   CLOSED    │
              └──────┬──────┘
                     │ failures
                     ▼
              ┌─────────────┐
              │    OPEN     │
              └──────┬──────┘
                     │ cooldown
                     ▼
              ┌─────────────┐
              │ HALF-OPEN   │
              └──────┬──────┘
                 │         │
             success      failure
                 │         │
                 ▼         ▼
              CLOSED      OPEN
```

### States

**Closed**

```text
Requests allowed
```

**Open**

```text
Requests blocked
```

**Half-open**

```text
Allow limited test traffic
```

---

# 12. Circuit Breaker Example

```python
class CircuitBreaker:

    def __init__(self, failure_threshold=5):
        self.failures = 0
        self.threshold = failure_threshold
        self.state = "CLOSED"

    def call(self, operation):

        if self.state == "OPEN":
            raise Exception(
                "Circuit is open"
            )

        try:

            result = operation()

            self.failures = 0
            self.state = "CLOSED"

            return result

        except Exception:

            self.failures += 1

            if self.failures >= self.threshold:
                self.state = "OPEN"

            raise
```

Production implementations should additionally include:

```text
Cooldown
Half-open state
Failure windows
Concurrency control
Metrics
Distributed coordination
```

---

# 13. Error Handling

A Worker should return structured errors instead of arbitrary exceptions.

```json
{
  "task_id": "TASK-1001",
  "status": "failed",

  "error": {
    "code": "MCP_TIMEOUT",
    "type": "TRANSIENT",
    "message": "Shipping API timed out",
    "retryable": true,
    "attempt": 2
  }
}
```

This allows the Delegator to make a deterministic recovery decision.

---

# 14. Worker Failure

Example:

```text
Delegator
    ↓
Tracking Worker
    ↓
Worker unavailable
```

The Delegator should not simply fail the entire enterprise workflow.

Possible recovery:

```text
Worker Failure
      ↓
Check Error Type
      ↓
Retry same Worker?
      │
      ├── Yes
      │
      └── No
           ↓
      Agent Registry
           ↓
     Find alternate
           ↓
        Execute
```

---

# 15. RAG Failure

Suppose Azure AI Search is temporarily unavailable.

Bad:

```text
RAG failed
 ↓
LLM answers from memory
```

This may create an unsupported answer.

Better:

```text
RAG failure
    ↓
Retry
    ↓
Still unavailable?
    ↓
Approved fallback
    ├── Alternate search path
    ├── Cached authorized result
    ├── Ask user to retry
    └── Escalate
```

For high-confidence enterprise answers:

```text
No authorized evidence
        ↓
Do NOT fabricate
        ↓
Return controlled response
```

---

# 16. Tool Failure

Example:

```text
Worker
 ↓
MCP
 ↓
get_shipment_status()
 ↓
Timeout
```

Recovery:

```text
Timeout
   ↓
Is retryable?
   ↓
YES
   ↓
Retry with backoff
   ↓
Still failing?
   ↓
Circuit breaker
   ↓
Alternate approved tool/API
   ↓
Return result
```

---

# 17. Authorization Failure

This should generally **not be retried**.

```text
Worker
 ↓
MCP Tool
 ↓
403 Forbidden
```

Do not:

```text
Retry
Retry
Retry
```

Instead:

```text
Authorization Failure
        ↓
Stop operation
        ↓
Audit event
        ↓
Controlled response
```

Why?

Because authorization failure is normally a **security decision**, not a transient infrastructure problem.

---

# 18. Human Escalation

Some failures cannot safely be solved automatically.

Examples:

```text
High-risk transaction
Ambiguous business decision
Sensitive data request
Repeated execution failure
Policy exception
Conflicting enterprise records
Low confidence
Human approval required
```

Architecture:

```text
Agent
  ↓
Risk Evaluation
  ↓
Human Approval Required
  ↓
Checkpoint
  ↓
Human
  ↓
Approve / Reject / Modify
  ↓
Resume Workflow
```

LangGraph is particularly useful here because workflow state can be checkpointed around an approval gate.

---

# 19. Human Escalation Example

```json
{
  "status": "waiting_for_approval",

  "task_id": "TASK-1001",

  "approval": {
    "required": true,
    "reason": "High-risk rerouting operation",
    "requested_by": "shipping-worker",
    "approval_type": "business_owner"
  }
}
```

The workflow becomes:

```text
Worker
 ↓
Risk Check
 ↓
HITL
 ↓
Checkpoint
 ↓
WAIT
 ↓
Human Decision
 ↓
Resume
```

---

# 20. Partial Failure

Multi-agent workflows frequently experience partial failures.

Example:

```text
              Coordinator
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   Finance      Shipping      HR
      ✓            ✓           ✗
```

Possible outcome:

```json
{
  "status": "partial",

  "results": {
    "finance": "completed",
    "shipping": "completed"
  },

  "failures": {
    "hr": {
      "type": "timeout",
      "retryable": true
    }
  }
}
```

The Coordinator can decide:

```text
Retry HR
   OR
Return partial result
   OR
Ask user
   OR
Escalate
```

---

# 21. Recovery Using LangGraph

LangGraph can model recovery explicitly:

```text
START
  ↓
Validate
  ↓
Execute
  ↓
Check Result
  │
  ├── SUCCESS ───────→ Aggregate
  │
  ├── RETRYABLE ─────→ Retry
  │                         │
  │                         └── max attempts?
  │                                ↓
  │                              Fallback
  │
  ├── AUTH FAILURE ──→ Stop
  │
  ├── POLICY FAILURE → Human / Stop
  │
  └── UNKNOWN ───────→ Escalate
```

The important point:

> **LangGraph controls the recovery workflow; it does not independently decide security policy.**

Policy/IAM determines whether an operation is allowed.

---

# 22. Recovery Decision Function

A useful conceptual implementation:

```python
def recovery_decision(error, state):

    if error.type == "AUTHORIZATION_FAILURE":
        return "STOP"

    if error.type == "POLICY_FAILURE":
        return "ESCALATE"

    if error.type == "TRANSIENT":

        if state.attempt < state.max_attempts:
            return "RETRY"

        return "FALLBACK"

    if error.type == "RATE_LIMIT":
        return "BACKOFF_RETRY"

    if error.type == "WORKER_UNAVAILABLE":
        return "REDISCOVER_AGENT"

    if error.type == "INVALID_INPUT":
        return "REPLAN"

    if error.type == "HIGH_RISK":
        return "HUMAN_APPROVAL"

    return "ESCALATE"
```

---

# 23. Complete Recovery Decision Tree

```text
                    FAILURE
                       │
                       ▼
                 Classify Error
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
   Transient        Security          Business
       │               │                │
       ▼               ▼                ▼
    Retry?            STOP           Replan?
       │                                │
   ┌───┴───┐                       ┌────┴────┐
   ▼       ▼                       ▼         ▼
  Yes      No                     Yes        No
   │       │                       │         │
 Retry   Fallback               Replan    Escalate
           │
           ▼
      Alternate path
```

---

# 24. Recovery Must Be Bounded

Without controls:

```text
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
Retry
 ↓
...
```

This can create an infinite loop.

Use:

```text
Max Attempts
+
Deadline
+
Max Workflow Steps
+
Max Token Budget
+
Max Cost
+
Circuit Breaker
```

For example:

```python
if state.attempt >= 3:
    return "FALLBACK"

if state.deadline_exceeded:
    return "TIMEOUT"

if state.step_count >= 50:
    return "STOP"

if state.cost >= state.max_cost:
    return "STOP"
```

---

# 25. Observability During Recovery

Every recovery action should be observable.

```json
{
  "event": "recovery_action",

  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "TASK-001",
  "run_id": "RUN-003",
  "step_id": "STEP-005",

  "error_type": "MCP_TIMEOUT",

  "action": "RETRY",

  "attempt": 2,

  "agent_id": "tracking-worker",

  "tool": "get_tracking_events",

  "result": "success"
}
```

This allows operators to understand:

```text
What failed?
Why was retry selected?
How many times?
Which fallback was used?
Did recovery succeed?
How much additional latency/cost occurred?
```

---

# 26. Retry vs Fallback vs Circuit Breaker vs Escalation

| Mechanism        | Purpose                                      |
| ---------------- | -------------------------------------------- |
| Retry            | Temporary failure                            |
| Backoff          | Prevent retry storms                         |
| Timeout          | Bound execution time                         |
| Fallback         | Alternate execution path                     |
| Circuit breaker  | Stop repeatedly calling unhealthy dependency |
| Replan           | Change execution strategy                    |
| Rediscovery      | Find another agent                           |
| Idempotency      | Prevent duplicate execution                  |
| Human escalation | Handle high-risk/ambiguous situations        |
| Checkpoint       | Resume safely                                |
| DLQ              | Isolate repeatedly failed async messages     |

---

# 27. Production Recovery Architecture

```text
                         CWD
                          │
                     Execute Task
                          │
                          ▼
                    ┌────────────┐
                    │   Worker   │
                    └─────┬──────┘
                          │
                     Failure?
                          │
                          ▼
                  ┌───────────────┐
                  │ Error Handler │
                  └───────┬───────┘
                          │
                    Classify Error
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
    Retry             Fallback           Escalate
       │                  │                  │
       ▼                  ▼                  ▼
 Backoff/Jitter     Registry/Alternate    Human
       │                  │                  │
       └────────────┬─────┴──────────────────┘
                    ▼
              LangGraph State
                    │
              ┌─────┴─────┐
              ▼           ▼
           Resume        Stop
```

Supporting:

```text
Service Bus → durable async delivery
Redis       → locks / working state
Cosmos DB   → durable task/run state
Agent Registry → alternate agent discovery
Policy/IAM  → authorization
Observability → failure/recovery telemetry
```

---

# 28. Most Important Anti-Patterns

### ❌ Blind retries

```text
Every error → Retry 3 times
```

### ❌ Infinite retries

```text
Failure → Retry forever
```

### ❌ Retrying authorization failures

```text
403 → retry
```

### ❌ No idempotency

```text
Create transaction → timeout → duplicate transaction
```

### ❌ No timeout

```text
Worker waits indefinitely
```

### ❌ Fallback without authorization

```text
Primary denied
 ↓
Try unrestricted alternative
```

### ❌ LLM decides recovery without policy

```text
LLM: "Let's bypass the permission check."
```

Never.

### ❌ Returning fabricated information after RAG failure

```text
Search unavailable
 ↓
LLM guesses
```

### ❌ No checkpoint

```text
Human approval
 ↓
Process crashes
 ↓
Entire workflow lost
```

---

# 29. Reliability Formula

A useful conceptual model is:

$$
\boxed{
Agent\ Recovery =
Error\ Detection
+
Error\ Classification
+
Timeout
+
Bounded\ Retry
+
Backoff
+
Fallback
+
Circuit\ Breaker
+
Idempotency
+
Checkpointing
+
Replanning
+
Human\ Escalation
+
Observability
}
$$

And the core recovery decision:

$$
\boxed{
Recovery =
f(
ErrorType,
Retryability,
Attempts,
Deadline,
Health,
Idempotency,
Risk,
Policy,
BusinessImpact
)
}
$$

---

# 30. Interview-Ready Answer

> **“In CWD, I treat agent failures as expected production conditions rather than exceptional cases. The first step is to classify the failure as transient, rate-limit, dependency, validation, authorization, business, policy, or unknown. Transient failures can use bounded retries with exponential backoff and jitter, while timeouts establish execution deadlines. For repeated dependency failures, circuit breakers prevent retry storms. If a Worker or agent becomes unavailable, the Agent Registry can be used to rediscover an eligible alternative, subject to authorization, health, readiness, version, and policy constraints. For high-risk or ambiguous operations, the workflow can checkpoint and escalate to a human before resuming. Idempotency is essential for safe retries of write operations, and partial failures must be represented explicitly rather than incorrectly treating the entire workflow as successful. LangGraph manages the recovery workflow and state transitions, while Policy/IAM controls authorization decisions and Service Bus provides durable asynchronous delivery. Every failure and recovery action is correlated and observable so that reliability, latency, cost, and root cause can be measured.”**

## Final Mental Model

```text
                 AGENT FAILURE
                       │
                       ▼
                DETECT + CLASSIFY
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        RETRY       FALLBACK      ESCALATE
          │            │            │
     Backoff       Alternate      Human
     + Jitter      Agent/Tool     Approval
          │            │            │
          └────────────┼────────────┘
                       ▼
                  CHECKPOINT
                       │
                       ▼
                    RESUME
                       │
                       ▼
                   SUCCESS
```

**In one sentence:**
**Enterprise agent recovery is the controlled process of detecting and classifying failures, applying bounded retries, timeouts, backoff, fallbacks, circuit breakers, rediscovery, idempotency, checkpointing, replanning, or human escalation as appropriate, while preserving security, observability, business correctness, and workflow continuity.**
