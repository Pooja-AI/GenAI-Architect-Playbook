## Coordinator vs Delegator in CWD

The easiest way to remember it is:

> **Coordinator = decides the overall business workflow.**
> **Delegator = manages execution within a specific business domain.**

### Example

Suppose the user asks:

> **"Prepare a complete customer briefing for customer C123, including sales information and recent support issues."**

The flow is:

```text
                    User Request
                         ↓
                   Coordinator
                  /            \
                 ↓              ↓
          Sales Delegator    IT Delegator
              ↓                  ↓
        ┌─────┴─────┐       ┌────┴─────┐
        ↓           ↓       ↓          ↓
 CustomerProfile  Contract  Incident  Ticket
    Worker         Worker    Worker    Worker
        ↓           ↓         ↓          ↓
    Salesforce   Contract   ServiceNow ServiceNow
```

### Key difference

| Area                 | Coordinator                                | Delegator                                   |
| -------------------- | ------------------------------------------ | ------------------------------------------- |
| **Scope**            | Enterprise/business workflow               | Specific business domain                    |
| **Main question**    | **What needs to happen?**                  | **How should this domain execute it?**      |
| **Understands**      | Overall user intent and business objective | Domain-specific capabilities                |
| **Selects**          | Delegator(s)                               | Workers                                     |
| **Creates**          | Enterprise execution plan                  | Domain-level Worker execution plan          |
| **Handles**          | Cross-domain orchestration                 | Within-domain orchestration                 |
| **Dependencies**     | Delegator-level dependencies               | Worker-level dependencies                   |
| **Parallelism**      | Can coordinate multiple Delegators         | Can execute multiple Workers                |
| **Failure handling** | Cross-domain workflow status               | Worker retries/timeouts/failures            |
| **Aggregation**      | Aggregates Delegator results               | Aggregates Worker results                   |
| **Final response**   | Validates and synthesizes overall result   | Returns structured domain result            |
| **Example**          | "I need Sales + IT information"            | "I need CustomerProfile + Contract Workers" |

---

## 1. Coordinator responsibility

The Coordinator operates at the **enterprise level**.

Its flow is roughly:

```text
Request
   ↓
Understand Intent
   ↓
Extract Entities
   ↓
Validate
   ↓
Authorize
   ↓
Select Delegator(s)
   ↓
Create Execution Plan
   ↓
Dispatch
   ↓
Receive Delegator Results
   ↓
Validate + Aggregate
   ↓
Generate Final Response
```

For example:

```text
Intent = CustomerBriefing
Customer = C123
Required capabilities:
    - Customer Profile
    - Contract
    - Support History
```

The Coordinator determines:

```text
Customer Profile + Contract → SalesDelegator
Support History             → ITDelegator
```

It **doesn't need to know how Salesforce or ServiceNow is called**.

---

## 2. Delegator responsibility

The Delegator operates at the **domain level**.

For example, Sales Delegator receives:

```text
CustomerBriefing
customer_id = C123
required capabilities:
    Customer Profile
    Contract
```

It decides:

```text
CustomerProfileWorker → Salesforce
ContractWorker        → Contract System
```

It then manages:

```text
Worker execution
      ↓
Dependencies
      ↓
Parallel execution
      ↓
Retries/timeouts
      ↓
Worker validation
      ↓
Domain aggregation
      ↓
Return result
```

The IT Delegator independently manages its own Workers:

```text
IncidentWorker → ServiceNow
TicketWorker   → ServiceNow
```

---

## 3. The most important architectural boundary

Think of it this way:

```text
Coordinator
    │
    │  Business-level decision
    │  "Which domains do I need?"
    ↓
Delegator
    │
    │  Domain-level decision
    │  "Which capabilities/workers do I need?"
    ↓
Worker
    │
    │  Concrete capability
    ↓
Enterprise System
```

So:

**Coordinator → Delegator**

means:

> **Which business domains need to participate?**

**Delegator → Worker**

means:

> **Which concrete capabilities are required within this domain?**

---

## 4. Why this separation matters

Without Delegators:

```text
Coordinator
 ├── Worker 1
 ├── Worker 2
 ├── Worker 3
 ├── Worker 4
 ├── Worker 5
 ├── Worker 6
 ├── ...
 └── Worker 50
```

The Coordinator becomes a huge orchestration component.

With Delegators:

```text
Coordinator
 ├── Sales Delegator
 │      ├── Worker
 │      ├── Worker
 │      └── Worker
 │
 ├── IT Delegator
 │      ├── Worker
 │      └── Worker
 │
 └── Manufacturing Delegator
        ├── Worker
        └── Worker
```

This gives us **domain isolation, scalability, maintainability, and cleaner failure handling**.

---

## Interview-ready answer

> **"The main difference is the level of orchestration. The Coordinator is responsible for enterprise-level orchestration—it understands the user intent, identifies required capabilities, selects one or more Delegators, coordinates their execution, and aggregates their results. The Delegator is responsible for domain-level orchestration—it selects and executes the appropriate Workers, manages dependencies, parallelism, retries, timeouts, and Worker-level failures, and aggregates the results within that domain. In short, the Coordinator coordinates Delegators, while Delegators coordinate Workers."**

### One-line answer to memorize

> **"Coordinator manages the overall business workflow; Delegator manages execution within a business domain; Worker performs the actual capability."**
