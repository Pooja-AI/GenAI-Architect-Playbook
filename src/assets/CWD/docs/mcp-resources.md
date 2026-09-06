# MCP Resources in Enterprise Agentic AI

## 1. What is an MCP resource?

An MCP resource is a standardized, read-oriented source of contextual information that an AI application or agent can discover and retrieve through an MCP server.

Resources allow agents to access information such as:

* Enterprise documents and files

* Knowledge-base articles

* Application records

* Product or customer information

* Database views and reports

* Configuration and metadata

* System status or operational context

* Generated or dynamically assembled information

The resource provides context and data; it does not itself decide the workflow or perform a business action. MCP defines how the AI application discovers and reads these resources through a consistent client-server protocol.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## 2. Why MCP resources are needed

Without a standardized resource interface, every agent would need custom code for every enterprise data source:

```
Agent → Custom REST client → CRM
Agent → Custom SQL code   → Database
Agent → Custom SDK        → Document system
Agent → Custom API        → Knowledge base
```

This creates several problems:

* Different integration patterns for every system

* Repeated authentication and connection logic

* Inconsistent metadata and response formats

* Difficult governance and auditing

* Tight coupling between agents and backend systems

* Poor reuse across multiple agents

With MCP resources, the integration becomes:

```
Agent
  ↓
MCP Client
  ↓
MCP Server
  ↓
Enterprise Resource Adapter
  ↓
Document Store / API / Database / Knowledge Base
```

The agent uses a consistent resource interface while the MCP server hides the underlying implementation.

## 3. Resource versus tool

The most important distinction is:

|
MCP primitive

|

Primary purpose

|

Typical operation

|
| --- | --- | --- |
|

Resource

|

Provide contextual information

|

Read a document, retrieve a record, obtain metadata

|
|

Tool

|

Perform an operation or action

|

Create a ticket, update a record, send a message

|
|

Prompt

|

Provide a reusable interaction template

|

Generate a standard investigation or analysis prompt

|

For example:

```
Resource:
  Read customer policy document

Tool:
  Create a customer-support case

Resource:
  Read current order status

Tool:
  Cancel the order
```

A resource is generally read-oriented, whereas a tool may cause a state-changing or externally observable action. MCP separates these concepts so that agents can obtain context without treating every data access operation as an executable business action.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol

## 4. Core concepts of MCP resources

### 4.1 Resource URI

Each resource is identified by a URI.

Conceptual examples:

```
file:///enterprise/policies/refund-policy.pdf

knowledge://manufacturing/maintenance-guidelines

crm://customers/CUST-10452

database://sales/orders/ORD-20260906-001
```

The URI identifies the resource and allows the client to request it consistently. The exact URI scheme and format depend on the MCP server implementation.

### 4.2 Resource name

A human-readable name helps users and agents understand what the resource represents.

JSON

```
{
  "uri": "knowledge://manufacturing/maintenance-guidelines",
  "name": "Maintenance Guidelines",
  "description": "Approved maintenance procedures for manufacturing equipment"
}
```

### 4.3 Description

The description explains the resource's meaning, scope, and intended use.

A good description should clarify:

* What information is available

* Which business domain it belongs to

* Whether it is current or historical

* What users or agents are authorized to access it

* Whether it contains sensitive information

### 4.4 MIME type

A resource may expose a MIME type describing the content format:

```
text/plain
text/markdown
application/json
application/pdf
text/csv
```

This helps the client or agent determine how to interpret the returned content.

### 4.5 Resource contents

When the resource is read, the server returns its content. The content may be textual, structured, or binary, depending on the resource and server capabilities.

Conceptual response:

JSON

```
{
  "contents": [
    {
      "uri": "knowledge://manufacturing/maintenance-guidelines",
      "mimeType": "text/markdown",
      "text": "# Maintenance Guidelines\n\n..."
    }
  ]
}
```

