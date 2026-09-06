# Worker Agent Responsibilities in CWD

A Worker Agent is the specialized execution component responsible for performing a well-defined business or technical task delegated by the Delegator.

In the CWD architecture:

> Coordinator decides the overall objective → Delegator decomposes and coordinates domain work → Worker executes the assigned task.

The Worker should focus on reliable, authorized, and observable execution, rather than managing the entire enterprise workflow.

## 1. Receive and Understand the Task

The Worker receives a structured task from the Delegator.

The task should contain:

* Task ID and correlation ID
* Business objective
* Required capability
* Input parameters
* Expected output schema
* Relevant business context
* Authorization context
* Priority and timeout
* Retry and execution constraints
* Required data sources or tools

### Example

```json
{
  "task_id": "task-102",
  "capability": "retrieve_customer_revenue",
  "objective": "Get the customer's revenue for the last four quarters",
  "customer_id": "CUST-1001",
  "period": "last_4_quarters",
  "expected_output": "quarterly_revenue",
  "correlation_id": "corr-789"
}
```

The Worker should not assume missing values or reinterpret the business objective without validation.

## 2. Validate Task Inputs

Before execution, the Worker validates whether the task is complete, authorized, and technically executable.

### Validation responsibilities

* Verify required parameters are present.
* Validate data types and formats.
* Confirm the requested capability is supported.
* Check that the task belongs to the Worker's domain.
* Validate authorization and data-access permissions.
* Check task status and idempotency.
* Confirm that the requested tool or data source is available.
* Reject unsupported or unsafe requests.

### Example

A Revenue Worker should reject a task if:

* `customer_id` is missing.
* The user is not authorized to view the customer.
* The requested period is invalid.
* The task requests an unsupported data source.
* The task has already been successfully completed.

Validation prevents invalid requests from reaching enterprise systems.

## 3. Select the Appropriate Tool

The Worker selects an approved tool or adapter required to complete the task.

The Worker should not dynamically access arbitrary systems. Tool selection must be constrained by:

* Worker capability
* Tool allowlist
* Domain ownership
* User and agent permissions
* Data classification
* Policy requirements
* Tool health and availability
* Input and output contracts

### Example

A Finance Revenue Worker may select:

```text
Revenue capability
    ↓
Approved Snowflake adapter
    ↓
Parameterized revenue query
```

A Salesforce Worker may select:

```text
Customer profile capability
    ↓
Approved Salesforce API adapter
    ↓
Customer account lookup
```

### Important principle

> The LLM may recommend a tool, but the Worker runtime and policy layer must control which tool is actually executed.

The Worker must not allow the LLM to generate unrestricted SQL, call arbitrary URLs, or bypass approved enterprise adapters.

## 4. Retrieve Data from Enterprise Systems

The Worker retrieves only the data required for the assigned task.

Typical data sources include:

* Snowflake
* Salesforce
* Oracle
* SharePoint
* Microsoft 365
* Azure AI Search
* Internal REST APIs
* Enterprise databases
* Approved MCP tools

### Data retrieval responsibilities

* Use approved connectors or adapters.
* Apply authorization and row-level or document-level security.
* Apply metadata filters.
* Retrieve the minimum necessary data.
* Handle pagination and rate limits.
* Validate source responses.
* Preserve source references and provenance.
* Avoid exposing restricted data in prompts or logs.

### Example

```text
Worker receives customer_id
        ↓
Checks authorization
        ↓
Calls approved Salesforce adapter
        ↓
Retrieves permitted customer records
        ↓
Normalizes the response
        ↓
Returns structured customer data
```

The Worker is responsible for data retrieval, but it does not own enterprise-wide data governance. Governance remains enforced through the platform, policy services, and source-system controls.

## 5. Execute Business or Technical Logic

After retrieving the required data, the Worker performs the assigned operation.

Examples include:

| Worker type | Execution responsibility |
| --- | --- |
| Revenue Worker | Calculate quarterly revenue and growth |
| Customer Profile Worker | Retrieve and normalize customer information |
| Sales Opportunity Worker | Identify open opportunities and pipeline value |
| Inventory Worker | Check stock availability |
| Document Worker | Extract and summarize approved documents |
| Data Quality Worker | Detect missing, duplicate, or invalid records |
| Technical Monitoring Worker | Query logs and identify service failures |
| Notification Worker | Send an approved notification through a governed API |

