## How do you control temperature?

**Temperature controls how much randomness the model uses when generating responses.** In CWD, I don't use one temperature for every task. I configure it based on the task's required **determinism vs creativity**.

### Simple idea

```text
Low Temperature
      ↓
More deterministic
More consistent
Less variation

High Temperature
      ↓
More random
More diverse
More creative
```

### CWD examples

| CWD Task                           | Temperature approach |
| ---------------------------------- | -------------------- |
| Intent classification              | Very low             |
| Entity extraction                  | Very low             |
| MCP tool arguments                 | Low                  |
| RAG question answering             | Low                  |
| Customer briefing                  | Low                  |
| Brainstorming / content generation | Higher               |
| Creative text                      | Higher               |

For example:

```text id="2w7xqa"
User Request
     ↓
Task Type
     ↓
Temperature Policy
     ↓
LLM
```

A configuration might look conceptually like:

```python id="9j2m4p"
temperature_policy = {
    "classification": 0.0,
    "extraction": 0.0,
    "tool_calling": 0.0,
    "rag_qa": 0.1,
    "customer_briefing": 0.2,
    "creative_generation": 0.7
}
```

These values are **illustrative starting points**, not universal best values.

### Why low temperature for CWD?

For enterprise workflows, we generally want:

* Consistent answers
* Reliable structured output
* Predictable tool calls
* Reproducible behavior
* Less unnecessary variation
* Better evaluation consistency

For example, if the Worker needs to call:

```text
get_customer(customer_id="C123")
```

we don't want unnecessary variation in the tool arguments.

### Important nuance

Temperature is **not a guarantee of deterministic behavior**. Even with low temperature, model outputs can vary depending on the model/service and other settings.

So I combine temperature with:

* Structured output/schema validation
* Tool parameter validation
* Guardrails
* Evaluation
* Prompt versioning
* Model/version controls

---

### 🎯 Strong interview answer

> **“I control temperature based on the task's determinism requirement. For CWD tasks such as classification, extraction, RAG, and MCP tool calling, I keep temperature very low because I want consistent and predictable behavior. For creative generation, I can increase it to allow more variation. I manage this through a task-based configuration rather than using one global temperature. I also don't rely on temperature alone; structured outputs, validation, guardrails, and evaluation provide additional control.”**

### Easy memory trick

**Low = Reliable**
**High = Creative**

Key interview line:

> **“For enterprise agentic workflows, I optimize temperature for predictability, not creativity.”**
