No. **In a production CWD architecture, intent classification should not be completely LLM-based.**

A better design is **hybrid intent classification**:

```text
User Request
     ↓
Pre-processing / deterministic checks
     ↓
LLM semantic classification
     ↓
Structured output
     ↓
Deterministic validation + policy
     ↓
Intent finalized
     ↓
Delegator routing
```

### What the LLM does

The LLM is responsible for understanding **natural language and semantic meaning**.

For example:

> “Can you give me a complete overview of customer C123, including recent problems?”

The LLM identifies:

```json
{
  "intent": "CustomerBriefing",
  "customer_id": "C123",
  "capabilities": [
    "customer_profile",
    "support_history"
  ]
}
```

This is where the LLM adds value because users can phrase the same intent in many ways:

```text
"Prepare a customer briefing for C123"
"Give me an overview of C123"
"Tell me everything important about C123"
"Summarize our relationship with C123"
```

A pure rule-based system would struggle with these variations.

---

### What should NOT be left to the LLM?

The LLM should **not have final authority** over:

* Which intents are actually supported
* Which Delegator is allowed to execute
* Whether the user is authorized
* Which Workers can be invoked
* Whether a sensitive operation is permitted
* Mandatory vs optional workflow requirements
* Security policies

Those should be controlled by deterministic application logic.

For example:

```python
ALLOWED_INTENTS = {
    "CustomerBriefing",
    "IncidentAnalysis",
    "ManufacturingFailureAnalysis"
}

if result.intent not in ALLOWED_INTENTS:
    reject_request()
```

Then:

```text
CustomerBriefing
       ↓
Policy / Registry
       ↓
SalesDelegator
```

---

## You can also use rules before the LLM

For very obvious requests, deterministic classification can be useful.

For example:

```text
"Reset my password"
        ↓
Known IT workflow
        ↓
ITSupport
```

Or:

```text
"Delete customer C123"
        ↓
Sensitive operation detected
        ↓
Security/policy validation
```

The LLM doesn't get to bypass those controls.

---

## What if the LLM is uncertain?

Don't force a classification.

For example:

> “Tell me about C123.”

Possible intents:

```text
CustomerBriefing
IncidentAnalysis
ContractAnalysis
```

The system can return:

```json
{
  "intent": null,
  "needs_clarification": true,
  "reason": "Multiple intents are possible"
}
```

Then Coordinator asks:

> “Would you like a customer overview, incident history, or contract information?”

---

## Best architecture

Think of the responsibilities this way:

| Component                 | Responsibility                                                 |
| ------------------------- | -------------------------------------------------------------- |
| **Rules / preprocessing** | Detect obvious patterns, sensitive operations, required fields |
| **LLM**                   | Understand natural language and semantic intent                |
| **Schema validation**     | Ensure output has the correct structure                        |
| **Intent Registry**       | Ensure intent is supported                                     |
| **Policy Engine**         | Enforce business/security rules                                |
| **Coordinator**           | Finalize plan and select Delegator                             |
| **Delegator**             | Select and coordinate Workers                                  |

### Interview answer

> **“No, intent classification is not completely LLM-based. We use a hybrid approach. The LLM performs semantic understanding and extracts the intent and entities from natural language. However, deterministic validation checks whether the intent is supported, whether the requested capabilities are allowed, and whether the user has the required permissions. The Coordinator then routes the validated intent to the appropriate Delegator. This gives us the flexibility of an LLM with the predictability and security of deterministic controls.”**

### One line to memorize

> **“LLM for understanding, deterministic logic for validation and control.”**
