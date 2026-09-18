
> **Coordinator decides which Delegator(s) are needed. The Delegator decides which Worker(s) are needed to fulfill the specific task within its domain.**

The key is that a Delegator should **not simply ask the LLM, “Which worker should I call?”** It should combine **task decomposition + capability matching + worker metadata + dependencies + authorization + execution state**.

---

### 2. How does a Delegator decide which Workers to invoke?

# 1. Start with a concrete CWD example

Suppose the Coordinator receives:

> **“Prepare a customer briefing for customer 12345, including their Salesforce account information, open opportunities, and recent support incidents.”**

The Coordinator determines:

```text
Required domains:
    Customer/Sales
    Service/Support

Selected Delegators:
    Sales Delegator
    Service Delegator
```

Now the **Sales Delegator** receives:

```text
Task:
Prepare the sales portion of the customer briefing.

Customer ID:
12345

Required information:
- Account information
- Open opportunities
```

The Sales Delegator now needs to decide:

> Which Workers do I need?

---

# 2. The Delegator first understands its task

The Delegator analyzes the task and converts it into smaller capabilities.

For example:

```text
Sales Delegator
        ↓
Task decomposition
        ↓
┌──────────────────────────────┐
│ Need customer account        │
│ Need opportunity information  │
└──────────────────────────────┘
```

So it identifies:

```text
Required capabilities:

1. customer_profile
2. opportunity_information
```

---

# 3. Delegator has its own Worker registry

Just like the Coordinator has a **Delegator capability registry**, each Delegator can maintain a **Worker capability registry**.

For example:

```python
SALES_WORKER_REGISTRY = {

    "salesforce_customer_worker": {
        "capabilities": [
            "customer_profile",
            "account_details",
            "customer_contacts"
        ],
        "system": "Salesforce"
    },

    "salesforce_opportunity_worker": {
        "capabilities": [
            "opportunity_details",
            "pipeline",
            "open_opportunities"
        ],
        "system": "Salesforce"
    },

    "salesforce_order_worker": {
        "capabilities": [
            "order_details",
            "order_history"
        ],
        "system": "Salesforce"
    }
}
```

The Delegator compares the required capabilities against this registry.

---

# 4. Capability matching happens

The Delegator needs:

```text
customer_profile
opportunity_information
```

Registry contains:

```text
customer_profile
       ↓
Salesforce Customer Worker

opportunity_information
       ↓
Salesforce Opportunity Worker
```

Therefore:

```text
Sales Delegator
       │
       ├── Customer Worker
       │
       └── Opportunity Worker
```

---

# 5. One Delegator can invoke multiple Workers

This is very important in your CWD architecture.

A Delegator does **not necessarily select only one Worker**.

For example:

> "Give me complete information about customer 12345."

could require:

```text
Sales Delegator
       │
       ├── Customer Worker
       ├── Opportunity Worker
       ├── Contact Worker
       └── Order Worker
```

The Delegator creates a small execution plan.

```text
Task
 ↓
Identify required capabilities
 ↓
Map capabilities → Workers
 ↓
Determine dependencies
 ↓
Execute Workers
 ↓
Validate results
 ↓
Return domain result
```

---

# 6. How does it know whether Workers can run in parallel?

This is where **dependency analysis** becomes important.

Suppose we need:

```text
Customer profile
Open opportunities
Recent orders
```

These might be independent:

```text
             Sales Delegator
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
 Customer       Opportunity    Order
 Worker          Worker        Worker
```

They can potentially run concurrently.

But imagine:

> "Find the open opportunity for customer 12345 and then retrieve the contract associated with that opportunity."

Now there is a dependency:

```text
Opportunity Worker
       ↓
Opportunity ID
       ↓
Contract Worker
```

So execution becomes:

```text
Opportunity Worker
        ↓
Get opportunity ID
        ↓
Contract Worker
```

The Delegator should **not execute Contract Worker before it has the required opportunity ID**.

---

# 7. The Delegator creates a task graph

This is where **LangGraph** can be very useful.

For example:

```text
                 Sales Delegator
                       │
                       ↓
                 Analyze Task
                       │
                       ↓
              Create Worker Plan
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
      Customer Worker      Opportunity Worker
             │                   │
             └─────────┬─────────┘
                       ↓
                  Aggregate
                       ↓
                 Return Result
```

For a dependent workflow:

