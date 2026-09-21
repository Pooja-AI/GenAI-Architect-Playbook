## How do you select between large and small models?

I use a **task-based model selection strategy** rather than using the largest model everywhere.

The basic principle is:

> **Use the smallest model that meets the quality requirement. Use a larger model when the task genuinely needs more reasoning or context understanding.**

### CWD example

```text
                    User Request
                         ↓
                    Coordinator
                         ↓
                  Task Classification
                    ↙           ↘
             Simple Task      Complex Task
                 ↓                 ↓
           Smaller Model      Larger Model
                 ↓                 ↓
          Fast / Low Cost    Better Reasoning
                    \           /
                     ↓         ↓
                    Result
```

### When I use a smaller model

Good for:

* Intent classification
* Entity extraction
* Simple summarization
* Routing
* Metadata extraction
* Simple transformations
* Straightforward RAG questions

Example:

```text
"What is the customer ID?"
        ↓
Small model
        ↓
C123
```

There is no reason to spend a large-model inference budget on this.

---

### When I use a larger model

Use a larger model when the task requires:

* Complex reasoning
* Multi-step planning
* Multiple tool calls
* Ambiguous user requests
* Combining results from multiple Workers
* Complex customer briefings
* Difficult RAG synthesis
* Multimodal reasoning

Example:

```text
Customer Briefing
      ↓
Sales Worker
      +
ServiceNow Worker
      +
RAG
      ↓
Large model
      ↓
Business summary
```

The model has to understand and synthesize information from multiple sources.

---

## How do I decide?

I evaluate both models on the **same golden dataset**.

```text
                    CWD Golden Dataset
                           ↓
              ┌────────────┴────────────┐
              ↓                         ↓
        Small Model               Large Model
              ↓                         ↓
        Quality metrics           Quality metrics
        Tool success              Tool success
        Latency                   Latency
        Cost                     Cost
              └────────────┬────────────┘
                           ↓
                    Production choice
```

For example, suppose:

| Metric         | Small | Large |
| -------------- | ----: | ----: |
| Answer quality |   91% |   95% |
| Tool success   |   94% |   98% |
| P95 latency    | 2 sec | 6 sec |
| Cost/request   | $0.01 | $0.08 |

If the small model meets the business quality threshold, I would use it for that task. If the task requires the extra reasoning quality, use the larger model.

Those numbers are illustrative.

---

## Model routing

In a mature architecture, I can use **model routing**:

```text
                    Request
                       ↓
                Task Classifier
                 ↙           ↘
          Simple task     Complex task
               ↓               ↓
          Small model      Large model
               ↓               ↓
               └───────┬───────┘
                       ↓
                    Response
```

This gives a good balance between:

**Quality + Latency + Cost**

---

### 🎯 Strong interview answer

> **“I select between large and small models based on task complexity and measured quality. Smaller models are suitable for classification, extraction, routing, and simple RAG tasks where they meet our quality threshold. Larger models are used for complex reasoning, multi-step tool use, multimodal reasoning, and synthesizing results from multiple Workers. I validate the choice using the same golden dataset and compare answer quality, tool-call success, latency, cost, and reliability. The goal is to use the smallest model that satisfies the business requirement.”**

### Easy memory trick

**Simple → Small**
**Complex → Large**
**Always → Evaluate**

Or:

> **“Don't use a large model where a small model can do the job.”**