The actual response structure and supported content types depend on the MCP specification version and implementation.

## 5. Resource discovery

An MCP client can discover resources exposed by a server rather than requiring the agent to know every backend system in advance.

Conceptual discovery request:

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
        "uri": "knowledge://manufacturing/maintenance-guidelines",
        "name": "Maintenance Guidelines",
        "description": "Approved maintenance procedures",
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

The discovery process allows the client to learn:

1. Which resources are available

2. What each resource represents

3. How the resource is identified

4. What content format it provides

Discovery is not authorization. A resource appearing in a discovery response does not automatically mean that every user, agent, or Worker may read it. Access must still be controlled by identity, policy, and backend permissions.

## 6. Reading a resource

After discovering a resource, the MCP client can request its contents.

Conceptual request:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "knowledge://manufacturing/maintenance-guidelines"
  }
}
```

Conceptual response:

JSON

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "contents": [
      {
        "uri": "knowledge://manufacturing/maintenance-guidelines",
        "mimeType": "text/markdown",
        "text": "# Maintenance Guidelines\n\nInspect equipment before..."
      }
    ]
  }
}
```

The MCP server may retrieve the information from:

* A file system

* An enterprise document platform

* A REST API

* A database

* A vector or knowledge repository

* A content-management system

* Another approved internal service

The agent does not need to know how the backend stores or retrieves the data.

## 7. Resource templates for dynamic information

Some resources cannot be represented by one fixed URI. For example, an enterprise system may contain thousands of customer or order records.

MCP can expose resource templates that describe how dynamic resource URIs are formed.

Conceptual template:

```
crm://customers/{customer_id}
```

Example resource instances:

```
crm://customers/CUST-1001
crm://customers/CUST-1002
crm://customers/CUST-1003
```

Another example:

```
erp://orders/{order_id}
```

The agent can use the appropriate identifier to request a specific record.

Resource templates are useful for:

* Customer records

* Order details

* Equipment history

* Incident records

* Employee metadata

* Application configuration

* Project documents

The template defines the access pattern, while the server validates the supplied identifier and applies authorization before returning data.

## 8. Resource metadata and annotations

Resource metadata helps the agent understand the context and characteristics of the information.

Conceptual metadata:

JSON

```
{
  "uri": "crm://customers/CUST-10452",
  "name": "Customer Record",
  "description": "Customer profile and account information",
  "mimeType": "application/json",
  "metadata": {
    "domain": "customer-support",
    "classification": "confidential",
    "sourceSystem": "CRM",
    "lastUpdated": "2026-09-06T10:30:00Z",
    "readOnly": true
  }
}
```

Useful metadata can include:

* Source system

* Business domain

* Data classification

* Freshness or update time

* Ownership

* Region or tenant

* Record type

* Sensitivity level

* Retention category

* Version

* Read-only status

Metadata is valuable for selection, filtering, governance, and observability, but it should not be trusted as a replacement for server-side authorization.

## 9. Static and dynamic resources

### Static resources

A static resource points to a relatively stable piece of information.

Examples:

```
knowledge://policies/security-policy
knowledge://products/product-catalog
file:///documents/architecture.md
```

Typical use cases:

* Policies

* Product documentation

* Standard operating procedures

* Architecture documents

* Reference manuals

### Dynamic resources

A dynamic resource is generated or retrieved at request time.

Examples:

```
crm://customers/CUST-10452
monitoring://services/order-api/status
erp://orders/ORD-20260906-001
```

Typical use cases:

* Current application data

* Live operational status

* Customer-specific records

* Current inventory

* Recent transaction details

Dynamic resources should clearly communicate freshness and should not be treated as permanently cached facts unless the application explicitly manages caching.

## 10. Resource subscriptions and change notifications

Some MCP servers may support resource updates or subscriptions. In that model, a client can be informed when a resource changes instead of repeatedly polling it.

Conceptual flow:

