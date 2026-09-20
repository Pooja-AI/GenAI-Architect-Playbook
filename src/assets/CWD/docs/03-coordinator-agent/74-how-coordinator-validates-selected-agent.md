In your **CWD architecture**, the Coordinator should **never trust the LLM's selected Delegator directly**. It validates the selection against deterministic sources before execution.

### Validation flow

```text
User Request
     ↓
Coordinator
     ↓
LLM → Intent + capabilities
     ↓
Proposed Delegator
     ↓
┌──────────────────────────────┐
│ Coordinator Validation       │
│                              │
│ 1. Exists in Agent Registry? │
│ 2. Supports the intent?      │
│ 3. Has required capabilities?│
│ 4. User authorized?          │
│ 5. Active/healthy?           │
│ 6. Policy allows routing?    │
│ 7. Version compatible?       │
└──────────────┬───────────────┘
               ↓
          Validated?
          /       \
        YES        NO
         ↓          ↓
     Execute     Reject /
                 Re-route /
                 Clarify
```

### 1. Check that the Delegator exists

Suppose the LLM proposes:

```json
{
  "intent": "CustomerBriefing",
  "delegator": "SalesDelegator"
}
```

Coordinator checks:

```python
agent = AGENT_REGISTRY.get("SalesDelegator")

if not agent:
    raise ValueError("Unknown Delegator")
```

If the LLM invents `CustomerRelationshipDelegator` and it isn't registered, **CWD does not execute it**.

---

### 2. Validate supported intent

```python
if "CustomerBriefing" not in agent["supported_intents"]:
    raise ValueError("Delegator does not support this intent")
```

For example, if `ITDelegator` doesn't support `CustomerBriefing`, the Coordinator won't route the request there.

---

### 3. Validate capabilities

Suppose the request requires:

```text
customer_profile
support_history
```

The Coordinator compares those requirements with the Delegator's registered capabilities.

```python
required = {"customer_profile", "support_history"}
available = set(agent["capabilities"])

if not required.issubset(available):
    raise ValueError("Required capabilities unavailable")
```

This prevents a Delegator from being selected simply because the intent name looks correct.

---

### 4. Authorization check

The Coordinator also verifies that the **requesting user is allowed to access that domain/capability**.

For your Azure architecture:

```text
User
 ↓
Microsoft Entra ID
 ↓
Token / Claims
 ↓
Authorization Policy
 ↓
Is user allowed to invoke SalesDelegator?
 ↓
YES → continue
NO  → reject
```

This is particularly important for enterprise data.

**Authentication:** Who is the user?
**Authorization:** What is the user allowed to access?

---

### 5. Check Delegator health

The registry can tell us that `SalesDelegator` exists, but the Coordinator also needs to know whether it is currently available.

```text
SalesDelegator
      ↓
Health / Readiness Check
      ↓
HEALTHY → execute
UNHEALTHY → failover / retry / controlled failure
```

This is the difference between:

> **Registered ≠ necessarily available**

---

### 6. Validate workflow policy

The Coordinator can also check policies such as:

```python
WORKFLOW_POLICY = {
    "CustomerBriefing": {
        "allowed_delegators": ["SalesDelegator"],
        "required_capabilities": [
            "customer_profile"
        ]
    }
}
```

So even if the LLM proposes another registered Delegator, the policy can prevent unauthorized routing.

---

### 7. Validate structured output

I would also force the LLM to return a predefined schema rather than free-form text:

```python
class RoutingDecision(BaseModel):
    intent: str
    delegator: str
    capabilities: list[str]
```

This prevents outputs such as:

```text
"Maybe SalesDelegator or perhaps CustomerAgent..."
```

from directly entering the execution pipeline.

---

## Complete CWD example

User:

> "Prepare a customer briefing for C123 including CRM and support information."

LLM produces:

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
  "delegator": "SalesDelegator"
}
```

Coordinator validates:

```text
1. SalesDelegator registered?       ✓
2. Supports CustomerBriefing?      ✓
3. Has required capabilities?      ✓
4. User authorized?                ✓
5. Delegator healthy?              ✓
6. Workflow policy allows it?      ✓
7. Output schema valid?            ✓
                         ↓
                  EXECUTE
                         ↓
                 SalesDelegator
                         ↓
              ┌──────────┴──────────┐
              ↓                     ↓
      CustomerProfile          SupportHistory
          Worker                  Worker
              ↓                     ↓
         Salesforce             ServiceNow
```

### Where does LangGraph fit?

LangGraph **orchestrates these validation and execution steps**.

For example:

```text
START
  ↓
classify_intent
  ↓
extract_entities
  ↓
select_delegator
  ↓
validate_delegator
  ↓
authorize
  ↓
check_health
  ↓
execute_delegator
  ↓
END
```

The important distinction is:

> **LangGraph controls the workflow; the Registry and deterministic policies provide the source of truth for validation.**

### 🎯 Interview-ready answer

> **“After the LLM proposes a Delegator, the Coordinator validates it before execution. First, it checks that the Delegator exists in the Agent Registry and supports the requested intent and capabilities. Then we validate authorization, workflow policies, health status, and version compatibility. We also use structured output validation so the LLM cannot pass arbitrary agent names into execution. Only after all deterministic checks pass does LangGraph route the request to the Delegator. If validation fails, we reject, re-route using the registry/policy, or ask for clarification.”**

**One line to memorize:**

> **“LLM proposes the Delegator; Registry, authorization, health, and deterministic policies validate it; only then does LangGraph execute it.”**
