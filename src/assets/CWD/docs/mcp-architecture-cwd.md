# MCP Architecture: Hosts, Clients, Servers, and Capability Access

The Model Context Protocol (MCP) defines a standardized client–server architecture through which AI applications can discover and use external tools, resources, and prompts. It separates the AI application’s orchestration from the implementation of enterprise capabilities. MCP uses JSON-RPC-based protocol messages, lifecycle management, capability negotiation, and transport mechanisms to make these interactions consistent.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## 1. High-level architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         MCP Host                              │
│              AI application / agent runtime                   │
│                                                              │
│  ┌──────────────────────┐    ┌────────────────────────────┐  │
│  │       MCP Client     │    │       MCP Client            │  │
│  │                      │    │                            │  │
│  │  Session with        │    │  Session with               │  │
│  │  Server A            │    │  Server B                   │  │
│  └──────────┬───────────┘    └─────────────┬──────────────┘  │
└─────────────┼──────────────────────────────┼────────────────┘
              │                              │
       MCP protocol                   MCP protocol
              │                              │
┌─────────────▼──────────────┐   ┌───────────▼────────────────┐
│         MCP Server A       │   │        MCP Server B        │
│                            │   │                            │
│ Tools                      │   │ Tools                      │
│ Resources                  │   │ Resources                  │
│ Prompts                    │   │ Prompts                    │
│                            │   │                            │
│ CRM / ERP / Database       │   │ Search / Files / APIs      │
└─────────────┬──────────────┘   └───────────┬────────────────┘
              │                              │
              ▼                              ▼
       Enterprise systems              Enterprise systems
```

The host manages the overall AI application and its client connections. Each client maintains a protocol connection to one server, while the server exposes a focused set of capabilities. The host can aggregate context from multiple servers without giving each server access to the entire conversation or to other servers’ data.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

## 2. MCP Host

### Definition

The MCP host is the AI application or agent runtime that wants to use external capabilities.

Examples include:

* An enterprise AI assistant

* A coding assistant

* A CWD Worker runtime

* A desktop AI application

* An agent platform

* An AI-powered development environment

The host is responsible for the broader application experience and for managing its MCP clients.

### Main responsibilities

|
Responsibility

|

Explanation

|
| --- | --- |
|

Manage user interaction

|

Receives the user request and presents the response

|
|

Run the AI model

|

Uses the model to reason, plan, or generate responses

|
|

Manage context

|

Determines what conversation and external context should be available

|
|

Create MCP clients

|

Establishes connections to required MCP servers

|
|

Manage security boundaries

|

Controls which servers and capabilities the application can use

|
|

Aggregate results

|

Combines information returned from multiple servers

|
|

Enforce application-level policy

|

Applies authorization, confirmation, and data-handling rules

|

### Important distinction

The host is not the MCP server.

```
Host = AI application that consumes capabilities
Server = Component that provides capabilities
```

## 3. MCP Client

An MCP client is the protocol component inside the host that communicates with an MCP server.

The client is responsible for maintaining the MCP session and exchanging protocol messages with its connected server.

```
MCP Host
   │
   ├── MCP Client A ───── Session ───── MCP Server A
   │
   └── MCP Client B ───── Session ───── MCP Server B
```

### Client responsibilities

* Establish the connection

* Initialize the MCP session

* Negotiate supported capabilities

* Discover available tools, resources, and prompts

* Send requests

* Receive responses

* Handle notifications

* Manage transport-level communication

* Expose the server’s capabilities to the host application

### One client–one server relationship

The standard architecture describes each MCP client as communicating with one MCP server. A host may manage multiple clients to connect to multiple servers.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

This provides isolation:

```
Client A ↔ Server A
Client B ↔ Server B
```

The host decides how results from those sessions are combined.

## 4. MCP Server

An MCP server is a focused provider of external capabilities.

It exposes a standardized interface while hiding the implementation details of the underlying system.

```
MCP Server
   ├── Tool definitions
   ├── Resource definitions
   ├── Prompt definitions
   ├── Input validation
   ├── Backend adapters
   ├── Authorization integration
   └── Enterprise system connectivity
```

An MCP server may wrap:

* REST APIs

* Internal microservices

* Databases

* File repositories

* SaaS platforms

* Cloud services

* Search systems

* Business applications

The server does not have to implement the backend using a particular programming language or framework. MCP standardizes the interface, not the internal implementation.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

### Example

```
MCP CRM Server
   ├── get_customer_profile
   ├── search_opportunities
   ├── get_case_history
   └── create_support_case
