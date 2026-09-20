## If the Delegator uses an LLM, what does the LLM decide?

The **Delegator LLM mainly decides what capabilities are needed for the domain request**. It should **not have unrestricted authority to execute Workers**.

### Step-by-step

Suppose the Coordinator sends:

> "Prepare the sales portion of the customer briefing for C123, including customer details, contract information, and recent sales activity."

### Step 1 — Delegator receives the request

```text
Sales Delegator
      ↓
Customer Briefing
customer_id = C123
```

### Step 2 — LLM understands the domain requirement

The LLM identifies:

```text
Required capabilities:
    1. customer_profile
    2. contract_information
    3. sales_history
```

It could produce structured output:

```python
{
    "capabilities": [
        "customer_profile",
        "contract_information",
        "sales_history"
    ]
}
```

### Step 3 — Registry maps capabilities to real Workers

The Delegator checks the Worker Registry:

```text
customer_profile
       ↓
CustomerProfileWorker

contract_information
       ↓
ContractWorker

sales_history
       ↓
SalesHistoryWorker
```

The LLM **doesn't invent these Worker names**.

### Step 4 — Deterministic policy validates them

The system checks:

```text
Worker exists?          ✓
Capability matches?     ✓
Worker active?          ✓
User authorized?        ✓
Worker allowed here?    ✓
Input valid?            ✓
```

Only after this validation can execution happen.

### Step 5 — Delegator creates the execution plan

For example:

```text
CustomerProfileWorker ──┐
ContractWorker ─────────┼──→ Aggregate
SalesHistoryWorker ─────┘
```

Since they're independent, they can run in parallel.

---

## What else can the Delegator LLM decide?

Depending on the architecture, it can help with:

### 1. Capability identification

```text
"Get customer details"
        ↓
customer_profile
```

### 2. Input interpretation

```text
"customer ABC"
        ↓
customer_id = C123
```

### 3. Dependency suggestion

For example:

```text
CustomerProfile
       ↓
RiskAnalysis
```

The LLM may **propose** that dependency, but the workflow configuration should validate it.

### 4. Result interpretation

If Workers return structured results, the LLM can help understand or summarize them.

For example:

```text
Profile Worker → customer information
Contract Worker → contract information
```

The LLM can help produce a domain-level summary.

---

## What should NOT be decided solely by the LLM?

This is very important for your interview.

The LLM should not independently decide:

```text
❌ Which Worker actually exists
❌ Whether the user is authorized
❌ Whether a sensitive tool can be called
❌ Maximum retries
❌ Security policies
❌ Mandatory vs optional policy
❌ Whether a destructive operation is allowed
❌ Final workflow termination
```

Those are controlled by **deterministic policies, registry, and workflow logic**.

### The overall pattern

```text
LLM
 ↓
Understand / Propose
 ↓
Worker Registry
 ↓
Validate
 ↓
Policy
 ↓
Authorize
 ↓
Delegator
 ↓
LangGraph
 ↓
Workers
```

### In one sentence

> **The Delegator LLM decides what capabilities are needed and may propose how to execute them, but the Registry and deterministic policies decide what is actually allowed, and LangGraph executes the approved workflow.**

**Memorize:**

> **"LLM proposes the capability; Registry identifies the Worker; policy validates it; Delegator orchestrates it."**
