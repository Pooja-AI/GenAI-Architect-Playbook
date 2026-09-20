In **CWD**, the Coordinator understands user intent by converting the user's natural-language request into a **structured intent + entities + required capabilities**. The LLM helps interpret the language, but the final routing is controlled by application policies and the Agent/Worker Registry.

### Example

User says:

> **“Prepare a customer briefing for customer C123, including their CRM information and recent support issues.”**

The Coordinator does **not** immediately call Salesforce or ServiceNow.

It first interprets the request:

```text
User Request
     ↓
Coordinator
     ↓
Intent Understanding
     ↓
Structured Intent
```

The LLM produces something like:

```python
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

## 1. Receive the user request

The request enters through the API layer:

```text
User
  ↓
FastAPI / API Gateway
  ↓
Authentication
  ↓
Coordinator
```

The request also carries security context such as:

```text
user_id
roles
permissions
tenant
request_id
```

The Coordinator uses this context later for authorization.

---

## 2. Coordinator sends the request to the LLM

The Coordinator uses an LLM such as Azure OpenAI to interpret the natural language.

The prompt can define the expected structure:

```text
You are the CWD intent classification component.

Identify:
1. Business intent
2. Entities
3. Required capabilities
4. Missing information
5. Whether clarification is required

Return structured JSON only.
```

User:

```text
Prepare a customer briefing for C123
including CRM information and recent support issues.
```

LLM:

```json
{
  "intent": "CustomerBriefing",
  "entities": {
    "customer_id": "C123"
  },
  "capabilities": [
    "customer_profile",
    "support_history"
  ],
  "needs_clarification": false
}
```

---

# 3. Intent is more than just classification

This is an important interview point.

The Coordinator doesn't only ask:

> “What is the user asking?”

It needs to understand:

### Intent

```text
CustomerBriefing
```

### Entities

```text
customer_id = C123
```

### Required capabilities

```text
Customer Profile
Support History
```

### Constraints

For example:

```text
customer_id = required
user authorization = required
data freshness = recent
```

### Expected outcome

```text
Generate a customer briefing
```

So conceptually:

```text
Natural Language
       ↓
Intent
       +
Entities
       +
Capabilities
       +
Constraints
       ↓
Execution Plan
```

---

# 4. Validate the LLM's interpretation

This is where enterprise architecture becomes important.

We don't blindly trust the LLM output.

For example, suppose the LLM says:

```json
{
  "intent": "DeleteCustomer",
  "customer_id": "C123"
}
```

The Coordinator should not simply execute it.

It validates the requested capability against:

* Intent Registry
* Agent/Delegator Registry
* Worker Registry
* Security policies
* User permissions
* Workflow policies

The LLM provides **interpretation**, while deterministic code provides **control**.

---

# 5. Map intent to a Delegator

Once the intent is identified:

```text
CustomerBriefing
       ↓
Sales Delegator
```

For example:

```python
INTENT_ROUTING = {
    "CustomerBriefing": "SalesDelegator",
    "IncidentAnalysis": "ITDelegator",
    "ManufacturingFailure": "ManufacturingDelegator"
}
```

The Coordinator doesn't directly choose individual enterprise APIs.

It determines:

> **Which business domain/Delegator should handle this request?**

Then the Delegator determines which Workers are required.

---

# 6. Delegator determines Workers

For our example:

```text
Coordinator
      ↓
Sales Delegator
      ↓
 ┌───────────────┬────────────────┬─────────────────┐
 ↓               ↓                ↓
Customer       Support          Contract
Worker         Worker           Worker
 ↓               ↓                ↓
Salesforce     ServiceNow       Contract System
```

This separation is important.

### Coordinator

Understands:

> “The user wants a Customer Briefing.”

### Delegator

Understands:

> “For Customer Briefing, I need Customer Profile and Support History.”

### Worker

Understands:

> “I need to retrieve customer C123 from Salesforce.”

---

# 7. What if the request is ambiguous?

Suppose the user says:

> “Give me information about C123.”

The Coordinator may identify:

```text
customer_id = C123
```

but the intent is ambiguous.

It could mean:

```text
Customer Profile?
Support History?
Contract?
Sales information?
Full Customer Briefing?
```

Instead of guessing, the Coordinator can ask:

> “Would you like the customer profile, support history, contract information, or a complete customer briefing?”

This prevents incorrect execution.

---

# 8. How LangGraph fits in

LangGraph is responsible for **orchestrating the Coordinator's intent-understanding workflow**.

For example:

```text
START
  ↓
receive_request
  ↓
extract_intent
  ↓
extract_entities
  ↓
validate_intent
  ↓
check_authorization
  ↓
create_execution_plan
  ↓
route_to_delegator
  ↓
END
```

The nodes can update the shared state:

```python
state = {
    "user_request": "...",
    "intent": "CustomerBriefing",
    "entities": {
        "customer_id": "C123"
    },
    "required_capabilities": [
        "customer_profile",
        "support_history"
    ],
    "selected_delegator": "SalesDelegator"
}
```

---

# 9. What happens when the LLM gets it wrong?

This is an important AI Architect interview question.

Suppose the user says:

> “What happened with C123's recent issues?”

The LLM might classify it as:

```text
CustomerBriefing
```

when the user actually wants:

```text
IncidentAnalysis
```

You can reduce this risk using:

### Structured output

Force the LLM to return a predefined schema.

### Few-shot examples

Provide examples of valid intents.

### Intent registry

Only allow registered intents.

### Confidence/ambiguity checks

If confidence is low or required entities are missing:

```text
Ask clarification
```

### Deterministic validation

Check whether the proposed intent and capabilities are allowed.

### Evaluation dataset

Maintain representative user queries:

```text
Query → Expected Intent
```

and continuously measure:

```text
Intent Accuracy
Entity Extraction Accuracy
Routing Accuracy
Clarification Rate
```

---

# The complete CWD flow

```text
                  User
                    │
                    ▼
              Natural Language
                    │
                    ▼
             ┌──────────────┐
             │  Coordinator │
             └──────┬───────┘
                    │
             LLM Intent Analysis
                    │
                    ▼
        ┌─────────────────────────┐
        │ Intent + Entities +     │
        │ Capabilities + Context  │
        └────────────┬────────────┘
                     │
                     ▼
              Policy Validation
                     │
                     ▼
             Select Delegator
                     │
                     ▼
              Sales Delegator
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Customer    Support    Contract
       Worker      Worker      Worker
          │          │          │
          ▼          ▼          ▼
      Salesforce  ServiceNow  Contract DB
```

### Strong interview answer

> **“In CWD, the Coordinator understands user intent by using an LLM to convert the natural-language request into structured information such as business intent, entities, required capabilities, and constraints. For example, ‘Prepare a customer briefing for C123’ becomes the CustomerBriefing intent with customer_id C123 and capabilities such as customer profile and support history. The Coordinator then validates that interpretation against our intent, agent, and worker registries and security policies before selecting the appropriate Delegator. The Delegator is responsible for selecting the Workers. LangGraph orchestrates this process and maintains the execution state. If the request is ambiguous or required information is missing, the Coordinator asks for clarification rather than guessing.”**

### One line to memorize

> **“LLM interprets the request; policy validates it; Coordinator selects the Delegator; Delegator selects the Workers; LangGraph orchestrates the workflow.”**
