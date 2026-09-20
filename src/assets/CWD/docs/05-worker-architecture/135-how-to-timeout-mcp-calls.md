In your **CWD architecture**, MCP timeouts should be enforced at multiple layers so that a slow Salesforce/ServiceNow call doesn't block the entire agent workflow.

## 1. Basic flow

```text
Worker
   |
   | MCP call
   v
MCP Client
   |
   | 10 sec timeout
   v
MCP Server
   |
   | 8 sec timeout
   v
Salesforce / ServiceNow
```

The key idea is:

> **Set a timeout on the MCP Client call and also enforce a timeout when the MCP Server calls the downstream enterprise API.**

---

# 2. MCP Client timeout

Suppose the Worker calls:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C12345"}
)
```

You can wrap the MCP invocation with `asyncio.wait_for()`:

```python
import asyncio

async def call_mcp_tool(
    mcp_client,
    tool_name,
    arguments,
    timeout_seconds=10
):

    try:
        result = await asyncio.wait_for(
            mcp_client.call_tool(
                tool_name,
                arguments
            ),
            timeout=timeout_seconds
        )

        return result

    except asyncio.TimeoutError:
        raise TimeoutError(
            f"MCP tool '{tool_name}' "
            f"timed out after {timeout_seconds} seconds"
        )
```

Now:

```python
result = await call_mcp_tool(
    mcp_client,
    "get_customer",
    {
        "customer_id": "C12345"
    },
    timeout_seconds=10
)
```

means:

```text
MCP call starts
      |
      |---- 0 sec
      |
      |---- 5 sec
      |
      |---- 9 sec
      |
      |---- 10 sec
      X
   TIMEOUT
```

---

# 3. MCP Server also needs a timeout

Don't rely only on the Client timeout.

The MCP Server might call Salesforce:

```python
response = await salesforce_api.get_customer(
    customer_id
)
```

That downstream call should have its own timeout.

For example with `httpx`:

```python
import httpx

timeout = httpx.Timeout(
    connect=2.0,
    read=5.0,
    write=2.0,
    pool=2.0
)

async with httpx.AsyncClient(
    timeout=timeout
) as client:

    response = await client.get(
        salesforce_url,
        headers=headers
    )

    response.raise_for_status()
```

So now:

```text
MCP Client
   |
   | 10 sec
   v
MCP Server
   |
   | 5 sec
   v
Salesforce
```

---

# 4. Why have two timeouts?

Because they protect different boundaries.

### Client timeout

Protects:

```text
Worker → MCP Server
```

### Server/API timeout

Protects:

```text
MCP Server → Salesforce
```

For example:

```text
Worker
 |
 | maximum 10 sec
 v
MCP Server
 |
 | maximum 5 sec
 v
Salesforce
```

If Salesforce hangs, the MCP Server stops waiting after 5 seconds.

---

# 5. What happens when Salesforce times out?

Suppose:

```text
Customer Worker
      |
      v
MCP Client
      |
      v
Salesforce MCP Server
      |
      v
Salesforce
      |
      | no response
      |
      X
    5 sec
```

The MCP Server catches the timeout:

```python
try:

    response = await client.get(
        salesforce_url
    )

except httpx.ReadTimeout:

    return {
        "status": "TIMEOUT",
        "tool": "get_customer",
        "message": "Salesforce did not respond"
    }
```

The Worker receives a structured failure:

```json
{
  "status": "TIMEOUT",
  "tool": "get_customer"
}
```

It should **not hallucinate customer information**.

---

# 6. Add retry carefully

A timeout doesn't necessarily mean permanent failure.

You can retry transient failures.

For example:

```python
import asyncio

async def call_salesforce():

    for attempt in range(3):

        try:
            return await salesforce_api.get_customer(
                "C12345"
            )

        except TimeoutError:

            if attempt == 2:
                raise

            await asyncio.sleep(
                2 ** attempt
            )
```

This gives:

```text
Attempt 1
   |
   X timeout
   |
  1 sec
   |
Attempt 2
   |
   X timeout
   |
  2 sec
   |
Attempt 3
   |
   X timeout
   |
FAIL
```

But don't blindly retry every MCP tool.

---

# 7. Important: GET vs DELETE/UPDATE

For a read:

```text
get_customer()
```

retrying can often be acceptable.

For:

```text
delete_customer()
```

or:

```text
create_ticket()
```

you have to be much more careful.

Imagine:

```text
create_ticket()
      |
      v
