## How do you transform external responses into a common format?

In CWD, different enterprise systems return different response formats. I **normalize those responses inside the MCP integration layer**, so Workers and the Coordinator don't need to understand Salesforce, ServiceNow, Oracle, etc. specific schemas.

### CWD flow

```text
Salesforce ───────┐
ServiceNow ───────┤
Oracle ───────────┤
Snowflake ────────┤
                  ↓
            MCP Server
                  ↓
        Response Normalizer
                  ↓
        Common Response Schema
                  ↓
              Worker
                  ↓
            Coordinator
```

### Example

Suppose Salesforce returns:

```json
{
  "Id": "00345",
  "Name": "ABC Corporation",
  "Industry": "Semiconductor",
  "AnnualRevenue": 50000000
}
```

ServiceNow may return:

```json
{
  "sys_id": "INC123",
  "short_description": "Network issue",
  "priority": "2",
  "state": "In Progress"
}
```

Instead of passing these vendor-specific structures to the Coordinator, I transform them into a **common internal contract**.

For example:

```json
{
  "source": "salesforce",
  "entity_type": "customer",
  "entity_id": "00345",
  "status": "SUCCESS",
  "data": {
    "customer_name": "ABC Corporation",
    "industry": "Semiconductor",
    "revenue": 50000000
  },
  "metadata": {
    "source_version": "v2",
    "retrieved_at": "2026-09-21T10:30:00Z"
  }
}
```

For ServiceNow:

```json
{
  "source": "servicenow",
  "entity_type": "incident",
  "entity_id": "INC123",
  "status": "SUCCESS",
  "data": {
    "title": "Network issue",
    "priority": "2",
    "status": "In Progress"
  },
  "metadata": {
    "source_version": "v1"
  }
}
```

### Code-level example

I typically use **Pydantic models** for the common contract:

```python
from pydantic import BaseModel
from typing import Any, Dict

class CommonResponse(BaseModel):
    source: str
    entity_type: str
    entity_id: str
    status: str
    data: Dict[str, Any]
    metadata: Dict[str, Any] = {}
```

Then the Salesforce MCP server maps its native response:

```python
def normalize_salesforce_customer(response):
    return CommonResponse(
        source="salesforce",
        entity_type="customer",
        entity_id=response["Id"],
        status="SUCCESS",
        data={
            "customer_name": response["Name"],
            "industry": response["Industry"],
            "revenue": response["AnnualRevenue"]
        }
    )
```

ServiceNow has its own adapter:

```python
def normalize_servicenow_incident(response):
    return CommonResponse(
        source="servicenow",
        entity_type="incident",
        entity_id=response["sys_id"],
        status="SUCCESS",
        data={
            "title": response["short_description"],
            "priority": response["priority"],
            "status": response["state"]
        }
    )
```

### Why do this?

The **Worker consumes the common contract**, not vendor-specific Salesforce or ServiceNow schemas.

```text
Salesforce response
       ↓
Salesforce MCP Adapter
       ↓
CommonResponse
       ↓
Customer Worker
```

and:

```text
ServiceNow response
       ↓
ServiceNow MCP Adapter
       ↓
CommonResponse
       ↓
Incident Worker
```

This gives me:

* **Loose coupling** — vendor schema changes don't affect Workers.
* **Consistent validation** — Pydantic/JSON Schema validates responses.
* **Consistent error handling** — all systems can return `SUCCESS`, `FAILED`, `TIMEOUT`, etc.
* **Easy aggregation** — Coordinator can combine results from different Workers.
* **Better observability** — common metadata such as `source`, `tool`, `version`, `latency`, and `correlation_id`.
* **API-version isolation** — Salesforce v1/v2 differences stay inside the MCP adapter.

### In Customer Briefing

For example:

```text
Salesforce
   ↓
Customer Worker → CommonCustomerResponse
                              \
                               \
ServiceNow                     → Coordinator
   ↓                           /
Incident Worker → CommonIncidentResponse
```

The Coordinator can then aggregate:

```text
Customer information
+ Opportunities
+ Open incidents
+ Sales metrics
+ Documents
        ↓
   Customer Briefing
```

without knowing how each backend represents its data.

### Interview-ready answer

> **“I normalize external responses at the MCP integration layer. Each MCP server has an adapter that converts the native Salesforce, ServiceNow, Oracle, or Snowflake response into a versioned common schema, typically validated using Pydantic or JSON Schema. The Worker consumes that common contract instead of vendor-specific formats. This gives us loose coupling, consistent validation and error handling, easier aggregation, and protects our Agent layer from downstream API or schema changes.”**

### Easy memory

**External format → MCP Adapter → Validate → Common Schema → Worker → Coordinator**

**Strong interview line:**

> “I don't allow vendor-specific schemas to leak into my Agent or Worker logic; the MCP integration layer acts as the normalization boundary.”
