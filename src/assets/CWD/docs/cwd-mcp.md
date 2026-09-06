# MCP in CWD — End-to-End Enterprise Integration

> Core Principle: MCP standardizes how AI agents discover and interact with tools, resources, and contextual capabilities. CWD uses MCP at the Worker integration boundary so that agents can access enterprise systems through governed, reusable, auditable interfaces rather than directly connecting to databases, APIs, files, or production systems.

The simplest separation is:

```
CWD       = Enterprise agent architecture
LangGraph = Workflow state and execution control
A2A       = Agent-to-agent communication
MCP       = Agent-to-tool and agent-to-resource integration
Worker    = Specialized business or technical execution
Policy    = Authorization and governance
```

MCP is an open protocol for connecting AI applications with external data sources and tools. Its architecture uses hosts, clients, and servers, with JSON-RPC-based communication and capability negotiation. MCP servers can expose resources, prompts, and tools.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## 1. Why CWD Needs MCP

Without a standardized integration layer, every Worker may implement its own integration:

```
Worker A ── Custom REST Client ── CRM
Worker B ── Custom SQL Code ───── Database
Worker C ── Custom SDK ────────── ERP
Worker D ── Custom File Code ──── SharePoint
Worker E ── Custom HTTP Code ──── Monitoring API
```

This creates:

* duplicated integration code

* inconsistent authentication

* inconsistent input validation

* different error formats

* weak auditability

* difficult tool replacement

* excessive direct system access

* tightly coupled Workers

With MCP:

```
                    CWD
                     │
                 Coordinator
                     │
                 Delegator
                     │
                   Worker
                     │
                  MCP Client
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      MCP Server  MCP Server  MCP Server
          │          │          │
          ▼          ▼          ▼
         CRM       Database     ERP
```

The Worker uses a standardized protocol while each MCP server owns the integration with its specific system.

# 2. What MCP Actually Standardizes

MCP standardizes the communication contract between an AI application and an integration server.

It defines:

1. protocol messages

2. lifecycle and capability negotiation

3. tools

4. resources

5. prompts

6. error reporting

7. logging and progress-related utilities

8. authorization mechanisms for supported HTTP deployments

The protocol uses JSON-RPC messages, and its feature model separates the application host from the servers that provide specialized capabilities.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

MCP is therefore similar in architectural intent to a standardized connector interface:

```
Application
    ↓
Standardized Protocol
    ↓
Specialized Integration
    ↓
External System
```

It is not itself:

* an LLM

* an agent framework

* a workflow engine

* a database

* an enterprise authorization policy

* a replacement for A2A

* a replacement for API management

* a guarantee that every tool invocation is safe

# 3. MCP Architecture: Host, Client, and Server

The official MCP architecture has three primary components.

```
┌──────────────────────────────────────────────┐
│                  MCP Host                    │
│                                              │
│  AI application / CWD Worker runtime         │
│                                              │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ MCP Client 1 │  │ MCP Client 2 │          │
│  └──────┬───────┘  └──────┬───────┘          │
└─────────┼─────────────────┼──────────────────┘
          │                 │
          ▼                 ▼
   ┌─────────────┐   ┌─────────────┐
   │ MCP Server  │   │ MCP Server  │
   │ CRM Tools   │   │ Data Tools  │
   └──────┬──────┘   └──────┬──────┘
          │                 │
          ▼                 ▼
         CRM             Database
```

### Host

The host is the application that manages the AI interaction and MCP client connections.

In CWD, this role is usually associated with the Worker runtime or agent application, although a broader host may manage multiple clients.

### Client

An MCP client is the connector inside the host.

It:

* connects to an MCP server

* negotiates capabilities

* sends requests

* receives responses

* maintains the appropriate connection or request lifecycle

* enforces the host’s integration boundary

### Server

An MCP server exposes a focused set of capabilities.

Examples:

