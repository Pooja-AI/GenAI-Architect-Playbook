## How do you route requests between models?

In CWD, I use a **model router** that looks at the **task type, complexity, required capabilities, latency, cost, and model availability** before selecting a model.

```text
User Request
     ↓
Coordinator
     ↓
Model Router
     ↓
┌──────────────┬───────────────┬──────────────┐
│ Simple Task  │ Complex Task  │ Multimodal   │
↓              ↓               ↓
Small Model    Large Model     Vision Model
     \             |              /
      └────────────┴─────────────┘
                   ↓
              Worker / Result
```

### 1. Route based on task complexity

For example:

```text
Intent classification
        → Small model

Entity extraction
        → Small model

Simple RAG question
        → Medium/small model

Complex customer briefing
        → Large reasoning model

Image/defect analysis
        → Multimodal model
```

The idea is **not to use the largest model for every request**.

---

### 2. Route based on required capability

Before selecting a model, I check requirements such as:

```text
Need tool calling?       → Tool-capable model
Need vision?             → Multimodal model
Need long context?      → Long-context model
Need complex reasoning? → More capable model
Simple classification?  → Smaller model
```

For CWD, this is especially important because Workers may need to call **MCP tools**.

---

### 3. Route based on cost and latency

For a high-volume simple task:

```text
Small model
→ lower cost
→ lower latency
```

For a complex request:

```text
Large model
→ higher reasoning capability
→ potentially higher cost/latency
```

So the router considers the business SLA.

---

### 4. Route based on availability

The router can also perform:

```text
Primary model
      ↓
Available?
  ↙       ↘
YES       NO
 ↓         ↓
Use it   Fallback model
```

For example, if an Azure OpenAI deployment is throttled or unavailable, the router can select another approved deployment/model.

---

### 5. Example: CWD Customer Briefing

Suppose the user asks:

> "Give me a complete briefing for customer C123, including sales status and open service issues."

The Coordinator identifies:

```text
Intent = Customer Briefing
Customer = C123
Complexity = High
Multiple Workers = Yes
Tool calls = Required
```

The router may select a more capable model.

Then:

```text
Coordinator
    ↓
Model Router
    ↓
Large reasoning model
    ↓
Sales Delegator
    ↓
Sales Workers → MCP → Salesforce

Service Delegator
    ↓
Service Workers → MCP → ServiceNow

Results
    ↓
Coordinator
    ↓
Large model synthesizes final briefing
```

---

## Simple implementation idea

```python
def select_model(task):

    if task.requires_vision:
        return "vision-model"

    if task.requires_complex_reasoning:
        return "large-model"

    if task.requires_tool_calling:
        return "tool-capable-model"

    if task.type in ["classification", "extraction"]:
        return "small-model"

    return "default-model"
```

In production, I would make this **configuration/policy driven**, not hard-code everything.

For example:

```text
Task
 ↓
Capability requirements
 ↓
Model registry
 ↓
Policy checks
 ↓
Available models
 ↓
Quality / latency / cost
 ↓
Selected model
```

---

### 🎯 Strong interview answer

> **“I use a model router between the application and the LLM providers. The router evaluates the task type, complexity, required capabilities such as tool calling or vision, context requirements, latency and cost targets, and model availability. For CWD, simple classification or extraction can use a smaller model, while complex customer briefings and multi-step reasoning use a more capable model. If the preferred deployment is unavailable, the router can select a prevalidated fallback. We validate routing decisions using a golden evaluation dataset and production metrics such as quality, latency, cost, and tool-call success.”**

### Easy memory trick

**Task → Capability → Quality → Latency → Cost → Availability → Model**

Key interview line:

> **“The model router chooses the model based on what the task needs, not simply on which model is the largest.”**
