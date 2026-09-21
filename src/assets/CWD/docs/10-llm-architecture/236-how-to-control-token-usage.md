## How do you control token usage?

In CWD, I control tokens at **multiple stages**, because token growth can increase **cost, latency, and even cause context-window failures**.

### CWD flow

```text id="7q4m1k"
User Request
     ↓
Query Optimization
     ↓
RAG Retrieval
     ↓
Top-K Control
     ↓
Reranking
     ↓
Deduplication
     ↓
Context Compression
     ↓
Token Budget
     ↓
LLM
```

### 1. Control RAG results

I don't send every retrieved document to the LLM.

For example:

```text
Azure AI Search
      ↓
Top 30-50 candidates
      ↓
Semantic reranking
      ↓
Top 5-10 chunks
      ↓
LLM
```

This significantly reduces unnecessary context.

### 2. Use good chunking

Instead of sending entire documents:

```text
10-page document
      ↓
Relevant chunks only
```

For CWD, we initially use roughly **500–700 tokens per chunk with 10–15% overlap**, then tune based on retrieval evaluation.

### 3. Remove duplicate information

If multiple retrieved chunks contain the same information, I deduplicate them before constructing the prompt.

```text
Chunk 1 → Customer C123
Chunk 2 → Customer C123
Chunk 3 → Incident INC1001
Chunk 4 → Customer C123

             ↓ Deduplicate

Chunk 1
Chunk 3
```

### 4. Compress context

If retrieved content is still too large, we summarize or extract only the portions relevant to the question.

For example:

```text
Large incident history
       ↓
Relevant facts only
       ↓
LLM
```

### 5. Limit conversation history

I don't continuously send the entire conversation.

I maintain:

* Recent messages
* Important state
* Task-specific context
* Summaries of older conversation

For CWD, persisted workflow state can be stored separately from the LLM prompt.

### 6. Use model-specific token budgets

Different tasks can have different limits.

```text
Classification → Small budget
Extraction     → Small budget
Simple RAG     → Medium budget
Complex synthesis → Larger budget
```

I also control `max_tokens`/output limits so the model doesn't generate unnecessarily long responses.

### 7. Prevent multi-agent context explosion

This is especially important in CWD.

I don't pass every Worker response to every other agent.

```text
Worker 1 ──┐
Worker 2 ──┼──→ Delegator
Worker 3 ──┘
               ↓
        Relevant results
               ↓
          Coordinator
```

The Delegator/Coordinator receives **structured, summarized results**, rather than entire raw tool responses.

### 8. Monitor token usage

I track:

* Input tokens
* Output tokens
* Tokens/request
* Tokens/Worker
* Tokens/session
* Cost/request
* Context-window utilization

This helps identify which agents or prompts are consuming excessive tokens.

---

### 🎯 Strong interview answer

> **“I control token usage at multiple layers. First, I retrieve only relevant documents using metadata filtering, hybrid search, and reranking. Then I limit Top-K, deduplicate chunks, and compress context when necessary. I also summarize older conversation history and pass structured Worker results instead of raw tool responses between agents. Finally, I set model-specific input and output budgets and monitor token usage, latency, and cost per request. This prevents context-window issues while keeping the response grounded and cost-efficient.”**

### Easy memory trick

**Filter → Retrieve → Rerank → Deduplicate → Compress → Limit → Monitor**

The key interview line:

> **“Don't solve token problems only at the LLM layer; control the amount of information entering the LLM.”**