```
CRM MCP Server
Production Database MCP Server
Document MCP Server
Monitoring MCP Server
Ticketing MCP Server
ERP MCP Server
Knowledge Search MCP Server
```

The server may be a local process or a remote service. The MCP architecture keeps server responsibilities focused and composable.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

# 4. MCP in the CWD Layered Architecture

A production CWD architecture can be represented as follows:

```
┌─────────────────────────────────────────────────────┐
│                 User / Enterprise App               │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ API Gateway / Identity / Request Validation         │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ Coordinator                                         │
│ Intent, Planning, Authorization, Delegation         │
└──────────────────────────┬──────────────────────────┘
                           │
                          A2A
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ Delegator                                           │
│ Domain decomposition, Worker selection, coordination│
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ Worker                                              │
│ Specialized business logic                          │
│                                                     │
│  LangGraph node / execution step                    │
│          ↓                                          │
│  MCP Client                                         │
└──────────────────────────┬──────────────────────────┘
                           │
                     MCP Protocol
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
      ┌────────────┐ ┌────────────┐ ┌────────────┐
      │ MCP Server │ │ MCP Server │ │ MCP Server │
      │ CRM        │ │ Data       │ │ Monitoring │
      └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
            │              │              │
            ▼              ▼              ▼
           CRM          Enterprise DB    AIOps API
```

The important boundary is:

```
Worker → MCP Client → MCP Server → Enterprise System
```

The Worker should not normally bypass this boundary by allowing an LLM to issue arbitrary database queries or unrestricted HTTP requests.

# 5. MCP Primitives

MCP servers can expose three major server-side primitives.

|
Primitive

|

Purpose in CWD

|

Example

|
| --- | --- | --- |
|

Tools

|

Actions or callable functions

|

Create ticket, query order, restart approved service

|
|

Resources

|

Context and data that can be read

|

Production metrics, documents, schemas, reports

|
|

Prompts

|

Reusable prompt templates or workflows

|

Root-cause-analysis template, incident-summary template

|

The protocol distinguishes these capabilities rather than treating every integration as an unrestricted function.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

## 5.1 Tools

A tool represents an operation that an AI application may invoke.

Examples:

```
get_customer_order()
search_incidents()
retrieve_production_metrics()
create_service_ticket()
run_quality_analysis()
update_approved_record()
```

A tool should have a defined contract:

JSON

```
{
  "name": "get_production_metrics",
  "description": "Retrieve authorized production quality metrics",
  "inputSchema": {
    "type": "object",
    "properties": {
      "line_id": {
        "type": "string"
      },
      "start_time": {
        "type": "string"
      },
      "end_time": {
        "type": "string"
      }
    },
    "required": ["line_id", "start_time", "end_time"]
  }
}
```

The schema is not merely documentation. It supports structured invocation and validation.

## 5.2 Resources

Resources expose context or data.

Examples:

```
resource://production/line-01/metrics
resource://quality/defect-catalog
resource://documents/approved-sop
resource://incidents/INC-1001
```

A Worker may use a resource to retrieve context before reasoning:

```
Worker
  ↓
Read approved resource
  ↓
Retrieve context
  ↓
Analyze
  ↓
Return result
```

Resources are useful for:

* documents

* reports

* schemas

* configuration context

* reference data

* operational information

* knowledge retrieval

The resource itself does not automatically mean that every user or agent is authorized to read it.

## 5.3 Prompts

MCP prompts provide reusable prompt templates.

For example:

```
Prompt: production_root_cause_analysis
```

Conceptually:

```
Input:
- production metrics
- defect history
- operating constraints

Prompt Template:
"Analyze the following production quality issue..."

Output:
Structured analysis request
```

In CWD, prompts may be centrally governed through a Prompt Registry, with MCP exposing approved prompt capabilities to the appropriate host or Worker.

# 6. MCP Capability Discovery

A Worker should not assume that every MCP server supports every capability.

The lifecycle includes capability negotiation.

