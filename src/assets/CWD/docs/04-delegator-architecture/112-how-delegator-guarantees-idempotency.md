In **CWD**, idempotency means:

> **If the same Worker operation is executed multiple times, the business effect happens only once, and repeated executions return the same result.**

For example, if `IncidentWorker` creates a ServiceNow ticket, a retry must **not create two tickets**.

### 1. Create a unique idempotency key

For every business operation, CWD creates a deterministic key:

```text
request_id + operation + business_entity
```

Example:

```text
REQ-123 + CREATE_INCIDENT + C123
```

becomes:

```text
REQ-123:CREATE_INCIDENT:C123
```

The key should identify the **business operation**, not merely the attempt number.

---

### 2. Check the idempotency store before execution

The Worker checks a durable store such as:

```text
Redis / Cosmos DB / DynamoDB
```

Flow:

```text
IncidentWorker
      ↓
Generate idempotency key
      ↓
Check Idempotency Store
      ↓
Already completed?
    /          \
  YES           NO
   ↓             ↓
Return          Claim key
existing          ↓
result          Execute
```

---

### 3. Atomically claim the operation

This is critical.

You cannot safely do:

```text
if key doesn't exist:
    create key
    execute
```

because two requests can check simultaneously.

Instead, use an **atomic conditional write**:

```text
Request A → claim key → SUCCESS
Request B → claim key → ALREADY EXISTS
```

Only Request A is allowed to perform the operation.

Conceptually:

```python id="lq9p1v"
claimed = idempotency_store.put_if_absent(
    key="REQ-123:CREATE_INCIDENT:C123"
)

if not claimed:
    return existing_result
```

---

### 4. Execute the Worker operation

After successfully claiming the key:

```text
Idempotency Key
      ↓
Claimed
      ↓
MCP
      ↓
ServiceNow
      ↓
Create Incident
```

Suppose ServiceNow creates:

```text
INC001234
```

The Worker stores:

```python id="m31j4f"
{
    "key": "REQ-123:CREATE_INCIDENT:C123",
    "status": "COMPLETED",
    "result": {
        "ticket_id": "INC001234"
    }
}
```

---

### 5. Retry returns the existing result

Suppose the Worker times out after ServiceNow actually created the ticket.

```text
Attempt 1
   ↓
ServiceNow creates INC001234
   ↓
Response lost
   ↓
Worker thinks TIMEOUT
```

CWD retries.

The retry uses the **same idempotency key**:

```text
REQ-123:CREATE_INCIDENT:C123
```

The system sees that the operation already completed:

```text
Key exists
    ↓
COMPLETED
    ↓
Return INC001234
```

It does **not** create another ticket.

---

### 6. The key must have the correct scope

This is important.

You don't want:

```text
customer_id only
```

because two legitimate requests for the same customer could be different operations.

Instead:

```text
tenant + workflow + business operation + entity + logical request
```

For example:

```text
ONSEMI:
REQ-123:
CREATE_INCIDENT:
C123
```

The exact key design depends on the business operation.

---

### 7. Idempotency applies especially to side effects

For **read operations**:

```text
Get customer profile
Get contract
Get incident history
```

duplicate execution is usually harmless, although it can waste cost/latency.

For **write operations**:

```text
Create ticket
Create order
Update record
Send notification
Trigger deployment
```

idempotency is much more important because duplicate execution can create duplicate business effects.

---

### 8. LangGraph checkpointing is not enough

This distinction is important for interviews.

**Checkpointing** answers:

> “Where was my workflow when it stopped?”

**Idempotency** answers:

> “If I execute this operation again, will I create the same business effect twice?”

So CWD needs both:

```text
LangGraph Checkpoint
        ↓
Resume workflow
        +
Idempotency Store
        ↓
Prevent duplicate side effects
```

---

### 9. What if the Worker crashes after the external operation?

This is the hardest case.

```text
Worker
  ↓
ServiceNow creates ticket
  ↓
Worker crashes
  ↓
Result not stored
```

On retry, the system may not know whether the operation happened.

This is why **true end-to-end exactly-once execution cannot generally be guaranteed across independent distributed systems** without transactional coordination.

Instead, CWD uses:

* idempotency keys
* durable operation records
* atomic claims
* downstream systems that honor idempotency keys where supported
* reconciliation/status lookup when necessary

For example, before creating another ticket, the Worker can check whether the ticket associated with the operation key already exists.

So the practical guarantee is:

> **At-least-once execution + idempotent business operation = effectively-once business effect.**

---

### CWD flow

```text
User Request
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
Generate Idempotency Key
     ↓
Atomic Claim
     ↓
Already processed? ── YES ──→ Return Existing Result
     │
     NO
     ↓
MCP
     ↓
ServiceNow / Salesforce
     ↓
Store Result
     ↓
Return Result
```

### Technology mapping

| Component                    | Role                                          |
| ---------------------------- | --------------------------------------------- |
| **LangGraph**                | Workflow state/checkpoint                     |
| **Worker**                   | Implements idempotent operation               |
| **MCP**                      | Calls enterprise system                       |
| **Redis/Cosmos DB/DynamoDB** | Idempotency record                            |
| **Atomic conditional write** | Prevents concurrent duplicate execution       |
| **ServiceNow/Salesforce**    | Downstream business operation                 |
| **Reconciliation**           | Handles ambiguous outcome after timeout/crash |



> **“In CWD, we implement idempotency using a deterministic idempotency key for each business operation and a durable idempotency store. Before executing a side-effecting Worker, we atomically claim that key. If the key already has a completed result, we return the existing result instead of executing the operation again. If the Worker times out after the downstream system may have completed the operation, the retry uses the same key and either retrieves the existing result or performs a reconciliation check. LangGraph checkpointing handles workflow recovery, while idempotency protects against duplicate business side effects.”**

**One line to remember:**

**Same operation → same idempotency key → atomic claim → execute once → reuse the stored result on retries.**