```

The Worker sees the approved capability contract rather than the CRM’s internal SDK, database schema, or API implementation.

# 5. MCP capability primitives

MCP servers commonly expose three major capability types:

```
MCP Server
   ├── Tools
   ├── Resources
   └── Prompts
```

They serve different purposes.

|
Primitive

|

Main purpose

|

Typical interaction

|
| --- | --- | --- |
|

Tools

|

Perform an operation

|

Client calls a tool

|
|

Resources

|

Provide contextual data

|

Client reads or retrieves a resource

|
|

Prompts

|

Provide reusable prompt templates

|

Client retrieves or uses a prompt

|

## 5.1 Tools

A tool is an operation that an AI application can invoke through the MCP server.

Examples:

```
get_customer_profile
search_orders
retrieve_inventory
create_service_ticket
run_approved_report
```

A tool generally includes:

* Name

* Description

* Input schema

* Optional output schema

* Execution behavior implemented by the server

### Conceptual tool definition

JSON

```
{
  "name": "get_customer_profile",
  "description": "Retrieve an authorized customer profile",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": {
        "type": "string"
      }
    },
    "required": ["customer_id"]
  }
}
```

### Tool invocation flow

```
Host / Worker
      ↓
MCP Client
      ↓
tools/call
      ↓
MCP Server
      ↓
Enterprise API
      ↓
Tool result
      ↓
MCP Client
      ↓
Host / Worker
```

Tools are action-oriented. They are appropriate when the application needs to perform an operation rather than merely retrieve context. MCP’s tool model includes discovery and invocation semantics.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

## 5.2 Resources

A resource represents contextual information that can be made available through the MCP server.

Examples:

```
customer://12345/profile
file:///reports/monthly-sales.csv
database://sales/schema
knowledge://manufacturing/safety-policy
```

Resources may represent:

* Documents

* Files

* Database information

* Application state

* Configuration

* Knowledge content

* Other contextual data

### Resource flow

```
Host
  ↓
MCP Client
  ↓
Discover or read resource
  ↓
MCP Server
  ↓
Underlying data source
  ↓
Resource content
  ↓
Host context
```

### Tools versus resources

```
Tool:
"Perform an operation."

Resource:
"Provide information or context."
```

For example:

```
Tool:
get_customer_profile(customer_id)

Resource:
customer://12345/profile
```

A tool may retrieve or transform information, while a resource provides a standardized way to expose contextual data.

## 5.3 Prompts

A prompt is a reusable prompt template exposed by an MCP server.

Prompts help standardize how an application requests a particular kind of assistance or task.

Examples:

```
analyze_incident
summarize_customer_history
review_purchase_order
generate_monthly_report
```

A prompt may include:

* Prompt name

* Description

* Arguments

* Structured message content

* Reusable instructions or context references

### Prompt flow

```
Host
  ↓
MCP Client
  ↓
prompts/get
  ↓
MCP Server
  ↓
Prompt template + arguments
  ↓
Host / model
```

Prompts are different from tools:

```
Prompt = Reusable instructions or task template
Tool   = Executable operation
Resource = Contextual information
```

# 6. Protocol messages

MCP communication uses JSON-RPC 2.0 semantics. The protocol defines requests, responses, and notifications.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## 6.1 Request

A request asks the other party to perform an operation.

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

Important fields:

|
Field

|

Meaning

|
| --- | --- |
|

`jsonrpc`

|

Protocol version

|
|

`id`

|

Unique request identifier

|
|

`method`

|

Operation being requested

|
|

`params`

|

Optional request arguments

|

## 6.2 Response

A response returns either a result or an error for a request.

### Successful response

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_customer_profile",
        "description": "Retrieve an authorized customer profile"
      }
    ]
  }
}
```

### Error response

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Method not found"
  }
}
```

The response uses the same request ID so the client can correlate the result with the original request.

## 6.3 Notification

A notification is a message that does not require a response.

JSON

```
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

Notifications can communicate events or state changes without creating a request–response exchange.

```
Request       → Response required
Notification  → No response required
```

# 7. MCP lifecycle

Before normal operations begin, the client and server establish an MCP session.

```
Client                         Server
   │                              │
   │──── initialize ─────────────>│
   │                              │
   │<─── initialize response ─────│
   │                              │
   │──── initialized ────────────>│
   │                              │
   │──── Normal operations ──────>│
   │<─── Responses / events ──────│
```

