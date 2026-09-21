## How do you version models?

In CWD, I treat the **model as a versioned production dependency**. I don't simply change the model name in code and deploy it.

I track the **model ID/version + prompt version + Agent version + evaluation results** together.

### CWD model versioning flow

```text id="m3h8k2"
Model Version
     ↓
Golden Dataset Evaluation
     ↓
Compare with Current Model
     ↓
Approve
     ↓
Register Version
     ↓
Deploy to DEV
     ↓
QA / Staging
     ↓
Canary
     ↓
Production
     ↓
Monitor
     ↓
Rollback if needed
```

### 1. Record the exact model version

For example:

```json id="5p7n1a"
{
  "agent_id": "customer_worker",
  "agent_version": "2.3",
  "model_provider": "Azure OpenAI",
  "model_name": "production-model",
  "model_version": "2026-08",
  "prompt_version": "3.1",
  "mcp_version": "1.4"
}
```

The exact model identifier/version depends on what the provider exposes.

---

### 2. Keep model configuration outside Agent code

Instead of hardcoding:

```python id="q4n8x2"
model = "some-model-version"
```

I maintain configuration such as:

```yaml id="n5v3k9"
model:
  provider: azure_openai
  deployment: customer-briefing-prod
  version: "2026-08"
  temperature: 0.1
  max_tokens: 2000
```

This allows model changes without rewriting the Worker.

---

### 3. Evaluate the new model

Suppose production uses:

```text
Model A
```

and I want to move to:

```text
Model B
```

I run both against the **same golden dataset**.

```text id="v8k4q2"
             Golden Dataset
              /         \
          Model A      Model B
              \         /
               Compare
```

I compare:

* Task completion
* Answer relevance
* Groundedness
* Hallucination
* Tool selection
* Tool-call accuracy
* Safety
* Latency
* Token usage
* Cost

The goal isn't simply to select the model with the lowest cost or latency; I first establish that it meets the required quality and reliability thresholds.

---

### 4. Register the approved version

I maintain a model registry/configuration record:

```text id="c7m2x4"
Model
 ├── provider
 ├── model/deployment ID
 ├── version
 ├── evaluation result
 ├── approved status
 └── deployment status
```

For example:

```text
customer_worker
    ↓
model deployment: customer-briefing-prod
model version: 2026-08
status: APPROVED
```

---

### 5. Canary deployment

I don't immediately replace the production model for all traffic.

```text id="q6b1r8"
                Production
                    |
             ┌──────┴──────┐
             ↓             ↓
        Model A         Model B
        current          new
             \             /
              Monitor
```

I monitor the new model for:

```text
Task success
Groundedness
Hallucination
Tool failures
Latency
Token usage
Cost
Errors
```

If behavior is acceptable, I gradually increase traffic.

---

### 6. Rollback

If Model B causes a regression:

```text id="k8d4s2"
Model B
   ↓
Regression detected
   ↓
Rollback
   ↓
Model A
```

Because the previous model configuration remains registered, rollback is controlled.

---

### 7. Pin the model for long-running workflows

This is particularly important for your CWD architecture.

Suppose:

```text id="x5p9c3"
WF-1001 started
Model = Version A
```

Then tomorrow I deploy Version B.

I don't want WF-1001 to unexpectedly switch models halfway through execution.

So I persist:

```json id="r7m3k1"
{
  "workflow_id": "WF-1001",
  "agent_version": "2.3",
  "model_version": "2026-08",
  "prompt_version": "3.1",
  "status": "RUNNING"
}
```

The workflow continues using the pinned configuration, according to the platform's defined compatibility/migration policy.

---

## What exactly should you version?

For an Agentic AI system, I would track more than just the model:

```text id="u2k7m5"
Agent Version
      +
Model Version
      +
Prompt Version
      +
MCP/Tool Version
      +
RAG Index Version
      +
Evaluation Dataset Version
```

For example:

```text
Agent      = v2.3
Model      = 2026-08
Prompt     = v3.1
MCP        = v1.4
RAG Index  = v8
Eval Set   = v5
```

This gives you **reproducibility**.

---

## Model versioning vs model deployment

A useful interview distinction:

```text
Model
   ↓
Provider model/deployment
   ↓
Your application configuration
```

For example, the provider may expose a model through a deployment/endpoint. Your CWD configuration should record the deployment identifier and any provider-supported model/version metadata so you know exactly what was used.

---

## Interview-ready answer

> **“I treat the model as a versioned production dependency. I maintain the model or deployment identifier and provider-supported version metadata in configuration rather than hardcoding it in the Agent. Before promoting a new model, I evaluate it against the same golden dataset used for the current production model, comparing task completion, tool-call accuracy, groundedness, hallucination, safety, latency, tokens and cost. Once it passes the required evaluation gates, I deploy it through staging and a controlled canary rollout. I record the model version together with the Agent, prompt, MCP and RAG versions for traceability. For long-running CWD workflows, I persist the model configuration used by the workflow so it remains reproducible. If the new model regresses, I can roll back to the previous approved version.”**

### Easy memory

**Model versioning =**

**Record → Evaluate → Register → Canary → Monitor → Rollback**

### Strong interview line

> **“Model upgrades are production changes, so I treat them like software releases—with evaluation, controlled rollout, observability, and rollback.”**
