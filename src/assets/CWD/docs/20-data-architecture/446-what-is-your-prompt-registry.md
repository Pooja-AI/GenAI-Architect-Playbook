## What is your Prompt Registry?

In CWD, the **Prompt Registry is a centralized place where I manage, version, approve, and retrieve prompts used by the Coordinator, Delegators, and Workers.**

Think of it as **source control + governance for production prompts**.

```text
                    Prompt Registry
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
    Coordinator      Delegator       Worker
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                        LLM
```

### What does my Prompt Registry contain?

For example, for the Incident Worker:

```json
{
  "prompt_id": "incident_worker_prompt",
  "version": "v5",
  "agent_id": "incident_worker",
  "system_prompt": "...",
  "model": "approved-model",
  "parameters": {
    "temperature": 0.1
  },
  "status": "ACTIVE",
  "approved_by": "AI-platform-team"
}
```

It can also maintain:

```text
prompt_id
prompt_version
agent_id
prompt_template
model
model_version
parameters
status
created_by
created_at
approved_by
```

---

## Why do I need a Prompt Registry?

Instead of hardcoding prompts inside Worker code:

```python
system_prompt = "You are an incident assistant..."
```

I retrieve the approved version:

```python
prompt = prompt_registry.get(
    prompt_id="incident_worker_prompt",
    version="v5"
)
```

Then:

```text
Worker
  ↓
Prompt Registry
  ↓
Approved Prompt v5
  ↓
LLM
```

This allows me to change the prompt **without changing the Worker implementation**.

---

## Versioning

Suppose production currently uses:

```text
incident_worker_prompt → v5
```

I create:

```text
v6 → evaluate → approve → production
```

If v6 causes quality problems:

```text
v6 ❌
 ↓ rollback
v5 ✅
```

This is very useful for **LLM evaluation, troubleshooting, and production rollback**.

---

## Prompt Registry + Evaluation

I don't promote a prompt just because it "looks better."

I run it against the same **golden evaluation dataset**:

```text
Prompt v5
    ↓
Golden Dataset
    ↓
Metrics

Prompt v6
    ↓
Golden Dataset
    ↓
Metrics
```

I compare things such as:

* answer quality
* groundedness
* hallucination rate
* tool-call accuracy
* task completion
* latency
* token usage
* cost

Then the approved version becomes the production version.

---

## Prompt Registry vs Agent Registry

This distinction is important:

| Agent Registry                | Prompt Registry                              |
| ----------------------------- | -------------------------------------------- |
| Defines **what the Agent is** | Defines **how the Agent should be prompted** |
| Capabilities                  | Prompt templates                             |
| Allowed tools                 | Prompt versions                              |
| Security scopes               | Prompt parameters                            |
| Agent version                 | Approval/lifecycle                           |
| Runtime limits                | Evaluation history                           |

Example:

```text
Agent Registry
     ↓
Incident Worker v3
     ↓
Prompt Registry
     ↓
Incident Prompt v5
     ↓
Azure OpenAI
     ↓
MCP
     ↓
ServiceNow
```

---

## What should NOT be in the Prompt Registry?

I don't put secrets in prompts:

```text
❌ API keys
❌ passwords
❌ access tokens
❌ private keys
❌ database credentials
```

Those are handled through **Managed Identity / Key Vault**.

I also avoid putting unnecessary customer-specific data into reusable prompt templates.

---

## 🎯 Interview-ready answer

> **“My Prompt Registry is a centralized, version-controlled repository for all production prompts used by CWD Agents. It stores the prompt ID, version, template, associated Agent, model configuration, parameters, approval status, and lifecycle information. At runtime, the Worker or Coordinator retrieves the approved prompt version and sends it to the LLM. Before promoting a new prompt, I evaluate it against a golden dataset for quality, groundedness, hallucination rate, tool-call accuracy, latency, tokens, and cost. Because prompts are versioned, I can reproduce production behavior and roll back safely if a new version causes regression. Secrets are never stored in prompts.”**

### Easy memory

**Create → Version → Evaluate → Approve → Deploy → Monitor → Rollback**

> **Strong interview line:** **“I treat prompts as production configuration: versioned, governed, evaluated, and independently deployable.”**
