# Worker Agent – Specialized Task Execution in CWD

## 1. Overview

In CWD, a **Worker Agent** is a specialized execution component responsible for performing a well-defined business or technical task delegated by a Delegator.

The Worker is the **execution layer** of the CWD architecture.

It does not own enterprise-wide orchestration or domain-level planning. Instead, it receives an authorized task, uses its assigned capabilities and tools, performs the operation, validates the result, and returns a structured response.

```text
Coordinator
     │
     │ Enterprise objective
     ▼
Delegator
     │
     │ Domain task
     ▼
Worker Agent
     │
     │ Specific capability
     ▼
MCP / API / SDK / RAG
     │
     ▼
Enterprise System
```

### One-line definition

> **Worker Agent = A specialized, governed execution component that performs one well-defined capability and returns a validated result to the Delegator.**

---

# 2. Where the Worker Fits in CWD

The Worker sits below the Delegator in the execution hierarchy.

```text
┌──────────────────────────────────────────┐
│              Coordinator                 │
│                                          │
│ Enterprise intent                        │
│ Planning                                 │
│ Cross-domain coordination                │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│               Delegator                  │
│                                          │
│ Domain routing                           │
│ Domain decomposition                     │
│ Worker selection                         │
│ Domain policy                            │
│ Execution control                        │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│              Worker Agent                │
│                                          │
│ Task execution                           │
│ Tool invocation                          │
│ Data retrieval                           │
│ Business computation                     │
│ Result validation                        │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│        Enterprise Tools and Systems      │
│                                          │
│ Snowflake / Salesforce / Oracle /        │
│ SharePoint / M365 / APIs / RAG           │
└──────────────────────────────────────────┘
```

The Worker is therefore **not a replacement for the Delegator**.

---

# 3. Why Worker Agents Are Required

Enterprise business tasks are usually too specific and numerous to be implemented directly inside the Coordinator or Delegator.

For example, a Sales domain may require:

```text
Customer Profile Retrieval
Revenue Lookup
Opportunity Analysis
Pipeline Calculation
Customer Interaction Retrieval
Sales Document Generation
```

Each operation can be implemented as a separate Worker.

```text
Sales Delegator
      │
      ├── Customer Profile Worker
      ├── Revenue Worker
      ├── Opportunity Worker
      ├── Pipeline Worker
      ├── Interaction Worker
      └── Briefing Worker
```

This provides:

* separation of responsibilities
* reusable capabilities
* independent development
* independent deployment
* easier testing
* controlled tool access
* domain-specific specialization
* better failure isolation
* scalable execution

---

# 4. What Makes a Worker “Specialized”?

A Worker should have a clearly defined responsibility.

For example:

### Revenue Worker

```text
Capability:
    revenue_lookup
```

Responsibilities:

```text
Retrieve authorized revenue data
Apply approved filters
Calculate revenue totals
Validate returned values
Return structured revenue result
```

It should not also own:

```text
Employee onboarding
Customer contract approval
Shipment tracking
Enterprise-wide routing
```

A Worker should follow the principle:

> **One Worker may support several closely related capabilities, but its execution boundary must remain well-defined.**

---

# 5. Examples of Worker Agents

## Sales Domain

```text
Sales Delegator
    │
    ├── Customer Profile Worker
    │      └── Retrieve customer information
    │
    ├── Revenue Worker
    │      └── Retrieve and summarize revenue
    │
    ├── Opportunity Worker
    │      └── Retrieve open opportunities
    │
    └── Interaction Worker
           └── Retrieve recent customer interactions
```

## Finance Domain

```text
Finance Delegator
    │
    ├── Revenue Analysis Worker
    ├── Cost Analysis Worker
    ├── Budget Worker
    └── Financial Reporting Worker
```

## Supply Chain Domain

```text
Supply Chain Delegator
    │
    ├── Inventory Worker
    ├── Shipment Worker
    ├── Supplier Worker
    └── Supply Risk Worker
```

## Technical Domain

```text
Technical Delegator
    │
    ├── Log Analysis Worker
    ├── Incident Classification Worker
    ├── Root Cause Analysis Worker
    └── Remediation Recommendation Worker
```

---

# 6. Worker Responsibilities

A Worker is responsible for the following execution activities.

## 6.1 Receive a Structured Task

The Worker receives a task from the Delegator.

```text
Task:
    Retrieve revenue for Customer CUST-123
```

