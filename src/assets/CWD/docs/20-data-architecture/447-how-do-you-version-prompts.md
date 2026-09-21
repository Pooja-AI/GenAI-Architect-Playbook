## How do you version prompts?

In CWD, I use **explicit prompt versions** and treat prompts like production configuration.

```text id="v9q2ks"
Prompt Registry
      │
      ├── incident_worker_prompt v1
      ├── incident_worker_prompt v2
      ├── incident_worker_prompt v3
      ├── incident_worker_prompt v4
      └── incident_worker_prompt v5  ← Production
```

### 1. Give every prompt a version

For example:

```json
{
  "prompt_id": "incident_worker_prompt",
  "version": "v5",
  "agent_id": "incident_worker",
  "model": "approved-model",
  "status": "ACTIVE"
}
```

When I change the prompt, I create **v6**, rather than overwriting v5.

---

### 2. What causes a new version?

I create a new version when I change things such as:

* System instructions
* Role/behavior
* Output format
* Tool-use instructions
* Guardrails
* RAG instructions
* Few-shot examples
* Response constraints

For example:

```text
v5 → Current production prompt

Change:
"Always provide incident severity."

        ↓

v6 → New candidate
```

---

### 3. Evaluate before production

I don't immediately deploy v6.

```text id="q7x4mz"
Prompt v6
    ↓
Golden Dataset
    ↓
Evaluation
    ↓
Quality / Groundedness / Hallucination
Tool accuracy / Latency / Tokens / Cost
    ↓
Approval
    ↓
Production
```

I compare v6 against the existing production version using the **same test cases**.

---

### 4. Keep the old version

I don't delete v5 after deploying v6.

```text
v5 → previous production
v6 → current production
```

This gives me:

* rollback
* reproducibility
* auditability
* regression analysis
* A/B or shadow testing

---

### 5. Pin the version at runtime

A Worker should know exactly which prompt version it is using.

```python
prompt = prompt_registry.get(
    prompt_id="incident_worker_prompt",
    version="v6"
)
```

Telemetry records:

```text
workflow_id = WF-1001
agent_id = incident_worker
agent_version = v3
prompt_version = v6
model_version = m2
```

So if someone asks:

> **"Why did this response change?"**

I can identify the exact Agent, prompt, and model versions.

---

### 6. Rollback

Suppose v6 causes a regression:

```text id="4o8s1x"
v6
 ↓
Quality regression
 ↓
Rollback
 ↓
v5
```

Because v5 still exists in the registry, rollback is straightforward.

---

## 🎯 Interview-ready answer

> **“I version prompts explicitly in the Prompt Registry and never overwrite the production prompt. Every prompt has a unique prompt ID and version, such as `incident_worker_prompt:v5`. When I modify instructions, tool-use behavior, output format, or guardrails, I create a new version. Before production, I evaluate the new version against the same golden dataset and compare quality, groundedness, hallucination rate, tool-call accuracy, latency, token usage, and cost. Once approved, I deploy the new version while retaining the previous version for rollback. At runtime, I pin the prompt version and record it along with the Agent and model versions in telemetry so production behavior is reproducible and auditable.”**

### Easy memory

**Change → New Version → Evaluate → Approve → Deploy → Monitor → Rollback**

**Strong interview line:**

> **“I never silently modify a production prompt; every meaningful prompt change creates a new version that can be evaluated, traced, and rolled back.”**
