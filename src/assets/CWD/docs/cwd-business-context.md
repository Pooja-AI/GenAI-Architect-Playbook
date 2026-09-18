**CWD (Coordinator → Delegator → Worker)** architecture, the Coordinator should **not hard-code “if request contains X, call Delegator Y.”** Instead, it should use a combination of **intent classification, capability matching, business-domain mapping, authorization, and execution planning**.

### How do you decide which Delegator should handle a request?

### 1. First understand the request

Suppose the user asks:

> “Prepare a customer briefing for customer ID 12345 using their Salesforce account information and recent ServiceNow incidents.”

The Coordinator first converts the natural-language request into a structured intent:

```text
Intent:
    Customer Briefing

Entities:
    customer_id = 12345

Required capabilities:
    - Customer/CRM information
    - Incident/ticket information

Potential Delegators:
    - Sales Delegator
    - IT/Service Delegator
```

The LLM can perform the **semantic understanding**, but the final routing should be constrained by a controlled capability registry rather than allowing the LLM to arbitrarily select an agent.

---

# 2. Coordinator maintains a Delegator Capability Registry

Conceptually, you maintain metadata like:

```python
DELEGATOR_REGISTRY = {
    "sales_delegator": {
        "domains": ["customer", "sales", "account"],
        "capabilities": [
            "customer_profile",
            "account_details",
            "opportunity_details",
            "sales_history"
        ],
        "workers": [
            "salesforce_customer_worker",
            "salesforce_opportunity_worker"
        ]
    },

    "service_delegator": {
        "domains": ["incident", "service", "support"],
        "capabilities": [
            "incident_details",
            "service_history",
            "ticket_status"
        ],
        "workers": [
            "servicenow_incident_worker",
            "servicenow_ticket_worker"
        ]
    },

    "hr_delegator": {
        "domains": ["employee", "hr"],
        "capabilities": [
            "employee_profile",
            "leave",
            "payroll"
        ],
        "workers": [
            "employee_worker",
            "leave_worker"
        ]
    }
}
```

This registry tells the Coordinator:

> **What does each Delegator know how to do?**

---

# 3. The LLM performs intent and capability extraction

The Coordinator sends the user request to an LLM with a structured output schema.

For example:

```python
class RequestAnalysis(BaseModel):
    intent: str
    entities: dict
    required_capabilities: list[str]
    required_domains: list[str]
```

For:

> "Prepare a customer briefing for customer 12345 using Salesforce data and recent ServiceNow incidents."

The LLM could return:

```json
{
  "intent": "customer_briefing",
  "entities": {
    "customer_id": "12345"
  },
  "required_capabilities": [
    "customer_profile",
    "incident_details"
  ],
  "required_domains": [
    "customer",
    "service"
  ]
}
```

Notice something important:

**The LLM doesn't directly execute Salesforce or ServiceNow.**

It only helps the Coordinator understand the request.

---

# 4. Coordinator performs capability matching

Now the Coordinator compares the required capabilities against the Delegator registry.

```text
Required:

customer_profile
incident_details
```

Registry:

```text
Sales Delegator
    customer_profile       ✓

Service Delegator
    incident_details       ✓
```

Therefore:

```text
Coordinator
      |
      +---- Sales Delegator
      |
      +---- Service Delegator
```

This is much safer than:

```text
LLM → "I think Sales Delegator should handle it"
```

because the routing decision is constrained by known capabilities.

---

# 5. How does it select ONE Delegator?

If the request only requires Salesforce:

> "Get the account details for customer 12345."

The matching becomes:

```text
customer_profile
       ↓
Sales Delegator
       ↓
Salesforce Customer Worker
```

So:

```text
Coordinator
     ↓
Sales Delegator
     ↓
Salesforce Customer Worker
```

---

# 6. What if multiple Delegators are required?

This is where your CWD architecture becomes important.

For:

> "Prepare a customer briefing using Salesforce account information and recent ServiceNow incidents."

The Coordinator identifies:

```text
Sales Delegator
    ↓
Salesforce Worker

Service Delegator
    ↓
ServiceNow Worker
```

The workflow becomes:

```text
                         ┌── Sales Delegator
                         │       ↓
User → Coordinator ──────┤   Salesforce Worker
                         │
                         └── Service Delegator
                                 ↓
                           ServiceNow Worker
```

The Delegators execute their own domain-specific work.

Then:

```text
Salesforce result ──────┐
                        ↓
                  Coordinator
                        ↓
                Validate / Aggregate
                        ↑
ServiceNow result ──────┘
```

The Coordinator is therefore the **global orchestrator**, while Delegators are **domain-level orchestrators**.

---

# 7. How does the Coordinator know which Delegator is better when capabilities overlap?

This is an important interview question.

Suppose two Delegators have similar capabilities.

You can use a **routing score**.

For example:

```text
Routing Score =
    Capability Match
  + Domain Match
  + Intent Match
  + Entity Compatibility
  + Authorization
  + Availability
```

Conceptually:

```python
def score_delegator(request, delegator):

    score = 0

    score += capability_match(request, delegator) * 0.40
    score += domain_match(request, delegator) * 0.25
    score += intent_match(request, delegator) * 0.20
    score += entity_match(request, delegator) * 0.10
    score += authorization_check(request, delegator) * 0.05

    return score
```

Then:

```text
Sales Delegator       0.91
Service Delegator     0.42
HR Delegator          0.08
```

The Coordinator selects the qualified Delegator with the strongest match.

But **authorization should be a hard constraint**, not simply something that can be outweighed by a high score.

---

# 8. Authorization happens before execution

This is especially important for an enterprise system.

Suppose the user asks:

> "Give me employee salary information."

The LLM may correctly identify:

```text
Domain = HR
Capability = payroll
```

But that does **not** mean the Coordinator should execute it.

The Coordinator checks:

```text
User
 ↓
Identity
 ↓
Role
 ↓
Entitlements
 ↓
Delegator
 ↓
Worker
```

For example:

```python
if not authorization_service.is_allowed(
        user_id,
        capability="payroll",
        resource="employee_salary"
):
    raise AuthorizationError()
```

Therefore:

**Intent tells us what the user wants.**

**Capability tells us who can perform it.**

**Authorization tells us whether the user is allowed to do it.**