The task should contain:

```text
task_id
run_id
step_id
correlation_id
domain
capability
objective
inputs
authorization context
data scope
tool scope
execution metadata
```

---

## 6.2 Validate the Task

Before execution, the Worker validates:

```text
Required fields
Input format
Capability
Task status
Authorization context
Data scope
Tool restrictions
Business constraints
```

Example:

```text
Customer ID missing
       ↓
Worker validation
       ↓
Reject invalid task
```

The Worker should not execute an incomplete or malformed request.

---

## 6.3 Perform the Assigned Capability

The Worker executes the specific operation.

Examples:

```text
Revenue Worker
    → Query revenue data

Opportunity Worker
    → Retrieve open opportunities

Inventory Worker
    → Check inventory levels

Document Worker
    → Generate a customer briefing
```

The Worker should not expand the task into unrelated activities.

---

## 6.4 Invoke Approved Tools

The Worker may use:

```text
MCP tools
REST APIs
SDKs
Database adapters
RAG retrieval
Enterprise services
Approved Python libraries
```

Example:

```text
Revenue Worker
      │
      ▼
Snowflake Query Tool
      │
      ▼
Snowflake
      │
      ▼
Revenue Result
```

The Worker should use only tools permitted for its capability.

---

## 6.5 Apply Business Logic

The Worker can perform domain-specific computation.

For example:

```text
Revenue Worker:
    Retrieve monthly revenue
    Calculate total revenue
    Calculate growth percentage
    Format currency
    Validate values
```

The Worker owns the detailed execution logic required for its capability.

---

## 6.6 Validate the Result

The Worker validates its output before returning it.

```text
Raw Data
   ↓
Worker Processing
   ↓
Schema Validation
   ↓
Business Validation
   ↓
Data Governance Check
   ↓
Structured Result
```

Example:

```text
Revenue = null
Expected revenue field missing
       ↓
Worker marks result as incomplete
```

---

## 6.7 Return a Structured Response

The Worker returns a standardized result to the Delegator.

```json
{
  "task_id": "TASK-1001",
  "run_id": "RUN-501",
  "step_id": "STEP-03",
  "correlation_id": "CORR-789",
  "worker_id": "sales-revenue-worker",
  "status": "COMPLETED",
  "result": {
    "customer_id": "CUST-123",
    "revenue": 12500000,
    "currency": "USD"
  },
  "metadata": {
    "source": "snowflake",
    "execution_time_ms": 842
  }
}
```

The Delegator uses this response for aggregation and workflow control.

---

# 7. Worker as an Execution Component

The Worker should be viewed as:

```text
Input
  ↓
Validation
  ↓
Reasoning, if required
  ↓
Tool Execution
  ↓
Processing
  ↓
Output Validation
  ↓
Result
```

For example:

```text
Retrieve Revenue
       ↓
Validate Customer ID
       ↓
Select Approved Query
       ↓
Execute Snowflake Tool
       ↓
Calculate Revenue
       ↓
Validate Result
       ↓
Return Revenue
```

This is different from the Delegator, which decides **which tasks should execute and in what order**.

---

# 8. Does a Worker Use an LLM?

A Worker may use an LLM when the task requires reasoning, interpretation, classification, summarization, or generation.

For example:

```text
Briefing Worker
       │
       ▼
LLM
       │
       ▼
Generate customer briefing
```

However, not every Worker needs an LLM.

### LLM-based Worker

```text
Customer Briefing Worker
    → Interpret data
    → Summarize findings
    → Generate narrative
```

### Non-LLM Worker

```text
Revenue Calculation Worker
    → Query data
    → Calculate totals
    → Return structured result
```

The architecture should use the simplest reliable execution mechanism for the task.

---

# 9. LLM vs Worker Responsibility

The LLM is the intelligence engine.

The Worker is the controlled execution component.

```text
Worker
   │
   ├── LLM reasoning
   ├── Input validation
   ├── Tool selection within policy
   ├── Tool execution
   ├── Business logic
   ├── Result validation
   └── Response formatting
```

The LLM should not independently decide:

```text
"I can access any database."
"I can use any tool."
"I can ignore authorization."
"I can execute any enterprise operation."
```

Instead:

```text
LLM → Reasoning recommendation
Worker → Controlled execution
Policy → Permission decision
Tool → Actual system operation
```

---

# 10. Worker Communication with the Delegator

When the Worker is an independent agent, communication can use A2A.

