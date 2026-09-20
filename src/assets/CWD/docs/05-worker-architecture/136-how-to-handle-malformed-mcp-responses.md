In your **CWD architecture**, I would handle a malformed MCP response using **schema validation + defensive parsing + retry/recovery + structured error handling**.

The key principle is:

> **Never allow an invalid MCP response to flow directly into the Coordinator or LLM. Validate it at the MCP Client/Worker boundary first.**

## 1. Flow

```text
Worker
   |
   | call MCP tool
   v
MCP Server
   |
   v
Salesforce / ServiceNow
   |
   v
MCP Response
   |
   v
MCP Client
   |
   +--> Schema Validation
   |
   +--> Valid? ------ YES ---> Worker
   |
   +--> NO ----------> Error Handling
                          |
                    +-----+-----+
                    |           |
                  Retry      Fail safely
```

---

# 2. What is a malformed response?

For example, your tool expects:

```json
{
  "customer_id": "C12345",
  "name": "ABC Manufacturing",
  "industry": "Manufacturing"
}
```

But Salesforce/MCP returns:

```json
{
  "customer": "ABC Manufacturing"
}
```

Required fields are missing.

Or:

```json
{
  "customer_id": 12345,
  "name": "ABC Manufacturing"
}
```

`customer_id` should be a string.

Or:

```text
"Internal Server Error"
```

instead of structured JSON.

Or:

```json
{
  "customer_id": "C12345",
  "name": null,
  "industry": []
}
```

where the types don't match your contract.

---

# 3. Define a response schema

For example, using **Pydantic**:

```python
from pydantic import BaseModel


class CustomerResponse(BaseModel):

    customer_id: str
    name: str
    industry: str | None = None
    region: str | None = None
```

Now the Worker expects:

```text
customer_id → string
name        → string
industry    → string/null
region      → string/null
```

---

# 4. Validate the MCP response

After the MCP Client receives the response:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {
        "customer_id": "C12345"
    }
)
```

Don't immediately pass `result` to the LLM.

Validate it:

```python
try:

    customer = CustomerResponse.model_validate(
        result
    )

except ValidationError as e:

    # malformed MCP response
    ...
```

So:

```text
MCP Response
     |
     v
Pydantic validation
     |
     +---- VALID ------> Worker
     |
     +---- INVALID ----> Error handling
```

---

# 5. Complete Worker example

```python
from pydantic import BaseModel, ValidationError


class CustomerResponse(BaseModel):

    customer_id: str
    name: str
    industry: str | None = None
    region: str | None = None


async def customer_worker(customer_id: str):

    try:

        raw_result = await mcp_client.call_tool(
            "get_customer",
            {
                "customer_id": customer_id
            }
        )

        # Validate MCP response
        customer = CustomerResponse.model_validate(
            raw_result
        )

        return {
            "status": "SUCCESS",
            "data": customer.model_dump()
        }

    except ValidationError as e:

        return {
            "status": "INVALID_RESPONSE",
            "data": None,
            "error": str(e)
        }

    except Exception as e:

        return {
            "status": "FAILED",
            "data": None,
            "error": str(e)
        }
```

---

# 6. Example: malformed response

Suppose MCP returns:

```json
{
  "customer_id": 12345,
  "industry": "Manufacturing"
}
```

Validation fails because:

```text
customer_id → expected string
name         → missing
```

Your Worker returns:

```json
{
  "status": "INVALID_RESPONSE",
  "data": null,
  "error": "Response schema validation failed"
}
```

The important part is:

**The invalid data doesn't continue downstream.**

---

# 7. Don't send malformed data to the LLM

This is especially important for Agentic AI.

Bad:

```text
MCP
 ↓
Malformed response
 ↓
LLM
 ↓
LLM tries to interpret it
```

This can cause hallucination or incorrect business decisions.

Instead:

```text
MCP
 ↓
Schema Validation
 ↓
INVALID
 ↓
Worker error state
 ↓
Coordinator
```

The Coordinator knows:

```text
Incident Worker = INVALID_RESPONSE
```

rather than pretending the response is valid.

---

# 8. Retry only when appropriate

Suppose the response is malformed because of a temporary downstream issue.

You can retry:

```python
for attempt in range(2):

    result = await call_mcp_tool()

    try:
        return CustomerResponse.model_validate(
            result
        )

    except ValidationError:

        if attempt == 1:
            raise

        await asyncio.sleep(1)
```

But don't blindly retry forever.

Use:

```text
max retries = 2 or 3
```

with exponential backoff.

---

# 9. Retry vs don't retry

This distinction is important in interviews.

### Temporary failure

```text
Timeout
503
502
connection reset
temporary service unavailable
```

Potentially retry.

### Schema failure

```text
missing customer_id
wrong data type
invalid structure
unexpected response
```

Usually **don't repeatedly retry the exact same request**.

Instead:

```text
Validate
 ↓
Record malformed response
 ↓
Retry once if the failure could be transient
 ↓
