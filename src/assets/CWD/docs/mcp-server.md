# Responsibilities of an MCP Server in CWD

An MCP Server is the governed capability provider that exposes enterprise operations and contextual information through the Model Context Protocol. It receives requests from an MCP client, validates them, executes only permitted operations, and returns structured results or errors.

Within CWD, the MCP server is primarily the Worker-to-enterprise integration boundary.

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
    ├── Validate request
    ├── Check authorization
    ├── Apply security policies
    ├── Execute approved operation
    ├── Normalize result
    └── Return structured response
    ↓
Enterprise system
```

MCP defines the standardized protocol and capability model; the server implements the actual enterprise integration.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## 1. Core responsibility model

```
MCP Server
=
Capability Exposure
+
Request Validation
+
Security Enforcement
+
Approved Execution
+
Error Handling
+
Structured Results
```

|
Responsibility

|

What the MCP server does

|
| --- | --- |
|

Expose tools

|

Publishes approved executable operations

|
|

Expose resources

|

Makes contextual data available

|
|

Expose prompts

|

Provides reusable prompt templates where supported

|
|

Validate requests

|

Checks method, arguments, schema, and required fields

|
|

Enforce security

|

Applies identity, authorization, policy, and data controls

|
|

Execute operations

|

Calls approved enterprise APIs, databases, or services

|
|

Handle errors

|

Classifies and translates backend failures

|
|

Return results

|

Sends structured, correlated responses to the client

|
|

Observe execution

|

Records appropriate audit and operational telemetry

|

# 2. Exposing tools

The server advertises tools that clients can discover and invoke.

```
MCP Server
    ├── get_customer_profile
    ├── search_orders
    ├── retrieve_inventory
    ├── get_production_status
    └── create_support_case
```

A tool definition normally includes:

* Tool name

* Description

* Input schema

* Optional output schema

* Execution behavior

### Example

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

The client can discover available tools through the MCP tool-discovery mechanism and then invoke an approved tool using its name and arguments.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

### Enterprise principle

The server should expose bounded business capabilities, not unrestricted backend access.

```
Preferred:
get_authorized_customer_orders()

Avoid:
execute_any_sql()
call_any_url()
run_any_shell_command()
```

# 3. Exposing resources

Resources provide contextual information that the host or application can use.

Examples include:

```
customer://12345/profile
knowledge://manufacturing/safety-policy
database://sales/schema
file:///reports/monthly-sales.csv
```

A resource may represent:

* A document

* A file

* A database schema

* A knowledge item

* Application state

* Configuration

* Other contextual information

  MCP Client
  ↓
  Resource request
  ↓
  MCP Server
  ↓
  Authorized data source
  ↓
  Resource content
  ↓
  MCP Client

The server determines how the resource is retrieved and represented, while the client and host decide how the returned context is used.

### Tools versus resources

```
Tool:
"Perform an operation."

Resource:
"Provide contextual information."
```

For example:

```
Tool:
get_customer_profile(customer_id)

Resource:
customer://12345/profile
```

The distinction is important because a resource read and a business action may require different authorization, auditing, and approval policies.

# 4. Exposing prompts

An MCP server may expose reusable prompt templates for common tasks.

Examples:

```
analyze_incident
summarize_customer_history
review_purchase_order
generate_monthly_report
```

A prompt can contain:

* Name

* Description

* Arguments

* Reusable instructions

* Context references

* Structured messages

  MCP Client
  ↓
  Request prompt
  ↓
  MCP Server
  ↓
  Prompt template + arguments
  ↓
  Host / model

Prompts are not the same as tools:

|
Primitive

|

Purpose

|
| --- | --- |
|

Tool

|

Execute an operation

|
|

Resource

|

Provide information

|
|

Prompt

|

Provide reusable instructions

|

The server exposes the prompt contract; the host decides whether and how to use it.

# 5. Validating incoming requests

Before executing a tool or returning protected information, the server should validate the request.

## Validation layers

```
Incoming MCP request
        ↓
Protocol validation
        ↓
Method validation
        ↓
Argument/schema validation
        ↓
Identity and authorization validation
        ↓
Business-policy validation
        ↓
Approved execution
```

### 5.1 Protocol validation

The server checks whether the message follows the expected JSON-RPC structure.

JSON

```
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "tools/call",
  "params": {
    "name": "get_customer_profile",
    "arguments": {
      "customer_id": "C12345"
    }
  }
}
```

The server must identify the requested method and correlate the response with the request ID.

### 5.2 Tool validation

The server verifies:

* Tool exists

* Tool is enabled

* Required arguments are present

* Argument types are correct

* Input values satisfy constraints

* Unsupported arguments are rejected or handled according to the contract

### 5.3 Business validation

For example:

```
customer_id exists
customer belongs to permitted tenant
requested operation is valid
order status transition is allowed
required approval is present
```

### 5.4 Data validation

The server should validate:

* Data classification

* Requested fields

* Record ownership

* Tenant boundaries

* Query scope

* Output size

* Sensitive-data handling

This prevents the server from becoming an unrestricted data-extraction mechanism.

# 6. Enforcing security policies

An MCP server should operate as a policy-controlled capability boundary.

MCP itself does not automatically make an integration secure. Security must be implemented by the host, client, server, identity layer, and surrounding enterprise architecture. Official MCP guidance emphasizes access controls, input validation, rate limiting, sanitized outputs, timeouts, audit logs, and confirmation for sensitive operations.

![](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

## Security flow

```
MCP Request
    ↓
