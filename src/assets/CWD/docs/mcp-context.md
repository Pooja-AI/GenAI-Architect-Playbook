# MCP as a Standardized Context and Capability Access Layer

Model Context Protocol (MCP) enables an AI application to connect to external information and capabilities through a consistent client-server interface. Instead of building a separate integration for every database, document system, API, or business service, the application can discover what an MCP server offers and then request the relevant resources or invoke the appropriate tools.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog+1

The central idea is:

> The AI application decides what context or capability it needs; MCP standardizes how that context or capability is discovered and accessed.

## 1. The problem MCP solves

Without MCP, an agent may need many independent integrations:

```
Agent
 ├── Custom CRM integration
 ├── Custom ERP integration
 ├── Custom document-search integration
 ├── Custom database integration
 ├── Custom ticketing integration
 └── Custom monitoring integration
```

Each integration may have different:

* Authentication mechanisms

* API formats

* Request and response schemas

* Error-handling patterns

* Discovery mechanisms

* Permission models

* Logging and observability requirements

MCP introduces a common integration boundary:

```
                         AI Application / Agent
                                  │
                                  ▼
                            MCP Client
                                  │
                         Standard MCP protocol
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              MCP Server A  MCP Server B  MCP Server C
                    │             │             │
                    ▼             ▼             ▼
                  CRM           ERP       Knowledge Base
```

The AI application does not need to understand every backend implementation. It needs to understand the MCP contract exposed by the server.

## 2. The MCP host-client-server model

MCP separates the AI application from the systems that provide context and capabilities.

|
Component

|

Responsibility

|
| --- | --- |
|

Host

|

The AI application that manages the conversation, model interaction, security boundary, and context aggregation

|
|

MCP Client

|

The protocol component inside the host that communicates with an MCP server

|
|

MCP Server

|

Exposes resources, tools, prompts, and other supported capabilities

|
|

Enterprise backend

|

The actual system containing data or implementing the business operation

|

A host may manage multiple MCP clients, while each client communicates with a particular MCP server connection. Servers can be local or remote, depending on the deployment and transport.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog

```
┌───────────────────────────────────────────────┐
│ AI Host Application                           │
│                                               │
│  Conversation Manager                         │
│  LLM / Agent Runtime                          │
│  Context Manager                              │
│                                               │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ MCP Client 1 │  │ MCP Client 2 │           │
│  └──────┬───────┘  └──────┬───────┘           │
└─────────┼──────────────────┼──────────────────┘
          │                  │
          ▼                  ▼
    MCP Server A       MCP Server B
          │                  │
          ▼                  ▼
       CRM/API          Knowledge/API
```

The host maintains the broader application context. An MCP server should expose only the information and capabilities appropriate to its own boundary rather than receiving the entire conversation or data from unrelated servers.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog

## 3. The three primary MCP primitives

MCP standardizes several types of interaction.

|
Primitive

|

Meaning

|

Example

|
| --- | --- | --- |
|

Resources

|

Read-oriented contextual information

|

Read a policy, customer record, document, or application status

|
|

Tools

|

Callable operations or capabilities

|

Search orders, create a ticket, calculate a value, or update a record

|
|

Prompts

|

Reusable prompt templates

|

Generate a standard incident-investigation prompt

|

### Resource example

```
knowledge://policies/fulfillment-policy
```

The agent reads the policy to understand the business rules.

### Tool example

```
create_support_case
```

The agent invokes the tool when it needs to create a case.

### Prompt example

```
incident-investigation-template
```

The host retrieves a reusable prompt structure for a particular task.

Resources provide context, tools provide capabilities, and prompts provide reusable interaction patterns.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog

## 4. How MCP provides the appropriate information

MCP does not automatically determine the best context for every user request. Instead, it provides the mechanisms through which the host or agent can:

1. Discover available servers and capabilities.

2. Discover available resources and tools.

3. Understand their descriptions and schemas.

4. Select the relevant resource or tool.

5. Request the resource or invoke the tool.

6. Receive the result.

7. Add the result to the model’s working context.

8. Continue reasoning or execution.

   User Request
   ↓
   AI Host interprets intent
   ↓
   Identify required context or capability
   ↓
   MCP Client discovers available options
   ↓
   Select relevant resource/tool
   ↓
   Read resource or call tool
   ↓
   Receive result
   ↓
   Validate and add appropriate result to context
   ↓
   LLM / Agent continues execution

The selection decision may involve the LLM, application logic, registry metadata, policy, or a combination of these. MCP standardizes the communication contract, not the reasoning algorithm that selects the capability.

## 5. Server and capability discovery

Before using a server, the client needs to understand what the server supports.

