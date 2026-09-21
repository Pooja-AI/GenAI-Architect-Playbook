## What do you monitor in CWD?

In CWD, I monitor **five main areas: workflow, agent behavior, RAG/tool calls, system performance, and security/business metrics.**

### CWD monitoring flow

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
RAG / MCP
 ↓
Enterprise System
 ↓
LLM
 ↓
Response
```

I attach a **correlation ID / trace ID** to the entire workflow so I can follow one request end-to-end.

---

### 1. Workflow / Agent Monitoring

I monitor:

* Coordinator success/failure
* Correct Delegator routing
* Worker success/failure
* Task completion rate
* Agent retries
* Agent loops
* Timeout rate
* A2A task latency
* Workflow duration
* Checkpoint/resume failures

Example:

```text
Request: CustomerBriefing
Coordinator → Sales Delegator ✓
Coordinator → IT Delegator ✓
Customer Worker ✓
Incident Worker ✗
Workflow → Partial Failure
```

---

### 2. LLM Monitoring

I track:

* Model name/version
* Number of LLM calls
* Input/output tokens
* Token growth
* Latency
* Timeout/error rate
* Rate-limit events
* Cost per request
* Prompt/version
* Structured-output failures

Example:

```text
Model: GPT
Input tokens: 4,500
Output tokens: 800
Latency: 2.8 sec
Cost: $X
```

---

### 3. RAG Monitoring

For CWD RAG, I monitor:

* Retrieval latency
* Number of documents retrieved
* Retrieval relevance
* Context precision
* Context recall
* Search failures
* Empty retrievals
* Embedding failures
* Index freshness
* ACL/tenant-filter failures
* Grounding/faithfulness

Example:

```text
Query
 ↓
Hybrid Search
 ↓
Top 5 documents
 ↓
Relevant documents = 4/5
 ↓
LLM
```

---

### 4. MCP / Tool Monitoring

For every MCP call:

```text
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Salesforce / ServiceNow
```

I monitor:

* Tool name/version
* Tool-call success rate
* Tool-call accuracy
* Parameters/schema validation failures
* Latency
* Timeout
* Retry count
* Authentication/authorization failures
* Downstream API errors
* Duplicate/idempotency failures

Example:

```text
Customer Worker
  ↓
MCP: get_customer
  ↓
Salesforce
  ↓
Success
Latency: 850 ms
```

---

### 5. Performance Monitoring

I monitor:

| Metric       | Purpose                      |
| ------------ | ---------------------------- |
| P50 latency  | Typical performance          |
| P95 latency  | User experience / SLA        |
| P99 latency  | Worst-case tail latency      |
| Throughput   | Requests per second          |
| Error rate   | Reliability                  |
| Timeout rate | Dependency/performance issue |
| Queue depth  | Backlog                      |
| CPU/memory   | Infrastructure health        |

I break latency down by component:

```text
Total = Coordinator
      + A2A
      + Delegator
      + Worker
      + RAG
      + MCP
      + Enterprise API
      + LLM
```

---

### 6. Security Monitoring

I monitor:

* Authentication failures
* Authorization denials
* Tenant mismatches
* Unauthorized MCP calls
* Blocked tool executions
* Prompt-injection detections
* DLP violations
* Suspicious access patterns
* Secret/access violations
* Cross-tenant access attempts

For example:

```text
User T001
   ↓
Requests T002 data
   ↓
Tenant mismatch
   ↓
BLOCK + AUDIT
```

---

### 7. Cost Monitoring

I track:

```text
Cost per request
Cost per workflow
Cost by model
Cost by Worker
Input tokens
Output tokens
Number of LLM calls
```

This helps identify expensive workflows.

For example:

```text
CustomerBriefing
 ├── Coordinator LLM   $0.03
 ├── Sales Worker       $0.05
 ├── IT Worker          $0.04
 └── Aggregation        $0.02
                      ------
                       $0.14
```

---

### 8. GenAI Quality Monitoring

This is particularly important because **a successful HTTP response doesn't necessarily mean a good AI response.**

I monitor:

* Answer relevance
* Faithfulness/grounding
* Hallucination rate
* Retrieval quality
* Tool-call accuracy
* Agent routing accuracy
* Task completion rate
* Structured-output validity
* Safety-policy violations

Example:

```text
HTTP 200 ✓
Workflow completed ✓
BUT
Answer grounded ✗
```

The system is technically healthy but **AI quality is poor**.

---

## My CWD monitoring dashboard

I would organize the dashboard like this:

```text
CWD Dashboard
│
├── Availability
│   ├── Success rate
│   ├── Error rate
│   └── Task completion
│
├── Performance
│   ├── P50/P95/P99 latency
│   └── Component latency
│
├── Agents
│   ├── Routing accuracy
│   ├── Worker failures
│   └── Retry/loop rate
│
├── LLM
│   ├── Tokens
│   ├── Latency
│   └── Cost
│
├── RAG
│   ├── Retrieval relevance
│   ├── Grounding
│   └── Index freshness
│
├── MCP
│   ├── Tool success
│   ├── Tool latency
│   └── Authorization failures
│
└── Security
    ├── Auth failures
    ├── DLP violations
    └── Tenant violations
```

### Tools I would use

```text
OpenTelemetry
      ↓
Distributed traces + metrics
      ↓
Application Insights
      ↓
Log Analytics

Langfuse
      ↓
LLM / Agent observability
      ↓
Prompts + tokens + model calls + evaluation
```

### Interview-ready answer

> **“In CWD, I monitor the complete agent workflow from Coordinator to Delegator to Worker to RAG/MCP and downstream systems. I track workflow success, agent routing, A2A latency, Worker failures, LLM latency and token usage, RAG retrieval quality, MCP tool success and latency, P95/P99 performance, security events, cost, and GenAI quality metrics such as grounding, faithfulness, hallucination, and task completion. I use OpenTelemetry with Application Insights and Log Analytics for distributed observability, and Langfuse for LLM and agent-level telemetry.”**

### Strong interview line

> **“I don't monitor only infrastructure health; I monitor the entire AI trajectory—from agent decision to retrieval to tool execution to final answer quality.”**
