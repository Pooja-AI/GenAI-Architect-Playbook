# Complete CWD Request Orchestration Flow

CWD (Coordinator–Delegator–Worker) is an enterprise execution architecture in which a user request is validated, interpreted, authorized, decomposed, executed through specialized agents and governed data-access tools, aggregated, and returned as a validated response.

The central principle is:

> The LLM recommends reasoning and actions; CWD runtime, registries, policy services, and Workers control what actually executes.

## 1. End-to-End Architecture

```
                         USER
                           │
                           ▼
                    API GATEWAY
             Authentication / Validation
                           │
                           ▼
                    COORDINATOR
       Intent → Authorization → Planning
       Discovery → Routing → Monitoring
                           │
                           ▼
                     DELEGATOR
       Domain Decomposition → Dependencies
       Worker Selection → Execution Control
                           │
                           ▼
                  WORKER EXECUTION
       Validate → Retrieve → Tool/MCP → Logic
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ENTERPRISE DATA             ENTERPRISE APIs
       RAG / Search / DB            MCP / REST / ERP
              │                         │
              └────────────┬────────────┘
                           ▼
                    VALIDATED RESULTS
                           │
                           ▼
                     DELEGATOR
                 Domain Aggregation
                           │
                           ▼
                    COORDINATOR
              Enterprise Aggregation
                           │
                           ▼
                 RESPONSE VALIDATION
                           │
                           ▼
                    USER RESPONSE
```

## 2. Request Lifecycle at a Glance

|
Stage

|

Main responsibility

|

Output

|
| --- | --- | --- |
|

1. User request

|

Express business intent

|

Natural-language request

|
|

2. Gateway

|

Authenticate and validate ingress

|

Trusted request

|
|

3. Coordinator

|

Understand enterprise objective

|

Intent and plan

|
|

4. Authorization

|

Check identity, scope, and policy

|

Authorized execution

|
|

5. Agent discovery

|

Find capable agents

|

Eligible candidates

|
|

6. Delegation

|

Assign domain work

|

Structured task

|
|

7. Worker execution

|

Perform specialized work

|

Validated result

|
|

8. Data access

|

Retrieve authorized evidence or live data

|

Approved data

|
|

9. Aggregation

|

Combine domain and enterprise results

|

Unified result

|
|

10. Response validation

|

Check correctness, safety, and policy

|

Approved response

|
|

11. Delivery

|

Return result to user

|

Final answer

|

## 3. Stage 1 — User Request

The process begins when a user submits a request through a supported channel.

Examples:

```
"Why is shipment SHIP123 delayed?"

"Summarize the latest manufacturing quality issues."

"Compare the current production forecast with last month's forecast."
```

The request may contain:

* Business objective

* Business entity or identifier

* Constraints

* Desired output format

* Time range

* User-provided context

The request is not yet an authorized execution plan.

## 4. Stage 2 — Gateway Validation

The API Gateway is the controlled entry point.

```
User
 ↓
Gateway
 ├── Authentication
 ├── Token validation
 ├── Request schema validation
 ├── Rate limiting
 ├── Input size limits
 ├── Correlation ID
 └── Routing
```

### Gateway responsibilities

1. Authenticate the user or application.

2. Validate the request structure.

3. Establish trusted identity context.

4. Create or propagate a correlation ID.

5. Apply rate limits and request controls.

6. Route the request to the Coordinator.

7. Reject malformed or unauthorized ingress.

Example request envelope:

JSON

```
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "session_id": "S-1001",
  "user_id": "user-reference",
  "tenant_id": "tenant-a",
  "message": "Why is shipment SHIP123 delayed?",
  "channel": "web"
}
```

The user should not be able to use arbitrary request fields to grant themselves permissions.

## 5. Stage 3 — Coordinator Receives the Request

The Coordinator is the enterprise-level orchestration brain.

It determines:

> What is the user trying to accomplish, and what must happen across the platform?

The Coordinator does not directly perform every business operation.

### Coordinator responsibilities

```
Receive Request
      ↓
Understand Intent
      ↓
Identify Domain
      ↓
Determine Query Type
      ↓
Build Enterprise Plan
      ↓
Check Authorization
      ↓
Discover Agents
      ↓
Delegate Work
      ↓
Monitor Execution
      ↓
Aggregate Results
      ↓
Generate Final Response
```