## Lifecycle stages

### 7.1 Initialization

The client sends initialization information such as:

* Protocol version

* Client information

* Supported client capabilities

### 7.2 Capability negotiation

The server responds with:

* Supported protocol version

* Server information

* Supported server capabilities

### 7.3 Normal operation

The client can then:

* List tools

* Read resources

* Retrieve prompts

* Call tools

* Receive notifications

### 7.4 Shutdown

The session is closed when the host or server no longer needs the connection.

The lifecycle allows both sides to establish compatibility before normal operations begin.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

# 8. Capability negotiation

MCP is designed so that clients and servers do not assume every feature is available.

For example:

```
Server capabilities:
- tools
- resources
- prompts
```

A client may support:

```
Client capabilities:
- sampling
- roots
```

The client should use only capabilities that the server advertises, and the server should use only client features that are supported.

```
Client capabilities
        ↕
Capability negotiation
        ↕
Server capabilities
```

This makes the protocol extensible and avoids hardcoded assumptions about server functionality.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

# 9. Transports

A transport defines how MCP messages are delivered between the client and server.

MCP separates the protocol semantics from the transport mechanism. The same JSON-RPC and lifecycle behavior can operate over different transports.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub+1

## 9.1 stdio transport

Used commonly for local processes.

```
MCP Host
   ↓
MCP Client
   ↓ stdin/stdout
Local MCP Server Process
```

Characteristics:

* Local communication

* Server often runs as a subprocess

* Messages are exchanged through standard input and output

* Useful for local tools and desktop applications

## 9.2 Streamable HTTP transport

Used for remote MCP servers.

```
MCP Host
   ↓
MCP Client
   ↓ HTTP
Remote MCP Server
   ↓
Enterprise Services
```

Characteristics:

* Remote communication

* HTTP-based message delivery

* Suitable for hosted enterprise capabilities

* Can support streaming responses and server-to-client communication according to the transport specification

MCP’s standard transports include stdio and Streamable HTTP. Custom transports are possible when they preserve the required protocol semantics.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub+1

# 10. How the components interact

Consider a Worker that needs customer order information.

## Step 1: Host receives the request

```
User:
"Show me the customer's recent orders."
```

The host uses its model and application logic to determine that an external capability is required.

## Step 2: Host selects an MCP client

```
Host
   ↓
MCP Client for Order Management Server
```

## Step 3: Client initializes the session

```
initialize
    ↓
Capability negotiation
    ↓
initialized
```

## Step 4: Client discovers tools

```
MCP Client → tools/list → MCP Server
```

The server returns available tools and their schemas.

## Step 5: Host or Worker selects a tool

```
get_customer_orders
```

The model may recommend the tool, but the application must still apply authorization and policy before execution.

## Step 6: Client sends the request

JSON

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_customer_orders",
    "arguments": {
      "customer_id": "C12345"
    }
  }
}
```

## Step 7: Server executes the capability

```
MCP Server
   ↓
Validate input
   ↓
Check access policy
   ↓
Call Order Management API
   ↓
Normalize result
```

## Step 8: Server returns the result

```
MCP Server
   ↓
JSON-RPC response
   ↓
MCP Client
   ↓
Host / Worker
```

## Step 9: Host uses the result

The host may:

* Add the data to the model context

* Ask the model to summarize it

* Pass it to a Worker for business processing

* Continue the workflow

* Request another tool

# 11. MCP architecture inside CWD

Within CWD, MCP is primarily used at the Worker-to-enterprise-capability boundary.

```
┌──────────────────────────────────────────────┐
│                  CWD                         │
│                                              │
│  Coordinator                                 │
│      ↓                                       │
│  Delegator                                   │
│      ↓                                       │
│  Worker                                      │
│      ↓                                       │
│  MCP Client                                  │
└──────┬───────────────────────────────────────┘
       │
       │ MCP protocol
       ▼
┌──────────────────────────────────────────────┐
│              MCP Server                      │
│                                              │
│  Approved tools                              │
│  Resources                                   │
│  Prompts                                     │
│  Validation                                  │
│  Backend adapters                            │
└──────┬───────────────────────────────────────┘
       │
       ▼
