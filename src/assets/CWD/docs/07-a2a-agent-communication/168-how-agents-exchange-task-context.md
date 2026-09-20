In your **CWD architecture**, agents exchange task context through the **A2A task message**. The context is carried as structured data so the receiving Delegator knows **what to do, for whom, why, and how the task relates to the overall workflow**.

## 1. Simple flow

```text
User
  │
  ▼
Coordinator
  │
  │ A2A Task + Context
  ▼
Sales Delegator
  │
  ├── Customer Worker
  └── Opportunity Worker
```

The Coordinator does **not** just send:

```text
"Get customer information"
```

It sends structured context such as:

```text
Task ID
Correlation ID
Intent
Customer ID
Required capability
User/request context
Constraints
Security context
```

---

# 2. Example from your CWD

User asks:

```text
"Give me a customer briefing for customer C12345."
```

The Coordinator creates structured context:

```json
{
  "task_id": "T1001",
  "correlation_id": "C789",
  "from_agent": "coordinator",
  "to_agent": "sales-delegator",

  "intent": "customer_briefing",

  "entities": {
    "customer_id": "C12345"
  },

  "required_capability": "customer_information",

  "constraints": {
    "max_latency_ms": 5000
  }
}
```

This is the **task context** exchanged with the Delegator.

---

# 3. What does each field mean?

### `task_id`

Identifies the specific task.

```text
T1001
```

For example:

```text
Customer briefing → T1001
```

If the Coordinator has multiple tasks:

```text
T1001 → Sales
T1002 → IT
T1003 → Manufacturing
```

the Coordinator can distinguish them.

---

### `correlation_id`

Identifies the **overall business request/workflow**.

```text
C789
```

For example:

```text
C789
Customer Briefing
   │
   ├── T1001 Sales
   └── T1002 IT
```

So even though there are multiple tasks, the Coordinator knows they belong to the same user request.

---

# 4. Intent

The Coordinator passes the business intent.

```json
{
  "intent": "customer_briefing"
}
```

The Delegator knows:

> "This is a customer briefing request."

It doesn't have to reconstruct the user's original natural-language request.

---

# 5. Entities

This is where your **customer ID** is passed.

```json
{
  "entities": {
    "customer_id": "C12345"
  }
}
```

The Sales Delegator can pass that context to its Workers.

```text
Coordinator
     │
     │ customer_id=C12345
     ▼
Sales Delegator
     │
     ├── Customer Worker
     │       │
     │       └── customer_id=C12345
     │
     └── Opportunity Worker
             │
             └── customer_id=C12345
```

---

# 6. Required capability

The Coordinator can tell the Delegator what capability is required:

```json
{
  "required_capability": "customer_information"
}
```

This helps the Delegator determine which Worker(s) should execute.

For example:

```text
customer_information
        ↓
Customer Worker
```

while:

```text
support_information
        ↓
Incident Worker
```

---

# 7. Context can also contain constraints

For example:

```json
{
  "constraints": {
    "max_latency_ms": 5000,
    "response_format": "structured_json"
  }
}
```

The Delegator can use this information when executing the task.

---

# 8. Security context

In your enterprise CWD, you should **not blindly pass sensitive information through the LLM context**.

Instead, pass or reference the necessary security context, such as:

```text
user identity
tenant
roles/claims
entitlements
correlation ID
```

Conceptually:

```json
{
  "security_context": {
    "user_id": "user-123",
    "tenant": "onsemi",
    "roles": [
      "sales-read"
    ]
  }
}
```

But in a production implementation, sensitive credentials such as:

```text
password
client secret
API key
access token
```

should **not** be placed into an LLM-generated task payload.

Instead, the MCP/enterprise integration layer obtains credentials securely through mechanisms such as managed identity, OAuth, Key Vault, etc.

---

# 9. How context flows through the whole CWD

This is the important picture:

```text
                         USER
                           │
                           │
                "Brief customer C12345"
                           │
                           ▼
                    ┌─────────────┐
                    │ Coordinator │
                    └──────┬──────┘
                           │
                  Creates task context
                           │
                           │ A2A
                           ▼
                  ┌─────────────────┐
                  │ Sales Delegator │
                  └────────┬────────┘
                           │
                    extracts context
                           │
              customer_id = C12345
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Customer Worker          Opportunity Worker
              │                         │
             MCP                       MCP
              │                         │
         Salesforce                Salesforce
```

