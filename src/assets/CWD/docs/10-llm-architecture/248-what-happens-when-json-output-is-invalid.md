## What happens when JSON output is invalid?

In CWD, an invalid JSON response is treated as a **validation failure**, not as a successful LLM result. I don't pass malformed output to the next Worker, Delegator, or Coordinator.

### CWD flow

```text
LLM
 ↓
JSON Output
 ↓
Parse + Schema Validation
 ↓
Valid?
 ↙        ↘
YES        NO
 ↓          ↓
Continue   Repair / Retry
             ↓
          Validate
             ↓
       Still invalid?
          ↙       ↘
        YES        NO
         ↓          ↓
    Fallback /    Continue
    Controlled
      Error
```

### 1. Parse the JSON

First, I check whether the response is actually valid JSON.

```python
import json

try:
    data = json.loads(response)
except json.JSONDecodeError:
    # Invalid JSON
    ...
```

For example, this is invalid:

```text
{
  "customer_id": "C123",
  "status": "Active"
```

The closing `}` is missing.

---

### 2. Try bounded repair/retry

If the issue is a simple formatting problem, I can retry with a structured-output request.

```text
Invalid JSON
    ↓
Retry with schema
    ↓
LLM
    ↓
Validate again
```

I **don't retry indefinitely**.

---

### 3. Validate against the schema

Even valid JSON can have the wrong structure.

```json
{
  "customer_id": "C123",
  "status": 123
}
```

This is valid JSON, but if `status` must be a string, schema validation fails.

So:

```text
JSON Parsing
      ↓
Schema Validation
      ↓
Business Validation
```

---

### 4. Don't execute MCP tools until validation succeeds

This is especially important in CWD.

```text
LLM
 ↓
Invalid JSON
 ↓
STOP
 ↓
No MCP call
```

For example, if the LLM generates malformed or invalid arguments for:

```text
get_customer(customer_id)
```

the Worker does **not** send the request to Salesforce.

---

### 5. Use fallback when necessary

If the primary model repeatedly produces invalid structured output:

```text
Primary Model
     ↓
Invalid
     ↓
Retry
     ↓
Invalid
     ↓
Fallback Model
     ↓
Validate
```

The fallback must support the required structured-output/tool-calling capability.

---

### 6. Fail gracefully

If all attempts fail:

```text
LLM
 ↓
Invalid
 ↓
Retry
 ↓
Invalid
 ↓
Fallback
 ↓
Invalid
 ↓
Controlled failure
```

The system can mark that **Worker step as failed**, persist the LangGraph checkpoint, and allow the workflow to retry/resume later rather than corrupting the overall workflow state.

---

### 🎯 Strong interview answer

> **“If the LLM returns invalid JSON, we treat it as a validation failure. We first parse and validate it against our JSON/Pydantic schema. If parsing or validation fails, we perform a bounded retry using structured-output constraints. We never execute an MCP tool using unvalidated arguments. If the primary model continues to fail, we can use a prevalidated fallback model. If all attempts fail, we mark the Worker step as failed, persist the workflow state, and fail gracefully or resume later.”**

### Easy memory trick

**Parse → Validate → Retry → Fallback → Fail Gracefully**

Key interview line:

> **“Never pass unvalidated LLM output to the next component or an enterprise tool.”**
