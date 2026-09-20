In your **CWD architecture**, the LLM performs intent classification by taking the user's natural-language request and mapping it to one of the **known business intents** defined by your application.

The important point for an AI Architect interview is:

> **The LLM does not directly decide which system to call. It classifies the business intent and extracts the information needed for routing; deterministic application logic validates the result and performs the actual routing.**

## 1. Start with registered intents

CWD should have a controlled set of supported intents.

For example:

```python
INTENTS = [
    "CustomerBriefing",
    "IncidentAnalysis",
    "ManufacturingFailureAnalysis",
    "ContractAnalysis",
    "ITSupport"
]
```

These intents represent **business capabilities**, not individual tools.

---

## 2. Give the LLM the intent definitions

The Coordinator sends the user's request to the LLM with the available intent definitions.

For example:

```text
You are the CWD intent classifier.

Available intents:

1. CustomerBriefing
   - Customer profile
   - CRM information
   - Support history
   - Contract information

2. IncidentAnalysis
   - ServiceNow incidents
   - Incident history
   - Root cause information

3. ManufacturingFailureAnalysis
   - Manufacturing failure data
   - Failure analysis
   - Technical documents

Classify the user request into exactly one intent.

Also extract relevant entities.

Return structured JSON.
```

Then the user asks:

> "Prepare a customer briefing for customer C123 and include their recent support issues."

---

## 3. The LLM analyzes the semantics

The LLM doesn't simply match the word **"briefing."**

It considers the overall meaning:

```text
"customer briefing"
        +
"customer C123"
        +
"support issues"
```

It recognizes that the request is related to a **customer/business profile**, with supporting information from CRM and support systems.

It therefore produces:

```json
{
  "intent": "CustomerBriefing",
  "entities": {
    "customer_id": "C123"
  },
  "required_capabilities": [
    "customer_profile",
    "support_history"
  ]
}
```

---

# 4. How does the LLM actually know the intent?

There are several mechanisms.

### A. Semantic understanding

Modern LLMs understand the meaning of language rather than relying only on exact keywords.

For example:

```text
"Give me a complete overview of customer C123"
```

and

```text
"Prepare a customer briefing for C123"
```

may use completely different words but represent the same intent.

The LLM recognizes their semantic similarity.

---

### B. Intent descriptions

You provide descriptions/examples for each supported intent.

For example:

```text
CustomerBriefing:
  "Create a business overview of a customer using
   CRM, support, contract and related information."

IncidentAnalysis:
  "Analyze incidents, failures, symptoms and
   historical support tickets."
```

These descriptions give the LLM the classification context.

---

### C. Few-shot examples

You can provide examples:

```text
Example 1:
"Give me the profile of customer C123"
→ CustomerBriefing

Example 2:
"What incidents affected customer C123?"
→ IncidentAnalysis

Example 3:
"Analyze the failure from manufacturing line 4"
→ ManufacturingFailureAnalysis
```

Then a new request:

```text
"Show me everything important about customer C456"
```

The LLM can use the examples as guidance.

---

# 5. Structured output is very important

You don't want the LLM to return:

> "I think this is probably a customer briefing."

Instead, define a schema.

For example using Pydantic:

```python
from pydantic import BaseModel
from typing import List


class IntentResult(BaseModel):
    intent: str
    entities: dict
    required_capabilities: List[str]
    needs_clarification: bool
```

The LLM must produce something like:

```json
{
  "intent": "CustomerBriefing",
  "entities": {
    "customer_id": "C123"
  },
  "required_capabilities": [
    "customer_profile",
    "support_history"
  ],
  "needs_clarification": false
}
```

This makes the output much easier for the Coordinator to process reliably.

---

# 6. Then deterministic validation happens

This is **very important for your interview**.

Suppose the LLM returns:

```json
{
  "intent": "DeleteCustomer"
}
```

but `DeleteCustomer` isn't a registered CWD intent.

The Coordinator should reject it.

For example:

```python
if result.intent not in INTENTS:
    raise ValueError("Unsupported intent")
```

So the architecture becomes:

```text
User Request
     ↓
   LLM
     ↓
Intent Classification
     ↓
Structured Output
     ↓
Deterministic Validation
     ↓
Routing
```

The LLM provides **intelligence**.

The application provides **control**.

---

# 7. Intent classification vs routing

Don't mix these two in the interview.

### Intent classification

Answers:

> **What does the user want?**

Example:

```text
CustomerBriefing
```

### Routing

Answers:

