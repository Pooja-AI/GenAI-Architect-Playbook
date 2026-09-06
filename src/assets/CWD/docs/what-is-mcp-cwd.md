# Model Context Protocol (MCP) — Purpose, Concepts, Semantics, and Communication Model

> Core Principle: MCP standardizes how AI applications exchange context and invoke external capabilities. It defines the protocol contract; the host controls the AI experience and security boundary; the client connects to a server; and the server exposes focused tools, resources, and prompts.

MCP is best understood as an integration protocol for AI applications, not as an agent framework or an orchestration engine. Its purpose is to make integrations reusable across different AI applications instead of requiring every application to build a separate connector for every external system. The official specification describes MCP as a protocol for sharing contextual information, exposing tools and capabilities, and building composable integrations and workflows.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## 1. The Problem MCP Solves

Before MCP, an AI application might integrate with external systems like this:

```
AI Application
   ├── Custom CRM integration
   ├── Custom database integration
   ├── Custom document integration
   ├── Custom monitoring integration
   └── Custom ticketing integration
```

Every integration requires its own:

* connection logic

* authentication handling

* request format

* response format

* error handling

* tool discovery

* context retrieval

* lifecycle management

This creates a tightly coupled architecture.

### Without MCP

```
Application A ── Custom Connector ── CRM
Application B ── Custom Connector ── CRM
Application C ── Custom Connector ── CRM
```

### With MCP

```
Application A ── MCP Client ──┐
Application B ── MCP Client ──┼── MCP Server ── CRM
Application C ── MCP Client ──┘
```

The integration contract becomes standardized while the backend implementation remains specific to the system.

# 2. What MCP Is — and Is Not

## MCP is

* an open protocol

* a standardized client-server communication model

* a mechanism for exposing tools, resources, and prompts

* a protocol for exchanging contextual information

* a composable integration layer

* a way to separate AI applications from system-specific connectors

## MCP is not

* an LLM

* an agent

* a reasoning engine

* a workflow engine

* a database

* an API gateway

* an enterprise authorization system

* a replacement for A2A

* a guarantee that a tool invocation is safe

A useful distinction is:

```
LLM       → Determines or recommends what may be useful
MCP       → Defines how the capability is exposed and invoked
Tool      → Performs a specific operation
Server    → Implements the integration
Host      → Controls the AI application and trust boundary
```

# 3. MCP Architectural Model

MCP uses a host-client-server architecture.

```
┌──────────────────────────────────────────────┐
│                    HOST                      │
│                                              │
│  AI application / agent application          │
│                                              │
│  ┌──────────────┐    ┌──────────────┐        │
│  │ MCP Client 1 │    │ MCP Client 2 │        │
│  └──────┬───────┘    └──────┬───────┘        │
└─────────┼───────────────────┼────────────────┘
          │                   │
          ▼                   ▼
   ┌─────────────┐     ┌─────────────┐
   │ MCP Server  │     │ MCP Server  │
   │ CRM         │     │ Knowledge   │
   └──────┬──────┘     └──────┬──────┘
          │                   │
          ▼                   ▼
         CRM              Search / Data
```

The official architecture allows one host to manage multiple clients, with each client maintaining a one-to-one relationship with a particular server. Servers provide specialized context and capabilities.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

## 3.1 Host

The host is the AI application that manages the overall interaction.

Examples:

* an AI assistant

* an IDE

* an agent runtime

* a CWD Worker application

* an enterprise AI application

The host is responsible for coordinating the interaction between the model, users, and MCP clients.

Conceptually:

```
Host
 ├── User interaction
 ├── Model interaction
 ├── MCP client management
 ├── Context control
 ├── Security boundary
 └── Tool approval / execution policy
```

The host is not required to expose the entire conversation to every server.

## 3.2 MCP Client

The client is the protocol connector inside the host.

It is responsible for communicating with one MCP server.

```
Host
  ↓
MCP Client
  ↓
MCP Server
```

A client handles:

* connection establishment

* protocol communication

* capability negotiation

* requests

* responses

* notifications

* cancellation

* transport-specific behavior

A host can have multiple clients:

```
Host
 ├── Client → CRM MCP Server
 ├── Client → Database MCP Server
 └── Client → Search MCP Server
```

## 3.3 MCP Server

The server provides focused capabilities to the client.

Examples:

```
CRM MCP Server
Knowledge MCP Server
Monitoring MCP Server
Ticketing MCP Server
File MCP Server
Database MCP Server
```

A server may be:

* a local process

* a remote service

* an enterprise integration service

The server should expose a clear, limited capability boundary rather than becoming an unrestricted gateway to every backend system.

