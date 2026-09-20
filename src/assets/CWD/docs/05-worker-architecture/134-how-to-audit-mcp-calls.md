In your **CWD architecture**, I would audit MCP calls by creating an **audit record for every tool invocation**, from the Worker through the MCP Server to the enterprise system.

### 1. Audit flow

```text
Worker
   |
   | MCP call
   | tool = get_customer
   | customer_id = C12345
   v
MCP Client
   |
   v
MCP Server
   |
   +--> Audit Logger
   |
   +--> Authorization
   |
   +--> Tool Execution
   |
   v
Salesforce
```

The key point is:

> **The MCP Server is the best central enforcement point for auditing because every enterprise tool invocation passes through it.**

---

## 2. What do you log?

For every MCP call, I would capture:

```json
{
  "timestamp": "2026-09-20T18:10:22Z",
  "correlation_id": "corr-123",
  "session_id": "session-456",
  "task_id": "task-789",
  "user_id": "user-123",
  "worker": "CustomerWorker",
  "tool_name": "get_customer",
  "mcp_server": "SalesforceMCPServer",
  "customer_id": "C12345",
  "action": "READ",
  "authorization": "ALLOWED",
  "status": "SUCCESS",
  "latency_ms": 245,
  "response_size": 1024
}
```

But **don't blindly log sensitive payloads**.

For example, avoid:

```text
❌ full customer record
❌ access tokens
❌ passwords
❌ OAuth tokens
❌ sensitive PII
```

Instead:

```text
customer_id = C12345
```

or preferably a masked/hash representation depending on the audit requirement.

---

# 3. Code-level implementation

You can create an audit function:

```python
import logging
import time
import uuid

logger = logging.getLogger("mcp.audit")


def audit_mcp_call(
    *,
    correlation_id,
    user_id,
    worker,
    tool_name,
    action,
    status,
    latency_ms,
    error=None
):

    audit_event = {
        "event_type": "MCP_TOOL_CALL",
        "timestamp": time.time(),
        "correlation_id": correlation_id,
        "user_id": user_id,
        "worker": worker,
        "tool_name": tool_name,
        "action": action,
        "status": status,
        "latency_ms": latency_ms,
        "error": error
    }

    logger.info(audit_event)
```

---

# 4. Audit around the MCP tool

Suppose your MCP Server has:

```python
@mcp.tool()
async def get_customer(
    customer_id: str,
    correlation_id: str,
    user_id: str
):

    start = time.time()

    try:

        # Authorization
        authorize(
            user_id=user_id,
            resource=customer_id,
            action="READ"
        )

        result = await salesforce_api.get_customer(
            customer_id
        )

        latency = int(
            (time.time() - start) * 1000
        )

        audit_mcp_call(
            correlation_id=correlation_id,
            user_id=user_id,
            worker="CustomerWorker",
            tool_name="get_customer",
            action="READ",
            status="SUCCESS",
            latency_ms=latency
        )

        return result

    except Exception as e:

        latency = int(
            (time.time() - start) * 1000
        )

        audit_mcp_call(
            correlation_id=correlation_id,
            user_id=user_id,
            worker="CustomerWorker",
            tool_name="get_customer",
            action="READ",
            status="FAILED",
            latency_ms=latency,
            error=str(e)
        )

        raise
```

Now **every successful and failed MCP call is audited**.

---

# 5. Authorization should happen before the tool executes

The sequence should be:

```text
MCP Request
    |
    v
Identify caller
    |
    v
Validate input
    |
    v
Authorize
    |
    +---- DENY ---> Audit DENIED
    |
    v
Execute Tool
    |
    v
Salesforce
    |
    v
Audit SUCCESS
```

For example:

```python
authorize(
    user_id=user_id,
    resource=customer_id,
    action="READ"
)
```

If authorization fails:

```text
Worker
  |
  v
MCP Server
  |
  v
Authorization
  |
  X
DENIED
```

You still create an audit event:

```json
{
  "tool": "get_customer",
  "action": "READ",
  "status": "DENIED",
  "user_id": "user-123",
  "reason": "INSUFFICIENT_PERMISSION"
}
```

---

# 6. What about DELETE or UPDATE tools?

These need stronger auditing.

For example:

```text
Worker
   |
   | delete_customer()
   v
MCP Server
   |
   +--> Authorization
   +--> Policy check
   +--> HITL approval
   +--> Audit
   |
   v
Salesforce
```

For a destructive operation:

```python
if action in ["DELETE", "UPDATE"]:

    require_approval()

    audit_mcp_call(
        ...
        status="APPROVAL_REQUIRED"
    )
```

Then after approval:

```text
APPROVED
   ↓
Tool executed
   ↓
SUCCESS
```

---

# 7. Where do you store audit logs?

In your Azure-based CWD architecture, a practical design is:

```text
MCP Server
    |
    v
Application Insights
    |
    v
Log Analytics
```

For long-term immutable/security audit requirements, you could additionally send selected audit events to a centralized security/audit store.

For example:

```text
                    MCP Server
                        |
                +-------+-------+
                |               |
                v               v
        Application Insights   Audit Store
                |
                v
          Log Analytics
```

The distinction is useful:

**Observability logs**

```text
latency
errors
tool execution
dependencies
traces
```

**Security audit logs**

```text
who
what
when
which resource
which action
allowed/denied
approval
result
```

---

# 8. Use correlation IDs

This is extremely important in your CWD architecture.

Suppose:

```text
User
 ↓
Coordinator
 ↓
Sales Delegator
 ↓
Customer Worker
 ↓
MCP
 ↓
Salesforce
```

Use the same:

```text
correlation_id = CWD-789
```

through the entire request.

Then you can search:

```text
CWD-789
```

and see:

```text
Coordinator
    ↓
Sales Delegator
    ↓
Customer Worker
    ↓
MCP get_customer
    ↓
Salesforce API
```

This gives you **end-to-end traceability**.

---

# 9. Example audit trail

For one Customer Briefing request:

```text
18:10:20 Coordinator
correlation_id=CWD-789

18:10:21 SalesDelegator
worker=CustomerWorker

18:10:21 MCP
tool=get_customer
customer=C12345
status=ALLOWED

18:10:21 Salesforce
API request

18:10:21 MCP
tool=get_customer
status=SUCCESS
latency=245ms

18:10:22 MCP
tool=get_opportunities
status=SUCCESS

18:10:23 MCP
tool=get_customer_incidents
status=FAILED
error=ServiceNow timeout
```

Now you can answer:

> **Who accessed what, through which Worker, using which MCP tool, when, whether it was authorized, whether it succeeded, and how long it took.**

---

## 10. Interview answer

If the interviewer asks **"How do you audit MCP calls?"**, give this:

> **"We audit MCP calls centrally at the MCP Server. For every tool invocation, we capture the correlation ID, user identity, Worker, tool name, action, resource identifier, authorization result, timestamp, latency, and success or failure status. We propagate the correlation ID from the Coordinator through the Delegator and Worker into the MCP layer, so we have end-to-end traceability. Sensitive payloads, tokens, and PII are not logged. In Azure, operational telemetry can go to Application Insights and Log Analytics, while security-sensitive audit events are retained in a controlled audit store. For write or destructive tools, we also enforce authorization and, where required, approval before execution."**

### One-line version

> **"Every MCP tool call is authenticated, authorized, correlated, logged, and audited at the MCP Server, with sensitive data excluded from the logs."**