ServiceNow
      |
      | ticket created
      |
      X response lost
```

Your MCP Server thinks:

```text
TIMEOUT
```

But ServiceNow actually created the ticket.

If you blindly retry:

```text
create_ticket()
```

you could create **duplicate tickets**.

Therefore, for write operations use **idempotency keys** where supported.

```python
idempotency_key = "CWD-task123-create-ticket"
```

---

# 8. Timeout + retry + circuit breaker

For production CWD, I would use:

```text
              MCP Server
                  |
          +-------+-------+
          |               |
       Timeout           Retry
          |               |
          +-------+-------+
                  |
           Circuit Breaker
                  |
                  v
           Salesforce API
```

Example:

```text
Salesforce
   |
   | repeated timeouts
   v
Circuit Breaker OPEN
   |
   X
Don't send more requests
```

This prevents a failing enterprise system from consuming all your Worker resources.

---

# 9. How this affects CWD

Suppose you have:

```text
Customer Briefing
       |
       +-- Customer Worker ──> Salesforce
       |
       +-- Opportunity Worker ──> Salesforce
       |
       +-- Incident Worker ──> ServiceNow
```

Now ServiceNow is slow:

```text
Customer Worker
      |
      v
SUCCESS

Opportunity Worker
      |
      v
SUCCESS

Incident Worker
      |
      v
TIMEOUT
```

Your Coordinator shouldn't wait indefinitely.

Instead:

```text
Customer       SUCCESS
Opportunity    SUCCESS
Incident       TIMEOUT
```

Then the Coordinator can produce a **partial result**:

```text
Customer briefing generated.

Customer information: available
Opportunity information: available
Incident information: unavailable

Reason:
ServiceNow MCP call timed out.
```

That's much better than failing the entire workflow unnecessarily.

---

# 10. LangGraph timeout handling

Since you're using **LangGraph**, the Worker node can convert the timeout into structured state.

For example:

```python
async def incident_worker_node(state):

    try:

        result = await asyncio.wait_for(
            mcp_client.call_tool(
                "get_customer_incidents",
                {
                    "customer_id":
                        state["customer_id"]
                }
            ),
            timeout=10
        )

        return {
            "incident_result": result,
            "incident_status": "SUCCESS"
        }

    except asyncio.TimeoutError:

        return {
            "incident_result": None,
            "incident_status": "TIMEOUT",
            "incident_error":
                "ServiceNow MCP call timed out"
        }
```

Then your LangGraph state might contain:

```python
{
    "customer_result": {...},
    "opportunity_result": {...},
    "incident_result": None,

    "incident_status": "TIMEOUT"
}
```

The Coordinator can then decide what to do.

---

# 11. Timeout should be observable

Every timeout should generate telemetry:

```json
{
  "event": "MCP_TOOL_TIMEOUT",
  "tool": "get_customer_incidents",
  "worker": "IncidentWorker",
  "server": "ServiceNowMCPServer",
  "timeout_ms": 10000,
  "correlation_id": "CWD-789"
}
```

Then in your monitoring system you can track:

```text
MCP timeout rate
Average tool latency
P95 latency
P99 latency
Timeout count by tool
Timeout count by enterprise system
Retry count
Circuit-breaker opens
```

---

## Interview answer

If they ask **"How do you timeout MCP calls?"**, say:

> **"We enforce timeouts at both the MCP client and MCP server layers. The Worker-side MCP invocation has an overall deadline, for example 10 seconds, while the MCP Server applies a shorter timeout to the downstream Salesforce or ServiceNow API. We catch timeout exceptions, record them with the correlation ID for observability, and return a structured failure to the Worker rather than allowing the workflow to hang. For transient failures we use bounded retries with backoff, and for repeated failures we use a circuit breaker. For write operations, we use idempotency mechanisms to avoid duplicate actions during retries."**

### Simple mental model

```text
Worker
  |
  | 10 sec overall timeout
  v
MCP Client
  |
  v
MCP Server
  |
  | 5 sec API timeout
  v
Salesforce / ServiceNow
```

**Timeout → Retry if safe → Circuit breaker if repeated → Structured failure → Coordinator decides whether to continue or partially complete.**
