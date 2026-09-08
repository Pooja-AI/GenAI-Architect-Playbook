## 1. What Application Insights does

Application Insights is Azure Monitor’s application performance monitoring capability. It collects application telemetry and stores it in the Azure Monitor data platform, commonly through a Log Analytics workspace. It helps teams diagnose failures, investigate slow transactions, understand dependencies, and monitor application behavior.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

For CWD, this means observing the operational behavior of:

```
User Request
    ↓
Gateway
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ├── LLM
    ├── RAG / Azure AI Search
    ├── MCP / API
    ├── Cosmos DB
    ├── Redis
    └── Service Bus
```

The goal is to answer:

> Is the service healthy, where did the request spend time, what failed, and which dependency caused the problem?


# 2. Application Insights in the CWD observability architecture

```
CWD Services
   ├── Gateway
   ├── Coordinator
   ├── Delegators
   ├── Workers
   └── MCP / RAG Services
          │
          ▼
   OpenTelemetry / SDK
          │
          ▼
   Application Insights
          │
          ▼
   Azure Monitor + Log Analytics
          │
     ┌────┼─────────────┐
     ▼    ▼             ▼
 Dashboards Alerts   Transaction
                     Diagnostics
```

Application Insights collects requests, dependencies, exceptions, traces, metrics, and other telemetry. The Azure Monitor OpenTelemetry Distro is a recommended instrumentation path for supported applications, while custom instrumentation can capture CWD-specific operations.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

# 3. Requests: tracking incoming operations

A request represents an operation received by an application, such as an HTTP API call.

In CWD, examples include:

```
POST /api/chat
POST /api/workflows
POST /api/tasks
GET  /api/health
```

For example:

```
User
  ↓
POST /api/chat
  ↓
Coordinator
```

Application Insights request telemetry can capture:

|
Field

|

Example

|
| --- | --- |
|

Request name

|

`POST /api/chat`

|
|

Operation ID

|

`operation-123`

|
|

Duration

|

`4200 ms`

|
|

Result code

|

`200`

|
|

Success

|

`true`

|
|

Cloud role

|

`cwd-coordinator`

|
|

Cloud role instance

|

`coordinator-pod-3`

|
|

Timestamp

|

Request start time

|

Request telemetry includes operation identity, duration, and success or failure information.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

### CWD example

JSON

```
{
  "request_name": "POST /api/chat",
  "service": "cwd-coordinator",
  "operation_id": "operation-123",
  "duration_ms": 4200,
  "result_code": 200,
  "success": true
}
```

This answers:

> How many requests arrived, how long did they take, and how many succeeded?

# 4. Dependencies: tracking downstream calls

A dependency is something a CWD service calls to complete its work.

Examples:

```
Coordinator → Delegator
Worker → Azure OpenAI
Worker → Azure AI Search
Worker → MCP Server
Worker → Cosmos DB
Worker → Redis
Worker → Service Bus
```

Application Insights dependency tracking measures dependency duration, success or failure, and dependency information such as the target name. It can correlate dependency calls with requests and exceptions.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

### Example

```
Request: POST /api/chat
    │
    ├── Dependency: shipping-delegator
    ├── Dependency: Azure AI Search
    ├── Dependency: shipping-mcp
    └── Dependency: Azure OpenAI
```

A dependency record might contain:

JSON

```
{
  "dependency_type": "HTTP",
  "target": "shipping-mcp",
  "name": "get_tracking_events",
  "duration_ms": 1240,
  "result_code": 200,
  "success": true
}
```

This helps answer:

> Is the Coordinator slow, or is the downstream MCP service slow?

# 5. Exceptions: tracking failures

Application Insights captures exception telemetry, including error information useful for troubleshooting. Exception records can be associated with the operation in which they occurred.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

CWD exceptions may occur in:

```
Gateway
   ├── Invalid request
   ├── Authentication failure
   └── Rate limit

Coordinator
   ├── Planning failure
   ├── Agent discovery failure
   └── Authorization rejection

Delegator
   ├── Worker unavailable
   ├── Aggregation failure
   └── Dependency timeout

Worker
   ├── Tool failure
   ├── RAG failure
   ├── LLM timeout
   └── Output validation failure
```

Example:

JSON

```
{
  "exception_type": "TimeoutError",
  "message": "Azure AI Search request timed out",
  "operation_id": "operation-123",
  "service": "cwd-rag-worker",
  "step_id": "STEP-003"
}
```

