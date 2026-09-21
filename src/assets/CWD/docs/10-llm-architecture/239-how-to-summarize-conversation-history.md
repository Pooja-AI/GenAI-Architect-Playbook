## How do you summarize conversation history?

In CWD, I don't send the **entire conversation history** to the LLM on every request. I maintain a **compact conversation summary** containing only information that is still relevant to the task.

### CWD approach

```text id="m2s8qk"
Conversation History
        ↓
Extract Important Information
        ↓
Create / Update Summary
        ↓
Store Summary
        ↓
New User Request
        ↓
Summary + Recent Messages
        ↓
LLM
```

### What do I keep in the summary?

I typically preserve:

* **User goal** — what the user is trying to accomplish
* **Entities** — `customer_id`, product, incident ID, etc.
* **Important facts** discovered from Workers/RAG
* **Decisions already made**
* **Constraints/preferences** relevant to the current task
* **Unresolved questions**
* **Current workflow status**

For example:

```text id="w7zj4p"
Conversation Summary:

Customer: C123
Request: Customer briefing
Product: A100
Issue: Overheating
Incident: INC1001
Root cause: Cooling fan failure
Sales status: Renewal discussion in progress
Service status: 2 open incidents
Unresolved: User wants recommended next action
```

Instead of sending 30 previous messages, the Coordinator receives this summary plus the most recent messages.

---

## How do I update the summary?

I use **incremental summarization**.

```text id="7a9k2c"
Existing Summary
      +
New Conversation Turns
      ↓
Summary Update
      ↓
New Compact Summary
```

For example:

```text
Before:
Customer = C123
Issue = overheating

New conversation:
Service Worker confirms cooling fan failure.

After:
Customer = C123
Issue = overheating
Root cause = cooling fan failure
```

I don't blindly append everything to the summary.

---

## What should NOT go into the summary?

I avoid storing unnecessary content such as:

* Repeated greetings
* Full raw API responses
* Duplicate RAG chunks
* Long Worker responses
* Temporary intermediate reasoning
* Unnecessary conversation details

The summary should contain **facts and state**, not a transcript.

---

## In CWD, where is it stored?

I separate **conversation state** from **workflow execution state**.

For example:

```text id="3c4m7x"
                 CWD State
                    │
        ┌───────────┴───────────┐
        ↓                       ↓
Conversation State        Workflow State
        ↓                       ↓
Summary + recent        task/run/step status
messages                Worker results
        ↓                       ↓
 Redis / Cosmos DB        Redis / Cosmos DB
```

The exact storage choice depends on the state requirements. Redis is useful for fast access, while Cosmos DB can provide durable persistence.

---

## Important: Don't summarize everything blindly

For enterprise applications, I use a **structured summary** rather than relying only on free-form summarization.

For example:

```json id="n6t3cw"
{
  "customer_id": "C123",
  "intent": "customer_briefing",
  "product": "A100",
  "open_incidents": 2,
  "important_facts": [
    "Cooling fan failure",
    "Renewal discussion in progress"
  ],
  "pending_question": "Recommended next action"
}
```

This makes the state easier for the Coordinator and Workers to consume reliably.

### 🎯 Strong interview answer

> **“I use incremental conversation summarization to control context size. Instead of sending the complete conversation to the LLM, I maintain a compact summary containing the user's goal, important entities, decisions, relevant facts, constraints, and unresolved items. When new messages arrive, I update the summary rather than continuously appending the full history. In CWD, I keep conversation state separate from workflow execution state and persist it in Redis or Cosmos DB. The Coordinator receives the summary plus recent messages, which reduces tokens while preserving the important context.”**

### Easy memory trick

**Goal → Entities → Facts → Decisions → Pending items**

And remember:

> **“Summary is state, not transcript.”**
