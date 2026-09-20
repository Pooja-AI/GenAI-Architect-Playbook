## How do you handle MCP Server failure?

If an MCP Server is unavailable or fails, the **Worker reports the failure to the Delegator**, and the Delegator handles retry, timeout, fallback, or partial-success logic.

### Simple flow

```text
Worker
  ↓
MCP Client
  ↓
MCP Server ❌
  ↓
Timeout / Connection Error
  ↓
Worker reports failure
  ↓
Delegator
  ↓
Retry / Fallback / Partial Success
```

### Step-by-step

**1. Detect the failure**

The MCP Client may receive:

```text
Connection timeout
Connection refused
5xx error
Tool execution error
```

**2. Apply timeout**

Don't let the Worker wait indefinitely.

```text
MCP timeout → Worker failure
```

**3. Retry transient failures**

For temporary failures such as `503`, network errors, or timeouts:

```text
Attempt 1 → failed
   ↓
Backoff
   ↓
Attempt 2 → failed
   ↓
Backoff
   ↓
Attempt 3 → failed
```

Use **exponential backoff + jitter** and a maximum retry count.

**4. Use circuit breaker**

If the MCP Server repeatedly fails:

```text
CLOSED
  ↓ repeated failures
OPEN
  ↓
Stop sending requests temporarily
  ↓
HALF-OPEN
  ↓
Test recovery
  ↓
CLOSED
```

This prevents sending large numbers of requests to an unhealthy MCP Server.

**5. Decide whether the Worker is mandatory**

For example:

```text
CustomerProfileWorker → SUCCESS
ContractWorker         → SUCCESS
SalesHistoryWorker     → MCP failure
```

If SalesHistory is optional:

```text
PARTIAL_SUCCESS
```

If it is mandatory:

```text
INCOMPLETE
```

**6. Resume without repeating successful work**

LangGraph checkpointing records the execution state.

```text
CustomerProfileWorker ✓
ContractWorker        ✓
SalesHistoryWorker    ❌
```

After recovery, we retry the failed Worker rather than rerunning everything.

### Observability

We record:

```text
request_id
run_id
worker_id
mcp_server
tool_name
attempt
error_type
latency
retry_count
final_status
```

This helps identify whether the problem is with the Worker, MCP Server, or downstream Salesforce/ServiceNow system.

### CWD example

```text
IncidentWorker
     ↓
MCP Client
     ↓
ServiceNow MCP Server ❌
     ↓
Timeout
     ↓
Retry 1
     ↓
Retry 2
     ↓
Retries exhausted
     ↓
IT Delegator
     ↓
Partial result / Incomplete
```

**Interview-ready:**

> “If an MCP Server fails, we use bounded timeouts and retries with exponential backoff and jitter for transient failures. A circuit breaker protects the system from repeated failures. After retries are exhausted, the Delegator applies the mandatory/optional Worker policy and either continues with partial results or marks the workflow incomplete. LangGraph checkpointing allows us to resume without rerunning successful Workers.”

**One-line memory:**
**MCP failure → timeout → bounded retry → circuit breaker → partial success or recovery.**
