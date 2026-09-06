# Understanding Focused Atomic Task Execution by Workers

In CWD, a Worker executes one focused atomic task with a clear contract. It does not manage the entire business workflow or decide which domain should handle the request.

> An atomic task is a small, independently executable unit of work with defined inputs, one clear responsibility, controlled execution, and a predictable output.

The Delegator coordinates multiple Workers; each Worker performs its assigned operation reliably.

## 1. What Makes a Worker Task Atomic?

A task is atomic when it can be described in one clear sentence and has a well-defined completion condition.

### Example

Good atomic task:

> Retrieve the last four quarters of revenue for customer `CUST-1001`.

Poor task:

> Prepare a complete customer briefing, identify opportunities, contact the customer, and update the CRM.

The second request contains multiple responsibilities and should be decomposed by the Delegator.

### Atomic task characteristics

* One primary objective
* Clearly defined inputs
* One specialized responsibility
* Limited tool access
* Explicit success criteria
* Predictable output
* Independent validation
* Controlled failure handling
* Traceable execution

## 2. Clear Inputs

The Worker should receive all information required to execute the task.

Typical inputs include:

| Input | Purpose |
| --- | --- |
| `task_id` | Identifies the individual task |
| `correlation_id` | Links execution to the overall request |
| `capability` | Identifies the required Worker capability |
| `objective` | Describes the expected operation |
| `parameters` | Contains business inputs |
| `context` | Provides only relevant execution context |
| `authorization` | Defines permitted access |
| `expected_output` | Specifies the required result structure |
| `timeout` | Limits execution duration |
| `priority` | Supports scheduling and workload handling |

### Example

```json
{
  "task_id": "task-204",
  "capability": "calculate_revenue_growth",
  "objective": "Calculate year-over-year revenue growth",
  "parameters": {
    "current_revenue": 1510000,
    "previous_revenue": 1200000
  },
  "expected_output": "revenue_growth_percentage",
  "correlation_id": "corr-789"
}
```

The Worker should not depend on hidden assumptions or retrieve unrelated context.

## 3. Defined Responsibilities

Each Worker should have a clear capability boundary.

### Example: Revenue Worker

Responsible for:

* Retrieving permitted revenue data
* Normalizing revenue values
* Calculating growth
* Validating the calculation
* Returning the result

Not responsible for:

* Selecting the Finance Delegator
* Deciding the overall customer briefing workflow
* Retrieving unrelated CRM opportunities
* Sending customer communications
* Aggregating results from other Workers

This separation prevents Workers from becoming monolithic agents.

## 4. Controlled Tool Access

A Worker should use only the tools required for its assigned capability.

### Tool access flow

```text
Task received
    ↓
Validate requested capability
    ↓
Check policy and authorization
    ↓
Select approved tool
    ↓
Execute through governed adapter
    ↓
Validate response
```

### Example

A Revenue Worker may be permitted to use:

```text
Revenue Worker
    └── Snowflake Revenue Adapter
```

It should not automatically have access to:

```text
Salesforce
Oracle
SharePoint
Email
CRM update APIs
```

unless those capabilities are explicitly approved.

### Important principle

> The Worker does not receive unrestricted system access. It receives controlled access to approved tools.

The LLM may recommend a tool, but the Worker runtime, registry, and policy controls determine whether that tool can be executed.

## 5. Deterministic Processing Where Possible

Workers should use deterministic logic whenever the task can be completed reliably without an LLM.

### Prefer deterministic processing for:

* Calculations
* Data filtering
* Sorting
* Aggregation
* Validation
* Date manipulation
* Rule evaluation
* Schema transformation
* Duplicate detection
* Threshold checks
* API request construction

### Example

Revenue growth should be calculated using application logic:

Growth % = ((Current Revenue − Previous Revenue) / Previous Revenue) × 100

```python
def calculate_growth(current_revenue: float, previous_revenue: float) -> float:
    if previous_revenue == 0:
        raise ValueError("Previous revenue cannot be zero")

    return round(
        ((current_revenue - previous_revenue) / previous_revenue) * 100,
        2
    )
```

For this task, an LLM is unnecessary. Deterministic processing provides:

* Consistent results
* Easier testing
* Better explainability
* Lower cost
* Lower latency
* Reduced hallucination risk

## 6. When an LLM May Be Used

An LLM may be introduced when the task requires interpretation rather than straightforward computation.

Examples include:

* Classifying a document
* Extracting fields from unstructured text
* Summarizing retrieved records
* Interpreting a natural-language description
* Mapping text to a controlled category

Even in these cases, the Worker should constrain the LLM with:

* A specific prompt
* A defined input schema
* A limited context window
* An expected output schema
* Validation rules
* Approved model configuration
* Fallback behavior

### Example

```text
Document Worker
    ↓
Retrieve approved document
    ↓
Extract contract renewal date using LLM
    ↓
Validate date format
    ↓
Return structured extraction result
```

The LLM performs interpretation; the Worker remains responsible for execution control and validation.

## 7. Data Retrieval

When the task requires enterprise data, the Worker retrieves only the necessary information.

### Responsibilities

* Select the approved data adapter
* Apply authorization filters
* Use parameterized queries or governed APIs
* Retrieve the minimum required data
* Handle pagination and rate limits
* Preserve source references
* Normalize the response
* Detect missing or incomplete data

### Example

```text
Customer ID
    ↓
Authorization check
    ↓
Salesforce adapter
    ↓
Retrieve permitted customer profile
    ↓
Normalize fields
    ↓
Return structured profile
```

The Worker should not directly access arbitrary databases or expose unrestricted source data to an LLM.

## 8. Business Logic Execution

The Worker performs the specific business or technical operation assigned by the Delegator.