# 4. MCP’s Core Primitives

MCP defines three major server-side primitives:

```
MCP Server
   ├── Tools
   ├── Resources
   └── Prompts
```

These primitives have different purposes.

|
Primitive

|

Meaning

|

Example

|
| --- | --- | --- |
|

Tools

|

Operations the AI application can invoke

|

Search incidents, create ticket

|
|

Resources

|

Context or data the application can read

|

Documents, metrics, schemas

|
|

Prompts

|

Reusable prompt templates

|

Root-cause-analysis template

|

The protocol also defines client-side capabilities such as sampling and roots, plus utilities such as logging and completion. Not every implementation must support every optional feature.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

# 5. Tools

A tool is a callable capability exposed by an MCP server.

Examples:

```
get_customer_order
search_incidents
retrieve_production_metrics
create_service_ticket
calculate_forecast
update_approved_record
```

A tool normally includes:

* name

* description

* input schema

* execution behavior

* result format

Conceptually:

JSON

```
{
  "name": "search_incidents",
  "description": "Search authorized incident records",
  "inputSchema": {
    "type": "object",
    "properties": {
      "line_id": {
        "type": "string"
      }
    },
    "required": ["line_id"]
  }
}
```

The tool schema tells the client and model what the tool expects. It does not replace authorization or business validation.

## 5.1 Tool Discovery

A client can request the tools available from a server.

Conceptually:

```
Client
   ↓
tools/list
   ↓
Server
   ↓
Available Tool Definitions
```

Example:

```
Server
 ├── search_incidents
 ├── get_incident_details
 └── create_incident
```

A server that supports tools must advertise the tools capability and respond to tool-list requests. The available tool set may change over time and may depend on the authorization presented with the request.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

## 5.2 Tool Invocation

A tool invocation follows a request-response pattern:

```
Client
   ↓
tools/call
   ↓
Server
   ↓
Tool Execution
   ↓
Result or Error
   ↓
Client
```

Conceptual request:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_incidents",
    "arguments": {
      "line_id": "LINE-04"
    }
  }
}
```

Conceptual result:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Two incidents found."
      }
    ]
  }
}
```

The exact result structure depends on the tool and protocol version.

# 6. Resources

A resource represents contextual information or data that can be made available to the AI application.

Examples:

```
resource://quality/defect-catalog
resource://production/line-04/metrics
resource://documents/approved-sop
resource://incidents/INC-1001
```

Resources may represent:

* documents

* reports

* schemas

* configuration information

* reference data

* operational metrics

* knowledge content

Conceptually:

```
Client
   ↓
resources/list
   ↓
Server
   ↓
Available Resources
```

Then:

```
Client
   ↓
resources/read
   ↓
Server
   ↓
Resource Content
```

The resource gives the AI application access to context, but it does not automatically grant unrestricted access to all underlying data.

# 7. Prompts

An MCP prompt is a reusable prompt template or interaction pattern exposed by a server.

Examples:

```
production_root_cause_analysis
incident_summary
customer_response_draft
quality_report_generation
```

Conceptually:

```
Client
   ↓
prompts/list
   ↓
Server
   ↓
Available Prompt Templates
```

Then:

```
Client
   ↓
prompts/get
   ↓
Server
   ↓
Prompt Messages
```

Prompts help standardize reusable interaction patterns without embedding every prompt template directly inside every AI application.

# 8. MCP Protocol Semantics

MCP messages use JSON-RPC 2.0.

The protocol defines three fundamental message types:

```
Request
Response
Notification
```

All MCP messages must follow the JSON-RPC 2.0 message format.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

## 8.1 Requests

A request asks the other side to perform an operation.

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

A request contains:

* `jsonrpc`

* unique request `id`

* `method`

* optional `params`

The request ID allows the response to be matched with the originating request.

## 8.2 Responses

A response returns either a successful result or an error.

### Success

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": []
  }
}
```

### Error

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid parameters"
  }
}
```

A response must contain the same request ID. It must contain either a result or an error, not both.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

## 8.3 Notifications

A notification is a one-way message that does not require a response.

JSON

```
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progress": 50
  }
}
```

Notifications do not contain an ID, and the receiver must not send a response.

They are useful for events such as:

* progress updates

* resource changes

* tool-list changes

* cancellation notifications

* logging-related events

# 9. Request-Response Correlation

The request ID is essential for matching concurrent operations.

```
Client                         Server
  │                              │
  │ Request id=101               │
  ├─────────────────────────────►│
  │                              │
  │ Request id=102               │
  ├─────────────────────────────►│
  │                              │
  │ Response id=102              │
  │◄─────────────────────────────┤
  │                              │
  │ Response id=101              │
  │◄─────────────────────────────┤
```

