# Delegator – Domain-Specific Policy, Authorization & Governance

## 1. What is the Delegator Governance Responsibility?

In CWD, the **Delegator is the domain-level governance and orchestration boundary** between the enterprise-level Coordinator and specialized Workers.

The Coordinator determines:

> **What business objective needs to be fulfilled and which domain should handle it.**

The Delegator determines:

> **What is allowed within that domain, which Workers can perform the task, what data they can access, which tools they can use, and under what conditions they can execute.**

Therefore, the Delegator is not only a routing component.

It acts as a **domain policy enforcement point**.

```text
                    USER
                      │
                      ▼
                ┌─────────────┐
                │ Coordinator │
                └──────┬──────┘
                       │
                 A2A Request
                       │
                       ▼
              ┌─────────────────┐
              │    Delegator    │
              │                 │
              │ Domain Policy   │
              │ Authorization   │
              │ Capability      │
              │ Data Access     │
              │ Tool Policy     │
              │ Validation      │
              │ Governance      │
              └────────┬────────┘
                       │
             Approved Worker Tasks
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Worker A  Worker B  Worker C
             │         │         │
             ▼         ▼         ▼
           Tools     APIs      RAG
             │         │         │
             └─────────┼─────────┘
                       ▼
               Enterprise Systems
```

---

# 2. Why Governance Is Required at the Delegator

A Coordinator-level authorization check alone is not sufficient.

Consider:

```text
User
  ↓
Coordinator
  ↓
Sales Delegator
  ↓
Revenue Worker
  ↓
Snowflake
```

The Coordinator may determine:

```text
User is authorized for Sales
```

But that does **not automatically mean**:

```text
User can access every Sales dataset
User can access every Snowflake table
User can execute every Sales capability
User can use every tool
User can access every customer record
User can perform every action
```

The Delegator therefore applies **domain-specific authorization and policy controls**.

This creates defense in depth.

---

# 3. Delegator Governance Model

The Delegator evaluates every incoming domain task against multiple governance dimensions.

```text
                 Domain Task
                      │
                      ▼
             ┌─────────────────┐
             │ Domain Validation│
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │ Authorization   │
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │ Policy Evaluation│
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │ Capability Check│
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │ Data Access     │
             │ Restrictions    │
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │ Tool Restrictions│
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │ Input Validation│
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │ Worker Selection│
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │ Execution       │
             └─────────────────┘
```

The important principle is:

> **A Worker should execute only after the Delegator has determined that the requested operation is allowed.**

---

# 4. Domain Ownership Enforcement

The first governance check is:

> **Does this Delegator actually own this task?**

For example:

```text
Sales Delegator
    ├── Customer Information
    ├── Opportunity Management
    ├── Revenue Analysis
    └── Sales Reporting
```

A request such as:

```text
"Get the customer's current revenue and open opportunities."
```

is appropriate for the Sales domain.

But:

```text
"Show me employee salary information."
```

should not be routed to the Sales Delegator.

The Delegator validates:

```text
requested_domain == delegator.domain
```

If not:

```text
REJECT
```

or route back to the Coordinator for appropriate domain routing.

---

# 5. Domain-Specific Authorization

The Delegator evaluates whether the requesting identity is authorized for the requested domain capability.

The authorization context may include:

```text
user_id
tenant_id
roles
groups
claims
domain
capability
resource
data_classification
action
channel
session_id
correlation_id
```

For example:

```text
User
  ↓
Sales Delegator
  ↓
Role = Sales Manager
  ↓
Capability = Customer Revenue Analysis
  ↓
Policy Evaluation
  ↓
ALLOW
```

Another user may have:

```text
Role = Sales Representative
Capability = Customer Revenue Analysis
Scope = Assigned Customers
```

The Delegator must not assume that both users have the same access.

---

# 6. Data-Access Restrictions

One of the most important Delegator responsibilities is controlling **what data can be accessed**.

The Delegator should not simply tell a Worker:

```text
"Get customer data."
```

Instead, the task should contain an authorized data scope.

Example:

```json
{
  "domain": "sales",
  "capability": "customer_revenue",
  "data_scope": {
    "customer_ids": ["CUST-123"],
    "classification": "internal",
    "allowed_sources": [
      "snowflake_sales"
    ]
  }
}
```

The Worker then operates within that scope.

---

# 7. Data Classification

Enterprise data may have different classifications.

For example:

```text
Public
Internal
Confidential
Restricted
Highly Restricted
```

The Delegator can enforce rules such as:

