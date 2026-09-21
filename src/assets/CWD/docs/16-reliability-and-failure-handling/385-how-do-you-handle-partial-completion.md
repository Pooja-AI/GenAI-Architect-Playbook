## How do you handle partial completion?

**Partial completion means some Workers succeed while other Workers fail, but the overall CWD workflow may still be able to continue.**

In CWD, I **don't automatically fail the entire workflow because one Worker failed**.

### CWD example

Customer Briefing requires three Workers:

```text id="9x4k2p"
Coordinator
    ↓
Sales Delegator
    ├── Customer Worker      → ✅ Success
    └── Opportunity Worker   → ✅ Success
    ↓
IT Delegator
    └── Incident Worker     → ❌ ServiceNow unavailable
```

The Coordinator receives:

```text id="q7m3az"
Customer Worker       → SUCCESS
Opportunity Worker    → SUCCESS
Incident Worker       → FAILED
```

### Step 1: Persist successful results

I immediately checkpoint successful results:

```text id="4f6t2k"
Customer Worker      → ✅ saved
Opportunity Worker   → ✅ saved
Incident Worker      → ❌ failed
```

This prevents successful Workers from being unnecessarily rerun.

---

### Step 2: Classify the failed Worker

The Coordinator determines whether the failed capability is:

**Optional / non-critical**

```text
Incident information unavailable
        ↓
Continue with available data
```

or

**Critical**

```text
Required business information unavailable
        ↓
Pause / fail safely / HITL
```

The decision should be based on **business rules**, not on the LLM guessing whether something is important.

---

### Step 3: Return a controlled partial result

For an optional capability:

```text id="x7y3d1"
Customer Briefing
├── Customer information     ✅
├── Opportunity information  ✅
└── Incident information     ⚠️ unavailable
```

The response should explicitly indicate that Incident data was unavailable.

**Never fabricate the missing ServiceNow information.**

---

### Step 4: Recover the failed Worker

If the failure is transient:

```text id="k8f4wp"
Incident Worker
      ↓
Retry
      ↓
Backoff + Jitter
      ↓
Still failing
      ↓
DLQ
      ↓
ServiceNow fixed
      ↓
Replay Incident Worker
      ↓
Checkpoint updated
```

Then the Coordinator can aggregate the newly successful result.

---

## What technology handles this?

In CWD:

| Requirement         | Technology                             |
| ------------------- | -------------------------------------- |
| Workflow state      | LangGraph State                        |
| Checkpointing       | LangGraph Checkpointer + durable DB    |
| Async task handling | Azure Service Bus                      |
| Failed messages     | DLQ                                    |
| Retry               | LangGraph / service-level retry policy |
| Deduplication       | Cosmos DB / durable store              |
| Idempotency         | Idempotency keys                       |
| Coordination        | Coordinator                            |
| Result aggregation  | Coordinator                            |
| Human intervention  | HITL                                   |
| Observability       | App Insights + Langfuse                |

### Simple implementation concept

```python id="u8c3qv"
results = {
    "customer": None,
    "opportunity": None,
    "incident": None
}

if customer_result.success:
    results["customer"] = customer_result.data

if opportunity_result.success:
    results["opportunity"] = opportunity_result.data

if incident_result.success:
    results["incident"] = incident_result.data
else:
    results["incident"] = {
        "status": "UNAVAILABLE",
        "reason": "ServiceNow unavailable"
    }
```

Then:

```text id="c4r9we"
Coordinator
    ↓
Validate results
    ↓
Is failed Worker critical?
   ↙              ↘
 YES              NO
 ↓                 ↓
HITL / Fail       Partial Result
                  ↓
            Continue workflow
```

### Interview-ready answer

> **“I handle partial completion by checkpointing every successful Worker result and treating each Worker as an independently recoverable task. When one Worker fails, the Coordinator classifies whether that capability is critical or optional. For optional failures, I return a controlled partial result and clearly indicate what data is unavailable. For critical failures, I pause or fail safely and can involve HITL. The failed Worker can later be retried or replayed from the checkpoint without rerunning successful Workers.”**

### Strong interview line

> **“CWD uses failure isolation: one failed Worker should not automatically invalidate successful work from other Workers.”**

### Easy memory

**Success → Checkpoint → Failed Worker → Classify criticality → Partial result OR pause → Retry/Replay → Resume.**