The client can match each response to the correct request.

This is important when multiple tools or resources are being accessed concurrently.

# 10. MCP Lifecycle

MCP has a lifecycle for establishing a compatible interaction.

Conceptually:

```
Client
   ↓
Initialize
   ↓
Protocol Version Negotiation
   ↓
Capability Negotiation
   ↓
Initialized
   ↓
Normal Operation
   ↓
Shutdown / Disconnect
```

The lifecycle establishes:

* supported protocol version

* client information

* server information

* supported capabilities

* readiness for normal operations

The official specification requires implementations to support the base protocol and lifecycle management. Other features are optional according to implementation needs.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

## 10.1 Capability Negotiation

Capabilities allow each side to declare supported features.

Example:

JSON

```
{
  "capabilities": {
    "tools": {
      "listChanged": true
    },
    "resources": {
      "subscribe": true
    }
  }
}
```

Conceptually:

```
Client
   ↓
"I support these features"
   ↓
Server
   ↓
"I support these features"
```

The client should not assume that a server supports a capability that it has not advertised.

# 11. MCP Communication Model

MCP is a client-server protocol.

The basic communication relationship is:

```
Host
  ↓
Client
  ⇄
Server
```

The client sends requests to the server and receives responses or notifications.

The communication is bidirectional at the protocol level, but the direction of each message type matters.

For example:

```
Client → Server
  tools/list
  tools/call
  resources/read
  prompts/get
```

The server can return:

```
Server → Client
  Response
  Notification
```

Some protocol revisions and optional features also support server requests to the client, such as sampling or elicitation-related interactions. These must be supported and handled according to the negotiated capabilities and specification version.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

# 12. MCP Transports

MCP separates protocol semantics from transport.

The protocol defines what messages mean.

The transport defines how those messages are delivered.

The standard transports include:

1. stdio

2. Streamable HTTP

Custom transports may also be implemented if they preserve the required MCP message and lifecycle semantics.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

## 12.1 stdio Transport

With stdio:

```
Client
   ↓
Launches MCP Server Process
   ↓
stdin / stdout
   ↓
JSON-RPC Messages
```

Conceptually:

```
Client Process
    │
    │ stdin
    ▼
MCP Server Process
    │
    │ stdout
    ▼
Client Process
```

The server reads messages from standard input and writes valid MCP messages to standard output.

This is useful for:

* local development

* local tools

* desktop AI applications

* isolated utility processes

The server may write logs to standard error, but standard output must contain only valid MCP messages.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

## 12.2 Streamable HTTP

With Streamable HTTP:

```
MCP Client
   ↓
HTTP POST
   ↓
MCP Endpoint
   ↓
MCP Server
   ↓
JSON Response or SSE Stream
```

This is useful for:

* remote enterprise services

* containerized MCP servers

* cloud deployment

* centralized integration services

* network-based access

The transport handles message delivery, while the MCP protocol defines the request and response semantics.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

# 13. Protocol Semantics vs Transport

This distinction is important.

```
MCP Protocol
    ↓
Defines:
- messages
- methods
- capabilities
- lifecycle
- errors
- semantics

Transport
    ↓
Defines:
- framing
- delivery
- connection behavior
- cancellation signaling
```

Therefore:

```
Same MCP Semantics
       ↓
Different Transport
       ├── stdio
       ├── Streamable HTTP
       └── Custom transport
```

The meaning of `tools/call` should remain the same regardless of the transport.

# 14. MCP Communication Example

Suppose an AI application wants production metrics.

### Step 1 — Client connects

```
AI Host
   ↓
MCP Client
   ↓
Production MCP Server
```

### Step 2 — Capability negotiation

```
Client
   ↓
Initialize
   ↓
Server capabilities
```

### Step 3 — Discover tools

```
Client
   ↓
tools/list
   ↓
Server
```

Response:

```
get_production_metrics
get_defect_summary
get_quality_trend
```

### Step 4 — Select a tool

The host or model selects:

```
get_production_metrics
```

### Step 5 — Invoke tool

```
Client
   ↓
tools/call
   ↓
Server
```

### Step 6 — Server executes

```
MCP Server
   ↓
Enterprise API
   ↓
Production Data
```

### Step 7 — Return result

```
Server
   ↓
JSON-RPC Response
   ↓
Client
   ↓
Host / Model
```

### Step 8 — Model uses context

```
Tool Result
   ↓
Model Context
   ↓
Reasoning
   ↓
Answer
```