Identify caller
    ↓
Validate agent identity
    ↓
Validate user identity
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

### Typical controls

|
Control

|

Example

|
| --- | --- |
|

Authentication

|

Validate the calling application or service identity

|
|

Authorization

|

Confirm the Worker can use the requested tool

|
|

Least privilege

|

Expose only the tools and data required

|
|

Tenant isolation

|

Prevent cross-tenant access

|
|

Data filtering

|

Return only permitted fields

|
|

Input validation

|

Reject malformed or dangerous arguments

|
|

Rate limiting

|

Prevent excessive calls

|
|

Timeouts

|

Limit long-running operations

|
|

Output sanitization

|

Remove or protect sensitive content

|
|

Audit logging

|

Record who called what and when

|
|

Approval controls

|

Require human approval for high-risk actions

|

### Important CWD rule

The MCP server should not trust the LLM’s recommendation as authorization.

```
LLM recommends tool
        ↓
CWD policy validates permission
        ↓
MCP server enforces capability access
        ↓
Enterprise operation executes
```

# 7. Executing approved operations

Once validation and policy checks succeed, the MCP server executes the requested capability.

```
MCP Client
    ↓
tools/call
    ↓
MCP Server
    ↓
Tool handler
    ↓
Backend adapter
    ↓
Enterprise API / Database / Service
```

The server may use:

* REST clients

* SDKs

* Database drivers

* Internal service clients

* Cloud APIs

* File-system adapters

* Search APIs

The MCP protocol does not require a particular backend technology. The server translates the standardized tool request into the implementation required by the enterprise system.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

### Example

```
Tool:
get_customer_orders(customer_id)

MCP Server implementation:
    1. Validate customer_id
    2. Check authorization
    3. Call Order Management API
    4. Filter restricted fields
    5. Normalize response
    6. Return structured result
```

The Worker does not need to know the backend SDK or API details.

# 8. Handling errors

Enterprise systems can fail in different ways:

```
CRM → HTTP 429
ERP → SOAP fault
Database → SQL exception
Ticketing API → HTTP 503
```

The MCP server should translate backend-specific failures into meaningful protocol-level errors or structured tool results.

## Error-handling flow

```
Enterprise failure
        ↓
MCP server catches exception
        ↓
Classify failure
        ↓
Map to structured error
        ↓
Return to MCP client
        ↓
Worker / LangGraph decides:
retry, recover, escalate, or stop
```

### Example structured error

JSON

```
{
  "jsonrpc": "2.0",
  "id": 10,
  "error": {
    "code": -32001,
    "message": "Order service temporarily unavailable",
    "data": {
      "retryable": true,
      "category": "transient_failure"
    }
  }
}
```

The exact error-code conventions depend on the implementation and protocol rules. The important architectural principle is that the server should return enough structured information for the client and CWD to make a controlled recovery decision.

### Error categories

|
Error category

|

Example

|

CWD response

|
| --- | --- | --- |
|

Validation error

|

Missing customer ID

|

Correct input or terminate

|
|

Authorization error

|

Tool not permitted

|

Deny or escalate

|
|

Not found

|

Customer does not exist

|

Return business result

|
|

Rate limit

|

Too many requests

|

Backoff and retry if allowed

|
|

Timeout

|

Backend response too slow

|

Retry or redistribute

|
|

Dependency failure

|

ERP unavailable

|

Retry or recovery

|
|

Permanent failure

|

Invalid business operation

|

Stop or request correction

|

The MCP server reports the capability failure; LangGraph and CWD determine the next workflow path.

# 9. Returning structured results

After execution, the server returns a response that the client can correlate with the original request.

## Successful response

JSON

```
{
  "jsonrpc": "2.0",
  "id": 10,
  "result": {
    "customer_id": "C12345",
    "orders": [
      {
        "order_id": "O1001",
        "status": "Delayed"
      }
    ]
  }
}
```

The result should be:

* Structured

* Schema-consistent

* Relevant to the requested operation

* Limited to authorized data

* Suitable for downstream validation

* Correlated to the original request

### Why structured results matter

A structured result allows the Worker to distinguish:

```
Operation succeeded
Operation failed
Operation partially completed
Operation returned no data
Operation requires approval
```

