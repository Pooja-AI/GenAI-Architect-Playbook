### 16.	How does CWD handle dependencies between Workers?

# 1. What does “dependency between Workers” mean?

A dependency exists when **Worker B needs the output of Worker A** before it can execute.

For example:

> “Find customer 12345's open opportunities and then retrieve the contracts associated with those opportunities.”

You cannot execute the Contract Worker immediately because you don't know the opportunity IDs yet.

So:

```text
Customer ID
    ↓
Opportunity Worker
    ↓
Opportunity IDs
    ↓
Contract Worker
    ↓
Contract Details
```

Here:

**Contract Worker depends on Opportunity Worker.**

---

# 2. There are two types of Worker relationships

## Type 1 — Independent Workers

Suppose the Sales Delegator needs:

* Customer profile
* Open opportunities
* Recent orders

All three can use the same `customer_id`.

```text
                 customer_id
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
 Customer Worker  Opportunity   Order Worker
                    Worker
```

There is no dependency between them.

Therefore CWD can execute them concurrently:

```text
T0 ───────────────────────────────>

Customer Worker       ███████
Opportunity Worker    █████████
Order Worker          ██████

                              ↓
                           Aggregate
```

This reduces latency.

---

# 3. Type 2 — Dependent Workers

Now consider:

> “Find the customer's open opportunities and retrieve the contract for each opportunity.”

The Contract Worker requires:

```text
opportunity_id
```

But the opportunity ID comes from the Opportunity Worker.

Therefore:

```text
Opportunity Worker
       │
       │ produces
       ↓
opportunity_id
       │
       │ required by
       ↓
Contract Worker
```

The Delegator must wait.

```text
Opportunity Worker
       █████████
             │
             ↓
       opportunity_id
             │
             ↓
Contract Worker
             ███████
```

---

# 4. How does CWD know that a dependency exists?

This is where **Worker metadata** becomes very important.

Each Worker should describe:

* capabilities
* required inputs
* outputs
* dependencies
* authorization
* timeout
* retry policy

For example:

```python
WORKER_REGISTRY = {

    "opportunity_worker": {
        "capabilities": [
            "open_opportunities"
        ],
        "required_inputs": [
            "customer_id"
        ],
        "outputs": [
            "opportunity_id",
            "opportunity_name",
            "stage"
        ]
    },

    "contract_worker": {
        "capabilities": [
            "contract_details"
        ],
        "required_inputs": [
            "opportunity_id"
        ],
        "outputs": [
            "contract_id",
            "contract_status",
            "contract_value"
        ]
    }
}
```

Now the Delegator can reason:

```text
Contract Worker requires:
    opportunity_id

Who produces:
    opportunity_id?

Opportunity Worker
```

Therefore:

```text
Opportunity Worker → Contract Worker
```

---

# 5. The Delegator builds a dependency graph

The Delegator can represent the execution plan as a directed graph.

For example:

```text
              Customer ID
                  │
                  ↓
          Opportunity Worker
                  │
          ┌───────┴────────┐
          ↓                ↓
     Contract Worker    Contact Worker
```

The arrows mean:

> **The upstream Worker must provide information required by the downstream Worker.**

This is essentially a **DAG — Directed Acyclic Graph**.

---

# 6. Example with your Salesforce + ServiceNow use case

Let's use your CWD scenario.

User asks:

> **“For customer 12345, get the Salesforce account, find their open opportunities, and retrieve related ServiceNow incidents.”**

The Coordinator might route the request to:

```text
Coordinator
     │
     ├───────────────┐
     ↓               ↓
Sales Delegator   Service Delegator
```

### Sales Delegator

Needs:

```text
Customer account
Open opportunities
```

Both can use:

```text
customer_id = 12345
```

So:

```text
          customer_id
          /         \
         ↓           ↓
 Account Worker   Opportunity Worker
```

These are independent.

---

### Service Delegator

Suppose ServiceNow requires a Salesforce account/customer mapping first.

Then:

```text
Salesforce Account Worker
          ↓
ServiceNow Customer Mapping Worker
          ↓
ServiceNow Incident Worker
```

Now there is a **cross-system dependency**.

---

# 7. Dependencies can exist inside one Delegator

Example:

```text
Sales Delegator
       │
       ├── Customer Worker
       │
       ├── Opportunity Worker
       │
       └── Contract Worker
```

If Contract Worker needs `opportunity_id`:

```text
Customer Worker
      │
      │
Opportunity Worker
      │
      ↓
opportunity_id
      │
      ↓
Contract Worker
```

The Delegator manages this dependency.

---

# 8. Dependencies can also exist across Delegators

This is more advanced and important for your architecture.

Suppose:

```text
Sales Delegator
      ↓
Salesforce Account Worker
      ↓
Salesforce Account ID
```

The Service Delegator needs that account ID:

```text
Salesforce Account ID
      ↓
Service Delegator
      ↓
ServiceNow Incident Worker
```

Now the dependency crosses the Delegator boundary.

The **Coordinator** should manage that cross-domain dependency.

Conceptually:

