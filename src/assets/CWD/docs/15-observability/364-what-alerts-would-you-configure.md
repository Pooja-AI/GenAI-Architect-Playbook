## What alerts would you configure?

For **CWD**, I would configure alerts across **availability, performance, reliability, AI behavior, dependencies, security, and cost**.

### 1. Application / API alerts

```text
API 5xx error rate > threshold
API availability drops
Request failure rate increases
P95/P99 latency exceeds SLA
```

Example:

```text
CWD API P95 > 5 sec
        ↓
Azure Monitor Alert
        ↓
Notification / Incident
```

### 2. Agent workflow alerts

I would monitor:

```text
Coordinator failures
Delegator routing failures
Worker failures
Task completion rate
Workflow timeout
Agent loop / excessive iterations
Checkpoint/resume failures
```

For example:

```text
Task completion rate < 95%
        ↓
Alert
```

This is important because an HTTP `200` does not necessarily mean the **business task succeeded**.

### 3. A2A alerts

```text
A2A failure rate increases
A2A timeout
A2A latency > threshold
Repeated retries
Task stuck in "working"
```

Example:

```text
Coordinator
    ↓ A2A
Sales Delegator
    ↓
Timeout
    ↓
Alert
```

### 4. MCP / tool alerts

For MCP:

```text
MCP failure rate
MCP timeout rate
MCP authorization denials
MCP latency
Repeated tool retries
Malformed tool responses
```

Example:

```text
MCP → ServiceNow
P95 latency > 3 sec
        ↓
Alert
```

### 5. Azure OpenAI / LLM alerts

I would monitor:

```text
LLM request failures
429 / throttling
Timeouts
Latency
Token consumption
Unexpected increase in LLM calls
```

For example:

```text
LLM 429 rate > threshold
        ↓
Alert
```

This could indicate capacity or rate-limit problems.

### 6. RAG alerts

For the RAG layer:

```text
Empty retrieval rate increases
Retrieval latency increases
Search failures
Embedding failures
Indexing failures
Index freshness degradation
ACL/filter failures
```

Example:

```text
Empty retrieval rate > 10%
        ↓
Alert
```

Because poor retrieval can eventually cause poor or unsupported answers.

### 7. Infrastructure alerts

For Azure infrastructure:

```text
CPU > threshold
Memory > threshold
Container restart
AKS/Container Apps failures
Queue depth increases
Cosmos DB throttling
Redis failures
Service Bus DLQ growth
```

Example:

```text
Service Bus DLQ > 100 messages
        ↓
Alert
```

### 8. Security alerts

I would also configure:

```text
Repeated authentication failures
Authorization denials
Unauthorized MCP tool attempts
Tenant mismatch
Suspicious data access
Prompt-injection/security detections
Unusual API traffic
```

Security alerts should go to the appropriate security/incident workflow rather than being treated only as application failures.

### 9. Cost / token alerts

I would monitor:

```text
Token usage spike
LLM calls per workflow increase
Cost per workflow increases
Unexpected expensive model usage
Agent loops causing excessive calls
```

Example:

```text
Average tokens/workflow
       ↑
Sudden 3x increase
       ↓
Alert
```

---

## How I organize the alerts

| Area           | Example alert          |
| -------------- | ---------------------- |
| API            | 5xx/error rate         |
| Performance    | P95/P99 latency        |
| Coordinator    | Workflow failure       |
| Delegator      | Routing failure        |
| Worker         | Worker failure/timeout |
| A2A            | Task timeout/failure   |
| MCP            | Tool timeout/failure   |
| LLM            | 429/timeout/error      |
| RAG            | Empty/poor retrieval   |
| Infrastructure | CPU/memory/restarts    |
| Service Bus    | DLQ growth             |
| Security       | Unauthorized access    |
| Cost           | Token/cost spike       |

### Interview-ready answer

> **“For CWD, I would configure Azure Monitor/Application Insights alerts at multiple layers. At the application layer, I would alert on 5xx errors, availability and P95/P99 latency. At the agent layer, I would monitor Coordinator, Delegator and Worker failures, task completion, workflow timeouts and excessive agent loops. For A2A and MCP, I would alert on failures, timeouts, latency and authorization denials. For Azure OpenAI, I would monitor throttling, failures, latency and unusual token consumption. I would also configure RAG, Service Bus, Cosmos DB and infrastructure alerts, plus security and cost anomaly alerts. The important point is that I would alert on both technical health and business-task health.”**

### Strong interview line

> **“I don't alert only on infrastructure metrics. For an Agentic AI system, I also alert on business-level signals like task completion, tool success, routing failures and abnormal agent behavior.”**
