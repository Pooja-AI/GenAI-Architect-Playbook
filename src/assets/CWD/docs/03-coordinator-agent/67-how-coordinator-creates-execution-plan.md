In **CWD**, the Coordinator creates the execution plan **after understanding the user's intent and extracting the required entities**.

The simplest way to explain it is:

> **Intent tells us WHAT the user wants; the execution plan determines HOW CWD will accomplish it.**

For your CWD architecture:

```text
User Request
     ↓
Coordinator
     ↓
Intent + Entities
     ↓
Execution Plan
     ↓
Delegator
     ↓
Workers
     ↓
Enterprise Systems
```

## 1. Example

User asks:

> **“Prepare a customer briefing for customer C123, including CRM information, recent support issues, and contract details.”**

The Coordinator first determines:

```text
Intent = CustomerBriefing

Entity:
customer_id = C123
```

Then it creates a plan such as:

```text
Step 1 → Select Sales Delegator

Step 2 → Get customer profile
         → Customer Profile Worker
         → Salesforce

Step 3 → Get support history
         → Support History Worker
         → ServiceNow

Step 4 → Get contract details
         → Contract Worker
         → Contract System

Step 5 → Validate Worker results

Step 6 → Aggregate results

Step 7 → Generate customer briefing
```

---

# 2. Where does the plan come from?

The plan is created using **three things**:

```text
                Execution Plan
                     ▲
          ┌──────────┼──────────┐
          │          │          │
       User       Registry    Policies
       Intent     /Metadata    /Rules
```

### A. User intent

The Coordinator needs to know what the user wants.

```text
CustomerBriefing
```

### B. Agent/Worker Registry

The Coordinator needs to know what capabilities are available.

For example:

```python id="n7y1iq"
WORKER_REGISTRY = {
    "customer_profile": {
        "delegator": "SalesDelegator",
        "system": "Salesforce"
    },
    "support_history": {
        "delegator": "SalesDelegator",
        "system": "ServiceNow"
    },
    "contract_details": {
        "delegator": "SalesDelegator",
        "system": "ContractSystem"
    }
}
```

### C. Workflow policies

The Coordinator needs to know constraints.

For example:

```python id="m15g48"
CUSTOMER_BRIEFING_POLICY = {
    "customer_profile": {
        "mandatory": True
    },
    "support_history": {
        "mandatory": False
    },
    "contract_details": {
        "mandatory": True
    }
}
```

So the LLM doesn't invent Workers.

It works within the **capabilities and policies defined by the application**.

---

# 3. Does the LLM create the entire plan?

**The LLM can propose the plan, but it should not have unrestricted authority to execute it.**

This distinction is important in an AI Architect interview.

Think of it as:

```text
LLM
 ↓
"Here is the plan I think is needed"
 ↓
Policy / Registry Validation
 ↓
"These steps are actually allowed"
 ↓
LangGraph
 ↓
Execute plan
```

For example, the LLM might propose:

```json id="j0d0b4"
{
  "intent": "CustomerBriefing",
  "delegator": "SalesDelegator",
  "workers": [
    "customer_profile",
    "support_history",
    "contract_details"
  ]
}
```

The Coordinator validates:

```text
Is CustomerBriefing supported?       YES
Is SalesDelegator allowed?           YES
Are these Workers registered?        YES
Can this user access the data?       YES
Are required entities available?    YES
```

Then LangGraph executes it.

---

# 4. The Coordinator determines dependencies

This is where execution planning becomes more than just a list.

Suppose:

```text
Customer Profile Worker
        ↓
Customer ID
        ↓
Contract Worker
```

Then they have a dependency.

But if all Workers already have `customer_id=C123`:

```text
Customer Profile ──┐
Support History ───┼──→ Aggregation
Contract Details ──┘
```

they can run **in parallel**.

So the execution plan can represent:

```text
             Sales Delegator
                    │
          ┌─────────┼─────────┐
          ↓         ↓         ↓
       Worker 1   Worker 2   Worker 3
       Salesforce ServiceNow Contract
          │         │         │
          └─────────┼─────────┘
                    ↓
               Aggregation
```

This reduces latency.

---

# 5. Execution plan as a graph

This fits naturally with **LangGraph**.

For example:

