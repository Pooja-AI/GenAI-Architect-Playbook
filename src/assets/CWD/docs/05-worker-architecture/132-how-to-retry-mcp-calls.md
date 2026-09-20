## How do you retry MCP calls?

We retry MCP calls **at the Worker/MCP-client integration layer**, using a **bounded retry policy**. The Worker should not retry forever.

### Simple flow

```text
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Failure
  ↓
Is it retryable?
  ↓ Yes
Exponential Backoff + Jitter
  ↓
Retry
  ↓
Success / Max Retries
```

### Example

Suppose `IncidentWorker` calls:

```text
get_customer_incidents(C123)
```

and the ServiceNow MCP Server returns `503`.

```text
Attempt 1 → 503
     ↓
Wait 1 sec
     ↓
Attempt 2 → 503
     ↓
Wait 2 sec
     ↓
Attempt 3 → Success
```

The actual delay can use **exponential backoff with jitter**, rather than fixed delays.

### What errors should we retry?

**Usually retryable:**

* Timeout
* Connection failure
* HTTP 429
* HTTP 502
* HTTP 503
* HTTP 504
* Temporary network errors

**Usually NOT retryable:**

* Invalid parameters
* 400 Bad Request
* 401/403 authorization failure
* Unsupported tool
* Invalid customer ID
* Business validation failure

Retrying an authorization or validation error normally won't fix the problem.

### Important: avoid duplicate operations

For **read operations**:

```text
get_customer_profile()
```

retrying is generally straightforward.

For **write operations**:

```text
create_incident()
update_customer()
```

we must use **idempotency keys** or reconciliation to prevent duplicate business actions.

```text
Attempt 1 → ServiceNow creates INC001234
           ↓
Response lost
           ↓
Retry
           ↓
Same idempotency key
           ↓
Return INC001234
```

### In CWD

```text
Worker
 ↓
MCP Client
 ↓
Retry Policy
 ├── Success → return result
 ├── Retryable failure → retry
 └── Non-retryable / max retries → Delegator
```

The **Delegator then decides** whether the Worker is optional or mandatory and whether the workflow should continue.

### Interview-ready

> “We implement bounded retries for MCP calls using exponential backoff with jitter. We retry only transient failures such as timeouts, 429, and 5xx errors, while validation and authorization errors are not retried. For side-effecting operations, we use idempotency keys to prevent duplicate actions. After the retry limit is reached, the failure is returned to the Delegator for recovery or partial-success handling.”

**One-line memory:**
**Retry only transient failures → exponential backoff + jitter → max retries → idempotency for writes.**
