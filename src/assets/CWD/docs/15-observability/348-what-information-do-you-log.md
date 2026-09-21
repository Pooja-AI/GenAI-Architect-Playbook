## What information do you log?

In CWD, I log **enough information to troubleshoot, audit, and measure the system**, but I **do not log secrets or unnecessary sensitive business data**.

### 1. Request / correlation information

For every request:

```text id="3s1m5c"
correlation_id
trace_id
span_id
task_id
parent_task_id
timestamp
request_status
```

Example:

```text
correlation_id = CWD-5001
trace_id       = TR-9001
task_id        = TASK-1002
```

This lets me reconstruct the complete workflow.

---

### 2. User / identity information

I log safe identity metadata:

```text id="3ap6mt"
user_id
tenant_id
role/group information
authentication result
authorization decision
```

For example:

```text
tenant_id = T001
user_id   = U123
auth      = success
authz     = allowed
```

I avoid logging unnecessary PII.

---

### 3. Agent information

For the CWD agent flow:

```text id="drm9w6"
agent_name
agent_type
intent
Delegator selected
Worker selected
task status
execution status
```

Example:

```text
Coordinator
 → Intent = CustomerBriefing
 → Delegator = SalesDelegator
 → Worker = CustomerWorker
```

---

### 4. A2A information

For Coordinator → Delegator communication:

```text id="6njy2a"
from_agent
to_agent
task_id
parent_task_id
capability
status
latency
error_type
```

This helps troubleshoot agent-to-agent failures.

---

### 5. MCP / tool information

For every MCP call:

```text id="2s3w8m"
worker_id
mcp_server
tool_name
tool_version
request_id
authorization decision
status
latency
error_type
```

Example:

```text
Worker: CustomerWorker
Tool: get_customer
Server: Salesforce-MCP
Status: success
Latency: 820 ms
```

I don't log the access token or secret used to make the call.

---

### 6. LLM information

For LLM calls, I track metadata such as:

```text id="f9v1zo"
model_name
model_version
prompt_version
input_tokens
output_tokens
latency
finish_reason
structured_output_status
```

This helps with **cost, latency, and model troubleshooting**.

I don't blindly log the entire production prompt or response if it contains confidential data.

---

### 7. RAG information

For retrieval:

```text id="7qj8xk"
search_type
query_id
top_k
retrieval_latency
document_ids
ranking/relevance signals
filter status
index version
```

For example:

```text
Hybrid Search
Top-K = 5
Documents returned = 5
ACL filter = applied
Retrieval latency = 180 ms
```

I prefer logging document IDs/metadata rather than dumping confidential document contents into logs.

---

### 8. Performance information

I log:

* Start/end timestamps
* Duration
* P50/P95/P99 derived metrics
* Queue time
* Retry count
* Timeout
* Downstream latency

Example:

```text id="v8yq6k"
MCP Salesforce
latency = 2.1 sec
timeout = false
retry_count = 0
```

---

### 9. Security events

Important security logs include:

```text id="r0x8gf"
Authentication failure
Authorization denial
Tenant mismatch
Unauthorized tool call
Prompt-injection detection
DLP violation
Rate-limit violation
Suspicious access
```

Example:

```text
tenant T001
requested resource belonging to T002
→ DENIED
→ AUDIT
```

---

### 10. Errors

I log structured error information:

```text id="r7f6x1"
error_type
error_code
component
dependency
retryable = true/false
attempt
stack trace/internal diagnostic
```

But I make sure stack traces don't expose secrets or sensitive payloads.

---

## What I DON'T log

This is a very important interview point.

I don't log:

```text
❌ Passwords
❌ API keys
❌ Access tokens
❌ Client secrets
❌ Private keys
❌ Full confidential HR records
❌ Unnecessary customer PII
❌ Sensitive prompt/response content
```

Sensitive values should be **masked, redacted, hashed, or excluded** depending on the requirement.

---

## Example CWD log

```json id="z8xq5c"
{
  "timestamp": "2026-09-20T20:10:15Z",
  "correlation_id": "CWD-5001",
  "trace_id": "TR-9001",
  "task_id": "TASK-1002",
  "tenant_id": "T001",
  "agent": "CustomerWorker",
  "operation": "MCP.get_customer",
  "tool": "Salesforce",
  "authorization": "allowed",
  "status": "success",
  "latency_ms": 820,
  "retry_count": 0
}
```

Notice that I **don't put the Salesforce password, OAuth token, or full customer record into this log**.

### Interview-ready answer

> **“In CWD, I use structured logging and capture correlation ID, trace ID, task ID, tenant and safe user identity metadata, agent and Worker information, A2A and MCP operations, tool status, latency, retries, LLM model and token metadata, RAG retrieval metadata, security decisions, and errors. I use these logs together with distributed traces to troubleshoot the complete workflow. At the same time, I follow data minimization: I never log passwords, tokens, secrets, or unnecessary confidential customer or HR information. Sensitive values are redacted or excluded.”**

### Strong interview line

> **“I log enough to reconstruct the request, but never enough to create a second security problem.”**
