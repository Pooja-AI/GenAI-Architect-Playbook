## How does CWD integrate with ServiceNow?

In CWD, **Workers do not directly connect to ServiceNow**. The Worker uses an **MCP Client**, which calls a **ServiceNow MCP Server**. The MCP Server handles the actual ServiceNow API integration.

### CWD flow

```text
User
  ↓
Coordinator
  ↓ A2A
IT / Service Delegator
  ↓
Incident Worker
  ↓ MCP Client
ServiceNow MCP Server
  ↓
ServiceNow APIs
  ↓
Incidents / Tickets / Knowledge
```

### Example: Customer Briefing

Suppose the user asks:

> **“Give me a briefing for customer C12345.”**

The Coordinator identifies:

```text
Intent      = Customer Briefing
customer_id = C12345
```

It may invoke both:

```text
Sales Delegator
 ├── Customer Worker ──→ Salesforce
 └── Opportunity Worker → Salesforce

IT Delegator
 └── Incident Worker ──→ ServiceNow
```

Because the Salesforce and ServiceNow work are independent, the Coordinator can execute the Delegators in parallel.

---

### 1. Incident Worker receives the customer ID

The IT Delegator sends the task to the Incident Worker:

```json
{
  "customer_id": "C12345",
  "required_data": [
    "open_incidents",
    "incident_status",
    "priority"
  ]
}
```

The Worker understands **what business capability is needed**, but it doesn't contain ServiceNow-specific integration code.

---

### 2. Worker calls an MCP tool

For example:

```python
result = await mcp_client.call_tool(
    "get_open_incidents",
    {
        "customer_id": "C12345"
    }
)
```

The Worker is essentially saying:

> “I need the open incidents for customer C12345.”

---

### 3. ServiceNow MCP Server handles the integration

The MCP Server exposes approved tools such as:

```text
get_incident
get_open_incidents
search_incidents
get_incident_details
create_incident
update_incident
```

The MCP Server then:

```text
Receive MCP request
       ↓
Validate schema
       ↓
Authenticate
       ↓
Authorize tool/action
       ↓
Build ServiceNow API request
       ↓
Call ServiceNow
       ↓
Validate response
       ↓
Return structured result
```

For example:

```json
{
  "customer_id": "C12345",
  "incidents": [
    {
      "incident_id": "INC0012345",
      "short_description": "Production server issue",
      "priority": "P2",
      "status": "In Progress"
    }
  ]
}
```

---

### 4. Result comes back through CWD

```text
ServiceNow
    ↓
ServiceNow MCP Server
    ↓
MCP Client
    ↓
Incident Worker
    ↓
IT Delegator
    ↓
Coordinator
```

The Coordinator receives the validated result.

It can then combine it with Salesforce information:

```json
{
  "customer": {
    "customer_id": "C12345",
    "name": "ABC Corporation"
  },
  "opportunities": [...],
  "service_incidents": [
    {
      "incident_id": "INC0012345",
      "priority": "P2",
      "status": "In Progress"
    }
  ]
}
```

The Coordinator validates and aggregates the results and produces the final **Customer Briefing**.

---

## What happens if ServiceNow is unavailable?

CWD should **not hallucinate the incident information**.

For example:

```text
Incident Worker
      ↓
MCP Server
      ↓
ServiceNow
      X
   Timeout
      ↓
Retry with backoff
      ↓
Still failing?
      ↓
Circuit breaker / structured error
      ↓
Coordinator
```

The Worker returns something like:

```json
{
  "status": "DEPENDENCY_UNAVAILABLE",
  "source": "ServiceNow",
  "customer_id": "C12345"
}
```

The Coordinator can then return:

> Customer and opportunity information are available, but current ServiceNow incident information could not be retrieved.

That is much safer than allowing the LLM to invent incident details.

---

## Why use MCP for ServiceNow?

MCP gives us a controlled boundary between the Agent and the enterprise system.

It provides:

* **Authentication**
* **Authorization**
* **Tool allowlisting**
* **Parameter/schema validation**
* **Timeouts**
* **Retries**
* **Circuit breakers**
* **Audit logging**
* **Rate limiting**
* **Structured responses**
* **Idempotency for write operations**

For example, for a `create_incident` operation, I would use an **idempotency key** so a retry doesn't accidentally create duplicate ServiceNow incidents.

---

## Interview-ready answer

> **“In CWD, we integrate with ServiceNow through an MCP-based tool layer. The Coordinator identifies the request and routes ServiceNow-related work to the IT or Service Delegator. The Delegator invokes the Incident Worker. The Worker uses an MCP Client to call approved ServiceNow tools such as `get_open_incidents`, passing the customer ID and required parameters. The ServiceNow MCP Server handles authentication, authorization, schema validation, ServiceNow API communication, retries, timeouts, and auditing. The structured result comes back to the Incident Worker, then the Delegator and Coordinator. The Coordinator validates and aggregates the ServiceNow results with Salesforce results and generates the final business response. If ServiceNow is unavailable, we return a structured dependency failure or partial result rather than allowing the LLM to hallucinate the missing data.”**

### Easy memory

**Coordinator → IT Delegator → Incident Worker → MCP → ServiceNow**

And remember the key distinction:

> **Worker owns the business capability; MCP Server owns the ServiceNow integration; ServiceNow remains the system of record.**
