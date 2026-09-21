## When would you use a smaller model?

I use a **smaller model when the task is simple, well-defined, and doesn't require complex reasoning**, as long as it meets the required quality and safety threshold.

### In CWD, good use cases are:

| Task                  | Why smaller model?                      |
| --------------------- | --------------------------------------- |
| Intent classification | Simple classification                   |
| Entity extraction     | Extract `customer_id`, dates, IDs, etc. |
| Simple routing        | Low reasoning requirement               |
| Basic summarization   | Straightforward transformation          |
| Query rewriting       | Usually predictable                     |
| Simple RAG response   | When context is clear                   |
| Structured extraction | Fixed schema                            |
| Simple validation     | Often deterministic is even better      |

### CWD example

User asks:

> **“Show me the open incidents for customer C12345.”**

The Coordinator needs to identify:

```text
Intent = Customer Incidents
customer_id = C12345
```

This doesn't require a large reasoning model.

```text id="1gr3z8"
User
 ↓
Coordinator
 ↓
Small Model
 ├── Intent → customer_incidents
 └── customer_id → C12345
 ↓
IT Delegator
 ↓
Incident Worker
 ↓
MCP
 ↓
ServiceNow
```

A stronger model would add cost and latency without necessarily adding useful capability.

---

### When I would NOT use a smaller model

I would use a stronger model when the task requires:

* Complex multi-step reasoning
* Ambiguous requirements
* Complex planning
* Multi-source synthesis
* Difficult tool-selection decisions
* Complex analysis
* Tasks where evaluation shows the smaller model doesn't meet quality requirements

For example:

> **“Analyze the customer's sales history, open incidents, product failures, and recommend the most likely business risks.”**

That requires more reasoning and cross-source synthesis, so I may route it to a stronger model.

---

### Important: don't use an LLM if deterministic logic is enough

This is a strong architect point.

For example:

```text id="v4x5h5"
customer_id format validation
        ↓
Python / schema validation
        ↓
No LLM required
```

Similarly, authorization should be handled by the security/policy layer, **not by a smaller or larger LLM**.

---

## 🎯 Interview-ready answer

> **“I use a smaller model when the task is simple, well-defined, and doesn't require complex reasoning—for example intent classification, entity extraction, query rewriting, basic summarization, or simple RAG responses. In CWD, if the user asks for open incidents for customer C12345, a smaller model can identify the intent and customer ID, and then the Incident Worker retrieves the data through MCP. I first validate the smaller model against our golden dataset and use it only when it meets the required quality, safety, and latency thresholds. If deterministic logic can solve the task, such as schema validation or authorization, I avoid using an LLM altogether.”**

### Easy memory

**Simple task → Smaller model**
**Complex reasoning → Stronger model**
**Deterministic task → No LLM**