```
MCP Client subscribes to resource
        ↓
MCP Server monitors source
        ↓
Enterprise data changes
        ↓
MCP Server sends resource-updated notification
        ↓
Client reads the updated resource
```

This can be useful for:

* Configuration changes

* Updated policies

* Incident status

* Monitoring information

* Frequently changing enterprise records

The availability of subscriptions depends on the server and negotiated MCP capabilities. Clients must not assume that every MCP server supports them.

![](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io\&sz=32)

Model Context Protocol+1

## 11. Resource access flow in CWD

In the CWD architecture, MCP resources are primarily used by Workers that need enterprise context.

```
User Request
     ↓
Coordinator
     ↓
LangGraph planning and state management
     ↓
Delegator
     ↓
Worker selection
     ↓
Worker
     ↓
MCP Client
     ↓
MCP Server
     ↓
Resource Adapter
     ↓
Enterprise Document / API / Database
     ↓
Resource Content
     ↓
Worker validates and interprets context
     ↓
State update
     ↓
Coordinator aggregates final response
```

### Example

A user asks:

> “Explain why the customer’s order is delayed and summarize the applicable fulfillment policy.”

The workflow may be:

1. Coordinator identifies the request as an order-investigation task.

2. Delegator assigns the task to an Order Investigation Worker.

3. Worker reads the order record through an MCP resource.

4. Worker reads the fulfillment policy through another MCP resource.

5. Worker compares the order status with the policy.

6. Worker returns a structured explanation.

7. Coordinator generates the final response.

   Order Investigation Worker
   ├── Read order resource
   └── Read fulfillment-policy resource
   ↓
   Compare information
   ↓
   Produce explanation

No state-changing operation is required merely to retrieve the order and policy context.

## 12. Resource access is not unrestricted data access

MCP standardizes the interface, but it does not automatically guarantee enterprise security.

A governed resource access flow should include:

```
Request received
      ↓
Authenticate caller
      ↓
Identify user, agent, and Worker
      ↓
Check resource permission
      ↓
Check record-level entitlement
      ↓
Check data classification
      ↓
Apply tenant and region restrictions
      ↓
Retrieve permitted content
      ↓
Filter or redact sensitive fields
      ↓
Return resource content
      ↓
Audit access
```

Important controls include:

* Entra ID or equivalent identity

* Agent and Worker identity

* Role-based or attribute-based access control

* Record-level authorization

* Tenant isolation

* Data classification enforcement

* Field-level filtering

* Sensitive-data redaction

* Rate limiting

* Timeouts

* Audit logging

* Network isolation

* Backend permission checks

The MCP server should never assume that because a Worker requests a resource, the Worker is entitled to receive it.

## 13. Resource retrieval versus RAG retrieval

MCP resources and RAG are related, but they are not identical.

|
Aspect

|

MCP resource

|

RAG retrieval

|
| --- | --- | --- |
|

Purpose

|

Standardized access to contextual information

|

Find relevant information for a query

|
|

Interface

|

MCP resource URI and read operation

|

Retriever, vector search, keyword search, or hybrid search

|
|

Selection

|

Resource discovery, URI, metadata, application logic

|

Similarity, lexical relevance, filters, reranking

|
|

Backend

|

API, file, database, document system, knowledge store

|

Usually indexed document or knowledge repository

|
|

Output

|

Resource content

|

Relevant chunks or passages

|
|

Main concern

|

Integration contract and governed access

|

Relevance and retrieval quality

|

A Worker may use an MCP resource to access an enterprise knowledge service, while that service internally performs RAG:

```
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Enterprise Knowledge Service
  ↓
Hybrid Search / Vector Search / Reranking
  ↓
Relevant Content
  ↓
MCP Resource Response
```

Therefore:

> MCP standardizes how the Worker accesses the knowledge capability; RAG determines how relevant content is found inside that capability.

## 14. Structured resource content

