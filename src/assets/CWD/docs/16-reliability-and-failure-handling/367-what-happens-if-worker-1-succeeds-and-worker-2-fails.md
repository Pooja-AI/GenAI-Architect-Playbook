## What happens if Worker 1 succeeds and Worker 2 fails?

In **CWD**, I handle this as a **partial Worker failure**. I don't automatically fail the entire workflow.

### Example

Suppose the **Sales Delegator** has two Workers:

```text
Coordinator
     ↓ A2A
Sales Delegator
     ├── Worker 1: Customer Worker
     │       ↓ MCP → Salesforce
     │       ✅ SUCCESS
     │
     └── Worker 2: Opportunity Worker
             ↓ MCP → Salesforce
             ❌ FAILED
```

### Step 1: Persist Worker 1 result

Worker 1 returns:

```json
{
  "worker": "CustomerWorker",
  "status": "completed",
  "customer_id": "C12345",
  "result": "Customer details retrieved"
}
```

That result is persisted in the workflow state/checkpoint.

### Step 2: Detect Worker 2 failure

For Worker 2:

```text
MCP → Salesforce
       ↓
Timeout / 5xx
       ↓
Worker 2 = FAILED
```

I capture:

```text
worker_id
task_id
error_type
retry_count
timestamp
correlation_id
```

### Step 3: Retry if the failure is transient

For example:

```text
Worker 2
   ↓
Timeout
   ↓
Retry 1
   ↓
Retry 2
   ↓
Success
```

If it's a permanent error, such as authorization failure or invalid input, I don't blindly retry.

### Step 4: If Worker 2 still fails

The Delegator sends both results back to the Coordinator:

```text
Worker 1 → SUCCESS
Worker 2 → FAILED
```

For example:

```json
{
  "customer_info": {
    "status": "success",
    "data": "..."
  },
  "opportunity_info": {
    "status": "failed",
    "error": "Salesforce timeout"
  }
}
```

### Step 5: Coordinator validates and decides

The **Coordinator** determines whether Worker 2 is critical.

```text
Worker 2 critical?
       ↓
   ┌───┴───┐
  YES      NO
   ↓        ↓
Fail/HITL  Partial result
```

If opportunity information is optional:

```text
Customer information  ✅
Opportunity information ⚠️ unavailable
```

The Coordinator can return a **partial result** and clearly state that opportunity information could not be retrieved.

If Worker 2 is mandatory, the Coordinator can mark the business task as failed or send it to **HITL**.

### Important: Never fabricate the missing result

If Worker 2 failed, the Coordinator should **not ask the LLM to guess the missing opportunity information**.

It should return:

```text
Customer information → available
Opportunity information → unavailable
Reason → Salesforce timeout
```

---

## What happens if Worker 2 failed after actually completing the transaction?

This is an important production scenario.

Suppose:

```text
Worker 2
   ↓
MCP → Salesforce
   ↓
Transaction succeeds
   ↓
Network timeout occurs before response
   ↓
Worker thinks it failed
```

If we blindly retry, we could create a duplicate transaction.

Therefore I use:

```text
Idempotency key
+
Transaction ID
+
Persistent task state
```

The retry first checks whether the operation already completed.

---

## CWD recovery flow

```text
Worker 1 ───────────────→ SUCCESS
                             ↓
                         Checkpoint
                             ↑
Worker 2 ──→ MCP ──→ FAILURE
                    ↓
               Retry transient?
                 /        \
               YES         NO
                ↓           ↓
             Retry      FAILED
                ↓           ↓
           SUCCESS?      Coordinator
                            ↓
                     Validate results
                            ↓
                  ┌─────────┴─────────┐
                  ↓                   ↓
              Continue            Fail/HITL
           with partial result    if critical
```

### Interview-ready answer

> **“If Worker 1 succeeds and Worker 2 fails, I persist Worker 1's result and isolate Worker 2's failure. For transient failures such as timeout or temporary downstream errors, I retry with exponential backoff. If Worker 2 still fails, it returns a structured failure to the Delegator and then the Coordinator. The Coordinator validates whether Worker 2 is mandatory. If it's optional, I return a partial result with the missing information clearly identified. If it's critical, I fail or route the workflow to HITL. I also use checkpoints and idempotency keys so successful work isn't unnecessarily repeated and retries don't create duplicate transactions.”**

### Strong interview line

> **“One Worker failing doesn't automatically mean the whole workflow failed. The Coordinator makes the decision based on dependency and business criticality.”**

**Easy memory:**
**Worker 1 ✅ → checkpoint → Worker 2 ❌ → retry → validate criticality → partial result OR fail/HITL.**