The Worker may use:

* Deterministic Python or application logic
* SQL through approved adapters
* Statistical calculations
* Rule-based processing
* RAG retrieval
* An LLM for bounded interpretation or transformation
* External enterprise APIs

### LLM usage

An LLM may be used when the task requires:

* Text classification
* Document extraction
* Semantic interpretation
* Summarization
* Natural-language transformation

However, the LLM should not independently control the full workflow.

> LLM = reasoning or interpretation engine. Worker runtime = execution and control engine.

## 6. Validate the Execution Result

The Worker must validate the result before returning it to the Delegator.

Validation should include:

### Technical validation

* Did the tool call succeed?
* Is the response structurally valid?
* Does it match the expected schema?
* Are required fields present?
* Are values within acceptable ranges?
* Was the response truncated or incomplete?

### Business validation

* Does the result satisfy the task objective?
* Are calculations correct?
* Are dates and currencies consistent?
* Are duplicate records removed?
* Are source records sufficiently complete?
* Are business rules satisfied?

### Governance validation

* Is the result authorized for the requesting user?
* Does it contain restricted or sensitive information?
* Must any fields be redacted?
* Is approval required before returning or acting on the result?

### Example

A Revenue Worker should verify:

```text
Revenue values are numeric
        ↓
All requested quarters are present
        ↓
Currency is identified
        ↓
No unauthorized customer fields are included
        ↓
Growth calculation is valid
```

If validation fails, the Worker should return a controlled failure rather than silently returning unreliable data.

## 7. Handle Errors and Recovery

Workers must handle failures locally whenever possible and communicate the failure clearly to the Delegator.

### Common failure types

| Failure | Example | Worker response |
| --- | --- | --- |
| Input error | Missing customer ID | Reject task with validation error |
| Authorization error | User lacks access | Return access-denied result |
| Tool error | API returns HTTP 500 | Retry if safe and permitted |
| Timeout | Database query exceeds limit | Cancel or retry according to policy |
| Rate limit | API quota exceeded | Apply backoff or return throttling status |
| Data error | Invalid or incomplete records | Return validation failure or partial result |
| Business error | Customer does not exist | Return controlled business error |
| Model error | LLM produces invalid structured output | Validate, retry, or use deterministic fallback |
| Dependency failure | Required service unavailable | Return dependency-unavailable status |

### Retry principles

Retries should be:

* Limited
* Policy-controlled
* Exponential or backoff-based
* Safe for the operation
* Protected by idempotency
* Recorded in observability systems

A Worker should not retry indefinitely or repeat non-idempotent actions without protection.

## 8. Return Structured Results to the Delegator

The Worker should return a predictable, machine-readable response rather than only a natural-language message.

A structured result normally contains:

* Task ID
* Correlation ID
* Worker ID and version
* Execution status
* Result payload
* Output schema or result type
* Source references
* Validation status
* Error details, if applicable
* Execution metadata
* Timestamp
* Retry information
* Partial-result indicators

### Example: Successful result

```json
{
  "task_id": "task-102",
  "worker_id": "revenue-worker",
  "status": "completed",
  "result": {
    "customer_id": "CUST-1001",
    "currency": "USD",
    "quarterly_revenue": [
      { "quarter": "Q1", "revenue": 1200000 },
      { "quarter": "Q2", "revenue": 1350000 },
      { "quarter": "Q3", "revenue": 1420000 },
      { "quarter": "Q4", "revenue": 1510000 }
    ],
    "growth_percentage": 25.8
  },
  "validation": {
    "schema_valid": true,
    "business_rules_valid": true
  },
  "sources": [
    {
      "system": "Snowflake",
      "reference": "revenue_fact_table"
    }
  ],
  "correlation_id": "corr-789"
}
```

### Example: Failed result

```json
{
  "task_id": "task-102",
  "worker_id": "revenue-worker",
  "status": "failed",
  "error": {
    "code": "DATA_SOURCE_TIMEOUT",
    "message": "Revenue data source did not respond within the permitted timeout",
    "retryable": true
  },
  "correlation_id": "corr-789"
}
```

The Delegator can then decide whether to:

* Retry the task
* Select a fallback Worker
* Continue with partial results
* Escalate to the Coordinator
* Request human intervention
* Mark the domain workflow as failed

## 9. Maintain Context and Traceability

The Worker should preserve the context required to correlate its execution with the larger workflow.

