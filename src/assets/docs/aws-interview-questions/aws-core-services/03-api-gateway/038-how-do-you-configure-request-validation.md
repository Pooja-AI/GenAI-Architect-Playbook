# How do you configure request validation?

## Short answer

I validate the request **at the API boundary before it reaches the CWD Coordinator**.

I validate the **schema, required fields, data types, allowed values, request size, and security-related constraints**. Invalid requests are rejected early with **400 Bad Request**, so they don't consume CWD, Bedrock, MCP, or downstream resources.

## Key points

1. **Schema validation**
2. **Required fields**
3. **Data types**
4. **Allowed values**
5. **String/array size limits**
6. **Request body size**
7. **Header/query parameter validation**
8. **Security validation**
9. **Reject before Coordinator**

### CWD flow

```text
Client
   ↓
API Gateway
   ↓
Authentication
   ↓
Authorization
   ↓
Request Validation
   ↓
Valid?
 ┌─┴─────────┐
No           Yes
↓             ↓
400          CWD API
              ↓
         Coordinator
              ↓
          Delegator
              ↓
           Worker
```

---

## 1. Define an API schema

For example, CWD Customer Briefing API:

```json
{
  "customer_id": "C12345",
  "request_type": "customer_briefing"
}
```

Define a schema such as:

```json
{
  "type": "object",
  "required": ["customer_id", "request_type"],
  "properties": {
    "customer_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "request_type": {
      "type": "string",
      "enum": ["customer_briefing"]
    }
  },
  "additionalProperties": false
}
```

Now the API can reject unexpected or malformed input.

---

## 2. Validate required fields

For example:

```json
{
  "request_type": "customer_briefing"
}
```

`customer_id` is missing.

API Gateway rejects it:

```text
400 Bad Request
```

The request never reaches the Coordinator.

---

## 3. Validate data types

Expected:

```json
{
  "customer_id": "C12345"
}
```

But someone sends:

```json
{
  "customer_id": 12345
}
```

The schema can reject it because `customer_id` must be a string.

---

## 4. Validate allowed values

Suppose:

```text
request_type ∈
{
  customer_briefing,
  incident_summary,
  product_summary
}
```

If someone sends:

```json
{
  "request_type": "delete_customer"
}
```

the request is rejected if that value isn't part of the API contract.

---

## 5. Validate size limits

I also protect the API from oversized requests.

For example:

```text
customer_id     → max 50 characters
query           → max 2,000 characters
array items     → max 20
request body    → defined maximum
```

This helps prevent resource exhaustion and accidental huge prompts.

---

## 6. Validate query parameters and headers

Example:

```text
GET /customer/C12345?include_incidents=true
```

Validate:

```text
customer_id       → correct format
include_incidents → boolean
Content-Type      → application/json
```

---

## 7. Security validation

Request validation is **not a replacement for authentication or authorization**.

The flow is:

```text
Authentication
      ↓
Authorization
      ↓
Schema validation
      ↓
Business validation
      ↓
Coordinator
```

For example, even if:

```json
{
  "customer_id": "C12345"
}
```

is structurally valid, I still need to check:

> Does this user have permission to access C12345?

That is authorization, not schema validation.

---

## 8. Validate again inside CWD

I use **defense in depth**.

For example:

```text
API Gateway
   ↓
Schema validation
   ↓
FastAPI / Pydantic
   ↓
Business validation
   ↓
Coordinator
```

API Gateway provides the first boundary check.

FastAPI/Pydantic provides application-level validation.

Business rules are validated separately.

---

## Example

User sends:

```json
{
  "customer_id": "",
  "request_type": "customer_briefing"
}
```

Validation detects:

```text
customer_id → minLength violation
```

Response:

```text
400 Bad Request
```

No:

```text
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
Bedrock
```

So we avoid unnecessary processing and cost.

---

## 🎯 Strong interview answer

> **“I configure request validation at the API Gateway boundary using an API schema. I validate required fields, data types, allowed values, request size, query parameters and headers. Invalid requests are rejected with a 400 before they reach the CWD Coordinator. I also validate again in the FastAPI application using Pydantic and perform business and authorization checks separately. This gives me defense in depth and prevents malformed requests from consuming LLM, MCP, and downstream resources.”**

## Easy memory trick

**S → R → T → V → S → B**

* **S**chema
* **R**equired fields
* **T**ype
* **V**alue
* **S**ize
* **B**usiness validation

### Key distinction

| Layer               | Responsibility                  |
| ------------------- | ------------------------------- |
| API Gateway         | Request/schema validation       |
| Authentication      | Who are you?                    |
| Authorization       | What can you access?            |
| FastAPI/Pydantic    | Application validation          |
| Business validation | Is the request logically valid? |
| Coordinator         | Agent orchestration             |

**Interview line to remember:**

> **“Validate early at the API boundary, validate again in the application, and never rely on the LLM for validation or authorization.”**