```
Worker MCP Client
       ↓
Initialize / Discover
       ↓
MCP Server
       ↓
Advertise Capabilities
       ↓
Worker Knows Available Features
```

For example:

```
CRM MCP Server
    ├── tools
    ├── resources
    └── prompts

Monitoring MCP Server
    ├── tools
    └── resources
```

The Worker can then determine:

```
Does this server support:
- required tool?
- required resource?
- required capability?
```

MCP’s protocol layers and capability negotiation allow implementations to support only the features they need.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

# 7. MCP Tool Invocation Flow

Consider a CWD request:

> “Find the current production incident affecting Line 4.”

The end-to-end flow is:

```
User
  ↓
Coordinator
  ↓
Delegator
  ↓
Incident Analysis Worker
  ↓
MCP Client
  ↓
Incident MCP Server
  ↓
Incident Management API
  ↓
Incident Data
  ↓
MCP Response
  ↓
Worker
  ↓
Validation / Analysis
  ↓
Delegator
  ↓
Coordinator
  ↓
User
```

Detailed steps:

### Step 1 — Intent recognition

The Coordinator identifies:

```
intent = incident_analysis
```

### Step 2 — Delegation

The Coordinator delegates to an incident or operations Delegator.

### Step 3 — Worker selection

The Delegator selects a Worker with:

```
capability = incident-analysis
```

### Step 4 — Tool discovery

The Worker discovers or accesses the approved MCP tool:

```
search_incidents
```

### Step 5 — Authorization

CWD validates:

* user identity

* data entitlement

* tool permission

* requested scope

* environment

* sensitivity level

### Step 6 — Invocation

The Worker invokes the MCP tool with structured arguments.

### Step 7 — Server-side validation

The MCP server validates:

* input schema

* authorization

* allowed parameters

* rate limits

* system access

### Step 8 — Enterprise call

The MCP server calls the approved incident-management API.

### Step 9 — Response validation

The Worker validates the returned result.

### Step 10 — State update

The Worker writes the result into the LangGraph/CWD execution state.

### Step 11 — Aggregation

The Delegator aggregates the result and returns it to the Coordinator.

# 8. CWD Uses MCP Through Workers

The cleanest responsibility model is:

```
Coordinator
    │
    │ Decides what business objective is needed
    ▼
Delegator
    │
    │ Decides which specialized capability is needed
    ▼
Worker
    │
    │ Decides which approved integration operation is required
    ▼
MCP
    │
    │ Standardized protocol
    ▼
Enterprise System
```

The Coordinator should not normally call every enterprise API directly.

The Delegator should not normally contain all system-specific integration code.

The Worker should use approved MCP capabilities to execute its specialized responsibility.

This produces:

```
Coordinator = Business workflow orchestration
Delegator   = Domain task orchestration
Worker      = Specialized execution
MCP         = Integration contract
MCP Server  = System-specific adapter
```

# 9. MCP and LangGraph Together

LangGraph controls when an integration operation occurs.

MCP controls how the Worker communicates with the external capability.

```
LangGraph Node
      ↓
Prepare Tool Request
      ↓
Policy Check
      ↓
MCP Client
      ↓
MCP Server
      ↓
Tool Result
      ↓
Validate Result
      ↓
Update State
      ↓
Conditional Edge
```

For example:

```
Retrieve Data Node
      ↓
MCP Tool Invocation
      ↓
Validate Data
      ↓
Analysis Node
```

If the tool fails:

```
MCP Tool Invocation
      ↓
Error
      ↓
LangGraph State Update
      ↓
Conditional Routing
      ├── Retry
      ├── Alternate Tool
      ├── Recovery
      └── Stop
```

Therefore:

> MCP provides the integration operation; LangGraph controls the workflow around that operation.

# 10. MCP and A2A Together

A2A and MCP solve different communication problems.

```
Coordinator
    │
    │ A2A
    ▼
Delegator
    │
    │ A2A or runtime task dispatch
    ▼
Worker
    │
    │ MCP
    ▼
Enterprise Tool / System
```

