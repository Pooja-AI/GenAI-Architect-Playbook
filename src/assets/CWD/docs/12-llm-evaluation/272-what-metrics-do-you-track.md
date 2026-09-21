## What metrics do you track in CWD?

For CWD, I track metrics across **quality, agent workflow, retrieval, tools, reliability, performance, cost, and security**.

```text id="8z2j7m"
                    CWD Metrics
                        │
 ┌──────────┬──────────┼──────────┬──────────┐
 ↓          ↓          ↓          ↓          ↓
Quality   Agents      RAG       MCP      Production
                                  │
                         ┌────────┼────────┐
                         ↓        ↓        ↓
                      Latency    Cost   Reliability
```

### 1. LLM / Response Quality

These tell me whether the final answer is actually good.

* **Faithfulness / Groundedness**
* **Factual accuracy**
* **Answer relevance**
* **Unsupported claim rate**
* **Citation correctness**
* **Abstention accuracy**

Example:

```text
1,000 responses
20 contain unsupported claims

Unsupported claim rate = 20 / 1000 = 2%
```

---

### 2. Coordinator / Agent Metrics

For CWD's multi-agent workflow:

* Intent accuracy
* Entity extraction accuracy
* Delegator routing accuracy
* Worker selection accuracy
* Task completion rate
* Agent failure rate
* Agent retry rate

Example:

```text
1,000 Customer Briefing requests
950 routed to correct Delegators

Routing accuracy = 95%
```

---

### 3. RAG Metrics

For Workers using RAG:

* **Recall@K**
* **Precision@K**
* Context relevance
* Context recall
* No-result rate
* Retrieval latency
* Freshness
* Duplicate retrieval rate

Example:

```text
Correct document appears in top-5
→ Recall@5
```

---

### 4. MCP / Tool Metrics

For Worker → MCP → Enterprise System:

* Tool-selection accuracy
* Tool-call success rate
* Tool error rate
* Tool timeout rate
* Parameter validation failures
* MCP latency
* Authorization failures
* Duplicate transaction rate

Example:

```text
1,000 MCP calls
980 successful

Tool success rate = 98%
```

---

### 5. Reliability Metrics

I track:

* Workflow failure rate
* Retry success rate
* Timeout rate
* Circuit-breaker activations
* DLQ messages
* Recovery success rate
* Resume success rate
* Partial-result rate

For example:

> If ServiceNow is temporarily unavailable, I want to know how many workflows successfully recover after retry rather than simply counting the initial failures.

---

### 6. Performance Metrics

I monitor:

* End-to-end latency
* Coordinator latency
* Delegator latency
* Worker latency
* MCP latency
* RAG latency
* LLM latency
* Queue latency

I especially monitor **p50, p95, and p99 latency**.

```text id="b2j9t5"
p50 → typical latency
p95 → slower requests
p99 → worst-case tail latency
```

---

### 7. Cost Metrics

For GenAI systems, cost is important.

I track:

* Input tokens
* Output tokens
* Tokens/request
* LLM cost/request
* MCP/API cost where applicable
* Embedding cost
* RAG/search cost
* Total cost per workflow
* Cost by agent/Worker/use case

Example:

```text
Customer Briefing
→ 2,500 tokens
→ 4 MCP calls
→ 2 RAG searches
→ $0.04/request
```

This helps identify expensive prompts, unnecessary agent calls, or excessive tool usage.

---

### 8. Business Metrics

Ultimately, CWD should deliver business value.

I track:

* End-to-end task completion
* Cycle time
* Manual effort reduction
* User acceptance/feedback
* SLA compliance
* Successful Customer Briefing rate
* Escalation/HITL rate

For example:

```text
Before CWD → 20 minutes manual work
After CWD  → 5 minutes

Cycle-time reduction = 75%
```

---

### 9. Security Metrics

For enterprise CWD:

* Unauthorized request rate
* Authorization failures
* ACL violations
* Prompt-injection detection rate
* Sensitive-data leakage incidents
* Cross-customer access attempts
* Blocked tool calls
* Secret/credential exposure events

---

## My CWD production dashboard

I would organize the dashboard like this:

```text id="x0a3pv"
CWD Production Dashboard
│
├── Quality
│   ├── Groundedness
│   ├── Factual Accuracy
│   └── Unsupported Claims
│
├── Agent
│   ├── Routing Accuracy
│   ├── Task Success
│   └── Agent Failures
│
├── RAG
│   ├── Recall@K
│   ├── Relevance
│   └── No-result Rate
│
├── MCP
│   ├── Tool Success
│   ├── Tool Latency
│   └── Tool Errors
│
├── Reliability
│   ├── Error Rate
│   ├── Retry Success
│   └── Recovery Rate
│
├── Performance
│   ├── p50
│   ├── p95
│   └── p99
│
├── Cost
│   ├── Tokens
│   └── Cost/Request
│
└── Security
    ├── Auth Failures
    ├── ACL Violations
    └── Injection Attempts
```

### Interview-ready answer

> **“I track CWD metrics at multiple levels. For AI quality, I measure groundedness, factual accuracy, relevance, unsupported-claim rate, and citation correctness. For the agent workflow, I measure intent and Delegator routing accuracy, Worker selection, and task completion. For RAG, I track Recall@K, precision, relevance, and no-result rate. For MCP, I track tool-selection accuracy, success rate, errors, and latency. At the platform level, I monitor p50/p95/p99 latency, error and timeout rates, retry and recovery success, token usage, cost per request, and security violations. Finally, I track business metrics such as cycle-time reduction, SLA compliance, and successful task completion.”**

### Easy memory

**Quality → Agents → RAG → MCP → Reliability → Latency → Cost → Business → Security.**