```text
Opportunity Worker
        │
        ↓
Opportunity ID
        │
        ↓
Contract Worker
        │
        ↓
Contract Details
```

LangGraph maintains the state between these steps.

---

# 8. What role does the LLM play?

This is a subtle but important interview point.

The LLM can help the Delegator understand:

> "What information is required to satisfy this task?"

For example:

```text
User task:
"Give me the current sales position for customer 12345."
```

The LLM may infer:

```text
Required:
- Account information
- Open opportunities
- Pipeline
- Recent orders
```

But the LLM should **not be trusted as the security boundary**.

The actual mapping should be controlled:

```text
LLM
 ↓
Required capabilities
 ↓
Worker Registry
 ↓
Capability validation
 ↓
Worker selection
```

So you can say in an interview:

> **“I use the LLM for task understanding and decomposition, but Worker selection is constrained by a governed capability registry rather than allowing the LLM to arbitrarily invoke tools.”**

That's a strong production architecture answer.

---

# 9. Worker metadata is important

Each Worker should have metadata describing what it can do.

For example:

```python
{
    "worker_name": "salesforce_opportunity_worker",

    "description":
        "Retrieves Salesforce opportunity information",

    "capabilities": [
        "open_opportunities",
        "pipeline",
        "opportunity_details"
    ],

    "required_inputs": [
        "customer_id"
    ],

    "output_schema": {
        "opportunity_id": "string",
        "name": "string",
        "stage": "string",
        "amount": "number"
    },

    "authorization": [
        "sales_read"
    ]
}
```

This makes Worker selection deterministic and governed.

---

# 10. Authorization is checked again

Even though the Coordinator already performed authorization, the Delegator should not blindly assume everything is allowed.

For example:

```text
Sales Delegator
       ↓
Need:
customer_profile
opportunity_details
financial_data
```

The user may have access to customer information but **not financial information**.

Therefore:

```text
Customer Worker
      ↓
Allowed ✓

Opportunity Worker
      ↓
Allowed ✓

Financial Worker
      ↓
Denied ✗
```

The Delegator should prevent unauthorized Worker execution.

This gives you **defense in depth**.

---

# 11. What if no Worker matches?

Suppose the Delegator needs:

```text
customer_credit_rating
```

But its registry contains:

```text
Customer Worker
Opportunity Worker
Order Worker
Contact Worker
```

None supports that capability.

The Delegator should **not hallucinate a Worker**.

Instead:

```text
Required capability
        ↓
No matching Worker
        ↓
Return structured failure
        ↓
Coordinator
```

For example:

```json
{
  "status": "partial",
  "missing_capability": "customer_credit_rating",
  "reason": "No authorized worker available"
}
```

The Coordinator can then decide whether to:

* ask the user for clarification,
* route to another Delegator,
* continue with partial results,
* or return an appropriate limitation.

---

# 12. What if a Worker fails?

Suppose:

```text
Sales Delegator
       │
       ├── Customer Worker ✓
       ├── Opportunity Worker ✓
       └── Order Worker ✗
```

The Delegator shouldn't necessarily fail the entire request.

It can maintain:

```text
successful_results:
    customer
    opportunity

failed:
    orders

retryable:
    orders
```

Then apply a retry policy:

```text
Worker failed
     ↓
Is error retryable?
     ↓
   Yes
     ↓
Retry with backoff
     ↓
Still failing?
     ↓
Return partial result
```

This is especially useful in your CWD production architecture with **retries, DLQ, timeout handling, circuit breakers, and persisted state**.


### 3. Can one Delegator invoke multiple Workers?

Yes. A Delegator can invoke multiple Workers when a business request requires multiple tasks. They can execute in parallel when they are independent, or sequentially when one Worker depends on another.

Example:

Sales Delegator
   ├── Customer Profile Worker ──┐
   ├── Opportunity Worker ───────┼──→ Results
   └── Account History Worker ───┘


### 4. Can multiple Delegators execute concurrently?

Yes. If the user's request involves multiple independent business domains, the Coordinator can execute the Delegators concurrently to reduce overall latency.

Example:

                 Coordinator
                      ↓
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Sales      Manufacturing   IT
      Delegator     Delegator   Delegator
          ↓           ↓           ↓
       Workers      Workers      Workers
          └───────────┼───────────┘
                      ↓
             Coordinator
          Validate + Aggregate