```text
START
  ↓
Validate Request
  ↓
Create Plan
  ↓
Sales Delegator
  ↓
 ┌────────────┬──────────────┬──────────────┐
 ↓            ↓              ↓
Customer     Support       Contract
Worker       Worker         Worker
 ↓            ↓              ↓
Salesforce   ServiceNow   Contract System
 └────────────┬──────────────┘
              ↓
       Validate Results
              ↓
         Aggregate
              ↓
       Generate Briefing
              ↓
             END
```

LangGraph manages the **state transitions and execution flow**.

---

# 6. What would the plan look like technically?

You could represent it as structured data:

```python id="av3tgc"
execution_plan = {
    "intent": "CustomerBriefing",
    "delegator": "SalesDelegator",

    "steps": [
        {
            "worker": "customer_profile",
            "mandatory": True,
            "depends_on": []
        },
        {
            "worker": "support_history",
            "mandatory": False,
            "depends_on": []
        },
        {
            "worker": "contract_details",
            "mandatory": True,
            "depends_on": []
        }
    ],

    "execution_mode": "parallel",

    "aggregation": "Coordinator",

    "failure_policy": {
        "retry": 3,
        "allow_partial_result": True
    }
}
```

This is much better than having the LLM produce a vague sentence such as:

> “I'll retrieve customer information and then summarize it.”

---

# 7. How does the Coordinator decide parallel vs sequential?

The Coordinator/plan builder looks at **dependencies and workflow policy**.

### Independent

```text
Customer Profile
Support History
Contract
```

All use:

```text
customer_id = C123
```

Therefore:

```text
PARALLEL
```

### Dependent

Suppose:

```text
Worker A → identifies incident IDs
Worker B → analyzes those incident IDs
```

Then:

```text
Worker A
   ↓
Worker B
```

because B needs A's output.

So:

> **Dependency determines execution order.**

---

# 8. What happens if a Worker fails?

The execution plan also contains failure policy.

Example:

```text
Worker 1 → SUCCESS
Worker 2 → SUCCESS
Worker 3 → FAILED
```

Delegator checks:

```text
Is Worker 3 mandatory?
```

If:

```text
mandatory = True
```

the workflow may become:

```text
INCOMPLETE
```

If:

```text
mandatory = False
```

the workflow can continue with:

```text
PARTIAL_SUCCESS
```

The Coordinator then knows exactly what data is available.

---

# 9. How LangGraph implements this

A simplified Coordinator workflow could be:

```python id="0w4r83"
def classify_intent(state):
    ...

def extract_entities(state):
    ...

def validate_request(state):
    ...

def create_plan(state):
    ...

def route_to_delegator(state):
    ...
```

Then:

```python id="v4j4qz"
graph.add_node("classify_intent", classify_intent)
graph.add_node("extract_entities", extract_entities)
graph.add_node("validate_request", validate_request)
graph.add_node("create_plan", create_plan)
graph.add_node("route_to_delegator", route_to_delegator)

graph.add_edge("classify_intent", "extract_entities")
graph.add_edge("extract_entities", "validate_request")
graph.add_edge("validate_request", "create_plan")
graph.add_edge("create_plan", "route_to_delegator")
```

After the Coordinator produces the plan, the **Delegator takes responsibility for Worker-level orchestration**.

That distinction is important:

```text
Coordinator
   ↓
Business-level execution plan
   ↓
Delegator
   ↓
Worker-level execution plan
   ↓
Workers
```

---

# 10. Strong interview answer

> **“In CWD, the Coordinator creates the execution plan after understanding the user's intent and extracting entities. It maps the requested capabilities to registered Delegators and Workers, then determines dependencies, execution order, parallelism, mandatory versus optional tasks, and failure policies. The LLM can propose the plan based on the intent and available capabilities, but the plan is validated against deterministic policies, security rules, and our Agent/Worker Registry before execution. LangGraph then orchestrates the validated plan and maintains the workflow state. For example, for a Customer Briefing for C123, the Coordinator can route to the Sales Delegator, which executes the Salesforce, ServiceNow, and Contract Workers in parallel when they are independent, followed by validation and aggregation.”**

### One line to memorize

> **“The Coordinator converts intent into a validated execution plan by mapping capabilities to Delegators/Workers, resolving dependencies and parallelism, applying policies, and then handing execution to LangGraph.”**