### A2A message

JSON

```
{
  "task_id": "T100",
  "objective": "Analyze production incidents",
  "required_capability": "incident-analysis"
}
```

### MCP tool request

JSON

```
{
  "method": "tools/call",
  "params": {
    "name": "search_incidents",
    "arguments": {
      "line_id": "LINE-04"
    }
  }
}
```

The distinction is:

|
Communication

|

Meaning

|
| --- | --- |
|

Coordinator → Delegator

|

Agent-to-agent task delegation

|
|

Delegator → Worker

|

Task dispatch or agent execution

|
|

Worker → MCP Server

|

Tool/resource integration

|
|

MCP Server → Enterprise API

|

System-specific integration

|

# 11. Security and Governance

MCP creates powerful access paths. A tool may expose data access or execute operations, so the integration must be treated as a security boundary.

The MCP specification emphasizes user consent, data privacy, tool safety, access controls, and careful handling of server-provided capabilities. MCP itself does not automatically enforce every enterprise security policy; the host and implementation must provide the required controls.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## Recommended CWD security flow

```
User Identity
     ↓
Gateway Authentication
     ↓
Coordinator Authorization
     ↓
Delegator Entitlement Check
     ↓
Worker Authorization
     ↓
MCP Server Authentication
     ↓
Tool-Level Authorization
     ↓
Enterprise System Authorization
```

This is defense in depth.

# 12. Least-Privilege MCP Access

Each MCP server should expose only the capabilities required for its purpose.

### Bad design

```
Generic MCP Server
    ├── arbitrary SQL
    ├── arbitrary HTTP
    ├── arbitrary shell
    ├── unrestricted file access
    └── unrestricted production commands
```

### Better design

```
Production Metrics MCP Server
    ├── get_line_metrics
    ├── get_defect_summary
    └── get_quality_trend

Ticketing MCP Server
    ├── search_tickets
    ├── get_ticket
    └── create_ticket_with_approval
```

The server should expose business-safe capabilities, not unrestricted infrastructure access.

# 13. Tool Input Validation

Every tool request should be validated.

```
Worker
  ↓
Tool Arguments
  ↓
Schema Validation
  ↓
Policy Validation
  ↓
Business Validation
  ↓
MCP Server
```

Example:

Python

Run

```
def validate_tool_request(request, user_context):
    validate_schema(request)
    validate_user_entitlement(user_context)
    validate_allowed_scope(request)
    validate_environment(request)
    validate_data_classification(request)
    return True
```

Important checks include:

* required fields

* valid data types

* allowed values

* permitted resource scope

* tenant or business-unit boundaries

* environment restrictions

* maximum query range

* maximum result size

* operation risk

* user authorization

# 14. Read vs Write Operations

CWD should distinguish between read and write tools.

### Read operation

```
get_production_metrics
```

Possible flow:

```
Authorization
  ↓
Read Tool
  ↓
MCP
  ↓
Result
```

### Write operation

```
update_production_configuration
```

Recommended flow:

```
Request
  ↓
Risk Classification
  ↓
Authorization
  ↓
Human Approval if Required
  ↓
Checkpoint
  ↓
MCP Tool Invocation
  ↓
Validation
  ↓
Audit
```

The MCP tool contract alone should not be considered sufficient authorization for a high-risk action.

# 15. Human Approval at the MCP Boundary

A high-risk MCP tool may require approval before execution.

```
Worker
  ↓
Prepare Tool Call
  ↓
Risk Classification
  ↓
Approval Required?
  ├── No → Execute
  └── Yes
        ↓
   Human Approval
        ↓
   Checkpoint
        ↓
   Resume
        ↓
   MCP Tool Call
```

For example:

```
Tool: restart_production_service
Risk: HIGH
Approval: REQUIRED
Approver Role: Operations Manager
```

