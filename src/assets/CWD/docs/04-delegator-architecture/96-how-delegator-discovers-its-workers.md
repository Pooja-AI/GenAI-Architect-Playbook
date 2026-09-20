## How does a Delegator discover its Workers?

In CWD, the Delegator discovers Workers through a **central Worker Registry**. The Delegator does **not** simply ask the LLM which Workers exist.

The basic flow is:

```text
Coordinator
     ↓
Delegator
     ↓
Required Capabilities
     ↓
Worker Registry
     ↓
Matching Workers
     ↓
Validate Worker
     ↓
Create Worker Execution Plan
     ↓
LangGraph executes Workers
```

---

## 1. Coordinator tells the Delegator what is needed

Suppose the user asks:

> "Prepare a customer briefing for customer C123."

The Coordinator understands the request and determines that it needs:

```text
Intent: CustomerBriefing
Customer ID: C123

Required capabilities:
- Customer Profile
- Contract Information
- Support History
```

The Coordinator sends the relevant requirements to the appropriate Delegator.

For example:

```text
Coordinator
     ↓
Sales Delegator

Required capabilities:
- customer_profile
- contract_information
- sales_history
```

---

## 2. Delegator checks the Worker Registry

The Sales Delegator queries the **Worker Registry**.

Think of the Worker Registry as a **catalog of all registered Workers**.

Example:

```python
WORKER_REGISTRY = {
    "CustomerProfileWorker": {
        "domain": "Sales",
        "capabilities": ["customer_profile"],
        "status": "ACTIVE",
        "version": "1.0"
    },

    "ContractWorker": {
        "domain": "Sales",
        "capabilities": ["contract_information"],
        "status": "ACTIVE",
        "version": "1.0"
    },

    "SalesHistoryWorker": {
        "domain": "Sales",
        "capabilities": ["sales_history"],
        "status": "ACTIVE",
        "version": "1.0"
    }
}
```

The Delegator matches:

```text
Required capability
        ↓
Worker Registry
        ↓
Registered Worker
```

So:

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

---

## 3. What information does the registry contain?

The registry contains metadata that helps the Delegator decide whether a Worker can be used.

For example:

```text
Worker ID
Worker name
Domain
Capabilities
Version
Status
Input schema
Output schema
Supported operations
MCP tools
Security requirements
Timeout
Retry policy
Concurrency limits
```

Example:

```python
{
    "worker_id": "customer-profile-v1",
    "name": "CustomerProfileWorker",
    "domain": "Sales",
    "capabilities": [
        "customer_profile"
    ],
    "status": "ACTIVE",
    "version": "1.0",
    "protocol": "MCP",
    "tools": [
        "get_customer_profile"
    ],
    "timeout": 10,
    "max_retries": 3
}
```

The registry is therefore the **source of truth about what Workers exist and what they can do**.

---

## 4. The Delegator validates the discovered Worker

Finding a Worker in the registry does not automatically mean the Delegator should execute it.

It checks:

```text
Does Worker exist?
       ↓
Does it support the required capability?
       ↓
Is it ACTIVE?
       ↓
Is it healthy?
       ↓
Is this Delegator authorized to use it?
       ↓
Does the request satisfy its input schema?
       ↓
Can it be executed?
```

For example:

```text
ContractWorker
      ↓
Registered?       YES
Capability match? YES
Active?           YES
Healthy?          YES
Authorized?       YES
      ↓
Execute
```

If the Worker is registered but unhealthy:

```text
ContractWorker
      ↓
Registered = YES
Healthy = NO
      ↓
Don't execute
```

The Delegator can either use another compatible Worker or return a controlled failure, depending on policy.

---

## 5. The Delegator creates an execution plan

After discovering and validating the Workers, the Delegator determines how they should execute.

For example:

```python
execution_plan = {
    "workers": [
        {
            "name": "CustomerProfileWorker",
            "mandatory": True,
            "depends_on": []
        },
        {
            "name": "ContractWorker",
            "mandatory": True,
            "depends_on": []
        },
        {
            "name": "SalesHistoryWorker",
            "mandatory": False,
            "depends_on": []
        }
    ]
}
```

Because none of them have dependencies, they can run in parallel:

