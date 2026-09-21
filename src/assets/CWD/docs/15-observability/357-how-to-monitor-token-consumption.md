## How do you monitor token consumption?

In CWD, I monitor **input tokens, output tokens, total tokens, and token growth for every LLM call**. Then I aggregate them by **Worker, Delegator, workflow, model, and use case**.

### CWD flow

```text id="kqj6st"
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
LLM Call
   ├── Input tokens
   ├── Output tokens
   └── Total tokens
```

### 1. What do I capture?

For every LLM call:

```text id="0p8s4e"
trace_id
correlation_id
worker
model
prompt_version
input_tokens
output_tokens
total_tokens
latency
cost
```

Example:

```json id="x2z8qk"
{
  "worker": "CustomerWorker",
  "model": "GPT-4.x",
  "input_tokens": 8200,
  "output_tokens": 1200,
  "total_tokens": 9400,
  "latency_ms": 1800
}
```

Then I aggregate:

```text id="s6q4b8"
Request
 ├── Coordinator LLM      2,000 tokens
 ├── Customer Worker      9,400 tokens
 ├── Incident Worker      6,200 tokens
 └── Summary LLM           3,100 tokens
                         ─────────────
                           20,700 tokens
```

---

### 2. Monitor token consumption by Worker

This helps identify which Worker is consuming excessive context.

```text id="8w4b2j"
Customer Worker       9K
Incident Worker       6K
Opportunity Worker   35K  ← investigate
```

Then I drill into the Opportunity Worker:

```text id="0rjv3f"
35K input tokens
      ↓
Large conversation history?
      ↓
Too many RAG documents?
      ↓
Large MCP response?
      ↓
Repeated context?
```

---

### 3. Monitor input vs output tokens

I separate them because the causes are different.

```text id="q9t7l2"
Input tokens
    ↑
Large prompt
Large RAG context
Tool output
Conversation history

Output tokens
    ↑
Verbose response
Poor output constraints
Agent loop
```

For example:

```text id="m8v2pk"
Input  = 40,000
Output = 2,000
```

This tells me the primary problem is probably **context size**, not generated output.

---

### 4. Monitor token growth across agent steps

This is especially important in Agentic AI.

```text id="x1q5fz"
Step 1 → 4K tokens
Step 2 → 9K
Step 3 → 16K
Step 4 → 28K
Step 5 → 45K  ← abnormal growth
```

If tokens continuously increase, I investigate:

* Full conversation being carried forward
* Repeated RAG results
* Large tool responses
* Agent loops
* Duplicate context
* Poor state management

---

### 5. Set token thresholds

For example:

```text id="7n1j8c"
Normal request        < 15K
Warning               > 15K
High consumption      > 30K
Hard limit            > 50K
```

The actual thresholds depend on the model and use case.

If the request exceeds a safe threshold:

```text id="f4j8q2"
Large context
    ↓
Summarize history
    ↓
Reduce RAG top-K
    ↓
Filter tool output
    ↓
Continue
```

If it still exceeds the limit, I fail gracefully instead of allowing uncontrolled token growth.

---

### 6. Connect tokens to cost

Token monitoring also drives cost monitoring:

```text id="0z1s5r"
Input tokens
     +
Output tokens
     ↓
Model pricing
     ↓
LLM cost
     ↓
Cost / request
Cost / Worker
Cost / workflow
```

This helps identify expensive workflows.

---

### 7. Tools I use

For Azure CWD:

```text id="l1x3sm"
LLM
 ↓
OpenTelemetry
 ↓
Application Insights / Log Analytics

LLM/Agent telemetry
 ↓
Langfuse
 ↓
Tokens + Latency + Cost + Traces
```

I can create dashboards for:

```text
Tokens / Request
Tokens / Worker
Tokens / Model
Input vs Output Tokens
Average Tokens
P95 Tokens
Token Growth / Agent Step
Cost / Request
```

### Interview-ready answer

> **“I monitor token consumption at every LLM call. I capture input tokens, output tokens and total tokens along with the model, Worker, prompt version, trace ID and cost. I aggregate these metrics by Worker, workflow and model and monitor token growth across agent steps. If token consumption suddenly increases, I trace whether the cause is excessive RAG context, conversation history, tool responses, duplicate context or agent loops. I then use techniques such as summarization, context filtering, RAG top-K optimization, structured tool outputs and iteration limits.”**

### Strong interview line

> **“I don't monitor only total tokens; I monitor where the tokens are coming from and how they grow across the agent trajectory.”**

**Easy memory:**
**Input + Output → Total → Worker → Step-by-step growth → Threshold → Root cause → Optimize**