In the current MCP specification, the `2026-07-28` release introduces `server/discover`, which allows a client to learn server identity, supported protocol versions, and capabilities before issuing other requests. Earlier protocol versions use the initialization and capability-negotiation lifecycle. Implementations must therefore follow the lifecycle appropriate to the negotiated protocol version.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog+1

Conceptual discovery response:

JSON

```
{
  "serverInfo": {
    "name": "enterprise-knowledge-server",
    "version": "1.0.0"
  },
  "capabilities": {
    "resources": {},
    "tools": {},
    "prompts": {}
  }
}
```

This tells the client that the server may provide:

* Resources

* Tools

* Prompts

The client should not assume that an unsupported capability exists.

## 6. Discovering resources

Once the client knows that a server supports resources, it can discover the available resource catalog.

Conceptual request:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list",
  "params": {}
}
```

Conceptual response:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resources": [
      {
        "uri": "knowledge://policies/fulfillment-policy",
        "name": "Fulfillment Policy",
        "description": "Approved fulfillment and delivery rules",
        "mimeType": "text/markdown"
      },
      {
        "uri": "crm://customers/CUST-10452",
        "name": "Customer Record",
        "description": "Authorized customer profile information",
        "mimeType": "application/json"
      }
    ]
  }
}
```

The catalog gives the client enough information to determine:

* What resources exist

* What each resource represents

* Which URI identifies the resource

* What content format may be returned

The actual resource list is server-specific. A server may expose static resources, dynamic resource templates, or both.

## 7. Discovering tools

Tools are discovered separately from resources.

Conceptual request:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

Conceptual response:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "search_orders",
        "description": "Search orders using authorized criteria",
        "inputSchema": {
          "type": "object",
          "properties": {
            "customer_id": {
              "type": "string"
            },
            "status": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      {
        "name": "create_support_case",
        "description": "Create a support case for an authorized customer",
        "inputSchema": {
          "type": "object",
          "properties": {
            "customer_id": {
              "type": "string"
            },
            "summary": {
              "type": "string"
            }
          },
          "required": [
            "customer_id",
            "summary"
          ],
          "additionalProperties": false
        }
      }
    ]
  }
}
```

A tool definition normally communicates:

* Tool name

* Human-readable description

* Input schema

* Optional annotations or metadata

* Capability-specific information

The input schema helps the host or model construct a valid request. It does not replace server-side validation or authorization. MCP tool discovery and invocation are standardized, while the server remains responsible for implementing and governing the capability.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog+1

## 8. Discovery is not authorization

This distinction is essential in enterprise architecture.

```
Tool/resource appears in catalog
             ≠
Caller is authorized to use it
```

A server may expose a general catalog while restricting actual access based on:

* User identity

* Agent identity

* Worker identity

* Role or group

* Tenant

* Region

* Data classification

* Record ownership

* Approval status

* Environment

* Business policy

For example:

```
Discovered resource:
  crm://customers/{customer_id}

Requested record:
  crm://customers/CUST-10452

Authorization check:
  Is this Worker allowed to read this customer?
```

The server must enforce the answer independently of the model’s selection.

## 9. How the host selects relevant context

The selection process can be implemented in several ways.

### 9.1 LLM-assisted selection

The host provides the discovered catalog to the model:

```
Available resources:
- Fulfillment policy
- Customer record
- Order record

Available tools:
- Search orders
- Create support case
```

The model identifies what is needed:

```
User asks:
"Why is order ORD-1001 delayed?"

Model decision:
1. Read order record
2. Read fulfillment policy
3. Compare status with policy
```

### 9.2 Deterministic application selection

The host may select resources using explicit application logic:

Python

Run

```
if intent == "order_investigation":
    required_resources = [
        "order_record",
        "fulfillment_policy",
    ]
```

### 9.3 Registry- or metadata-driven selection

The host may filter capabilities using metadata:

Python

Run

```
candidate_resources = [
    resource
    for resource in discovered_resources
    if resource["domain"] == "order-management"
]
```

### 9.4 Hybrid selection

A production system commonly combines:

```
LLM recommendation
       ↓
Capability metadata filtering
       ↓
Policy validation
       ↓
Approved resource/tool selection
       ↓
MCP request
```

This prevents the LLM from being the sole authority for enterprise access.

## 10. Reading the selected resource

After selecting a resource, the client requests its contents.

Conceptual request:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/read",
  "params": {
    "uri": "knowledge://policies/fulfillment-policy"
  }
}
```

Conceptual response:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "contents": [
      {
        "uri": "knowledge://policies/fulfillment-policy",
        "mimeType": "text/markdown",
        "text": "# Fulfillment Policy\n\n..."
      }
    ]
  }
}
```

The host or Worker then decides how to use the returned content:

```
Resource content
      ↓
