## How do you separate session state and workflow state?

In CWD, I separate them because **session state represents the user's ongoing conversation**, while **workflow state represents one specific business execution**.

### 1. Session State — conversation-level

Session state survives across multiple user messages.

Example:

```python
session_state = {
    "session_id": "S1001",
    "user_id": "U123",
    "conversation_summary": "User is asking about customer ABC",
    "customer_id": "C12345",
    "preferences": {},
    "recent_messages": [...]
}
```

It answers:

> **“What does the system need to remember about this conversation?”**

For example:

```text
User: Give me a briefing for customer C12345.
System: ...
User: Also include their open incidents.
```

The second request can reuse `customer_id=C12345` from session context.

---

### 2. Workflow State — execution-level

Workflow state belongs to **one specific CWD execution**.

For example:

```python
workflow_state = {
    "workflow_id": "W9001",
    "intent": "customer_briefing",
    "customer_id": "C12345",
    "selected_delegators": [
        "sales_delegator",
        "it_delegator"
    ],
    "worker_status": {
        "customer_worker": "completed",
        "incident_worker": "completed"
    },
    "worker_results": [],
    "errors": [],
    "retry_count": 0,
    "approval_status": None
}
```

It answers:

> **“What is happening in this particular business workflow?”**

For example:

```text
Workflow W9001
   ↓
Coordinator
   ↓
Sales Delegator ──→ Customer Worker ──→ Salesforce
   ↓
IT Delegator ─────→ Incident Worker ──→ ServiceNow
   ↓
Validation
   ↓
Aggregation
```

---

## Why separate them?

Suppose the same user starts another request:

```text
Session S1001
│
├── Workflow W9001 → Customer Briefing
│      ├── Sales Worker ✓
│      └── Incident Worker ✓
│
└── Workflow W9002 → Open Opportunities
       └── Opportunity Worker → running
```

The **session remains the same**, but each workflow has its own state.

This prevents one workflow's temporary data from accidentally affecting another workflow.

---

## In LangGraph

I would keep the workflow-specific state in the LangGraph `StateGraph`:

```python
class WorkflowState(TypedDict):
    workflow_id: str
    intent: str
    customer_id: str
    delegators: list
    worker_results: list
    errors: list
    status: str
```

And identify the conversation with a stable `thread_id`:

```python
config = {
    "configurable": {
        "thread_id": "S1001"
    }
}
```

For production, I would persist the appropriate state/checkpoints in a durable store and apply retention/security controls.

### Important distinction

| Session State             | Workflow State             |
| ------------------------- | -------------------------- |
| Conversation-level        | Execution-level            |
| Can span many workflows   | Belongs to one workflow    |
| User/session context      | Worker/delegator execution |
| Conversation summary      | Worker results             |
| User preferences          | Retry count                |
| Relevant customer context | Errors/status              |
| Long-lived                | Usually shorter-lived      |
| Helps understand the user | Helps execute the task     |

### CWD example

```text
Session State
S1001
 ├── user_id
 ├── conversation_summary
 └── customer_id

        ↓ starts workflow

Workflow State
W9001
 ├── intent = Customer Briefing
 ├── Sales Delegator = completed
 ├── IT Delegator = completed
 ├── worker_results
 └── final_response

        ↓ workflow completed

Session State remains available
for the user's next request.
```

### Interview-ready answer

> **“I separate session state from workflow state. Session state contains cross-turn conversation context such as session ID, user context, customer ID, conversation summary, and relevant history. Workflow state contains execution-specific information such as intent, selected Delegators, Worker status, results, errors, retries, and approvals. In CWD, LangGraph manages the workflow state and checkpointing, while a stable session or thread ID associates multiple workflows with the same conversation. This separation prevents temporary execution data from leaking between workflows and also helps control token growth and state retention.”**

**Easy memory:**
**Session state = “What do I remember about this conversation?”**
**Workflow state = “What is happening in this execution?”**