## 6. Intent, Domain, and Query-Type Understanding

The Coordinator interprets the request.

For:

> “Why is shipment SHIP123 delayed?”

It may determine:

JSON

```
{
  "intent": "root_cause_analysis",
  "domain": "logistics",
  "query_type": "analytical",
  "business_object": {
    "type": "shipment",
    "id": "SHIP123"
  },
  "required_capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ]
}
```

This interpretation helps determine:

* Which domain is involved?

* Which agents are needed?

* Whether the request requires RAG, live APIs, or both?

* Whether the request is informational or action-oriented?

* Whether human approval may be required?

The LLM may recommend this interpretation, but structured validation and policy controls should govern execution.

## 7. Stage 4 — Authorization and Policy Evaluation

Before accessing enterprise data or invoking tools, CWD evaluates authorization.

```
Identity
   ↓
Roles
   ↓
Permissions
   ↓
Scopes
   ↓
Resource ACL
   ↓
Business Policy
   ↓
Risk Evaluation
   ↓
ALLOW / DENY
```

A useful conceptual formula is:

Authorized=Identity∧Role∧Permission∧Scope∧ResourceACL∧Policy∧RiskAuthorized = Identity \land Role \land Permission \land Scope \land ResourceACL \land Policy \land RiskAuthorized=Identity∧Role∧Permission∧Scope∧ResourceACL∧Policy∧Risk

### Important distinction

```
User is authenticated
        ≠
User is authorized
        ≠
Agent is authorized
        ≠
Tool is authorized
```

Authorization may be checked at multiple boundaries:

* Gateway

* Coordinator

* Delegator

* Worker

* MCP server

* Enterprise data source

## 8. Stage 5 — Enterprise Planning

The Coordinator creates an execution plan.

For the shipment example:

```
Goal:
Explain why shipment SHIP123 is delayed.

Plan:
1. Retrieve tracking events.
2. Retrieve carrier status.
3. Analyze delay cause.
4. Aggregate findings.
5. Return a grounded explanation.
```

The plan may be:

* Sequential

* Parallel

* Conditional

* Long-running

* Human-approved

* Partially recoverable

Example:

```
Coordinator Plan
      │
      ├── Tracking Events
      ├── Carrier Status
      └── Route Constraints
```

The Coordinator should avoid creating unnecessary tasks or invoking unrelated agents.

## 9. Stage 6 — Agent Discovery

The Coordinator queries the Agent Registry.

```
Required Capability
        ↓
Agent Registry
        ↓
Candidate Agents
        ↓
Authorization Filter
        ↓
Health / Readiness Filter
        ↓
Version / Environment Filter
        ↓
Eligible Agent
```

The Registry answers:

> Who can perform this capability?

The Router answers:

> Which eligible agent should receive this task?

A2A answers:

> How do we communicate the task to that agent?

## 10. Stage 7 — Coordinator-to-Delegator Communication

The Coordinator sends a structured task to the appropriate Delegator, commonly through A2A.

```
Coordinator
      │
      │ A2A Task
      ▼
Shipping Delegator
```

Example:

JSON

```
{
  "task_id": "DT-5001",
  "parent_task_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "coordinator",
  "target_agent": "shipping-delegator",
  "capability": "shipment_delay_analysis",
  "objective": "Determine why shipment SHIP123 is delayed",
  "input": {
    "shipment_id": "SHIP123"
  },
  "constraints": {
    "timeout_ms": 10000,
    "priority": "high"
  },
  "expected_output": {
    "shipment_status": true,
    "root_cause": true,
    "recommended_action": true
  }
}
```

The Delegator receives a domain objective, not necessarily the entire user conversation.

## 11. Stage 8 — Delegator Domain Orchestration

The Delegator is responsible for deciding:

> How should this domain objective be executed?

It decomposes the domain task into Worker tasks.

```
Shipping Delegator
        │
        ├── Tracking Worker
        ├── Carrier Status Worker
        └── Delay Analysis Worker
```

### Delegator responsibilities

1. Validate the Coordinator task.

2. Check domain authorization.

3. Decompose the objective.

4. Identify dependencies.

