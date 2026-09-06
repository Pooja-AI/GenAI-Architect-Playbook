Markdown

````
# Coordinator Responsibilities in CWD

The **Coordinator** is the enterprise-level control component of CWD. Its responsibility is to understand a business request, determine how it should be fulfilled, coordinate the required agents, and return a governed result.

The Coordinator does not perform every business operation itself. It manages the execution of the overall workflow.

## 1. Understand the User Request

The Coordinator receives a request from Teams, React, or another approved channel.

### Example

```text
"Create a customer briefing for customer ABC"
````

The Coordinator identifies:

* What the user wants.

* Which business domain is involved.

* Whether the request requires one or multiple agents.

* Whether additional information or clarification is needed.

### Responsibility

```
User Request
    ↓
Understand Intent
    ↓
Identify Business Domain
```

The LLM may assist with understanding the request, but the Coordinator owns the orchestration decision.

## 2. Classify the Request

The Coordinator determines the business domain and request type.

### Example

```
Request: Create a customer briefing

Domain: Sales
Intent: Customer briefing
```

Other examples:

|
User request

|

Domain

|

Intent

|
| --- | --- | --- |
|

Create a customer briefing

|

Sales

|

Customer briefing

|
|

Explain a financial variance

|

Finance

|

Financial analysis

|
|

Check an employee policy

|

HR

|

Policy information

|
|

Analyze supply demand

|

Supply Chain

|

Demand analysis

|
|

Summarize a business report

|

Business Analysis

|

Report summarization

|

### Responsibility

```
Request
    ↓
Intent Classification
    ↓
Domain Identification
```

The classification determines which Delegator should handle the request.

## 3. Validate the Request

Before execution, the Coordinator validates the request.

### Validation includes

* Required user identity.

* Valid session.

* Non-empty request.

* Valid request structure.

* Supported domain or intent.

* Required input information.

* Request size and format.

* Correlation and execution identifiers.

### Example

```
User ID: Required
Session ID: Required
Message: Required
Correlation ID: Generated if missing
```

### Responsibility

```
Validate Request
    ↓
Continue only if valid
```

Invalid requests should be rejected or returned for clarification rather than sent to downstream agents.

## 4. Enforce Authorization and Governance

The Coordinator ensures that the workflow is authorized before execution.

### Example

```
User
    ↓
Coordinator
    ↓
Is the user authorized for Sales data?
    ↓
Yes → Continue
No  → Reject
```

Authorization may involve:

* User identity.

* User roles.

* Business domain.

* Data entitlements.

* Requested operation.

* Data classification.

* Approval requirements.

* Policy restrictions.

The Coordinator should not assume that a user is authorized merely because the request reached the API.

### Important principle

```
Authentication = Who is the user?

Authorization = What is the user allowed to do?
```

The Coordinator enforces the workflow-level authorization boundary. Delegators, Workers, and enterprise systems must still enforce their own access controls.

## 5. Create the Execution Plan

The Coordinator determines the high-level steps required to fulfill the request.

### Example

```
Request:
Create a customer briefing
```

### Execution plan

```
1. Retrieve customer information
2. Retrieve sales opportunity information
3. Retrieve recent interactions
4. Generate customer briefing
```

The Coordinator decides:

* Which tasks are required.

* Which tasks can run in parallel.

* Which tasks depend on earlier results.

* Which Delegator should execute the workflow.

* Whether the request is synchronous or asynchronous.

### Responsibility

```
Understand
    ↓
Plan
    ↓
Execute
```

The Coordinator creates the high-level plan. The Delegator creates the detailed domain-specific Worker plan.

## 6. Discover the Appropriate Delegator

The Coordinator uses the Agent Registry to identify the appropriate Delegator.

### Example

```
Intent: Customer briefing
Domain: Sales
    ↓
Agent Registry
    ↓
Sales Delegator
```

The Coordinator should not hard-code every Delegator endpoint.

### Registry information may include

* Agent ID.

* Agent type.

* Business domain.

* Capabilities.

* Endpoint.

* Health status.

* Supported task types.

* Version metadata.

* Availability.

### Responsibility

```
Request
    ↓
Agent Registry
    ↓
Select Healthy and Authorized Delegator
```

This allows new domain agents to be added without changing the Coordinator's core routing logic.

## 7. Route the Task Through A2A

This is one of the most important Coordinator responsibilities.

The Coordinator sends the planned task to the selected Delegator using A2A.

### Example

```
Coordinator
    |
    | A2A Task
    v
Sales Delegator
```

The Coordinator sends:

* Task type.

* User instruction.

* Execution plan.

* Session context.

* Task ID.

* Run ID.

* Correlation ID.

* User identity and relevant authorization context.

* Required metadata.

### Example A2A task

JSON

```
{
  "task_type": "customer_briefing",
  "instruction": "Create a customer briefing for customer ABC",
  "target_agent": "sales-delegator",
  "context": {
    "session_id": "session-123",
    "task_id": "task-456",
    "run_id": "run-789",
    "correlation_id": "corr-001"
  }
}
```

### Responsibility

```
Coordinator
    ↓
