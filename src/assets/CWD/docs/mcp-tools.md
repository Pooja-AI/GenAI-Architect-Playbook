# Exposing Enterprise Capabilities as MCP Tools

Within CWD, an enterprise capability becomes an MCP tool when an MCP server wraps an approved business operation behind a standardized interface. The Worker does not directly implement the backend integration; it discovers the tool, supplies validated arguments, and receives a structured result or error.

```
Enterprise API / Business Service
             ↓
       Backend Adapter
             ↓
       MCP Tool Handler
             ↓
       MCP Server
             ↑
        MCP Client
             ↑
          Worker
```

The complete lifecycle is:

Discover→Select→Validate→Authorize→Invoke→Execute→Normalize→Return\text{Discover} \rightarrow \text{Select} \rightarrow \text{Validate} \rightarrow \text{Authorize} \rightarrow \text{Invoke} \rightarrow \text{Execute} \rightarrow \text{Normalize} \rightarrow \text{Return}Discover→Select→Validate→Authorize→Invoke→Execute→Normalize→Return

MCP standardizes tool discovery and invocation through its protocol, while the server implements the actual enterprise operation.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## 1. What is an MCP tool?

An MCP tool is a named, callable capability exposed by a server.

For example, an Order Management MCP server might expose:

```
get_customer_orders
get_order_status
search_delayed_orders
create_support_case
```

Each tool represents a specific operation rather than an unrestricted connection to the underlying system.

```
Tool name:
get_order_status

Business meaning:
Retrieve the status of one authorized order.

Backend implementation:
Call the internal Order Management API.
```

The MCP server hides backend-specific details such as REST endpoints, SDKs, database queries, authentication adapters, and response transformation.

## 2. Tool exposure architecture

```
┌──────────────────────────────────────────────────────┐
│                  CWD Worker                          │
│                                                      │
│  Business logic                                      │
│  Task validation                                     │
│  Result interpretation                               │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│                   MCP Client                         │
│                                                      │
│  Session management                                  │
│  Tool discovery                                      │
│  JSON-RPC requests                                   │
│  Response handling                                   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│                   MCP Server                         │
│                                                      │
│  Tool catalog                                        │
│  Input schema validation                             │
│  Authorization and policy checks                     │
│  Tool handlers                                       │
│  Backend adapters                                    │
│  Result normalization                                │
│  Error mapping                                       │
│  Audit and telemetry                                │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
              Enterprise API
              Business service
              Database
```

The server exposes a capability contract; the backend adapter performs the actual operation.

# 3. Tool discovery

Before invoking a tool, the MCP client can discover the tools exposed by the server.

```
Worker
  ↓
MCP Client
  ↓
tools/list
  ↓
MCP Server
  ↓
Available tool definitions
```

A discovery response may conceptually contain:

JSON

```
{
  "tools": [
    {
      "name": "get_order_status",
      "description": "Retrieve the status of an authorized order",
      "inputSchema": {
        "type": "object",
        "properties": {
          "order_id": {
            "type": "string"
          }
        },
        "required": ["order_id"]
      }
    }
  ]
}
```

The tool list tells the client:

* Which tools exist

* What each tool does

* What arguments it accepts

* Which input schema should be followed

MCP defines a standard mechanism for tool discovery and invocation.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

### Discovery is not authorization

A tool appearing in the list does not mean every user or Worker may execute it.

```
Tool discovered
      ↓
CWD / policy authorization
      ↓
Server authorization
      ↓
Execution allowed or denied
```

Tool availability may also vary according to the authorization context.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

# 4. Input schemas

An input schema defines the expected arguments for a tool.

For example:

JSON

```
{
  "name": "get_order_status",
  "description": "Retrieve the status of an authorized order",
  "inputSchema": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "Unique order identifier"
      }
    },
    "required": ["order_id"],
    "additionalProperties": false
  }
}
```

The schema provides a contract between the client and server.

## Why schemas matter

Schemas help prevent:

* Missing required fields

* Incorrect data types

* Unexpected arguments

* Ambiguous tool calls

* Invalid identifiers

* Incorrect request construction

  Worker request
  ↓
  Schema validation
  ↓
  Valid arguments
  ↓
  Tool execution

