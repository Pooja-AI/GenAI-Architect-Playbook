In your **CWD architecture**, persistence means **saving information so it survives beyond the current request, process, or application restart**.

The key difference from caching is:

> **Cache = temporary fast copy**
> **Persistence = durable information that we need to keep**

### Where I would introduce persistence

#### 1. Workflow state — most important

Your CWD workflow needs to remember what has already happened:

```text id="r9n4c7"
Coordinator
    ↓
Delegator
    ↓
Workers
    ↓
Workflow State
```

For example:

```text
Workflow ID: W123

Salesforce Worker → SUCCESS
ServiceNow Worker → SUCCESS
Revenue Worker    → FAILED
```

Persist this state so that if the application crashes, we don't restart everything.

```text id="8d2w1p"
W1 → SUCCESS ─┐
W2 → SUCCESS ─┤→ Persisted State
W3 → FAILED  ─┘
                  ↓
              Application restart
                  ↓
              Resume W3
```

This is where **LangGraph checkpointing + durable storage** becomes important.

---

### 2. Conversation / session state

For multi-turn interactions:

```text id="n9b3l0"
User
 ↓
Session
 ↓
Conversation State
```

We may persist:

* Session ID
* Conversation history/reference
* Current task
* User context
* Workflow status
* Previous results

For active/high-speed state, **Redis** can be used; for durable state, use a persistent database such as **Cosmos DB**.

---

### 3. Worker results

Suppose three Workers execute:

```text id="5z7p1k"
Salesforce Worker → Customer information
ServiceNow Worker → Incidents
Revenue Worker    → Revenue information
```

Persisting the results allows the system to:

* Resume after failure
* Avoid recomputing completed Workers
* Audit what happened
* Replay a workflow
* Investigate failures

---

### 4. Audit trail

For an enterprise system, I would persist important events:

```text id="b2j4c6"
User Request
    ↓
Coordinator Decision
    ↓
Delegator Selected
    ↓
Worker Invoked
    ↓
Tool Called
    ↓
Result
    ↓
Final Response
```

This gives you an audit trail for:

* Who initiated the request
* Which agents ran
* Which tools were called
* What succeeded/failed
* When each operation occurred
* Correlation/workflow IDs

This is especially important for enterprise governance.

---

### 5. Agent / Prompt configuration

I would persist versioned configuration such as:

```text id="x2m8q1"
Agent Registry
Prompt Registry
Tool Registry
Model Configuration
Evaluation Configuration
```

For example:

```text
CustomerBriefingAgent
Prompt Version: v3
Model: GPT-X
Tools: Salesforce, ServiceNow
```

This allows you to reproduce what configuration was used for a particular workflow.

---

### 6. Evaluation data

For your LLM evaluation architecture, persist:

```text id="v7k3p0"
Input
 ↓
Agent Response
 ↓
Retrieved Context
 ↓
Expected Answer
 ↓
Evaluation Scores
```

Metrics such as:

* Groundedness
* Relevance
* Tool success
* Answer correctness
* Latency
* Token usage
* Cost

can then be analyzed over time.

---

## Redis vs Cosmos DB in your CWD

This is a common interview follow-up.

| Requirement                 | Redis                                    | Cosmos DB |
| --------------------------- | ---------------------------------------- | --------- |
| Very fast active state      | ✅                                        |           |
| Temporary session data      | ✅                                        |           |
| Cache                       | ✅                                        |           |
| Durable workflow state      |                                          | ✅         |
| Long-term conversation data |                                          | ✅         |
| Audit records               |                                          | ✅         |
| Resume after restart        | Possible, depending on durability/config | ✅         |
| Historical analysis         |                                          | ✅         |

So you can explain:

> **“I would use Redis for low-latency active state and caching, while Cosmos DB would be the durable source for workflow state, conversation metadata, audit information, and other data that must survive application restarts.”**

---

## Persistence vs Cache vs Queue

This is the easiest way to remember all three:

```text id="q5h8s2"
             CWD
              │
      ┌───────┼────────┐
      ↓       ↓        ↓
    Cache    Queue   Persistence
    Redis    Service   Cosmos DB
             Bus
      │       │        │
      ↓       ↓        ↓
   Avoid    Move     Remember
   repeat   work     permanently
```

### Interview answer

> **“In CWD, I would introduce persistence primarily for durable workflow state, session information, Worker results, audit trails, and agent or prompt configuration. The most important use case is workflow recovery. If two Workers succeed and the third fails, I persist the execution state so that after a failure or restart we can resume from the failed Worker instead of re-running the completed work. I would use Redis for fast active state and caching, while Cosmos DB or another durable store would maintain the long-term state.”**
