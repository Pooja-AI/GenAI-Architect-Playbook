## How do you reduce LLM costs in CWD?

The main principle is:

> **Reduce unnecessary LLM calls and tokens first, then use the right-size model.**

### 1. Reduce the number of LLM calls

Don't call an LLM for deterministic work.

```text id="4q9jce"
Authorization      → Code
Validation         → Code
Filtering          → Code
Calculations       → Code
Routing            → Code where deterministic
```

For example, if the Coordinator already identifies:

```text
intent = Customer Briefing
customer_id = C12345
```

I don't ask another LLM inside every Delegator to rediscover that information.

---

### 2. Use cheaper models for simple tasks

```text id="r7k2qa"
Simple classification/extraction
          ↓
     Smaller model

Complex planning/reasoning
          ↓
     Stronger model
```

I evaluate models using the same golden dataset and select the **least expensive model that meets the required quality threshold**.

---

### 3. Reduce input tokens

This is a major optimization.

Instead of:

```text id="8m3p7v"
Full conversation
+ all Worker results
+ 20 RAG chunks
+ complete MCP response
```

send:

```text id="q9v2ds"
Relevant history
+ top relevant RAG chunks
+ required MCP fields
+ compact structured task state
```

---

### 4. Reduce RAG Top-K

For example:

```text id="s5k8n1"
Search
 ↓
Top 20 candidates
 ↓
Rerank
 ↓
Top 3–5
 ↓
LLM
```

This reduces:

* Input tokens
* LLM cost
* Latency
* Irrelevant context

while maintaining retrieval quality through evaluation.

---

### 5. Limit MCP/tool response size

If Salesforce returns 50 fields but the Worker needs only 5:

```python id="z8x4qp"
required_fields = [
    "customer_name",
    "industry",
    "status",
    "revenue",
    "region"
]
```

Only those fields should enter the LLM context.

---

### 6. Use semantic caching

```text id="d5j8wr"
Request
   ↓
Semantic Cache
   ↓
Valid HIT → return result
   ↓ MISS
LLM
```

A valid cache hit avoids another LLM inference call.

For enterprise data, I apply tenant, authorization, freshness, and version checks before using the cached result.

---

### 7. Control agent loops

Agentic systems can create unnecessary calls:

```text id="1s7k3c"
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
 ↓
...
```

I use:

```text
max_iterations
max_tool_calls
workflow_timeout
```

and explicit stopping conditions.

---

### 8. Reuse existing results

If Customer Worker already retrieved:

```text id="x4n9md"
customer_name
industry
account_status
```

I pass the structured result forward instead of asking another LLM to retrieve or reconstruct it.

---

### 9. Control output tokens

Don't ask for unnecessary explanations when the application only needs structured data.

For example:

```json id="f5q7xz"
{
  "status": "high",
  "open_incidents": 3,
  "summary": "..."
}
```

rather than generating a long narrative.

Use appropriate output-token limits.

---

### 10. Optimize embeddings and RAG separately

Embedding generation also costs money, especially during large ingestion.

I reduce it using:

```text id="b1y6cv"
Content hash
     ↓
Unchanged? → Don't re-embed
Changed?   → Re-embed
```

I also use incremental indexing and batching where appropriate.

---

### 11. Monitor cost per workflow

I track:

```text id="q6w3tz"
LLM calls / workflow
Input tokens / workflow
Output tokens / workflow
Tokens / Worker
Cost / model
Cost / tenant
Cost / workflow
Cache hit rate
Agent iterations
```

Then I can identify expensive workflows.

For example:

```text id="h8v3kp"
Customer Briefing
   ↓
Coordinator:      1 call
Sales Workers:    2 calls
IT Worker:        1 call
Final synthesis:  1 call
                  ─────
                  5 calls
```

If evaluation shows some of those calls are unnecessary, I remove them.

---

## CWD cost optimization strategy

```text id="c9r2qa"
                 Reduce LLM Cost
                       │
       ┌───────────────┼────────────────┐
       ↓               ↓                ↓
  Fewer calls      Fewer tokens     Cheaper models
       │               │                │
   Cache          Less history      Model routing
   Reuse          Less RAG          Simple → small
   Deterministic  Less MCP data     Complex → strong
   logic          Smaller output
       │               │                │
       └───────────────┼────────────────┘
                       ↓
                    Monitor
                       ↓
                 Cost/workflow
```

### 🎯 Interview-ready answer

> **“I reduce LLM costs in CWD at multiple levels. First, I eliminate unnecessary LLM calls by using deterministic logic for validation, authorization, filtering, calculations, and routing where possible. Then I reduce token consumption by minimizing conversation history, RAG Top-K, MCP payloads, duplicate context, and output length. I use semantic caching for safe repeated requests and control agent loops with iteration and tool-call limits. I also use model routing so simple tasks use cheaper models while complex reasoning uses stronger models. For embeddings, I use content hashing and incremental indexing to avoid unnecessary re-embedding. Finally, I monitor tokens, calls, cache hit rate, and cost per workflow and Worker to continuously optimize without sacrificing quality.”**

### Easy memory

**Fewer calls → Fewer tokens → Smaller model → Cache → Less RAG → Less tool data → Control loops → Measure**