```text
Delegator
     │
     │ A2A Task Request
     ▼
Worker Agent
     │
     │ A2A Task Result
     ▼
Delegator
```

The communication includes:

```text
Task identity
Execution context
Capability
Input
Authorization scope
Execution mode
Status
Result
Error details
```

For an internal Worker component, the Delegator may use a local service interface instead.

The important requirement is that the execution contract remains standardized.

---

# 11. Worker Task Lifecycle

A Worker task typically follows this lifecycle:

```text
RECEIVED
   ↓
VALIDATING
   ↓
ACCEPTED
   ↓
RUNNING
   ↓
COMPLETED
```

Failure states:

```text
RUNNING
   ↓
FAILED
```

or:

```text
RUNNING
   ↓
TIMEOUT
```

or:

```text
RUNNING
   ↓
CANCELLED
```

The Worker reports status to the Delegator.

---

# 12. Synchronous Worker Execution

For short-running tasks:

```text
Delegator
    │
    │ Request
    ▼
Worker
    │
    │ Execute
    ▼
Enterprise Tool
    │
    ▼
Worker
    │
    │ Immediate result
    ▼
Delegator
```

Example:

```text
"Get current inventory for Part ABC."
```

The Worker can return the result immediately.

```json
{
  "task_id": "TASK-1002",
  "status": "COMPLETED",
  "result": {
    "part_number": "ABC",
    "available_quantity": 250
  }
}
```

---

# 13. Asynchronous Worker Execution

For long-running tasks:

```text
Delegator
    │
    │ Submit task
    ▼
Message Broker
    │
    ▼
Worker
    │
    │ Process
    ▼
Enterprise Systems
```

The Worker first returns:

```json
{
  "task_id": "TASK-1003",
  "status": "ACCEPTED"
}
```

Later, it publishes:

```json
{
  "task_id": "TASK-1003",
  "status": "COMPLETED",
  "result": {
    "document_uri": "approved-result-reference"
  }
}
```

The Delegator correlates the response and resumes the domain workflow.

---

# 14. Worker Execution in Parallel

A Delegator can invoke multiple Workers concurrently.

Example:

```text
Sales Delegator
      │
      ├── Customer Profile Worker
      ├── Revenue Worker
      ├── Opportunity Worker
      └── Interaction Worker
```

Independent tasks can execute in parallel:

```text
T1 ──┐
T2 ──┤
T3 ──┼── Parallel
T4 ──┘
      │
      ▼
   Results
```

The Worker does not need to know about the entire enterprise workflow.

It only executes its assigned task.

---

# 15. Worker Context

The Worker receives two important categories of context.

## Business Context

```text
domain
intent
customer_id
part_number
requested_period
business objective
```

## Execution Context

```text
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

Example:

```json
{
  "business_context": {
    "domain": "sales",
    "customer_id": "CUST-123",
    "requested_period": "FY2026"
  },
  "execution_context": {
    "session_id": "SESSION-100",
    "task_id": "TASK-1001",
    "run_id": "RUN-501",
    "step_id": "STEP-03",
    "correlation_id": "CORR-789"
  }
}
```

This allows the Worker to execute the task correctly and allows the platform to trace it.

---

# 16. Worker Data Access

The Worker should access enterprise data only through approved mechanisms.

```text
Worker
    │
    ▼
Approved MCP Tool / Adapter
    │
    ▼
Enterprise System
```

Examples:

```text
Revenue Worker
    → Snowflake adapter

Opportunity Worker
    → Salesforce adapter

Document Worker
    → SharePoint adapter

Inventory Worker
    → Supply Chain API
```

The Worker should not bypass the approved integration layer.

---

# 17. Worker Security

A Worker should operate with least privilege.

Security controls include:

```text
Managed identity
Role-based access
Tool-level permissions
Data-scope restrictions
Input validation
Output validation
Secret management
DLP/redaction
Audit logging
```

The Worker should not receive unrestricted enterprise credentials.

For example:

```text
Revenue Worker
    → Permission to execute approved revenue query
```

not:

```text
Revenue Worker
    → Full access to all Snowflake databases
```

---

# 18. Worker Tool Restrictions

Each Worker should have an explicit tool allowlist.

Example:

```text
Revenue Worker
    Allowed:
        snowflake_revenue_query
        revenue_summary_api

    Not allowed:
        employee_hr_api
        payment_update_api
        customer_contract_update