```text
Sales Representative
        │
        ├── Public        → ALLOW
        ├── Internal      → ALLOW
        ├── Confidential  → CONDITIONAL
        └── Restricted    → DENY
```

This prevents a Worker from retrieving data simply because technically it has access to the underlying system.

---

# 8. Allowed Capabilities

Every Worker should have a defined capability set.

Example:

```text
Revenue Worker
    capabilities:
      - revenue_lookup
      - revenue_summary
      - revenue_trend
```

Another Worker:

```text
Opportunity Worker
    capabilities:
      - opportunity_lookup
      - opportunity_summary
      - pipeline_analysis
```

The Delegator compares:

```text
Task Requirement
       ↓
Required Capability
       ↓
Worker Capability
```

Example:

```text
Required:
    revenue_lookup

Worker:
    revenue_lookup
    revenue_summary
    revenue_trend

Result:
    ALLOWED
```

If the requested capability is not supported:

```text
Required:
    employee_salary_update

Sales Worker:
    revenue_lookup

Result:
    DENIED
```

---

# 9. Tool Restrictions

Workers may have access to multiple tools.

For example:

```text
Revenue Worker
    ├── Snowflake Query Tool
    ├── Revenue API
    └── Reporting Tool
```

But the Delegator should not automatically allow all tools.

It can define:

```text
Capability:
    revenue_lookup

Allowed tools:
    - Snowflake Revenue Query
    - Revenue API

Denied:
    - Customer Update API
    - Employee HR API
    - Finance Payment API
```

This follows the principle:

> **Capability access does not automatically imply unrestricted tool access.**

---

# 10. Tool-Level Authorization

The Delegator can validate:

```text
Can Worker use this tool?
```

before execution.

For example:

```text
Task
 │
 ▼
Revenue Lookup
 │
 ▼
Required Tool = Snowflake
 │
 ▼
Delegator Policy
 │
 ├── Worker authorized?       YES
 ├── Tool authorized?         YES
 ├── Dataset authorized?      YES
 ├── Data classification?     ALLOWED
 └── Operation allowed?       YES
 │
 ▼
Execute
```

If any critical check fails:

```text
DO NOT EXECUTE
```

---

# 11. Input Validation

Before passing a task to a Worker, the Delegator validates its input.

Example:

```json
{
  "customer_id": "CUST-123",
  "date_range": {
    "from": "2026-01-01",
    "to": "2026-06-30"
  }
}
```

Validation can include:

```text
Required fields
Data types
Allowed values
Date ranges
Customer identifier format
Maximum query scope
Allowed filters
Payload size
Prompt constraints
Policy restrictions
```

Invalid request:

```text
customer_id = "*"
```

could be rejected if unrestricted customer retrieval is not permitted.

---

# 12. Output Validation

Governance does not stop after Worker execution.

The Delegator validates Worker output before returning it to the Coordinator.

```text
Worker Result
      │
      ▼
Delegator
      │
      ├── Schema validation
      ├── Completeness check
      ├── Data classification
      ├── Sensitive-data check
      ├── Policy validation
      ├── Business-rule validation
      └── Redaction
      │
      ▼
Coordinator
```

For example, if a Worker accidentally returns restricted information:

```text
Worker Result
      ↓
Restricted Field Detected
      ↓
Redaction Policy
      ↓
Restricted field removed
      ↓
Approved result
```

---

# 13. Business Validation Rules

Delegators can enforce domain-specific business rules.

For example, a Sales Delegator may define:

```text
Customer must exist
Customer must belong to authorized scope
Revenue period must be valid
Opportunity must belong to permitted sales region
Only approved CRM objects can be queried
```

A Finance Delegator could have completely different rules.

This is one of the key reasons Delegators provide **domain isolation**.

---

# 14. Domain-Specific Policy Examples

Different Delegators can have different policies.

### Sales Delegator

```text
Allowed:
    Customer profile
    Opportunities
    Revenue
    Pipeline
    Sales activity

Restricted:
    Employee compensation
    HR information
    Payment transactions
```

### Finance Delegator

```text
Allowed:
    Financial reporting
    Budget analysis
    Revenue reporting
    Cost analysis

Restricted:
    HR employee records
    Customer authentication information
```

### HR Delegator

```text
Allowed:
    Employee directory
    Workforce analytics
    Organization information

Restricted:
    Unauthorized compensation data
    Restricted personnel information
```

The Coordinator does not need to contain all these domain-specific rules.

Each Delegator owns its domain governance.

---

# 15. Authorization vs Policy

These concepts should be separated.

### Authorization

