## What is the biggest cost component in CWD?

In an **Agentic AI / CWD system, the LLM is usually one of the biggest variable cost components**, especially when workflows involve multiple LLM calls, large prompts, long outputs, or agent loops.

But I would **not assume it is always the biggest**. I measure the actual cost by component.

### CWD cost breakdown

```text id="costcwd"
CWD
 │
 ├── LLM / Embeddings       ← often major variable cost
 ├── Vector Search
 ├── Compute
 │    ├── Coordinator
 │    ├── Delegators
 │    └── Workers
 ├── MCP / API integration
 ├── Database / Storage
 ├── Network
 └── Observability
```

### Why LLM cost can become large

Consider a Customer Briefing:

```text
Coordinator
    ↓ LLM call
Sales Delegator
    ↓ LLM call
Customer Worker
    ↓ LLM call
Opportunity Worker
    ↓ LLM call
Incident Worker
    ↓ LLM call
Final synthesis
    ↓ LLM call
```

If every component uses an LLM, the number of calls and tokens can grow quickly.

The biggest drivers are:

```text
LLM Cost
   =
Input tokens
 + Output tokens
 + Number of calls
 + Model pricing
```

Agent loops can make it worse:

```text
LLM → Tool → LLM → Tool → LLM → Tool...
```

---

## How I reduce the LLM cost

### 1. Reduce unnecessary calls

Use deterministic logic for:

* validation
* routing
* calculations
* filtering
* authorization
* formatting

### 2. Reduce tokens

```text
Less history
+ Less RAG context
+ Smaller MCP responses
+ Smaller output
= Lower cost
```

### 3. Use cheaper models for simple tasks

```text
Classification → smaller model
Extraction → smaller model
Simple summarization → smaller model
Complex reasoning → stronger model
```

### 4. Use caching

Repeated requests can use:

```text
Semantic Cache
      ↓
Valid HIT → no new LLM call
```

### 5. Control agent loops

Set:

```text
max_iterations
max_tool_calls
timeout
```

so the agent cannot keep calling the model indefinitely.

---

## But what about Azure AI Search, MCP, or compute?

These can also become significant depending on workload.

For example:

```text
High LLM usage
      → LLM may dominate

Huge enterprise corpus
      → Search/storage may dominate

Very high traffic
      → Compute + search may become significant

Heavy enterprise API usage
      → Downstream/API cost may dominate
```

So in an interview, I would avoid saying **“LLM is always the biggest cost.”**

### 🎯 Interview-ready answer

> **“In CWD, LLM inference is often one of the largest variable cost components because agentic workflows can generate multiple model calls and large token volumes. I don't assume it's always the biggest, though. I measure cost by component—LLM input/output tokens, embedding calls, vector search, compute, storage, MCP and downstream calls, and observability. To reduce LLM cost, I minimize unnecessary calls, reduce prompt and RAG context, use smaller models for simpler tasks, cache repeated requests, control agent loops, and monitor cost per workflow and per Worker. My goal is to optimize cost without compromising quality or reliability.”**

**Easy memory:**

> **Count calls → Reduce tokens → Right-size model → Cache → Control loops → Measure cost/workflow**
