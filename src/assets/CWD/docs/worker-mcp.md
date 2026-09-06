# CWD Workers Using MCP for Governed Enterprise Execution

The key architectural principle is:

> The Worker owns domain reasoning and task execution; MCP provides the standardized, governed interface through which the Worker discovers and accesses approved enterprise context and capabilities.

The Worker should not need to understand every ERP, CRM, database, or internal API implementation. It should understand the business task, select the appropriate approved capability, validate the result, and apply domain logic.

```
Coordinator
     ↓
Delegator
     ↓
Authorized Worker
     ↓
MCP Client
     ↓
MCP Server
     ├── Approved resources
     ├── Domain-specific tools
     └── Enterprise adapters
     ↓
Enterprise systems
```

MCP standardizes the client-server interaction, while the surrounding application remains responsible for reasoning, workflow control, and enterprise governance.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog+1

## 1. Why Workers use MCP

A Worker may need to perform a domain task such as:

* Investigate a delayed order

* Analyze a production-line alert

* Retrieve an approved customer record

* Check an invoice against business rules

* Search an enterprise knowledge base

* Create a support case

* Retrieve equipment maintenance history

Without MCP, each Worker might contain custom integrations:

```
Order Worker
 ├── ERP REST client
 ├── CRM SDK
 ├── SQL connection
 └── Knowledge API client
```

With MCP, the Worker uses a consistent capability boundary:

```
Order Worker
      ↓
MCP Client
      ↓
Order MCP Server
      ├── get_order
      ├── search_orders
      ├── get_fulfillment_policy
      └── get_shipment_status
```

The Worker focuses on what the business task requires, while the MCP server handles how the enterprise capability is accessed.

## 2. Responsibility separation

|
Component

|

Primary responsibility

|
| --- | --- |
|

Coordinator

|

Understands the overall request and coordinates the workflow

|
|

Delegator

|

Decomposes the domain task and selects an appropriate Worker

|
|

Worker

|

Performs domain reasoning, validates results, and executes the assigned task

|
|

MCP Client

|

Discovers and communicates with MCP servers

|
|

MCP Server

|

Publishes approved resources and tools

|
|

Enterprise adapter

|

Converts MCP requests into backend-specific API, SDK, or database calls

|
|

Policy / Identity layer

|

Determines whether the requested access or operation is permitted

|
|

LangGraph

|

Controls state, routing, retries, checkpoints, and recovery

|

### The Worker should not become an integration monolith

```
Bad design:
Worker = Reasoning + Workflow + Authorization + ERP implementation

Better design:
Worker = Domain reasoning + Task execution
MCP = Capability access
Policy = Authorization
LangGraph = Workflow control
Backend = System of record
```

## 3. How the Worker discovers capabilities

The Worker uses an MCP client to connect to an approved MCP server.

### Discovery sequence

```
1. Worker receives an authorized task
        ↓
2. Worker identifies required domain capability
        ↓
3. MCP Client connects to approved server
        ↓
4. Client initializes and negotiates capabilities
        ↓
5. Client discovers resources and tools
        ↓
6. Worker filters candidates by task and policy
        ↓
7. Worker selects the relevant capability
```

MCP supports capability negotiation and standardized discovery mechanisms for resources and tools. Clients should use the capabilities actually supported by the connected server rather than assuming every feature is available.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog+1

### Example

The Worker receives:

```
Task:
Investigate order ORD-1001.
```

It discovers:

```
Resources:
- erp://orders/{order_id}
- knowledge://policies/fulfillment-policy

Tools:
- get_order_status
- get_shipment_status
- search_orders
- create_support_case
```

The Worker selects the resources and tools relevant to investigation.

Discovery does not mean unrestricted access. The server and enterprise backend must still authorize the specific request.

## 4. How the Worker selects the appropriate resource or tool

The selection process combines domain reasoning with deterministic controls.

