### Where does validation happen?  

In your **CWD architecture, validation happens at multiple layers**, not in one single place.

The important interview point is:

> **“Validation is defense-in-depth: input validation at the API, authorization before execution, Worker output validation at the Delegator, dependency/state validation during orchestration, and final result validation at the Coordinator before LLM synthesis.”**

## 1. High-level flow

```text
User Request
     │
     ▼
┌─────────────────────┐
│  API Validation     │
│  Schema / Input     │
└──────────┬──────────┘
           ▼
      Coordinator
           │
     Intent / Plan
           │
           ▼
┌─────────────────────┐
│ Authorization       │
│ Entitlements / ACL  │
└──────────┬──────────┘
           ▼
      Delegator
           │
           ▼
       Workers
           │
           ▼
┌─────────────────────┐
│ Worker Validation   │
│ Schema / Business   │
│ Rules / Provenance  │
└──────────┬──────────┘
           ▼
     Delegator
           │
      Domain Result
           ▼
┌─────────────────────┐
│ Coordinator Final   │
│ Validation          │
└──────────┬──────────┘
           ▼
   Aggregated Context
           │
           ▼
          LLM
           │
           ▼
     Final Response
```

---

# 2. Validation #1 — API/Input validation

The first validation happens before the request enters the agent workflow.

For example:

```text
User:
"Get customer information for 12345"
```

FastAPI can validate:

```python
class CustomerRequest(BaseModel):
    customer_id: str
    request: str
```

You validate things like:

* required fields
* data types
* maximum request size
* malformed input
* allowed request format

For example:

```text
customer_id = 12345      ✓
customer_id = null       ✗
```

This is **input validation**, not LLM validation.

---

# 3. Validation #2 — Intent/plan validation

The Coordinator uses the LLM to understand:

```text
Intent
Entities
Required capabilities
Potential Delegators
```

But you don't blindly trust the LLM output.

For example, the LLM says:

```json
{
  "intent": "customer_briefing",
  "delegator": "HR_DELEGATOR"
}
```

The Coordinator checks its registry:

```text
customer briefing
        ↓
Sales capability
        ↓
Sales Delegator
```

If HR doesn't have the required capability, the plan is rejected or corrected.

So:

> **LLM proposes; deterministic system validation enforces.**

---

# 4. Validation #3 — Authorization validation

Before a Worker actually accesses enterprise data, CWD checks authorization.

For example:

```text
User
 ↓
Entra ID
 ↓
Identity
 ↓
Role / Entitlement
 ↓
Can user access Salesforce customer 12345?
 ↓
YES → Continue
NO  → Deny
```

For sensitive information:

```text
HR Worker
Payroll Worker
Employee Compensation Worker
```

the authorization check becomes especially important.

In your CWD design, this is **entitlement-first**:

```text
Authenticate
      ↓
Authorize
      ↓
Discover/Invoke capability
```

Not:

```text
Invoke Worker
      ↓
Check permission afterward
```

---

# 5. Validation #4 — Worker input validation

Before a Worker executes, its required inputs are checked.

Suppose:

```text
Contract Worker
```

requires:

```text
opportunity_id
```

But the execution state contains:

```python
{
    "customer_id": "12345"
}
```

Then:

```text
Contract Worker
       ↓
Required: opportunity_id
       ↓
Not available
       ↓
BLOCKED
```

It should **not** call the downstream system with missing information.

This is dependency validation.

---

# 6. Validation #5 — Worker output validation

This is very important.

Suppose Salesforce Worker returns:

```json
{
  "opportunity_id": "OP1001",
  "amount": 250000
}
```

But your expected schema is:

```python
class Opportunity(BaseModel):
    opportunity_id: str
    name: str
    stage: str
    amount: float
```

The Worker result is incomplete.

The Delegator can identify:

```text
✓ opportunity_id
✗ name
✗ stage
✓ amount
```

So the result could be marked:

```text
PARTIAL
```