The Delegator doesn't need the entire original conversation.

It gets the **relevant structured context** needed to perform its task.

---

# 10. How does the result carry context back?

The Delegator returns the task ID and correlation ID along with the result.

```json
{
  "task_id": "T1001",
  "correlation_id": "C789",
  "from_agent": "sales-delegator",
  "to_agent": "coordinator",
  "status": "completed",

  "result": {
    "customer_name": "ABC Corp",
    "open_opportunities": 3
  }
}
```

The Coordinator can then correlate:

```text
C789
Customer Briefing
     │
     ├── T1001 → Sales result
     └── T1002 → IT result
```

---

# 11. What if the task is long-running?

The context remains associated with the task.

For example:

```text
T1001
  │
  ├── submitted
  ├── working
  └── completed
```

The Delegator can send:

```json
{
  "task_id": "T1001",
  "correlation_id": "C789",
  "status": "working"
}
```

Later:

```json
{
  "task_id": "T1001",
  "correlation_id": "C789",
  "status": "completed",
  "result": {}
}
```

The IDs allow the Coordinator to associate the response with the correct workflow.

---

# 12. Very important: Context ≠ entire conversation

An interviewer may ask this follow-up.

Don't say:

> "We send the entire conversation history to every agent."

Instead say:

> **"We propagate only the context required for the delegated task. The Coordinator converts the user's request into structured task context such as intent, entities, task ID, correlation ID, constraints, and relevant authorization context. This minimizes unnecessary data transfer and reduces token usage and data-exposure risk."**

For example, if the Sales Delegator only needs:

```text
customer_id = C12345
```

you don't need to send:

```text
10 turns of unrelated conversation
```

---

# 13. Where does LangGraph state fit?

This is another important distinction.

Your **LangGraph state** can contain the broader workflow state:

```python
state = {
    "intent": "customer_briefing",
    "customer_id": "C12345",
    "delegator_results": [],
    "errors": [],
    "task_ids": []
}
```

But you don't send the entire LangGraph state to every agent.

Instead:

```text
LangGraph State
       │
       ▼
Select relevant context
       │
       ▼
A2A Task
       │
       ▼
Delegator
```

So:

> **LangGraph manages workflow state; A2A carries the relevant task context across the agent boundary.**

---

# 14. Context inside the Delegator

The Delegator can create its own internal state:

```python
delegator_state = {
    "task_id": "T1001",
    "customer_id": "C12345",
    "intent": "customer_briefing",
    "worker_results": [],
    "errors": []
}
```

Then Workers receive only what they need:

```python
worker_input = {
    "customer_id": "C12345"
}
```

So the context becomes progressively more focused:

```text
User Request
     ↓
Coordinator Context
     ↓
A2A Task Context
     ↓
Delegator State
     ↓
Worker Input
     ↓
MCP Tool Arguments
```

For your example:

```text
"Give customer briefing for C12345"
            ↓
intent=customer_briefing
            ↓
A2A task
            ↓
customer_id=C12345
            ↓
Customer Worker
            ↓
MCP: get_customer(C12345)
```

---

# 15. Interview-ready answer

If they ask:

### **"How do agents exchange task context?"**

Say:

> **"In CWD, agents exchange task context through the A2A task message. The Coordinator converts the user's request into structured context containing the task ID, correlation ID, intent, entities such as customer ID, required capability, constraints, and relevant authorization context. It sends this context to the appropriate Delegator through A2A. The Delegator uses that context to select and execute its Workers. The Delegator then returns the result, status, task ID, and correlation ID through A2A. The Coordinator uses those IDs to correlate the response with the correct workflow, validate it, and aggregate the results."**

### Short version to memorize:

> **"We don't pass the entire conversation between agents. We pass only the required structured task context—intent, entities, task ID, correlation ID, constraints, and security context—through A2A."**

And the flow to remember is:

```text
User
 ↓
Coordinator
 ↓
Structured Context
 ↓ A2A
Delegator
 ↓
Worker
 ↓ MCP
Enterprise Tool
 ↓
Result
 ↓ A2A
Coordinator
 ↓
Validate + Aggregate
```
