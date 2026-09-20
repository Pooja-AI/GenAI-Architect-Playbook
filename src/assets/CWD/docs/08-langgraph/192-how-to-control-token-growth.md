## How do you control token growth in LangGraph / CWD?

**Token growth happens when the workflow keeps accumulating conversation history, tool results, agent outputs, and intermediate state and sends too much of it to the LLM.**

In CWD, I control it at **both the LangGraph state level and the LLM prompt level**.

### CWD example

Without controls:

```text
User Request
   ↓
Coordinator
   ↓
Sales Delegator
   ↓
Workers
   ↓
Large Salesforce response
   ↓
IT Delegator
   ↓
Large ServiceNow response
   ↓
Coordinator
   ↓
LLM receives everything
```

The context can become very large.

Instead:

```text
Enterprise Data
      ↓
Workers
      ↓
Filter / Summarize
      ↓
Small structured result
      ↓
LangGraph State
      ↓
LLM
```

---

## 1. Don't put everything into graph state

Don't store huge documents or raw API responses unnecessarily.

Bad:

```python
state["worker_results"] = entire_salesforce_response
```

Better:

```python
state["worker_results"] = {
    "customer_name": "ABC Corp",
    "revenue": "$10M",
    "open_opportunities": 4
}
```

Keep the state **minimal and task-specific**.

---

## 2. Summarize long outputs

Suppose a Worker retrieves 100 pages of information.

Don't send all 100 pages to the Coordinator.

```text
Worker
 ↓
100 pages
 ↓
Summarization
 ↓
Key facts
 ↓
Coordinator
```

For example:

```python
summary = summarize(
    documents,
    max_tokens=1000
)
```

Then only the relevant summary is passed forward.

---

## 3. Use RAG instead of sending entire documents

For your CWD enterprise search:

```text
User Question
     ↓
Query
     ↓
Azure AI Search
     ↓
Retrieve top relevant chunks
     ↓
Rerank
     ↓
LLM
```

Instead of:

```text
Entire SharePoint document → LLM
```

Use:

```text
Relevant chunks → LLM
```

This reduces both token usage and latency.

---

## 4. Control conversation history

Don't continuously send the entire conversation:

```text
Message 1
Message 2
Message 3
...
Message 100
```

Instead, maintain:

```text
Recent messages
+
Conversation summary
+
Current task context
```

For example:

```text
Long history
     ↓
Summarize
     ↓
"Customer requested briefing for C12345.
Sales and IT data are required."
```

---

## 5. Limit tool output

This is especially important with **MCP**.

Suppose:

```text
get_customer()
```

returns 500 fields.

The Worker doesn't need all 500 fields.

Request/filter only what is needed:

```json
{
  "customer_id": "C12345",
  "fields": [
    "name",
    "revenue",
    "industry"
  ]
}
```

Or filter the response before adding it to state.

```text
MCP
 ↓
Large response
 ↓
Worker filters
 ↓
Relevant fields only
 ↓
State
```

---

## 6. Limit RAG chunks

Don't retrieve 50 chunks just because they are available.

Use:

```text
Top-K retrieval
+
reranking
+
relevance threshold
```

For example:

```text
Search → Top 20
          ↓
Reranker → Top 5
          ↓
LLM → Top 5
```

The exact K should be tuned through evaluation rather than arbitrarily fixed.

---

## 7. Use structured outputs

Instead of asking a Worker to return a huge natural-language explanation:

```text
"Here is everything I found..."
```

use a structured result:

```python
{
    "customer_name": "ABC Corp",
    "revenue": "$10M",
    "open_incidents": 3,
    "risk": "medium"
}
```

This makes downstream prompts much smaller and predictable.

---

## 8. Don't pass unnecessary state between agents

This is important for your **A2A architecture**.

Don't send the entire LangGraph state through A2A:

```text
Entire Graph State
      ↓
Delegator
```

Instead send only the required task context:

```json
{
  "task_id": "T1001",
  "intent": "customer_briefing",
  "customer_id": "C12345",
  "capability": "customer_information"
}
```

So:

> **LangGraph state can be large internally, but A2A context should be narrow.**

---

## 9. Control agent loops

Agentic workflows can accidentally generate repeated reasoning/tool calls:

```text
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

Set limits:

```text
Maximum iterations
Maximum tool calls
Maximum execution time
Maximum retry count
```

For example:

```python
MAX_TOOL_CALLS = 5
```

If the limit is reached:

```text
Stop
 ↓
Return partial result / HITL / failure
```

---

## 10. Monitor token usage

In production, track:

```text
input_tokens
output_tokens
total_tokens
tokens_per_workflow
tokens_per_agent
tokens_per_tool_call
cost
latency
```

For your CWD observability stack:

```text
LangGraph
   ↓
LLM calls
   ↓
OpenTelemetry / Langfuse
   ↓
Token + latency + cost metrics
```

Then identify:

```text
Coordinator = 2K tokens
Sales Agent = 5K
IT Agent = 18K  ← investigate
```

Maybe the IT Worker is passing huge ServiceNow responses into the LLM.

---

# CWD token-control architecture

```text
                    User
                      ↓
                 Coordinator
                      ↓
              Small A2A Context
                      ↓
              ┌───────┴───────┐
              ↓               ↓
        Sales Delegator   IT Delegator
              ↓               ↓
           Workers          Workers
              ↓               ↓
             MCP             MCP
              ↓               ↓
          Enterprise Systems
              ↓               ↓
        Filter / Validate / Summarize
              ↓               ↓
             Small Structured Results
              └───────┬───────┘
                      ↓
                  Aggregate
                      ↓
                     LLM
```

---

## Interview-ready answer

> **“I control token growth at multiple layers. First, I keep LangGraph state minimal and don't store unnecessary raw documents or API responses. Second, I use RAG with top-K retrieval and reranking instead of sending entire documents. Third, Workers filter and summarize large MCP responses before passing them to the Coordinator. I also keep A2A task context narrow instead of sending the entire graph state between agents. Finally, I control conversation history, tool-call iterations, and monitor input/output tokens, latency, and cost through observability tools such as Langfuse.”**

### Easy memory

**Don't send everything → Retrieve → Filter → Summarize → Structure → Limit → Monitor**

And the key interview line:

> **“Token management is not just a model problem; it's an architecture problem involving state design, RAG, tool outputs, agent loops, and observability.”**