A2A
    ↓
Delegator
```

A2A is the communication mechanism. The Coordinator remains responsible for deciding what task should be sent.

## 8. Coordinate Multiple Agents

The Coordinator manages workflows that require multiple Delegators or agent results.

### Example

```
User:
"Prepare a customer briefing with sales, finance, and support information."
```

### Coordinator workflow

```
                    Coordinator
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
    Sales Delegator  Finance Delegator  Support Delegator
          |              |              |
          v              v              v
       Results        Results        Results
          |              |              |
          +--------------+--------------+
                         |
                         v
                  Coordinator
                         |
                         v
                  Final Briefing
```

The Coordinator may execute independent tasks in parallel and wait for the required results.

### Responsibility

* Coordinate multiple Delegators.

* Track task completion.

* Manage dependencies.

* Correlate results.

* Handle partial failures.

* Decide whether the workflow can continue.

## 9. Manage Context and State

The Coordinator maintains the execution context throughout the workflow.

### Context hierarchy

```
Session
    ↓
Task
    ↓
Run
    ↓
Turn
    ↓
Step
```

### Example

```
Session: Entire conversation
Task: Create customer briefing
Run: One execution attempt
Turn: Current user request
Step: Retrieve customer profile
```

The Coordinator propagates the required context to downstream agents.

### Responsibility

```
User Request
    ↓
Coordinator Context
    ↓
A2A Context
    ↓
Delegator Context
    ↓
Worker Context
```

This enables:

* End-to-end tracing.

* Session continuity.

* Task tracking.

* Result correlation.

* Auditability.

* Failure recovery.

## 10. Manage Execution Status

The Coordinator tracks the status of the workflow.

### Example statuses

```
received
validated
authorized
planning
routed
working
completed
failed
requires_approval
requires_clarification
```

### Example

```
Request Received
    ↓
Planning
    ↓
A2A Task Submitted
    ↓
Working
    ↓
Completed
```

For long-running workflows, the Coordinator may return:

```
"Your request is being processed."
```

The result can be delivered later through the approved asynchronous communication mechanism.

## 11. Handle Errors and Recovery

The Coordinator is responsible for workflow-level error handling.

### Example failure

```
Coordinator
    ↓
Sales Delegator
    ↓
Customer Profile Worker
    ↓
Salesforce API
    ↓
Failure
```

The Coordinator determines whether to:

* Retry the task.

* Route to another healthy agent.

* Continue with partial results.

* Request clarification.

* Request approval.

* Return a controlled failure.

* Escalate the issue.

### Example

```
Salesforce unavailable
    ↓
Retry according to policy
    ↓
If still unavailable
    ↓
Return controlled error
```

The Coordinator should not blindly retry every failure. Retry behavior must respect timeout, idempotency, and business impact.

## 12. Aggregate Results

The Coordinator combines results received from Delegators.

### Example

```
Sales Result
    +
Finance Result
    +
Support Result
    ↓
Coordinator
    ↓
Combined Business Context
```

The Coordinator may use an LLM to synthesize the final response, but it must not invent missing enterprise information.

### Responsibility

* Validate result completeness.

* Identify failed or missing tasks.

* Combine successful results.

* Preserve source and task context.

* Apply response governance.

* Generate the final user-facing answer.

## 13. Apply Final Response Governance

Before returning the result, the Coordinator applies the required response controls.

### Example

```
Delegator Results
    ↓
Coordinator
    ↓
Response Validation
    ↓
DLP / Redaction / Policy Check
    ↓
User Response
```

This may include:

* Sensitive-data filtering.

* Output validation.

* Restricted-content handling.

* Approval enforcement.

* Response formatting.

* Audit logging.

The Coordinator should not expose raw internal errors, unrestricted tool output, or unauthorized data to the user.

## 14. Persist Execution State

The Coordinator saves the relevant session and workflow state.

### Example

```
Coordinator
    |
    +--> Redis
    |
    +--> Execution State
    |
    +--> Session Context
    |
    +--> Task Status
```

Redis is suitable for short-term active workflow state. Long-term knowledge retrieval and semantic memory belong in the approved RAG and vector-storage layers.

### Responsibility

* Save session state.

* Save task status.

* Preserve correlation identifiers.

* Support continuation of long-running workflows.

* Support recovery where applicable.

## 15. Provide Observability

The Coordinator must make the entire workflow traceable.

### Example

```
Request
    ↓
Coordinator
    ↓
A2A
    ↓
Delegator
    ↓
Worker
    ↓
Enterprise System
```

Every stage should be correlated using identifiers such as:

```
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

### Metrics may include

* Request count.

* Workflow latency.

* A2A latency.

* Task success rate.

* Failure rate.

* Retry count.

* Token usage.

* Model cost.

* Tool execution time.

* Agent availability.

* Partial-result rate.

### Responsibility

