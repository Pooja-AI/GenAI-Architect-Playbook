## How do you monitor model cost?

In CWD, I monitor cost at **request, model, Worker, and workflow levels**. The goal is to understand **which agents are consuming tokens and why**, then optimize the expensive paths.

### CWD cost flow

```text id="7m4q2x"
User Request
     ↓
Coordinator
     ↓
Delegator
     ↓
Workers
     ↓
LLM Calls
     ↓
Token / Cost Tracking
     ↓
┌────────────────────────────┐
│ Input tokens                │
│ Output tokens               │
│ Model                       │
│ Number of calls             │
│ Latency                     │
│ Estimated cost              │
└────────────────────────────┘
     ↓
Cost Dashboard / Alerts
```

### 1. Track tokens for every LLM call

For each call, I capture:

* Model/deployment
* Input tokens
* Output tokens
* Total tokens
* Number of calls
* Latency
* Worker/agent
* Workflow/run ID

For example:

```text id="k8v3ns"
Run: R123

Coordinator → 4K tokens
Sales Worker → 2K
Service Worker → 3K
Final synthesis → 5K

Total → 14K tokens
```

---

### 2. Calculate cost

Conceptually:

```text id="z6n2pw"
LLM Cost =
(input tokens × input price)
+
(output tokens × output price)
```

For multi-model architectures, I maintain pricing/configuration by model rather than hard-coding it into application logic.

---

### 3. Track cost by business dimension

This is important for enterprise systems.

I want to answer:

```text
Which model?
Which Worker?
Which customer workflow?
Which application?
Which team?
Which environment?
Which request?
```

For example:

```text id="m4x7qc"
Customer Briefing
      ↓
Coordinator       $0.02
Sales Workers     $0.01
Service Workers   $0.02
Final synthesis   $0.03
                  ─────
Total             $0.08
```

The numbers are illustrative.

---

### 4. Use correlation IDs

CWD already has a hierarchy such as:

```text
Session
  → Task
    → Run
      → Turn
        → Step
```

I attach the same correlation information to LLM telemetry.

That allows me to trace:

```text
User Request
 → Coordinator
 → Delegator
 → Worker
 → LLM
```

and determine exactly where token usage occurred.

---

### 5. Set budgets and alerts

I can establish:

```text id="p7x3dm"
Per request budget
Per workflow budget
Per user/team budget
Daily budget
Monthly budget
```

For example:

```text
If workflow cost > threshold
        ↓
Alert
        ↓
Investigate
```

For a runaway agent loop, this becomes particularly important.

---

### 6. Monitor cost efficiency

I don't look only at dollars.

I also track:

* Cost/request
* Cost per successful task
* Tokens/request
* Tokens per successful answer
* Tool-call success
* Latency
* Answer quality

For example, reducing tokens by 30% isn't necessarily good if answer quality drops significantly.

So I evaluate:

```text
Cost ↓
while
Quality stays acceptable
```

---

### 7. Optimize expensive paths

If a Worker is consuming too many tokens:

```text id="v9r4kc"
Cost Dashboard
      ↓
Identify expensive Worker
      ↓
Analyze prompt/context
      ↓
Reduce RAG Top-K
      ↓
Summarize history
      ↓
Use smaller model if appropriate
      ↓
Re-measure quality + cost
```

This connects directly to the model-routing strategy we discussed.

---

### 🎯 Strong interview answer

> **“I monitor model cost by capturing token usage for every LLM call and associating it with the model, Worker, workflow, and correlation ID. We calculate estimated input and output token cost and aggregate it at request, workflow, application, and team levels. We monitor cost per request, tokens per request, latency, and quality, and set budget thresholds and alerts. If a Worker becomes expensive, we optimize prompt size, RAG Top-K, conversation history, concurrency, or route appropriate tasks to a smaller model. The goal is not simply to minimize tokens, but to optimize cost while maintaining the required quality and reliability.”**

### Easy memory trick

**Measure → Attribute → Budget → Alert → Optimize → Re-evaluate**

Key interview line:

> **“I don't optimize for the lowest token count; I optimize for the lowest cost that still meets the required quality and SLA.”**
