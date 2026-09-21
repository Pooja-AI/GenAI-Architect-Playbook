## How do you enforce structured output?

In CWD, I don't rely on the LLM to always return valid JSON just because I put “return JSON” in the prompt.

I enforce structure using **schemas + structured model output + validation + retry/repair**.

### CWD flow

```text id="2v8x9c"
LLM
 ↓
Structured Output / JSON Schema
 ↓
Schema Validation
 ↓
Valid?
 ↙       ↘
YES       NO
 ↓         ↓
Worker   Retry / Repair
Result      ↓
          Validate
```

### 1. Define a schema

For example, suppose a Customer Worker must return customer information:

```python id="7y3m1k"
from pydantic import BaseModel
from typing import Optional

class CustomerResult(BaseModel):
    customer_id: str
    customer_name: str
    industry: Optional[str]
    status: str
    source: str
```

Now the expected response is clearly defined.

---

### 2. Use structured model output

Where the selected model/API supports it, I use **JSON Schema / structured outputs** rather than free-form text.

Conceptually:

```text id="8x4k2p"
LLM
 ↓
CustomerResult schema
 ↓
{
  "customer_id": "C123",
  "customer_name": "ABC Corp",
  "industry": "Semiconductor",
  "status": "Active",
  "source": "Salesforce"
}
```

This is much safer than:

```text
"Customer C123 is ABC Corp and is currently active..."
```

when another component needs machine-readable data.

---

### 3. Validate at the application layer

Even if the model returns structured output, I validate it.

```python id="m7q2az"
try:
    result = CustomerResult.model_validate(llm_response)
except ValidationError:
    # retry / repair
    ...
```

I can validate:

* Required fields
* Data types
* Enum values
* IDs
* Length limits
* Business rules
* Nested structures

For example:

```text
customer_id must match → C[0-9]+
status must be → Active | Inactive
```

---

### 4. Validate Worker output before aggregation

This is particularly important in CWD.

```text id="x6p9rm"
Sales Worker
     ↓
Schema Validation
     ↓
Delegator
     ↓
Coordinator
```

The Coordinator should not blindly aggregate arbitrary LLM text.

For example:

```json id="3m5v7k"
{
  "worker": "SalesWorker",
  "status": "success",
  "data": {
    "customer_id": "C123",
    "revenue": 2400000
  }
}
```

---

### 5. Retry only when appropriate

If the response is malformed:

```text id="4h8n2q"
LLM
 ↓
Invalid JSON
 ↓
Validation failure
 ↓
Bounded retry
 ↓
LLM
 ↓
Validate again
```

I keep retries bounded so a malformed response doesn't create an infinite loop.

For critical workflows, I can also route to a fallback model if the primary model repeatedly fails structured-output validation.

---

### 6. Use structured output for tool calls too

This is especially important with MCP.

For example:

```json id="p4x7n1"
{
  "tool": "get_customer",
  "arguments": {
    "customer_id": "C123"
  }
}
```

Then:

```text id="c8v3qs"
LLM
 ↓
Tool schema validation
 ↓
Authorization
 ↓
MCP Client
 ↓
MCP Server
 ↓
Salesforce
```

**Schema validation is not authorization.**

Even if `customer_id=C123` is valid, the Worker/MCP server must still verify that the user is authorized to access C123.

---

### 🎯 Strong interview answer

> **“I enforce structured output using a schema-driven approach. We define Pydantic or JSON Schemas for Worker and Coordinator outputs and use the model's structured-output capability where supported. The response is then validated at the application layer for types, required fields, enums, IDs, and business rules. If validation fails, we perform a bounded retry or repair, and for critical workflows we can use a fallback model. For MCP tool calls, schema validation happens before execution, followed separately by authorization.”**

### Easy memory trick

**Schema → Generate → Validate → Retry → Authorize → Execute**

Key interview line:

> **“Prompting asks the model for structure; schema validation enforces the structure.”**
