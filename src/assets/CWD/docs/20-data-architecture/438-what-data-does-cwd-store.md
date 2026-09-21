# What data does CWD store?

In CWD, I **don't store everything the LLM sees**. I store the data required for **workflow recovery, auditability, security, observability, evaluation, and business results**.

The easiest way to explain it is by category:

```text id="t0j5kd"
CWD Data
   │
   ├── 1. Workflow / State
   ├── 2. Task / Agent Data
   ├── 3. Business Results
   ├── 4. RAG / Knowledge Metadata
   ├── 5. Observability / Audit
   ├── 6. Configuration
   └── 7. Evaluation Data
```

---

## 1. Workflow state

This is the **most important data** because it allows CWD to resume a partially completed workflow.

For example:

```json id="8h2k7s"
{
  "workflow_id": "WF-1001",
  "tenant_id": "T001",
  "intent": "customer_briefing",
  "customer_id": "C12345",
  "status": "PARTIALLY_COMPLETED",
  "completed_tasks": [
    "customer_worker",
    "opportunity_worker"
  ],
  "pending_tasks": [
    "incident_worker"
  ]
}
```

This is persisted through the LangGraph checkpointer / durable state store.

---

## 2. Task and Worker state

For each task, I store information such as:

```text id="q3w8az"
task_id
workflow_id
delegator_id
worker_id
status
attempt_count
started_at
completed_at
error_type
retry_count
result_reference
```

Example:

```text id="n5zq2c"
TASK-3001
Worker = Incident Worker
Status = FAILED
Attempts = 3
Error = SERVICE_NOW_TIMEOUT
```

This allows me to retry or replay **only the failed task**.

---

## 3. Business results

CWD may store the validated result or a reference to the result.

For Customer Briefing:

```text id="y8f0pv"
Customer information
Opportunity information
Incident information
```

For example:

```json id="t8h3r1"
{
  "customer_id": "C12345",
  "open_incidents": 3,
  "active_opportunities": 2
}
```

For sensitive enterprise data, I prefer storing **references or minimal required results** rather than unnecessarily duplicating the entire Salesforce or ServiceNow record.

---

## 4. RAG / knowledge metadata

For enterprise documents, CWD stores metadata such as:

```text id="6f9p3k"
document_id
tenant_id
customer_id
document_type
source
last_modified
content_hash
ACL
classification
embedding_version
index_version
```

The actual document/vector data lives in the appropriate enterprise storage/search system.

For example:

```text id="m5k7x2"
SharePoint document
       ↓
Chunk
       ↓
Embedding
       ↓
Azure AI Search
```

---

## 5. Agent and prompt configuration

CWD also needs configuration for reproducibility.

For example:

```text id="4x2s7n"
Agent ID
Agent version
Prompt version
Model
Model version
Tool configuration
Routing policy
Guardrails
```

Example:

```json id="j2w8vc"
{
  "worker_id": "incident_worker",
  "agent_version": "v3",
  "prompt_version": "p12",
  "model": "approved-model"
}
```

If an answer is wrong, I can determine **which Worker, prompt, and model produced it**.

---

## 6. Observability data

I store telemetry such as:

```text id="5q8c1m"
trace_id
correlation_id
workflow_id
task_id
worker_id
agent_id
latency
status
error
LLM token usage
model
MCP tool
MCP latency
retry count
```

Example:

```text id="v9m2x4"
Trace: TR-1001
Coordinator → 300 ms
Sales Worker → 1.5 sec
Incident Worker → 4.2 sec
ServiceNow MCP → 3.9 sec
```

This helps troubleshoot performance and cost.

---

## 7. Audit data

For enterprise governance, I need to know:

```text id="7p3c6d"
Who initiated the request?
Which tenant?
Which Agent/Worker?
Which tool?
What action?
When?
Was authorization allowed?
What was the result?
```

For example:

```text id="e6r4z1"
User/Identity → Coordinator
      ↓
Incident Worker
      ↓
ServiceNow MCP
      ↓
get_incident
      ↓
Authorization = ALLOWED
      ↓
Result
```

---

## 8. Cost and usage data

Because you've been discussing cost monitoring, I would also capture:

```text id="r8v2m5"
tenant_id
workflow_id
worker_id
model
input_tokens
output_tokens
LLM calls
embedding usage
MCP calls
search queries
execution time
```

This lets me calculate:

```text
Cost / Tenant
Cost / Agent
Cost / Worker
Cost / Workflow
Cost / Request
```

---

## 9. Evaluation data

For GenAI quality, I maintain:

```text id="k3d8w0"
Golden test cases
Expected behavior
Ground truth
Evaluation results
Model version
Prompt version
RAG version
Tool-selection result
Quality metrics
```

This allows regression testing after changing a model, prompt, RAG pipeline, or Worker.

---

# What CWD should NOT store unnecessarily

This is an important security point.

I avoid storing:

```text id="v4s9q2"
❌ API keys
❌ Passwords
❌ Access tokens
❌ Private keys
❌ Secrets
❌ Full sensitive enterprise payloads unnecessarily
❌ Sensitive prompts/responses without a justified retention policy
```

Secrets belong in **Key Vault**, and sensitive data should follow data-minimization, access-control, encryption, and retention policies.

Also, I don't use the CWD state store as a replacement for Salesforce, ServiceNow, SharePoint, or other systems of record.

---

# Where does the data live?

A simple Azure mapping is:

```text id="x2m8qk"
Data Type                  Storage

Workflow checkpoints  →    Cosmos DB / durable state
Short-lived state     →    Redis
Business records      →    Salesforce / ServiceNow / etc.
Documents             →    Enterprise storage
Vectors + metadata    →    Azure AI Search
Secrets               →    Key Vault
Logs/traces            →    App Insights / Log Analytics
LLM traces/evals       →    Langfuse
Agent/prompt config   →    Agent/Prompt Registry
```

The exact persistence choice depends on durability, latency, retention, compliance, and workload requirements.

---

## 🎯 Interview-ready answer

> **“CWD stores only the data required to operate and govern the workflow. The main categories are durable workflow state and LangGraph checkpoints, task and Worker status, validated business results or references, RAG document metadata and ACLs, Agent and prompt versions, observability and audit telemetry, cost and usage information, and evaluation data. For example, for a Customer Briefing workflow, I store the workflow ID, customer ID, intent, completed and pending Workers, task status, results or references, and trace information so the workflow can be recovered and audited. I don't store secrets or unnecessarily duplicate sensitive enterprise data. Critical workflow state is kept in durable storage, Redis is used for short-lived state or caching, Azure AI Search stores searchable vectors and metadata, Key Vault stores secrets, and App Insights/Log Analytics handles operational telemetry.”**

### Easy memory

**State → Tasks → Results → RAG metadata → Config → Observability → Audit → Cost → Evaluation**

> **Strong architect line:**
> **“CWD is not the system of record for enterprise business data; it stores the minimum state and metadata needed to execute, recover, audit, and evaluate the workflow.”**
