## How do you validate API requests?

In CWD, I validate API requests **before they enter the Coordinator workflow**. FastAPI + Pydantic handle structural validation, while authorization and business rules are validated separately.

### CWD flow

```text
Client
  ↓
APIM
  ↓
Authentication
  ↓
FastAPI
  ↓
Pydantic Validation
  ↓
Authorization
  ↓
Business Validation
  ↓
Coordinator
```

### 1. Validate request schema

For example, our Customer Briefing API:

```python
from pydantic import BaseModel, Field

class CustomerBriefingRequest(BaseModel):
    customer_id: str = Field(min_length=1)
    request: str = Field(min_length=1)
    include_incidents: bool = True
    include_sales: bool = True
```

FastAPI automatically validates the incoming JSON against this model.

Valid:

```json
{
  "customer_id": "C12345",
  "request": "Give me a customer briefing"
}
```

Invalid:

```json
{
  "customer_id": "",
  "request": ""
}
```

The request is rejected before reaching the Coordinator.

---

### 2. Validate data types

For example:

```text
customer_id       → string
include_incidents → boolean
include_sales     → boolean
```

If someone sends:

```json
{
  "customer_id": "C12345",
  "include_sales": "yes"
}
```

the validation layer handles the type/schema problem rather than allowing malformed data into the workflow.

---

### 3. Validate size and format

I also enforce limits such as:

```text
customer_id → expected format
request     → maximum length
JSON body   → maximum size
```

For example:

```python
request: str = Field(min_length=1, max_length=2000)
```

This protects the API from unnecessarily large inputs and helps control LLM token usage.

---

### 4. Authentication validation

APIM validates the Entra ID access token.

```text
Token present?
      ↓
Valid?
      ↓
Not expired?
      ↓
Correct audience/scope?
      ↓
FastAPI
```

Invalid authentication should be rejected before the business workflow starts.

---

### 5. Authorization validation

A valid request isn't automatically an authorized request.

For:

```text
customer_id = C12345
```

I check:

```text
Is user allowed to access C12345?
Is user allowed to invoke Customer Briefing?
Is the requested capability allowed?
```

So:

```text
Authentication ✓
Request schema ✓
Authorization ✗
        ↓
      403
```

---

### 6. Business validation

Then I validate business rules.

For example:

```python
if not customer_exists(customer_id):
    raise HTTPException(
        status_code=400,
        detail="Invalid customer_id"
    )
```

Or:

```text
Customer ID exists?
Requested capability supported?
Tenant/customer relationship valid?
Requested operation allowed?
```

Some of these checks may happen later at the MCP/data boundary if they require access to the enterprise system.

---

### 7. Don't trust user-provided security fields

This is a very important security point.

I would **not** accept:

```json
{
  "user_id": "admin",
  "tenant_id": "T001",
  "customer_id": "C12345"
}
```

and blindly trust `user_id` or `tenant_id`.

The trusted identity comes from the authenticated token/context.

```text
User request
     +
Trusted Entra identity
     ↓
Authorization context
```

The user can provide the **business input** such as `customer_id`, but security context must come from trusted infrastructure.

---

### 8. Validate before invoking the LLM

I don't send an unvalidated request directly to the LLM.

```text
Raw Request
    ↓
Schema validation
    ↓
AuthN
    ↓
AuthZ
    ↓
Business validation
    ↓
Coordinator
    ↓
LLM
```

This reduces malformed requests, unauthorized access, prompt-injection opportunities, and unnecessary model calls.

---

## Example FastAPI endpoint

```python
@app.post("/api/v1/customer-briefing")
async def customer_briefing(
    request: CustomerBriefingRequest,
    user=Depends(get_current_user)
):

    # Authorization
    if not authz.can_access_customer(
        user.id,
        user.tenant_id,
        request.customer_id
    ):
        raise HTTPException(
            status_code=403,
            detail="Customer access denied"
        )

    # Business validation
    validate_customer(request.customer_id)

    # Start workflow
    result = await coordinator.run(
        customer_id=request.customer_id,
        request=request.request,
        user_context={
            "user_id": user.id,
            "tenant_id": user.tenant_id
        }
    )

    return result
```

### Validation layers to remember

```text
1. API Gateway
   → token, size, rate limits

2. FastAPI/Pydantic
   → schema, type, required fields

3. Authorization
   → user, tenant, resource, capability

4. Business validation
   → valid customer, valid operation

5. MCP
   → tool parameters + enterprise authorization

6. Enterprise system
   → final system-level validation
```

### Interview-ready answer

> **“I validate API requests in multiple layers. APIM handles gateway-level controls and Entra token validation. FastAPI with Pydantic validates the request schema, required fields, data types, formats, and size limits. Then I perform authorization using the trusted user and tenant context, followed by business validation such as customer and capability checks. Only after those validations pass do I invoke the Coordinator and LLM workflow. I never trust user-provided identity or authorization fields.”**

### Easy memory

**Schema → AuthN → AuthZ → Business Rules → Coordinator → LLM**

**Strong interview line:**

> **“I validate the request before expensive or privileged operations; the LLM should receive validated business input and trusted security context, not raw untrusted requests.”**