The Worker can recommend the operation, but CWD controls whether it is permitted.

# 16. MCP Server as an Enterprise Adapter

An MCP server should hide system-specific implementation details.

```
Worker
  ↓
get_customer_order(order_id)
  ↓
MCP Server
  ↓
CRM SDK / REST API / SQL / SOAP
  ↓
CRM
```

The Worker should not need to know whether the server uses:

* REST

* GraphQL

* SQL

* SOAP

* vendor SDK

* message queue

* internal microservice

This creates loose coupling.

```
Worker Contract
      ↓
Stable MCP Tool
      ↓
Replaceable Backend Adapter
```

For example, the CRM backend can change from one API version to another while the Worker continues using the same governed tool contract.

# 17. Context Access Through MCP

MCP is not only about actions.

It also provides a standardized way to expose context.

```
Worker
  ↓
MCP Resource
  ↓
Approved Enterprise Context
  ↓
Worker State
  ↓
LLM Reasoning
```

Example:

```
Resource:
resource://quality/defect-catalog

Retrieved context:
- defect categories
- severity definitions
- approved operating thresholds
- classification rules
```

The Worker can then reason over the retrieved context.

The important security principle is:

> Only the context required for the task should be exposed to the Worker and model.

# 18. MCP and RAG in CWD

A Knowledge Retrieval Worker may use MCP to access a governed search capability.

```
Coordinator
    ↓
Knowledge Delegator
    ↓
Retrieval Worker
    ↓
MCP Client
    ↓
Knowledge Search MCP Server
    ↓
Azure AI Search / Vector Store
    ↓
Retrieved Documents
    ↓
Worker
    ↓
LLM
    ↓
Grounded Answer
```

MCP standardizes the integration interface.

The actual retrieval implementation may use:

* keyword search

* vector search

* hybrid search

* metadata filtering

* reranking

* document access control

MCP does not replace the retrieval engine. It exposes the retrieval capability through a consistent interface.

# 19. MCP and External Services

CWD may integrate with:

```
CRM
ERP
MES
ITSM
Monitoring
Data Warehouse
Document Management
Identity Services
Knowledge Search
Cloud APIs
Internal Microservices
```

A possible integration architecture is:

```
                    MCP Gateway / Registry
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   CRM MCP Server     Data MCP Server    Operations MCP Server
          │                  │                  │
          ▼                  ▼                  ▼
         CRM             Data Platform       AIOps APIs
```

Each server should have:

* ownership

* version

* capability catalog

* authentication model

* authorization rules

* health status

* rate limits

* audit configuration

* data classification

* supported environments

# 20. MCP Registry and CWD Agent Registry

CWD may maintain an Agent Registry and an MCP capability catalog.

These should remain conceptually separate.

|
Registry

|

Responsibility

|
| --- | --- |
|

Agent Registry

|

Discover Coordinator, Delegator, and Worker capabilities

|
|

MCP Catalog/Registry

|

Discover available MCP servers and exposed capabilities

|
|

Policy Service

|

Determine whether a capability may be used

|
|

LangGraph

|

Decide when the capability is invoked

|
|

MCP Client

|

Send the protocol request

|
|

MCP Server

|

Execute the integration operation

|

Example:

```
Delegator
   ↓
Select Worker
   ↓
Worker discovers approved MCP capability
   ↓
MCP Catalog
   ↓
Tool metadata
   ↓
Policy validation
   ↓
MCP invocation
```

# 21. MCP Tool Selection

A Worker may have access to several tools:

```
search_incidents
get_incident_details
create_incident
update_incident
close_incident
```

The LLM may recommend a tool, but CWD should validate the recommendation.

```
LLM Recommendation
       ↓
Tool Catalog
       ↓
Policy
       ↓
Input Schema
       ↓
Risk Classification
       ↓
Approved MCP Invocation
```

The tool-selection decision should consider:

* task objective

* tool capability

* user authorization

* data sensitivity

* environment

* operation risk

