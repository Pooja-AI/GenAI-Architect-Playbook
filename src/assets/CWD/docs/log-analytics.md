## Centralized logging in CWD

Centralized log collection is the practice of collecting logs from all CWD services and supporting components into a shared, searchable platform so engineers can reconstruct, investigate, and troubleshoot distributed execution from one place.

For CWD, the goal is not simply to store more logs. It is to answer:

> What happened, where did it happen, why did it happen, and what should we do next?

A single request may generate logs across the Gateway, Coordinator, Delegator, Worker, LLM, RAG, MCP, database, messaging, and infrastructure layers. Centralized logging makes those records searchable through common identifiers such as Correlation ID, Turn ID, Workflow ID, Task ID, Run ID, and Step ID.

## 1. Where centralized logging fits

```
Users
  ↓
API Gateway
  ↓
CWD Coordinator
  ↓
Delegators
  ↓
Workers
  ├── LLM
  ├── RAG / Azure AI Search
  ├── MCP / APIs
  ├── Cosmos DB
  ├── Redis
  └── Service Bus
          │
          ▼
   Log Collection
          │
          ▼
   Central Log Platform
          │
          ├── Search / Query
          ├── Dashboards
          ├── Alerts
          ├── Incident Investigation
          └── Audit / Security Integration
```

In an Azure-oriented CWD platform, Azure Monitor Logs / Log Analytics can provide the centralized query and analysis layer, while Application Insights contributes application telemetry and Azure services contribute their own diagnostic logs.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

Important distinction:

```
Application Insights = Application telemetry
Log Analytics        = Centralized log query and analysis
Azure Monitor        = Monitoring, metrics, alerts, and analysis
Audit Store          = Governed audit evidence
MLflow               = AI/ML experiment and evaluation evidence
```

These systems complement one another rather than replacing each other.


# 2. Why centralized logging is critical for CWD

Traditional applications may have one service log. CWD has a distributed execution graph.

```
User Request
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ├── RAG
    ├── LLM
    ├── MCP Tool
    └── Enterprise API
    ↓
Aggregation
    ↓
Final Response
```

If the final response is slow or incorrect, checking only the Coordinator log is insufficient.

Centralized logs help answer:

* Did the request reach the Coordinator?

* Which Delegator was selected?

* Which Workers executed?

* Which tool was called?

* Did authorization succeed?

* Did RAG retrieve relevant evidence?

* Did the LLM timeout?

* Was the failure retryable?

* Did the workflow recover?

* Why was the final response partial or failed?

> Centralized logging turns distributed execution into a searchable operational history.

# 3. Structured application logs

CWD should use structured logs, preferably JSON, rather than only free-form messages.

### Unstructured log

```
Worker failed while calling shipment API
```

### Structured log

JSON

```
{
  "timestamp": "2026-09-06T20:00:01.240Z",
  "level": "ERROR",
  "service": "tracking-worker",
  "event_name": "TOOL_EXECUTION_FAILED",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-004",
  "agent_id": "tracking-worker",
  "tool_name": "get_tracking_events",
  "error_type": "TimeoutError",
  "retryable": true,
  "duration_ms": 5000
}
```

Structured fields allow queries such as:

```
Find all failed tool executions for correlation CORR-7890
```

rather than searching manually through text.

# 4. Common log fields

A shared CWD logging schema should include:

|
Field

|

Purpose

|
| --- | --- |
|

`timestamp`

|

When the event occurred

|
|

`level`

|

DEBUG, INFO, WARN, ERROR

|
|

`service`

|

Gateway, Coordinator, Worker, etc.

|
|

`environment`

|

DEV, TEST, UAT, PROD

|
|

`event_name`

|

Meaningful operation

|
|

`correlation_id`

|

End-to-end business request

|
|

`session_id`

|

Broader interaction

|
|

`conversation_id`

|

Conversation

|
|

`turn_id`

|

Individual user interaction

|
|

`workflow_id`

|

Workflow execution

|
|

`task_id`

|

Logical objective

|
|

`run_id`

|

Execution attempt

|
|

`step_id`

|

Individual operation

|
|

`agent_id`

|

Agent identity

|
|

`agent_version`

|

Deployed agent version

|
|

`status`

|

Started, completed, failed, etc.

|
|

`duration_ms`

|

Operation duration

|
|

`error_code`

|

Classified failure

|
|

`result_reference`

|

Reference to stored result

|

