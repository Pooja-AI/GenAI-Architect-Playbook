In **CWD**, conflicting Worker results are handled through **validation, source authority, confidence/freshness rules, and deterministic conflict-resolution policies**. The LLM should not simply choose whichever answer sounds better.

### 1. Two Workers return different results

Suppose two Workers provide customer information:

```text
CustomerProfileWorker → Industry = "Semiconductor"
CRMWorker             → Industry = "Electronics"
```

Now the Delegator has a conflict.

```text
Worker A ──┐
           ├──> Delegator ──> Conflict Detection
Worker B ──┘
```

---

### 2. Delegator detects the conflict

Each Worker should return **structured data with metadata**, not only a text answer.

For example:

```python
{
    "worker_id": "CustomerProfileWorker",
    "status": "SUCCESS",
    "data": {
        "industry": "Semiconductor"
    },
    "source": "Salesforce",
    "timestamp": "2026-09-20T15:10:00Z"
}
```

Another Worker:

```python
{
    "worker_id": "CustomerMasterWorker",
    "status": "SUCCESS",
    "data": {
        "industry": "Electronics"
    },
    "source": "CustomerMasterDB",
    "timestamp": "2026-09-20T14:50:00Z"
}
```

The Delegator compares the same logical field:

```text
industry:
    Salesforce       → Semiconductor
    CustomerMasterDB → Electronics
```

Therefore:

```text
CONFLICT DETECTED
```

---

### 3. First check: Is it actually a conflict?

Sometimes two values represent different things.

For example:

```text
Worker A → Current contract status = Active
Worker B → Previous contract status = Expired
```

These aren't necessarily contradictory because they refer to different time periods.

So the Delegator checks:

* Same entity?
* Same field?
* Same time period?
* Same business definition?
* Same version?
* Same source scope?

Only then does it classify it as a true conflict.

---

### 4. Apply source-authority rules

CWD can maintain a **source-of-truth policy**.

For example:

```python
SOURCE_PRIORITY = {
    "customer_master": 1,
    "salesforce": 2,
    "data_warehouse": 3,
    "document": 4
}
```

If the business policy says Customer Master is authoritative:

```text
CustomerMasterDB → Electronics
Salesforce        → Semiconductor
        ↓
CustomerMasterDB has higher authority
        ↓
Use Electronics
```

This is a **deterministic business rule**, not an LLM decision.

---

### 5. Check freshness

For information that changes frequently, freshness can matter.

Example:

```text
Worker A:
Status = Active
Updated = 10 minutes ago

Worker B:
Status = Suspended
Updated = 3 days ago
```

If the policy says the newest valid record is authoritative:

```text
10 minutes ago → Active ✓
3 days ago     → Suspended
```

The newer result can be selected.

But freshness should only be used when the business rule allows it.

---

### 6. Check confidence or validation quality

For some AI-generated results, CWD can also consider:

* confidence score
* validation score
* retrieval relevance
* source quality
* schema validation
* grounding score

For example:

```text
Worker A → confidence 0.94
Worker B → confidence 0.61
```

If the workflow explicitly permits confidence-based resolution, the higher-confidence result can be preferred.

**Important:** confidence should not override an authoritative enterprise source just because its numerical score is higher.

---

### 7. What if the conflict cannot be resolved?

CWD should **not guess**.

For example:

```text
Salesforce        → $5M contract
Contract Database → $7M contract
```

Suppose neither source has priority and both are current.

Then:

```text
Conflict
   ↓
Cannot deterministically resolve
   ↓
Mark as CONFLICT
   ↓
Escalate / HITL / return both values
```

The system could return:

```python
{
    "status": "CONFLICT",
    "field": "contract_value",
    "values": [
        {
            "source": "Salesforce",
            "value": "$5M"
        },
        {
            "source": "ContractDB",
            "value": "$7M"
        }
    ],
    "resolution": "REQUIRES_REVIEW"
}
```

This is safer than allowing the LLM to invent a third value.

---

### 8. Delegator sends the resolved result to Coordinator

The Delegator should return a standardized result:

```text
Worker Results
      ↓
Conflict Detection
      ↓
Validation
      ↓
Source/Freshness Policy
      ↓
Resolved Result
      ↓
Coordinator
```

For example:

```python
{
    "customer_id": "C123",
    "status": "SUCCESS",
    "data": {
        "industry": "Electronics"
    },
    "conflicts": [
        {
            "field": "industry",
            "sources": [
                "CustomerMasterDB",
                "Salesforce"
            ],
            "resolution": "CustomerMasterDB"
        }
    ]
}
```

---

### 9. Coordinator can also detect cross-domain conflicts

This is important in CWD.

Suppose:

```text
SalesDelegator
    → Customer status = Active

ITDelegator
    → Customer status = Suspended
```

The **Coordinator** detects a conflict between Delegator results.

```text
Sales Delegator ──┐
                  ├──> Coordinator → Conflict Resolution
IT Delegator ─────┘
```

The Coordinator applies the same principles:

```text
1. Validate
2. Identify authoritative source
3. Check freshness/version
4. Apply business policy
5. Escalate if unresolved
```

---

### 10. Where each technology fits

| Component                    | Role                                               |
| ---------------------------- | -------------------------------------------------- |
| **Worker**                   | Returns structured result + source/metadata        |
| **Delegator**                | Detects and resolves Worker-level conflicts        |
| **Worker Registry / Policy** | Defines source authority and business rules        |
| **LangGraph**                | Controls validation/conflict-resolution workflow   |
| **Coordinator**              | Handles conflicts across Delegators                |
| **LLM**                      | Helps interpret/summarize validated information    |
| **HITL**                     | Handles unresolved high-impact conflicts           |
| **Observability**            | Records conflict, sources, resolution and decision |



> **“In CWD, we don't let the LLM arbitrarily choose between conflicting Worker results. Workers return structured results with source and metadata. The Delegator first determines whether there is a true conflict, then applies deterministic policies such as source authority, freshness, version, and validation rules. If the conflict can be resolved, the selected result is passed to the Coordinator. If it cannot be resolved safely, we mark it as a conflict and either return the conflicting values with a warning or escalate for human review. The Coordinator applies the same approach when conflicts occur across Delegators.”**

**One line to remember:**

**Detect → Validate → Apply source/freshness policy → Resolve or escalate; never guess.**
