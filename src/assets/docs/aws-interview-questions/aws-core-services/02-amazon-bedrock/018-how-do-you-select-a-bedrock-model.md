# How do you select a Bedrock model?

## Short answer

I select a Bedrock model based on the **task requirements**, not simply by choosing the largest model.

I evaluate:

**Task complexity → Quality → Latency → Cost → Context → Tool/Reasoning capability → Evaluation results**

Then I use a **model router/policy** to select the appropriate model.

## Key points

### 1. First identify the task

For CWD, classify the request:

```text
Request
   ↓
Task Classifier
   ↓
┌──────────────┬───────────────┐
Simple         Medium          Complex
 ↓              ↓                ↓
Classification  Summarization    Multi-source reasoning
Routing         Extraction       Customer briefing
```

---

### 2. Match model capability

For example:

| CWD task                      | Model approach          |
| ----------------------------- | ----------------------- |
| Intent classification         | Smaller/faster model    |
| Entity extraction             | Smaller/faster model    |
| Simple summarization          | Small/mid model         |
| RAG question answering        | Mid/high capability     |
| Complex multi-agent reasoning | Higher-capability model |
| Final customer briefing       | Higher-capability model |
| Vision/multimodal task        | Vision-capable model    |

The exact model should be selected from the **currently available Bedrock models in the target AWS region**.

---

### 3. Evaluate quality

Before production, I create a golden dataset:

```text
Question
Expected answer
Retrieved context
Actual answer
```

Then evaluate:

* Accuracy
* Groundedness
* Relevance
* Tool-call correctness
* Hallucination rate
* Structured-output correctness

For example:

```text
Model A → 91% quality
Model B → 94% quality
```

If Model B costs significantly more but gives only a small quality improvement, I may use Model A for that workload.

---

### 4. Check latency

Suppose the SLA is:

```text
P95 < 5 seconds
```

If a model consistently exceeds the latency target, I would consider another model or change the routing strategy.

So model selection isn't only about quality.

```text
Quality
   +
Latency
   +
Cost
```

---

### 5. Check cost

I monitor:

```text
Input tokens
Output tokens
Requests
Cost/request
Cost/workflow
```

A simple routing strategy might be:

```text
Simple task
   ↓
Lower-cost model

Complex task
   ↓
Higher-capability model
```

This prevents using an expensive model for every request.

---

### 6. Check context requirements

Some CWD requests may contain:

* Customer information
* Multiple incidents
* Retrieved documents
* Tool results
* Conversation history

If the context is large, I need a model that supports the required context window.

But I would still **reduce unnecessary context** through:

* Reranking
* Top-K control
* Summarization
* Deduplication
* Context compression

---

### 7. Check tool/function calling

For agentic CWD, the model may need to decide:

```text
Should I call Salesforce?
Should I call ServiceNow?
Should I retrieve documents?
Which tool should I call?
```

Therefore I evaluate the model's **tool-calling reliability**, not just its text-generation quality.

---

# CWD model-selection flow

```text
                  CWD Request
                       ↓
                Task Classifier
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
       Simple task          Complex task
             ↓                   ↓
      Model Policy          Model Policy
             ↓                   ↓
       Lower-cost model     High-capability model
             └─────────┬─────────┘
                       ↓
                  Amazon Bedrock
                       ↓
                  Foundation Model
                       ↓
                     Result
```

## Example

User asks:

> "Is customer ABC currently associated with an open incident?"

This is relatively straightforward:

```text
Intent detection
      ↓
ServiceNow Worker
      ↓
MCP
      ↓
ServiceNow
```

A smaller model may be sufficient for classification or extraction.

But:

> "Analyze ABC's sales history, open incidents, previous issues, and knowledge documents and create a customer briefing."

That's a more complex reasoning and synthesis task:

```text
Salesforce
     +
ServiceNow
     +
OpenSearch
     ↓
Complex context
     ↓
High-capability model
     ↓
Customer briefing
```

---

# How I implement the router

The router can initially be **rule/policy based**, and later become more sophisticated.

Example:

```python
if task == "classification":
    model = "small_model"

elif task == "simple_summary":
    model = "small_model"

elif task == "customer_briefing":
    model = "high_capability_model"

elif context_tokens > threshold:
    model = "long_context_model"

else:
    model = "default_model"
```

In production, I would combine these rules with **evaluation data and telemetry** rather than relying only on an LLM to make the decision.

---

# 🎯 Strong interview answer

> **“I select a Bedrock model based on the workload rather than automatically using the largest model. First, I classify the task by complexity and requirements such as reasoning, tool calling, context size, latency, and multimodal capability. Then I compare candidate models using a golden evaluation dataset for quality, groundedness, tool-call accuracy, latency, and cost. For simple CWD tasks such as classification and extraction, I use a smaller lower-cost model where it meets the quality bar. For complex multi-source reasoning and customer briefing, I use a higher-capability model. I then continuously monitor quality, P95 latency, token usage, and cost and adjust the routing policy based on production results.”**

## Easy memory trick

**T → Q → L → C → E**

* **T** = Task
* **Q** = Quality
* **L** = Latency
* **C** = Cost
* **E** = Evaluation

> **“Choose the smallest model that reliably meets the required quality and SLA.”**

### Key distinction

**Task Classifier** → determines what kind of task it is.

**Model Router** → maps that task to a model.

**Bedrock** → provides access to the selected foundation model.

**Evaluation** → proves that the selected model actually meets the quality requirement.
