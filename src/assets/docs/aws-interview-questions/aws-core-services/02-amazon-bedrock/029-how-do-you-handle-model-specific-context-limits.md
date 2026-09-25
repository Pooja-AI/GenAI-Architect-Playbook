# How do you handle model-specific context limits?

## Short answer

I handle context limits in the **Model Router and Context Manager**.

Before calling Bedrock, I calculate the required context and compare it with the selected model's **maximum context window**. If the request is too large, I **reduce, summarize, retrieve fewer documents, or route to a model with a larger context capacity**.

```text
Request
   ↓
Context Manager
   ↓
Estimate tokens
   ↓
Model Router
   ↓
Does context fit?
   ├── Yes → Bedrock
   └── No
        ↓
   Compress / Retrieve less
        ↓
   Still too large?
        ↓
   Route to compatible model
```

---

## Key points

### 1. Maintain context limits in the Model Registry

I keep model-specific information such as:

```text
Model
Context limit
Max output tokens
Tool-calling support
Multimodal support
Cost
Latency
```

For example:

```text
Model A → Context limit: X
Model B → Context limit: Y
```

The actual limits depend on the specific Bedrock model/version available in the target region, so I don't hard-code assumptions.

---

### 2. Calculate the required context

Before calling the model:

```text
Total tokens =
System prompt
+ conversation history
+ RAG context
+ tool results
+ user query
+ reserved output tokens
```

I need to leave room for the model's response.

For example:

```text
Context budget
    ↓
System prompt       1K
History             3K
RAG                 5K
Tool results        2K
User query          1K
Reserved output     2K
                    ───
Total              14K
```

Then I check whether the selected model can support that request.

---

## 3. Don't simply truncate randomly

If the context is too large, I don't blindly remove the first 10,000 tokens.

I use controlled reduction.

### Strategy 1 — Summarize history

```text
Old conversation
       ↓
Summary
       ↓
Recent messages
       ↓
LLM
```

Keep the important information while reducing token usage.

---

### Strategy 2 — Reduce RAG Top-K

Suppose retrieval returns:

```text
Top 50 documents
```

Instead of sending all 50:

```text
50 candidates
     ↓
Reranking
     ↓
Top 5–10 relevant chunks
     ↓
LLM
```

This both reduces context and can improve relevance.

---

### Strategy 3 — Compress tool results

Suppose Salesforce returns a large JSON response.

Instead of:

```json
{
  "customer": "...",
  "transactions": "...",
  "hundreds of fields..."
}
```

the Worker extracts only what the task needs:

```text
Customer
Revenue
Industry
Open opportunities
Recent interactions
```

Then sends the compact structured result to the model.

---

### Strategy 4 — Summarize intermediate Worker results

In CWD, multiple Workers may return information:

```text
Sales Worker       → large result
ServiceNow Worker  → large result
Knowledge Worker   → large result
```

The Delegator can normalize/deduplicate the results before sending them to the final synthesis model.

```text
Workers
   ↓
Normalize
   ↓
Deduplicate
   ↓
Summarize
   ↓
Final LLM
```

---

## 4. Route to a larger-context model

Sometimes compression would remove important information.

Then the Model Router can select a model with sufficient context capacity.

```text
Context = very large
        ↓
Model Router
        ↓
Large-context approved model
        ↓
Bedrock
```

But I don't automatically choose the largest model because **cost and latency also matter**.

---

# CWD example

Suppose a Customer Briefing request contains:

```text
Salesforce data
+
ServiceNow incidents
+
SharePoint documents
+
Conversation history
```

The raw context is too large.

I would do:

```text
Customer Briefing
       ↓
Context Manager
       ↓
Token estimation
       ↓
Too large?
       ↓
┌─────────────────────────┐
│ Summarize history       │
│ Reduce RAG Top-K        │
│ Deduplicate results     │
│ Compress tool output    │
└────────────┬────────────┘
             ↓
        Recalculate
             ↓
        Still too large?
          /          \
        No            Yes
        ↓              ↓
     Bedrock      Larger-context
                    model
```

---

# 5. Reserve output tokens

This is an important interview point.

Don't use the entire context window for input.

For example:

```text
Model context capacity
        ↓
Input context
        +
Reserved output tokens
        ↓
Must fit within model limits
```

If I need a 2,000-token response, I reserve that space before building the prompt.

---

# 6. Monitor context utilization

I track:

```text
Input tokens
Output tokens
Context utilization %
Truncation events
Summarization events
RAG Top-K
Model selected
Context-limit errors
```

Example:

```text
Context utilization = 85%
```

If this starts happening frequently, I investigate the context-building strategy rather than waiting for failures.

---

# 🎯 Strong interview answer

> **“I handle model-specific context limits through a Context Manager and Model Router. I maintain each model's context and capability information in the model registry. Before invocation, I estimate tokens for the system prompt, conversation history, RAG results, tool outputs and reserved response tokens. If the context is too large, I first reduce it through history summarization, RAG reranking and Top-K reduction, tool-result compression and deduplication. If the task still requires more context, the Model Router selects an approved model with sufficient context capacity. I also monitor context utilization and truncation events so we can proactively optimize the application.”**

## Easy memory trick

**Measure → Compress → Retrieve less → Route → Monitor**

### Key distinction

**Context limit** = how much information the model can process in one request.

**Token limit** = limits applied to input/output generation.

**Model routing** = choosing a model whose capabilities and context capacity fit the task.

> **“Don't just truncate the prompt—control the context intelligently.”**