> **Which Delegator should handle it?**

Example:

```text
CustomerBriefing
       ↓
SalesDelegator
```

### Worker selection

Answers:

> **Which Workers are required?**

Example:

```text
SalesDelegator
     ├── CustomerProfileWorker
     ├── SupportHistoryWorker
     └── ContractWorker
```

So:

```text
LLM
 ↓
Intent = CustomerBriefing
 ↓
Coordinator
 ↓
Sales Delegator
 ↓
Workers
```

---

# 8. What if the request matches multiple intents?

Example:

> "Analyze customer C123's support incidents and prepare a business briefing."

This contains both:

```text
CustomerBriefing
+
IncidentAnalysis
```

The Coordinator can determine whether this is:

### One composite workflow

```text
CustomerBriefing
    +
IncidentAnalysis
```

or whether clarification is needed.

The important architectural point is:

> **Don't force the LLM to make an arbitrary decision when the business semantics are ambiguous.**

You can define workflow policies for combinations of intents.

---

# 9. What if the user doesn't provide enough information?

Example:

> "Prepare a customer briefing."

The LLM can identify:

```json
{
  "intent": "CustomerBriefing",
  "entities": {},
  "needs_clarification": true
}
```

The Coordinator then asks:

> "Which customer would you like the briefing for?"

Once the user provides:

> "Customer C123."

The workflow continues.

---

# 10. How LangGraph fits into this

You can model intent classification as a Coordinator subworkflow:

```text
START
  ↓
receive_request
  ↓
classify_intent
  ↓
extract_entities
  ↓
validate_intent
  ↓
check_missing_information
       │
       ├── Missing → ask_clarification
       │
       └── Complete
              ↓
        create_execution_plan
              ↓
        select_delegator
              ↓
             END
```

The LangGraph state might contain:

```python
state = {
    "user_request": "Prepare a customer briefing for C123",
    "intent": "CustomerBriefing",
    "entities": {
        "customer_id": "C123"
    },
    "required_capabilities": [
        "customer_profile",
        "support_history"
    ],
    "needs_clarification": False
}
```

---

# 11. How do you measure whether classification works?

For an AI Architect interview, mention **evaluation**.

Create a golden dataset:

```text
User Query                         Expected Intent
---------------------------------------------------------
"Brief me on customer C123"       CustomerBriefing
"Show C123's incidents"           IncidentAnalysis
"Analyze line 4 failure"          ManufacturingFailureAnalysis
```

Then measure:

* **Intent accuracy**
* **Precision**
* **Recall**
* **F1 score**
* **Entity extraction accuracy**
* **Routing accuracy**
* **False classification rate**
* **Clarification rate**

For example:

```text
1,000 test queries
      ↓
950 correctly classified
      ↓
Intent accuracy = 95%
```

For production, you can continuously monitor misclassifications and add them back into the evaluation dataset.

---

# 12. The complete technical flow

```text
                    USER
                     │
                     ▼
          "Prepare briefing for C123"
                     │
                     ▼
              ┌─────────────┐
              │ Coordinator │
              └──────┬──────┘
                     │
                     ▼
                  LLM
          ┌─────────────────────┐
          │ Semantic analysis   │
          │ Intent definitions  │
          │ Few-shot examples   │
          │ Entity extraction   │
          └──────────┬──────────┘
                     │
                     ▼
          Structured Intent
        ┌───────────────────────┐
        │ intent:               │
        │ CustomerBriefing      │
        │                       │
        │ customer_id: C123     │
        └───────────┬───────────┘
                    │
                    ▼
          Deterministic Validation
                    │
                    ▼
             Sales Delegator
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       CRM Worker Support   Contract
          │         │         │
          ▼         ▼         ▼
      Salesforce ServiceNow  Contract
```

## Strong interview answer

> **“In CWD, the Coordinator uses an LLM as a semantic intent classifier. We provide the LLM with a controlled set of business intents, their descriptions, and representative examples. The LLM analyzes the user's natural-language request, identifies the business intent, extracts entities such as customer_id, and determines the required capabilities. We force the response into a structured schema rather than accepting free-form text. The Coordinator then validates that output against our registered intents, capabilities, security policies, and workflow rules. Only after validation do we route the request to the appropriate Delegator. If the request is ambiguous or required entities are missing, the Coordinator asks for clarification.”**

### One line to memorize

> **“The LLM performs semantic classification and entity extraction; deterministic CWD policies validate the result before the Coordinator routes it to the appropriate Delegator.”**
