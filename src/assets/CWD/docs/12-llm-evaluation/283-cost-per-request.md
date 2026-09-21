## What is Cost per Request?

**Cost per request is the average amount of money spent to process one CWD user request from start to finish.**

In simple terms:

> **“How much does it cost the company every time a user uses CWD?”**

### CWD example

User asks:

> **“Give me a customer briefing for C12345.”**

CWD may use:

```text id="k4m8px"
User Request
    ↓
Coordinator → LLM
    ↓
Sales Delegator → LLM
    ↓
Customer Worker → MCP → Salesforce
    ↓
IT Delegator → LLM
    ↓
Incident Worker → MCP → ServiceNow
    ↓
Aggregation → LLM
    ↓
Final Response
```

The cost can come from several components.

### What contributes to cost?

```text id="r7n3qc"
Cost per Request
│
├── LLM input tokens
├── LLM output tokens
├── Embedding costs
├── RAG/Search costs
├── Agent/Worker execution
├── MCP/API infrastructure
├── Compute
├── Database/cache
└── Network / supporting services
```

For example:

```text id="w2p6ka"
Coordinator LLM       $0.003
Sales Worker LLM      $0.004
IT Worker LLM         $0.004
Final LLM             $0.005
RAG/Search            $0.001
Compute + other       $0.003
                     ───────
Total                 $0.020/request
```

So:

> **Cost per CWD request ≈ $0.02**

*The numbers above are illustrative; actual cost depends on the models, token usage, cloud services, and pricing.*

---

## How do I calculate it?

A simple production metric is:

```text id="d8m2vn"
Cost per Request =
Total CWD operating cost
───────────────────────
Number of requests
```

Example:

```text id="p3k7rx"
10,000 requests
Total cost = $200

Cost/request = $200 / 10,000
             = $0.02
```

I also calculate cost by **use case and agent**, because an average can hide expensive workflows.

```text id="q5c9mb"
Customer Briefing      $0.020
Incident Investigation $0.035
Document Analysis      $0.012
```

---

## How do I monitor it in CWD?

I attach cost information to the workflow:

```text id="n6v3tp"
Correlation ID
      ↓
Coordinator
      ↓
Delegators
      ↓
Workers
      ↓
LLM / RAG / MCP
      ↓
Cost calculation
```

For each request I track:

* Input tokens
* Output tokens
* Number of LLM calls
* Model used
* Embedding usage
* Search/RAG usage
* Agent/Worker execution
* Total request cost
* Cost by Coordinator/Delegator/Worker
* Cost by customer/use case

This helps identify expensive workflows.

---

## Example: Finding the expensive component

Suppose one Customer Briefing costs **$0.08**:

```text id="b9k4sz"
Coordinator       $0.005
Sales Worker      $0.010
IT Worker         $0.010
RAG               $0.005
LLM retries       $0.030  ← expensive
Final response    $0.020
                  ───────
Total             $0.080
```

The issue isn't necessarily the number of Workers. **Repeated LLM calls/retries** are driving the cost.

I can then reduce:

* unnecessary LLM calls
* excessive prompt/history tokens
* large RAG context
* repeated tool calls
* unnecessary agent hops
* excessive retries
* oversized models where a smaller model is sufficient

---

## Cost optimization in CWD

A useful strategy is:

```text id="h8q2wd"
Measure
  ↓
Identify expensive component
  ↓
Reduce tokens
  ↓
Reduce unnecessary LLM calls
  ↓
Optimize RAG
  ↓
Use appropriate model
  ↓
Cache reusable results
  ↓
Monitor quality
```

**Important:** I wouldn't optimize cost by simply using a cheaper model. I would check the impact on **quality, latency, and task completion** as well.

---

## Cost per request vs total monthly cost

These are different metrics.

**Cost per request:**

> How much does one request cost?

**Monthly cost:**

> How much does the entire CWD platform cost?

Example:

```text id="m4r7xp"
Cost/request = $0.02

100,000 requests/month

Approx. variable request cost
= $0.02 × 100,000
= $2,000/month
```

Infrastructure and other fixed costs would be added separately.

---

## Interview-ready answer

> **“Cost per request measures how much it costs to process one CWD request end to end. I track LLM input and output tokens, number of model calls, embeddings, RAG/search, compute, and supporting services. I correlate these costs with the workflow using correlation IDs and break them down by Coordinator, Delegator, Worker, model, and use case. If a Customer Briefing becomes expensive, I identify whether the cost is coming from excessive tokens, repeated LLM calls, large retrieval context, retries, or unnecessary agent execution. Then I optimize while monitoring quality, latency, and task completion so cost reduction doesn't degrade the user experience.”**

### Easy memory

**Cost per request = “How much money does one CWD request consume?”**

**Measure → Break down → Find expensive component → Optimize → Re-measure.**