Enterprise resources should preferably return structured information when the consuming Worker needs reliable processing.

Example:

JSON

```
{
  "customerId": "CUST-10452",
  "status": "active",
  "segment": "enterprise",
  "region": "NA",
  "openCases": 3,
  "lastUpdated": "2026-09-06T10:30:00Z"
}
```

Structured content is useful because it supports:

* Deterministic validation

* Field-level access control

* Easier downstream processing

* Reduced ambiguity

* Better observability

* More reliable state updates

* Less dependence on free-form LLM interpretation

A Worker should validate the returned structure before using it in business logic.

Python

Run

```
customer = read_customer_resource("crm://customers/CUST-10452")

if not customer.get("customerId"):
    raise ValueError("Missing customer identifier")

if customer.get("region") not in allowed_regions:
    raise PermissionError("Customer region is not permitted")
```

The example is conceptual; the actual MCP client and server implementation may use different libraries and response types.

## 15. Error handling for resources

Resource retrieval can fail for several reasons:

|
Error type

|

Example

|

CWD response

|
| --- | --- | --- |
|

Resource not found

|

Invalid URI or missing record

|

Return not-found response or replan

|
|

Unauthorized

|

Worker lacks permission

|

Stop or escalate

|
|

Backend timeout

|

CRM unavailable

|

Controlled retry

|
|

Rate limit

|

Too many requests

|

Backoff and retry

|
|

Stale content

|

Data is older than allowed

|

Refresh or warn

|
|

Invalid content

|

Malformed JSON or unexpected schema

|

Validation failure

|
|

Dependency failure

|

Knowledge service unavailable

|

Recovery or alternate source

|
|

Sensitive content blocked

|

Policy prevents access

|

Redact, escalate, or terminate

|

A resource error should be classified before retrying.

```
Read Resource
     ↓
Success ───────────────→ Validate content
     │
     ├── Not found ─────→ Replan or report unavailable
     ├── Unauthorized ──→ Stop or escalate
     ├── Timeout ───────→ Retry if safe
     ├── Rate limit ────→ Backoff
     └── Invalid data ──→ Validation/recovery path
```

LangGraph and CWD determine the next workflow path. MCP returns the resource result or communication error; it does not decide whether the entire business workflow should retry, recover, or terminate.

## 16. Conceptual MCP resource server

The following Python illustrates the responsibilities of a resource server. It is conceptual rather than tied to a particular MCP SDK.

Python

Run

```
from dataclasses import dataclass
from typing import Any


@dataclass
class Resource:
    uri: str
    name: str
    description: str
    mime_type: str


class EnterpriseResourceAdapter:
    def read_customer(self, customer_id: str) -> dict[str, Any]:
        # Replace with an approved CRM/API/database integration.
        return {
            "customerId": customer_id,
            "status": "active",
            "region": "NA",
            "openCases": 3,
        }

    def read_policy(self, policy_name: str) -> str:
        # Replace with an approved document or knowledge service.
        return f"# {policy_name}\n\nApproved enterprise policy content."


class PolicyService:
    def can_read_customer(
        self,
        agent_id: str,
        customer_id: str,
    ) -> bool:
        # Replace with real identity and entitlement checks.
        return agent_id.startswith("worker-")


class EnterpriseResourceServer:
    def __init__(self):
        self.adapter = EnterpriseResourceAdapter()
        self.policy = PolicyService()

    def list_resources(self) -> list[Resource]:
        return [
            Resource(
                uri="knowledge://policies/fulfillment-policy",
                name="Fulfillment Policy",
                description="Approved fulfillment policy",
                mime_type="text/markdown",
            ),
            Resource(
                uri="crm://customers/{customer_id}",
                name="Customer Record",
                description="Authorized customer profile",
                mime_type="application/json",
            ),
        ]

    def read_resource(
        self,
        uri: str,
        agent_id: str,
    ) -> dict[str, Any]:
        if uri == "knowledge://policies/fulfillment-policy":
            return {
                "uri": uri,
                "mimeType": "text/markdown",
                "text": self.adapter.read_policy("Fulfillment Policy"),
            }

        prefix = "crm://customers/"
        if uri.startswith(prefix):
            customer_id = uri.removeprefix(prefix)

            if not customer_id:
                raise ValueError("Customer ID is required")

            if not self.policy.can_read_customer(agent_id, customer_id):
                raise PermissionError("Resource access denied")

            customer = self.adapter.read_customer(customer_id)

            return {
                "uri": uri,
                "mimeType": "application/json",
                "structuredContent": customer,
            }

        raise FileNotFoundError(f"Unknown resource: {uri}")
```

