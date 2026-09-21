## How do you monitor error rates?

In CWD, I monitor **error rates at every layer**, not just the API level. A request can return HTTP 200 while an individual Worker, MCP tool, or LLM operation has failed.

### 1. CWD error flow

```text
User
 ↓
API
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓
Worker
 ├── RAG
 ├── LLM
 └── MCP
      ↓
 Salesforce / ServiceNow
```

I create metrics and trace spans for each layer.

### 2. Basic error-rate calculation

```text
Error Rate =
Failed Operations / Total Operations × 100
```

For example:

```text
1,000 Worker executions
   ↓
30 failures
   ↓
Error rate = 3%
```

But I don't use only one overall number.

### 3. Break errors down by component

```text
API errors          0.5%
Coordinator errors  0.8%
A2A errors          1.2%
Worker errors       2.0%
RAG errors          0.7%
LLM errors          1.5%
MCP errors          3.8%  ← investigate
```

Then I drill into the MCP errors:

```text
MCP
 ├── Salesforce → 1.2%
 ├── ServiceNow → 6.5%  ← bottleneck
 └── SharePoint → 0.8%
```

### 4. Distinguish error types

I classify errors rather than treating everything as the same:

```text
4xx → validation / authorization / bad request
5xx → service/dependency failure
Timeout → dependency/performance issue
429 → rate limiting
LLM error → provider/model failure
MCP error → tool/server/downstream failure
RAG error → retrieval/indexing failure
A2A error → agent communication failure
```

This helps determine the correct recovery strategy.

For example:

```text
Transient timeout
     ↓
Retry + backoff

Authorization failure
     ↓
Do NOT retry
     ↓
Audit + return controlled error
```

### 5. Monitor error-rate trends

I monitor error rates over time:

```text
P95 / Error Rate

Monday     0.8%
Tuesday    0.9%
Wednesday  1.0%
Thursday   3.7%  ← regression
```

Then correlate the increase with:

* new model
* prompt change
* application deployment
* MCP change
* enterprise API outage
* traffic increase
* rate limiting
* configuration change

### 6. Monitor by Worker

For CWD:

```text
Customer Worker       0.5%
Opportunity Worker    1.1%
Incident Worker       5.4%  ← investigate
```

Then trace the failed Incident Worker:

```text
Incident Worker
     ↓
MCP
     ↓
ServiceNow
     ↓
Timeout
```

Now I know the error isn't necessarily a Worker-code problem; it may be a downstream dependency problem.

### 7. Monitor retries separately

Retries can hide the real failure rate.

For example:

```text
100 MCP calls
 ↓
10 initially fail
 ↓
8 succeed after retry
 ↓
2 permanently fail
```

I track:

```text
Initial failure rate = 10%
Final failure rate   = 2%
Retry rate           = 10%
```

This tells me the system is recovering, but there is still an underlying reliability problem.

### 8. Track business-level failure

For Agentic AI, HTTP success isn't enough.

Example:

```text
API → 200 OK ✓
Coordinator → success ✓
Worker → success ✓
LLM → response ✓
Business task → incomplete ❌
```

So I also monitor:

```text
Task completion rate
Partial workflow rate
Worker failure rate
Tool failure rate
Invalid structured-output rate
Abstention rate
```

### Tools

For Azure CWD:

```text
OpenTelemetry
      ↓
Application Insights
      ↓
Log Analytics
      ↓
Dashboards + Alerts
```

And **Langfuse** for LLM/agent-specific errors and traces.

### Interview-ready answer

> **“I monitor error rates at every layer of CWD—API, Coordinator, A2A, Delegator, Worker, RAG, LLM and MCP. I calculate failure rate as failed operations divided by total operations, but I also break it down by error type, component, Worker and dependency. I track both initial and final failure rates so retries don't hide underlying problems. Most importantly, I monitor business task completion because an HTTP 200 doesn't necessarily mean the agent completed the business task successfully.”**

### Strong interview line

> **“For Agentic AI, I don't define reliability as HTTP success. I monitor technical errors, agent failures, tool failures, and ultimately whether the business task actually completed.”**

**Easy memory:**
**Count → Classify → Break down → Trend → Trace → Retry vs permanent → Business completion**
