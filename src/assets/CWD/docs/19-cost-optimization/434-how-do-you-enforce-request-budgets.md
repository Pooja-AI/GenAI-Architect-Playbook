## How do you enforce request budgets?

A **request budget** limits how much overall work a single user request can consume in CWD.

For example, one request should not be allowed to create unlimited:

* LLM calls
* Worker executions
* MCP/tool calls
* retries
* workflow time
* downstream API requests

> **Token budget controls tokens; request budget controls the overall execution of a request.**

### 1. Define a request budget

For example, for one Customer Briefing request:

```text
Request Budget
├── Max LLM calls       = 10
├── Max Worker tasks    = 8
├── Max MCP calls       = 15
├── Max retries         = 3
├── Max workflow time   = 30 sec
└── Max token budget    = 20K
```

These are illustrative values.

---

### 2. Create a request context

When the request enters CWD, I create a `workflow_id` and initialize the budget.

```python
request_budget = {
    "workflow_id": "WF-1001",
    "llm_calls": 0,
    "worker_tasks": 0,
    "mcp_calls": 0,
    "retries": 0,
    "start_time": time.time()
}
```

The `workflow_id` follows the request through:

```text
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
MCP
```

---

### 3. Check the budget before expensive operations

Before creating a Worker task:

```python
if budget["worker_tasks"] >= MAX_WORKER_TASKS:
    raise RequestBudgetExceeded()
```

Before an MCP call:

```python
if budget["mcp_calls"] >= MAX_MCP_CALLS:
    raise RequestBudgetExceeded()
```

Before an LLM call:

```python
if budget["llm_calls"] >= MAX_LLM_CALLS:
    raise RequestBudgetExceeded()
```

So the Agent cannot continuously generate work.

---

### 4. Enforce a time budget

I also give the workflow an overall deadline.

```text
Request starts
     ↓
30-second deadline
     ↓
Coordinator → Delegators → Workers → MCP
     ↓
Deadline exceeded?
     ↓
Stop safely
```

This prevents a request from consuming resources indefinitely even if individual operations are within their own limits.

---

### 5. Combine request budget with token budget

For CWD:

```text
Request budget
      │
      ├── LLM calls
      ├── Worker tasks
      ├── MCP calls
      ├── Retries
      ├── Time
      └── Token budget
```

The request must stay within **all applicable limits**.

---

### 6. Prevent Worker explosion

Consider:

```text
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
LLM decides:
"Let's call 20 more Workers..."
```

That's dangerous.

The Coordinator/Workflow policy should enforce:

```text
Maximum Workers per request
Maximum parallel Workers
Maximum total tasks
```

For example:

```python
if active_tasks >= MAX_CONCURRENT_TASKS:
    queue_task()
```

---

### 7. Limit retries

Retries are part of the request's resource consumption.

Bad:

```text
Worker failure
 ↓
retry
 ↓
retry
 ↓
retry
 ↓
retry forever ❌
```

Instead:

```text
Failure
 ↓
Transient?
 ↓
Retry 1
 ↓
Retry 2
 ↓
Retry 3
 ↓
Stop / DLQ / HITL
```

I also avoid retry amplification where Coordinator, Worker, MCP, and downstream systems all independently retry the same operation.

---

### 8. Use queues for excess work

If the request has more work than can safely execute immediately:

```text
Request
  ↓
Budget check
  ↓
Service Bus
  ↓
Controlled Worker execution
```

This provides backpressure rather than allowing unlimited parallel execution.

---

### 9. Apply tenant-level budgets too

Request budgets protect **one request**.

Tenant quotas protect **the whole tenant**.

```text
Tenant
  ↓
Tenant quota
  ↓
Request budget
  ↓
CWD workflow
```

For example:

```text
Tenant quota:
100 concurrent workflows

Request budget:
10 LLM calls
15 MCP calls
8 Workers
30 sec
```

This prevents both:

* one request from consuming too much
* one tenant from consuming the entire platform

---

## CWD example

For:

> **“Create a complete customer briefing for C12345.”**

The Coordinator creates:

```text
WF-1001

Budget:
LLM calls     10
Worker tasks   8
MCP calls     15
Retries        3
Time           30 sec
Tokens        20K
```

Then:

```text
Coordinator
   ↓
Sales Delegator
   ├── Customer Worker → MCP → Salesforce
   └── Opportunity Worker → MCP → Salesforce

IT Delegator
   └── Incident Worker → MCP → ServiceNow
   ↓
Aggregation
   ↓
Final synthesis
```

Every operation checks the remaining request budget.

If the workflow reaches:

```text
MCP calls = 15 / 15
```

the next MCP call is blocked.

The system can then return validated partial results, queue remaining work, or escalate to HITL depending on business criticality.

---

## 🎯 Interview-ready answer

> **“I enforce request budgets by creating a workflow-level budget when a request enters CWD. The budget can include maximum LLM calls, Worker tasks, MCP calls, retries, execution time, and token consumption. I associate all operations with a workflow ID and check the remaining budget before starting expensive work. I also limit concurrent Worker execution and use Service Bus for excess asynchronous work. If the request reaches a hard limit, I stop additional execution and return validated partial results, queue the remaining work, or route to HITL based on business criticality. I combine this with tenant-level quotas so both individual requests and overall tenant consumption are controlled.”**

### Easy memory

**Request → Set budget → Track → Check → Execute → Update → Stop/Queue when limit reached**

> **Strong interview line:**
> **“A request budget puts a hard boundary around how much work one workflow is allowed to generate.”**