# 15. How MCP Standardizes AI Integration

MCP standardizes the following integration concerns:

|
Concern

|

Standardization

|
| --- | --- |
|

Communication

|

JSON-RPC messages

|
|

Capability discovery

|

Tools, resources, prompts, capability negotiation

|
|

Invocation

|

Defined methods such as tool calls

|
|

Context access

|

Resource primitives

|
|

Reusable interaction patterns

|

Prompt primitives

|
|

Error handling

|

Structured JSON-RPC errors

|
|

Lifecycle

|

Initialization and capability negotiation

|
|

Transport

|

Standard transport bindings

|
|

Extensibility

|

Optional capabilities and extensions

|

This means an AI application can interact with multiple MCP servers using a consistent protocol rather than implementing a unique integration contract for each system.

# 16. MCP Does Not Standardize the Backend

MCP standardizes the interface, not the internal implementation.

For example:

```
MCP Tool
   ↓
CRM REST API
```

Another server may use:

```
MCP Tool
   ↓
SQL Query
```

Another may use:

```
MCP Tool
   ↓
Vendor SDK
```

The AI application sees the MCP capability contract, not the internal backend technology.

```
Stable MCP Interface
       ↓
Replaceable Implementation
```

This enables integration portability.

# 17. MCP and Context Engineering

MCP is also a context-delivery mechanism.

The host can retrieve relevant information from resources and provide it to the model.

```
User Question
    ↓
Host
    ↓
MCP Resource
    ↓
Relevant Context
    ↓
Model
    ↓
Reasoned Answer
```

For example:

```
User:
"Why did production quality decline?"
```

The host may retrieve:

```
Production metrics
Defect history
Operating thresholds
Approved quality procedures
```

The model then reasons over that context.

MCP does not dictate the model’s reasoning strategy. It provides standardized access to the context and capabilities needed by the application.

# 18. MCP and Tool Calling

Traditional tool calling may be implemented directly inside an application:

```
LLM
   ↓
Application-specific function
   ↓
External API
```

With MCP:

```
LLM / Host
   ↓
MCP Client
   ↓
MCP Server
   ↓
Tool
   ↓
External API
```

The tool remains callable, but its interface is exposed through a standardized protocol.

This makes tools more reusable across compatible AI applications.

# 19. MCP and Agents

MCP does not define an agent’s reasoning loop.

An agent may use MCP as follows:

```
Observe
   ↓
Reason
   ↓
Select MCP Tool
   ↓
Invoke Tool
   ↓
Observe Result
   ↓
Reason Again
```

MCP standardizes the interaction with the tool.

The agent framework controls:

* planning

* reasoning

* memory

* workflow

* iteration

* termination

* retries

For example:

```
Agent Framework
    ↓
MCP Client
    ↓
MCP Server
    ↓
External Capability
```

Therefore:

> MCP is an integration protocol used by agents, not an agent framework itself.

# 20. MCP and CWD

In CWD, MCP is primarily used at the Worker-to-enterprise-capability boundary.

```
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
MCP Client
    ↓
MCP Server
    ↓
Enterprise System
```

The Coordinator decides the business objective.

The Delegator decides which domain capability is needed.

The Worker performs the specialized execution.

MCP provides the standardized interface to the external capability.

## CWD Responsibility Separation

|
Component

|

Primary responsibility

|
| --- | --- |
|

Coordinator

|

Enterprise orchestration

|
|

Delegator

|

Domain decomposition and coordination

|
|

Worker

|

Specialized execution

|
|

LangGraph

|

Stateful workflow control

|
|

A2A

|

Agent-to-agent communication

|
|

MCP

|

Agent-to-tool/resource integration

|
|

MCP Server

|

System-specific capability implementation

|
|

Policy

|

Authorization and governance

|
|

Registry

|

Capability discovery

|

# 21. MCP in a CWD Example

Request:

> “Find production incidents affecting Line 4.”

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
Worker
   ↓
Delegator
   ↓
Coordinator
   ↓
User
```

The MCP server might expose:

```
search_incidents
get_incident_details
get_incident_history
```

The Worker does not need to know the internal API structure of the incident-management system.

# 22. MCP and LangGraph


### Practical takeaway for CWD

The most important architectural boundary is:

```
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
MCP Client
    ↓
MCP Server
    ↓
Enterprise System
```

MCP standardizes the integration contract; it does not decide the business workflow. LangGraph decides the next execution step, Policy decides whether an operation is permitted, and the MCP server implements the approved connection to the external system.

For production CWD, treat MCP as a governed capability boundary, not as unrestricted access to enterprise data or infrastructure.
