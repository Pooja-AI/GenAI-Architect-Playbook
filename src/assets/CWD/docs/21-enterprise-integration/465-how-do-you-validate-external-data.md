## How do you validate external data?

In CWD, I **never trust external responses directly**. When Salesforce, ServiceNow, Oracle, Snowflake, or SharePoint sends data, the MCP server validates the response **before passing it to the Worker**.

### CWD flow

```text
Enterprise System
      ↓
   MCP Server
      ↓
Schema Validation
      ↓
Data Quality Validation
      ↓
Business Validation
      ↓
Normalization
      ↓
   Worker
      ↓
 Coordinator
```

### 1. Schema validation

First, I verify that the response has the expected structure, types, and required fields.

For example, for a customer:

```python
from pydantic import BaseModel

class Customer(BaseModel):
    customer_id: str
    customer_name: str
    industry: str | None = None
    revenue: float | None = None
```

If Salesforce returns:

```json
{
  "Id": "C12345",
  "Name": "ABC Corp",
  "AnnualRevenue": "INVALID"
}
```

the validation fails because `revenue` should be numeric.

---

### 2. Required-field validation

I check mandatory fields.

```python
if not response.get("customer_id"):
    raise ValidationError("Missing customer_id")
```

For example:

```text
customer_id      → required
customer_name    → required
revenue          → optional
industry         → optional
```

---

### 3. Data-type and range validation

I validate things such as:

```text
Revenue → numeric
Customer ID → string
Priority → allowed values
Date → valid date
Percentage → 0–100
```

For example:

```python
if revenue < 0:
    raise ValidationError("Revenue cannot be negative")
```

---

### 4. Business-rule validation

Schema validation alone isn't enough.

For ServiceNow:

```text
priority must be 1, 2, 3, 4, or 5
status must be one of:
New / In Progress / Resolved / Closed
```

For Salesforce:

```text
customer_id must belong to the authorized tenant
```

For Snowflake:

```text
customer_id must be authorized
requested period must be valid
```

---

### 5. Authorization validation

This is particularly important in CWD.

I don't simply validate:

> "Is this customer ID valid?"

I also validate:

> "Is this user allowed to access this customer?"

```text
User Identity
     ↓
Tenant
     ↓
Customer Authorization
     ↓
MCP Tool Authorization
     ↓
External Data
```

So a valid `C12345` can still be rejected if the user doesn't have permission to access it.

---

### 6. Normalize only after validation

Once the response passes validation, I transform it into the common CWD format.

```python
customer = Customer.model_validate(response)

common_response = {
    "source": "salesforce",
    "entity_type": "customer",
    "entity_id": customer.customer_id,
    "status": "SUCCESS",
    "data": customer.model_dump()
}
```

So the sequence is:

```text
Receive
  ↓
Authenticate source
  ↓
Validate schema
  ↓
Validate fields/types
  ↓
Validate business rules
  ↓
Validate authorization
  ↓
Normalize
  ↓
Return to Worker
```

### What if validation fails?

I **don't pass the bad data to the LLM**.

For example:

```json
{
  "status": "VALIDATION_FAILED",
  "source": "salesforce",
  "error_code": "INVALID_RESPONSE_SCHEMA",
  "retryable": false
}
```

The Worker sends that structured failure back, and the Coordinator decides whether to retry, return a partial result, or escalate.

### Interview-ready answer

> **“I validate external data at the MCP boundary before it reaches my Worker. I perform schema and type validation using Pydantic or JSON Schema, check required fields and data ranges, apply business rules, and enforce authorization such as tenant and customer-level access. Only after the data passes validation do I normalize it into our common response schema. If validation fails, I return a structured error and never send invalid external data to the LLM.”**

### Easy memory

**Schema → Fields → Types → Business Rules → Authorization → Normalize → Worker**

**Strong interview line:**

> “The LLM is not my data-validation layer; validation happens deterministically at the integration boundary before the data enters the agent workflow.”
