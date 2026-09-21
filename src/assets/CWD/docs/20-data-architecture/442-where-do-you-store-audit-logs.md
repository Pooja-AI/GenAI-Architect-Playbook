## Where do you store audit logs?

In CWD, I store **audit logs separately from workflow state** because audit data is primarily for **security, compliance, traceability, and investigation**.

For your Azure architecture:

```text
Coordinator / Delegator / Worker / MCP
              ↓
        Audit Events
              ↓
   Application Insights
        + Log Analytics
              ↓
   Long-term archive
   Azure Storage / Data Lake
```

### 1. What goes into an audit log?

For example, when the Incident Worker calls ServiceNow through MCP:

```json
{
  "timestamp": "2026-09-21T15:30:10Z",
  "tenant_id": "T001",
  "user_id": "U123",
  "workflow_id": "WF-1001",
  "task_id": "T5001",
  "worker_id": "incident_worker",
  "mcp_server": "servicenow-mcp",
  "tool": "get_open_incidents",
  "action": "READ",
  "authorization": "ALLOWED",
  "status": "SUCCESS",
  "latency_ms": 420,
  "trace_id": "TR-9001"
}
```

This lets me answer:

> **Who did what, when, through which Worker/tool, and was it authorized?**

---

### 2. Application Insights + Log Analytics

For your Azure CWD implementation, **Application Insights** and **Log Analytics** are useful for operational and audit telemetry.

I propagate:

```text
trace_id
correlation_id
workflow_id
task_id
worker_id
agent_id
tenant_id
```

across:

```text
Coordinator
   ↓
A2A
   ↓
Delegator
   ↓
Worker
   ↓
MCP
   ↓
Salesforce / ServiceNow
```

So I can trace one business request across the entire workflow.

---

### 3. Security-sensitive audit events

I specifically audit events such as:

```text
Authentication
Authorization decisions
Agent-to-agent calls
Worker execution
MCP tool calls
Create / Update / Delete operations
Access-denied events
Policy violations
Retries/failures
Configuration changes
Human approvals
```

For example:

```text
User
 ↓
Coordinator
 ↓
IT Delegator
 ↓
Incident Worker
 ↓
MCP: update_incident
 ↓
Authorization = ALLOWED
 ↓
ServiceNow
```

The audit record captures that action and its authorization decision.

---

### 4. Long-term retention

Operational logs don't necessarily need to be retained forever.

For longer retention or compliance requirements, I can archive audit events into **Azure Storage/Data Lake** with appropriate retention and access controls.

```text
Real-time
    ↓
Application Insights / Log Analytics
    ↓
Retention period
    ↓
Azure Storage / Data Lake
```

The exact retention period depends on the organization's security and compliance requirements.

---

### 5. What I DON'T put in audit logs

I don't blindly log complete enterprise payloads or secrets.

I avoid:

```text
❌ API keys
❌ passwords
❌ access tokens
❌ private keys
❌ unnecessary PII
❌ full confidential Salesforce records
❌ full sensitive ServiceNow payloads
```

Instead, I log **references, IDs, metadata, authorization decisions, and outcomes** where possible.

---

## Audit logs vs workflow state

This is an important interview distinction:

| Data            | Storage                          | Purpose                 |
| --------------- | -------------------------------- | ----------------------- |
| Workflow state  | Cosmos DB / LangGraph checkpoint | Resume/recovery         |
| Cache           | Redis                            | Fast temporary access   |
| Audit logs      | App Insights / Log Analytics     | Security & traceability |
| Long-term audit | Azure Storage/Data Lake          | Retention/compliance    |
| Business data   | Salesforce/ServiceNow            | System of record        |

### 🎯 Interview-ready answer

> **“In CWD, I keep audit logs separate from workflow state. I use Azure Application Insights and Log Analytics for centralized audit and operational telemetry, and archive important audit events to Azure Storage or Data Lake when longer retention is required. Every audit event carries identifiers such as tenant ID, user ID, workflow ID, task ID, Worker ID, trace ID, MCP server, tool name, authorization decision, timestamp, status, and latency. This allows us to trace who performed what action and whether it was authorized. I also apply data minimization and never log secrets, access tokens, or unnecessary sensitive enterprise payloads.”**

**Easy memory:**
**Action → Identity → Authorization → Tool → Result → Trace → Store → Retain**

> **Strong interview line:** **“Workflow state tells me how to resume the process; audit logs tell me what happened and who did it.”**