For example:

JSON

```
{
  "order_id": 12345
}
```

may be rejected if the tool requires a string identifier.

### Schema validation is not business authorization

A request can be structurally valid but still unauthorized.

```
Valid schema ≠ Valid business permission
```

Both checks are required.

# 5. Tool invocation

Once the Worker selects an approved tool, the MCP client sends a standardized request.

JSON

```
{
  "jsonrpc": "2.0",
  "id": 42,
  "method": "tools/call",
  "params": {
    "name": "get_order_status",
    "arguments": {
      "order_id": "O1001"
    }
  }
}
```

The important elements are:

|
Field

|

Purpose

|
| --- | --- |
|

`id`

|

Correlates the response with the request

|
|

`method`

|

Identifies the requested protocol operation

|
|

`name`

|

Identifies the tool

|
|

`arguments`

|

Supplies the tool inputs

|

The MCP server receives the request and routes it to the corresponding tool handler.

```
tools/call
    ↓
Tool name lookup
    ↓
Tool handler
    ↓
Validation and authorization
    ↓
Backend execution
```

# 6. Request validation

The MCP server should validate the request before calling the enterprise system.

## Validation pipeline

```
Incoming request
       ↓
Protocol validation
       ↓
Tool existence check
       ↓
Input schema validation
       ↓
Business validation
       ↓
Authorization
       ↓
Execution
```

### Example validation rules

For `get_order_status`:

```
order_id must be present
order_id must be a string
order_id must match the expected format
order must belong to an accessible tenant
order must be accessible to the requesting identity
```

For `create_support_case`:

```
customer_id must be valid
case category must be allowed
description must satisfy content rules
Worker must have case-creation permission
required approval must be present
```

The server should reject invalid requests before they reach the backend.

# 7. Authorization and controlled access

The MCP server should enforce access to the specific capability, not merely access to the MCP server itself.

```
Can this identity connect to the server?
                ↓
Can this identity use this tool?
                ↓
Can this identity access this record?
                ↓
Can this identity perform this operation?
```

## Example

A Worker may be allowed to:

```
Read customer order status
```

but not:

```
Cancel customer orders
```

Another Worker may be allowed to:

```
Create support cases
```

but only after an approval gate.

### Controlled execution model

```
Worker requests tool
        ↓
MCP server identifies caller
        ↓
Check user and agent identity
        ↓
Check tool permission
        ↓
Check resource permission
        ↓
Check data classification
        ↓
Check approval requirement
        ↓
Allow / deny / require approval
```

MCP’s tool-security guidance includes access controls, input validation, rate limiting, output sanitization, timeouts, audit logging, and confirmation for sensitive operations.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

### Important CWD principle

The LLM may recommend a tool, but it must not independently grant permission.

```
LLM recommendation
        ↓
CWD policy decision
        ↓
MCP server enforcement
        ↓
Enterprise operation
```

# 8. Executing the enterprise operation

After validation and authorization, the MCP server invokes the backend adapter.

```
MCP Tool Handler
       ↓
Backend Adapter
       ↓
Enterprise API
       ↓
Business Service
       ↓
Backend Response
```

For example:

```
MCP tool:
get_order_status("O1001")

Backend adapter:
GET /orders/O1001/status

Enterprise service:
Returns order status

MCP server:
Normalizes the response
```

The MCP server may connect to:

* REST APIs

* GraphQL services

* Internal microservices

* Database procedures

* Cloud services

* Enterprise SDKs

* Search platforms

* File repositories

MCP does not require a particular backend implementation. Its role is to standardize the interface between the client and the capability provider.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

# 9. Structured outputs

The MCP server should return results in a predictable structure so the Worker can validate and process them reliably.

## Example successful result

JSON

```
{
  "jsonrpc": "2.0",
  "id": 42,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Order O1001 is delayed."
      }
    ],
    "structuredContent": {
      "order_id": "O1001",
      "status": "Delayed",
      "expected_delivery_date": "2026-09-08"
    }
  }
}
```

The exact result structure depends on the MCP specification version and server implementation. The architectural goal is to provide machine-readable content that the Worker can validate rather than forcing it to interpret an arbitrary paragraph.