5. Discover suitable Workers.

6. Select healthy and available Workers.

7. Execute tasks sequentially or in parallel.

8. Handle retries and failures.

9. Validate Worker results.

10. Aggregate domain findings.

## 12. Stage 9 — Worker Selection and Task Distribution

The Delegator queries the Agent Registry or Worker registry for suitable capabilities.

```
Required Capability
        ↓
Tracking Worker Pool
        ↓
W1   W2   W3   W4
        ↓
Healthy + Ready + Available
        ↓
Best Eligible Worker
```

Selection can consider:

```
Capability
Authorization
Health
Readiness
Availability
Capacity
Queue Depth
Latency
Version
Priority
Deadline
```

Logical capability and physical instance are different:

```
shipment_tracking
       │
       ├── tracking-worker-1
       ├── tracking-worker-2
       └── tracking-worker-3
```

This allows horizontal scaling and failover.

## 13. Stage 10 — Delegator-to-Worker Task

The Delegator sends a narrow, structured task.

JSON

```
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "source_agent": "shipping-delegator",
  "target_agent": "tracking-worker",
  "capability": "shipment_tracking",
  "action": "get_tracking_events",
  "input": {
    "shipment_id": "SHIP123"
  },
  "constraints": {
    "timeout_ms": 5000,
    "priority": "high"
  },
  "expected_output": {
    "tracking_events": true,
    "latest_status": true
  }
}
```

The Worker should not receive unnecessary enterprise context or unrestricted tool access.

## 14. Stage 11 — Worker Execution

The Worker is the specialized execution component.

Its responsibility is:

> Perform the assigned operation correctly, securely, and within its capability boundary.

Worker lifecycle:

```
Receive Task
      ↓
Validate Input
      ↓
Check Authorization
      ↓
Select Approved Tool / Data Source
      ↓
Retrieve Data
      ↓
Execute Business Logic
      ↓
Validate Output
      ↓
Return Structured Result
```

A Worker may use:

* MCP tools

* Enterprise APIs

* RAG

* Databases

* Approved LLM calls

* Business rules

* Internal libraries

## 15. Stage 12 — Data Access: RAG vs Live Enterprise APIs

The Worker chooses the appropriate data-access mechanism.

### A. RAG for enterprise knowledge

Use RAG for:

* Policies

* Procedures

* Documentation

* Historical reports

* Engineering knowledge

* Knowledge-base articles

  Worker
  ↓
  RAG Query
  ↓
  Identity / Entitlements
  ↓
  Security Filtering
  ↓
  Azure AI Search
  ↓
  Reranking
  ↓
  Authorized Context

### B. MCP/API for live operational data

Use MCP or approved APIs for:

* Current shipment status

* Inventory quantity

* Production state

* Financial balances

* CRM records

* Transactional updates

  Worker
  ↓
  MCP Client
  ↓
  MCP Server
  ↓
  Approved Business Tool
  ↓
  Enterprise API / Database

### Key rule

> RAG provides enterprise evidence; MCP/API provides controlled access to live capabilities.

## 16. Stage 13 — Secure Retrieval

For RAG, retrieval must be entitlement-aware.

Incorrect:

```
Query → Vector Search → LLM
```

Correct:

```
User Identity
      ↓
Entitlements
      ↓
ACL / Security Filter
      ↓
Vector / Keyword / Hybrid Search
      ↓
Authorized Candidates
      ↓
Reranking
      ↓
Context Construction
      ↓
LLM
```

AuthorizedData=RelevantData∩UserEntitlements∩ResourceACL∩BusinessScopeAuthorizedData = RelevantData \cap UserEntitlements \cap ResourceACL \cap BusinessScopeAuthorizedData=RelevantData∩UserEntitlements∩ResourceACL∩BusinessScope

Relevance never overrides authorization.

## 17. Stage 14 — MCP Tool Execution

For a live data request:

```
Tracking Worker
      ↓
MCP Client
      ↓
Shipping MCP Server
      ↓
get_tracking_events
      ↓
Carrier / Shipment System
```

The MCP server should enforce:

* Authentication

* Tool authorization

* Input schema validation

* Business rules

* Rate limits

* Output validation

* Audit logging

* Timeouts

