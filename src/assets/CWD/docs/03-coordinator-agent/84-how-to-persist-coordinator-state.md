In **CWD**, I persist the **Coordinator's runtime workflow state** using **LangGraph checkpointing backed by durable storage**.

The key distinction is:

> **LangGraph manages the state and checkpoint lifecycle; the database provides durable persistence.**

### 1. What do we persist?

For a request such as:

> “Prepare a customer briefing for C123 with CRM information and recent support issues.”

The Coordinator state could contain:

```python
{
    "request_id": "REQ-123",
    "user_request": "Prepare customer briefing for C123",
    "intent": "CustomerBriefing",
    "entities": {
        "customer_id": "C123"
    },
    "required_capabilities": [
        "customer_profile",
        "support_history"
    ],
    "selected_delegator": "SalesDelegator",

    "worker_status": {
        "CustomerProfileWorker": "SUCCESS",
        "SupportHistoryWorker": "SUCCESS",
        "ContractWorker": "FAILED"
    },

    "worker_results": {
        "CustomerProfileWorker": {...},
        "SupportHistoryWorker": {...}
    },

    "failures": [
        {
            "worker": "ContractWorker",
            "error": "TIMEOUT"
        }
    ],

    "retry_counts": {
        "ContractWorker": 2
    },

    "current_step": "ContractWorker",
    "final_status": "PARTIAL_FAILURE"
}
```

---

### 2. LangGraph checkpointing

Our Coordinator is a LangGraph workflow:

```text
START
  ↓
classify_intent
  ↓
validate_intent
  ↓
select_delegator
  ↓
create_plan
  ↓
dispatch
  ↓
execute Workers
  ↓
validate results
  ↓
aggregate
  ↓
final response
```

After important workflow transitions, LangGraph can checkpoint the state.

Conceptually:

```text
        Coordinator State
              ↓
        LangGraph Graph
              ↓
        Checkpoint
              ↓
      Durable Checkpoint Store
```

The checkpoint allows the workflow to resume after a process crash, timeout, or other interruption.

---

### 3. Where is the state stored?

For **Azure CWD**, we can use a durable persistence layer such as:

```text
LangGraph Checkpointer
        ↓
Cosmos DB / PostgreSQL / Redis
```

The exact store depends on the deployment requirements.

For example:

```text
Coordinator
     ↓
LangGraph
     ↓
Checkpoint
     ↓
Cosmos DB
```

For an **AWS implementation**, equivalent choices could include:

```text
LangGraph
    ↓
Checkpoint
    ↓
DynamoDB / PostgreSQL / Redis
```

---

### 4. Don't put everything into state

This is an important production architecture point.

We shouldn't put huge Worker responses, documents, images, or entire conversation histories directly into the LangGraph state.

Instead:

```text
Coordinator State
     |
     +-- customer_id
     +-- worker status
     +-- execution metadata
     +-- result references
              |
              ↓
       Durable Data Store
              |
              +-- large documents
              +-- large API responses
              +-- files
```

For example:

```python
{
    "worker_status": {
        "CustomerProfileWorker": "SUCCESS"
    },
    "result_ref": "s3://.../result-123"
}
```

or an Azure storage reference.

This keeps workflow state small and efficient.

---

### 5. How does resume work?

Suppose:

```text
CustomerProfileWorker → SUCCESS
SupportHistoryWorker  → SUCCESS
ContractWorker        → FAILED
```

The checkpoint contains that state.

Then the application/process crashes.

When the workflow resumes:

```text
Load checkpoint
      ↓
Read Worker statuses
      ↓
CustomerProfile = SUCCESS → SKIP
SupportHistory  = SUCCESS → SKIP
Contract        = FAILED  → RETRY
      ↓
Continue workflow
```

This is one of the major reasons we need **durable state** in CWD.

---

### 6. State vs checkpoint

This distinction is important in interviews.

**State:**

> Current runtime information about the workflow.

**Checkpoint:**

> A persisted snapshot of that state at a particular execution point.

Example:

```text
State
 ↓
intent = CustomerBriefing
worker1 = SUCCESS
worker2 = RUNNING
 ↓
Checkpoint
 ↓
Persisted to database
```

So don't say:

> “The database is the LangGraph state.”

Better:

> **“LangGraph manages the workflow state, and its checkpointing mechanism persists snapshots of that state into durable storage.”**

---

### 7. Coordinator state vs Delegator state

Because your CWD has the important **Coordinator → Delegator → Worker** hierarchy:

```text
Coordinator State
   |
   |-- overall request
   |-- intent
   |-- selected Delegators
   |-- overall workflow status
   |-- aggregated results
   |
   ↓
Delegator State
   |
   |-- selected Workers
   |-- Worker execution status
   |-- retries
   |-- Worker results
```

The Coordinator needs the **business-level workflow state**, while the Delegator maintains **domain-level execution details**.

---

### 8. Production considerations

I would also mention:

* **TTL/retention** — don't retain workflow state forever.
* **Encryption at rest** — protect persisted enterprise data.
* **Encryption in transit** — secure communication with the store.
* **Access control** — Managed Identity/IAM/RBAC.
* **PII/sensitive-data handling** — minimize what is persisted.
* **Versioning** — handle workflow/schema changes.
* **Idempotency** — prevent duplicate Worker execution after resume.
* **Correlation IDs** — connect state with logs/traces.
* **High availability** — use a durable, highly available persistence layer.



> **“In CWD, the Coordinator is implemented as a stateful LangGraph workflow. We persist its state using LangGraph checkpointing backed by a durable store such as Cosmos DB or PostgreSQL on Azure. The state contains the request, intent, entities, execution plan, Delegator and Worker statuses, results or result references, failures, retry counts, and current step. After important workflow transitions, checkpoints are persisted. If the process crashes or a Worker fails, we load the latest checkpoint and resume from the last known state rather than rerunning successful Workers. For large results, we store the data externally and keep only references in the workflow state.”**

### One line to memorize

> **“LangGraph manages Coordinator state, checkpointing persists snapshots to durable storage, and checkpoints allow CWD to resume without re-executing completed work.”**
