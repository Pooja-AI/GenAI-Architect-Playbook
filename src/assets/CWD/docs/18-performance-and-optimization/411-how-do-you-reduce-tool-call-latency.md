## How do you reduce tool-call latency in CWD?

In CWD, tool-call latency mainly occurs in:

```text
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Salesforce / ServiceNow / SharePoint
  ↓
Response
```

The key is to **reduce unnecessary calls, make independent calls parallel, and optimize the slowest dependency**.

### 1. Avoid unnecessary tool calls

Don't call Salesforce if the required information is already available in a valid cache or previous workflow result.

```text
Worker
 ↓
Do I already have valid data?
 ├── Yes → use it
 └── No  → MCP → Salesforce
```

---

### 2. Parallelize independent tool calls

Suppose Customer Briefing needs:

```text
Customer Worker → Salesforce
Incident Worker → ServiceNow
```

These are independent, so execute them concurrently:

```text
                 ┌→ Salesforce ── 1.2s
Worker/Delegator ┤
                 └→ ServiceNow ── 2.0s
```

Instead of:

```text
1.2s + 2.0s = 3.2s
```

the tool portion can approach the **slowest branch (~2.0s)**, plus orchestration overhead.

---

### 3. Reduce downstream payload

Don't retrieve unnecessary fields.

Instead of:

```text
Salesforce → entire customer record
```

request only:

```text
customer_id
customer_name
industry
account_status
opportunities
```

Smaller requests and responses generally mean less processing and network overhead.

---

### 4. Use connection pooling / persistent connections

Avoid creating a new connection for every MCP call.

```text
Bad:
Worker → create connection → call → close
Worker → create connection → call → close

Better:
Worker → connection pool → MCP
                         ├─ call
                         ├─ call
                         └─ call
```

This reduces connection setup overhead.

---

### 5. Optimize the MCP Server

Keep the MCP server lightweight.

For example:

```text
Worker
 ↓
MCP Server
 ↓
ServiceNow API
```

If MCP adds 2 seconds while ServiceNow takes 200 ms, optimize the MCP server.

But if:

```text
MCP Server     100 ms
ServiceNow   3,000 ms
```

then scaling the MCP server won't solve the real problem.

---

### 6. Cache safe read operations

For frequently requested, relatively stable data:

```text
Worker
 ↓
Cache
 ├── HIT  → return
 └── MISS → MCP → Enterprise API
```

For example, some customer metadata may be cached subject to **freshness, tenant isolation, authorization, and data sensitivity**.

Don't blindly cache transactional writes.

---

### 7. Use timeouts

Every tool call should have a bounded timeout.

```python
result = await asyncio.wait_for(
    mcp_client.call_tool(
        "get_customer",
        {"customer_id": "C12345"}
    ),
    timeout=5
)
```

A slow Salesforce call shouldn't block the entire CWD workflow indefinitely.

---

### 8. Retry only transient failures

For:

* Timeout
* 429
* 502
* 503
* 504

use bounded retries with exponential backoff and jitter.

Don't repeatedly retry:

* 401
* 403
* Invalid parameters
* Business validation failures

Otherwise retries can actually **increase latency and overload the dependency**.

---

### 9. Use circuit breakers

If ServiceNow is repeatedly failing:

```text
ServiceNow
   ↓
Repeated failures
   ↓
Circuit OPEN
   ↓
Stop sending calls temporarily
```

This prevents every CWD request from waiting for a dependency that is already unhealthy.

---

### 10. Control concurrency

Parallelism helps, but unlimited parallel calls can overwhelm Salesforce or ServiceNow.

For example:

```text
Worker
 ↓
Concurrency limit = 20
 ↓
MCP calls
 ↓
ServiceNow
```

If the downstream API starts returning `429`, reduce concurrency and respect `Retry-After`.

---

### 11. Measure tool-call latency

With distributed tracing:

```text
Trace: TR-1001

Incident Worker       4.2 sec
 └─ MCP Client          50 ms
 └─ MCP Server         100 ms
 └─ ServiceNow       3.9 sec  ← bottleneck
```

This tells me **where the latency actually comes from**.

I would monitor:

* MCP P50/P95/P99
* MCP server processing time
* Enterprise API latency
* Network latency
* 429/5xx rate
* Timeout rate
* Retry count
* Concurrent tool calls
* Cache hit rate

### 🎯 Interview-ready answer

> **“I reduce tool-call latency in CWD by avoiding unnecessary calls, parallelizing independent tool calls, requesting only the required data, using connection pooling, caching safe read operations, and optimizing the MCP server and downstream integrations. I use bounded timeouts, retries with exponential backoff and jitter, circuit breakers, and concurrency limits to prevent slow or unhealthy dependencies from affecting the entire workflow. Most importantly, I use distributed tracing to determine whether the latency is coming from the MCP client, MCP server, network, or the actual enterprise system such as Salesforce or ServiceNow.”**

**Easy memory:**

**Fewer calls → Parallelize → Smaller payload → Pool → Cache → Timeout → Retry carefully → Circuit breaker → Measure.**
