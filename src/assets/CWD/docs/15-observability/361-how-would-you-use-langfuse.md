## How would you use Langfuse?

In CWD, I would use **Langfuse for GenAI-specific observability and evaluation**. It gives me visibility into the **LLM calls, agent steps, prompts, tokens, latency, cost, retrieval, and quality**.

### Where Langfuse fits

```text id="h9g3k2"
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ├── RAG
 ├── LLM ───────────────→ Langfuse
 └── MCP
        ↓
   Enterprise System

OpenTelemetry
 ↓
Application Insights
 ↓
Infrastructure / distributed tracing
```

I use **OpenTelemetry/Application Insights** for the broader distributed system, while **Langfuse** gives me deeper GenAI visibility.

---

## 1. Trace LLM calls

For every LLM call, I capture:

```text id="5j7w8a"
Trace ID
Worker
Model
Model version
Prompt version
Input tokens
Output tokens
Latency
Status
Cost
```

Example:

```text id="p1q8cx"
CustomerWorker
   ↓
LLM Call
   ├── Model: GPT-...
   ├── Input: 8,200 tokens
   ├── Output: 1,100 tokens
   ├── Latency: 1.2 sec
   └── Cost: $...
```

This helps identify expensive or slow LLM calls.

---

## 2. Trace the complete agent trajectory

For Agentic AI, I don't want to see only the final LLM call.

I want:

```text id="x4q2mv"
CWD Request
  ↓
Coordinator
  ↓
Sales Delegator
  ↓
Customer Worker
  ↓
RAG
  ↓
LLM
  ↓
MCP Tool
  ↓
LLM
  ↓
Final Answer
```

This helps me understand **what the agent actually did**, not just what answer it produced.

---

## 3. Monitor prompts and prompt versions

I maintain versioned prompts:

```text id="5q7v2n"
customer-summary-v1
customer-summary-v2
customer-summary-v3
```

If quality decreases after deploying `v3`, I can compare:

```text id="w3x9km"
v2 → Groundedness 94%
v3 → Groundedness 87%
```

Then investigate the prompt change.

---

## 4. Monitor token consumption and cost

Langfuse can help track:

```text id="e2z7qp"
Input tokens
Output tokens
Total tokens
LLM calls
Cost
Cost / request
Cost / Worker
Cost / model
```

Example:

```text id="n7y4kc"
Customer Worker      $0.08
Incident Worker      $0.12
Opportunity Worker   $0.42  ← investigate
```

Then I drill into the expensive trace to find excessive context or repeated LLM calls.

---

## 5. Monitor latency

I can analyze:

```text id="q6p1rt"
LLM latency
Agent step latency
RAG latency
Tool latency
End-to-end workflow latency
```

For example:

```text id="b3x5vn"
Customer Worker
 ├── RAG       300 ms
 ├── LLM       800 ms
 └── MCP       250 ms
```

This helps identify where the Worker is spending time.

---

## 6. Evaluate hallucination / grounding

This is particularly important for CWD.

I evaluate whether the generated answer is supported by retrieved evidence.

```text id="j4m8qs"
Retrieved Evidence
       ↓
      LLM
       ↓
Generated Answer
       ↓
Faithfulness / Groundedness Evaluation
```

Example:

```text id="f0k6wv"
Retrieved:
"Customer has 3 open incidents."

Answer:
"Customer has 3 open incidents." ✓

Answer:
"Customer has 8 open incidents." ❌
```

I track these evaluation metrics over time to detect regressions.

---

## 7. Evaluate RAG

For CWD, I can track:

```text id="m8k2zy"
Retrieval relevance
Context precision
Context recall
Groundedness
Answer relevance
```

This helps distinguish:

> **Bad retrieval → bad context → hallucinated answer**

from an actual model-quality problem.

---

## 8. Monitor agent behavior

For CWD, I can evaluate:

```text id="z1c7ph"
Coordinator routing
Delegator selection
Worker/tool selection
Tool-call accuracy
Number of agent steps
Agent loops
Task completion
```

For example:

```text id="q8r5mx"
Customer Briefing
   ↓
Coordinator
   ↓
Correct Delegators selected ✓
   ↓
Correct Workers selected ✓
   ↓
Correct MCP tools selected ✓
   ↓
Task completed ✓
```

This is much more useful than simply checking whether the API returned `200`.

---

## 9. Production troubleshooting

Suppose users report:

> "Customer Briefing responses became slower."

I search the Langfuse trace:

```text id="t2n6bz"
Trace
 ↓
Coordinator
 ↓
Sales Delegator
 ↓
Customer Worker
 ↓
RAG
 ↓
LLM
```

I might discover:

```text id="f8w3pd"
Before:
RAG → 5 documents
Input tokens → 8K

After:
RAG → 20 documents
Input tokens → 35K
```

That explains the latency and cost increase.

---

## 10. Regression evaluation

Before deploying a new:

* LLM
* prompt
* RAG configuration
* Agent workflow
* MCP tool behavior

I run the **golden evaluation dataset**.

```text id="p6d9qa"
Code/Prompt Change
       ↓
Golden Dataset
       ↓
CWD Workflow
       ↓
Langfuse Evaluation
       ↓
Quality + Cost + Latency
       ↓
Quality Gate
       ↓
Deploy / Reject
```

This helps prevent a change that improves one metric while damaging grounding or task completion.

---

## Langfuse vs Application Insights

This is a very good interview question.

| Application Insights        | Langfuse               |
| --------------------------- | ---------------------- |
| Application monitoring      | GenAI observability    |
| API requests                | LLM calls              |
| Exceptions                  | Agent/LLM errors       |
| Infrastructure/dependencies | Prompts/model behavior |
| Distributed traces          | LLM/agent traces       |
| Availability                | Tokens/cost            |
| Service latency             | LLM latency            |
| Azure ecosystem             | GenAI evaluation       |

They **complement each other**.

### Interview-ready answer

> **“I would use Langfuse as the GenAI observability layer for CWD. I would instrument the Coordinator, Delegators and Workers to capture agent trajectories, LLM calls, model and prompt versions, token usage, latency, cost and tool interactions. I would also use it for RAG and response evaluation, such as retrieval relevance, groundedness, faithfulness and answer relevance. For production troubleshooting, I can start with a correlation or trace ID, inspect the complete agent trajectory, identify the slow or expensive step, and determine whether the issue came from retrieval, the LLM, tool execution or agent behavior. Application Insights and OpenTelemetry would remain my broader distributed application observability layer.”**

### Strong interview line

> **“Application Insights tells me what is happening across my application; Langfuse gives me deeper visibility into what the AI system is doing and why.”**

**Easy memory:**
**Langfuse = Trace → Tokens → Cost → Latency → Prompts → RAG → Agent behavior → Evaluation**
