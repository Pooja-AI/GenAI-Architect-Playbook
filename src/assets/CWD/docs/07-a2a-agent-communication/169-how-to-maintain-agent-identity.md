In **CWD**, we maintain agent identity so every Coordinator, Delegator, and Worker can be **uniquely identified, authenticated, authorized, and audited**.

### Simple flow

```text
User
  ↓
Coordinator
  ↓ A2A
Sales Delegator
  ↓
Customer Worker
  ↓ MCP
Salesforce
```

Each agent has its own identity.

### 1. Give every agent a unique identity

For example:

```text
Coordinator       → agent-coordinator
Sales Delegator   → agent-sales-delegator
IT Delegator      → agent-it-delegator
Customer Worker   → agent-customer-worker
Incident Worker   → agent-incident-worker
```

We don't rely on the agent's name alone. The identity is backed by an enterprise identity system such as **Microsoft Entra ID** in Azure.

---

### 2. Authenticate the agent

When the Coordinator calls the Sales Delegator through A2A, the request carries an authenticated identity.

Conceptually:

```text
Coordinator
   |
   | A2A request + identity credential
   ↓
Sales Delegator
   |
   | Validate identity
   ↓
Accept / Reject
```

For example:

```json
{
  "task_id": "T1001",
  "from_agent": "agent-coordinator",
  "to_agent": "agent-sales-delegator",
  "intent": "customer_briefing"
}
```

The identity credential/token is validated by the security layer rather than trusting the `from_agent` field.

---

### 3. Authorize what the agent can do

Authentication answers:

> **Who are you?**

Authorization answers:

> **What are you allowed to do?**

For example:

```text
Coordinator
   ↓
Allowed → call Sales Delegator

Sales Delegator
   ↓
Allowed → call Customer Worker

Customer Worker
   ↓
Allowed → get_customer
```

But:

```text
Customer Worker
   ↓
Not allowed → delete_customer
```

We enforce this using **RBAC/claims/permissions** and tool-level authorization.

---

### 4. Preserve identity across the CWD flow

We also propagate a correlation and identity context:

```text
User
 ↓
Coordinator
 ↓ A2A
Sales Delegator
 ↓
Customer Worker
 ↓ MCP
Salesforce
```

For example:

```json
{
  "correlation_id": "C789",
  "task_id": "T1001",
  "user_id": "U123",
  "agent_id": "agent-sales-delegator",
  "tenant_id": "ONSEMI",
  "intent": "customer_briefing",
  "customer_id": "C12345"
}
```

We **do not put passwords, API keys, or secrets into this context**.

---

### 5. Maintain identity in audit logs

Every agent action is logged with its identity:

```text
correlation_id = C789
task_id        = T1001
agent_id       = agent-sales-delegator
worker_id      = customer-worker
tool            = get_customer
timestamp       = ...
status          = SUCCESS
latency_ms      = 320
```

This gives us traceability:

> **Which user → which agent → which worker → which tool → which enterprise system?**

---

### Interview-ready answer

> **“In CWD, we maintain agent identity using enterprise identity such as Microsoft Entra ID. Each Coordinator, Delegator, and Worker has a unique service identity. When agents communicate through A2A, we authenticate the calling agent and authorize it based on its roles and capabilities. We propagate the identity and correlation context across the workflow for traceability, while keeping secrets out of the agent payload. Every A2A and MCP operation is also audited with agent ID, task ID, correlation ID, tool, status, and timestamp. This gives us authentication, authorization, and end-to-end agent accountability.”**

### Easy way to remember

**Agent Identity = Identify → Authenticate → Authorize → Audit**

And in CWD:

**A2A identifies who is calling another agent; MCP controls what that agent/worker can do with enterprise tools.**
