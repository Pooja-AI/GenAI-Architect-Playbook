## How do you evaluate your CWD system?

I evaluate CWD at **multiple levels**, because an agentic system can be technically healthy but still produce a wrong business answer.

```text
                    CWD Evaluation
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Agent/LLM          Retrieval         Workflow
   Quality             Quality           Quality
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                 Business Outcome
                         ↓
              Production Reliability
```

### 1. LLM / Response Quality

For the final Coordinator response, I measure:

* **Faithfulness / groundedness** – Is the answer supported by evidence?
* **Answer relevance** – Does it answer the user's question?
* **Factual accuracy** – Does it match the source of truth?
* **Unsupported claim rate** – How often does the model invent facts?
* **Citation correctness** – Does each citation support the claim?
* **Abstention accuracy** – Does the system correctly say "I don't know" when evidence is insufficient?

Example:

```text
ServiceNow:
INC1001 → Open → High

CWD response:
"INC1001 is an open high-priority incident."

→ Grounded ✅
```

---

### 2. RAG Evaluation

For Workers using RAG, I evaluate retrieval separately from generation.

Important metrics:

```text
Retrieval
├── Recall@K
├── Precision@K
├── Context relevance
├── Context recall
├── No-result rate
└── Retrieval latency
```

For example, if the correct policy document is in the top 5 results:

```text
Recall@5 = successful retrieval of relevant evidence
```

I also test:

* hybrid search vs vector-only
* metadata filtering
* ACL filtering
* semantic reranking
* stale documents
* duplicate documents
* conflicting documents

---

### 3. Agent / Workflow Evaluation

For CWD, I test whether the **right Delegator and Workers are selected**.

Example:

```text
Customer Briefing
        ↓
Coordinator
   ├── Sales Delegator ✅
   │      ├── Customer Worker ✅
   │      └── Opportunity Worker ✅
   │
   └── IT Delegator ✅
          └── Incident Worker ✅
```

I measure:

* Intent classification accuracy
* Entity extraction accuracy
* Delegator routing accuracy
* Worker selection accuracy
* Tool-selection accuracy
* Task completion rate
* Workflow completion rate
* Failure/recovery rate

---

### 4. MCP / Tool Evaluation

For Workers calling MCP tools, I evaluate:

```text
Worker
  ↓
MCP Tool Selection
  ↓
Parameter Validation
  ↓
Enterprise API
  ↓
Response Validation
```

Metrics include:

* Correct tool selection
* Correct parameters
* Tool success rate
* Tool timeout rate
* Tool error rate
* Duplicate transaction rate
* MCP latency
* Authorization failures

For example:

> If the Worker needs incident information, it should select `get_incidents(customer_id)` rather than an unrelated tool.

---

### 5. Multi-Agent Evaluation

This is particularly important for CWD.

I test scenarios such as:

```text
Scenario 1:
Sales + IT succeed
→ Aggregate successfully

Scenario 2:
Sales succeeds + IT fails
→ Return partial result / retry IT

Scenario 3:
Worker timeout
→ Retry

Scenario 4:
MCP unavailable
→ Circuit breaker / fallback

Scenario 5:
Insufficient evidence
→ Abstain

Scenario 6:
Human approval required
→ HITL → Resume
```

This validates that the system doesn't just work on the **happy path**.

---

### 6. End-to-End Business Evaluation

Ultimately, I measure whether CWD actually solves the business problem.

For the Customer Briefing use case:

```text
User Request
     ↓
Coordinator
     ↓
Delegators
     ↓
Workers
     ↓
Salesforce + ServiceNow
     ↓
Validated Results
     ↓
Customer Briefing
```

I measure:

* End-to-end task success rate
* Business accuracy
* Cycle time
* Manual effort reduction
* User acceptance
* SLA compliance

For example:

> Instead of measuring only whether the LLM generated a good response, I verify whether the Customer Briefing contains the correct customer information, opportunities, and incidents from the enterprise systems.

---

### 7. Performance & Cost Evaluation

I also measure production characteristics:

| Metric        | What I measure            |
| ------------- | ------------------------- |
| Latency       | End-to-end response time  |
| Token usage   | Input/output tokens       |
| Cost          | Cost per request/task     |
| Throughput    | Requests/tasks per minute |
| Error rate    | Failed workflows          |
| Tool latency  | MCP/API response time     |
| LLM latency   | Model response time       |
| Queue latency | Async processing delay    |

For example:

```text
CWD request
   ↓
Coordinator       500 ms
Sales Delegator   1.5 sec
IT Delegator      2.0 sec
Aggregation       300 ms
────────────────────────
Total             ~2.3 sec
```

Because Sales and IT execute in parallel, I don't simply add their durations.

---

### 8. Reliability / Recovery Evaluation

I intentionally inject failures:

```text
MCP timeout
LLM timeout
Salesforce unavailable
ServiceNow unavailable
Worker failure
Delegator failure
Queue failure
Invalid tool response
Malformed JSON
Token limit
Rate limit
```

Then verify:

```text
Detect
  ↓
Retry
  ↓
Circuit Breaker
  ↓
Checkpoint
  ↓
Resume / Partial Result / HITL
```

I measure:

* Recovery success rate
* Retry success rate
* Mean time to recovery
* Failed workflow rate
* DLQ rate
* Duplicate execution rate

---

## 9. Security Evaluation

For enterprise CWD, I also test:

* Unauthorized user access
* Unauthorized Worker → MCP tool calls
* Cross-customer data access
* ACL bypass attempts
* Prompt injection
* Sensitive-data leakage
* Token/credential exposure
* Excessive agent permissions

Example:

```text
User A requests Customer B data
             ↓
Authorization
             ↓
DENIED ❌
```

The LLM should never be able to bypass authorization.

---

## 10. How I build the evaluation framework

I maintain a **golden evaluation dataset**:

```json id="2d3y1n"
{
  "input": "Give me a customer briefing for C12345",
  "expected_delegators": [
    "sales",
    "it"
  ],
  "expected_workers": [
    "customer_worker",
    "incident_worker"
  ],
  "expected_sources": [
    "Salesforce",
    "ServiceNow"
  ]
}
```

Then I run the same dataset against different:

* prompts
* models
* retrieval strategies
* agent workflows
* tool implementations

and compare the metrics.

Tools such as **RAGAS** and **Langfuse** can support automated evaluation and tracing, while deterministic application checks handle business-critical fields.

---

## Interview-ready answer

> **“I evaluate CWD at multiple layers rather than using only an LLM quality score. At the LLM layer, I measure faithfulness, groundedness, factual accuracy, relevance, citation correctness, and unsupported-claim rate. At the RAG layer, I measure recall, precision, context relevance, and retrieval latency. For the agent workflow, I evaluate Coordinator intent detection, Delegator routing, Worker selection, MCP tool selection, task completion, and recovery from failures. I also run end-to-end golden test cases for business accuracy, along with performance, cost, reliability, security, and observability tests. For production, I continuously monitor these metrics using tracing and evaluation data and compare releases against the golden dataset before promoting them.”**

### Easy memory

**Evaluate CWD in 6 layers:**

> **LLM → RAG → Agents → Tools → Business → Production**

Or simply:

**“Did it choose correctly, retrieve correctly, execute correctly, answer correctly, and recover correctly?”**
