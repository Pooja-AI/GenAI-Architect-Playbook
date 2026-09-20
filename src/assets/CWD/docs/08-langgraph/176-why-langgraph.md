For **CWD**, I chose **LangGraph** because CWD is not a simple single-agent chatbot. It is a **stateful, multi-step, multi-agent workflow** where the Coordinator and Delegators need routing, parallel execution, retries, checkpoints, and controlled recovery.

### Why LangGraph in CWD?

```text
User
 ↓
Coordinator ────────────────┐
 ↓ A2A                       │
Sales Delegator              │
 ├─ Customer Worker ─ MCP ─ Salesforce
 └─ Opportunity Worker ─ MCP ─ Salesforce
                             │
IT Delegator                 │
 └─ Incident Worker ─ MCP ─ ServiceNow
 ↓                           │
Results ─────────────────────┘
 ↓
Coordinator
 ↓
Validate + Aggregate
```

LangGraph manages the **workflow and state** behind this architecture.

### 1. Stateful orchestration

CWD needs to remember:

```python
state = {
    "task_id": "T1001",
    "customer_id": "C12345",
    "delegators": [],
    "worker_results": [],
    "errors": [],
    "status": "running"
}
```

LangGraph maintains this state as the workflow moves between nodes.

---

### 2. Conditional routing

The Coordinator can decide:

```text
Customer Briefing
       ↓
 ┌─────┴─────┐
Sales       IT
```

In LangGraph:

```python
graph.add_conditional_edges(
    "planner",
    route_delegators
)
```

So the workflow isn't hard-coded as one fixed sequence.

---

### 3. Parallel execution

Sales and IT work can execute independently:

```text
              Coordinator
              /          \
             ↓            ↓
      Sales Delegator   IT Delegator
             ↓            ↓
         Workers        Workers
```

LangGraph supports parallel branches and state aggregation.

---

### 4. Retry and failure recovery

Suppose:

```text
Customer Worker   ✓
Incident Worker   ✗
Opportunity Worker ✓
```

LangGraph can route the failed branch to retry/recovery rather than restarting everything.

```text
Worker
  ↓
Failure
  ↓
Retry
  ↓
Success → Continue
```

---

### 5. Checkpointing and resume

This is one of the strongest reasons for CWD.

If the workflow stops after two Workers complete:

```text
W1 ✓
W2 ✓
W3 ✗
```

we persist a checkpoint.

After recovery:

```text
Checkpoint
    ↓
Resume W3
    ↓
Aggregate W1 + W2 + W3
```

We don't need to execute W1 and W2 again.

---

### 6. Human-in-the-loop

Some enterprise actions may require approval.

For example:

```text
Worker
 ↓
"Delete customer record"
 ↓
Approval required
 ↓
Human approval
 ↓
Continue workflow
```

LangGraph supports interrupt/resume patterns for these workflows.

---

### 7. Clear separation of responsibilities

This is important in my CWD design:

| Component        | Responsibility                             |
| ---------------- | ------------------------------------------ |
| **LangGraph**    | Workflow/state orchestration               |
| **Coordinator**  | Understand request, plan, route, aggregate |
| **A2A**          | Agent-to-agent communication               |
| **Delegator**    | Domain-level orchestration                 |
| **Worker**       | Execute specific capability                |
| **MCP**          | Enterprise tool integration                |
| **Azure OpenAI** | LLM reasoning                              |

So **LangGraph doesn't replace A2A or MCP**.

---

### Why not just use LangChain?

A simple way to explain it in an interview:

> **LangChain is useful for building LLM/agent components, while LangGraph is better suited for explicit, stateful, controllable workflows.**

CWD requires:

* State
* Conditional routing
* Parallel branches
* Checkpoints
* Retry/recovery
* Human approval
* Long-running workflows

Those requirements make LangGraph a natural fit.

### Interview-ready answer

> **“I chose LangGraph because CWD is a stateful multi-agent workflow rather than a simple LLM chain. The Coordinator needs conditional routing to Delegators, Delegators need to orchestrate multiple Workers, and some Workers can execute in parallel. LangGraph gives us explicit state management, conditional edges, parallel execution, checkpointing, retries, interrupt/resume, and human-in-the-loop capabilities. A2A handles communication between agents and MCP handles access to enterprise tools; LangGraph is the orchestration and state-management layer connecting the workflow.”**

**Easy interview line:**

> **“LangGraph manages the workflow and state; A2A manages agent-to-agent communication; MCP manages agent-to-tool communication.”**