The important distinction is:

> An exception is an error signal; the surrounding request, dependency, and operation context explains its impact.

# 6. Performance: measuring service behavior

Application Insights provides performance views and metrics for investigating slow operations and application bottlenecks.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

For CWD, performance telemetry should include:

|
Performance area

|

Example

|
| --- | --- |
|

Request duration

|

Coordinator API took 4.2 seconds

|
|

Dependency duration

|

MCP call took 1.2 seconds

|
|

LLM duration

|

Model invocation took 2.1 seconds

|
|

RAG duration

|

Search and reranking took 0.8 seconds

|
|

Queue wait

|

Task waited 500 ms

|
|

Exception rate

|

Worker errors increased

|
|

Request rate

|

100 requests/sec

|
|

Memory

|

Worker memory usage

|
|

CPU

|

Process CPU utilization

|

Application Insights metrics include request rate, request duration, dependency duration, dependency failures, exceptions, and performance counters.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

### CWD latency breakdown

```
T_E2E
  =
  T_Gateway
  + T_Coordinator
  + T_Delegator
  + T_CriticalPath
  + T_Aggregation
  + T_Response
```

Application Insights helps identify where the time was spent, while CWD-specific telemetry should explain the business execution path.

# 7. Availability: is the service reachable?

Availability monitoring checks whether an application is responding and whether its response time is acceptable.

Application Insights availability tests send requests at regular intervals and can monitor uptime and responsiveness from different locations.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

For CWD, availability checks may include:

```
Coordinator /health
Delegator /health
Worker /health
MCP Server /health
RAG Service /health
```

Example:

```
Availability Test
    ↓
POST /api/health
    ↓
Coordinator
    ↓
HTTP 200
    ↓
Available
```

However:

> A healthy HTTP endpoint does not necessarily mean the agent is ready to execute business work.

CWD should distinguish:

```
Liveness  = Is the process alive?
Readiness = Can it accept work?
Availability = Can it serve work now?
Health = Is it functioning correctly?
```

A Worker may be alive but not ready because its LLM or MCP dependency is unavailable.

# 8. Distributed operations: connecting the execution graph

This is one of the most important capabilities for CWD.

A single request may cross multiple services:

```
User
  ↓
Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP
  ↓
Enterprise API
  ↓
Worker
  ↓
Delegator
  ↓
Coordinator
  ↓
User
```

Application Insights transaction diagnostics can show an end-to-end operation timeline containing requests, dependencies, exceptions, and calls across components.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

### Example trace

```
operation-123
│
├── Gateway request                  100 ms
├── Coordinator request             300 ms
├── Delegator dependency            200 ms
├── Worker request                3,000 ms
│   ├── Azure AI Search             800 ms
│   ├── MCP dependency            1,200 ms
│   └── LLM dependency            2,100 ms
└── Response generation             600 ms
```

This allows an engineer to see the critical path instead of looking at isolated service logs.

# 9. Application Insights and CWD correlation IDs

Application Insights provides operation correlation through its telemetry model. CWD should also propagate its own business identifiers.

```
correlation_id = CORR-7890
workflow_id    = WF-1001
task_id        = WT-1001
run_id         = RUN-003
step_id        = STEP-004
```

Example telemetry:

JSON

```
{
  "operation_id": "operation-123",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",
  "agent_id": "tracking-worker",
  "step_type": "tool_execution"
}
```

### Why both?

|
Identifier

|

Purpose

|
| --- | --- |
|

Application Insights operation ID

|

Technical distributed operation correlation

|
|

CWD correlation ID

|

End-to-end business request

|
|

Turn ID

|

Conversational interaction

|
|

Workflow ID

|

Workflow execution

|
|

Task ID

|

Logical objective

|
|

Run ID

|

Execution attempt

|
|

Step ID

|

Individual operation

|

The result is:

```
Technical Trace
      +
CWD Business Lineage
      =
End-to-End Explainability
```

# 10. Service-level health

Application Insights helps monitor the health of individual applications and dependencies. CWD should combine that telemetry with service-level indicators that reflect whether each agent is capable of performing its responsibility.

### Coordinator health

```
Request success rate
P95 latency
Planning failures
Authorization failures
Delegation failures
Active workflows
```

### Delegator health

```
Task success rate
Worker selection failures
Queue wait time
Aggregation failures
Retry rate
Partial-result rate
```

### Worker health

```
Task success rate
Tool success rate
LLM latency
RAG latency
Dependency failures
Concurrency
Capacity
```