## Why structured outputs matter

They support:

* Reliable downstream processing

* Schema validation

* Conditional routing

* Business-rule evaluation

* Auditability

* Easier testing

* Reduced ambiguity

  Structured result
  ↓
  Worker validation
  ↓
  Business interpretation
  ↓
  CWD state update

For example:

Python

Run

```
result = {
    "order_id": "O1001",
    "status": "Delayed",
    "requires_follow_up": True,
}
```

The Worker can use `requires_follow_up` to decide whether another tool or approval step is needed.

# 10. Error handling

The MCP server should convert backend failures into meaningful errors or structured tool results.

```
Enterprise API failure
        ↓
MCP server catches failure
        ↓
Classifies error
        ↓
Maps backend error
        ↓
Returns MCP error/result
        ↓
Worker and LangGraph decide next step
```

## Example error

JSON

```
{
  "jsonrpc": "2.0",
  "id": 42,
  "error": {
    "code": -32001,
    "message": "Order service temporarily unavailable",
    "data": {
      "category": "transient_failure",
      "retryable": true
    }
  }
}
```

### Error categories

|
Error

|

Meaning

|

CWD action

|
| --- | --- | --- |
|

Validation error

|

Invalid input

|

Correct or terminate

|
|

Authorization error

|

Operation not permitted

|

Deny or escalate

|
|

Not found

|

Requested record unavailable

|

Return business result

|
|

Rate limit

|

Too many requests

|

Backoff and retry

|
|

Timeout

|

Backend too slow

|

Retry or redistribute

|
|

Dependency failure

|

Enterprise service unavailable

|

Recovery path

|
|

Permanent business error

|

Operation cannot succeed

|

Stop or request correction

|

The MCP server reports the failure. CWD and LangGraph decide whether to retry, recover, request approval, redistribute, or terminate.

# 11. Example: exposing an order API as an MCP tool

The following is conceptual Python illustrating the separation between the MCP tool handler and the enterprise API adapter.

Python

Run

```
from typing import Any


class OrderApiAdapter:
    """Encapsulates the enterprise Order Management API."""

    async def get_order_status(self, order_id: str) -> dict[str, Any]:
        # Conceptual backend call.
        # Production code would use an approved HTTP client or SDK.
        return {
            "order_id": order_id,
            "status": "Delayed",
            "expected_delivery_date": "2026-09-08",
        }


class PolicyService:
    """Conceptual authorization service."""

    async def authorize(
        self,
        *,
        principal: str,
        agent: str,
        tool_name: str,
        order_id: str,
    ) -> None:
        # Production code would validate identity, permissions,
        # tenant boundaries, and data access policy.
        if not principal or not agent or not order_id:
            raise PermissionError("Missing authorization context")


class OrderMcpServer:
    """Conceptual MCP server capability provider."""

    def __init__(
        self,
        api: OrderApiAdapter,
        policy: PolicyService,
    ):
        self.api = api
        self.policy = policy

    async def get_order_status(
        self,
        *,
        principal: str,
        agent: str,
        order_id: str,
    ) -> dict[str, Any]:
        # 1. Validate input
        if not isinstance(order_id, str) or not order_id.strip():
            raise ValueError("order_id must be a non-empty string")

        # 2. Enforce authorization
        await self.policy.authorize(
            principal=principal,
            agent=agent,
            tool_name="get_order_status",
            order_id=order_id,
        )

        # 3. Execute approved enterprise operation
        backend_result = await self.api.get_order_status(order_id)

        # 4. Normalize structured output
        return {
            "order_id": backend_result["order_id"],
            "status": backend_result["status"],
            "expected_delivery_date": (
                backend_result["expected_delivery_date"]
            ),
        }
```

The actual MCP SDK registration and transport code depends on the selected implementation. The architectural responsibilities remain the same:

```
Tool definition
    ↓
Request validation
    ↓
Authorization
    ↓
Backend adapter
    ↓
Structured result
```

# 12. Example: complete CWD execution

Suppose the user asks:

> “Check delayed orders and create a support case for eligible customers.”

## Coordinator

```
Understand intent
    ↓
Validate user authorization
    ↓
Create workflow plan
```

## Delegator

