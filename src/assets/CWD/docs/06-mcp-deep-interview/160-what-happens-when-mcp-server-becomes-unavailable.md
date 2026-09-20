In your **CWD architecture**, if an MCP Server becomes unavailable, the Worker should **not hang or fail the entire workflow immediately**. We use **timeout → retry → circuit breaker → fallback/partial result → resume**.

### 1. Flow

```text id="8xk5aw"
Worker
  ↓
MCP Client
  ↓
MCP Server ❌ UNAVAILABLE
  ↓
Timeout
  ↓
Retry with exponential backoff
  ↓
Still failing?
  ↓
Circuit Breaker OPEN
  ↓
Fallback / Partial Result / Queue
  ↓
Coordinator
```

---

### 2. First: timeout

Don't allow the Worker to wait forever.

```python id="n4vr1a"
try:
    result = await asyncio.wait_for(
        mcp_client.call_tool(
            "get_customer",
            {"customer_id": "C123"}
        ),
        timeout=5
    )
except asyncio.TimeoutError:
    handle_timeout()
```

For example:

```text
MCP timeout = 5 seconds
```

The exact value would be based on the tool's SLA.

---

### 3. Retry transient failures

If the MCP Server temporarily fails:

```text id="0o3h7r"
Attempt 1 → Failed
    ↓
1 second
    ↓
Attempt 2 → Failed
    ↓
2 seconds
    ↓
Attempt 3 → Failed
```

Use **exponential backoff + jitter**.

```python id="3z7l1m"
for attempt in range(3):
    try:
        return await call_mcp()
    except TransientError:
        await backoff_with_jitter(attempt)

raise MCPUnavailable()
```

But don't retry every error.

```text
Timeout / 503       → retry
Connection failure  → retry
401 Unauthorized    → don't retry blindly
403 Forbidden       → don't retry
Invalid arguments   → don't retry
```

---

### 4. Circuit breaker

If the MCP Server is repeatedly failing, stop sending requests to it.

```text id="4c9n4j"
MCP Server
   ↓
Failure
   ↓
Failure
   ↓
Failure
   ↓
Circuit OPEN
   ↓
Stop sending calls temporarily
```

After a recovery period:

```text id="a2wz2r"
OPEN
 ↓
HALF-OPEN
 ↓
Test request
 ↓
Success → CLOSED
Failure → OPEN
```

This prevents the failing MCP Server from causing a **cascading failure** across CWD.

---

### 5. What happens to the CWD workflow?

Suppose Customer Briefing needs:

```text id="x2zv7h"
Sales Delegator
 ├── Customer Worker → Salesforce MCP ✅
 └── Opportunity Worker → Salesforce MCP ❌

IT Delegator
 └── Incident Worker → ServiceNow MCP ✅
```

The Coordinator might receive:

```text id="n5u8qs"
Customer information   → SUCCESS
Opportunities           → UNAVAILABLE
Incidents               → SUCCESS
```

Instead of failing everything, the Coordinator can return a **partial result** if the business workflow allows it:

```text id="2p4u6m"
Customer Briefing
 ├── Customer information ✅
 ├── Incidents           ✅
 └── Opportunities       ⚠️ Temporarily unavailable
```

This is much better than returning nothing.

---

### 6. Persist the failed work

For operations that shouldn't be lost, persist the workflow state:

```text id="y0r9c8"
Worker
 ↓
MCP failure
 ↓
Persist state
 ↓
Queue / Service Bus
 ↓
Retry later
```

In your CWD architecture, this works with your **durable state + Service Bus/DLQ** approach.

For example:

```text
run = 789
step = get_opportunities
status = WAITING_FOR_RETRY
```

When the MCP Server recovers, the workflow can resume from that step rather than starting from the beginning.

---

### 7. Important distinction: read vs write

For a read:

```text id="t6b3u1"
get_customer()
```

a retry is generally straightforward.

For a write:

```text id="s6a9dz"
update_customer()
delete_customer()
```

you have to be much more careful.

Suppose the MCP Server executed the Salesforce deletion, but the response was lost:

```text id="t2h5kn"
Worker → DELETE → Salesforce
                    ↓
                  SUCCESS
                    ↓
             Response lost ❌
```

If you blindly retry, you could duplicate an operation.

Therefore use:

```text id="g7m6zq"
Idempotency key
+
Operation status check
+
Safe retry policy
```

---

## Strong interview answer

> **“If an MCP Server becomes unavailable, the MCP Client first applies a timeout so the Worker doesn't hang. For transient failures, we retry with exponential backoff and jitter. If failures continue, we open a circuit breaker to prevent cascading failures. Depending on the business requirement, CWD can return a partial result, use a fallback, or persist the failed step in durable state and retry asynchronously through a queue. For write operations, we use idempotency keys and status checks so that a lost response doesn't result in duplicate transactions. Once the MCP Server recovers, the workflow can resume from the failed step.”**

### Easy memory trick

**MCP failure =**

**Timeout → Retry → Circuit Breaker → Fallback/Queue → Resume**

And for write operations:

> **“Never blindly retry a transaction when you don't know whether the first attempt succeeded.”**
