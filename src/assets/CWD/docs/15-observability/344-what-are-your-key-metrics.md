## What are your key metrics?

For **CWD**, I group the key metrics into **6 categories: reliability, performance, agent behavior, GenAI quality, security, and cost.**

### 1. Reliability metrics

These tell me whether the workflow completes successfully.

* **Task completion rate**
* Error rate
* Timeout rate
* Retry rate
* Worker failure rate
* A2A failure rate
* MCP/tool failure rate
* Checkpoint/resume success rate

Example:

```text
Task Completion Rate =
Successful CWD workflows / Total CWD workflows
```

---

### 2. Performance metrics

I focus especially on **P95/P99**, not just average latency.

* End-to-end latency
* P50 / P95 / P99 latency
* Coordinator latency
* Delegator latency
* Worker latency
* RAG latency
* MCP latency
* LLM latency
* Queue depth / processing time

Example:

```text id="x6s2j1"
Customer Briefing
     ↓
Total P95 = 8 sec

Coordinator     0.5 sec
A2A             0.2 sec
Workers         1.5 sec
RAG             0.8 sec
MCP             2.0 sec
LLM             3.0 sec
```

---

### 3. Agent metrics

These tell me whether the **multi-agent architecture is behaving correctly**.

* **Agent routing accuracy**
* Delegator selection accuracy
* Worker/tool selection accuracy
* Tool-call accuracy
* Agent loop rate
* Number of agent steps
* A2A task success rate
* Partial workflow rate

For example:

```text
Customer Briefing
       ↓
Coordinator
   ├── Sales Delegator ✓
   └── IT Delegator ✓
```

If the Coordinator repeatedly sends an IT-only request to Sales, that's an **agent-routing problem**, not an infrastructure problem.

---

### 4. GenAI / RAG quality metrics

This is especially important for enterprise GenAI.

**RAG:**

* Retrieval relevance
* Context precision
* Context recall
* Retrieval failure rate
* Index freshness

**LLM response:**

* Answer relevance
* Faithfulness / groundedness
* Hallucination rate
* Citation/evidence correctness
* Structured-output validity

**End-to-end:**

* Business task completion
* Agent trajectory correctness

Example:

```text
Search returned documents ✓
LLM generated response ✓
But response isn't supported by evidence ✗

→ Grounding / faithfulness issue
```

---

### 5. Security metrics

For enterprise CWD, I monitor:

* Authentication failures
* Authorization denials
* Tenant-isolation violations
* Unauthorized MCP calls
* Blocked tool calls
* Prompt-injection detections
* DLP violations
* Suspicious access attempts

Example:

```text
User T001
   ↓
Requests T002 data
   ↓
Tenant mismatch
   ↓
BLOCK
   ↓
AUDIT
```

---

### 6. Cost metrics

I track cost at multiple levels:

* Cost per request
* Cost per CWD workflow
* Cost per agent/Worker
* Input tokens
* Output tokens
* Number of LLM calls
* Cost by model
* Cost by use case

Example:

```text
Customer Briefing
   ↓
LLM calls = 4
Tokens = 8,200
Cost = $X / request
```

This helps identify unnecessary agent loops or oversized prompts.

---

## My key production dashboard

I would summarize it as:

| Category        | Key metrics                                    |
| --------------- | ---------------------------------------------- |
| **Reliability** | Task completion, error, timeout, retry         |
| **Performance** | P50/P95/P99 latency, throughput                |
| **Agents**      | Routing accuracy, tool accuracy, loops         |
| **RAG/LLM**     | Relevance, recall, faithfulness, hallucination |
| **Security**    | Auth failures, denials, DLP, tenant violations |
| **Cost**        | Tokens, LLM calls, cost/request                |

### Interview-ready answer

> **“My key CWD metrics are task completion rate and error rate for reliability; P95/P99 end-to-end and component latency for performance; Delegator routing accuracy, Worker/tool selection accuracy, and agent loop rate for agent behavior; retrieval relevance, context precision/recall, faithfulness, hallucination, and answer relevance for GenAI quality; authorization and DLP violations for security; and token usage, model calls, and cost per workflow for cost. I don't optimize one metric in isolation—I look at quality, reliability, latency, security, and cost together.”**

### Strong interview line

> **“For Agentic AI, a successful HTTP 200 is not enough. I need to know whether the agent made the right decisions, retrieved the right evidence, used the right tools, completed the business task, and did it securely and efficiently.”**
