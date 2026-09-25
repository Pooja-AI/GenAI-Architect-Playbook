# How would you switch from one Bedrock model to another?

## Short answer

I would **not hard-code the Bedrock model inside each Worker**.

I would put model selection behind a **Model Router / Model Gateway**. The Worker sends a task to the router, and the router selects the appropriate Bedrock model based on **task type, capability, latency, cost, quality, or failure conditions**.

```text
Worker
   ↓
Model Router
   ↓
Select Model
   ↓
Amazon Bedrock
   ↓
Model A / Model B / Model C
```

## Key points

### 1. Keep model configuration outside the Worker

Instead of:

```python
model = "model-A"
```

inside the Worker, use configuration:

```text
Model Router
   ├── Simple task → Model A
   ├── Complex reasoning → Model B
   └── Fallback → Model C
```

This means changing models doesn't require changing the Worker business logic.

---

### 2. Maintain a model configuration

For example:

```text
Model Registry

Task: intent_classification
Primary: Nova Micro
Fallback: Nova Lite

Task: customer_briefing
Primary: Claude Sonnet-class
Fallback: Nova Pro-class
```

I would also store:

```text
model_id
region
capabilities
context_limit
tool_calling_support
quality_score
latency_target
cost
status
```

---

### 3. Switch the model through configuration

Suppose initially:

```text
Customer Briefing
        ↓
Claude Sonnet-class
```

If evaluation shows another approved model is better for that workload:

```text
Customer Briefing
        ↓
Model Router
        ↓
Nova Pro-class
```

The **Worker code doesn't change**.

Only the model configuration/routing policy changes.

---

## 4. Use model routing

For example:

```text
                    Request
                       ↓
                 Model Router
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
        Simple task          Complex task
             ↓                   ↓
        Small model        Higher-capability
             ↓                   ↓
                  Amazon Bedrock
```

The router can consider:

* Task complexity
* Context size
* Tool-calling requirement
* Structured-output requirement
* Latency
* Cost
* Quality/evaluation results

---

## 5. For production, don't change everything at once

I would use **canary or percentage-based rollout**.

Initially:

```text
100% → Model A
```

Then:

```text
90% → Model A
10% → Model B
```

Monitor:

```text
Quality
Latency
Cost
Errors
Tool-call success
Groundedness
```

If Model B performs as expected:

```text
50% → Model A
50% → Model B
```

Then:

```text
0% → Model A
100% → Model B
```

If there is a problem, route traffic back to Model A.

---

## 6. Test before switching

Before production, I evaluate both models against the same **golden dataset**.

```text
                 Golden Dataset
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
          Model A             Model B
             ↓                   ↓
       Evaluation             Evaluation
             ↓                   ↓
       Quality/Cost/Latency comparison
```

Metrics can include:

* Answer quality
* Groundedness
* Retrieval/use-of-context quality
* Tool-call correctness
* Structured-output validity
* P95 latency
* Token usage
* Cost

I would switch only if the new model satisfies the required quality and SLA.

---

# CWD example

Suppose the **Customer Briefing Worker** currently uses Model A.

```text
Coordinator
    ↓
Sales Delegator
    ↓
Customer Briefing Worker
    ↓
Model Router
    ↓
Model A
```

We want to move to Model B.

### Step 1 — Evaluate

```text
Golden test set
      ↓
Model A vs Model B
```

### Step 2 — Register Model B

```text
Model Registry

Customer Briefing
Primary → Model A
Candidate → Model B
```

### Step 3 — Canary

```text
90% → Model A
10% → Model B
```

### Step 4 — Monitor

```text
Quality
P95 latency
Cost
Errors
Tool calling
Groundedness
```

### Step 5 — Promote

```text
10% → 50% → 100%
```

### Step 6 — Rollback if necessary

```text
Model B problem
      ↓
Router
      ↓
Model A
```

---

# 🎯 Strong interview answer

> **“I would abstract Bedrock model selection behind a Model Router rather than hard-code a model inside each Worker. I maintain a model registry with model IDs, capabilities, context limits, latency, cost and evaluation results. When I want to switch models, I first evaluate the new model against the same golden dataset, then use a canary rollout such as 90/10 traffic. I monitor quality, groundedness, tool-call success, P95 latency, errors and cost. If the new model meets the required SLA and quality, I gradually move traffic to it; otherwise I roll back through the router without changing the Worker code.”**

## Easy memory trick

**Evaluate → Configure → Canary → Monitor → Promote/Rollback**

### Key distinction

**Model Router** = decides which model receives the request.

**Model Registry** = stores model configuration/capabilities.

**Canary deployment** = safely introduces the new model.

**Rollback** = routes traffic back to the previous model.