Validate format and provenance
      ↓
Apply data classification rules
      ↓
Select relevant portions
      ↓
Add permitted content to model context
```

MCP supplies the content; the host controls how much of it enters the model context.

## 11. Invoking the selected tool

When the agent needs an operation rather than read-only information, the client invokes a tool.

Conceptual request:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "search_orders",
    "arguments": {
      "customer_id": "CUST-10452",
      "status": "delayed"
    }
  }
}
```

The server then:

1. Confirms that the tool exists.

2. Validates the arguments against its schema.

3. Checks identity and authorization.

4. Applies business rules.

5. Calls the approved backend service.

6. Returns the result or an error.

   MCP Client
   ↓
   tools/call
   ↓
   MCP Server
   ↓
   Schema validation
   ↓
   Authorization
   ↓
   Business validation
   ↓
   Enterprise API
   ↓
   Structured result
   ↓
   MCP Client

Tool discovery tells the host what can be called. Tool invocation requests a specific operation with specific arguments.

## 12. How results become agent context

MCP does not directly “think” or independently update the LLM’s memory. The host receives the result and decides how to incorporate it into the next model interaction.

```
MCP Result
    ↓
Host receives response
    ↓
Validate result
    ↓
Normalize or transform content
    ↓
Apply filtering and truncation
    ↓
Attach to working context
    ↓
LLM reasons over the new information
```

Example:

```
User:
"Is the order delayed according to policy?"

Context assembled by host:
- Order status from ERP resource
- Fulfillment policy from knowledge resource
- Search results from order tool
```

The model can now produce a grounded answer:

```
"The order is delayed, but the current status is still within
the policy's permitted fulfillment window."
```

The host may also preserve structured values separately from the natural-language context:

JSON

```
{
  "workflowState": {
    "orderStatus": "delayed",
    "policyWindowExceeded": false
  },
  "modelContext": [
    "Relevant order details...",
    "Relevant policy content..."
  ]
}
```

This separation is particularly important in CWD because workflow state should not depend entirely on free-form LLM text.

## 13. MCP communication semantics

MCP uses JSON-RPC-based communication. The protocol defines request, response, and notification semantics, while transports define how messages are delivered. Official transports include standard input/output for local integrations and Streamable HTTP for remote integrations.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog+1

### Request

A request asks the server to perform a protocol operation.

JSON

```
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "resources/read",
  "params": {
    "uri": "knowledge://policies/security-policy"
  }
}
```

### Response

A response correlates with the request using the same identifier.

JSON

```
{
  "jsonrpc": "2.0",
  "id": 10,
  "result": {
    "contents": []
  }
}
```

### Error response

JSON

```
{
  "jsonrpc": "2.0",
  "id": 10,
  "error": {
    "code": -32602,
    "message": "Invalid resource URI"
  }
}
```

### Notification

A notification communicates an event without requiring a response. For example, a server may notify the client that its resource or tool catalog has changed, when the relevant capability is supported.

## 14. Resource and tool discovery in CWD

Within the CWD architecture, discovery should be separated into two levels.

### CWD-level agent discovery

The Coordinator or Delegator discovers:

* Which Delegator is responsible for the domain

* Which Worker has the required capability

* Which Worker is healthy and authorized

* Which execution path should be used

### MCP-level capability discovery

The selected Worker discovers:

* Which MCP server is available

* Which resources it exposes

* Which tools it exposes

* Which schemas and formats are supported

  Coordinator
  ↓
  Delegator
  ↓
  Agent Registry
  ↓
  Select authorized Worker
  ↓
  Worker
  ↓
  MCP Client
  ↓
  Discover MCP server capabilities
  ↓
  Discover resources/tools
  ↓
  Select relevant capability
  ↓
  Read resource or invoke tool

The two discovery mechanisms solve different problems:

|
Discovery layer

|

Question answered

|
| --- | --- |
|

Agent Registry / CWD

|

Which agent or Worker should perform the task?

|
|

MCP discovery

|

Which external resources or tools can that Worker use?

|

## 15. End-to-end CWD example

### User request

> “Investigate the delayed order and determine whether it violates the fulfillment policy.”

### Workflow

```
1. User submits request
        ↓
2. Coordinator identifies order-investigation intent
        ↓
3. Coordinator checks authorization
        ↓
4. Delegator selects Order Investigation Worker
        ↓
5. Worker connects to the approved MCP server
        ↓
6. MCP Client discovers resources and tools
        ↓
7. Worker selects:
      - Order resource
      - Fulfillment-policy resource
        ↓
8. MCP Client reads both resources
        ↓
9. MCP Server validates and authorizes access
        ↓
10. Enterprise systems return approved data
        ↓
11. Worker validates and compares the information
        ↓
12. LangGraph updates CWD execution state
        ↓
13. Coordinator aggregates the findings
        ↓
14. LLM generates the final response
```

