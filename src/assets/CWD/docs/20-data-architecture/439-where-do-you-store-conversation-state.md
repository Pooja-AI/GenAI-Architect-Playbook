## Where do you store conversation state?

In CWD, I separate **conversation state** from **workflow state**.

For production, I would use **durable storage for the authoritative state** and Redis for fast, short-lived access.

```text id="8qv3nm"
User
  ↓
Coordinator
  ↓
Conversation State
  ├── Durable Store → Cosmos DB
  └── Redis → fast cache
```

### 1. What is conversation state?

For example, the user says:

> “Give me a briefing for C12345.”

Then:

> “Also include the open incidents.”

The system needs to remember that the current conversation is about **customer C12345**.

I might maintain:

```json id="1x8q7p"
{
  "conversation_id": "CONV-1001",
  "tenant_id": "T001",
  "user_id": "U123",
  "messages": [
    {
      "role": "user",
      "content": "Give me a briefing for C12345"
    }
  ],
  "context": {
    "customer_id": "C12345",
    "intent": "customer_briefing"
  },
  "summary": "Customer briefing for C12345",
  "created_at": "...",
  "updated_at": "..."
}
```

---

### 2. Cosmos DB for durable conversation state

For CWD, **Cosmos DB** can be the durable source for conversation/session state.

It provides persistence across:

* Coordinator restarts
* Worker failures
* deployments
* regional recovery, when configured appropriately

For example:

```text id="5m0v9q"
conversation_id = CONV-1001
        ↓
Cosmos DB
        ↓
Coordinator restart
        ↓
Load conversation state
        ↓
Continue conversation
```

---

### 3. Redis for fast access

I can use Redis as a **low-latency cache** for active conversations.

```text id="4z6k1p"
Request
   ↓
Redis
   ↓ HIT
Conversation context
```

If Redis misses:

```text id="2c9x7v"
Redis MISS
   ↓
Cosmos DB
   ↓
Load state
   ↓
Redis
```

So Redis improves latency, but I don't make Redis the **only source of truth** for important conversation state.

---

### 4. Don't store the entire conversation in every LLM call

This is important for both **cost and context-window management**.

Instead of:

```text id="7n4m2q"
Entire conversation
+ all Worker results
+ all RAG documents
+ all tool responses
        ↓
LLM ❌
```

I create a compact context:

```json id="q6w1e9"
{
  "conversation_summary": "Customer briefing for C12345",
  "customer_id": "C12345",
  "current_intent": "customer_incidents",
  "recent_user_request": "Show open incidents",
  "relevant_results": ["INC1001", "INC1002"]
}
```

This reduces token consumption and latency.

---

### 5. Conversation state vs workflow state

This distinction is important in interviews.

| State                  | Purpose                  | Example                                   |
| ---------------------- | ------------------------ | ----------------------------------------- |
| **Conversation state** | User interaction context | messages, summary, current topic          |
| **Workflow state**     | Execution/recovery       | completed Workers, pending tasks, retries |
| **Business data**      | System of record         | Salesforce customer record                |
| **Cache**              | Performance optimization | frequently accessed context               |

Example:

```text id="1w9x5r"
Conversation State
CONV-1001
 └── "Customer C12345 briefing"

Workflow State
WF-2001
 ├── Customer Worker ✓
 ├── Opportunity Worker ✓
 └── Incident Worker ⏳
```

They are related, but they shouldn't be treated as the same thing.

---

### 6. LangGraph checkpointer

Since CWD uses LangGraph, I also use the **LangGraph checkpointer** for graph execution state.

Conceptually:

```text id="6j4q8s"
Conversation
     ↓
Coordinator
     ↓
LangGraph
     ↓
Checkpointer
     ↓
Durable state
```

The checkpointer allows the graph to persist execution state associated with a workflow/thread and resume after interruption.

---

### 7. Security

Conversation state can contain sensitive information, so I apply:

* tenant isolation
* authorization
* encryption
* least-privilege access
* retention policies
* data minimization
* audit logging

I also avoid storing secrets such as API keys or access tokens in conversation state.

---

## 🎯 Interview-ready answer

> **“In CWD, I separate conversation state from workflow execution state. I would use Cosmos DB as the durable store for conversation/session context, such as conversation ID, tenant ID, relevant user context, messages or summaries, and current conversation context. Redis can be used as a low-latency cache for active conversations, but I don't depend on Redis as the sole source of truth. Since CWD uses LangGraph, I also persist graph execution state through a checkpointer so interrupted workflows can resume. To control token cost, I don't send the entire conversation to every LLM call; I maintain a compact summary and only pass the relevant context. Conversation data is tenant-isolated, access-controlled, encrypted, and subject to retention policies.”**

### Easy memory

**Conversation → Cosmos DB**
**Fast access → Redis**
**Workflow execution → LangGraph Checkpointer**
**LLM context → Compact summary + relevant context**

> **Strong interview line:**
> **“Redis improves conversation-state latency; durable storage provides recoverability. I never make an in-memory conversation the source of truth.”**