This is more reliable than returning an unstructured paragraph that the Worker must interpret.

# 10. MCP server and CWD execution state

The MCP server does not own the entire CWD workflow state. It returns capability results that the Worker incorporates into the workflow state.

```
MCP Server result
        ↓
MCP Client
        ↓
Worker validates result
        ↓
Worker updates CWD state
        ↓
LangGraph conditional routing
        ↓
Continue / Retry / Approval / Recovery / Complete
```

For example:

Python

Run

```
state = {
    "workflow_id": "wf-1001",
    "task_id": "task-2001",
    "tool_name": "get_customer_orders",
    "tool_status": "success",
    "tool_result": {
        "orders": []
    },
    "error": None,
    "next_action": "validate_orders",
}
```

The Worker owns the business interpretation of the result. The MCP server owns the capability execution and integration boundary.

# 11. Complete CWD example

Suppose a user asks:

> “Retrieve delayed customer orders and create a support case.”

```
Coordinator
    ↓
Validates intent and authorization
    ↓
Delegator
    ↓
Assigns order-analysis task
    ↓
Worker
    ↓
MCP Client
    ↓
MCP Server
```

The MCP server exposes:

```
get_customer_orders
create_support_case
```

### Execution sequence

```
1. Worker requests customer orders
2. MCP server validates the request
3. MCP server checks access policy
4. MCP server calls Order Management API
5. MCP server filters and normalizes the result
6. MCP server returns structured orders
7. Worker identifies delayed orders
8. CWD checks whether case creation requires approval
9. If required, workflow pauses for human approval
10. After approval, Worker invokes create_support_case
11. MCP server validates and executes the operation
12. MCP server returns case creation result
13. Worker validates the result
14. Delegator aggregates the domain outcome
15. Coordinator returns the final response

User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP Client
 ↓
MCP Server
 ├── Validate
 ├── Authorize
 ├── Execute
 ├── Handle errors
 └── Return structured result
 ↓
Enterprise System
 ↓
Worker validation
 ↓
CWD state update
 ↓
Retry / Approval / Recovery / Completion
```

# 12. What the MCP server should and should not control

|
MCP server should control

|

MCP server should not replace

|
| --- | --- |
|

Tool exposure

|

Coordinator planning

|
|

Resource exposure

|

Delegator decomposition

|
|

Input validation

|

Worker business reasoning

|
|

Backend integration

|

LangGraph workflow orchestration

|
|

Capability-level authorization

|

Enterprise identity platform

|
|

Output normalization

|

CWD checkpointing

|
|

Backend error mapping

|

CWD retry policy

|
|

Capability audit events

|

Overall workflow observability

|
|

Tool-specific security

|

Enterprise-wide governance

|

The server is a capability execution boundary, not the entire agent orchestration engine.

# 13. Recommended enterprise MCP server design

```
┌──────────────────────────────────────────────┐
│              MCP Server                      │
│                                              │
│  Protocol Handler                            │
│      ↓                                       │
│  Request Validator                            │
│      ↓                                       │
│  Identity / Policy Adapter                    │
│      ↓                                       │
│  Tool Registry / Capability Catalog           │
│      ↓                                       │
│  Tool Execution Layer                        │
│      ↓                                       │
│  Backend Adapter Layer                       │
│      ↓                                       │
│  Enterprise API / Database / Service          │
│      ↓                                       │
│  Result Normalizer + Error Mapper             │
│      ↓                                       │
│  Audit / Metrics / Trace                     │
└──────────────────────────────────────────────┘
```

### Design principles

1. Expose narrow, business-oriented tools.

2. Validate every request at the server boundary.

3. Never assume that tool discovery equals authorization.

4. Apply least privilege and data minimization.

5. Keep backend-specific logic inside adapters.

6. Return predictable, structured results.

7. Map failures into actionable error categories.

8. Use timeouts, rate limits, and idempotency for sensitive operations.

9. Record security and operational events.

10. Keep workflow state and recovery decisions in CWD/LangGraph.

## Final definition

An MCP Server is a standardized, governed capability provider that exposes tools, resources, and prompts; validates protocol and business requests; enforces identity, authorization, and data policies; executes approved enterprise operations through backend adapters; handles and normalizes failures; and returns structured results or errors to MCP clients. Within CWD, it protects the enterprise integration boundary while allowing Workers to access reusable capabilities without implementing direct point-to-point integrations.

### Core formula

MCP Server=Expose+Validate+Authorize+Execute+Handle Errors+Return Structured Results\text{MCP Server} = \text{Expose} + \text{Validate} + \text{Authorize} + \text{Execute} + \text{Handle Errors} + \text{Return Structured Results}MCP Server=Expose+Validate+Authorize+Execute+Handle Errors+Return Structured Results

> The MCP server controls how an approved capability is safely exposed and executed; CWD controls why the capability is needed, when it should run, and what happens after the result is returned.