Answers:

> **Is this user/agent allowed to perform this operation?**

Example:

```text
User → Revenue Analysis
       ↓
       ALLOWED
```

### Policy

Answers:

> **Under what conditions can the operation be performed?**

Example:

```text
Revenue Analysis

Allowed:
    Current fiscal year

Restricted:
    Historical confidential data

Maximum:
    100 customers

Required:
    Sales domain entitlement
```

Therefore:

```text
Authorization = Who can do it?

Policy = Under what conditions can they do it?
```

---

# 16. Policy Decision and Policy Enforcement

The Delegator can use a centralized Policy Service.

```text
                 Delegator
                     │
                     ▼
              Policy Service
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        ALLOW       DENY      REDACT
```

Possible decisions:

```text
ALLOW
DENY
REDACT
ESCALATE
REQUIRE_APPROVAL
```

The Delegator then enforces the decision.

This is preferable to embedding hundreds of hard-coded policy rules inside the Delegator.

---

# 17. Worker Selection Must Also Be Governed

Worker selection is not simply:

```python
worker = registry.find("revenue_worker")
```

Instead:

```text
Task
 ↓
Required Capability
 ↓
Candidate Workers
 ↓
Domain Ownership
 ↓
Authorization
 ↓
Tool Access
 ↓
Data Access
 ↓
Health
 ↓
Availability
 ↓
Workload
 ↓
Policy
 ↓
Best Worker
```

This ensures the selected Worker is not only technically capable but also **authorized and policy-compliant**.

---

# 18. Agent Registry as a Governance Input

The Agent Registry can provide metadata such as:

```json
{
  "agent_id": "sales-revenue-worker",
  "domain": "sales",
  "capabilities": [
    "revenue_lookup",
    "revenue_summary"
  ],
  "allowed_tools": [
    "snowflake_revenue_query"
  ],
  "data_domains": [
    "sales_revenue"
  ],
  "classification": "internal",
  "version": "2.1",
  "status": "healthy"
}
```

The Delegator uses this information during Worker selection and governance evaluation.

---

# 19. Identity Propagation

Authorization must follow the request through the entire execution chain.

```text
User
 │
 │ Identity
 ▼
Gateway
 │
 │ Auth Context
 ▼
Coordinator
 │
 │ Auth Context
 ▼
Delegator
 │
 │ Authorized Context
 ▼
Worker
 │
 │ Least-Privilege Identity
 ▼
Enterprise System
```

Important identifiers should also propagate:

```text
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

This allows both security enforcement and auditability.

---

# 20. Least-Privilege Execution

The Delegator should provide Workers with only what they need.

For example:

```text
Task:
    Retrieve revenue for Customer CUST-123
```

Worker should receive:

```text
Customer = CUST-123
Capability = revenue_lookup
Data scope = authorized customer
Tool = approved revenue query
```

It should not receive:

```text
All customer records
All Sales databases
All enterprise tools
All user permissions
```

This follows:

> **Minimum required capability + minimum required data + minimum required tool access.**

---

# 21. Guardrails Around LLM Usage

Delegators may use an LLM for domain reasoning.

For example:

```text
Domain Task
     ↓
LLM
     ↓
"Revenue data is required"
     ↓
Delegator
     ↓
Policy Validation
     ↓
Approved Capability
     ↓
Revenue Worker
```

The LLM does not get to decide:

```text
"I am authorized to query Snowflake."
```

Instead:

```text
LLM → recommendation
Delegator → policy evaluation
Policy Service → authorization decision
Worker → controlled execution
```

The key principle is:

> **The LLM can recommend an action, but the Delegator determines whether that action is permitted.**

---

# 22. RAG Governance

Delegators also need to govern domain-specific knowledge retrieval.

For example:

```text
Sales Delegator
       │
       ▼
RAG Request
       │
       ├── Domain = Sales
       ├── User entitlement
       ├── Data classification
       ├── Document ACL
       └── Intent
       │
       ▼
Azure AI Search
       │
       ▼
Authorized Documents
```

The Worker should not perform unrestricted enterprise-wide retrieval.

Retrieval should be constrained by:

```text
User entitlement
Domain
Document ACL
Data classification
Intent
Business scope
```

---

# 23. Prompt Governance

Delegators may also enforce which prompt templates can be used.

For example:

```text
Sales Delegator
       ↓
Prompt Registry
       ↓
sales_customer_summary_v4
       ↓
Approved
       ↓