The most important principle is:

> Every meaningful log should be correlated with the execution context that produced it.

# 5. Agent events

CWD should log meaningful agent lifecycle and decision events.

```
AGENT_SELECTED
AGENT_STARTED
AGENT_COMPLETED
AGENT_FAILED
AGENT_TIMEOUT
AGENT_RETRY
AGENT_FAILOVER
AGENT_DEGRADED
AGENT_DRAINING
```

Example:

JSON

```
{
  "event_name": "AGENT_SELECTED",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "agent_id": "shipping-delegator",
  "capability": "shipment_delay_analysis",
  "selection_reason": "capability_and_policy_match",
  "status": "selected"
}
```

This helps investigate:

> Why did CWD choose this agent instead of another eligible agent?

For dynamic routing, logs should capture relevant candidate and exclusion information without exposing sensitive policy details unnecessarily.

# 6. Workflow and step events

LangGraph controls workflow transitions, while centralized logs record those transitions.

```
WORKFLOW_STARTED
       ↓
STEP_STARTED
       ↓
STEP_COMPLETED
       ↓
STEP_STARTED
       ↓
STEP_FAILED
       ↓
STEP_RETRYING
       ↓
STEP_COMPLETED
       ↓
WORKFLOW_COMPLETED
```

Example:

JSON

```
{
  "event_name": "STEP_COMPLETED",
  "step_id": "STEP-004",
  "step_type": "tool_execution",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "status": "completed",
  "duration_ms": 1240
}
```

This provides a searchable execution timeline.

# 7. Error logs

Error logs should capture what failed and how the platform should respond.

A useful error record includes:

```
error_code
error_type
message
service
step_id
dependency
retryable
attempt
deadline
status
```

Example:

JSON

```
{
  "event_name": "STEP_FAILED",
  "step_id": "STEP-004",
  "error_code": "MCP_TIMEOUT",
  "error_type": "TimeoutError",
  "dependency": "shipping-mcp",
  "retryable": true,
  "attempt": 1,
  "status": "failed"
}
```

### Error classification

|
Error type

|

Example

|

Typical response

|
| --- | --- | --- |
|

Validation

|

Invalid shipment ID

|

Reject or request correction

|
|

Authorization

|

Tool access denied

|

Stop or escalate

|
|

Timeout

|

MCP API timeout

|

Controlled retry

|
|

Dependency

|

Search unavailable

|

Retry or fallback

|
|

Rate limit

|

LLM throttling

|

Backoff

|
|

Permanent business error

|

Shipment not found

|

Return business result

|
|

Infrastructure

|

Worker crashed

|

Redistribute task

|

Do not treat every error as a system failure. A correct authorization denial may be a successful security control.

# 8. Security event logs

Security events should be logged separately from ordinary application messages, while remaining correlated with the same execution context.

Examples:

```
AUTHENTICATION_FAILED
AUTHORIZATION_DENIED
UNAUTHORIZED_TOOL_ATTEMPT
DLP_VIOLATION
PROMPT_INJECTION_DETECTED
CROSS_TENANT_ACCESS_ATTEMPT
PRIVILEGE_ESCALATION_ATTEMPT
SECRET_ACCESS_DENIED
POLICY_REJECTED
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
  "decision": "DENY",
  "reason_code": "INSUFFICIENT_SCOPE"
}
```

Security logs should support:

* Incident investigation

* Detection of abnormal behavior

* Compliance evidence

* Least-privilege review

* Cross-tenant isolation monitoring

* Policy regression analysis.

Never log passwords, access tokens, private keys, or unrestricted sensitive payloads.

# 9. Tool invocation logs

A tool invocation should be observable as a complete lifecycle.

```
TOOL_SELECTED
      ↓
TOOL_ARGUMENTS_VALIDATED
      ↓
TOOL_AUTHORIZATION_CHECKED
      ↓
TOOL_INVOKED
      ↓
TOOL_RESULT_RECEIVED
      ↓
TOOL_RESULT_VALIDATED
```

Example:

JSON

```
{
  "event_name": "TOOL_EXECUTION_COMPLETED",
  "correlation_id": "CORR-7890",
  "task_id": "WT-1001",
  "step_id": "STEP-004",
  "mcp_server": "shipping-mcp",
  "tool_name": "get_tracking_events",
  "authorization_decision": "ALLOW",
  "result_status": "valid",
  "duration_ms": 1240,
  "retry_count": 0
}
```

