# Your agent costs $2 per request. Business wants it below $0.20. How do you optimize it?

### 🎯 Strong Interview Answer

> **“I would not optimize cost by simply switching to a cheaper model. I would first break down the $2 cost into model inference, token usage, tool calls, retrieval, agent iterations, and infrastructure. Then I would reduce unnecessary reasoning and tool calls, use smaller models for simpler tasks, optimize prompts and context, introduce caching, and route only complex requests to expensive models. My target would be to bring the average cost below $0.20 while maintaining the required quality and latency.”**

---

# 1. First identify where the $2 is going

I would establish a cost breakdown:

```text id="3rj8te"
$2.00 / request
│
├── LLM input tokens       $0.50
├── LLM output tokens      $0.70
├── Multiple agent calls   $0.40
├── Tool/API calls         $0.20
├── Embedding/RAG          $0.10
└── Infrastructure         $0.10
```

The exact numbers would come from telemetry.

I would **measure before optimizing**.

---

# 2. Reduce unnecessary agent calls

This is usually one of the biggest opportunities.

Bad:

```text id="u0qz9y"
User
 ↓
Coordinator
 ↓
Planner
 ↓
Research Agent
 ↓
Validation Agent
 ↓
Summarizer
 ↓
Final Agent
```

Potentially 5 LLM calls for a simple question.

Instead:

```text id="4t6lcz"
User
 ↓
Router
 ↓
Knowledge Agent
 ↓
Answer
```

For simple requests, I avoid unnecessary multi-agent orchestration.

---

# 3. Use model routing

I would introduce **model tiers**.

```text id="8xq8jq"
                    Request
                       ↓
                  Complexity?
                  /          \
               Simple       Complex
                 ↓             ↓
            Small Model    Large Model
```

For example:

| Task               | Model strategy    |
| ------------------ | ----------------- |
| Classification     | Small/cheap model |
| Routing            | Small model       |
| Simple extraction  | Small model       |
| RAG answer         | Mid-tier model    |
| Complex reasoning  | Large model       |
| Critical synthesis | Large model       |

The expensive model should be the **exception**, not the default.

---

# 4. Reduce context size

Token usage is a major cost driver.

Instead of sending:

```text id="z3u8cy"
20 documents
+
full conversation
+
50 tool descriptions
+
large system prompt
```

I would send:

```text id="qv0kkr"
Relevant documents
+
minimal conversation
+
relevant tool definitions
+
focused system prompt
```

This also improves latency and sometimes answer quality.

---

# 5. Optimize RAG

Poor RAG can dramatically increase cost.

Instead of:

```text id="k0h6r8"
Retrieve 50 chunks
      ↓
Send all 50 to LLM
```

I would use:

```text id="l7rj5f"
Query
 ↓
Retrieve top 10
 ↓
Rerank
 ↓
Top 3–5 relevant chunks
 ↓
LLM
```

This reduces input tokens while preserving relevant context.

---

# 6. Cache repeated requests

If users repeatedly ask:

> "What is the CWD incident escalation process?"

I don't need to call the LLM every time.

```text id="f3vby8"
Request
  ↓
Semantic Cache
  ↓
Cache Hit?
 /       \
YES       NO
 ↓         ↓
Answer   LLM
           ↓
        Store result
```

Caching can significantly reduce cost for repetitive workloads.

---

# 7. Cache intermediate results

I can also cache:

* embeddings
* retrieval results
* tool responses
* frequently used enterprise data
* common reasoning outputs where safe

For example:

```text id="8yt7qj"
Agent A
  ↓
Search Enterprise Docs
  ↓
Cache
  ↓
Agent B can reuse result
```

This avoids repeatedly querying the same source.

---

# 8. Reduce tool calls

If the agent is making:

```text id="8e6i8k"
10 tool calls / request
```

I would investigate whether all are necessary.

For example:

```text
search()
search()
search()
search()
```

could potentially become:

```text
search(query, filters)
```

I would use:

* batching
* parallel calls
* duplicate-call detection
* maximum tool-call budgets
* better tool routing

This reduces both cost and latency.

---

# 9. Control agent loops

If an agent keeps reasoning:

```text id="3v1gdh"
Think → Tool → Think → Tool
→ Think → Tool → Think → Tool
```

cost can explode.

I would introduce:

