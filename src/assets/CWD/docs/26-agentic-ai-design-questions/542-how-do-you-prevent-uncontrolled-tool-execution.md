### How do you prevent uncontrolled tool execution?

Use **tool governance + runtime policy enforcement**.

* **Tool allowlist** → agent can invoke only approved MCP tools.
* **Least privilege** → tools are limited by agent/user permissions.
* **Risk classification** → read, write, destructive, privileged.
* **Policy checks** → validate whether the action is allowed before execution.
* **Input/schema validation** → Pydantic/JSON Schema.
* **Approval** → high-risk tools require HITL.
* **Rate/concurrency limits** → prevent excessive tool calls.
* **Max tool-call budget** → stop runaway agent loops.
* **Audit + tracing** → record every tool invocation and result.
* **Timeout/circuit breaker** → prevent stuck or repeatedly failing calls.

```text id="h7c3kx"
Agent
  ↓
Tool Request
  ↓
Allowlist + Auth
  ↓
Policy / Risk Check
  ↓
Schema Validation
  ↓
HITL if high-risk
  ↓
MCP Tool
```

**Interview answer:**

> “We prevent uncontrolled tool execution by enforcing an allowlist, least-privilege authorization, risk-based policies, and schema validation before every tool call. We also apply rate limits, concurrency limits, and maximum tool-call budgets to prevent runaway execution. High-risk tools require human approval, and every invocation is traced and audited.”