rather than:

```text
SUCCESS
```

This prevents incomplete data from silently flowing through the system.

---

# 7. Where exactly does Worker-output validation happen?

For your architecture, I would place the **first strong output validation at the Delegator boundary**.

Think:

```text
Worker
   │
   │ raw result
   ▼
Delegator
   │
   ├── Schema validation
   ├── Business validation
   ├── Required-field validation
   ├── Source/provenance validation
   └── Status validation
   │
   ▼
Validated Domain Result
```

Why the Delegator?

Because the Delegator understands the **business domain** better than the generic Coordinator.

For example, Sales Delegator understands what a valid Salesforce opportunity result should look like.

---

# 8. Validation #6 — Business-rule validation

Schema validation alone isn't enough.

Imagine the Worker returns:

```json
{
  "opportunity_id": "OP1001",
  "amount": -500000
}
```

The JSON is structurally valid.

But:

```text
amount < 0
```

may violate your business rules.

So:

```text
Schema validation
       ↓
Business validation
```

Example:

```python
if opportunity.amount < 0:
    raise BusinessValidationError(
        "Opportunity amount cannot be negative"
    )
```

---

# 9. Validation #7 — Dependency validation

This connects directly to your previous question.

Suppose:

```text
Opportunity Worker
       ↓
opportunity_id
       ↓
Contract Worker
```

Before Contract Worker runs:

```text
Does opportunity_id exist?
Is it valid?
Does it belong to the requested customer?
```

For example:

```text
customer_id = 12345
opportunity_id = OP1001
```

You can verify the relationship.

This prevents a bad Worker result from becoming an input to another Worker.

---

# 10. Validation #8 — Aggregation validation

After the Delegators return their domain results, the Coordinator validates the combined result.

Example:

```text
Sales Delegator
    ↓
Sales Result ✓

Service Delegator
    ↓
Service Result ✓
```

Coordinator checks:

```text
Are both results for customer 12345?
Are required fields present?
Are there duplicate records?
Are there conflicting values?
Are any dependencies unresolved?
Are any Workers failed?
```

Only then:

```text
Validated Aggregated Context
```

is created.

---

# 11. Validation #9 — Completeness validation

This is especially important in enterprise AI.

Suppose the original request requires:

```text
1. Customer information
2. Opportunities
3. Incidents
4. Contracts
```

But execution produced:

```text
Customer       ✓
Opportunities  ✓
Incidents      ✓
Contracts      ✗
```

The Coordinator should calculate something like:

```text
Required capabilities = 4
Successfully retrieved = 3

Completeness = 75%
```

The exact metric can be designed according to business requirements; the important point is that **missing information is explicitly tracked**.

The system should not tell the LLM:

```text
"Here is the customer context."
```

without telling it:

```text
"Contract retrieval failed."
```

---

# 12. Validation #10 — Grounding validation before final response

Now we reach the LLM.

Suppose the validated context contains:

```text
Customer:
ABC Corporation

Opportunity:
$250K

Incident:
INC5001 — P2 — Open
```

The LLM generates:

> ABC Corporation has a $250K opportunity and one open P2 incident.

You can evaluate whether the generated response is grounded in the retrieved context.

For a production GenAI system, this is where your **LLM evaluation layer** can be applied.

Potential metrics include:

* groundedness
* factual consistency
* context relevance
* answer relevance
* citation/source correctness

Tools/frameworks such as RAGAS or your internal evaluation framework can be used here.

---

# 13. Important distinction: validation vs evaluation

Interviewers may test this.

### Validation

Usually happens **during execution**.

Question:

> **“Is this data/result valid enough to continue?”**

Example:

```text
Does this JSON match the schema?
Does required field exist?
Is the user authorized?
Can downstream Worker execute?
```

### Evaluation

Usually measures **system quality**.

Question:

> **“How well did the AI system perform?”**

Example:

