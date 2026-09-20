In your **CWD architecture**, I would audit every MCP execution as a **security and observability event**.

The key principle is:

> **For every MCP call, we should be able to answer: who called, which tool was called, with what approved parameters, why, what happened, and who approved it if required.**

### 1. MCP audit flow

```text
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Authentication
  ↓
Authorization
  ↓
Tool Execution
  ↓
Salesforce / ServiceNow / SharePoint
  ↓
Audit Event
  ↓
App Insights / Log Analytics / SIEM
```

---

### 2. What do I log?

For each MCP call, I capture something like:

```json
{
  "correlation_id": "run-789",
  "user_id": "user123",
  "worker": "SalesWorker",
  "mcp_server": "SalesforceMCP",
  "tool": "get_customer",
  "action": "READ",
  "resource": "customer:C123",
  "authorization": "allowed",
  "status": "success",
  "latency_ms": 420,
  "timestamp": "2026-09-20T18:30:00Z"
}
```

For a destructive operation:

```json
{
  "correlation_id": "run-790",
  "worker": "CustomerAdminWorker",
  "tool": "delete_customer",
  "resource": "customer:C123",
  "approval_id": "APR-456",
  "approved_by": "admin456",
  "authorization": "allowed",
  "status": "success"
}
```

---

### 3. Don't log sensitive data blindly

This is important.

I would **not** put passwords, access tokens, API keys, or unnecessary customer PII into logs.

Instead:

```text
❌ access_token
❌ Salesforce password
❌ API key
❌ full sensitive customer record

✅ user ID
✅ tool name
✅ resource ID
✅ authorization decision
✅ correlation ID
✅ status
✅ latency
```

Arguments can also be **masked/redacted** depending on sensitivity.

---

### 4. Use correlation IDs

Your CWD already has:

```text
session → task → run → turn → step
```

So an MCP call can carry the same correlation context:

```text
run-789
   ↓
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
MCP call
   ↓
Salesforce
```

If Salesforce takes 2 seconds and returns an error, I can trace that call back to the original user request.

---

### 5. Audit both successful and failed calls

Don't only log successful execution.

For example:

```text
get_customer → SUCCESS
get_opportunities → SUCCESS
get_incidents → TIMEOUT
delete_customer → DENIED
```

A denied operation is actually very important from a security perspective.

Example:

```json
{
  "tool": "delete_customer",
  "worker": "SalesWorker",
  "authorization": "denied",
  "reason": "Worker not permitted",
  "correlation_id": "run-791"
}
```

---

### 6. Audit the complete lifecycle

For a sensitive tool:

```text
Tool requested
      ↓
Authentication
      ↓
Authorization
      ↓
Validation
      ↓
Approval requested
      ↓
Human approved
      ↓
Tool executed
      ↓
Enterprise API response
      ↓
Final result
```

Each important transition can generate an audit event.

---

### 7. Where do I store it?

For your Azure CWD implementation:

```text
MCP Server
    ↓
Structured audit logs
    ↓
Application Insights
    +
Log Analytics
    ↓
Security monitoring / SIEM
```

The application logs provide operational details, while centralized security monitoring can detect patterns such as:

```text
Repeated authorization failures
Unexpected tool usage
Large numbers of calls
Repeated delete attempts
Unusual Worker → tool combinations
```

---

## Simple implementation

```python
async def execute_mcp_tool(ctx, tool, args):

    audit_log(
        event="MCP_TOOL_REQUEST",
        correlation_id=ctx.correlation_id,
        worker=ctx.worker,
        tool=tool
    )

    try:
        authorize(ctx.user, ctx.worker, tool)
        validate_arguments(tool, args)

        result = await mcp_server.call_tool(tool, args)

        audit_log(
            event="MCP_TOOL_SUCCESS",
            correlation_id=ctx.correlation_id,
            tool=tool,
            status="success"
        )

        return result

    except Exception as e:

        audit_log(
            event="MCP_TOOL_FAILURE",
            correlation_id=ctx.correlation_id,
            tool=tool,
            status="failed",
            error_type=type(e).__name__
        )

        raise
```

In production, I'd use structured logging, centralized storage, redaction, immutable/controlled audit retention, and alerting rather than relying on a simple application log.

---

## Strong interview answer

> **“I audit MCP execution at the MCP Server because that's the trusted enforcement point. For every call, we capture the correlation ID, user or service identity, Worker, MCP server, tool name, resource, authorization decision, approval ID for sensitive operations, status, latency, and timestamp. We audit both successful and denied or failed calls, while masking secrets and sensitive data. In our Azure implementation, these structured events can flow into Application Insights and Log Analytics for tracing, monitoring, and security analysis. Because CWD propagates correlation IDs across Coordinator, Delegator, Worker, and MCP, we can trace an MCP execution back to the original business request.”**

### Memory trick

**MCP Audit = Who → What → Which data → Why → Allowed? → Approved? → Result → When**

And remember:

> **“Authentication tells me who called; authorization tells me whether they could call; audit tells me exactly what happened.”**
