## How do you retry?

In **CWD**, I use **bounded retries with exponential backoff and jitter**, but only for **transient failures**.

The important point is:

> **I don't retry every error. I retry only errors that are likely to recover.**

### Retry flow

```text
Worker
  ↓
MCP / LLM / Database
  ↓
Failure
  ↓
Is it retryable?
 ┌──────────────┐
 YES            NO
 ↓               ↓
Retry         Fail immediately
 ↓
Backoff
 ↓
Success?
 ┌───────┴───────┐
YES             NO
 ↓               ↓
Continue      Retry limit?
              ↓
           Fail / HITL
```

### 1. Classify the error

#### Usually retryable

```text
Timeout
HTTP 429
HTTP 502
HTTP 503
HTTP 504
Temporary network failure
Transient database throttling
```

#### Usually NOT retryable

```text
401 Unauthorized
403 Forbidden
Invalid parameters
Invalid schema
Business validation error
Resource doesn't exist
Security policy denial
```

For example:

```text
Salesforce 503 → retry
Salesforce 403 → don't retry
```

---

### 2. Use exponential backoff

Instead of:

```text
Retry immediately
Retry immediately
Retry immediately
```

I use:

```text
Attempt 1 → wait 1 sec
Attempt 2 → wait 2 sec
Attempt 3 → wait 4 sec
```

Conceptually:

```text
delay = base × 2^retry_count
```

---

### 3. Add jitter

If 1,000 Workers fail at the same time, they shouldn't all retry simultaneously.

So I add random jitter:

```text
Worker 1 → retry after 1.3 sec
Worker 2 → retry after 1.7 sec
Worker 3 → retry after 1.1 sec
```

This prevents a **thundering-herd problem**.

---

### 4. Set a maximum retry count

For example:

```text
max_retries = 3
```

```text
Attempt 1 → failure
Attempt 2 → failure
Attempt 3 → failure
Attempt 4 → stop
```

I don't retry indefinitely because that increases latency and can overload the dependency.

---

### 5. Respect `Retry-After`

If a service returns something like:

```text
HTTP 429
Retry-After: 10
```

I respect that guidance rather than immediately retrying.

This is particularly important for **LLM APIs and enterprise APIs**.

---

### 6. Use idempotency for operations

Retries can be dangerous for write operations.

Example:

```text
Worker
 ↓
MCP → Salesforce
 ↓
Create Case
 ↓
Request times out
```

The case might actually have been created even though the Worker didn't receive the response.

If I blindly retry:

```text
Create Case
Create Case
```

I could create duplicates.

So I use:

```text
idempotency_key = CWD-5001-TASK-123
```

The downstream system or integration layer checks whether that operation has already been processed.

---

### 7. Retry at the correct layer

I avoid having every layer independently retry the same request.

Bad:

```text
Worker retries 3x
   ↓
MCP retries 3x
   ↓
API retries 3x

Potentially 27 calls
```

Instead, I define **clear retry ownership**.

For example:

```text
Worker
   ↓
MCP Client
   ↓
MCP Server
   ↓
Salesforce
```

The MCP/integration layer can handle transient downstream failures, while the Worker handles higher-level task recovery.

This prevents **retry amplification**.

---

### 8. Combine retry with circuit breaker

If a dependency is continuously unavailable:

```text
Retry
 ↓
Retry
 ↓
Retry
 ↓
Circuit OPEN
 ↓
Stop calling dependency
```

After a cooldown:

```text
HALF-OPEN
 ↓
Test request
 ↓
Success → CLOSED
Failure → OPEN
```

This protects CWD and the downstream system.

---

## Example: ServiceNow timeout

```text
Incident Worker
      ↓
MCP → ServiceNow
      ↓
Timeout
      ↓
Is transient? YES
      ↓
Retry #1
      ↓
Timeout
      ↓
Backoff + jitter
      ↓
Retry #2
      ↓
Success
      ↓
Continue workflow
```

If all retries fail:

```text
Retry exhausted
      ↓
Worker = FAILED
      ↓
IT Delegator
      ↓
Coordinator
      ↓
Partial result / Fail / HITL
```

---

## LangGraph example

Conceptually:

```python
from langgraph.types import RetryPolicy

workflow.add_node(
    "incident_worker",
    incident_worker,
    retry_policy=RetryPolicy(
        max_attempts=3
    )
)
```

But I would still make the retry policy **error-aware** so authentication, validation, and authorization failures aren't blindly retried.

---

## Interview-ready answer

> **“In CWD, I use bounded retries with exponential backoff and jitter. First, I classify the error as transient or permanent. Timeouts, 429s and temporary 5xx errors are typically retryable, while 401, 403 and validation errors are not. I limit the number of attempts and respect Retry-After when provided. For write operations, I use idempotency keys to prevent duplicate transactions. I also use circuit breakers when a dependency is continuously failing. Finally, I avoid retry amplification by clearly defining which layer owns the retry.”**

### Strong interview line

> **“Retry is not just ‘try again.’ I use error classification, bounded exponential backoff, jitter, idempotency and circuit breakers so retries improve resilience without creating duplicate transactions or overwhelming dependencies.”**

**Easy memory:**
**Classify → Retry → Backoff + Jitter → Limit → Idempotency → Circuit Breaker → Recover/Fail.**