```
Task intent
    ↓
Required information or operation
    ↓
Discovered capabilities
    ↓
Domain relevance filtering
    ↓
Policy and entitlement filtering
    ↓
Tool/resource selection
    ↓
MCP request
```

### Example decision

Python

Run

```
if task.intent == "order_investigation":
    required_capabilities = [
        "get_order_status",
        "get_shipment_status",
        "fulfillment_policy",
    ]
```

The Worker may use an LLM to recommend a capability, but the runtime should verify:

```
Is the capability approved?
Is the Worker authorized?
Is the resource within the permitted domain?
Is the operation read-only or state-changing?
Is human approval required?
```

### Important distinction

> The Worker decides which capability is relevant to the domain task. The MCP server and policy layer decide whether the requested access is allowed.

## 5. Resources: accessing approved enterprise context

Resources are used for read-oriented information.

Examples:

```
erp://orders/ORD-1001
crm://customers/CUST-10452
knowledge://policies/fulfillment-policy
manufacturing://equipment/EQ-204/maintenance-history
```

### Resource flow

```
Worker
   ↓
MCP Client
   ↓
resources/read
   ↓
MCP Server
   ↓
Authorization + validation
   ↓
Enterprise backend
   ↓
Resource content
   ↓
Worker
```

### Example request

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "erp://orders/ORD-1001"
  }
}
```

### Example result

JSON

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "contents": [
      {
        "uri": "erp://orders/ORD-1001",
        "mimeType": "application/json",
        "text": "{\"order_id\":\"ORD-1001\",\"status\":\"delayed\"}"
      }
    ]
  }
}
```

The Worker then interprets the approved information using domain logic.

```
Order status = delayed
        ↓
Retrieve fulfillment policy
        ↓
Compare actual status with policy
        ↓
Determine whether a violation exists
```

MCP provides the resource access mechanism; the Worker performs the domain analysis.

## 6. Tools: invoking enterprise capabilities

Tools are used when the Worker needs a callable operation.

Examples:

```
get_order_status
search_customer_cases
get_machine_temperature
calculate_invoice_variance
create_support_case
```

### Tool invocation flow

```
Worker identifies operation
        ↓
MCP Client sends tools/call
        ↓
MCP Server validates arguments
        ↓
Authorization and policy checks
        ↓
Backend adapter executes operation
        ↓
Structured result or error
        ↓
Worker validates and interprets result
```

MCP defines standardized tool discovery and invocation, while the server implementation remains responsible for validation, access control, and safe execution.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog

### Example invocation

JSON

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_shipment_status",
    "arguments": {
      "order_id": "ORD-1001"
    }
  }
}
```

### Example structured result

JSON

```
{
  "order_id": "ORD-1001",
  "shipment_status": "in_transit",
  "expected_delivery": "2026-09-08",
  "carrier": "approved-carrier-system"
}
```

The Worker does not need to know whether the server used REST, SQL, an SDK, or another internal service.

## 7. Read operations versus state-changing operations

A major enterprise design distinction is between context retrieval and business action.

|
Type

|

Example

|

Typical control

|
| --- | --- | --- |
|

Read resource

|

Read order status

|

Authorization and data filtering

|
|

Read tool

|

Search customer cases

|

Authorization, query validation

|
|

Analytical tool

|

Calculate invoice variance

|

Input validation and business rules

|
|

State-changing tool

|

Create support case

|

Strong authorization, idempotency, possible approval

|
|

High-risk tool

|

Cancel order or issue refund

|

Explicit policy gate and human approval where required

|

```
Read-oriented task:
Worker → MCP resource → approved data → reasoning

State-changing task:
Worker → MCP tool → policy → approval if required → backend action
```

The Worker should not treat every tool as equally safe.

## 8. How the Worker remains focused on domain reasoning

The Worker follows a bounded execution pattern:

```
Receive task
    ↓
Understand domain objective
    ↓
Identify required context/capabilities
    ↓
