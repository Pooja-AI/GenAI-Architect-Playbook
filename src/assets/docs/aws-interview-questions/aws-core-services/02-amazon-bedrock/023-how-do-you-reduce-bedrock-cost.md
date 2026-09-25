# How do you reduce Bedrock cost?

## Short answer

I reduce Bedrock cost using:

**Measure → Avoid → Reduce → Route → Cache → Control → Monitor**

The main idea is to **avoid unnecessary LLM calls and unnecessary tokens while maintaining the required quality**.

---

## Key points

### 1. Measure cost per request

First, I track:

```text
Model
Input tokens
Output tokens
Total tokens
Number of LLM calls
Worker
Workflow
Cost/request
Cost/successful task
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
Bedrock
```

Using correlation IDs lets me identify which Worker or workflow is consuming the most money.

---

### 2. Avoid unnecessary LLM calls

This is usually the first optimization.

Don't use an LLM for deterministic tasks.

For example:

```text
"Is customer_id present?"
```

can be handled by normal code.

```text
if customer_id:
    continue
else:
    return validation_error
```

No Bedrock call is needed.

Use the LLM when reasoning or language understanding is actually required.

---

### 3. Reduce prompt tokens

Large prompts increase cost.

I reduce:

* Conversation history
* RAG context
* Duplicate information
* Unnecessary tool results
* Large system prompts

Instead of:

```text
50 retrieved chunks
        ↓
      Bedrock
```

use:

```text
50 chunks
   ↓
Reranking
   ↓
Top 5–10
   ↓
Bedrock
```

---

### 4. Use model routing

This is a major CWD optimization.

```text
                 Request
                    ↓
              Task Classifier
                    ↓
           ┌────────┴────────┐
           ↓                 ↓
       Simple              Complex
           ↓                 ↓
   Lower-cost model    Higher-capability
                              model
```

For example:

* Intent classification → smaller model
* Entity extraction → smaller model
* Simple summarization → smaller/mid model
* Complex customer briefing → higher-capability model

The exact model choice should be validated using quality evaluations.

---

### 5. Control output tokens

Don't allow every request to generate a huge response.

For example:

```text
Classification → small output limit
Extraction     → small output limit
Summary        → medium limit
Customer brief → larger limit
```

This controls unnecessary generated tokens.

---

### 6. Cache repeated requests

Use Redis/ElastiCache where appropriate.

```text
User Request
     ↓
Semantic Cache
     ↓
Cache hit? ── Yes → Return cached result
     │
     No
     ↓
Bedrock
     ↓
Store result in cache
```

For semantically similar queries, I can use embeddings to identify sufficiently similar cached requests.

For dynamic Salesforce/ServiceNow information, I would apply **TTL/freshness rules or bypass the cache** because stale information can be dangerous.

---

### 7. Reduce unnecessary RAG context

RAG can become expensive if we send too much content.

Use:

```text
Hybrid Search
     ↓
Top 50 candidates
     ↓
Reranker
     ↓
Top 5–10
     ↓
Context validation
     ↓
Bedrock
```

This reduces input tokens while improving relevance.

---

### 8. Reduce duplicate Worker calls

In CWD, multiple Workers may retrieve overlapping information.

For example:

```text
Worker A → Customer information
Worker B → Same customer information
Worker C → Similar information
```

I can aggregate and deduplicate results before the final LLM call.

```text
Workers
   ↓
Aggregation
   ↓
Deduplication
   ↓
Compact context
   ↓
Final Bedrock call
```

---

### 9. Reduce the number of LLM calls

Instead of:

```text
Worker 1 → Bedrock
Worker 2 → Bedrock
Worker 3 → Bedrock
Worker 4 → Bedrock
Worker 5 → Bedrock
```

where possible, use deterministic processing or combine compatible operations.

But I would **not blindly combine everything into one huge prompt**, because that can increase context size, latency, and reduce reliability.

The architecture should balance number of calls against token volume and quality.

---

# Example

Suppose the original CWD workflow costs:

```text
5 LLM calls
×
8,000 input tokens
=
40,000 input tokens
```

After optimization:

```text
3 necessary LLM calls
×
3,000 input tokens
=
9,000 input tokens
```

Potentially much cheaper.

But I would validate:

```text
Cost ↓
Latency ↓
Quality ↔
Groundedness ↔
```

before deploying the optimization.

---

# Cost optimization architecture

```text
                         CWD Request
                              ↓
                        Coordinator
                              ↓
                     Avoid unnecessary calls
                              ↓
                          Delegator
                              ↓
                           Worker
                              ↓
                    ┌──────────────────┐
                    │ Context Control  │
                    │                  │
                    │ RAG Top-K        │
                    │ Deduplication    │
                    │ History summary  │
                    │ Token limits     │
                    └────────┬─────────┘
                             ↓
                       Model Router
                       ↙          ↘
                Lower-cost       Higher-capability
                   model              model
                       ↘          ↙
                         Bedrock
                            ↓
                     Cache if suitable
                            ↓
                         Response
```

---

# What I monitor

I create dashboards for:

```text
Cost/request
Cost/workflow
Cost/Worker
Input tokens
Output tokens
LLM calls/request
Cache hit rate
Model distribution
P95 latency
Quality score
Groundedness
```

Then I identify expensive Workers.

For example:

```text
Customer Briefing Worker
        ↓
High token consumption
        ↓
Analyze prompt + RAG context
        ↓
Reduce context / change model
        ↓
Re-evaluate quality
```

---

# 🎯 Strong interview answer

> **“I reduce Bedrock cost primarily by avoiding unnecessary model calls and reducing unnecessary tokens. First, I measure token usage and cost per request, Worker and workflow using correlation IDs. Then I use deterministic code for tasks that don't require an LLM, control RAG Top-K and conversation history, deduplicate tool results, and set input and output token budgets. I also use model routing so simple tasks go to lower-cost models while complex reasoning uses higher-capability models. Where appropriate, I use Redis semantic caching to avoid repeated calls, with freshness controls for dynamic enterprise data. Finally, I continuously monitor cost, latency and quality because the objective isn't the lowest possible token count; it's the lowest cost that still meets our quality and SLA requirements.”**

## Easy memory trick

**A → R → R → R → C → M**

* **A = Avoid** unnecessary calls
* **R = Reduce** tokens
* **R = Route** to right model
* **R = Reuse** cached results
* **C = Control** budgets
* **M = Monitor** cost + quality

### Key distinction

**Token optimization** → reduce tokens per call.

**Call optimization** → reduce unnecessary LLM calls.

**Model routing** → use a cheaper model when appropriate.

**Caching** → avoid repeating an expensive call.

Together, these are how I would control **Bedrock cost at CWD scale**.