```

The Worker validates that the requested operation uses an approved tool.

```text
Requested Tool
      ↓
Worker Tool Policy
      ↓
Allowed?
      ├── YES → Execute
      └── NO  → Reject
```

---

# 19. Worker Failure Handling

The Worker should handle failures locally where possible.

Examples:

```text
Invalid input
    → Return validation error

Tool timeout
    → Retry according to policy

Temporary API failure
    → Retry or return transient error

Unauthorized access
    → Stop execution

Invalid enterprise response
    → Return data error
```

The Delegator remains responsible for domain-level recovery.

```text
Worker
    → Detect local failure

Delegator
    → Decide retry, fallback, partial result, or escalation
```

---

# 20. Worker Result Types

A Worker can return different result types.

### Successful result

```json
{
  "status": "COMPLETED",
  "result": {
    "revenue": 12500000
  }
}
```

### Partial result

```json
{
  "status": "PARTIAL",
  "result": {
    "revenue": 12500000
  },
  "warnings": [
    "Historical revenue unavailable"
  ]
}
```

### Failed result

```json
{
  "status": "FAILED",
  "error": {
    "code": "DATA_SOURCE_TIMEOUT",
    "message": "Revenue source did not respond"
  }
}
```

### Rejected result

```json
{
  "status": "REJECTED",
  "error": {
    "code": "UNAUTHORIZED_CAPABILITY",
    "message": "Worker is not authorized for this operation"
  }
}
```

---

# 21. Worker Validation Rules

Worker validation can occur at several levels.

| Validation    | Example                        |
| ------------- | ------------------------------ |
| Schema        | Required `customer_id` exists  |
| Input         | Customer ID has valid format   |
| Authorization | User can access customer       |
| Capability    | Worker supports revenue lookup |
| Tool          | Snowflake tool is approved     |
| Data          | Requested dataset is permitted |
| Business      | Revenue period is valid        |
| Output        | Revenue field is numeric       |
| Governance    | Restricted data is redacted    |

---

# 22. Worker Observability

Every Worker execution should produce structured telemetry.

Important fields include:

```text
worker_id
domain
capability
task_id
run_id
step_id
correlation_id
status
start_time
end_time
duration
retry_count
tool_name
data_source
error_code
```

Example:

```json
{
  "worker_id": "sales-revenue-worker",
  "task_id": "TASK-1001",
  "capability": "revenue_lookup",
  "status": "COMPLETED",
  "duration_ms": 842,
  "tool_name": "snowflake_revenue_query"
}
```

This supports:

* troubleshooting
* performance monitoring
* SLA tracking
* cost analysis
* auditability
* failure analysis
* Worker capacity planning

---

# 23. Worker Health and Availability

The Worker runtime should expose health information.

```text
Worker Status:
    HEALTHY

Availability:
    AVAILABLE

Active Tasks:
    4

Concurrency Limit:
    10

Queue Depth:
    2
```

The Delegator uses this information to select appropriate Workers.

The Worker itself should not decide enterprise-wide routing.

---

# 24. Worker Scalability

Multiple instances of the same Worker can form a Worker pool.

```text
Revenue Worker Pool
    ├── Revenue Worker Instance 1
    ├── Revenue Worker Instance 2
    └── Revenue Worker Instance 3
```

The Delegator selects the logical Worker capability.

The runtime platform manages physical scaling.

```text
Delegator
    ↓
Revenue Worker Capability
    ↓
ACA / AKS Runtime
    ↓
Available Worker Instance
```

This allows high-volume capabilities to scale independently.

---

# 25. Worker Versioning

Workers should support controlled versioning.

Example:

```text
sales-revenue-worker:v1
sales-revenue-worker:v2
```

The Agent Registry can maintain:

```text
Capability
Version
Status
Health
Supported tools
Routing metadata
```

The Delegator can select a compatible version based on policy and task requirements.

---

# 26. Worker Reusability

A Worker capability can be reused by multiple workflows.

For example:

```text
Revenue Worker
      │
      ├── Customer Briefing
      ├── Sales Forecast
      ├── Business Review
      └── Executive Reporting