The Worker should not pass raw, unvalidated LLM arguments directly to an enterprise system.

## 18. Stage 15 — Worker Result Validation

A Worker result should contain both execution status and business result.

JSON

```
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "worker": {
    "id": "tracking-worker",
    "version": "2.4.1"
  },
  "status": "completed",
  "result": {
    "shipment_id": "SHIP123",
    "latest_status": "delayed",
    "location": "Dallas",
    "last_event": "Carrier capacity constraint"
  },
  "errors": [],
  "warnings": [],
  "metadata": {
    "duration_ms": 1240,
    "tools_used": [
      "get_tracking_events"
    ]
  }
}
```

Validation should check:

```
Schema
Required Fields
Business Validity
Authorization
Data Classification
Freshness
Completeness
```

An HTTP 200 response does not automatically mean the business result is correct.

## 19. Stage 16 — Parallel Worker Execution

If tasks are independent, the Delegator can execute them in parallel.

```
                 Shipping Delegator
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   Tracking Worker  Carrier Worker  Route Worker
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                   Domain Results
```

For example:

```
Tracking Events = 2 sec
Carrier Status  = 3 sec
Route Constraints = 1 sec
```

Sequential execution:

2+3+1=6s2+3+1=6s2+3+1=6s

Parallel execution:

max(2,3,1)=3smax(2,3,1)=3smax(2,3,1)=3s

plus communication and aggregation overhead.

## 20. Stage 17 — Failure and Recovery

CWD should classify failures rather than blindly retrying.

```
Worker Failure
      ↓
Classify Error
      │
      ├── Retryable → Retry with Backoff
      ├── Timeout → Reconcile / Retry / Recover
      ├── Unavailable → Rediscover / Failover
      ├── Invalid Output → Validate / Re-execute
      ├── Policy Denial → Stop / Audit
      └── High Risk → Human Escalation
```

LangGraph can manage:

* Conditional routing

* Retry limits

* Checkpoints

* Recovery paths

* Human approval pauses

* Workflow continuation

Example:

```
Execute Worker
      ↓
Success?
   ┌──┴──┐
  Yes    No
   │      │
   ▼      ▼
Aggregate Retryable?
          ┌──┴──┐
         Yes    No
          │      │
          ▼      ▼
        Retry   Recover / Stop
```

## 21. Stage 18 — Delegator Aggregation

The Delegator combines Worker results into a domain-level result.

It should not simply forward raw Worker responses.

```
Worker A Result
Worker B Result
Worker C Result
       ↓
Validation
       ↓
Domain Aggregation
       ↓
Shipping Domain Result
```

Example:

JSON

```
{
  "task_id": "DT-5001",
  "parent_task_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "shipping-delegator",
  "target_agent": "coordinator",
  "status": "completed",
  "result": {
    "domain": "shipping",
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity",
    "recommended_action": "reroute"
  },
  "worker_summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  },
  "errors": [],
  "metadata": {
    "duration_ms": 4200
  }
}
```

The Delegator hides implementation details while preserving enough information for enterprise-level decisions.

## 22. Stage 19 — Coordinator Aggregation

The Coordinator receives results from one or more Delegators.

```
Shipping Delegator
Finance Delegator
Inventory Delegator
        │
        ▼
Coordinator
        │
        ▼
Enterprise Result
```

The Coordinator determines:

* Are all required tasks complete?

* Are results consistent?

* Are any results partial?

* Is more information required?

* Is human approval needed?

* Should another Delegator be called?

* Can the final response be generated?

Example:

```
Coordinator
    │
    ├── Shipping Result: Delayed
    ├── Inventory Result: Available
    └── Finance Result: No restriction
            │
            ▼
       Final Decision
```

## 23. Stage 20 — Final Response Generation

The Coordinator prepares the final user-facing response.

The final response may use:

* Validated Worker results

* Aggregated Delegator results

* Authorized RAG evidence

* Approved tool results

* Governed prompt

* Current workflow context

Conceptually:

FinalResponse=LLM(UserRequest+AuthorizedContext+ValidatedResults+GovernedInstructions)FinalResponse = LLM( UserRequest + AuthorizedContext + ValidatedResults + GovernedInstructions )FinalResponse=LLM(UserRequest+AuthorizedContext+ValidatedResults+GovernedInstructions)

