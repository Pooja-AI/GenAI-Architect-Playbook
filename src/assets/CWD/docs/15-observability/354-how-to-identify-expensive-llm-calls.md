## How do you identify expensive LLM calls?

In CWD, I track **cost at the individual LLM-call level** and then aggregate it by Worker, Delegator, workflow, model, and customer/use case.

### CWD flow

```text
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
LLM Call
   ├── Model
   ├── Input tokens
   ├── Output tokens
   ├── Latency
   └── Cost
```

For every LLM call, I capture:

```text
trace_id
correlation_id
worker
model
model_version
prompt_version
input_tokens
output_tokens
total_tokens
latency
cost
```

### How do I calculate cost?

Conceptually:

```text
LLM Cost =
(input_tokens × input_price)
+
(output_tokens × output_price)
```

For example:

```text
Customer Worker
  Input:  8,000 tokens
  Output: 2,000 tokens
  Cost:   $0.08

Opportunity Worker
  Input: 35,000 tokens
  Output: 8,000 tokens
  Cost:   $0.42   ← expensive call
```

The exact price comes from the **model/provider pricing configuration**, which I version so that cost calculations remain accurate when pricing changes.

### I look for these patterns

#### 1. High token usage

```text
Input tokens ↑
       ↓
Large prompt/context
       ↓
Higher cost
```

Usually caused by excessive conversation history, RAG chunks, tool outputs, or duplicated context.

#### 2. Too many LLM calls

```text
One request
   ↓
Worker → LLM
Worker → LLM
Worker → LLM
Worker → LLM
```

Even if each call is cheap, the workflow becomes expensive.

I monitor:

```text
LLM calls / workflow
LLM calls / Worker
LLM calls / successful task
```

#### 3. Wrong model selection

For example, using an expensive large model for a simple classification/routing task.

I monitor:

```text
Use case → Model → Cost → Quality
```

Then use an appropriate smaller model when quality requirements allow it.

#### 4. Excessive agent loops

```text
Worker
 ↓
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
...
```

I set limits on iterations/tool calls and monitor loop frequency.

#### 5. Large RAG context

```text
RAG
 ↓
Top 20 documents
 ↓
Huge context
 ↓
LLM
 ↓
High input-token cost
```

I use appropriate top-K, filtering, reranking and context compression.

---

### How do I find the expensive Worker?

I aggregate LLM cost:

```text
Customer Worker       $0.08
Incident Worker       $0.12
Opportunity Worker    $0.42  ← highest
Coordinator           $0.05
```

Then drill into the expensive Worker:

```text
Opportunity Worker
      ↓
LLM Call #1 → $0.10
LLM Call #2 → $0.08
LLM Call #3 → $0.24  ← expensive
      ↓
35K input tokens
      ↓
Large RAG/tool context
```

Now I know **why** the workflow is expensive.

### What I use for monitoring

For the Azure CWD architecture:

```text
OpenTelemetry
     ↓
Application Insights / Log Analytics
     ↓
LLM telemetry

Langfuse
     ↓
LLM traces
     ↓
Tokens + model + latency + cost
```

I can build dashboards such as:

```text
Cost / Request
Cost / Worker
Cost / Delegator
Cost / Model
Cost / Use Case
Tokens / Request
LLM Calls / Workflow
```

### How do I reduce the cost?

After identifying the expensive calls:

```text
High cost
   ↓
Analyze token usage
   ↓
Reduce unnecessary context
   ↓
Optimize RAG top-K
   ↓
Cache repeated results
   ↓
Reduce unnecessary LLM calls
   ↓
Use smaller model where appropriate
   ↓
Limit agent loops
   ↓
Re-measure quality + cost
```

I **don't optimize cost alone**. I make sure quality, grounding, task completion, latency and safety remain within the required thresholds.

### Interview-ready answer

> **“I identify expensive LLM calls by tracking input and output tokens, model, prompt version, number of calls, and cost for every LLM span. I aggregate that data by Worker, Delegator, workflow and use case. If a Worker has unusually high cost, I drill into the trace to determine whether the cause is large RAG context, excessive agent loops, too many LLM calls, or an unnecessarily expensive model. Then I optimize context, caching, model selection and call frequency while continuously checking quality and task-completion metrics.”**

### Strong interview line

> **“I don't just monitor total LLM cost. I trace cost down to the individual call so I can explain exactly which Worker, model, context and behavior caused the expense.”**

**Easy memory:**
**Model + Input Tokens + Output Tokens + Call Count → Cost → Trace → Root Cause → Optimize**