If still invalid → fail safely
```

---

# 10. MCP Server should validate too

You can validate at **both sides**.

### MCP Server

Validate the enterprise API response:

```text
Salesforce
    ↓
MCP Server
    ↓
Schema validation
    ↓
MCP response
```

### MCP Client / Worker

Validate the MCP response again:

```text
MCP Server
    ↓
MCP Client
    ↓
Schema validation
    ↓
Worker
```

This gives you defense in depth.

---

# 11. Example at MCP Server

```python
class SalesforceCustomer(BaseModel):

    id: str
    name: str
    industry: str | None = None


@mcp.tool()
async def get_customer(
    customer_id: str
):

    raw_response = await salesforce_api.get_customer(
        customer_id
    )

    try:

        customer = SalesforceCustomer.model_validate(
            raw_response
        )

    except ValidationError:

        raise RuntimeError(
            "Salesforce returned invalid customer data"
        )

    return {
        "customer_id": customer.id,
        "name": customer.name,
        "industry": customer.industry
    }
```

Now the MCP Server itself won't expose an invalid enterprise response as a normal tool result.

---

# 12. What if the MCP server itself returns an invalid structure?

Suppose the MCP Server unexpectedly returns:

```json
{
    "status": "SUCCESS"
}
```

but the Worker expects:

```json
{
    "status": "SUCCESS",
    "data": {
        "customer_id": "...",
        "name": "..."
    }
}
```

Define an envelope:

```python
class MCPToolResponse(BaseModel):

    status: str
    data: CustomerResponse
```

Then:

```python
response = MCPToolResponse.model_validate(
    raw_result
)
```

If `data` is missing:

```text
ValidationError
```

and the Worker doesn't process it.

---

# 13. How does this work with LangGraph?

This fits very naturally into your CWD LangGraph state.

For example:

```python
class CWDState(TypedDict):

    customer_result: dict | None
    customer_status: str
    customer_error: str | None
```

Worker node:

```python
async def customer_worker_node(state):

    try:

        raw = await mcp_client.call_tool(
            "get_customer",
            {
                "customer_id":
                    state["customer_id"]
            }
        )

        customer = CustomerResponse.model_validate(
            raw
        )

        return {
            "customer_result":
                customer.model_dump(),

            "customer_status":
                "SUCCESS",

            "customer_error":
                None
        }

    except ValidationError as e:

        return {
            "customer_result": None,
            "customer_status": "INVALID_RESPONSE",
            "customer_error": str(e)
        }
```

Now LangGraph has explicit state:

```text
customer_status =
    SUCCESS
    INVALID_RESPONSE
    TIMEOUT
    FAILED
```

---

# 14. Coordinator handles it

Suppose your Customer Briefing has:

```text
Customer Worker       SUCCESS
Opportunity Worker    SUCCESS
Incident Worker       INVALID_RESPONSE
Document Worker       SUCCESS
```

The Coordinator receives all results.

It can aggregate:

```python
if incident_status == "INVALID_RESPONSE":

    final_response["warnings"].append(
        "Incident information could not be "
        "validated."
    )
```

Then the final response might say:

```text
Customer: ABC Manufacturing

Customer information: Available
Opportunities: Available
Documents: Available
Incidents: Unavailable

Reason:
The ServiceNow MCP response failed schema validation.
```

This is **graceful degradation**.

---

# 15. Audit the malformed response

You should also create an audit/observability event:

```json
{
  "event": "MCP_INVALID_RESPONSE",
  "correlation_id": "CWD-789",
  "worker": "IncidentWorker",
  "tool": "get_customer_incidents",
  "status": "INVALID_RESPONSE",
  "validation_error": "Missing required field: incidents"
}
```

Don't log the entire potentially sensitive response.

---

# 16. Production flow

For your CWD architecture, I would describe the production pattern as:

```text
                 Worker
                    |
                    v
               MCP Client
                    |
                    v
              MCP Server
                    |
              Authorization
                    |
              Tool Execution
                    |
                    v
          Salesforce / ServiceNow
                    |
                    v
             MCP Response
                    |
                    v
          Schema Validation
                    |
          +---------+---------+
          |                   |
        VALID              INVALID
          |                   |
          v                   v
       Worker          Retry if appropriate
                              |
                         Still invalid?
                              |
                              v
                       Structured Error
                              |
                              v
                         Coordinator
```

### Interview answer

> **"We don't trust MCP responses blindly. We validate every tool response against a strongly typed schema, typically using Pydantic. The MCP Server validates the downstream enterprise response, and the Worker validates the MCP response before passing it into the LangGraph state or LLM. If the response is malformed, we capture the validation error, retry only when the failure is potentially transient, and otherwise return a structured `INVALID_RESPONSE` state. The Coordinator can then gracefully degrade or continue with the other Workers. We also audit the malformed call using the correlation ID without logging sensitive payloads."**

### One-line answer

> **"Validate every MCP response against a schema; if invalid, don't pass it to the LLM—retry when appropriate, otherwise fail safely and let the Coordinator handle the structured error."**
