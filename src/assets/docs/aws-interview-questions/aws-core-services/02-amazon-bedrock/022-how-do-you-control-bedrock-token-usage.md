# How do you control Bedrock token usage?

## Short answer

I control Bedrock token usage at **four levels**:

**Measure → Limit → Reduce → Route**

I track input/output tokens, set token budgets, reduce unnecessary context, and route simple tasks to smaller models.

---

## Key points

### 1. Measure token usage

For every Bedrock call, I track:

```text
Input tokens
Output tokens
Total tokens
Model
Worker
Workflow / Run
Latency
Cost
```

In CWD:

```text
Session
  ↓
Task
  ↓
Run
  ↓
Worker
  ↓
Bedrock call
```

I attach a `correlation_id` so I can determine which Worker or workflow consumed the tokens.

---

### 2. Set input token limits

Don't send the entire conversation or every retrieved document.

Instead:

```text
100 documents
     ↓
Hybrid search
     ↓
Reranking
     ↓
Top 5–10 documents
     ↓
Bedrock
```

This reduces unnecessary input tokens.

---

### 3. Control conversation history

Instead of sending:

```text
Entire conversation history
```

use:

```text
Recent messages
+
Conversation summary
+
Current request
```

Example:

```text
Old conversation
      ↓
Summarization
      ↓
Compact context
      ↓
Bedrock
```

---

### 4. Control RAG Top-K

If OpenSearch returns 50 chunks, don't automatically send all 50 to Bedrock.

```text
OpenSearch
    ↓
Top 50
    ↓
Reranker
    ↓
Top 5–10
    ↓
Bedrock
```

This is one of the important ways to reduce token consumption in CWD.

---

### 5. Remove duplicate context

Suppose three Workers return similar information:

```text
Worker 1 → Customer information
Worker 2 → Same customer information
Worker 3 → Similar customer information
```

Before sending everything to the final model:

```text
Worker results
     ↓
Deduplication
     ↓
Structured aggregation
     ↓
Bedrock
```

---

### 6. Limit output tokens

I also set an appropriate **maximum output-token budget**.

For example:

```text
Classification → small output budget
Extraction     → small output budget
Summary        → medium budget
Customer brief → larger budget
```

I don't give every request a huge output allowance.

---

### 7. Use model routing

Not every task requires the most capable model.

```text
             Request
                ↓
          Task Classifier
                ↓
       ┌────────┴────────┐
       ↓                 ↓
   Simple              Complex
       ↓                 ↓
 Smaller model      Larger model
```

This can reduce both **token cost and latency**, while maintaining the required quality.

---

### 8. Avoid unnecessary LLM calls

This is very important.

Suppose the Worker can determine something using a deterministic rule:

```text
customer_id exists?
```

Don't call an LLM just to answer that.

Use:

```text
Rules / code → deterministic task
LLM → reasoning task
```

Also use caching where appropriate.

```text
Request
   ↓
Semantic cache
   ↓
Cache hit → return result
   ↓
Cache miss
   ↓
Bedrock
```

For dynamic Salesforce/ServiceNow data, I would use appropriate TTL/freshness controls rather than blindly caching the result.

---

# CWD token-control architecture

```text
                    CWD Request
                         ↓
                   Coordinator
                         ↓
                    Delegator
                         ↓
                      Worker
                         ↓
               Context Controller
                ↙       ↓       ↘
           History    RAG      Tool results
           summary    Top-K    Deduplication
                ↘       ↓       ↙
                  Token Budget
                       ↓
                  Model Router
                       ↓
                  Amazon Bedrock
                       ↓
                  Output Limit
                       ↓
                     Result
```

---

# Example

Suppose initially we send:

```text
Conversation      = 4,000 tokens
RAG context      = 8,000 tokens
Tool results     = 3,000 tokens
Prompt           = 1,000 tokens
--------------------------------
Total input      = 16,000 tokens
```

We can optimize:

```text
Conversation summary = 1,000
RAG Top-K            = 3,000
Structured tools     = 1,500
Prompt               =   500
--------------------------------
Total                = 6,000
```

So the model receives **much less unnecessary context**.

The important point is to verify that quality and grounding remain acceptable after compression.

---

# Token budget per Worker

For CWD, I can also establish budgets:

```text
Worker                    Token Budget
------------------------------------------------
Intent Classifier         Low
Entity Extractor          Low
Salesforce Worker         Low/Medium
ServiceNow Worker         Low/Medium
RAG Worker                Medium
Customer Briefing         High
Final Synthesis           High
```

If a Worker exceeds its budget:

```text
Worker
  ↓
Token budget exceeded
  ↓
Stop / summarize / reduce context
  ↓
Continue safely
```

---

# Monitor token efficiency

I monitor:

* Tokens/request
* Input tokens/request
* Output tokens/request
* Tokens/Worker
* Tokens/workflow
* Cost/request
* Cost/successful task
* Cache hit rate
* RAG Top-K
* Model usage
* Quality/groundedness

A useful metric is:

**Cost per successful business task**

because reducing tokens too aggressively can hurt answer quality.

---

# 🎯 Strong interview answer

> **“I control Bedrock token usage using a combination of measurement, budgets, context optimization and model routing. First, I track input and output tokens for every model call and attribute them to the Worker and CWD workflow using correlation IDs. Then I control input tokens by summarizing conversation history, limiting RAG Top-K, reranking and deduplicating context, and returning structured tool results instead of unnecessary raw data. I also set appropriate output-token limits for each task and avoid LLM calls when deterministic logic is sufficient. Finally, I use model routing and caching where appropriate. I monitor tokens per request, cost per workflow, latency and quality so that optimization doesn't reduce answer quality or grounding.”**

## Easy memory trick

**M → L → R → R**

* **M = Measure** tokens
* **L = Limit** input/output
* **R = Reduce** unnecessary context
* **R = Route** to the right model

### Key distinction

> **Token optimization is not simply “use fewer tokens.”**

The goal is:

> **Use the minimum context and output required to meet the required quality, grounding, latency and cost.**