```text id="f4b8kh"
max_iterations = 3–5
max_tool_calls = N
timeout = X seconds
```

And explicit termination conditions.

---

# 10. Prompt optimization

Large system prompts are sent repeatedly.

I would remove:

* redundant instructions
* unnecessary examples
* duplicated context
* irrelevant tool descriptions

Instead of a 10K-token prompt:

```text id="3j7f41"
10,000 tokens
```

target something much smaller:

```text id="z6d0oc"
2,000–3,000 relevant tokens
```

while preserving the instructions that actually affect behavior.

---

# 11. Use structured outputs

If the agent only needs:

```json id="r5hz42"
{
  "intent": "incident_search",
  "priority": "high"
}
```

I don't need a long reasoning response.

Structured output reduces unnecessary generation and makes downstream processing cheaper.

---

# 12. Parallelize where possible

Parallelization primarily improves latency, but it can also reduce orchestration overhead.

Instead of:

```text id="l6i5tq"
Agent A
 ↓
Agent B
 ↓
Agent C
```

if A, B, and C are independent:

```text id="b1hz9f"
        Coordinator
       /     |      \
      ↓      ↓       ↓
   Agent A Agent B Agent C
       \      |      /
        ↓     ↓     ↓
          Synthesis
```

I can execute independent operations concurrently.

---

# 13. Distill expensive reasoning

If a large model is repeatedly solving the same class of problems, I can consider:

```text id="4f9x0g"
Large Model
     ↓
Generate high-quality examples
     ↓
Evaluate
     ↓
Fine-tune / distill smaller model
     ↓
Use smaller model in production
```

This is especially useful for stable, repetitive enterprise tasks.

---

# 14. Optimize architecture, not just the model

My optimization would look like:

```text id="7xg7h3"
             User Request
                   ↓
             Cheap Router
                   ↓
          ┌────────┴────────┐
          ↓                 ↓
       Simple            Complex
          ↓                 ↓
    Small Model        Large Model
          ↓                 ↓
       Cache/RAG       Agent Workflow
          ↓                 ↓
          └────────┬────────┘
                   ↓
                Response
```

---

# Target cost

I would create a cost target such as:

```text id="1g9cma"
Current:                 $2.00

Reduce:
Model routing           -$0.70
Context optimization    -$0.30
Fewer agent calls       -$0.30
Caching                 -$0.25
RAG optimization        -$0.15
Tool optimization       -$0.10
                         ------
Target:                  $0.20
```

These are **illustrative targets**, not guaranteed savings; I would derive the actual allocation from production telemetry.

---

# CWD Example

Suppose the CWD assistant currently does:

```text id="q8s9i1"
User
 ↓
Coordinator LLM
 ↓
Planning LLM
 ↓
Knowledge Agent LLM
 ↓
RAG
 ↓
3 retrieval calls
 ↓
Validation LLM
 ↓
Final LLM

Cost = $2.00
```

I would redesign it:

```text id="l3q2vu"
User
 ↓
Cheap Router
 ↓
Capability Routing
 ↓
Knowledge Agent
 ↓
Top-K RAG
 ↓
Small/Mid Model
 ↓
Cache
 ↓
Response

Cost target < $0.20
```

For a complex incident investigation:

```text id="w4n2d8"
Complex Request
      ↓
Large Model
      ↓
Multi-Agent Workflow
      ↓
Deep Analysis
```

So **complex requests can still use expensive reasoning**, while simple requests remain cheap.

---

# ⭐ 45-Second Interview Version

> **“If my agent costs $2 per request and the target is $0.20, I would first instrument the system and identify the cost drivers—LLM tokens, number of model calls, tool calls, retrieval, and infrastructure. Then I would use a tiered model strategy where small models handle routing, classification, extraction, and simple queries, while expensive models are reserved for complex reasoning. I would reduce context size, optimize RAG to retrieve only relevant chunks, cache repeated queries and intermediate results, eliminate unnecessary agent and tool calls, and put limits on agent iterations. I would also evaluate whether some repeated workloads can be handled by a smaller distilled model. Finally, I would track cost per request alongside quality, latency, and task success, because getting below $0.20 is not useful if answer quality drops.”**

### 🔥 Key line to remember

**“Don't make every request an expensive agentic workflow—route simple requests cheaply and reserve deep reasoning for requests that actually need it.”**