Important identifiers include:

```text
User request ID
    ↓
Session ID
    ↓
Workflow ID
    ↓
Delegator execution ID
    ↓
Worker task ID
    ↓
Tool invocation ID
```

The Worker should record:

* Start and completion time
* Selected capability
* Selected tool
* Tool latency
* Success or failure
* Retry count
* Data source
* Model usage, if applicable
* Token usage, if applicable
* Policy decisions
* Validation outcomes
* Error codes

Logs should avoid exposing sensitive business data, credentials, tokens, or restricted content.

## 10. Support Monitoring, Health, and Scalability

Workers are independently monitored and scaled according to their workload.

### Monitoring areas

* Availability
* Health-check status
* Execution latency
* Success and failure rates
* Queue depth
* Concurrent executions
* Tool failure rates
* Retry frequency
* Resource utilization
* Cost per execution
* Data-quality failures

### Scaling examples

```text
High-volume customer lookups
        ↓
Scale Customer Profile Worker instances

Long-running document processing
        ↓
Use asynchronous execution and queue-based workers

High-priority production incident
        ↓
Route to a healthy, high-priority Technical Worker pool
```

The logical Worker capability remains stable even when its physical runtime scales across Azure Container Apps, AKS, or other approved execution infrastructure.

## 11. Worker Execution Lifecycle

A typical Worker lifecycle is:

```text
Receive task
    ↓
Validate task and context
    ↓
Check authorization and policy
    ↓
Select approved capability/tool
    ↓
Retrieve required data
    ↓
Execute business or technical logic
    ↓
Validate result
    ↓
Handle errors or retry if permitted
    ↓
Create structured response
    ↓
Record telemetry and audit information
    ↓
Return result to Delegator
```

## 12. Worker Responsibilities vs. Delegator Responsibilities

| Responsibility | Delegator | Worker |
| --- | --- | --- |
| Understand domain-level objective | Yes | No |
| Decompose complex domain task | Yes | No |
| Select among multiple Workers | Yes | No |
| Execute a specialized task | Coordinates | Yes |
| Select approved tool for its capability | Governs selection | Yes |
| Retrieve required data | Oversees | Yes |
| Apply business logic | Coordinates domain flow | Yes |
| Validate task inputs | Domain-level | Task-level |
| Validate execution result | Aggregates | Yes |
| Retry failed Worker tasks | Coordinates recovery | Handles local retry |
| Aggregate multiple Worker results | Yes | No |
| Decide cross-domain routing | Yes | No |
| Return structured result | Receives and aggregates | Yes |

## 13. What a Worker Must Not Do

A Worker should not:

* Decide the complete enterprise workflow.
* Route requests across unrelated business domains.
* Bypass the Delegator.
* Access databases directly without approved adapters.
* Use unrestricted tools or arbitrary APIs.
* Override authorization or policy decisions.
* Return unvalidated data as a successful result.
* Expose sensitive information in logs or prompts.
* Retry indefinitely.
* Make uncontrolled production changes.
* Replace the Coordinator or Delegator.

## Example: Customer Briefing Workflow

A Delegator may decompose a customer briefing into several Worker tasks:

```text
Customer Briefing Delegator
        │
        ├── Customer Profile Worker
        │       └── Retrieve customer profile from Salesforce
        │
        ├── Revenue Worker
        │       └── Retrieve revenue from Snowflake
        │
        ├── Opportunity Worker
        │       └── Retrieve open opportunities from CRM
        │
        └── Interaction Worker
                └── Retrieve recent interactions from M365
```

Each Worker:

1. Receives its assigned task.
2. Validates the task and permissions.
3. Selects the appropriate approved tool.
4. Retrieves the required data.
5. Performs its specialized logic.
6. Validates the result.
7. Returns a structured response.

The Delegator then aggregates the Worker results and returns a domain-level result to the Coordinator.

## Final Definition

> A Worker Agent is a specialized, policy-controlled execution component that receives an authorized task from the Delegator, selects approved tools, retrieves required data, performs business or technical logic, validates the outcome, handles execution failures, and returns a structured, traceable result for domain-level aggregation.

### Core formula

```text
Worker Agent
=
Receive
+ Validate
+ Authorize
+ Select Tool
+ Retrieve Data
+ Execute Logic
+ Validate Result
+ Handle Errors
+ Return Structured Result
+ Observe
```