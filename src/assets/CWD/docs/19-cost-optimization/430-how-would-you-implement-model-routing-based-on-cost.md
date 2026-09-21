## How would you implement model routing based on cost?

The main principle is:

> **Use the cheapest model that can reliably meet the quality, latency, and safety requirements for that task.**

In CWD, I would put **model routing in the Coordinator or a dedicated Model Router**, before expensive LLM execution.

### CWD flow

```text
User Request
     ↓
Coordinator
     ↓
Intent + Complexity Analysis
     ↓
Model Router
     ↓
 ┌──────────────┬──────────────┬──────────────┐
 │ Simple       │ Medium       │ Complex      │
 ↓              ↓              ↓
Small/Cheap     Mid Model      Strong Model
     │              │               │
     └──────────────┴───────────────┘
                    ↓
               Worker / LLM
                    ↓
                Validation
```

### 1. Classify the task

First determine what the task requires.

| Task                   | Model strategy                     |
| ---------------------- | ---------------------------------- |
| Intent classification  | Small/cheap model                  |
| Entity extraction      | Small/cheap model                  |
| Simple summarization   | Small/medium                       |
| Simple RAG answer      | Small/medium                       |
| Tool selection         | Small model or deterministic rules |
| Complex planning       | Stronger model                     |
| Multi-source synthesis | Stronger model                     |
| Complex reasoning      | Stronger model                     |

For example:

```text
"What is the status of customer C12345?"
        ↓
Simple retrieval
        ↓
Small model / deterministic routing
```

Whereas:

```text
"Analyze C12345's sales, incidents and historical
issues and provide recommendations."
        ↓
Multi-step reasoning
        ↓
Stronger model
```

---

### 2. Define a quality threshold

I wouldn't say:

> "Always use the cheapest model."

Instead:

> **Use the cheapest model that passes the required quality threshold.**

For example, suppose testing gives:

```text
Model A → $ → Quality 91%
Model B → $$ → Quality 96%
Model C → $$$ → Quality 98%
```

If the requirement is **≥95%**, Model B can be selected.

The threshold should be determined from the business use case and evaluation results, not arbitrarily.

---

### 3. Use a routing policy

Conceptually:

```python
def route_model(task):

    if task.type in ["classification", "extraction"]:
        return "small_model"

    if task.complexity == "low":
        return "small_model"

    if task.complexity == "medium":
        return "medium_model"

    return "strong_model"
```

In production, I would make this **configuration-driven**, rather than hard-coding model names.

For example:

```json
{
  "low": {
    "model": "small",
    "max_cost": 0.01
  },
  "medium": {
    "model": "medium",
    "max_cost": 0.05
  },
  "high": {
    "model": "strong",
    "max_cost": 0.15
  }
}
```

---

### 4. Consider token cost

Model routing shouldn't only look at the model's nominal price.

I consider:

```text
Estimated Cost
=
Input Tokens × Input Price
+
Output Tokens × Output Price
```

So before calling the model, I can estimate:

```text
Prompt size
RAG context
Expected output
Model pricing
        ↓
Estimated cost
```

If a request has a very large context, the cheaper model may still become expensive.

---

### 5. Add a fallback

Suppose the cheaper model is selected:

```text
Small Model
    ↓
Validation
    ↓
 ┌─────────────┐
 │ Valid?      │
 └──────┬──────┘
     YES│     │NO
        ↓     ↓
      Return  Strong Model
```

For example, if the small model produces:

* invalid structured output
* insufficient confidence
* poor grounding
* failed tool selection
* safety/policy validation failure

then route to the stronger approved model.

---

### 6. Use evaluation before production

I would test candidate models using the **same CWD golden dataset**.

Evaluate:

```text
Quality
Groundedness
Hallucination rate
Tool-call accuracy
Routing accuracy
Latency
Token consumption
Cost
Failure rate
```

Then create a routing policy based on those results.

This prevents choosing a cheap model that creates expensive downstream failures.

---

### 7. Add a cost budget

For example, CWD could have:

```text
Tenant
   ↓
Cost Budget
   ↓
Model Router
```

If a tenant has a defined budget, the router can choose:

```text
Normal budget
→ standard model

Budget approaching limit
→ cheaper approved model

Budget exhausted
→ queue / reject according to policy
```

The important point is that **cost controls should not bypass security or required quality thresholds**.

---

## CWD example

Customer Briefing:

```text
User
 ↓
Coordinator
 ↓
Model Router
 ↓
Intent = Customer Briefing
Complexity = Medium
 ↓
Medium model
 ↓
Sales Delegator ──→ Customer Worker
                  → Opportunity Worker

IT Delegator ─────→ Incident Worker
 ↓
Coordinator aggregation
 ↓
Final synthesis
```

For the final synthesis, if multiple sources need reasoning, I may use a stronger model.

So one workflow can use **different models for different steps** rather than using the most expensive model everywhere.

---

## 🎯 Interview-ready answer

> **“I implement cost-based model routing by first classifying the task based on complexity and required quality. In CWD, simple tasks such as intent classification, entity extraction, and basic summarization can use smaller models, while complex planning and multi-source synthesis can use stronger models. I evaluate candidate models on the same golden dataset using quality, groundedness, hallucination rate, tool-call accuracy, latency, token consumption, and cost. I then select the least expensive model that meets the required quality threshold. I also estimate token cost before execution, apply tenant or workflow budgets where required, and use validation-based fallback routing to a stronger model when the cheaper model doesn't meet the required criteria.”**

### Easy memory

**Classify → Estimate cost → Check quality → Cheapest acceptable model → Validate → Fallback → Monitor**

**Strong interview line:**

> **“Cost is a routing signal, not the only routing criterion. I optimize for the lowest cost that still satisfies quality, latency, safety, and reliability requirements.”**