The server performs several important functions:

1. Publishes resource metadata.

2. Maps resource URIs to backend operations.

3. Validates resource identifiers.

4. Checks authorization.

5. Retrieves data through approved adapters.

6. Returns content in a predictable format.

7. Prevents direct unrestricted access to backend systems.

## 17. MCP resources versus direct database access

### Direct access

```
Worker
  ↓
Database credentials
  ↓
SQL query
  ↓
Enterprise database
```

This approach can create risks:

* Excessive database privileges

* SQL injection exposure

* Inconsistent query logic

* Sensitive columns returned accidentally

* Difficult auditing

* Tight coupling to database schemas

* Uncontrolled load on production databases

### Governed resource access

```
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Approved resource adapter
  ↓
Parameterized query or approved API
  ↓
Filtered and authorized result
```

The MCP server can expose a narrow business resource such as:

```
erp://orders/{order_id}
```

rather than exposing unrestricted capabilities such as:

```
database://execute-any-sql
```

The preferred enterprise design is to expose business-oriented, read-scoped resources with clear authorization boundaries.

## 18. Responsibilities across CWD, LangGraph, and MCP

|
Component

|

Responsibility

|
| --- | --- |
|

Coordinator

|

Understands the request, authorizes the workflow, and coordinates the overall execution

|
|

Delegator

|

Decomposes the task and assigns the resource-retrieval work to an appropriate Worker

|
|

Worker

|

Requests the required context, validates the returned information, and applies business logic

|
|

LangGraph

|

Manages state, workflow progression, conditional routing, retries, checkpoints, and recovery

|
|

MCP Client

|

Discovers and reads resources through the MCP protocol

|
|

MCP Server

|

Publishes resources, validates requests, enforces access controls, and retrieves content

|
|

Resource Adapter

|

Connects the MCP server to APIs, databases, documents, or knowledge services

|
|

Policy Service

|

Determines whether the requesting identity is allowed to access the resource

|
|

Enterprise backend

|

Owns the source data and enforces its own security and business rules

|

The separation is:

```
LangGraph → Controls when and why context is needed
MCP       → Standardizes how context is requested
MCP Server → Controls and retrieves the permitted information
Worker    → Interprets and validates the information
CWD       → Governs the complete enterprise workflow
```

## 19. Security and governance principles

For enterprise MCP resources, the following principles are essential:

### Least privilege

Expose only the resources required by a Worker’s responsibility.

### Read-only by default

Use resources for information retrieval and reserve state-changing operations for explicitly governed tools.

### No unrestricted backend exposure

Avoid generic resources that expose arbitrary SQL, unrestricted files, or unrestricted internal URLs.

### Validate identifiers

A URI such as `crm://customers/{customer_id}` must not allow unauthorized identifiers to bypass access controls.

### Enforce authorization server-side

Do not rely solely on the LLM, prompt instructions, or metadata to enforce access.

### Minimize context

Return only the fields and content needed for the task.

### Protect sensitive data

Apply classification, redaction, masking, retention, and logging controls before content reaches the agent.

### Audit access

Record:

* User identity

* Agent and Worker identity

* Resource URI

* Request time