### Platform health

```
Service Bus queue depth
Cosmos DB throttling
Redis latency
Azure AI Search failures
LLM rate limits
MCP availability
```

Application Insights can collect application and dependency telemetry, while CWD-specific custom metrics should capture domain-level health and execution outcomes.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

# 11. Custom CWD telemetry

Standard request and dependency telemetry is not enough to understand agentic execution.

CWD should emit custom events and metrics for operations such as:

```
AGENT_SELECTED
WORKFLOW_STARTED
TASK_CREATED
STEP_STARTED
STEP_COMPLETED
TOOL_EXECUTED
RAG_RETRIEVED
LLM_INVOKED
APPROVAL_REQUESTED
WORKFLOW_COMPLETED
```

Application Insights supports custom events and custom metrics through instrumentation.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

Example:

JSON

```
{
  "event_name": "CWD_STEP_COMPLETED",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",
  "agent_id": "tracking-worker",
  "step_type": "tool_execution",
  "status": "completed",
  "duration_ms": 1240
}
```

This is how CWD-specific execution becomes visible in Application Insights.

# 12. Application Insights and LangGraph

LangGraph controls workflow state and transitions:

```
Planning
   ↓
Delegation
   ↓
Retrieval
   ↓
Tool Execution
   ↓
Validation
   ↓
Aggregation
```

Application Insights records the operational evidence:

```
LangGraph Step
      ↓
Telemetry Event
      ↓
Application Insights
      ↓
Latency / Errors / Dependencies / Trace
```

For example:

```
LangGraph:
STEP-004 → Tool Execution → Failed

Application Insights:
MCP dependency → TimeoutError → 5,000 ms
```

### Separation

```
LangGraph = What happens next?
Application Insights = What happened during execution?
```

Application Insights does not replace LangGraph checkpointing or workflow state.

# 13. Application Insights and Azure Service Bus

Service Bus handles durable asynchronous task delivery.

```
Coordinator
    ↓
Service Bus
    ↓
Delegator
    ↓
Worker
```

Application Insights can help monitor the application-side processing around that messaging flow.

Useful CWD telemetry includes:

```
message_id
correlation_id
workflow_id
task_id
source_agent
target_agent
queue_name
delivery_count
processing_duration
status
```

Example:

JSON

```
{
  "event_name": "TASK_MESSAGE_PROCESSED",
  "queue_name": "shipping-tasks",
  "message_id": "MSG-1001",
  "correlation_id": "CORR-7890",
  "task_id": "WT-1001",
  "status": "completed",
  "processing_duration_ms": 2400
}
```

Application Insights is useful for application processing telemetry; Service Bus remains the messaging system of record for delivery semantics.

# 14. Application Insights and MCP tools

A Worker may call an MCP tool:

```
Worker
   ↓
MCP Client
   ↓
MCP Server
   ↓
Enterprise API
```

Application Insights can capture the application-side dependency operation.

Recommended custom fields:

```
mcp_server
tool_name
tool_call_id
agent_id
task_id
step_id
authorization_decision
result_status
duration_ms
retry_count
```

Example:

JSON

```
{
  "event_name": "MCP_TOOL_COMPLETED",
  "mcp_server": "shipping-mcp",
  "tool_name": "get_tracking_events",
  "tool_call_id": "TOOL-001",
  "step_id": "STEP-004",
  "status": "success",
  "duration_ms": 1240
}
```

This helps distinguish:

```
Tool selection failure
Argument validation failure
Authorization rejection
MCP transport failure
Backend API failure
Result validation failure
```

An HTTP 200 response alone does not prove business success.

# 15. Application Insights and RAG

For a RAG Worker, Application Insights can capture retrieval-related telemetry.

```
User Query
    ↓
Query Transformation
    ↓
Embedding
    ↓
Azure AI Search
    ↓
Security Filtering
    ↓
Reranking
    ↓
Context Construction
    ↓
LLM
```

Useful fields:

```
retrieval_mode
top_k
candidate_count
authorized_count
selected_count
reranking_enabled
context_size
retrieval_duration_ms
```

Example:

JSON

```
{
  "event_name": "RAG_RETRIEVAL_COMPLETED",
  "step_id": "STEP-003",
  "retrieval_mode": "hybrid",
  "candidate_count": 30,
  "authorized_count": 12,
  "selected_count": 5,
  "duration_ms": 800
}
```