```text
                    Coordinator
                         │
             ┌───────────┴───────────┐
             ↓                       ↓
      Sales Delegator          Service Delegator
             │                       │
             ↓                       │
      Salesforce Worker              │
             │                       │
             └──── account_id ───────┘
                                     ↓
                              ServiceNow Worker
```

This is why your architecture needs a **Coordinator above the Delegators**.

---

# 9. How LangGraph handles this

This is one of the strongest reasons to use LangGraph in your CWD design.

LangGraph lets you represent the workflow as nodes and edges while maintaining shared state.

For example:

```python
from typing import TypedDict

class CWDState(TypedDict):
    customer_id: str
    opportunities: list
    contracts: list
    errors: list
```

Then you can have nodes such as:

```text
START
  ↓
Get Opportunities
  ↓
Get Contracts
  ↓
Aggregate
  ↓
END
```

The important part is:

```text
Get Opportunities
       ↓
Get Contracts
```

The second node cannot execute until the first node has populated the required state.

---

# 10. State carries the dependency outputs

Suppose:

```text
customer_id = 12345
```

Initially:

```python
state = {
    "customer_id": "12345",
    "opportunities": [],
    "contracts": [],
    "errors": []
}
```

After Opportunity Worker:

```python
state = {
    "customer_id": "12345",

    "opportunities": [
        {"id": "OP1001"},
        {"id": "OP1002"}
    ],

    "contracts": [],

    "errors": []
}
```

Now the Contract Worker has what it needs:

```text
OP1001
OP1002
```

It can execute.

After that:

```python
state = {
    "customer_id": "12345",

    "opportunities": [
        {"id": "OP1001"},
        {"id": "OP1002"}
    ],

    "contracts": [
        {"opportunity_id": "OP1001", "status": "Active"},
        {"opportunity_id": "OP1002", "status": "Expired"}
    ],

    "errors": []
}
```

This is **stateful dependency management**.

---

# 11. Parallel execution is extremely important

Consider:

```text
Customer Worker
Opportunity Worker
Order Worker
```

They all require:

```text
customer_id
```

They don't depend on one another.

Instead of:

```text
Customer Worker
     ↓
Opportunity Worker
     ↓
Order Worker
```

which could take:

```text
2 sec + 3 sec + 2 sec = 7 sec
```

CWD can execute them concurrently:

```text
Customer Worker       2 sec
Opportunity Worker    3 sec
Order Worker          2 sec
```

Total ≈ **3 seconds**, assuming the systems and infrastructure support concurrent execution.

So dependency management is not just about correctness.

It is also a **latency optimization mechanism**.

---

# 12. Example of a more complex dependency graph

Suppose your customer briefing requires:

```text
A = Customer Profile
B = Opportunities
C = Orders
D = Contracts
E = Support Incidents
F = Final Customer Summary
```

Dependencies:

```text
A ──────┐
        │
        ├──→ B ───→ D ───┐
        │                 │
        └──→ C ───────────┤
                          ↓
E ─────────────────────→ F
                          ↑
A ────────────────────────┘
```

This means:

```text
A
├── B
│   └── D
└── C

E

A + B + C + D + E
        ↓
        F
```

The execution could be:

### Phase 1

```text
A
E
```

run concurrently.

### Phase 2

Once A completes:

```text
B
C
```

can run concurrently.

### Phase 3

Once B completes:

```text
D
```

runs.

### Phase 4

Once everything is available:

```text
F
```

generates the final summary.

---

# 13. What happens if one Worker fails?

This is a very important production interview question.

Suppose:

```text
Customer Worker       ✓
Opportunity Worker    ✓
Order Worker          ✗
Contract Worker       ✓
```

The Delegator shouldn't automatically throw away everything.

It records:

```python
state = {
    "customer": "...",
    "opportunities": "...",
    "orders": None,
    "contracts": "...",
    "errors": [
        {
            "worker": "order_worker",
            "error": "Salesforce timeout"
        }
    ]
}
```

Then it determines:

> Is the failed Worker required for downstream Workers?

---

# 14. Dependency-aware failure handling

Suppose:

```text
Opportunity Worker
       ↓
Contract Worker
```

If Opportunity Worker fails:

```text
Opportunity Worker ✗
       ↓
Contract Worker ?
```

Contract Worker cannot run because it doesn't have:

```text
opportunity_id
```

Therefore:

```text
Contract Worker = BLOCKED
```

This is different from:

```text
Contract Worker = FAILED
```

That's an important distinction.

### Failed

The Worker executed but encountered an error.

### Blocked

The Worker couldn't execute because a required dependency wasn't available.

---

# 15. Example

```text
Opportunity Worker
       ✗
       │
       ↓
No opportunity_id
       │
       ↓
Contract Worker
       │
       ↓
BLOCKED
```

The Delegator can return:

```json
{
  "completed": [
    "customer_worker"
  ],
  "failed": [
    "opportunity_worker"
  ],
  "blocked": [
    "contract_worker"
  ]
}
```

That gives the Coordinator a much better picture of what happened.

---

# 16. Retry logic

Suppose the Opportunity Worker fails because of a temporary Salesforce timeout.