* Authorization decision

* Result status

* Data classification

* Correlation ID

* Error or denial reason

### Preserve provenance

Include source identifiers, timestamps, versions, and relevant metadata where appropriate so the Worker can explain where its context came from.

## 20. Complete enterprise example

### User request

> “Investigate the delayed order and explain whether the delay violates the fulfillment policy.”

### Execution

```
1. User submits request
        ↓
2. Coordinator identifies order-investigation intent
        ↓
3. Policy validates user and workflow entitlement
        ↓
4. Delegator assigns Order Investigation Worker
        ↓
5. Worker discovers available MCP resources
        ↓
6. Worker reads:
      - erp://orders/ORD-20260906-001
      - knowledge://policies/fulfillment-policy
        ↓
7. MCP Server authenticates and authorizes each read
        ↓
8. Resource adapters retrieve approved data
        ↓
9. MCP Server returns structured order data and policy content
        ↓
10. Worker validates data freshness and schema
        ↓
11. Worker compares order status with policy
        ↓
12. Worker returns structured findings
        ↓
13. LangGraph updates workflow state
        ↓
14. Coordinator aggregates and generates final response
```

Example Worker result:

JSON

```
{
  "orderId": "ORD-20260906-001",
  "investigationStatus": "completed",
  "delayDetected": true,
  "policyViolation": false,
  "reason": "The order remains within the approved fulfillment window",
  "sources": [
    "erp://orders/ORD-20260906-001",
    "knowledge://policies/fulfillment-policy"
  ]
}
```

The Worker does not need to expose raw database credentials, execute arbitrary SQL, or know the internal implementation of the ERP and knowledge systems.

## 21. Common anti-patterns

### Treating discovery as authorization

```
Resource listed → Assume access is allowed
```

Correction: perform authorization for every resource request.

### Returning excessive data

```
Read entire customer database record
```

Correction: return only the permitted fields needed for the task.

### Using resources for write operations

```
Resource: crm://customers/update
```

Correction: expose state-changing operations as governed tools.

### Exposing generic database resources

```
database://execute-any-sql
```

Correction: expose narrow, business-oriented resource views.

### Allowing the LLM to bypass the resource boundary

```
LLM → Direct database connection
```

Correction: all enterprise context access should pass through approved clients, servers, adapters, and policy controls.

### Assuming resource content is always current

Correction: use timestamps, versions, freshness checks, and explicit cache policies.

## Final definition

MCP resources are standardized, read-oriented interfaces that allow AI applications and agents to discover and retrieve enterprise contextual information—such as documents, application records, knowledge content, metadata, and operational data—through MCP servers using resource URIs and structured content responses.

In CWD, MCP resources provide the governed context-access layer:

Worker→MCP Client→MCP Server→Resource Adapter→Enterprise Data Source\text{Worker} \rightarrow \text{MCP Client} \rightarrow \text{MCP Server} \rightarrow \text{Resource Adapter} \rightarrow \text{Enterprise Data Source}Worker→MCP Client→MCP Server→Resource Adapter→Enterprise Data Source

The MCP server controls discovery, validation, authorization, retrieval, filtering, and response formatting, while LangGraph and CWD control workflow state, routing, retries, approvals, and recovery.

### Core formula

MCP Resource=Resource Contract+Discovery+URI-Based Access+Authorization+Read Execution+Structured Context+Error Handling\boxed{ \text{MCP Resource} = \text{Resource Contract} + \text{Discovery} + \text{URI-Based Access} + \text{Authorization} + \text{Read Execution} + \text{Structured Context} + \text{Error Handling} }MCP Resource=Resource Contract+Discovery+URI-Based Access+Authorization+Read Execution+Structured Context+Error Handling

### Key takeaway

> MCP resources standardize how agents obtain enterprise context; MCP servers govern and retrieve that context; Workers validate and use it; and CWD controls the overall business workflow.
