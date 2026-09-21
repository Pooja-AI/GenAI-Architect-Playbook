## What happens if MCP Server fails?

In **CWD**, the MCP Server is the bridge between a Worker and enterprise systems such as **Salesforce, ServiceNow, and SharePoint**.

If the MCP Server fails, I isolate the failure to the affected **Worker/tool call** rather than bringing down the entire CWD workflow.

### CWD flow

```text id="4w9n3e"
Worker
   ↓
MCP Client
   ↓
MCP Server ❌
   ↓
Salesforce / ServiceNow
```

If the MCP Server itself is unavailable:

```text id="z7h4kp"
Worker
  ↓
MCP Client
  ↓
MCP Server
  ❌ timeout / 5xx
  ↓
Retry
  ↓
Circuit Breaker
  ↓
Worker = FAILED
  ↓
Delegator
  ↓
Coordinator
```

### 1. Detect the MCP failure

The MCP Client detects things such as:

```text id="9d4q6m"
Connection refused
Timeout
HTTP 5xx
MCP protocol error
Malformed response
Authentication failure
```

I capture:

```text id="w0l8fk"
trace_id
correlation_id
task_id
worker_id
mcp_server
tool_name
latency
status
error_type
```

---

### 2. Retry transient failures

For a temporary failure:

```text id="qz0j0m"
Attempt 1 → timeout
Attempt 2 → 503
Attempt 3 → success
```

I use:

**limited retries + exponential backoff + jitter**

I don't retry authorization errors or invalid tool parameters blindly.

---

### 3. Circuit breaker

If the MCP Server continues failing:

```text id="y8o1az"
          MCP Server
              ↓
       repeated failures
              ↓
       Circuit OPEN
              ↓
     stop MCP requests
              ↓
         cooldown
              ↓
       HALF-OPEN test
          /       \
      success    failure
        ↓           ↓
      CLOSED       OPEN
```

This prevents every Worker from continuously sending requests to a broken MCP Server.

---

### 4. What happens to the Worker?

Suppose:

```text id="9r6j9h"
Customer Worker
     ↓
MCP → Salesforce
     ↓
MCP Server unavailable
```

The Worker returns:

```json id="6r7p6k"
{
  "worker": "CustomerWorker",
  "status": "failed",
  "error_type": "MCP_SERVER_UNAVAILABLE",
  "retryable": true
}
```

The Delegator passes the result to the Coordinator.

---

### 5. Coordinator decides the business outcome

For example:

```text id="f3f2pl"
Sales Delegator
 ├── Customer Worker → MCP ❌
 └── Opportunity Worker → MCP ❌

IT Delegator
 └── Incident Worker → MCP ❌
```

If the MCP Server is shared by multiple capabilities, the impact could be broader.

The Coordinator should therefore understand:

```text
Which capability failed?
Which Workers depend on this MCP Server?
Is the result mandatory?
Can the workflow continue?
```

For an optional capability:

```text id="7o1m1v"
→ Partial result
```

For a critical capability:

```text id="j7t9j0"
→ Fail workflow / HITL
```

---

### 6. Don't confuse MCP failure with Salesforce failure

This is an important interview distinction.

```text id="q9b6r4"
Case 1:

Worker
 ↓
MCP Client
 ↓
MCP Server ❌

MCP infrastructure problem
```

versus:

```text id="q2x5r8"
Case 2:

Worker
 ↓
MCP Client
 ↓
MCP Server ✅
 ↓
Salesforce ❌

Enterprise dependency problem
```

Application Insights distributed tracing helps identify **which layer actually failed**.

---

### 7. What about MCP Server redundancy?

For production, I would avoid a single MCP Server instance.

```text id="h0q6h8"
                 MCP Client
                     ↓
              Load Balancer
                /       \
               ↓         ↓
          MCP Server 1  MCP Server 2
               \         /
                ↓       ↓
              Enterprise APIs
```

If one instance fails, traffic can move to another healthy instance.

Health checks and deployment strategies such as rolling/blue-green deployments can reduce availability impact.

---

### 8. Security failure is different

If the MCP Server returns:

```text id="z8b1rj"
401 Unauthorized
403 Forbidden
```

I **do not simply retry**.

That is potentially an authentication/authorization problem.

```text id="f0s5k1"
401/403
  ↓
Don't blindly retry
  ↓
Log security event
  ↓
Investigate authorization
```

This follows the principle:

> **Retries are for transient failures, not permission failures.**

---

## Interview-ready answer

> **“If the MCP Server fails, the Worker detects the MCP communication failure and treats it as a dependency failure. For transient errors such as timeout or 5xx, I use limited retries with exponential backoff and jitter. If the MCP Server continues failing, I use a circuit breaker and route traffic to a healthy MCP instance when available. The Worker returns a structured MCP failure to the Delegator, and the Coordinator determines whether the affected capability is mandatory or optional. Optional capabilities can degrade gracefully with a partial result, while critical capabilities can fail or go to HITL. I also distinguish MCP infrastructure failures from downstream failures such as Salesforce or ServiceNow outages, using distributed tracing to identify the exact failure layer.”**

### Strong interview line

> **“MCP failure should be isolated to the affected tool capability. I use retry, circuit breaker, failover and durable state so one MCP failure doesn't unnecessarily bring down the entire CWD workflow.”**

**Easy memory:**

**MCP fails → Detect → Retry → Circuit breaker → Failover → Worker failure → Coordinator decides.**