This helps distinguish:

```
Wrong tool
   vs
Wrong arguments
   vs
Authorization failure
   vs
MCP transport failure
   vs
Backend API failure
   vs
Invalid result
```

> HTTP 200 is not the same as successful business execution.

# 10. LLM and RAG logs

CWD should capture model and retrieval metadata without logging sensitive content unnecessarily.

### LLM event

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

### RAG event

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

These logs support:

* Model latency analysis

* Token and cost attribution

* Retrieval troubleshooting

* Groundedness investigation

* Prompt and model regression analysis.

# 11. Infrastructure logs

CWD also depends on infrastructure services.

```
Coordinator
   ├── Container Apps / AKS
   ├── Cosmos DB
   ├── Redis
   ├── Service Bus
   ├── Azure AI Search
   ├── Azure OpenAI
   └── Key Vault
```

Infrastructure logs may include:

|
Component

|

Useful operational information

|
| --- | --- |
|

Container runtime

|

Restarts, crashes, deployment events

|
|

Cosmos DB

|

Throttling, request failures, partition issues

|
|

Redis

|

Connection failures, memory pressure, evictions

|
|

Service Bus

|

Delivery failures, dead-lettering, processing errors

|
|

Azure AI Search

|

Query failures, indexing failures, throttling

|
|

LLM service

|

Rate limits, model errors, timeouts

|
|

Key Vault

|

Access failures and secret retrieval errors

|
|

Network

|

Connectivity and firewall-related failures

|

These logs help determine whether an application problem is actually caused by infrastructure.

# 12. Centralized log collection flow

```
CWD Services
    ↓
Structured Logging SDK
    ↓
OpenTelemetry / Azure Diagnostic Settings
    ↓
Log Collection
    ↓
Azure Monitor Logs / Log Analytics
    ↓
Queries + Dashboards + Alerts
```

For Azure services, diagnostic settings can route supported resource logs and metrics to destinations such as Log Analytics. Application Insights application telemetry can also be queried through Azure Monitor Logs.