```

The Worker does not need to know which larger workflow requested the operation.

It receives a structured task and returns a structured result.

This is a major benefit of capability-based architecture.

---

# 27. Example: Customer Briefing

The Coordinator sends:

```text
"Prepare a customer briefing for Customer ABC."
```

The Sales Delegator decomposes the task:

```text
T1 → Customer Profile
T2 → Revenue
T3 → Opportunities
T4 → Recent Interactions
T5 → Generate Briefing
```

The Delegator selects Workers:

```text
T1 → Customer Profile Worker
T2 → Revenue Worker
T3 → Opportunity Worker
T4 → Interaction Worker
T5 → Briefing Worker
```

Each Worker performs one well-defined capability.

```text
Customer Profile Worker
    → Retrieve profile

Revenue Worker
    → Retrieve revenue

Opportunity Worker
    → Retrieve opportunities

Interaction Worker
    → Retrieve interactions

Briefing Worker
    → Generate briefing from approved inputs
```

The Delegator aggregates the domain results and returns them to the Coordinator.

---

# 28. Worker vs Delegator vs Coordinator

| Responsibility       | Coordinator      | Delegator       | Worker   |
| -------------------- | ---------------- | --------------- | -------- |
| Enterprise intent    | Yes              | No              | No       |
| Domain routing       | Yes              | Validate        | No       |
| Domain decomposition | No               | Yes             | No       |
| Worker selection     | No               | Yes             | No       |
| Task execution       | No               | Controls        | Yes      |
| Tool invocation      | No               | Governs         | Yes      |
| Business computation | No               | Domain planning | Yes      |
| Data retrieval       | No               | Controls scope  | Yes      |
| Domain policy        | Central + domain | Yes             | Enforces |
| Context propagation  | Enterprise       | Domain          | Task     |
| Status tracking      | Overall          | Domain          | Local    |
| Retry/fallback       | Enterprise       | Domain          | Local    |
| Domain aggregation   | No               | Yes             | No       |
| Final response       | Yes              | No              | No       |

---

# 29. What a Worker Should NOT Do

A Worker should not:

```text
Perform enterprise-wide routing
Select unrelated domains
Override authorization
Access unrestricted data
Use unapproved tools
Change its own permissions
Bypass the Delegator
Make uncontrolled side effects
Return unvalidated results
Own the entire business workflow
```

For example, a Revenue Worker should not decide:

```text
"Because revenue is low, I will update the customer contract."
```

That would exceed its capability boundary.

---

# 30. Worker Agent Architecture

A production Worker can be structured as:

```text
┌──────────────────────────────────────┐
│             Worker Agent             │
│                                      │
│ Task API / A2A Endpoint              │
│          │                           │
│ Task Validation                      │
│          │                           │
│ Authorization / Policy Check         │
│          │                           │
│ Capability Handler                   │
│          │                           │
│ LLM Reasoning, if required           │
│          │                           │
│ MCP / API / SDK                      │
│          │                           │
│ Enterprise System                   │
│          │                           │
│ Result Validation                    │
│          │                           │
│ Response Builder                     │
│          │                           │
│ Observability                        │
└──────────────────────────────────────┘
```

---

# 31. Worker Execution Flow

```text
Delegator Task
      │
      ▼
Worker Endpoint
      │
      ▼
Authenticate Request
      │
      ▼
Validate Task
      │
      ▼
Validate Capability
      │
      ▼
Check Authorization
      │
      ▼
Apply Tool/Data Policy
      │
      ▼
Execute Business Logic
      │
      ▼
Invoke MCP / API / RAG
      │
      ▼
Process Result
      │
      ▼
Validate Output
      │
      ▼
Create Structured Response
      │
      ▼
Return to Delegator
```

---

# 32. Final Architect View

The Worker Agent is the **execution building block** of CWD.

It transforms a structured task into an actual business or technical result.

```text
Delegator
    │
    │ "Perform this authorized capability"
    ▼
Worker
    │
    ├── Validate
    ├── Reason, if required
    ├── Invoke approved tools
    ├── Access authorized data
    ├── Execute business logic
    ├── Validate output
    └── Return result
    │
    ▼
Delegator
```

The responsibility hierarchy is:

```text
Coordinator
    = Enterprise objective and coordination

Delegator
    = Domain planning and Worker orchestration

Worker
    = Specialized capability execution

Tool / System
    = Actual enterprise operation
```

### One-line definition

> **Worker Agent = A specialized, policy-controlled execution component that performs a well-defined business or technical capability using approved tools, authorized data, and structured task context.**

### Core CWD principle

> **The Delegator decides which Worker should perform the task; the Worker performs only the authorized capability and returns a validated result.**
