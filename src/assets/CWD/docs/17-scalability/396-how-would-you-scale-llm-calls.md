## How would you scale LLM calls?

In CWD, I would **not simply increase the number of LLM calls**. I would control **concurrency, tokens, model capacity, and cost**, while reducing unnecessary calls.

```text id="4m2x8k"
CWD Workers
     ↓
LLM Gateway / Rate Limiter
     ↓
┌──────────────┬──────────────┐
↓              ↓              ↓
LLM Pool 1    LLM Pool 2    Backup Model
     ↓              ↓
Azure OpenAI / Bedrock / etc.
```

### 1. Control LLM concurrency

If 1,000 Workers suddenly call the model:

```text id="k8v3qp"
1000 Workers
     ↓
Concurrency limiter
     ↓
100 active LLM calls
     ↓
LLM provider
```

This prevents request bursts from causing throttling or cascading failures.

---

### 2. Respect RPM and TPM limits

Two important limits are:

* **RPM** = requests per minute
* **TPM** = tokens per minute

Example:

```text id="r4n7xs"
Workers
  ↓
LLM Gateway
  ↓
RPM limiter
  ↓
TPM limiter
  ↓
Azure OpenAI
```

If the provider starts returning `429`, I don't blindly keep retrying.

I apply **backoff + jitter + rate limiting**.

---

### 3. Use model routing

Not every CWD task requires the most expensive model.

For example:

```text id="w5q2mz"
Simple classification
      ↓
Smaller / faster model

Complex reasoning
      ↓
More capable model

Fallback
      ↓
Approved backup model
```

This can improve both throughput and cost.

---

### 4. Reduce unnecessary LLM calls

This is often the **best scaling strategy**.

Instead of:

```text id="7q4nmx"
Worker
 ↓
LLM
 ↓
LLM
 ↓
LLM
 ↓
LLM
```

I look for:

* Repeated calls
* Agent loops
* Duplicate reasoning
* Excessive tool-selection calls
* Unnecessary summarization
* Repeated RAG queries

For example:

```text id="j8p3tc"
4 LLM calls
    ↓
Optimize workflow
    ↓
2 LLM calls
```

You have effectively doubled capacity without adding infrastructure.

---

### 5. Control token consumption

LLM capacity is not only about request count.

Suppose:

```text id="f0m6ra"
100 requests × 2K tokens = 200K tokens
```

versus:

```text id="s3c9dw"
100 requests × 10K tokens = 1M tokens
```

The second workload consumes **5× more tokens**.

So I monitor:

* Input tokens
* Output tokens
* Total tokens
* Tokens/request
* Tokens/workflow
* Tokens/Worker
* Tokens/model

---

### 6. Optimize context size

For CWD RAG:

```text id="v7k2na"
User query
   ↓
Retrieve 100 documents ❌
   ↓
Huge LLM context
```

Instead:

```text id="p4z8hc"
User query
   ↓
Hybrid retrieval
   ↓
Filter/rerank
   ↓
Top relevant documents
   ↓
LLM
```

This reduces token consumption and latency.

---

### 7. Cache appropriate results

For deterministic or repeated operations:

```text id="6s1jqp"
Request
  ↓
Cache
  ↓
Existing result
```

For example, approved reusable metadata or repeated non-sensitive classification results may be cached.

But I would be careful with:

* User-specific responses
* Authorization-sensitive data
* Fresh enterprise data
* Customer-specific information

Cache keys and invalidation must respect tenant and entitlement boundaries.

---

### 8. Batch where appropriate

For offline workloads such as:

```text id="8m4xsz"
Document processing
Embedding
Classification
Evaluation
Summarization
```

I can batch requests where the model/provider supports it.

For interactive CWD requests, I prioritize latency rather than blindly batching.

---

### 9. Parallelize independent LLM calls

If two operations are independent:

```text id="2p6m8d"
Coordinator
     ↓
 ┌───┴────┐
 ↓        ↓
LLM-1    LLM-2
 ↓        ↓
 └───┬────┘
     ↓
Aggregate
```

Instead of:

```text id="9z3v1k"
LLM-1 → LLM-2 → LLM-3
```

This can reduce end-to-end latency, although the provider's concurrency limits still apply.

---

### 10. Use queues for asynchronous work

For non-interactive workloads:

```text id="1x8c4m"
Worker
  ↓
Queue
  ↓
LLM consumers
  ↓
LLM provider
```

Then increase consumers based on queue depth while respecting the provider's rate/token limits.

---

### 11. Use bounded retries

For transient errors:

```text id="q5k1zs"
LLM timeout / 429 / 503
       ↓
Retry
       ↓
Exponential backoff + jitter
       ↓
Retry limit
       ↓
Fallback / fail safely
```

Don't retry `401`, `403`, invalid requests, or policy/security failures.

---

### 12. Use a fallback model carefully

If the primary model is unavailable:

```text id="u6v4mc"
Primary LLM
    ↓
Unavailable
    ↓
Approved backup model
```

But I verify that the backup model meets:

* Security requirements
* Data/privacy requirements
* Quality requirements
* Context-window requirements
* Tool/function-calling requirements
* Latency requirements

---

## CWD example

Suppose Customer Briefing has:

```text id="e8p5rw"
Coordinator
   ↓
Sales Delegator
   ↓
Customer Worker
   ↓
LLM
   ↓
RAG
   ↓
LLM
   ↓
MCP
```

I would monitor:

```text id="b6j3tx"
LLM calls/workflow
Input tokens
Output tokens
P95 latency
429 rate
Timeout rate
Cost/workflow
Model version
Prompt version
```

If I discover:

```text
Customer Worker
   ↓
5 LLM calls
   ↓
3 are unnecessary
```

I optimize the workflow first rather than simply scaling the model infrastructure.

---

## The most important scaling principle

There are **three different bottlenecks**:

```text id="7h2p1m"
Request capacity
       +
Token capacity
       +
Concurrency capacity
```

For example:

```text
1000 requests
      ↓
LLM provider
      ↓
TPM limit reached
      ↓
429 throttling
```

Adding more Worker replicas **will not solve this**.

In fact, it can make the problem worse.

---

## Interview-ready answer

> **“I scale LLM calls using concurrency control, RPM and TPM rate limiting, model routing, prompt and context optimization, caching where appropriate, batching for offline workloads, and parallel execution for independent calls. I use queues for asynchronous workloads and bounded retries with exponential backoff and jitter for transient failures. I also monitor tokens, latency, 429s, cost, and calls per workflow. Most importantly, I first reduce unnecessary LLM calls and token consumption before adding capacity, because blindly scaling Workers can actually increase LLM throttling.”**

### Strong interview line

> **“For LLM scaling, I don't just scale requests—I scale within the provider's concurrency and token budget while minimizing unnecessary calls.”**

### Easy memory

**Reduce calls → Reduce tokens → Control concurrency → RPM/TPM limits → Model routing → Cache/Batch → Queue → Retry safely → Monitor.**