This helps answer:

> Was the final answer slow because of the LLM, or because retrieval and context construction were slow?

Do not log unrestricted confidential document content or full sensitive prompts merely for troubleshooting.

# 16. Application Insights and LLM telemetry

CWD should capture model-related metadata such as:

```
model_name
model_version
prompt_id
prompt_version
input_tokens
output_tokens
time_to_first_token
total_duration
finish_reason
cost
```

Example:

JSON

```
{
  "event_name": "LLM_INVOCATION_COMPLETED",
  "step_id": "STEP-005",
  "model": "approved-model-v4",
  "prompt_id": "shipment-delay-analysis",
  "prompt_version": "2.2.0",
  "input_tokens": 1850,
  "output_tokens": 420,
  "duration_ms": 2100,
  "status": "completed"
}
```

This supports:

* LLM latency analysis

* Token usage

* Cost attribution

* Model comparison

* Prompt regression analysis

* Timeout investigation.

Application Insights has generative AI telemetry support in its current telemetry model, while custom CWD instrumentation can capture additional agent-specific fields.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

# 17. Application Insights and reliability metrics

CWD should calculate service-level reliability metrics from telemetry.

### Request success rate

Request Success Rate=Successful RequestsTotal Requests×100\text{Request Success Rate} = \frac{\text{Successful Requests}} {\text{Total Requests}} \times 100Request Success Rate=Total RequestsSuccessful Requests×100

### Dependency success rate

Dependency Success Rate=Successful Dependency CallsTotal Dependency Calls×100\text{Dependency Success Rate} = \frac{\text{Successful Dependency Calls}} {\text{Total Dependency Calls}} \times 100Dependency Success Rate=Total Dependency CallsSuccessful Dependency Calls×100

### Step success rate

Step Success Rate=Completed StepsTotal Step Attempts×100\text{Step Success Rate} = \frac{\text{Completed Steps}} {\text{Total Step Attempts}} \times 100Step Success Rate=Total Step AttemptsCompleted Steps×100

### Workflow success rate

Workflow Success Rate=Successful WorkflowsTotal Workflows×100\text{Workflow Success Rate} = \frac{\text{Successful Workflows}} {\text{Total Workflows}} \times 100Workflow Success Rate=Total WorkflowsSuccessful Workflows×100

Application Insights provides request and dependency failure metrics; CWD should add custom workflow and step metrics because business success is not equivalent to HTTP success.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

# 18. Application Insights and latency analysis

For CWD, latency should be measured at multiple levels:

```
Step Latency
    ↓
Agent Latency
    ↓
Task Latency
    ↓
Workflow Latency
    ↓
End-to-End Latency
```

Example:

```
STEP-001 Planning             300 ms
STEP-002 Delegation           200 ms
STEP-003 Retrieval            800 ms
STEP-004 Tool Execution     1,240 ms
STEP-005 LLM Invocation     2,100 ms
STEP-006 Validation           100 ms
STEP-007 Aggregation          200 ms
```

Application Insights performance views and transaction diagnostics help identify slow operations and their dependencies.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

For production SLAs, use:

```
P50
P95
P99
```

rather than relying only on average latency.

# 19. Application Insights and exception analysis

Suppose a workflow fails:

```
TURN-002
   ↓
WF-1001
   ↓
STEP-004
   ↓
MCP Timeout
   ↓
Worker Exception
   ↓
Delegator Failure
   ↓
Coordinator Response
```

Application Insights can help investigate:

```
Failed Request
    ↓
Related Exception
    ↓
Failed Dependency
    ↓
End-to-End Transaction
```

The transaction diagnostics experience supports drilling into problematic operations and viewing related dependencies and exceptions.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

This helps determine whether the root cause was:

* A downstream API timeout

* An MCP failure

* A Worker exception

* A queue delay

* An LLM failure

* A validation failure

* An authorization rejection.

# 20. Application Insights and dashboards

A CWD platform should create dashboards at different levels.

### Executive dashboard

```
Workflow Success Rate
P95 End-to-End Latency
Cost per Successful Workflow
Groundedness
Security Violations
```

### Operations dashboard

```
Request Rate
Failed Requests
Dependency Failures
Exceptions
P95/P99 Latency
Queue Depth
Worker Availability
```

### Agent dashboard

```
Coordinator Success
Delegator Success
Worker Success
Routing Failures
Tool Success
RAG Latency
LLM Latency
```

### Infrastructure dashboard