Discover approved MCP resources/tools
    ↓
Select relevant capability
    ↓
Request context or invoke operation
    ↓
Validate returned data
    ↓
Apply domain reasoning
    ↓
Produce structured result
    ↓
Return result to Delegator
```

### Example: Order Investigation Worker

Python

Run

```
def investigate_order(task, mcp_client):
    order = mcp_client.read_resource(
        f"erp://orders/{task.order_id}"
    )

    policy = mcp_client.read_resource(
        "knowledge://policies/fulfillment-policy"
    )

    shipment = mcp_client.call_tool(
        "get_shipment_status",
        {"order_id": task.order_id}
    )

    return analyze_order_against_policy(
        order=order,
        policy=policy,
        shipment=shipment,
    )
```

This is conceptual code. The actual MCP client API depends on the SDK and implementation.

The important separation is:

```
MCP Client:
  How to communicate

MCP Server:
  How to access enterprise capability

Worker:
  What the domain information means
```

## 9. Worker result validation

The Worker should never blindly trust an external result.

### Validation stages

```
MCP response
    ↓
Protocol-level validation
    ↓
Expected schema validation
    ↓
Data completeness check
    ↓
Business-rule validation
    ↓
Freshness / timestamp validation
    ↓
Domain reasoning
```

### Example

Python

Run

```
def validate_shipment_result(result):
    required = ["order_id", "shipment_status"]

    for field in required:
        if field not in result:
            raise ValueError(f"Missing field: {field}")

    allowed_statuses = {
        "pending",
        "in_transit",
        "delivered",
        "cancelled",
    }

    if result["shipment_status"] not in allowed_statuses:
        raise ValueError("Unexpected shipment status")

    return result
```

The Worker owns domain-level interpretation, but the MCP server should also validate requests and outputs at its own boundary.

## 10. MCP and CWD execution state

The Worker should update the CWD execution state after each meaningful MCP interaction.

```
Initial state
    ↓
Task assigned
    ↓
Capability discovered
    ↓
Resource requested
    ↓
Resource received
    ↓
Tool invoked
    ↓
Tool result received
    ↓
Validation completed
    ↓
Domain result produced
```

### Example state

JSON

```
{
  "workflow_id": "wf-1001",
  "task_id": "task-2001",
  "worker_id": "order-investigation-worker",
  "status": "completed",
  "discovered_capabilities": [
    "get_order_status",
    "get_shipment_status"
  ],
  "resources_read": [
    "erp://orders/ORD-1001",
    "knowledge://policies/fulfillment-policy"
  ],
  "tool_calls": [
    {
      "name": "get_shipment_status",
      "status": "success"
    }
  ],
  "domain_result": {
    "policy_violation": false
  }
}
```

LangGraph can use this state to determine whether the Worker should:

* Continue

* Retry

* Request another resource

* Invoke another tool

* Escalate

* Return a completed result

## 11. Error handling and recovery

MCP errors should be converted into meaningful Worker outcomes.

```
MCP resource/tool failure
        ↓
Worker classifies error
        ↓
Update execution state
        ↓
LangGraph conditional routing
        ├── Retry
        ├── Alternate capability
        ├── Replan
        ├── Human intervention
        └── Fail task
```

### Example

```
get_shipment_status fails
        ↓
Is the failure transient?
        ├── Yes → Retry with bounded backoff
        └── No
             ↓
       Is another approved source available?
             ├── Yes → Use alternate resource/tool
             └── No → Return controlled failure
```

The Worker should not implement unlimited retries or bypass policy when a tool fails.

## 12. Security boundary for Worker-to-MCP access

A secure enterprise flow is:

```
User identity
      ↓
Coordinator authorization
      ↓
Delegator task authorization
      ↓
Worker identity and permissions
      ↓
MCP Client
      ↓
MCP Server authorization
      ↓
Backend authorization
      ↓
