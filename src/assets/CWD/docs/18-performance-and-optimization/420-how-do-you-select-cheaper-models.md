## How do you select cheaper models in CWD?

The key principle is:

> **I don't choose the cheapest model blindly. I choose the least expensive model that meets the quality, latency, safety, and reliability requirements for that task.**

### 1. Classify the task first

I divide CWD tasks into simple, medium, and complex.

```text
User Request
     ↓
Coordinator
     ↓
Task classification
     ↓
 ┌──────────────┬──────────────┬──────────────┐
 Simple         Medium         Complex
    ↓              ↓               ↓
Cheaper model   Mid model      Strong model
```

For example:

| CWD task                            | Model approach                 |
| ----------------------------------- | ------------------------------ |
| Intent classification               | Smaller/cheaper model          |
| Entity extraction                   | Smaller/cheaper model          |
| Simple routing                      | Deterministic code if possible |
| Summarization                       | Smaller model                  |
| RAG answer with simple context      | Smaller/mid model              |
| Complex multi-step reasoning        | Stronger model                 |
| Difficult agent planning            | Stronger model                 |
| Final synthesis across many Workers | Stronger model if required     |

---

### 2. Use deterministic logic before an LLM

This is actually the cheapest option.

For example:

```python
if intent == "customer_briefing":
    route_to_customer_briefing()
```

No LLM is required.

So my preference is:

```text
Deterministic logic
       ↓
Semantic cache
       ↓
Cheaper model
       ↓
Stronger model only when necessary
```

---

### 3. Use model routing

I can implement a model router in the Coordinator:

```python
def select_model(task):
    if task.type in ["classification", "extraction"]:
        return "small_model"

    if task.complexity == "medium":
        return "mid_model"

    return "strong_model"
```

For example:

```text
Customer ID extraction
        ↓
Small model

Customer briefing synthesis
        ↓
Strong model
```

---

### 4. Route based on complexity

I can calculate or classify complexity using factors such as:

```text
Number of reasoning steps
Number of tools
Amount of context
Number of Workers
Ambiguity of request
Required accuracy
```

Example:

```text
"Get customer name for C12345"
        ↓
Simple → cheaper model / no LLM

"Analyze customer health using CRM,
opportunities and ServiceNow incidents"
        ↓
Complex → stronger model
```

---

### 5. Use offline evaluation before production

I don't decide:

> "Model A is cheaper, so let's use Model A."

Instead, I test candidate models against the same **golden dataset**.

```text
                    Golden Dataset
                          ↓
             ┌────────────┼────────────┐
             ↓            ↓            ↓
          Model A      Model B      Model C
             ↓            ↓            ↓
          Quality      Quality      Quality
          Latency      Latency      Latency
          Cost         Cost         Cost
             └────────────┼────────────┘
                          ↓
                    Select model
```

I compare:

* task accuracy
* groundedness
* hallucination rate
* tool-call accuracy
* latency
* token usage
* cost
* failure/timeout rate

---

### 6. Use a quality threshold

For example, suppose evaluation gives:

```text
Model       Quality       Cost
Model A     92%           Low
Model B     95%           Medium
Model C     97%           High
```

If the application requires **≥94% quality**, Model A doesn't meet the requirement, so I would use Model B for that task.

The goal is:

> **Lowest cost among models that meet the required quality threshold.**

---

### 7. Use fallback routing

If the cheaper model fails or produces an invalid result:

```text
Cheaper Model
     ↓
Validation
     ↓
 ┌───────┴───────┐
Valid           Invalid
 ↓                 ↓
Return       Stronger Model
```

For example:

```python
result = await cheap_model.generate(prompt)

if not validate(result):
    result = await strong_model.generate(prompt)
```

This prevents using the expensive model for every request while still protecting quality.

---

### 8. Monitor the model after deployment

Model selection isn't a one-time decision.

I monitor:

```text
Model
 ├── Quality
 ├── Tokens
 ├── Cost
 ├── Latency
 ├── 429 rate
 ├── Timeout rate
 └── Failure rate
```

If the cheaper model starts producing more failures or lower-quality results, I can change the routing policy.

---

## CWD example

For a **Customer Briefing**:

```text
Coordinator
   ↓
Intent extraction
   → cheaper model
   ↓
customer_id extraction
   → cheaper model / deterministic validation
   ↓
Sales + IT Delegators
   ↓
Workers → MCP
   ↓
Salesforce + ServiceNow
   ↓
Results
   ↓
Final synthesis
   → stronger model if complex
```

So I **don't use the expensive model at every layer**.

### 🎯 Interview-ready answer

> **“I select cheaper models based on task complexity and a quality threshold rather than simply choosing the lowest-cost model. In CWD, I first use deterministic logic where possible, then route simple tasks such as classification, entity extraction, and basic summarization to smaller models. More complex planning or multi-source synthesis can use a stronger model. I evaluate candidate models on the same golden dataset using quality, groundedness, hallucination rate, tool-call accuracy, latency, tokens, and cost. I choose the least expensive model that meets the required quality threshold, and I use validation and fallback routing to a stronger model when the cheaper model fails.”**

**Easy memory:**

> **Classify → Evaluate → Cheapest model that meets quality → Validate → Fallback → Monitor**