```
CPU
Memory
Restarts
Cosmos Throttling
Redis Latency
Service Bus Queue Age
Azure AI Search Latency
```

Application Insights and Azure Monitor provide the underlying telemetry and monitoring capabilities; CWD-specific dashboards should combine operational metrics with business execution metrics.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

# 21. Application Insights and alerts

Alerts should be actionable rather than simply reporting every error.

Examples:

```
Coordinator P95 latency > SLA
Worker failure rate > threshold
Service Bus queue age > threshold
MCP dependency timeout spike
LLM rate-limit errors increasing
Cosmos throttling detected
Redis memory pressure
Availability test failure
```

For example:

```
Alert:
"Shipping Worker P95 latency exceeded 5 seconds."

Investigation:
    ↓
Application Insights
    ↓
Dependency duration
    ↓
MCP call latency
    ↓
Root cause identified
```

Azure Monitor can use Application Insights telemetry for monitoring and alerting.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn

# 22. Application Insights and security

Application Insights is not an authorization engine. It observes application behavior.

CWD security decisions should still be enforced by:

```
Entra ID
Policy / IAM
RBAC
ACLs
DLP
MCP authorization
Network controls
```

Application Insights can record security-related telemetry such as:

```
Authentication failure
Authorization denial
Unauthorized tool attempt
DLP violation
Cross-tenant access attempt
Prompt injection detection
```

Example:

JSON

```
{
  "event_name": "AUTHORIZATION_DENIED",
  "correlation_id": "CORR-7890",
  "agent_id": "tracking-worker",
  "tool_name": "submit_reroute_request",
  "policy_id": "SHIP-WRITE-001",
  "decision": "DENY"
}
```

Avoid logging passwords, access tokens, secrets, full confidential prompts, or unrestricted sensitive tool results.

# 23. Application Insights and auditability

Application Insights provides operational telemetry, but it should not automatically be treated as the authoritative audit store.

|
Concern

|

Primary system

|
| --- | --- |
|

Runtime traces

|

Application Insights / OpenTelemetry

|
|

Application errors

|

Application Insights

|
|

Performance

|

Application Insights

|
|

Service health

|

Azure Monitor

|
|

Workflow state

|

LangGraph + durable state store

|
|

Business audit evidence

|

Governed audit store

|
|

Model experiments

|

MLflow

|
|

Messaging delivery

|

Service Bus

|
|

Agent discovery

|

Agent Registry

|

### Key distinction

```
Application Insights = What happened operationally?
Audit Store          = What governed action occurred?
MLflow               = How did the AI configuration perform?
```

# 24. Application Insights and MLflow

These two systems complement each other.

```
CWD Runtime
   │
   ├── Application Insights
   │      └── Requests, dependencies, errors, latency
   │
   └── MLflow
          └── Parameters, metrics, artifacts, evaluations
```

Example:

```
Application Insights:
"LLM invocation took 2.1 seconds."

MLflow:
"Prompt v2.2.0 achieved groundedness 0.93
with P95 latency of 3.8 seconds."
```

Application Insights explains production execution; MLflow compares AI and ML configurations.

# 25. Recommended CWD telemetry model

Every meaningful CWD operation should carry a common context:

JSON

```
{
  "timestamp": "2026-09-06T20:00:00Z",
  "correlation_id": "CORR-7890",
  "session_id": "S-1001",
  "conversation_id": "CONV-1001",
  "turn_id": "TURN-002",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",
  "agent_id": "tracking-worker",
  "agent_version": "2.4.1",
  "environment": "prod",
  "status": "completed"
}
```

Then add operation-specific fields:

```
Request → route, HTTP status, duration
Dependency → target, type, duration, success
LLM → model, prompt version, tokens
RAG → retrieval mode, counts, duration
Tool → MCP server, tool name, result status
Step → step type, retry count, result reference
```

This creates consistent telemetry across independently deployed CWD services.

# 26. End-to-end example

User request:

> “Why is shipment SHIP123 delayed?”

```
TURN-002
   │
   ▼
Coordinator
   └── Request: POST /api/chat
          │
          ▼
Delegator
   └── Dependency: shipping-delegator
          │
          ▼
Worker
   ├── STEP-003 → RAG retrieval
   │      └── Azure AI Search dependency
   │
   ├── STEP-004 → MCP tool execution
   │      └── get_tracking_events
   │
   ├── STEP-005 → LLM invocation
   │      └── Azure OpenAI dependency
   │
   ├── STEP-006 → Validation
   │
   └── STEP-007 → Aggregation
          │
          ▼
Coordinator
   └── Response: POST /api/chat completed
```