### Example: Inventory Worker

```text
Input:
    product_id = P-1001
    location = Austin

Processing:
    1. Validate product and location
    2. Call approved inventory API
    3. Retrieve available quantity
    4. Apply inventory business rules
    5. Determine availability status

Output:
    available_quantity
    availability_status
```

The Worker should keep its business logic focused and testable.

## 9. Validation of Results

A Worker must verify that the result is valid before returning it.

### Validation layers

#### Schema validation

* Required fields exist.
* Data types are correct.
* Output matches the expected contract.

#### Business validation

* Calculations are correct.
* Values are within acceptable ranges.
* Business rules are satisfied.
* Data is complete enough for the task.

#### Source validation

* The source responded successfully.
* The response is not truncated.
* The data belongs to the requested entity.
* Source references are preserved.

#### Security validation

* The result is authorized for the requester.
* Restricted fields are removed or redacted.
* No credentials or secrets are included.

### Example

```text
Retrieved revenue data
    ↓
Check all requested quarters exist
    ↓
Check values are numeric
    ↓
Check currency is identified
    ↓
Calculate growth
    ↓
Validate calculation
    ↓
Return result
```

If validation fails, the Worker should return a controlled error or partial result rather than silently returning unreliable data.

## 10. Error Handling

Workers should handle local execution failures and return meaningful error information to the Delegator.

### Error categories

| Error type | Example | Expected behavior |
| --- | --- | --- |
| Validation error | Missing customer ID | Reject task |
| Authorization error | Access denied | Return controlled denial |
| Tool error | API failure | Retry if permitted |
| Timeout | Query exceeds limit | Stop or retry safely |
| Rate limit | API quota exceeded | Apply backoff |
| Data error | Missing required records | Return incomplete-data status |
| Business error | Product not found | Return business error |
| Model error | Invalid LLM output | Retry or use fallback |
| Dependency error | Service unavailable | Return dependency failure |

### Worker error response

```json
{
  "task_id": "task-204",
  "status": "failed",
  "error": {
    "code": "INVALID_INPUT",
    "message": "Previous revenue is required",
    "retryable": false
  },
  "correlation_id": "corr-789"
}
```

The Delegator can then decide whether to retry, use a fallback Worker, continue with partial results, or escalate the failure.

## 11. Structured Outputs

The Worker should return a machine-readable result that the Delegator can aggregate without interpreting free-form text.

### Successful result

```json
{
  "task_id": "task-204",
  "worker_id": "revenue-worker",
  "status": "completed",
  "result": {
    "customer_id": "CUST-1001",
    "current_revenue": 1510000,
    "previous_revenue": 1200000,
    "growth_percentage": 25.83,
    "currency": "USD"
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

### Why structured output matters

It enables the Delegator to:

* Correlate results with tasks
* Detect success or failure
* Aggregate multiple Worker results
* Validate completeness
* Preserve provenance
* Handle partial failures
* Avoid parsing unpredictable natural-language responses

## 12. Worker Execution Contract

A Worker can be understood through the following contract:

```text
Input:
    Authorized, well-defined task

Execution:
    Validate
    → Select approved tool
    → Retrieve required data
    → Execute specialized logic
    → Validate result

Output:
    Structured success, partial result, or failure
```

### Contract example

```python
class Worker:
    async def execute(self, task: WorkerTask) -> WorkerResult:
        self.validate_task(task)
        self.authorize(task)

        tool = self.select_approved_tool(task)
        raw_data = await tool.execute(task.parameters)

        result = self.process(raw_data)
        self.validate_result(result)

        return WorkerResult(
            task_id=task.task_id,
            status="completed",
            result=result
        )
```

This is a conceptual contract. In production CWD, the actual implementation may use LangGraph, MCP adapters, A2A interfaces, messaging, policy services, and Azure-hosted runtimes.

## 13. Example: Customer Briefing

The Customer Briefing Delegator may create these atomic tasks:

```text
Customer Briefing Delegator
        │
        ├── Profile Worker
        │     └── Retrieve customer profile
        │
        ├── Revenue Worker
        │     └── Calculate revenue growth
        │
        ├── Opportunity Worker
        │     └── Retrieve open opportunities
        │
        └── Interaction Worker
              └── Retrieve recent customer interactions
```

Each Worker independently:

1. Receives a focused task.
2. Validates its inputs.
3. Checks authorization.
4. Selects approved tools.
5. Retrieves required data.
6. Executes its specialized logic.
7. Validates the result.
8. Returns a structured response.

The Delegator then combines the results into a domain-level customer briefing.

## 14. Worker vs. Delegator

| Area | Delegator | Worker |
| --- | --- | --- |
| Scope | Domain-level orchestration | Single specialized task |
| Main question | "How should this domain task be completed?" | "How do I execute this assigned operation?" |
| Task decomposition | Yes | No |
| Worker selection | Yes | No |
| Tool selection | Governs capability routing | Selects approved execution tool |
| Data retrieval | Coordinates | Performs required retrieval |
| Business logic | Coordinates domain flow | Executes focused logic |
| Result aggregation | Yes | No |
| Error recovery | Coordinates across Workers | Handles local failures |
| Output | Domain-level result | Task-level structured result |

## Final Definition

> A Worker executes a focused atomic task by accepting clear inputs, performing one defined responsibility, accessing only approved tools and data, using deterministic processing wherever possible, validating its execution, handling failures safely, and returning a structured result to the Delegator.

### Core formula

```text
Worker Execution
=
Clear Inputs
+ Defined Responsibility
+ Controlled Tool Access
+ Data Retrieval
+ Deterministic Processing
+ Business Logic
+ Validation
+ Error Handling
+ Structured Output
+ Traceability
```