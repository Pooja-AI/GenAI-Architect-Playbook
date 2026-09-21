## How do you version prompts?

In CWD, I treat **prompts as versioned production artifacts**, similar to code and model configurations. Every prompt change gets a new version and goes through evaluation before production.

### 1. Give every prompt a unique ID and version

For example:

```text
customer_briefing_prompt
    ├── v1.0
    ├── v1.1
    └── v2.0
```

A registry record could look like:

```json
{
  "prompt_id": "customer_briefing",
  "version": "2.0",
  "agent_id": "customer_worker",
  "model": "customer-briefing-prod",
  "status": "APPROVED"
}
```

---

### 2. Store prompts outside the Agent code

I don't hardcode the production prompt inside the Worker:

```python
# Avoid
prompt = "You are a customer briefing agent..."
```

Instead:

```text
Customer Worker
      ↓
Prompt ID + Version
      ↓
Prompt Registry
      ↓
Approved Prompt
      ↓
LLM
```

The Prompt Registry can use a version-controlled repository for authoring/review and a runtime configuration store for approved production prompts.

---

### 3. Every change creates a new version

For example:

```text
v1.0 → v1.1
```

If I change instructions, output format, guardrails, examples, or other behavior-affecting content, I create a new version rather than overwriting v1.0.

That gives me:

```text
v1.0 → previous production
v1.1 → candidate
```

and makes rollback easy.

---

### 4. Evaluate the new prompt

Before deploying `v1.1`, I run the same golden dataset against both versions.

```text
              Golden Dataset
                 /       \
              v1.0       v1.1
                 \       /
                  Compare
```

I evaluate:

* Groundedness
* Answer relevance
* Hallucination
* Task completion
* Tool-call accuracy
* Safety
* Latency
* Token usage
* Cost

If the new prompt causes unacceptable regression, I don't promote it.

---

### 5. Deploy through environments

```text
Prompt v1.1
    ↓
DEV
    ↓
Evaluation
    ↓
QA / Staging
    ↓
Approval
    ↓
Production
```

For production, I can use a controlled rollout rather than immediately switching every request.

---

### 6. Track prompt version in every workflow

For example:

```json
{
  "workflow_id": "WF-1001",
  "agent_id": "customer_worker",
  "agent_version": "2.3",
  "prompt_id": "customer_briefing",
  "prompt_version": "1.1",
  "model_version": "2026-08"
}
```

This is important for troubleshooting.

If someone asks:

> "Why did the Customer Briefing behavior change?"

I can determine exactly which prompt and model were used.

---

### 7. Pin the prompt for long-running workflows

Suppose:

```text
WF-1001
Prompt = v1.1
```

is already running.

Tomorrow I deploy:

```text
Prompt = v1.2
```

I don't want WF-1001 to unexpectedly switch prompts halfway through its execution.

So the workflow state keeps the prompt version:

```text
WF-1001
 ├── Agent v2.3
 ├── Prompt v1.1
 └── Model 2026-08
```

New workflows can use v1.2 according to the rollout policy.

---

### 8. Rollback

If production monitoring shows a regression:

```text
v1.2
 ↓
Regression
 ↓
Rollback
 ↓
v1.1
```

Because v1.1 was never overwritten, rollback is straightforward.

---

## Prompt versioning vs Git versioning

Git tells me **what changed in the source**.

Prompt versioning tells me **which prompt behavior was actually approved and used in production**.

I use both.

```text
Git
 ↓
Prompt change
 ↓
Review
 ↓
Evaluation
 ↓
Prompt Registry
 ↓
Approved version
```

---

## Interview-ready answer

> **“I version prompts independently rather than hardcoding them inside the Agent. Each prompt has a unique prompt ID and immutable version. Prompt changes go through Git review, golden-dataset evaluation, security and regression testing, and then promotion through Dev, QA and production. I record the prompt version along with the Agent and model versions for complete traceability. For long-running workflows, I persist the prompt version so the workflow remains reproducible even when a newer prompt is deployed. If the new prompt causes a regression, I can roll back to the previous approved version.”**

### Easy memory

**Prompt = ID → Version → Evaluate → Approve → Deploy → Monitor → Rollback**

### Strong interview line

> **“I never overwrite a production prompt; I create a new version so every Agent response is reproducible and auditable.”**