Approved data or operation
```

### Controls

* Worker identity and service credentials

* Tool and resource allowlists

* Domain-level permissions

* Tenant and record-level access checks

* Input validation

* Data minimization

* Sensitive-field filtering

* Audit logs

* Rate limits

* Timeouts

* Approval gates for high-risk actions

### Example

```
Worker:
  order-investigation-worker

Allowed:
  erp://orders/{order_id}
  knowledge://policies/fulfillment-policy
  get_shipment_status

Not allowed:
  delete_order
  issue_refund
  execute_any_sql
```

The MCP server must not rely solely on the Worker’s claim that access is permitted. Server-side authorization and backend controls remain necessary.

![](https://www.google.com/s2/favicons?domain=https://blog.modelcontextprotocol.io\&sz=32)

Model Context Protocol Blog

## 13. MCP discovery versus Agent Registry discovery

These are different layers.

|
Discovery

|

Purpose

|
| --- | --- |
|

Agent Registry

|

Finds the appropriate Worker or Delegator

|
|

MCP discovery

|

Finds the resources and tools available to the selected Worker

|

```
Coordinator
    ↓
Agent Registry
    ↓
Select Order Worker
    ↓
MCP Client
    ↓
Discover Order MCP Server capabilities
    ↓
Select get_order_status
    ↓
Invoke tool
```

### Interview answer

> The Agent Registry answers, “Which agent should perform this task?” MCP discovery answers, “Which external capabilities can that agent use?”

## 14. MCP versus direct API integration inside a Worker

|
Direct integration

|

MCP-based integration

|
| --- | --- |
|

Worker owns backend-specific client code

|

MCP server owns backend adapter

|
|

Integration logic repeated across Workers

|

Capability can be reused by multiple clients

|
|

Discovery is often hardcoded

|

Capabilities can be discovered

|
|

API schema tightly coupled to Worker

|

MCP tool/resource contract decouples Worker

|
|

Security logic may be duplicated

|

Server boundary can centralize controls

|
|

Backend changes may require Worker changes

|

Adapter can absorb backend changes

|

### Important qualification

MCP does not eliminate all integration complexity. The MCP server still needs:

* Backend adapters

* Authentication

* Authorization

* Validation

* Error mapping

* Monitoring

* Deployment and lifecycle management

It moves the integration boundary into a reusable protocol-based component.

## 15. MCP versus function calling inside a Worker

A Worker may use function calling to decide which MCP capability to request.

```
LLM
  ↓
Function/tool selection
  ↓
Worker runtime
  ↓
MCP Client
  ↓
MCP Server
  ↓
Enterprise system
```

### Example

The LLM recommends:

JSON

```
{
  "name": "get_shipment_status",
  "arguments": {
    "order_id": "ORD-1001"
  }
}
```

The Worker runtime maps that recommendation to:

JSON

```
{
  "method": "tools/call",
  "params": {
    "name": "get_shipment_status",
    "arguments": {
      "order_id": "ORD-1001"
    }
  }
}
```

### Key distinction

> Function calling is a model-facing decision mechanism. MCP is the standardized capability-access mechanism. The Worker runtime connects the two.

## 16. Complete enterprise example

### Requirement

> Investigate a delayed order and create a support case only if the order violates policy and the operation is approved.

### Execution

```
User
  ↓
Coordinator
  ↓
Delegator
  ↓
Order Investigation Worker
  ↓
MCP Client discovers:
  - Order resource
  - Fulfillment policy resource
  - Shipment status tool
  - Create support case tool
  ↓
Worker reads order
  ↓
Worker reads policy
  ↓
Worker invokes shipment status tool
  ↓
Worker validates all results
  ↓
Worker performs domain analysis
  ↓
Policy violation?
  ├── No → Return investigation result
  └── Yes
       ↓
  Approval required?
       ├── Yes → Human approval gate
       └── No → Continue
       ↓
  Worker invokes create_support_case
       ↓
  MCP Server authorizes and executes
       ↓
  Worker validates case result
       ↓
  Delegator aggregates
       ↓
  Coordinator returns final response
