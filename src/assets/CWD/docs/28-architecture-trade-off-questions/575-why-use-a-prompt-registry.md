### Why use a Prompt Registry?

A **Prompt Registry** centrally manages and governs prompts used by agents and LLMs.

* **Version control** → track prompt v1, v2, v3.
* **Consistency** → agents use approved prompts.
* **Testing/evaluation** → compare prompts using the same evaluation dataset.
* **Rollback** → quickly return to a previous version if quality drops.
* **Governance** → track owner, purpose, approval, and usage.
* **Auditability** → know exactly which prompt version generated a response.

**In CWD:**

```text
Agent
  ↓
Prompt Registry
  ↓
Approved Prompt v3
  ↓
LLM
  ↓
Response
```

**Interview answer:**

> “We used a Prompt Registry to centrally manage prompt versions and governance. Each prompt has an owner, version, approval status, and evaluation results. At runtime, the agent retrieves the approved prompt version, and we can monitor its performance and quickly roll back if a new version causes quality or safety issues.”