```text
Was the answer grounded?
Was retrieval relevant?
Was the response correct?
How much latency/cost occurred?
```

So:

```text
Validation = runtime correctness / safety gates

Evaluation = quality measurement
```

---

# 14. Where does hallucination validation happen?

You should answer this carefully.

You don't rely on a single "hallucination detector."

Instead, you use multiple controls:

```text
Retrieval
   ↓
ACL filtering
   ↓
Worker output validation
   ↓
Structured aggregation
   ↓
Grounded LLM prompt
   ↓
Citation/provenance
   ↓
LLM evaluation
```

The strongest protection is:

> **Don't give the LLM information it shouldn't use, and don't allow it to treat missing information as a fact.**

For example:

```text
ServiceNow Worker = FAILED
```

should be represented explicitly as:

```json
{
  "service_data": null,
  "status": "unavailable",
  "reason": "ServiceNow timeout"
}
```

rather than:

```json
{
  "service_data": {}
}
```

because an empty object could be misinterpreted as "there are no incidents."

---

# 15. Your CWD validation architecture

For your interview, I would explain it as **five major validation gates**:

```text
                USER
                  │
                  ▼
        ┌──────────────────┐
        │ 1. Input         │
        │ Schema Validation │
        └────────┬─────────┘
                 ▼
            COORDINATOR
                 │
        ┌────────┴─────────┐
        │ 2. Plan +        │
        │ Authorization    │
        └────────┬─────────┘
                 ▼
             DELEGATOR
                 │
             ┌───┴───┐
             ▼       ▼
          Worker   Worker
             │       │
             └───┬───┘
                 ▼
        ┌──────────────────┐
        │ 3. Worker Output │
        │ Validation       │
        └────────┬─────────┘
                 ▼
             DELEGATOR
                 │
          Domain Result
                 ▼
        ┌──────────────────┐
        │ 4. Coordinator  │
        │ Aggregation +   │
        │ Completeness    │
        └────────┬─────────┘
                 ▼
        ┌──────────────────┐
        │ 5. Grounding /  │
        │ Response Quality │
        └────────┬─────────┘
                 ▼
                LLM
                 │
                 ▼
            FINAL RESPONSE
```

---

# 16. Who validates what?

| Layer                    | What it validates                                   |
| ------------------------ | --------------------------------------------------- |
| **FastAPI/API**          | Request schema, types, limits                       |
| **Coordinator**          | Intent/plan, capability mapping, execution state    |
| **Authorization layer**  | Identity, RBAC, entitlements, ACL                   |
| **Delegator**            | Worker selection, dependencies, domain rules        |
| **Worker**               | Downstream API/tool response                        |
| **Delegator boundary**   | Worker output schema + business validity            |
| **Coordinator**          | Cross-domain consistency, aggregation, completeness |
| **LLM evaluation layer** | Groundedness, relevance, factual consistency        |
| **Observability**        | Evidence of what happened, not validation itself    |

One subtle point:

**Observability doesn't validate the data.** It records what happened so you can detect and troubleshoot validation failures.

---

# 17. Strong interview answer

If they ask:

> **“Where does validation happen in CWD?”**

Say:

> **“Validation is distributed across the CWD pipeline. At the API layer we validate the incoming request schema. The Coordinator validates the generated execution plan against the capability registry and performs authorization and entitlement checks before execution. The Delegator validates Worker inputs, dependencies, and Worker outputs using structured schemas and business rules. Once results come back from multiple Delegators, the Coordinator performs cross-domain validation, normalization, deduplication, and completeness checks. Only the validated aggregated context is passed to the LLM for final synthesis. We also evaluate the generated response for groundedness and factual consistency. So I don't treat validation as a single step; it's defense-in-depth across input, authorization, execution, data, aggregation, and final response.”**

### One line to memorize

**“Validate before execution, validate Worker outputs at the Delegator boundary, validate the aggregated context at the Coordinator, and evaluate the final LLM response for grounding.”**