Worker
```

Rather than allowing a Worker to dynamically use any prompt:

```text
Worker → arbitrary prompt → LLM
```

the platform can enforce:

```text
Domain
Capability
Prompt Version
Approval Status
Model
Data Classification
```

This provides controlled prompt lifecycle management.

---

# 24. Execution Governance

Before executing each Worker task, the Delegator can evaluate:

```text
Is task valid?
       ↓
Is domain correct?
       ↓
Is user authorized?
       ↓
Is capability allowed?
       ↓
Is Worker authorized?
       ↓
Is tool allowed?
       ↓
Is data access allowed?
       ↓
Are inputs valid?
       ↓
Is policy satisfied?
       ↓
Execute
```

This creates a controlled execution boundary.

---

# 25. Runtime Governance

Governance continues during execution.

The Delegator can monitor:

```text
Worker status
Task status
Execution time
Timeout
Retry count
Tool failures
Policy violations
Data-access failures
Concurrency
Rate limits
Output validation
```

Example:

```text
Worker executing
       │
       ▼
API rate limit exceeded
       │
       ▼
Delegator
       │
       ├── Retry?
       ├── Alternate Worker?
       ├── Wait?
       └── Fail safely?
```

---

# 26. Governance During Failover

Suppose:

```text
Revenue Worker A
       ↓
Unavailable
```

The Delegator should not simply select any available Worker.

Instead:

```text
Worker A unavailable
       ↓
Agent Registry
       ↓
Find alternative Workers
       ↓
Capability match
       ↓
Domain ownership
       ↓
Authorization
       ↓
Tool access
       ↓
Data access
       ↓
Health
       ↓
Policy
       ↓
Worker B
```

Fallback must remain governed.

---

# 27. Human Approval

Certain domain operations may require human approval.

Example:

```text
Task:
    Update customer contract
```

Delegator policy:

```text
Read → automatic
Analysis → automatic
Draft → automatic
Update → approval required
```

Execution becomes:

```text
Delegator
    ↓
Policy
    ↓
REQUIRE_APPROVAL
    ↓
Human Approval
    ↓
Worker
    ↓
Execute
```

This is especially important for high-impact or side-effecting operations.

---

# 28. Auditability

Every governance decision should be traceable.

Example:

```text
correlation_id = CORR-123

Authorization:
    ALLOW

Policy:
    SALES-CUSTOMER-READ

Capability:
    revenue_lookup

Worker:
    sales-revenue-worker

Tool:
    snowflake_revenue_query

Data scope:
    CUST-123

Result:
    ALLOW

Timestamp:
    ...
```

This allows security and compliance teams to answer:

```text
Who requested it?
What did they request?
Which domain handled it?
Which Worker executed it?
What data was accessed?
Which tool was used?
What policy allowed it?
What was returned?
```

---

# 29. Governance and Observability

Governance events should be part of the same end-to-end trace.

```text
Session
   │
Task
   │
Run
   │
Turn
   │
Step
   │
Policy Decision
   │
Worker
   │
Tool
   │
Enterprise System
```

This allows operational and security monitoring to be correlated.

Example:

```text
Correlation ID
      ↓
Coordinator
      ↓
Sales Delegator
      ↓
Authorization Check
      ↓
Policy Check
      ↓
Revenue Worker
      ↓
Snowflake
      ↓
Result Validation
      ↓
Coordinator
```

---

# 30. Delegator Governance Architecture

A production Delegator can be viewed as:

```text
                  ┌───────────────────────┐
                  │       Coordinator     │
                  └───────────┬───────────┘
                              │
                             A2A
                              │
                              ▼
              ┌─────────────────────────────┐
              │          Delegator          │
              │                             │
              │  Domain Validation          │
              │  Authorization              │
              │  Policy Enforcement         │
              │  Capability Validation      │
              │  Data Access Control        │
              │  Tool Restrictions           │
              │  Input Validation            │
              │  Worker Selection            │
              │  Execution Control           │
              │  Output Validation           │
              │  Recovery                    │
              └──────────────┬──────────────┘
                             │
                 ┌───────────┼───────────┐
                 │           │           │
                 ▼           ▼           ▼
              Worker A    Worker B    Worker C
                 │           │           │
                 ▼           ▼           ▼
               MCP         MCP         MCP
                 │           │           │
                 └───────────┼───────────┘
                             ▼
                    Enterprise Systems
```

Supporting services:

```text
Entra ID / RBAC
       │
       ▼
Policy Service
       │
       ▼
Agent Registry
       │
       ▼
Prompt Registry
       │
       ▼
Key Vault
       │
       ▼
Azure AI Search
       │
       ▼