The key flow is:

```
CWD selects the Worker
        ↓
MCP discovers the Worker’s available capabilities
        ↓
Worker selects the relevant resource/tool
        ↓
MCP retrieves context or executes the capability
        ↓
CWD continues the governed workflow
```

## 16. MCP versus LangGraph and A2A

|
Technology

|

Main responsibility

|
| --- | --- |
|

MCP

|

Standardizes access to resources, tools, and prompts

|
|

LangGraph

|

Controls workflow state, transitions, retries, checkpoints, and recovery

|
|

A2A

|

Enables communication between agents

|
|

Agent Registry

|

Discovers and selects agents or Workers

|
|

Policy service

|

Enforces authorization and governance

|
|

LLM

|

Interprets intent, reasons over context, and recommends or generates actions

|

### Example

```
LangGraph:
  "The next step is to investigate the order."

A2A:
  "Send the investigation task to the Order Delegator."

Agent Registry:
  "Select an authorized Order Investigation Worker."

MCP:
  "Read the order record and fulfillment policy."

LLM:
  "Compare the retrieved information and explain the result."
```

MCP is therefore not a replacement for CWD orchestration. It is the standardized capability-access boundary used by the agents inside that orchestration.

## 17. Security and governance

MCP makes integrations consistent, but it does not automatically make them secure.

A production implementation should enforce:

* Authentication of the client and server

* Authorization for every resource and tool request

* Least-privilege access

* Input-schema and business validation

* Data classification and redaction

* Tenant and region isolation

* Rate limits and timeouts

* Audit logging

* Sensitive-operation approval

* Output validation

* Secure transport and network controls

The official MCP tool guidance specifically emphasizes input validation, access controls, rate limiting, output sanitization, timeouts, audit logs, and confirmation for sensitive operations.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog

A safe enterprise flow is:

```
LLM recommends capability
        ↓
Host / CWD checks policy
        ↓
MCP Client sends request
        ↓
MCP Server validates identity and arguments
        ↓
Backend authorization
        ↓
Approved resource read or tool execution
        ↓
Result filtering and validation
        ↓
Context returned to Worker
```

## 18. Important architectural principle

MCP standardizes capability access, not autonomous authority.

The LLM may recommend:

```
"Read the customer record."
```

But the system must still determine:

```
Is the resource available?
Is the Worker authorized?
Is the requested record permitted?
Is the data safe to provide?
Is the operation within policy?
```

Similarly, the LLM may recommend:

```
"Create a support case."
```

But CWD and the MCP server must enforce:

```
Is case creation allowed?
Is approval required?
Are the arguments valid?
Is the request idempotent?
Should the operation be executed now?
```

This separation prevents the model from becoming an unrestricted gateway to enterprise systems.

## Final definition

MCP enables standardized access to relevant context and capabilities by allowing an AI host to connect through MCP clients to servers that advertise resources, tools, prompts, and supported capabilities. The client discovers the available interfaces, examines their descriptions and schemas, selects the appropriate resource or tool, requests the information or invokes the operation, receives a structured result, and provides the permitted result to the AI application or agent for further reasoning and execution.

In CWD:

CWD selects the Worker→MCP discovers capabilities→Worker selects the resource/tool→MCP retrieves context or executes capability→CWD continues the workflow\boxed{ \text{CWD selects the Worker} \rightarrow \text{MCP discovers capabilities} \rightarrow \text{Worker selects the resource/tool} \rightarrow \text{MCP retrieves context or executes capability} \rightarrow \text{CWD continues the workflow} }CWD selects the Worker→MCP discovers capabilities→Worker selects the resource/tool→MCP retrieves context or executes capability→CWD continues the workflow

### Core formula

Relevant Agent Context=Intent+Capability Discovery+Resource/Tool Selection+Authorization+MCP Request+Validated Result\boxed{ \text{Relevant Agent Context} = \text{Intent} + \text{Capability Discovery} + \text{Resource/Tool Selection} + \text{Authorization} + \text{MCP Request} + \text{Validated Result} }Relevant Agent Context=Intent+Capability Discovery+Resource/Tool Selection+Authorization+MCP Request+Validated Result

### Key takeaway

> MCP provides the standardized bridge between an AI application and external context or capabilities. The host determines what information is needed, the MCP client discovers and requests it, the MCP server governs and supplies it, and CWD controls how the resulting information is used in the enterprise workflow.