The Delegator checks:

```text
Is error retryable?
```

For example:

```text
Timeout           → Retry
HTTP 429          → Retry with backoff
Temporary 5xx     → Retry
Invalid input     → Don't retry
Unauthorized      → Don't retry
```

So:

```text
Opportunity Worker
       ↓
Timeout
       ↓
Retry #1
       ↓
Retry #2
       ↓
Success
       ↓
Contract Worker
```

Because the Opportunity Worker eventually succeeded, the downstream dependency can now proceed.

---

# 17. What if the dependency never succeeds?

Then:

```text
Opportunity Worker
       ↓
Retry
       ↓
Retry
       ↓
Failure
       ↓
Contract Worker = BLOCKED
```

The Delegator returns partial execution status to the Coordinator.

The Coordinator might produce:

> Customer profile was retrieved successfully, but opportunity-related contract information could not be retrieved because the upstream opportunity lookup failed.

This is much better than generating a hallucinated contract result.

---

# 18. How do you prevent circular dependencies?

Production systems should validate the Worker DAG before executing it.

Bad design:

```text
Worker A
   ↓
Worker B
   ↓
Worker C
   ↓
Worker A
```

That's a cycle.

The workflow can never finish.

Therefore, the execution planner should perform **cycle detection / DAG validation** before execution.

Valid:

```text
A → B → C
```

Invalid:

```text
A → B → C → A
```

This is another reason to model dependencies explicitly instead of allowing arbitrary agent-to-agent calls.

---

# 19. Dependency types you should know for interviews

There are several useful categories.

### Data dependency

Worker B needs data produced by Worker A.

```text
A → customer_id → B
```

### Execution dependency

Worker B should only start after A completes.

```text
A completed → B starts
```

### Resource dependency

Two Workers require the same constrained resource.

Example:

```text
Same API rate limit
Same database connection pool
Same external system
```

### Authorization dependency

A downstream operation requires an authorization decision or entitlement established earlier.

```text
Authorization check
       ↓
Sensitive Worker
```

### Cross-domain dependency

One Delegator produces information required by another Delegator.

```text
Sales Delegator
      ↓
Service Delegator
```

---

# 20. Where MCP fits

MCP is **not the dependency manager**.

That's another important distinction.

For example:

```text
Opportunity Worker
       ↓
MCP Salesforce tool
       ↓
Salesforce
```

MCP provides standardized access to tools/resources.

The dependency orchestration is handled by:

```text
Coordinator / Delegator
        +
LangGraph state/workflow
        +
Execution planner
```

So:

```text
LangGraph
    → controls workflow

Worker
    → performs business operation

MCP
    → provides standardized tool access

Salesforce / ServiceNow
    → actual enterprise systems
```

---

# 21. Your complete CWD dependency architecture

```text
                         USER
                           │
                           ↓
                      COORDINATOR
                           │
                  Create Execution Plan
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
      SALES DELEGATOR             SERVICE DELEGATOR
             │                           │
        Worker DAG                  Worker DAG
             │                           │
     ┌───────┼────────┐           ┌──────┴──────┐
     ↓       ↓        ↓           ↓             ↓
 Customer  Opp.     Order      Customer      Incident
 Worker    Worker   Worker      Mapping       Worker
     │       │                    Worker
     │       ↓                       │
     │   Contract                    ↓
     │    Worker                ServiceNow
     │
     └───────────────┐
                     ↓
               Domain Results
                     │
                     ↓
                 COORDINATOR
                     │
              Validate Results
                     │
              Aggregate Results
                     │
                     ↓
                Final Response
```

---

# 22. The key production principle

The most important principle is:

> **Don't let Workers arbitrarily call each other. Make dependencies explicit in the execution plan.**

Instead of:

```text
Worker A → "Hey Worker B, do something"
```

prefer:

```text
Execution Planner
      ↓
Dependency Graph
      ↓
Worker A
      ↓
State update
      ↓
Worker B
```

This gives you:

* predictable execution
* traceability
* retryability
* resumability
* parallel execution
* failure isolation
* dependency-aware recovery
* better observability
* easier testing

---

# 23. Interview answer

If the interviewer asks:

> **“How does CWD handle dependencies between Workers?”**

A strong answer is:

> **“In CWD, Worker dependencies are modeled explicitly in the execution plan. When a Delegator decomposes a task, it identifies the required capabilities and the inputs and outputs of each Worker. If Worker B requires an output produced by Worker A, the planner creates a dependency edge from A to B. Independent Workers are executed concurrently, while dependent Workers execute only after their required inputs are available. We use LangGraph to maintain the execution state and control these transitions. If an upstream Worker fails, downstream Workers that depend on its output are marked blocked rather than executed with incomplete data. Retryable failures are retried with backoff, and the workflow state is persisted so execution can resume. At the end, the Delegator validates and aggregates the Worker results and sends the domain result back to the Coordinator.”**

### Remember this one line:

**“CWD converts Worker dependencies into a DAG: independent Workers run in parallel, dependent Workers wait for upstream outputs, and LangGraph state controls execution, recovery, and resumption.”**
