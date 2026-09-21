## How do you reduce LLM latency in CWD?

The main idea is: **reduce the amount of work the LLM has to do, reduce unnecessary LLM calls, and use the right model for each task.**

### 1. Reduce unnecessary LLM calls

Don't call the LLM for deterministic tasks.

For example:

```text
User Request
    ↓
Coordinator
    ↓
Rule / Intent validation
    ↓
LLM only when reasoning is required
```

If `customer_id` is already available, don't ask an LLM to extract it again at every layer.

---

### 2. Use smaller models for simple tasks

Use model routing:

```text
Simple classification / extraction
        ↓
Smaller / faster model

Complex reasoning / synthesis
        ↓
More capable model
```

For example:

* Intent classification → smaller model
* Entity extraction → smaller model
* Complex Customer Briefing synthesis → stronger model

This reduces both **latency and cost**.

---

### 3. Reduce input tokens

LLM latency is affected by the amount of context sent to the model.

Instead of:

```text
Large conversation
+ 50 documents
+ unnecessary metadata
+ previous tool outputs
```

send:

```text
Relevant user request
+ required customer_id
+ top relevant documents
+ required tool results
```

Use:

* Smaller prompts
* Smaller RAG `top_k`
* Context compression
* Conversation summarization
* Remove duplicate tool results

---

### 4. Parallelize independent LLM calls

In CWD:

```text
Coordinator
     ↓
 ┌───────────────┐
 ↓               ↓
Sales           IT
Worker          Worker
 ↓               ↓
LLM             LLM
 └───────┬───────┘
         ↓
     Aggregate
```

If Sales and IT don't depend on each other, execute them concurrently rather than sequentially.

---

### 5. Stream the response

For user-facing responses, streaming can reduce **time-to-first-token (TTFT)** even when total generation time doesn't change.

```text
Request
   ↓
LLM
   ↓
First token → User
   ↓
remaining tokens...
```

This makes the application feel faster.

---

### 6. Optimize RAG

Don't send excessive retrieved context to the LLM.

```text
Query
 ↓
Hybrid Search
 ↓
Top-K relevant chunks
 ↓
Reranking
 ↓
Compact context
 ↓
LLM
```

Better retrieval means **less context + less processing + better answer quality**.

---

### 7. Avoid unnecessary agent loops

Agentic systems can accidentally do:

```text
LLM → Tool → LLM → Tool → LLM → Tool → LLM
```

Set:

* Maximum iterations
* Tool-call limits
* Clear stopping conditions
* Deterministic routing where possible

---

### 8. Cache safe, repeatable results

For frequently repeated read operations:

```text
Worker
 ↓
Cache?
 ├── HIT  → return quickly
 └── MISS → MCP → Salesforce
```

But cache must respect **tenant, authorization, freshness, and data sensitivity**.

---

### 9. Control retries

Don't blindly retry slow LLM calls.

Use:

```text
Timeout
 ↓
Classify error
 ↓
Retry transient errors
 ↓
Exponential backoff + jitter
 ↓
Maximum attempts
```

Otherwise retries can actually **increase latency and overload the system**.

---

### 10. Measure the right metrics

I would monitor:

* **TTFT** — time to first token
* **Time to last token / total generation latency**
* Input tokens
* Output tokens
* Tokens/sec
* LLM timeout rate
* 429/throttling rate
* LLM calls per workflow
* P50 / P95 / P99 latency
* Model-specific latency

Using distributed tracing:

```text
CWD Workflow
   ↓
Coordinator       300 ms
   ↓
Sales Worker
   └─ LLM          800 ms
   ↓
IT Worker
   └─ LLM         1,000 ms
   ↓
Final synthesis    700 ms
```

This helps determine whether the problem is **model latency, too many calls, large prompts, or something outside the LLM**.

### 🎯 Interview-ready answer

> **“I reduce LLM latency in CWD by minimizing unnecessary model calls, routing simple tasks to smaller and faster models, reducing prompt and RAG context size, parallelizing independent Worker calls, streaming responses, caching safe repeated results, and limiting agent loops. I also use timeouts and bounded retries to avoid latency amplification. Finally, I monitor TTFT, total generation latency, tokens, 429s, and P95/P99 latency through distributed tracing so I can identify the actual bottleneck.”**

**Easy memory:**

**Fewer calls → Smaller model → Less context → Parallelize → Cache → Stream → Control retries → Measure.**