Enterprise systems
```

### Responsibility separation

|
Component

|

What it controls

|
| --- | --- |
|

Coordinator

|

Overall intent, planning, authorization, and workflow

|
|

Delegator

|

Domain decomposition and Worker coordination

|
|

Worker

|

Specialized execution and business logic

|
|

MCP Client

|

Protocol communication

|
|

MCP Server

|

Capability exposure and backend integration

|
|

Policy service

|

Authorization and governance

|
|

LangGraph

|

State, transitions, retries, recovery, and approvals

|
|

Enterprise system

|

Actual business operation

|

The Worker does not need to know every backend implementation detail. It uses the MCP client to access an approved capability through a consistent interface.

# 12. Example: CWD Worker using an MCP tool

Python

Run

```
# Conceptual example: simplified MCP interaction inside a CWD Worker

class OrderWorker:
    def __init__(self, mcp_client, policy_service):
        self.mcp_client = mcp_client
        self.policy_service = policy_service

    async def execute(self, task):
        # 1. Validate the task
        customer_id = task["customer_id"]

        # 2. Apply CWD authorization before tool execution
        await self.policy_service.authorize(
            action="get_customer_orders",
            user=task["user"],
            agent=task["agent"],
            resource=customer_id,
        )

        # 3. Discover or use an approved MCP capability
        tools = await self.mcp_client.list_tools()

        # 4. Confirm that the required tool is available
        tool_names = [tool["name"] for tool in tools]

        if "get_customer_orders" not in tool_names:
            raise RuntimeError("Required MCP capability is unavailable")

        # 5. Invoke the standardized MCP tool
        result = await self.mcp_client.call_tool(
            "get_customer_orders",
            {"customer_id": customer_id},
        )

        # 6. Validate and return the result to CWD
        return {
            "status": "success",
            "customer_id": customer_id,
            "orders": result,
        }
```

This is conceptual code, not a complete production MCP SDK implementation. The important architectural point is that the Worker uses a standardized client interface instead of embedding a custom CRM or order-management integration.

# 13. What MCP standardizes—and what it does not

## MCP standardizes

* Client–server communication

* JSON-RPC message semantics

* Session lifecycle

* Capability negotiation

* Tool discovery and invocation

* Resource access

* Prompt retrieval

* Transport-independent protocol behavior

## MCP does not automatically provide

* Enterprise authorization

* Identity management

* Business workflow orchestration

* Retry policy

* Checkpointing

* Human approval

* Agent planning

* Worker selection

* Data governance

* Complete security controls

Therefore:

```
MCP = Standardized capability-access protocol

CWD = Enterprise orchestration and governance architecture
```

# 14. Complete interaction model

```
1. User submits request
          ↓
2. MCP Host receives request
          ↓
3. Host selects or creates MCP Client
          ↓
4. Client initializes MCP session
          ↓
5. Client and Server negotiate capabilities
          ↓
6. Client discovers tools/resources/prompts
          ↓
7. Host or Worker selects an approved capability
          ↓
8. Client sends JSON-RPC request
          ↓
9. MCP Server validates and executes
          ↓
10. Enterprise system performs operation
          ↓
11. Server returns JSON-RPC result/error
          ↓
12. Client delivers result to Host
          ↓
13. Host adds context or continues workflow
          ↓
14. CWD applies validation, routing, retry,
    approval, aggregation, or completion
```

## Final definition

MCP architecture is a standardized host–client–server model in which an AI host manages MCP clients, each client communicates with an MCP server, and servers expose tools, resources, and prompts through JSON-RPC-based protocol messages. Lifecycle management and capability negotiation establish compatible sessions, while transports such as stdio and Streamable HTTP deliver the messages. In CWD, this architecture provides a consistent boundary through which Workers access governed enterprise capabilities without embedding point-to-point integrations into every agent.

### Core relationship

```
Host     = AI application
Client   = Protocol connector
Server   = Capability provider
Tool     = Executable operation
Resource = Contextual information
Prompt   = Reusable instruction template
Message  = JSON-RPC communication
Transport = Message delivery mechanism
```

MCP standardizes how AI applications access capabilities; CWD and LangGraph determine why, when, and under what governance those capabilities are used.


### CWD architectural takeaway

```
Coordinator
    ↓  Plans and governs
Delegator
    ↓  Decomposes and routes
Worker
    ↓  Executes specialized logic
MCP Client
    ↓  Sends standardized protocol messages
MCP Server
    ↓  Exposes approved tools, resources, and prompts
Enterprise System
```

The essential distinction is:

> MCP defines the communication contract for accessing external capabilities. CWD defines the enterprise execution architecture, and LangGraph controls the workflow state and progression around those capability calls.
