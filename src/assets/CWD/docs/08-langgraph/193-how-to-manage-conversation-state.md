## How do you manage conversation state in LangGraph / CWD?

**Conversation state is the information the system needs to remember across multiple turns of a conversation or workflow.**

In CWD, I manage it using **LangGraph state + checkpointing + a conversation/workflow ID**, while keeping the state minimal.

### CWD example

User first asks:

> "Give me a briefing for customer C12345."

Then:

> "Also show me their open incidents."

The system needs to remember:

```text
customer_id = C12345
intent = customer_briefing
previous_results = ...
current_request = open incidents
```

So the second request doesn't need to ask for the customer ID again.

---

## 1. Define structured graph state

For example:

```python
from typing import TypedDict

class CWDState(TypedDict):
    conversation_id: str
    user_request: str
    intent: str
    customer_id: str
    conversation_summary: str
    worker_results: list
    errors: list
    final_response: str
```

The state contains only information required by the workflow.

---

## 2. Use a conversation/thread ID

Each conversation gets a stable identifier:

```python
config = {
    "configurable": {
        "thread_id": "CWD-CONV-1001"
    }
}
```

Then subsequent messages use the same ID:

```text
User Message 1
     ↓
thread_id = CWD-CONV-1001
     ↓
Checkpoint
     ↓
User Message 2
     ↓
thread_id = CWD-CONV-1001
     ↓
Restore previous state
```

This lets LangGraph associate the new turn with the existing workflow state.

---

## 3. Persist the state with checkpointing

Conceptually:

```text
Conversation
     ↓
LangGraph State
     ↓
Checkpointer
     ↓
Durable Storage
```

For example:

```python
app = graph.compile(
    checkpointer=checkpointer
)
```

So if the process restarts, the conversation/workflow state can be restored.

---

## 4. Don't store the entire conversation forever

This is important for **token control**.

Instead of:

```text
Message 1
Message 2
Message 3
...
Message 500
```

use:

```text
Recent messages
+
Conversation summary
+
Current task context
```

Example:

```python
state = {
    "conversation_summary":
        "User is reviewing customer C12345. "
        "Previous request retrieved Salesforce customer data.",
    
    "customer_id": "C12345",

    "current_request":
        "Show me open incidents"
}
```

This keeps the context manageable.

---

# 5. Separate conversation state from business data

Don't put everything into LangGraph state.

For example:

```text
LangGraph State
 ├── intent
 ├── customer_id
 ├── current task
 ├── relevant results
 └── workflow status

Enterprise DB
 ├── Customer records
 ├── Orders
 ├── Tickets
 └── Historical business data

Vector DB / Search
 └── Documents

Observability
 └── Traces / token usage / latency
```

LangGraph state should contain **what the workflow needs**, not become your entire enterprise database.

---

# 6. Conversation state vs workflow state

This distinction is useful in interviews.

### Conversation state

What the user and system need to remember across turns:

```text
customer_id
user preferences
conversation summary
previous relevant context
```

### Workflow state

What the current CWD execution needs:

```text
selected Delegators
Worker status
Worker results
errors
retry count
approval status
```

They can exist together in LangGraph state, but conceptually they are different.

---

# 7. Conversation state + A2A

Don't send the entire conversation history to every Delegator.

For example, Coordinator receives:

```text
Conversation:
"Give me a briefing for C12345.
Also show open incidents."
```

The Coordinator extracts:

```json
{
  "task_id": "T1002",
  "intent": "open_incidents",
  "customer_id": "C12345"
}
```

Then sends only the necessary context to the IT Delegator.

```text
Coordinator
     ↓ A2A
IT Delegator
     ↓
customer_id = C12345
intent = open_incidents
```

This reduces token usage and prevents unnecessary context leakage.

---

# 8. Security

Conversation state may contain sensitive information, so I would apply:

* User authentication
* Authorization
* Tenant/user isolation
* Encryption at rest
* Encryption in transit
* Access controls
* Data retention policies
* PII/sensitive-data filtering
* Audit logging

For example:

```text
User A → Conversation A → State A

User B → Conversation B → State B
```

User B must never be able to access User A's conversation state.

---

# 9. Example end-to-end flow

```text
Turn 1
User:
"Give me a briefing for C12345."

        ↓

Coordinator
        ↓
State:
customer_id = C12345
intent = customer_briefing

        ↓
Checkpoint

        ↓

Turn 2
User:
"Also show me open incidents."

        ↓

Load existing state
        ↓
customer_id = C12345
        ↓
Coordinator updates:
intent = open_incidents
        ↓
IT Delegator
        ↓
Incident Worker
        ↓
MCP → ServiceNow
        ↓
Response
        ↓
Checkpoint
```

The user didn't have to repeat `C12345`.

---

## Interview-ready answer

> **“I manage conversation state using structured LangGraph state, a stable conversation or thread ID, and checkpointing for persistence. The state contains only the context required for the current conversation and workflow, such as customer ID, intent, relevant results, conversation summary, and workflow status. For long conversations, I summarize older history and retain only recent or relevant context to control token growth. I also separate conversation/workflow state from enterprise business data and use A2A to send only the required task context to Delegators rather than the entire conversation.”**

### Easy memory

**Thread ID → identifies conversation**
**State → current context**
**Checkpoint → persists it**
**Summary → controls token growth**
**A2A → sends only required context**
**Security → isolates user/tenant state**