The LLM should not invent missing business results or override policy decisions.

## 24. Stage 21 — Response Validation

Before returning the response, CWD should validate:

```
Schema
Correctness
Groundedness
Completeness
Safety
Sensitive Data Leakage
Policy Compliance
Citation / Provenance
```

For high-risk use cases:

```
Response
   ↓
Risk Check
   ↓
Human Review
   ↓
Approve / Reject
   ↓
Deliver
```

A response can be technically fluent but still fail governance if it exposes unauthorized data or makes unsupported claims.

## 25. Stage 22 — Final Delivery

The Gateway returns the response to the user.

```
Coordinator
      ↓
Response Validation
      ↓
Gateway
      ↓
User
```

The response may include:

* Final answer

* Status

* Relevant evidence or references

* Warnings

* Partial-result notice

* Approval status

* Correlation/reference information where appropriate

Example:

> “Shipment SHIP123 is delayed because of a carrier capacity constraint. The latest tracking event was recorded in Dallas. Rerouting is recommended.”

# 26. Complete Example: Shipment Delay Analysis

```
User:
"Why is shipment SHIP123 delayed?"
        │
        ▼
Gateway
- Authenticate
- Validate request
- Create correlation ID
        │
        ▼
Coordinator
- Intent: root cause analysis
- Domain: logistics
- Required capabilities identified
        │
        ▼
Authorization
- User entitlement check
- Agent/tool permissions
        │
        ▼
Agent Registry
- Discover shipping-delegator
        │
        ▼
A2A
- Submit domain task
        │
        ▼
Shipping Delegator
- Decompose task
- Select Workers
        │
        ├───────────────┬────────────────┐
        ▼               ▼                ▼
Tracking Worker   Carrier Worker   Route Worker
        │               │                │
        ▼               ▼                ▼
      MCP             MCP              MCP
        │               │                │
        ▼               ▼                ▼
Shipment System   Carrier System   Route System
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                Worker Validation
                        │
                        ▼
                Domain Aggregation
                        │
                        ▼
                 Coordinator
                        │
                        ▼
                Final Response
                        │
                        ▼
                      User
```

# 27. Where LangGraph Fits

LangGraph is the workflow control mechanism, not the entire CWD platform.

It can manage the execution lifecycle:

```
START
  ↓
Intent
  ↓
Authorization
  ↓
Planning
  ↓
Agent Discovery
  ↓
Delegation
  ↓
Monitor
  ↓
Aggregate
  ↓
Response
  ↓
END
```

At the Delegator level:

```
Receive Task
  ↓
Decompose
  ↓
Select Workers
  ↓
Execute
  ↓
Validate
  ↓
Aggregate
```

At the Worker level, when needed:

```
Receive
  ↓
Validate
  ↓
Retrieve
  ↓
Tool
  ↓
Business Logic
  ↓
Validate Output
  ↓
Return
```

LangGraph manages state, transitions, checkpointing, retries, and conditional routing. It does not replace IAM, Agent Registry, A2A, MCP, Service Bus, or enterprise data stores.

# 28. Where A2A, MCP, and Service Bus Fit

|
Component

|

Role

|
| --- | --- |
|

A2A

|

Agent-to-agent task and result communication

|
|

MCP

|

Worker/application-to-tool and resource integration

|
|

Service Bus

|

Durable asynchronous message delivery

|
|

LangGraph

|

Workflow state and execution control

|
|

Agent Registry

|

Agent discovery and routing metadata

|
|

Policy/IAM

|

Authorization and governance

|
|

RAG

|

Enterprise knowledge retrieval

|
|

Redis

|

Fast working state and cache

|
|

Cosmos DB

|

Durable operational state

|
|

Observability

|

Tracing, logging, metrics, evaluation

|

The separation is:

```
A2A  = Who communicates with whom?
MCP  = How does an agent access capabilities?
LangGraph = What happens next?
Policy = Is it allowed?
Registry = Who can do it?
```

# 29. State and Correlation Across the Flow

The same request should maintain its identity across all execution levels.