```text
             Sales Delegator
                    |
       ┌────────────┼────────────┐
       ↓            ↓            ↓
 CustomerProfile  Contract    SalesHistory
    Worker         Worker        Worker
       ↓            ↓            ↓
 Salesforce     Contract DB     CRM
```

If there is a dependency:

```text
CustomerProfileWorker
          ↓
   RiskAnalysisWorker
```

the Delegator ensures that `RiskAnalysisWorker` waits for the profile result.

---

## 6. Where does LangGraph fit?

This distinction is important:

### Worker Registry

Answers:

> **"What Workers are available?"**

### Delegator

Answers:

> **"Which Workers do I need for this domain request?"**

### LangGraph

Answers:

> **"How should these Workers execute and transition through the workflow?"**

So:

```text
                Sales Delegator
                       ↓
                Worker Registry
                       ↓
              Discover Workers
                       ↓
             Build execution plan
                       ↓
                   LangGraph
              ┌────────┼────────┐
              ↓        ↓        ↓
           Worker    Worker    Worker
```

LangGraph handles the workflow state, conditional routing, parallel execution, retries, checkpoints, and resume.

---

## 7. Where does the LLM fit?

The LLM can help identify **what capability is needed**, but it should not be the authority for Worker discovery.

For example, the LLM might interpret:

> "Give me the customer's contract details."

as:

```json
{
  "required_capability": "customer_contract"
}
```

Then the deterministic system checks the registry:

```text
customer_contract
       ↓
Worker Registry
       ↓
ContractWorker
```

This prevents the LLM from hallucinating:

```text
"ContractDataWorkerV7"   ❌
```

when that Worker doesn't actually exist.

The rule is:

> **LLM can understand the request; Registry determines what Workers actually exist.**

---

## 8. What happens if multiple Workers provide the same capability?

Suppose the registry contains:

```text
customer_profile
       ↓
 ┌───────────────┐
 ↓               ↓
ProfileWorker-v1 ProfileWorker-v2
```

The Delegator can use deterministic policies such as:

```text
Capability match
       ↓
ACTIVE?
       ↓
Healthy?
       ↓
Authorized?
       ↓
Preferred version?
       ↓
Load/availability?
       ↓
Select Worker
```

This allows Worker versioning and controlled migration.

---

## 9. Complete CWD flow

Putting everything together:

```text
User
  ↓
Coordinator
  ↓
Understand Intent
  ↓
Identify Required Capabilities
  ↓
Sales Delegator
  ↓
Query Worker Registry
  ↓
Find Matching Workers
  ↓
Validate:
  - capability
  - status
  - health
  - authorization
  - version
  ↓
Build Worker Execution Plan
  ↓
LangGraph
  ↓
Execute Workers
  ↓
Workers call MCP tools
  ↓
Enterprise Systems
  ↓
Worker Results
  ↓
Delegator validates + aggregates
  ↓
Coordinator
```

### In your CWD example

```text
Customer Briefing
       ↓
Coordinator
       ↓
Sales Delegator
       ↓
Worker Registry
       ↓
 ┌───────────────────────┐
 │ CustomerProfileWorker │ → Salesforce
 │ ContractWorker        │ → Contract System
 │ SalesHistoryWorker    │ → CRM
 └───────────────────────┘
       ↓
Delegator aggregates results
       ↓
Coordinator
```

### Short version

**Discovery:** Worker Registry
**Selection:** Delegator + deterministic policies
**Execution:** LangGraph
**Tool access:** MCP
**Business data:** Salesforce / ServiceNow / other enterprise systems

### Interview-ready explanation

> **"In CWD, a Delegator discovers Workers through a centralized Worker Registry. The registry maintains each Worker's capabilities, status, version, security requirements, and operational metadata. The Delegator maps the required capabilities to registered Workers, validates that they are active, healthy, authorized, and compatible, and then creates the Worker execution plan. LangGraph manages the actual execution, dependencies, retries, and state. The LLM may help identify the required capability, but it never invents or authorizes a Worker."**

**One line to remember:**

> **"The Worker Registry tells the Delegator what Workers exist; the Delegator selects the right Workers; LangGraph executes them."**