* tool health

* deadline

* cost

* idempotency

* approval requirements

# 22. MCP Error Handling

MCP tool calls may fail because of:

```
Invalid Input
Unauthorized Access
Resource Not Found
Rate Limit
Timeout
Backend Unavailable
Schema Error
Business Rule Failure
```

The Worker should classify the result.

```
MCP Response
     ↓
Worker Validation
     ↓
Error Classification
     ↓
State Update
     ↓
LangGraph Routing
```

Example:

```
Timeout
  → Retry if safe

Rate limit
  → Backoff

Unauthorized
  → Stop

Invalid input
  → Correct or reject

Backend unavailable
  → Retry or alternate integration

Business rule failure
  → Recovery or human escalation
```

MCP communicates the integration result; LangGraph controls the next workflow path.

# 23. MCP and Retry Safety

Not every MCP operation is safe to retry.

### Usually safer to retry

```
get_order
search_incidents
retrieve_metrics
read_document
```

### Requires caution

```
create_ticket
submit_transaction
update_record
restart_service
change_configuration
```

For write operations, CWD should use:

* idempotency keys

* operation status checks

* bounded retries

* duplicate detection

* transaction semantics where available

* approval state

* checkpointing

* compensating actions where appropriate

A useful decision model is:

MCPRetryDecision=f(ErrorType,OperationType,Idempotency,RetryCount,Deadline,Policy)MCPRetryDecision = f( ErrorType, OperationType, Idempotency, RetryCount, Deadline, Policy )MCPRetryDecision=f(ErrorType,OperationType,Idempotency,RetryCount,Deadline,Policy)

# 24. MCP and Observability

Every MCP invocation should be traceable.

```
workflow_id
correlation_id
task_id
worker_id
mcp_server_id
tool_name
request_timestamp
duration
status
error_type
retry_count
approval_id
```

Example audit event:

JSON

```
{
  "workflow_id": "W1001",
  "task_id": "T205",
  "worker_id": "IncidentWorker",
  "mcp_server": "IncidentMCPServer",
  "tool": "search_incidents",
  "status": "SUCCESS",
  "duration_ms": 420
}
```

For sensitive data, logs should avoid storing unrestricted request payloads or confidential tool outputs.

# 25. MCP and Data Privacy

CWD should control what context is passed to an MCP server.

```
Full User Context
       ↓
Data Minimization
       ↓
Required Task Context Only
       ↓
MCP Server
```

For example, a Worker may need:

```
line_id
time_range
metric_type
```

It may not need:

```
full employee profile
unrelated customer records
complete conversation history
unrestricted database credentials
```

MCP’s security guidance emphasizes that hosts should control what user data is exposed to servers and should preserve user control over data access and operations.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

# 26. MCP Transport and Deployment

MCP can be used with different deployment patterns.

### Local integration

```
Worker Runtime
     ↓
Local MCP Server Process
     ↓
Local File / Tool
```

### Remote integration

```
Worker
  ↓
MCP Client
  ↓
Remote MCP Server
  ↓
Enterprise API
```

### Enterprise deployment

```
Worker
  ↓
Private Network
  ↓
MCP Gateway
  ↓
MCP Server
  ↓
Internal System
```

For enterprise CWD, remote MCP servers should normally be deployed with:

* private networking

* managed identity or approved credentials

* TLS

* network segmentation

* gateway controls

* rate limiting

* centralized logging

* environment separation

* secret management

* health checks

MCP’s HTTP authorization framework has evolved across specification versions, so production implementations should select and validate the exact MCP version and transport supported by their SDKs and infrastructure.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

# 27. MCP Does Not Automatically Make Integr


### Important version note

MCP is evolving. The architecture above describes the stable conceptual model, but protocol details such as transport behavior, authorization, lifecycle management, and capability discovery depend on the MCP specification version and SDK implementation. For a production CWD platform, standardize one supported MCP version and validate all clients and servers against it.
