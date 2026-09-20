In your **CWD architecture**, the Coordinator identifies the correct Delegator by mapping the **validated business intent and required capabilities** to a **Delegator Registry**.

The important distinction is:

> **The Coordinator selects the Delegator; the Delegator selects the Workers.**

### Example

User:

> **“Prepare a customer briefing for customer C123 and include recent support issues.”**

The flow is:

```text
User Request
     ↓
Coordinator
     ↓
LLM identifies intent
     ↓
CustomerBriefing
     ↓
Extracted entity: customer_id = C123
     ↓
Capability mapping
     ↓
SalesDelegator
```

---

## 1. First, the Coordinator identifies the intent

The LLM converts the natural-language request into something structured:

```json id="c5s5jc"
{
  "intent": "CustomerBriefing",
  "entities": {
    "customer_id": "C123"
  },
  "capabilities": [
    "customer_profile",
    "support_history"
  ]
}
```

The Coordinator now knows **what business capability is required**.

---

## 2. The Coordinator uses a Delegator Registry

CWD can maintain a registry such as:

```python id="m4v2cv"
DELEGATOR_REGISTRY = {
    "SalesDelegator": {
        "intents": [
            "CustomerBriefing",
            "ContractAnalysis"
        ],
        "capabilities": [
            "customer_profile",
            "customer_contract",
            "sales_information"
        ]
    },

    "ITDelegator": {
        "intents": [
            "IncidentAnalysis",
            "ITSupport"
        ],
        "capabilities": [
            "incident_history",
            "service_requests"
        ]
    },

    "ManufacturingDelegator": {
        "intents": [
            "ManufacturingFailureAnalysis"
        ],
        "capabilities": [
            "failure_analysis",
            "manufacturing_data"
        ]
    }
}
```

The Coordinator matches the validated intent/capabilities against this registry.

For:

```text
CustomerBriefing
```

the match is:

```text
CustomerBriefing
       ↓
SalesDelegator
```

---

# 3. Why not let the LLM directly choose the Delegator?

You **can ask the LLM to propose a Delegator**, but I would not let it have unrestricted authority.

For example:

```text
LLM proposes:
    SalesDelegator
```

Then deterministic logic checks:

```text
Is SalesDelegator registered?
        ↓
       YES

Does it support CustomerBriefing?
        ↓
       YES

Does it have the required capabilities?
        ↓
       YES

Is the user authorized?
        ↓
       YES
```

Only then:

```text
Coordinator → SalesDelegator
```

This is an important enterprise architecture principle:

> **The LLM proposes; deterministic policy validates.**

---

# 4. Intent-to-Delegator mapping

For stable workflows, you can even have a deterministic mapping:

```python id="iw78ie"
INTENT_ROUTING = {
    "CustomerBriefing": "SalesDelegator",
    "ContractAnalysis": "SalesDelegator",
    "IncidentAnalysis": "ITDelegator",
    "ITSupport": "ITDelegator",
    "ManufacturingFailureAnalysis": "ManufacturingDelegator"
}
```

Then:

```python id="w7p6b5"
delegator = INTENT_ROUTING[intent]
```

This makes routing predictable.

---

# 5. What if multiple Delegators are involved?

This is where your CWD architecture can become more sophisticated.

Suppose the user asks:

> **“Prepare a customer briefing for C123 and analyze the manufacturing issues affecting their products.”**

The request could require:

```text
CustomerBriefing
        ↓
SalesDelegator

ManufacturingAnalysis
        ↓
ManufacturingDelegator
```

The Coordinator can create a multi-Delegator plan:

```text
                    Coordinator
                   /           \
                  ↓             ↓
          Sales Delegator   Manufacturing Delegator
               ↓                  ↓
            Workers             Workers
```

The Coordinator remains responsible for coordinating the overall business workflow.

---

# 6. What happens if no Delegator matches?

Suppose the user asks:

> “Analyze our legal exposure for this customer.”

If CWD has no registered Legal Delegator:

```text
Intent
  ↓
Delegator Registry
  ↓
No valid match
  ↓
Do NOT execute
```

The Coordinator can return:

> “I don't currently have a supported capability for legal-risk analysis.”

This is safer than allowing the LLM to invent a Delegator.

---

# 7. How security participates

Delegator selection isn't only about capability.

Suppose:

```text
CustomerBriefing
       ↓
SalesDelegator
```

The Coordinator also needs to verify that the user is authorized to access the requested customer information.

Conceptually:

```text
Intent
  ↓
Delegator Capability Check
  ↓
Authorization Check
  ↓
Data Entitlement Check
  ↓
Delegator Selection
```

So a valid capability doesn't automatically mean the user can execute it.

---

# 8. Where LangGraph fits

You can model this in the Coordinator's LangGraph:

```text
START
  ↓
classify_intent
  ↓
extract_entities
  ↓
validate_intent
  ↓
find_delegator
  ↓
validate_authorization
  ↓
create_execution_plan
  ↓
route_to_delegator
  ↓
END
```

The state might contain:

```python id="s2bg4r"
state = {
    "intent": "CustomerBriefing",
    "entities": {
        "customer_id": "C123"
    },
    "selected_delegator": "SalesDelegator",
    "required_capabilities": [
        "customer_profile",
        "support_history"
    ]
}
```

---

## Very important distinction for your interview

Don't say:

> ❌ “The Coordinator looks at Salesforce and decides SalesDelegator.”

Instead:

> ✅ **“The Coordinator identifies the business intent and required capabilities, then maps them to the appropriate Delegator using the Delegator Registry and workflow policies.”**

Then:

```text
Coordinator
   │
   │ selects based on intent/capability
   ↓
Delegator
   │
   │ selects based on Worker capabilities
   ↓
Workers
   │
   │ communicate with tools
   ↓
Enterprise Systems
```

### Strong interview answer

> **“The Coordinator identifies the correct Delegator by first understanding the user's intent and extracting the required capabilities. It then matches those capabilities against our Delegator Registry, which defines which business domains and intents each Delegator supports. For example, a CustomerBriefing intent maps to the Sales Delegator. The LLM can propose the routing, but we validate it against the registry, workflow policies, and authorization rules before execution. Once the Delegator is selected, the Delegator—not the Coordinator—determines which Workers are needed.”**

### One line to memorize

> **“Coordinator selects the Delegator based on validated intent and capabilities; Delegator selects Workers based on required business capabilities.”**