MLflow / App Insights / Log Analytics
```

---

# 31. Responsibility Split

| Responsibility       | Coordinator      | Delegator | Worker          |
| -------------------- | ---------------- | --------- | --------------- |
| Enterprise intent    | Yes              | No        | No              |
| Enterprise routing   | Yes              | No        | No              |
| Domain validation    | No               | Yes       | No              |
| Domain policy        | No               | Yes       | Limited         |
| Domain authorization | Central + domain | Yes       | Enforce locally |
| Capability selection | High-level       | Yes       | No              |
| Worker selection     | No               | Yes       | No              |
| Tool restrictions    | High-level       | Yes       | Yes             |
| Data restrictions    | Central          | Yes       | Yes             |
| Task decomposition   | Enterprise       | Domain    | No              |
| Worker execution     | No               | Controls  | Yes             |
| Input validation     | High-level       | Yes       | Yes             |
| Output validation    | Final            | Domain    | Yes             |
| Recovery             | Enterprise       | Domain    | Local           |
| Audit/trace          | Yes              | Yes       | Yes             |

---

# 32. CWD Governance Flow

The complete production flow becomes:

```text
User Request
     │
     ▼
Gateway Authentication
     │
     ▼
Coordinator Authorization
     │
     ▼
Intent + Domain Identification
     │
     ▼
Delegator Selection
     │
     ▼
A2A
     │
     ▼
Delegator
     │
     ├── Validate Domain
     ├── Validate Authorization
     ├── Evaluate Policy
     ├── Validate Capability
     ├── Validate Data Scope
     ├── Validate Tool Access
     ├── Validate Inputs
     ├── Discover Workers
     ├── Select Authorized Worker
     │
     ▼
Worker Execution
     │
     ├── MCP
     ├── RAG
     ├── API
     └── Enterprise System
     │
     ▼
Worker Result
     │
     ▼
Delegator Validation
     │
     ├── Schema Validation
     ├── Business Validation
     ├── Data Governance
     ├── Redaction
     └── Policy Validation
     │
     ▼
Coordinator
     │
     ▼
Final Response Governance
     │
     ▼
User
```

---

# 33. Most Important Architectural Principle

The Delegator should not trust:

```text
User
LLM
Worker
Tool
Agent
```

just because they are part of the CWD platform.

Every execution request should pass through explicit controls.

```text
Request
   ↓
Identity
   ↓
Authorization
   ↓
Policy
   ↓
Capability
   ↓
Data Scope
   ↓
Tool Scope
   ↓
Worker Selection
   ↓
Execution
   ↓
Output Validation
```

This provides **defense in depth**.

---

# 34. Coordinator vs Delegator Governance

A useful distinction is:

### Coordinator

Controls **enterprise-level governance**:

```text
Who is the user?
What are they asking?
Which domain should handle it?
Is execution permitted?
Which Delegator should receive it?
```

### Delegator

Controls **domain-level governance**:

```text
What can this domain do?
What capabilities are allowed?
Which Workers are permitted?
What data can they access?
Which tools can they use?
What domain policies apply?
What validation is required?
```

### Worker

Controls **execution-level enforcement**:

```text
Can I execute this specific operation?
Can I use this specific tool?
Can I access this specific resource?
Is the input valid?
Is the output safe?
```

Therefore:

```text
Coordinator
    = Enterprise Governance

Delegator
    = Domain Governance

Worker
    = Execution Governance
```

---

# 35. Final Architect View

The Delegator is the **domain-level policy enforcement and execution-control boundary** in CWD.

It ensures that domain tasks are not simply routed to Workers, but are executed only when they satisfy:

```text
Domain Ownership
        +
Authorization
        +
Policy
        +
Capability
        +
Data Access
        +
Tool Access
        +
Worker Eligibility
        +
Input Validation
        +
Execution Constraints
        +
Output Validation
```

The overall model is:

```text
Coordinator
    │
    │ Enterprise objective
    ▼
Delegator
    │
    │ Domain policy + governed task
    ▼
Worker
    │
    │ Controlled capability
    ▼
Tool / MCP
    │
    │ Governed access
    ▼
Enterprise System
```

### One-line definition

> **Delegator = Domain Routing + Domain Authorization + Policy Enforcement + Capability Control + Data/Tool Restrictions + Worker Governance + Execution Control + Validation.**

The key architectural principle for CWD is:

> **The Coordinator decides what should happen at the enterprise level; the Delegator determines what is permitted within the business domain; the Worker performs only the specifically authorized operation.**