```
Task A: Retrieve orders
Task B: Identify delayed orders
Task C: Create support case
```

## Worker

The Worker discovers and invokes:

```
get_customer_orders
get_order_status
create_support_case
```

## MCP server

```
1. Receives tools/call
2. Validates arguments
3. Checks identity and tool permission
4. Checks record access
5. Executes enterprise API
6. Normalizes response
7. Returns structured result
```

## CWD continuation

```
MCP result
    ↓
Worker validation
    ↓
Business rule evaluation
    ↓
Approval gate if required
    ↓
MCP call to create_support_case
    ↓
Result validation
    ↓
Delegator aggregation
    ↓
Coordinator final response
```

# 13. MCP tool exposure versus direct API exposure

|
Direct API integration

|

MCP tool exposure

|
| --- | --- |
|

Worker knows the API endpoint

|

Worker knows the tool contract

|
|

Worker manages backend-specific details

|

Server owns backend adapter

|
|

Custom request format per system

|

Standardized MCP invocation

|
|

Custom discovery or hardcoded endpoints

|

Tool discovery through MCP

|
|

Distributed validation

|

Capability boundary validation

|
|

Distributed authorization

|

Consistent server-side enforcement

|
|

Backend-specific errors

|

Normalized tool errors

|
|

Repeated integration code

|

Reusable MCP server

|
|

Difficult capability governance

|

Centralized capability controls

|

# 14. Recommended enterprise tool design

## Good tool characteristics

A good enterprise MCP tool should be:

* Narrow in scope

* Business-oriented

* Explicitly named

* Schema-defined

* Authorization-aware

* Idempotent where possible

* Observable

* Versionable

* Safe to retry when appropriate

* Limited to the minimum required data

### Example

```
get_authorized_invoice_status
```

is preferable to:

```
execute_any_database_query
```

### Tool contract

```
Tool name
    ↓
Description
    ↓
Input schema
    ↓
Authorization policy
    ↓
Backend operation
    ↓
Output schema
    ↓
Error model
```

# 15. Final responsibility flow

```
┌─────────────────────────────────────────────────────────────┐
│ MCP Server                                                   │
│                                                             │
│  1. Expose approved tools                                   │
│  2. Publish input schemas                                   │
│  3. Receive tools/call request                              │
│  4. Validate protocol and arguments                         │
│  5. Authenticate and authorize caller                      │
│  6. Apply business and data policies                        │
│  7. Execute backend adapter                                 │
│  8. Handle timeout and dependency failures                  │
│  9. Normalize structured output                             │
│ 10. Return correlated result or error                       │
│ 11. Record audit and operational telemetry                  │
└─────────────────────────────────────────────────────────────┘
```

## Final definition

Enterprise capabilities are exposed as MCP tools by wrapping approved APIs or business services in an MCP server that publishes tool definitions and input schemas, supports discovery through the MCP client, validates incoming arguments, enforces identity and authorization policies, executes the permitted backend operation, normalizes the result into structured content, and returns a correlated success or error response. In CWD, this allows Workers to access enterprise capabilities through a reusable and governed interface while LangGraph and CWD control workflow state, retries, approvals, and recovery.

### Core formula

MCP Tool=Capability Contract+Validation+Authorization+Backend Execution+Structured Result+Error Handling\text{MCP Tool} = \text{Capability Contract} + \text{Validation} + \text{Authorization} + \text{Backend Execution} + \text{Structured Result} + \text{Error Handling}MCP Tool=Capability Contract+Validation+Authorization+Backend Execution+Structured Result+Error Handling

> An MCP tool is not merely an API wrapper; it is a governed, discoverable, schema-defined enterprise capability that CWD Workers can invoke through a standardized protocol.


### Practical CWD takeaway

```
Coordinator → Delegator → Worker
                         ↓
                  Discover tool
                         ↓
                  Validate + authorize
                         ↓
                  Invoke MCP tool
                         ↓
                  Execute enterprise API
                         ↓
                  Return structured result
                         ↓
                  Update workflow state
                         ↓
             Continue / Retry / Approve / Recover
```

MCP standardizes capability access; the MCP server governs and executes the operation; the Worker interprets the result; and CWD controls the overall business workflow.
