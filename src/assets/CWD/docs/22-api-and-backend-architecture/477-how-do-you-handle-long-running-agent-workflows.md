## How do you handle long-running agent workflows?

For long-running CWD workflows, **I don't keep the API request open until the entire Agentic AI workflow finishes**. I make the workflow asynchronous, persist its state, and allow it to resume after failures.

### CWD flow

```text
Client
   ↓
APIM
   ↓
FastAPI
   ↓
Create Workflow
   ↓
Queue (Azure Service Bus)
   ↓
Coordinator / LangGraph
   ↓
Delegators
   ↓
Workers
   ↓
MCP → Enterprise Systems
   ↓
Persist checkpoint/state
   ↓
Final result
```

### Step-by-step

**1. API returns quickly**

When the request comes in:

```http
POST /api/v1/customer-briefing
```

FastAPI creates a `workflow_id` and returns:

```json
{
  "workflow_id": "WF-1001",
  "status": "ACCEPTED"
}
```

Usually the API returns **202 Accepted** rather than making the user wait.

---

**2. Put the workflow into a durable queue**

I use **Azure Service Bus** to decouple API handling from workflow execution.

```text
FastAPI
   ↓
Service Bus
   ↓
Workflow Worker
   ↓
LangGraph Coordinator
```

This helps absorb traffic spikes and prevents long-running workflows from blocking API instances.

---

**3. Persist LangGraph state/checkpoints**

LangGraph maintains the workflow state, and I persist the checkpoint in durable storage such as **Cosmos DB**.

For example:

```json
{
  "workflow_id": "WF-1001",
  "status": "RUNNING",
  "completed_tasks": [
    "customer_worker",
    "opportunity_worker"
  ],
  "pending_tasks": [
    "incident_worker"
  ]
}
```

So if the process crashes, I don't restart everything from the beginning.

---

**4. Run independent Workers in parallel**

For a Customer Briefing:

```text
                Coordinator
                     |
              Sales Delegator
               /           \
      Customer Worker   Opportunity Worker
               \           /
                \         /
                 parallel
```

If IT incidents are independent:

```text
IT Delegator
     ↓
Incident Worker
     ↓
ServiceNow MCP
```

These tasks can execute concurrently.

---

**5. Handle failures with checkpoint + retry**

Suppose:

```text
Customer Worker     ✓
Opportunity Worker  ✓
Incident Worker     ✗
```

I checkpoint the successful results and retry only the failed task.

```text
Load checkpoint
      ↓
Skip completed Workers
      ↓
Retry Incident Worker
      ↓
Validate result
      ↓
Aggregate
```

This avoids re-running expensive LLM calls and enterprise API calls unnecessarily.

---

**6. Handle human approval when required**

For sensitive operations such as:

```text
Create order
Delete data
Update customer record
Send external communication
```

the workflow can pause:

```text
Worker
  ↓
HITL Approval Required
  ↓
PAUSED
  ↓
Human Approval
  ↓
Resume from checkpoint
  ↓
Worker continues
```

LangGraph's interrupt/resume pattern is useful here.

---

**7. Client checks workflow status**

Instead of keeping the HTTP connection open:

```http
GET /api/v1/workflows/WF-1001
```

Response:

```json
{
  "workflow_id": "WF-1001",
  "status": "COMPLETED",
  "result": {
    "customer": "...",
    "sales": "...",
    "incidents": "..."
  }
}
```

For applications that need it, I can also use a callback/webhook or push notification when the workflow completes.

### Important distinction

Don't say:

> "FastAPI async handles long-running workflows."

A better answer is:

> **`async/await` helps with concurrent I/O, but durable long-running workflows require a queue, background execution, persistent state/checkpoints, retries, and resume capability.**

### Interview-ready answer

> **“For long-running CWD workflows, I decouple the API from workflow execution. FastAPI accepts the request, creates a workflow ID, and places the job on Azure Service Bus. The Coordinator then executes the LangGraph workflow asynchronously. I persist checkpoints and workflow state in durable storage such as Cosmos DB, so if a Worker or infrastructure component fails, I can resume from the last successful checkpoint instead of restarting the entire workflow. Independent Workers can execute in parallel, while dependent tasks execute sequentially. For sensitive operations, I can pause for human approval and resume later. The client can query the workflow status using the workflow ID or receive a completion callback.”**

### Easy memory

**Long-running =**

**API → Queue → LangGraph → Checkpoint → Retry/Resume → Result**

### Strong interview line

> **“I make the workflow durable, not the HTTP request long-lived.”**
