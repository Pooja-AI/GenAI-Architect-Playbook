In **CWD**, we correlate A2A requests using a **`correlation_id` + `task_id`**, and sometimes a **`parent_task_id`** for child tasks.

### 1. `correlation_id` — tracks the whole business request

Suppose the user asks:

> “Give me a customer briefing for C12345.”

Coordinator creates:

```json
{
  "correlation_id": "C789",
  "intent": "customer_briefing",
  "customer_id": "C12345"
}
```

Everything related to this request uses `C789`.

```text
C789 = Customer Briefing
 ├── Sales task
 ├── IT task
 └── Document task
```

---

### 2. `task_id` — identifies one specific agent task

The Coordinator creates separate A2A tasks:

```text
C789
 ├── T1001 → Sales Delegator
 └── T1002 → IT Delegator
```

Example:

```json
{
  "task_id": "T1001",
  "correlation_id": "C789",
  "from_agent": "coordinator",
  "to_agent": "sales-delegator",
  "intent": "customer_briefing",
  "customer_id": "C12345"
}
```

So:

* **`correlation_id`** → entire workflow
* **`task_id`** → individual task

---

### 3. Propagate IDs through the workflow

The IDs travel through the CWD layers:

```text
User
 ↓
Coordinator
 correlation_id = C789
 ↓ A2A
Sales Delegator
 task_id = T1001
 ↓
Customer Worker
 ↓ MCP
Salesforce
```

When Salesforce returns a result, the Worker keeps the same context:

```json
{
  "correlation_id": "C789",
  "task_id": "T1001",
  "worker_id": "customer-worker",
  "status": "completed"
}
```

The Delegator sends that result back through A2A.

---

### 4. `parent_task_id` helps with nested tasks

Suppose the Sales Delegator creates two Worker tasks:

```text
C789
  └── T1001 Sales Delegator
       ├── T1001-1 Customer Worker
       └── T1001-2 Opportunity Worker
```

We can maintain:

```json
{
  "task_id": "T1001-1",
  "parent_task_id": "T1001",
  "correlation_id": "C789"
}
```

This lets us reconstruct the complete execution tree.

---

### 5. Why correlation is important

It helps us answer:

> **“Which response belongs to which request?”**

For example, imagine 100 customer briefings are running simultaneously:

```text
C789  → Customer C12345
C790  → Customer C56789
C791  → Customer C99999
```

A response:

```text
task_id = T1001
correlation_id = C789
```

can be matched to the correct workflow without relying on timing or customer name.

---

### 6. It also helps troubleshooting

Our observability system can search:

```text
correlation_id = C789
```

and show:

```text
C789
 ├── Coordinator
 ├── Sales Delegator
 │    ├── Customer Worker
 │    └── Opportunity Worker
 ├── IT Delegator
 │    └── Incident Worker
 └── Final aggregation
```

We can then see **where the request spent time, which agent failed, which MCP tool was called, and what the final status was.**

### Interview-ready answer

> **“In CWD, I correlate A2A requests using a correlation ID and task ID. The correlation ID represents the complete business workflow, while the task ID uniquely identifies an individual agent task. When the Coordinator sends tasks to Sales and IT Delegators, each task gets its own task ID but shares the same correlation ID. We propagate these IDs through Delegators, Workers, MCP calls, and responses. For nested tasks, we can also use a parent task ID. This allows us to correctly match asynchronous responses, support retries and resume, and provide end-to-end distributed tracing.”**

**Easy way to remember:**

> **Correlation ID = whole journey**
> **Task ID = one task**
> **Parent Task ID = task hierarchy**
