## Why use MCP instead of directly embedding API integrations into Workers?

The main reason is **separation of concerns**.

In CWD, the Worker should focus on **business capability and reasoning**, while MCP provides a **standardized, governed tool-access layer** for enterprise systems such as Salesforce, ServiceNow, SharePoint, Oracle, and Snowflake.

### Direct integration vs MCP

**Without MCP:**

```text
Customer Worker
   ├── Salesforce SDK
   ├── ServiceNow API
   ├── SharePoint API
   ├── Oracle client
   ├── Authentication
   ├── Retry logic
   └── Audit logic
```

Every Worker becomes tightly coupled to enterprise systems.

**With MCP:**

```text
Customer Worker
      ↓
   MCP Client
      ↓
 ┌─────────────────────────────┐
 │       MCP Servers            │
 ├────────┬────────┬───────────┤
 ↓        ↓        ↓
Salesforce ServiceNow SharePoint
                       ↓
                    Oracle
```

The Worker simply asks for a capability:

```python id="2g0a0d"
result = await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C12345"}
)
```

The Worker doesn't need to know how Salesforce is implemented.

---

## 1. Separation of concerns

This is the **biggest reason**.

### Worker

Responsible for:

```text
Understand task
↓
Decide what capability is needed
↓
Call approved tool
↓
Process result
```

### MCP Server

Responsible for:

```text
Authentication
Authorization
API integration
Schema validation
Retries
Timeouts
Rate limiting
Auditing
```

So:

> **Worker = business capability**
> **MCP = enterprise tool integration**

---

## 2. Reusability

Suppose you have:

```text
Customer Worker
Opportunity Worker
Account Worker
Incident Worker
Analytics Worker
```

Without MCP, each Worker may implement its own integrations.

With MCP:

```text
Salesforce MCP Server
 ├── get_customer
 ├── get_opportunities
 └── get_accounts
```

Multiple Workers can use the same governed tools.

```text
Customer Worker ─────┐
Opportunity Worker ──┼──→ Salesforce MCP
Account Worker ──────┘
```

This avoids duplicating integration code.

---

## 3. Centralized security

Without MCP, every Worker needs to implement:

```text
Authentication
Authorization
Token management
Secrets
Permission checks
```

That creates many security boundaries.

With MCP:

```text
Worker
  ↓
MCP
  ↓
Authorization
  ↓
Allowed Tool?
  ↓
Enterprise System
```

You can enforce:

* Tool allowlists
* Least privilege
* Parameter validation
* Identity propagation
* Tenant isolation
* RBAC/ABAC
* Audit logging
* Rate limits

And importantly:

> **The LLM is not the security boundary.**

The MCP layer and enterprise authorization enforce what the Worker is actually allowed to do.

---

## 4. Easier integration changes

Imagine Salesforce changes its API.

### Direct integration

You potentially modify:

```text
Customer Worker
Opportunity Worker
Account Worker
...
```

### MCP

You primarily update:

```text
Salesforce MCP Server
        ↓
new Salesforce API
```

The Workers continue calling:

```python
mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C12345"}
)
```

This reduces coupling.

---

## 5. Standardized interface

Without MCP:

```text
Worker → Salesforce REST
Worker → ServiceNow REST
Worker → Oracle Driver
Worker → SharePoint Graph API
Worker → Snowflake Connector
```

Every integration can have a different programming model.

With MCP:

```text
Worker
  ↓
MCP Client
  ↓
Tool
  ↓
MCP Server
  ↓
Enterprise System
```

The Worker gets a consistent tool invocation pattern.

For example:

```python
await mcp_client.call_tool(
    "get_open_incidents",
    {"customer_id": "C12345"}
)
```

and:

```python
await mcp_client.call_tool(
    "get_customer_orders",
    {"customer_id": "C12345"}
)
```

The underlying systems can be completely different.

---

## 6. Centralized observability and auditing

With MCP, tool calls can be consistently instrumented.

For example:

```json id="f4z4q7"
{
  "trace_id": "TR-9001",
  "workflow_id": "WF-1001",
  "worker_id": "incident_worker",
  "mcp_server": "servicenow-mcp",
  "tool": "get_open_incidents",
  "customer_id": "C12345",
  "authorization": "ALLOWED",
  "status": "SUCCESS",
  "latency_ms": 420
}
```

This makes it easier to answer:

> Who called the tool?
> Which Worker called it?
> Which tool was used?
> Was authorization successful?
> How long did it take?
> Did it fail?

---

## 7. Centralized resilience

MCP can provide consistent:

```text
Timeout
 ↓
Retry
 ↓
Circuit breaker
 ↓
Rate limit
 ↓
Structured error
```

For example:

```text
Incident Worker
      ↓
MCP
      ↓
ServiceNow
      X
    503
      ↓
Retry
      ↓
Circuit Breaker
      ↓
Structured Failure
```

You don't want every Worker implementing slightly different retry and failure logic.

---

## 8. Better lifecycle management

Suppose you have 50 Workers.

If each Worker embeds API integrations:

```text
50 Workers
 ×
Multiple enterprise integrations
 =
Large integration maintenance surface
```

With MCP:

```text
50 Workers
      ↓
MCP layer
      ↓
Specialized MCP Servers
      ↓
Enterprise systems
```

You can independently manage the MCP servers, tools, permissions, versions, and integrations.

---

# But is MCP always necessary?

**No.**

This is a good nuance to mention in an interview.

For a simple application:

```text
Python service → Salesforce API
```

direct integration may be perfectly reasonable.

I use MCP when I need an **Agent/tool ecosystem with reusable, governed enterprise capabilities**, especially when multiple Workers or Agents need access to the same enterprise systems.

---

# CWD example

Without MCP:

```text
Customer Worker
   ↓
Salesforce API code

Opportunity Worker
   ↓
Salesforce API code

Account Worker
   ↓
Salesforce API code
```

With MCP:

```text
                    Sales Delegator
                          ↓
              ┌───────────┼───────────┐
              ↓           ↓           ↓
         Customer      Opportunity   Account
          Worker         Worker       Worker
              \           |           /
               \          |          /
                    MCP Client
                         ↓
                Salesforce MCP
                         ↓
                    Salesforce
```

Now if another Worker needs customer information, it can use the same governed `get_customer` capability.

---

## Interview-ready answer

> **“We used MCP instead of embedding API integrations directly into Workers because we wanted a clean separation between business logic and enterprise integrations. In CWD, Workers focus on their specific business capabilities, while MCP provides a standardized and governed tool-access layer. The MCP Server handles authentication, authorization, schema validation, API integration, retries, timeouts, rate limiting, and auditing. This gives us reusable tools across multiple Workers, reduces duplicated integration code, centralizes security and observability, and allows us to change an underlying enterprise API without modifying every Worker. For example, our Incident Worker calls `get_open_incidents` through MCP rather than containing ServiceNow API code directly.”**

### Easy memory

**Without MCP:**

> Worker = Business Logic + API Integration + Security + Retry + Audit

**With MCP:**

> **Worker = Business Capability**
> **MCP = Governed Tool Access**
> **Enterprise System = System of Record**

### Strong interview line

> **“MCP decouples my Agent reasoning layer from my enterprise integration layer, while giving me a centralized security, governance, observability, and reuse boundary.”**
