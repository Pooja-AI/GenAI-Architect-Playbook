## How do you handle token throttling?

**Token throttling** happens when the application sends or generates tokens faster than the model deployment's allowed **tokens-per-minute (TPM)** capacity.

In CWD, this is especially important because multiple Workers may call the LLM concurrently.

### CWD flow

```text id="7f3k2m"
Coordinator
     ↓
Delegators
     ↓
Multiple Workers
     ↓
Token Usage Controller
     ↓
 ┌───────────────────────┐
 │ Token budget          │
 │ Concurrency limit     │
 │ Rate limiter          │
 │ Queue                 │
 └───────────────────────┘
     ↓
Azure OpenAI
```

### 1. Track token consumption

I monitor:

* Input tokens
* Output tokens
* Total tokens
* Tokens/minute
* Tokens/request
* Tokens/Worker
* Tokens/session

For example:

```text id="q8m4np"
Worker 1 → 3K tokens
Worker 2 → 4K tokens
Worker 3 → 2K tokens
Worker 4 → 5K tokens
             ↓
         14K tokens
```

If this approaches the deployment's TPM capacity, I control further requests.

---

### 2. Set token budgets

I don't allow unlimited prompts or outputs.

```text id="p3v6kx"
Request
  ↓
Input token budget
  +
Output token budget
  ↓
LLM
```

For example, a simple classification request shouldn't receive a huge context window.

---

### 3. Reduce prompt tokens

Before calling the model:

```text id="m5x8rq"
Large conversation
      ↓
Summarize history

50 RAG chunks
      ↓
Rerank → Top 5–10

Large Worker responses
      ↓
Structured summary

Duplicate context
      ↓
Remove
```

This reduces **input-token consumption**, which is often a major contributor to TPM usage.

---

### 4. Control concurrency

This is critical in CWD.

Suppose five Workers execute simultaneously:

```text id="y2c7vn"
W1 ─┐
W2 ─┤
W3 ─┼──→ Azure OpenAI
W4 ─┤
W5 ─┘
```

Instead of allowing unlimited parallel calls:

```text id="x4n9pk"
5 Workers
    ↓
Concurrency Limiter
    ↓
2–3 active LLM calls
    ↓
Remaining requests → Queue
```

This smooths token consumption.

---

### 5. Queue requests

For asynchronous workloads:

```text id="h6r3tw"
LLM Requests
     ↓
Queue
     ↓
Token / Rate Limiter
     ↓
Azure OpenAI
```

This prevents sudden token spikes.

In your CWD architecture, **Azure Service Bus** can be used for asynchronous buffering where the business flow permits it.

---

### 6. Use backoff for throttling

If Azure OpenAI returns a throttling response:

```text id="v8p2mc"
Token limit exceeded
       ↓
Wait
       ↓
Retry
```

Use:

* Retry-After when provided
* Exponential backoff
* Jitter
* Bounded retries

Don't immediately send another large request.

---

### 7. Route to another deployment/model when appropriate

If the primary deployment is continuously saturated:

```text id="r5j8qx"
Primary Deployment
       ↓
Token throttling
       ↓
Approved alternate deployment
       ↓
Continue
```

The alternate model must still meet the task's quality, context, and tool-calling requirements.

---

### 8. Monitor token efficiency

I track:

```text id="e9k4ws"
Tokens/request
Tokens/minute
Tokens/Worker
Tokens/session
429/throttling rate
Queue depth
P95 latency
Cost/request
```

This helps identify a Worker that is consuming excessive tokens.

---

### 🎯 Strong interview answer

> **“I handle token throttling by controlling both token consumption and concurrency. We monitor input and output tokens, tokens per minute, and token usage by Worker. Before an LLM call, we reduce unnecessary context through history summarization, RAG Top-K control, reranking, deduplication, and context compression. We also enforce input/output token budgets and limit concurrent Worker calls. When throttling occurs, we respect Retry-After or use bounded exponential backoff with jitter, and asynchronous requests can be queued through Service Bus. If necessary, we can route eligible requests to another approved deployment.”**

### Easy memory trick

**Measure → Reduce → Limit → Queue → Backoff → Fallback → Monitor**

### Important distinction

**Rate limiting** = too many **requests**.

**Token throttling** = too many **tokens being processed/generated**.

In CWD:

> **“Rate limiting controls request volume; token throttling controls token volume. I address both.”**