```

### Example Worker output

JSON

```
{
  "task_id": "task-2001",
  "status": "completed",
  "finding": {
    "order_id": "ORD-1001",
    "policy_violation": true,
    "reason": "Delivery exceeded the approved fulfillment window"
  },
  "recommended_action": "create_support_case",
  "approval_required": true
}
```

The Worker recommends the action, but CWD policy and approval controls determine whether it may proceed.

## 17. Recommended Worker design pattern

```
┌─────────────────────────────────────────────┐
│ Domain Worker                               │
│                                             │
│  Task validation                            │
│  Domain reasoning                           │
│  Capability selection                       │
│  Result validation                          │
│  Business logic                             │
│  Structured output                          │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ MCP Client                            │  │
│  │ - Discover resources/tools             │  │
│  │ - Read resources                       │  │
│  │ - Invoke tools                         │  │
│  │ - Handle protocol responses            │  │
│  └───────────────────┬───────────────────┘  │
└──────────────────────┼──────────────────────┘
                       ↓
                Approved MCP Server
                       ↓
                Enterprise adapters
                       ↓
                Backend systems
```

### Design principles

1. Keep Workers domain-focused.

2. Use narrow, business-oriented MCP tools.

3. Use resources for approved read-oriented context.

4. Separate discovery from authorization.

5. Validate all external results.

6. Keep high-risk operations behind policy and approval gates.

7. Store important MCP interactions in workflow state.

8. Use LangGraph for retries, checkpoints, and recovery.

9. Avoid unrestricted SQL, shell, or arbitrary URL tools.

10. Preserve backend authorization and auditability.

## 18. Interview-ready answer

> In CWD, a Worker receives a well-defined, authorized domain task from the Delegator. The Worker uses an MCP client to connect to an approved MCP server and discover the resources and tools relevant to that task. Resources provide read-oriented enterprise context, such as order records, policies, or maintenance history. Tools provide callable capabilities, such as searching orders, retrieving shipment status, or creating a support case.
>
> The Worker selects the appropriate capability based on domain reasoning, but the MCP server and enterprise policy layers enforce authorization, input validation, and controlled access. The MCP server uses adapters to call the underlying REST API, SDK, database, or business service and returns a structured result or error.
>
> The Worker then validates the result, applies domain logic, updates CWD execution state, and returns a structured outcome to the Delegator. LangGraph controls the surrounding workflow, including retries, checkpointing, conditional routing, and human approval. This separation keeps the Worker focused on domain reasoning and task execution, while MCP provides a reusable and governed enterprise capability-access layer.

## Final definition

CWD Workers use MCP by connecting through an MCP client to discover approved domain-specific resources and tools, selecting the capability relevant to their assigned task, requesting contextual information or invoking an operation, validating the returned result, and applying domain reasoning to produce a structured outcome. The Worker remains focused on business logic and execution, while the MCP server abstracts enterprise integrations and enforces the capability boundary.

Worker Execution=Domain Reasoning+MCP Capability Access+Result Validation+Business Logic+Structured Outcome\boxed{ \text{Worker Execution} = \text{Domain Reasoning} + \text{MCP Capability Access} + \text{Result Validation} + \text{Business Logic} + \text{Structured Outcome} }Worker Execution=Domain Reasoning+MCP Capability Access+Result Validation+Business Logic+Structured Outcome

### Core takeaway

> The Worker decides what the domain task requires; MCP provides the approved way to obtain context or execute capabilities; the MCP server governs access; and CWD controls the overall enterprise workflow.


### One-line architecture summary

```
Coordinator → Delegator → Worker → MCP Client → MCP Server → Enterprise System
```

Worker = domain intelligence and execution. MCP = standardized capability access. Policy = authorization. LangGraph = workflow state and recovery.