```
Correlation ID: CORR-7890
        │
        ├── Session
        ├── Conversation Turn
        ├── Workflow
        ├── Delegator Task
        ├── Worker Task
        ├── Run
        ├── Step
        ├── Tool Call
        └── Final Response
```

Important identifiers:

```
session_id
conversation_id
turn_id
workflow_id
task_id
parent_task_id
run_id
step_id
message_id
correlation_id
```

This enables:

* End-to-end tracing

* Failure diagnosis

* Auditability

* Retry and recovery

* Cost attribution

* Latency analysis

* Reproducibility

# 30. Complete Orchestration Formula

CWD Request Orchestration=Request+GatewayValidation+Intent+Authorization+Planning+AgentDiscovery+Delegation+WorkerExecution+SecureDataAccess+ResultValidation+Aggregation+ResponseValidation+Delivery\boxed{ CWD\ Request\ Orchestration = Request + GatewayValidation + Intent + Authorization + Planning + AgentDiscovery + Delegation + WorkerExecution + SecureDataAccess + ResultValidation + Aggregation + ResponseValidation + Delivery }CWD Request Orchestration=Request+GatewayValidation+Intent+Authorization+Planning+AgentDiscovery+Delegation+WorkerExecution+SecureDataAccess+ResultValidation+Aggregation+ResponseValidation+Delivery

A more operational form is:

User→Gateway→Coordinator→Delegator→Worker→MCP/RAG/API→ValidatedResult→Delegator→Coordinator→Response\boxed{ User \rightarrow Gateway \rightarrow Coordinator \rightarrow Delegator \rightarrow Worker \rightarrow MCP/RAG/API \rightarrow ValidatedResult \rightarrow Delegator \rightarrow Coordinator \rightarrow Response }User→Gateway→Coordinator→Delegator→Worker→MCP/RAG/API→ValidatedResult→Delegator→Coordinator→Response

# 31. Interview-Ready Answer

> “In CWD, request orchestration begins when the user submits a request through the API Gateway. The Gateway authenticates the user, validates the request, applies ingress controls, and establishes correlation and identity context. The Coordinator then interprets the intent, identifies the domain and query type, creates an enterprise-level plan, evaluates authorization and risk, and discovers eligible agents through the Agent Registry. It delegates domain objectives to Delegators using A2A. Each Delegator decomposes its domain task into specialized Worker tasks, identifies dependencies, selects healthy and authorized Workers, and executes them sequentially or in parallel. Workers validate inputs, enforce task-level authorization, access enterprise data through approved RAG, MCP, or API interfaces, execute business logic, validate results, and return structured outputs. The Delegator aggregates Worker results into a domain-level result and sends it back to the Coordinator. The Coordinator combines results from all required domains, handles partial failures or recovery, and generates a final response using authorized evidence and validated results. Before delivery, the response passes safety, grounding, schema, data-protection, and policy validation, with human approval required for high-risk actions. Throughout the lifecycle, LangGraph manages workflow state and transitions, Service Bus can provide asynchronous delivery, and correlation IDs connect every session, turn, workflow, task, run, step, tool call, and result for observability and auditability.”

# Final Mental Model

```
                         USER
                           │
                           ▼
                    GATEWAY VALIDATION
                 Identity + Schema + Limits
                           │
                           ▼
                      COORDINATOR
              Intent + Plan + Authorization
                           │
                           ▼
                    AGENT DISCOVERY
                           │
                           ▼
                      DELEGATOR
              Domain Plan + Worker Selection
                           │
                           ▼
                  WORKER EXECUTION
             Validate + RAG/MCP/API + Logic
                           │
                           ▼
                   VALIDATED RESULTS
                           │
                           ▼
                    DOMAIN AGGREGATION
                           │
                           ▼
                  ENTERPRISE AGGREGATION
                           │
                           ▼
                  RESPONSE VALIDATION
                           │
                           ▼
                         USER
```

In one sentence: CWD request orchestration is the governed end-to-end process that transforms a user request into an authenticated, authorized, planned, delegated, executed, validated, aggregated, and auditable enterprise response through coordinated Coordinator, Delegator, and Worker agents.


The most important architectural distinction is that CWD separates decision-making from execution: the Coordinator decides the enterprise objective, the Delegator manages domain execution, the Worker performs the authorized operation, and governance controls what each component is allowed to do.
