## What happens when a new prompt reduces accuracy?

If a new prompt causes CWD accuracy to drop, **I don't promote it to production immediately**. I compare it against the existing prompt using the regression/evaluation suite and identify which behavior degraded.

### CWD example

Suppose I change the Coordinator prompt.

**Before:**

```text
Routing accuracy = 98%
```

**New prompt:**

```text
Routing accuracy = 91% ❌
```

The new prompt is rejected or rolled back until the issue is understood.

### My process

```text
New Prompt
    ↓
Run Golden Dataset
    ↓
Compare with Baseline
    ↓
Accuracy decreased?
    ↓ YES
Analyze failed cases
    ↓
Identify root cause
    ↓
Improve prompt / model / routing logic
    ↓
Run regression again
    ↓
Pass quality gates?
   ├── NO → Rollback
   └── YES → Staging → Production
```

### What do I investigate?

I look at **which part of CWD degraded**:

* Intent classification
* Entity extraction
* Delegator routing
* Worker selection
* MCP tool selection
* RAG retrieval
* Groundedness
* Final-answer accuracy
* Abstention behavior

For example, if:

```text
Customer Briefing → Sales + IT
```

previously routed correctly, but the new prompt selects only:

```text
Sales
```

I inspect the failed cases and determine whether the prompt caused ambiguity or changed the routing instructions.

### I don't look only at average accuracy

I compare the new prompt across multiple dimensions:

```text
                  Old       New
Routing           98%       91% ❌
Groundedness      96%       95%
Task completion   97%       92% ❌
p95 latency       4.2s      4.0s
Cost/request      $0.020    $0.015
```

Even though cost and latency improved, the accuracy regression may make the prompt unacceptable.

### If the prompt is still useful

Sometimes the new prompt improves one area but hurts another. Then I can:

* refine the prompt
* add few-shot examples
* make routing rules more explicit
* constrain available tools
* improve structured output/schema
* add deterministic validation
* test another model
* use different prompts for different agents/use cases

I keep the **previous prompt as the baseline** so I can roll back quickly.

### Interview-ready answer

> **“If a new prompt reduces accuracy, I treat it as a regression. I don't deploy it directly. I run the golden evaluation dataset, compare the new prompt against the baseline, identify which scenarios and metrics degraded, and analyze the failed trajectories. If the issue can be fixed, I refine the prompt and rerun the regression suite. If it still fails the quality gates, I roll back to the previous version. I also track other metrics such as groundedness, task completion, latency, cost, and safety because a prompt change can improve one metric while degrading another.”**

### Easy memory

**Detect → Compare → Diagnose → Fix → Regression test → Rollback if needed.**