```
Coordinator
    ↓
MLflow3 / App Insights / Log Analytics
```

The Coordinator should emit structured logs and traces without exposing restricted data.

## 16. Manage Long-Running Workflows

Not every enterprise request completes immediately.

### Example

```
User:
"Generate a large customer briefing using multiple enterprise systems."
```

The Coordinator may:

```
1. Validate request.
2. Create task.
3. Submit A2A task.
4. Return working status.
5. Track task execution.
6. Receive completion event.
7. Aggregate results.
8. Notify the user.
```

### Responsibility

```
Submit Task
    ↓
Track Task
    ↓
Receive Result
    ↓
Return Final Response
```

This is where A2A, Service Bus, and event-driven execution become important.

## 17. Maintain Separation of Responsibilities

The Coordinator should not become a monolithic business application.

|
Component

|

Responsibility

|
| --- | --- |
|

Coordinator

|

Enterprise workflow orchestration

|
|

Delegator

|

Domain workflow orchestration

|
|

Worker

|

Specialized business execution

|
|

LLM

|

Reasoning and decision support

|
|

A2A

|

Agent-to-agent communication

|
|

MCP

|

Governed tool and data access

|
|

Agent Registry

|

Agent discovery

|
|

Prompt Registry

|

Prompt lifecycle

|
|

Redis

|

Short-term state

|
|

Azure AI Search

|

Knowledge retrieval

|
|

Policy Service

|

Authorization and governance

|
|

Observability

|

Tracing and monitoring

|

### Example

```
Coordinator
    |
    | "Which agent should handle this?"
    v
Agent Registry
    |
    | "Sales Delegator"
    v
A2A
    |
    v
Sales Delegator
    |
    | "Which Workers are needed?"
    v
Workers
    |
    | "Execute approved operations"
    v
MCP / Enterprise APIs
```

## 18. Complete Responsibility Flow

```
1. Receive user request
        ↓
2. Validate request
        ↓
3. Authenticate / verify context
        ↓
4. Classify intent and domain
        ↓
5. Check authorization
        ↓
6. Create execution plan
        ↓
7. Discover Delegator
        ↓
8. Submit A2A task
        ↓
9. Coordinate execution
        ↓
10. Track task status
        ↓
11. Handle errors and retries
        ↓
12. Receive Delegator results
        ↓
13. Aggregate results
        ↓
14. Apply response governance
        ↓
15. Persist execution state
        ↓
16. Emit observability
        ↓
17. Return final response
```

## 19. Coordinator vs Delegator vs Worker

|
Responsibility

|

Coordinator

|

Delegator

|

Worker

|
| --- | --- | --- | --- |
|

Understand enterprise request

|

Yes

|

Domain-specific

|

No

|
|

Identify business domain

|

Yes

|

Within domain

|

No

|
|

Create high-level plan

|

Yes

|

No

|

No

|
|

Create domain task plan

|

No

|

Yes

|

No

|
|

Discover Delegator

|

Yes

|

No

|

No

|
|

Select Workers

|

No

|

Yes

|

No

|
|

Communicate through A2A

|

Yes

|

Yes

|

Yes, when applicable

|
|

Execute business operation

|

No

|

Coordinates

|

Yes

|
|

Access enterprise tools

|

No

|

Through Workers

|

Through approved tools

|
|

Aggregate domain results

|

No

|

Yes

|

No

|
|

Aggregate enterprise results

|

Yes

|

No

|

No

|
|

Manage overall workflow

|

Yes

|

Domain workflow

|

Task execution

|
|

Return final user response

|

Yes

|

No

|

No

|

## 20. Final Definition

```
Coordinator =
    Understand
    + Validate
    + Authorize
    + Classify
    + Plan
    + Discover
    + Route
    + Coordinate
    + Track
    + Recover
    + Aggregate
    + Govern
    + Observe
```

In CWD, the Coordinator is the enterprise control plane that makes multiple specialized agents operate as one coherent business system. It decides what needs to happen, sends tasks through A2A, manages execution, and returns a governed result—while Delegators and Workers perform the domain-specific operations.


### Responsibility mapped to the Coordinator code

|
Responsibility

|

Method in the implementation

|
| --- | --- |
|

Validate request

|

`validate_request()`

|
|

Classify intent

|

`classify_request()`

|
|

Enforce authorization

|

`authorize_request()`

|
|

Discover Delegator

|

`discover_delegator()`

|
|

Create execution plan

|

`create_plan()`

|
|

Send A2A task

|

`submit_a2a_task()`

|
|

Aggregate results

|

`aggregate_result()`

|
|

Persist state

|

`save_state()`

|
|

Execute complete workflow

|

`run()`

|

The LangGraph workflow connects these methods in the correct order:

```
validate_request
      ↓
classify_request
      ↓
authorize_request
      ↓
discover_delegator
      ↓
create_plan
      ↓
submit_a2a_task
      ↓
aggregate_result
      ↓
save_state
```

This is the core Coordinator responsibility flow for CWD.