Application Insights can help reconstruct:

```
Request duration
   ↓
Delegator dependency duration
   ↓
Worker execution duration
   ↓
RAG duration
   ↓
MCP duration
   ↓
LLM duration
   ↓
Exception or validation result
   ↓
Final response
```

The CWD identifiers connect the technical telemetry to the original conversational interaction.

# 27. What Application Insights does not provide by itself

Application Insights is powerful, but it does not automatically understand every CWD business concept.

It does not inherently know:

* Whether a Coordinator selected the correct Delegator

* Whether a Worker decomposition was optimal

* Whether a tool result was semantically correct

* Whether an answer was grounded in the right evidence

* Whether a workflow achieved the business objective

* Whether a prompt version is better than another

* Whether an agent had sufficient authorization

* Whether a business action should have been approved.

These require:

```
Custom CWD telemetry
+
Evaluation framework
+
Policy / IAM
+
Auditability
+
MLflow
```

# 28. Core formulas

### Application telemetry

Application Telemetry=Requests+Dependencies+Exceptions+Traces+Metrics+Availability\text{Application Telemetry} = \text{Requests} + \text{Dependencies} + \text{Exceptions} + \text{Traces} + \text{Metrics} + \text{Availability}Application Telemetry=Requests+Dependencies+Exceptions+Traces+Metrics+Availability

### CWD observability

CWD Observability=Application Telemetry+Agent Telemetry+Workflow Telemetry+Task/Run/Step Telemetry+LLM Telemetry+Tool/MCP Telemetry+RAG Telemetry+Messaging Telemetry+Security Monitoring\text{CWD Observability} = \text{Application Telemetry} + \text{Agent Telemetry} + \text{Workflow Telemetry} + \text{Task/Run/Step Telemetry} + \text{LLM Telemetry} + \text{Tool/MCP Telemetry} + \text{RAG Telemetry} + \text{Messaging Telemetry} + \text{Security Monitoring}CWD Observability=Application Telemetry+Agent Telemetry+Workflow Telemetry+Task/Run/Step Telemetry+LLM Telemetry+Tool/MCP Telemetry+RAG Telemetry+Messaging Telemetry+Security Monitoring

### Service health

Service Health=Availability+Reliability+Performance+Dependency Health+Capacity+Error Rate\text{Service Health} = \text{Availability} + \text{Reliability} + \text{Performance} + \text{Dependency Health} + \text{Capacity} + \text{Error Rate}Service Health=Availability+Reliability+Performance+Dependency Health+Capacity+Error Rate

## Interview-ready answer

> “In CWD, Application Insights provides the application performance monitoring layer for the Coordinator, Delegators, Workers, and supporting services. It captures incoming requests, outbound dependencies, exceptions, performance metrics, availability results, and distributed operation telemetry. We use it to understand request rates, success and failure rates, dependency latency, P95/P99 performance, exception patterns, and service-level health. By propagating CWD identifiers such as correlation ID, Turn ID, workflow ID, task ID, run ID, and Step ID, we can connect a user request to the complete distributed execution path across agents, LLMs, RAG, MCP tools, databases, and messaging systems. We also add custom telemetry for agent selection, workflow transitions, tool execution, retrieval quality, LLM usage, and business outcomes. Application Insights supports runtime troubleshooting and operational monitoring, while LangGraph manages workflow state, MLflow manages experiment and evaluation evidence, Policy/IAM enforces authorization, and the audit store preserves governed evidence. This turns CWD from a collection of distributed services into an observable, diagnosable, and measurable enterprise platform.”

### Core definition

Application Insights in CWD is the application telemetry and performance-monitoring capability that captures requests, dependencies, exceptions, performance, availability, and distributed operation data across Coordinator, Delegator, Worker, and supporting services. When combined with CWD correlation identifiers and custom agent/workflow telemetry, it enables end-to-end tracing, failure diagnosis, latency analysis, dependency health monitoring, service-level health measurement, alerting, and operational troubleshooting across the complete multi-agent execution graph.

### Mental model

```
Application Insights
        ↓
Requests + Dependencies + Exceptions + Performance
        ↓
Distributed CWD Execution
        ↓
Latency + Reliability + Service Health
        ↓
Troubleshooting + Alerts + Continuous Improvement
```