![](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+1

The exact collection mechanism depends on the service and deployment model.

# 13. Query-based troubleshooting

Centralized logs become valuable when engineers can query them by execution context.

For example, in Kusto Query Language (KQL), a conceptual query might be:

kusto

```
AppTraces
| where TimeGenerated > ago(1h)
| where Properties["correlation_id"] == "CORR-7890"
| project TimeGenerated, SeverityLevel, Message, Properties
| order by TimeGenerated asc
```

This retrieves logs associated with one business request.

> Use the actual table and field names available in your workspace; custom properties may be stored differently depending on instrumentation.

# 14. Query: find failed steps

kusto

```
AppTraces
| where TimeGenerated > ago(1h)
| where Properties["event_name"] == "STEP_FAILED"
| project
    TimeGenerated,
    StepId = tostring(Properties["step_id"]),
    WorkflowId = tostring(Properties["workflow_id"]),
    TaskId = tostring(Properties["task_id"]),
    ErrorCode = tostring(Properties["error_code"]),
    Message
| order by TimeGenerated desc
```

This helps answer:

> Which execution steps are failing most frequently?

# 15. Query: find slow dependencies

kusto

```
AppDependencies
| where TimeGenerated > ago(1h)
| where DurationMs > 2000
| project
    TimeGenerated,
    Target,
    Name,
    DurationMs,
    Success,
    OperationId
| order by DurationMs desc
```

This helps identify whether latency is caused by:

* MCP

* Azure AI Search

* Cosmos DB

* Redis

* LLM calls

* External APIs.

# 16. Query: investigate one Turn ID

kusto

```
union AppRequests, AppDependencies, AppTraces, AppExceptions
| where TimeGenerated > ago(1h)
| where tostring(Properties["turn_id"]) == "TURN-002"
| project
    TimeGenerated,
    Type,
    OperationName,
    Message,
    Properties
| order by TimeGenerated asc
```

This creates a conversational-level investigation view.

A more robust implementation may use a normalized custom field or a dedicated telemetry schema rather than relying on `Properties`.

# 17. Query: find retry storms

kusto

```
AppTraces
| where TimeGenerated > ago(1h)
| where Properties["event_name"] == "STEP_RETRYING"
| summarize RetryCount = count()
    by AgentId = tostring(Properties["agent_id"]),
       ErrorCode = tostring(Properties["error_code"])
| order by RetryCount desc
```

This can reveal:

```
MCP timeout
   ↓
Retry
   ↓
Retry
   ↓
Retry
   ↓
More queue pressure
```

Retry storms can degrade reliability and increase cost.

# 18. Query: find authorization denials

kusto

```
AppTraces
| where TimeGenerated > ago(24h)
| where Properties["event_name"] == "AUTHORIZATION_DENIED"
| summarize Denials = count()
    by AgentId = tostring(Properties["agent_id"]),
       ToolName = tostring(Properties["tool_name"])
| order by Denials desc
```

This supports security investigation and least-privilege analysis.

# 19. Query: investigate a slow workflow

A useful investigation sequence is:

```
1. Find correlation ID
2. Find workflow ID
3. Find failed or slow steps
4. Inspect dependencies
5. Inspect exceptions
6. Inspect retries
7. Inspect infrastructure
8. Determine root cause
```

Example:

```
CORR-7890
   ↓
WF-1001
   ↓
STEP-004
   ↓
MCP dependency
   ↓
Timeout
   ↓
Retry
   ↓
Workflow latency increased
```

This is much more useful than searching for the word `"timeout"` across all services.

# 20. Operational investigation example

Suppose a user reports:

> “The shipment response took too long.”

The engineer searches:

```
correlation_id = CORR-7890
```

The centralized timeline shows:

```
Gateway request                  100 ms
Coordinator                      300 ms
Delegator                        200 ms
RAG retrieval                    800 ms
MCP tool execution             1,240 ms
LLM invocation                 2,100 ms
Retry                            900 ms
Aggregation                     200 ms
```

The engineer discovers:

```
MCP timeout
    ↓
Retry
    ↓
Additional latency
```

The issue is not necessarily the LLM. The root cause may be a downstream dependency.

# 21. Logging vs tracing vs metrics

These concepts are related but different.

|
Capability

|

Main question

|
| --- | --- |
|

Logs

|

What event was recorded?

|
|

Traces

|

Where did the operation travel?

|
|

Metrics

|

How is the system behaving numerically?

|
|

Evaluation

|

Was the AI behavior good enough?

|
|

Audit

|

What governed action occurred?

|
|

Alerts

|

What needs attention now?

|

For example:

```
Log:
"MCP timeout occurred."

Trace:
"Gateway → Coordinator → Worker → MCP."

Metric:
"P95 MCP latency = 4.8 seconds."

Evaluation:
"Workflow success rate decreased."

Audit:
"Tool access was authorized under policy X."
```

Centralized logging is therefore one part of the broader observability strategy.

# 22. Logging vs auditability

Application logs are primarily operational records.

Audit records are governed evidence.

```
Application Log:
"Tool execution completed in 1240 ms."

Audit Record:
"Agent tracking-worker accessed shipment SHIP123
under policy SHIP-READ-001."
```

The audit record should be designed for:

* Accountability

* Compliance

* Forensic investigation

* Retention

* Tamper resistance

* Controlled access.

Do not assume that every application log is automatically an audit record.

# 23. Logging vs MLflow

```
Application Insights / Log Analytics
    ↓
"What happened during production execution?"

MLflow
    ↓
"Which model, prompt, or configuration produced this result,
and how did it compare with alternatives?"
```

Example:

```
Log:
STEP-005 completed in 2.1 seconds.

MLflow:
Prompt v2.2.0 achieved groundedness 0.93
with P95 latency of 3.8 seconds.
```

Both are needed for enterprise LLMOps.

# 24. Logging security and privacy

Centralized logs can become a sensitive data store.

Potentially sensitive information includes:

```
User messages
LLM prompts
RAG context
Tool arguments
Tool results
Access tokens
Connection strings
PII
Confidential business data
```

Recommended controls:

* Redact secrets before logging

* Mask or tokenize sensitive identifiers

* Avoid full prompt and context logging by default

* Store references instead of large payloads

* Apply data classification

* Restrict log access using RBAC

* Encrypt data in transit and at rest

* Apply retention policies

* Separate operational logs from audit evidence

* Monitor access to sensitive logs

* Avoid putting sensitive data in log field names or correlation IDs.

> Logs should explain execution without becoming a second source of data leakage.

# 25. Logging and scalability

CWD can generate a large volume of logs because one request may create many steps, tool calls, and retries.

Challenges include:

```
High request volume
      +
Multi-agent fan-out
      +
Verbose tool logs
      +
LLM telemetry
      +
Infrastructure logs
      =
High ingestion and storage cost
```

Recommended practices:

* Use structured logs

* Log meaningful events, not every internal function

* Use appropriate log levels

* Sample high-volume diagnostic data

* Retain critical security and audit records separately

* Avoid logging large payloads

* Use correlation IDs for targeted investigation

* Monitor ingestion volume and query performance.

# 26. Recommended CWD logging architecture

```
                         USER
                           │
                           ▼
                     API Gateway
                           │
                           ▼
                    CWD Coordinator
                           │
                           ▼
                    CWD Delegators
                           │
                           ▼
                     CWD Workers
                  ┌────────┼────────┐
                  ▼        ▼        ▼
                 LLM      RAG      MCP
                  │        │        │
                  └────────┼────────┘
                           │
                           ▼
                  Structured Log SDK
                           │
                           ▼
                    Log Collection
                           │
                           ▼
                 Azure Monitor Logs
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          Queries       Dashboards      Alerts
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                  Operational Investigation
```

Supporting systems:

```
LangGraph → Workflow State
Cosmos DB → Durable State
Redis → Working State
MLflow → Experiment Evidence
Audit Store → Governed Audit Evidence
```

# 27. Core formulas

### Centralized logging

Centralized Logging=Structured Events+Collection+Central Storage+Correlation+Query+Analysis\text{Centralized Logging} = \text{Structured Events} + \text{Collection} + \text{Central Storage} + \text{Correlation} + \text{Query} + \text{Analysis}Centralized Logging=Structured Events+Collection+Central Storage+Correlation+Query+Analysis

### CWD operational investigation

Operational Investigation=Correlation+Logs+Traces+Metrics+Dependencies+Exceptions+Execution State\text{Operational Investigation} = \text{Correlation} + \text{Logs} + \text{Traces} + \text{Metrics} + \text{Dependencies} + \text{Exceptions} + \text{Execution State}Operational Investigation=Correlation+Logs+Traces+Metrics+Dependencies+Exceptions+Execution State

### CWD observability

CWD Observability=Logs+Traces+Metrics+Agent Telemetry+Workflow Telemetry+LLM/RAG/Tool Telemetry+Security Monitoring+Evaluation\text{CWD Observability} = \text{Logs} + \text{Traces} + \text{Metrics} + \text{Agent Telemetry} + \text{Workflow Telemetry} + \text{LLM/RAG/Tool Telemetry} + \text{Security Monitoring} + \text{Evaluation}CWD Observability=Logs+Traces+Metrics+Agent Telemetry+Workflow Telemetry+LLM/RAG/Tool Telemetry+Security Monitoring+Evaluation

## Interview-ready answer

> “In CWD, centralized logging provides a shared operational record of distributed execution across the Gateway, Coordinator, Delegators, Workers, LLMs, RAG, MCP tools, databases, messaging systems, and infrastructure. We use structured JSON logs with common identifiers such as correlation ID, Turn ID, workflow ID, task ID, run ID, and Step ID. This allows us to query a complete business request rather than searching isolated service logs. We capture agent lifecycle events, workflow transitions, step execution, tool invocations, exceptions, security decisions, infrastructure failures, and performance information. Azure Monitor Logs and Log Analytics can provide the centralized query and analysis layer, while Application Insights contributes application telemetry. We use query-based troubleshooting to identify failed steps, slow dependencies, retry storms, authorization denials, and infrastructure bottlenecks. Logs are correlated with traces and metrics for end-to-end diagnosis, while audit stores preserve governed evidence and MLflow tracks AI/ML experiment results. The objective is to make every production execution explainable, searchable, diagnosable, and secure without exposing sensitive enterprise data.”

### Core definition

Centralized logging in CWD is the governed collection, normalization, correlation, storage, and analysis of structured application, agent, workflow, tool, security, and infrastructure events across the distributed platform. By linking logs with Turn ID, Correlation ID, Workflow ID, Task ID, Run ID, and Step ID, CWD can reconstruct execution timelines, investigate failures, identify performance bottlenecks, monitor service health, detect security issues, support operational troubleshooting, and provide evidence for continuous improvement.

### Mental model

```
Structured Logs
      ↓
Central Collection
      ↓
Correlation IDs
      ↓
Searchable Execution History
      ↓
Troubleshooting + Investigation
      ↓
Reliable + Secure + Observable CWD
```
