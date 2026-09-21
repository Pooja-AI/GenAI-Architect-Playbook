## How do you reduce unnecessary LLM calls in CWD?

The main principle is:

> **Use the LLM only when reasoning or language understanding is actually needed. Use deterministic code, cache, routing, and existing results whenever possible.**

### CWD example

Suppose the user asks:

> “Give me a customer briefing for C12345.”

Instead of repeatedly calling the LLM:

```text
Coordinator → LLM
Sales Delegator → LLM
Customer Worker → LLM
Opportunity Worker → LLM
Incident Worker → LLM
```

I design the workflow so that each layer has a clear responsibility.

```text id="e4s6mm"
User
 ↓
Coordinator
 ↓
LLM only for intent/plan if needed
 ↓
Delegators
 ↓
Workers
 ↓
MCP → Salesforce / ServiceNow
 ↓
Deterministic aggregation
 ↓
LLM only if natural-language synthesis is required
 ↓
Response
```

### 1. Don't use LLM for deterministic operations

For example, these don't need an LLM:

```python id="w5tq8j"
if customer_id:
    route_to_sales_worker()
```

or:

```python id="e0q7y1"
if status == "open":
    incidents.append(result)
```

Use normal Python/business logic for:

* validation
* JSON/schema validation
* authorization checks
* filtering
* aggregation
* calculations
* routing rules that are deterministic
* formatting

---

### 2. Avoid duplicate LLM calls

If the Coordinator already determined:

```text
intent = Customer Briefing
customer_id = C12345
```

don't ask another LLM to rediscover the same intent inside every Delegator.

Pass structured context:

```json id="h7v9bw"
{
  "intent": "customer_briefing",
  "customer_id": "C12345",
  "required_capabilities": [
    "customer",
    "opportunity",
    "incident"
  ]
}
```

---

### 3. Use semantic caching

If a similar request already has a valid, fresh response:

```text id="1yrgqg"
New request
    ↓
Semantic Cache
    ↓
Valid HIT → return cached result
    ↓ MISS
Normal CWD flow
```

This avoids another LLM call.

---

### 4. Use smaller models for simple tasks

Not every task requires the strongest model.

For example:

```text id="3az5bq"
Simple classification      → smaller/faster model
Intent extraction          → smaller model
Complex reasoning          → stronger model
Final synthesis             → stronger model if required
```

This reduces both **latency and cost**, and often reduces unnecessary computation.

---

### 5. Don't call the LLM for every Worker

Workers should primarily execute their defined capability.

For example:

```text id="s4x1tc"
Customer Worker
     ↓
MCP → Salesforce
```

The Worker doesn't need an LLM just to retrieve:

```text
customer_name
account_status
industry
```

The LLM is used only when interpretation/reasoning is required.

---

### 6. Limit agent loops

Agentic systems can accidentally keep reasoning and calling tools.

I use limits such as:

```python id="qg4n9w"
MAX_ITERATIONS = 3
MAX_TOOL_CALLS = 5
```

And define clear termination conditions:

```text
Goal achieved?
   YES → stop
   NO  → continue
```

This prevents:

```text
LLM → Tool → LLM → Tool → LLM → Tool → ...
```

from continuing unnecessarily.

---

### 7. Reuse existing results

Suppose Customer Worker already retrieved:

```text
customer_id = C12345
customer_name = ABC Corp
industry = Semiconductor
```

Don't call the LLM again to retrieve or reconstruct that information.

Pass the structured result to the next step.

```text id="w9v1kz"
Customer Worker
      ↓
Structured result
      ↓
Opportunity Worker / Coordinator
```

---

### 8. Reduce unnecessary RAG context

More RAG context can cause more tokens and potentially more processing.

Instead of:

```text
Top-K = 20 documents
```

use:

```text
Retrieve → rerank → select relevant documents
```

For example:

```text
20 retrieved
    ↓
reranking
    ↓
3–5 relevant chunks
    ↓
LLM
```

This reduces input tokens and therefore reduces LLM cost/latency.

---

### 9. Parallelize independent work

This doesn't necessarily reduce the **number** of LLM calls, but it reduces waiting time.

For example:

```text id="5h7d3x"
Coordinator
    │
    ├── Sales Delegator
    │      ├── Customer Worker
    │      └── Opportunity Worker
    │
    └── IT Delegator
           └── Incident Worker
```

Independent tasks can execute concurrently rather than repeatedly waiting and reasoning sequentially.

---

### 10. Use deterministic routing where possible

If the intent is already known from a reliable rule or structured request, don't call the LLM again just to select the same Worker.

For example:

```python id="p6q0ws"
ROUTES = {
    "customer": "customer_worker",
    "opportunity": "opportunity_worker",
    "incident": "incident_worker"
}
```

The LLM can handle ambiguous natural-language requests, while deterministic routing handles known cases.

---

## How I would measure it

I track:

```text id="x9g3wq"
LLM calls / workflow
LLM calls / Worker
Input tokens
Output tokens
Total tokens
Cost / workflow
Cache hit rate
Agent iterations
Tool calls / workflow
```

For example:

```text
Before optimization:
10 LLM calls / workflow

After:
4 LLM calls / workflow
```

The important point is to reduce calls **without reducing answer quality**.

### 🎯 Interview-ready answer

> **“I reduce unnecessary LLM calls by using deterministic logic for validation, authorization, routing, filtering, aggregation, and calculations; caching repeated requests; reusing structured results between Coordinator, Delegator, and Workers; and using smaller models for simple tasks. I also control agent loops with maximum iterations and tool-call limits, reduce RAG context, and avoid calling an LLM inside a Worker when the Worker only needs to retrieve data through MCP. Finally, I monitor LLM calls, tokens, cost, latency, and task quality per workflow to verify that optimization doesn't affect accuracy.”**

### Easy memory

**Deterministic logic → Cache → Reuse results → Smaller model → Less RAG → Fewer loops → Fewer calls → Measure quality**
