Yes — **you can say that CWD uses rules, but rules are not replacing the LLM for understanding natural language.** They are used **around the LLM** for deterministic decisions.

### In CWD, I would use rules for:

| Decision                                | LLM or Rules?      | CWD     |
| --------------------------------------- | ------------------ | ------- |
| Understand user's natural language      | **LLM**            | ✅ LLM   |
| Extract `customer_id` from complex text | **LLM**            | ✅ LLM   |
| Check whether intent is supported       | **Rules**          | ✅ Rules |
| Check user authorization                | **Rules**          | ✅ Rules |
| Check allowed Delegator                 | **Rules/Registry** | ✅ Rules |
| Check allowed Workers/tools             | **Rules/Policy**   | ✅ Rules |
| Mandatory vs optional Worker            | **Rules/Policy**   | ✅ Rules |
| Retryable vs non-retryable error        | **Rules**          | ✅ Rules |
| Maximum retries/timeouts                | **Rules**          | ✅ Rules |
| Sensitive/destructive operation         | **Rules**          | ✅ Rules |
| Final workflow state                    | **Rules**          | ✅ Rules |

### Example from your CWD

User:

> **“Prepare a customer briefing for C123.”**

The LLM understands:

```text
Intent = CustomerBriefing
customer_id = C123
```

Then deterministic rules take over:

```text
CustomerBriefing
      ↓
Intent Registry
      ↓
Sales Delegator allowed?
      ↓
YES
      ↓
Allowed Workers?
      ↓
Customer Profile
Support History
Contract
```

The LLM **doesn't decide whether the user is authorized to access C123**.

The security/policy layer checks that.

---

### Another important example: mandatory Worker

Suppose your policy says:

```python
WORKFLOW_POLICY = {
    "CustomerBriefing": {
        "customer_profile": {"mandatory": True},
        "support_history": {"mandatory": False},
        "contract_details": {"mandatory": True}
    }
}
```

If Contract Worker fails:

```text
Contract Worker
      ↓
FAILED
      ↓
Policy says mandatory=True
      ↓
Customer Briefing = INCOMPLETE
```

That's a **deterministic business rule**, not an LLM decision.

---

## When should you prefer rules over an LLM?

Use rules when the decision is:

**1. Deterministic**

> “If retries >= 3, stop retrying.”

**2. Security-sensitive**

> “User without permission cannot access customer data.”

**3. Compliance-sensitive**

> “Delete operation requires approval.”

**4. Predictable**

> “CustomerBriefing → Sales Delegator.”

**5. Performance-sensitive**

> “Don't spend an LLM call checking whether an intent exists in the registry.”

---

## Interview answer for your CWD

You can confidently say:

> **“Yes, we use deterministic rules in CWD, but not as the primary mechanism for understanding natural language. We use the LLM for semantic intent understanding and entity extraction, while rules and policies handle deterministic decisions such as intent validation, authorization, Delegator and Worker eligibility, mandatory versus optional Workers, retry limits, timeouts, and sensitive operations. This gives us the flexibility of an LLM while keeping critical business and security decisions deterministic.”**

### One line to memorize

> **“LLM handles ambiguity and language understanding; rules handle security, policy, routing constraints, and deterministic decisions.”**
