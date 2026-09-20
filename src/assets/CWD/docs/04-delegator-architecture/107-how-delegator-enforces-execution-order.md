In **CWD**, execution order is enforced primarily by **LangGraph workflow dependencies and conditional edges**. The LLM can propose a plan, but **LangGraph and deterministic workflow rules control the actual execution order**.

### 1. Identify dependencies first

Suppose the Sales Delegator has three Workers:

```text
CustomerProfileWorker
        ↓
ContractWorker
        ↓
SalesSummaryWorker
```

The business dependency is:

```text
CustomerProfileWorker
        ↓
ContractWorker
        ↓
SalesSummaryWorker
```

For example, `ContractWorker` needs the `customer_id` or validated customer information before it can execute.

---

### 2. LangGraph represents the dependency

Conceptually, the graph looks like:

```text
START
  ↓
CustomerProfileWorker
  ↓
ContractWorker
  ↓
SalesSummaryWorker
  ↓
END
```

LangGraph will not execute `ContractWorker` until the graph reaches that node.

So execution is not:

```text
Worker A → Worker B → Worker C
```

because the LLM says so.

It is:

```text
Worker A
   ↓
LangGraph transition
   ↓
Worker B
```

based on the defined graph.

---

### 3. Conditional execution

Sometimes the next Worker depends on the previous result.

Example:

```text
CustomerProfileWorker
        ↓
   Customer found?
      /      \
    Yes       No
     ↓         ↓
ContractWorker  END/ERROR
```

LangGraph uses a **conditional edge**:

```python
def route_after_customer(state):
    if state["customer_found"]:
        return "contract_worker"
    return "handle_missing_customer"
```

Then:

```python
graph.add_conditional_edges(
    "customer_profile",
    route_after_customer,
    {
        "contract_worker": "contract_worker",
        "handle_missing_customer": "handle_missing_customer"
    }
)
```

This makes the execution decision deterministic.

---

### 4. Independent Workers can execute in parallel

Execution order does **not** mean everything must be sequential.

Suppose:

```text
CustomerProfileWorker
ContractWorker
SalesHistoryWorker
```

are independent.

The Delegator can execute:

```text
             ┌─ CustomerProfileWorker ─┐
             │                         │
SalesDelegator ─ ContractWorker ───────┼→ Aggregate
             │                         │
             └─ SalesHistoryWorker ───┘
```

These can run concurrently.

But if:

```text
CustomerProfileWorker
        ↓
ContractWorker
```

then they must execute sequentially.

So CWD follows:

**Dependency → sequential execution**
**No dependency → parallel execution**

---

### 5. Example with Salesforce and ServiceNow

For your CWD Customer Briefing:

```text
Coordinator
     ↓
SalesDelegator
     ↓
CustomerProfileWorker
     ↓
     ├── ContractWorker → Salesforce
     └── SalesHistoryWorker → Salesforce
```

If both Contract and Sales History only need the validated `customer_id`, then after Customer Profile succeeds:

```text
CustomerProfileWorker
        ↓
       ┌───────────────┐
       ↓               ↓
ContractWorker    SalesHistoryWorker
       ↓               ↓
       └───────┬───────┘
               ↓
           Aggregate
```

They can run in parallel.

For IT:

```text
ITDelegator
     ↓
IncidentWorker → ServiceNow
     ↓
TicketSummaryWorker
```

If `TicketSummaryWorker` needs the incident results, it executes after `IncidentWorker`.

---

### 6. Failure also affects execution order

Suppose:

```text
CustomerProfileWorker → FAILED
          ↓
ContractWorker → BLOCKED
```

Because Contract depends on Customer Profile, CWD does **not** execute Contract with incomplete input.

But an independent Worker can still execute:

```text
CustomerProfileWorker → FAILED
        ↓
ContractWorker → BLOCKED

SalesHistoryWorker → EXECUTE
```

This is why the dependency graph is important.

---

### 7. State controls whether a Worker can execute

The Delegator/LangGraph state can track:

```python
state = {
    "completed": [
        "CustomerProfileWorker"
    ],
    "failed": [],
    "blocked": [],
    "results": {...}
}
```

Before executing a Worker, the workflow checks its prerequisites.

Conceptually:

```python
if dependencies_completed(worker, state):
    execute(worker)
else:
    mark_blocked(worker)
```

This prevents a Worker from running too early.

---

### 8. Resume also preserves execution order

Suppose:

```text
Worker A ✓
Worker B ✓
Worker C ✗
Worker D not executed
```

The LangGraph checkpoint contains the workflow state.

After recovery:

```text
Checkpoint
    ↓
Worker A → SKIP
Worker B → SKIP
Worker C → RETRY
    ↓
Worker D → EXECUTE
```

So CWD doesn't unnecessarily rerun completed Workers, and the dependency order remains intact.

---

## Where each technology fits

| Component             | Role                                                                   |
| --------------------- | ---------------------------------------------------------------------- |
| **Coordinator**       | Defines overall business workflow                                      |
| **Delegator**         | Defines domain-level Worker dependencies                               |
| **LangGraph**         | Enforces graph execution and transitions                               |
| **Conditional edges** | Decide the next valid node                                             |
| **State**             | Tracks completed/failed/blocked steps                                  |
| **Reducers**          | Merge parallel Worker results                                          |
| **Checkpointer**      | Preserves execution position for resume                                |
| **Worker**            | Executes only when its prerequisites are satisfied                     |
| **LLM**               | Proposes/understands the plan, but does not directly enforce execution |



> **“In CWD, execution order is enforced through the LangGraph workflow. The Delegator defines dependencies between Workers, and LangGraph represents those dependencies as graph edges. Dependent Workers execute sequentially, while independent Workers can execute in parallel. Conditional edges determine the next step based on workflow state, and the state tracks completed, failed, and blocked Workers. If a prerequisite fails, dependent Workers are blocked rather than executed with incomplete data. Checkpointing also allows the workflow to resume from the correct point after recovery.”**

**One line to remember:**

**Dependencies define the order, LangGraph enforces it, and independent Workers run in parallel.**
