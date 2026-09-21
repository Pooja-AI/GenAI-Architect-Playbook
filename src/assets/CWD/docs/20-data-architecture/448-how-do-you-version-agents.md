## How do you version Agents?

In CWD, I version Agents using an **immutable Agent definition + Agent Registry**. I create a new Agent version whenever its behavior, tools, workflow logic, model, or configuration changes.

```text
Agent Registry
      │
      ├── incident_worker:v1
      ├── incident_worker:v2
      ├── incident_worker:v3  ← Production
      └── incident_worker:v4  ← Candidate
```

### 1. What makes an Agent version different?

For example, `incident_worker:v3` might have:

```json
{
  "agent_id": "incident_worker",
  "agent_version": "v3",
  "prompt_version": "v5",
  "model_version": "m2",
  "tools": [
    "servicenow.get_incidents"
  ],
  "workflow_version": "w3",
  "max_tool_calls": 5,
  "timeout_seconds": 10
}
```

If I change the tool set, prompt, model, workflow logic, or important runtime behavior, I create a new version.

---

### 2. Agent version is more than code version

This is important.

An Agent's behavior can depend on several components:

```text
Agent Version
   ├── Agent code/workflow
   ├── Prompt version
   ├── Model version
   ├── Tool/MCP configuration
   ├── Guardrails
   └── Runtime configuration
```

For example:

```text
incident_worker:v4
    ↓
prompt:v6
model:m3
tool-config:tc5
workflow:w4
```

I record these versions together.

---

### 3. Evaluate before production

Suppose I create:

```text
incident_worker:v4
```

I evaluate it against the same golden dataset used for the existing version.

```text
v3 ──┐
     ├── Golden Dataset → Compare
v4 ──┘
```

I look at:

* task completion
* tool-call accuracy
* groundedness
* hallucination rate
* routing behavior
* latency
* token usage
* cost
* failure/retry rate

Only an approved version is promoted to production.

---

### 4. Don't overwrite the existing Agent

Instead of:

```text
incident_worker:v3
       ↓
modify it ❌
```

I use:

```text
incident_worker:v3  ← existing
incident_worker:v4  ← new candidate
```

This gives me reproducibility and rollback.

---

### 5. Runtime version pinning

The production deployment explicitly uses a version:

```python
agent = agent_registry.get(
    agent_id="incident_worker",
    version="v3"
)
```

Telemetry records:

```text
workflow_id      = WF-1001
agent_id         = incident_worker
agent_version   = v3
prompt_version  = v5
model_version   = m2
```

Now if a production response is incorrect, I can reproduce the exact Agent configuration.

---

### 6. Rollback

Suppose v4 has a regression:

```text
v3 → Production
v4 → Candidate
       ↓
    Evaluation
       ↓
   Regression ❌
```

I keep v3 available and route traffic back to it.

```text
v4 ❌
 ↓
v3 ✅
```

No need to rebuild the entire CWD workflow.

---

## 🎯 Interview-ready answer

> **“In CWD, I version Agents through a centralized Agent Registry. Each Agent has an immutable version that captures its Agent implementation or workflow version, prompt version, model version, allowed MCP tools, guardrails, and important runtime configuration. Whenever I make a behaviorally significant change, I create a new Agent version rather than modifying the production version in place. I evaluate the new version against the same golden dataset for task completion, tool-call accuracy, groundedness, hallucination rate, latency, token usage, cost, and reliability. Once approved, I promote it to production while retaining the previous version for rollback. At runtime, I record the Agent, prompt, model, and tool versions with the workflow and trace IDs for reproducibility and auditability.”**

### Easy memory

**Agent change → New version → Evaluate → Approve → Deploy → Monitor → Rollback**

> **Strong interview line:** **“I version the Agent as a complete behavioral unit—not just its code—because prompt, model, tools, and workflow logic can all change Agent behavior.”**
