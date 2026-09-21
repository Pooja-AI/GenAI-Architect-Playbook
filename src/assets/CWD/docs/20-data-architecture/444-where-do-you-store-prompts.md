## Where do you store prompts?

In CWD, I store **prompts in a centralized Prompt Registry**, separate from workflow state and conversation data.

```text
                    Prompt Registry
                         ↓
             ┌───────────┼───────────┐
             ↓           ↓           ↓
        Coordinator   Delegator    Worker
             ↓
          Load prompt
             ↓
           LLM
```

### 1. What do I store?

For example, the Incident Worker might have:

```json
{
  "prompt_id": "incident_worker_prompt",
  "prompt_version": "v5",
  "agent_id": "incident_worker",
  "system_prompt": "...",
  "model": "approved-model",
  "parameters": {
    "temperature": 0.1
  },
  "status": "ACTIVE",
  "created_by": "team",
  "created_at": "...",
  "approved": true
}
```

I also maintain versions:

```text
incident_worker_prompt
    ├── v1
    ├── v2
    ├── v3
    ├── v4
    └── v5  ← production
```

---

### 2. Where exactly?

For your CWD Azure architecture, I would use a **centralized Prompt Registry/configuration store**.

For example:

```text
Prompt Registry
      ↓
Cosmos DB / configuration store
```

A dedicated prompt-management solution can also be used if the organization has one.

The key architectural principle is:

> **Prompts are versioned configuration, not hardcoded application logic.**

---

### 3. Why not hardcode prompts?

Instead of:

```python
system_prompt = "You are an incident agent..."
```

inside the Worker code, I prefer:

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
Prompt v5
  ↓
LLM
```

This allows us to change a prompt without changing the Worker implementation.

---

### 4. Prompt versioning is very important

Suppose production is running:

```text
Agent: incident_worker
Prompt: v5
Model: model-A
```

After deploying a new prompt:

```text
Agent: incident_worker
Prompt: v6
Model: model-A
```

If quality decreases, we can roll back:

```text
v6 ❌
 ↓
v5 ✅
```

This is especially important for **LLM evaluation and production troubleshooting**.

---

### 5. Prompt + Agent + Model versions

I keep the versions together in telemetry:

```text
workflow_id = WF-1001
agent_id = incident_worker
agent_version = v3
prompt_version = v5
model_version = m2
```

So when an answer is wrong, I can investigate:

> Which Agent, prompt, and model generated this response?

This also allows us to compare prompt versions using the same golden evaluation dataset.

---

### 6. Don't store secrets inside prompts

I don't put:

```text
❌ API keys
❌ passwords
❌ access tokens
❌ private keys
❌ database credentials
```

inside prompts.

Secrets are handled separately through **Key Vault / Managed Identity**.

Also, I avoid putting unnecessary sensitive enterprise data directly into a reusable prompt template.

---

## 🎯 Interview-ready answer

> **“In CWD, I store prompts in a centralized Prompt Registry backed by a durable configuration store. Prompts are treated as versioned configuration rather than hardcoded inside Workers. Each prompt has a prompt ID, version, associated Agent, model configuration, parameters, approval status, and lifecycle information. At runtime, the Worker or Coordinator retrieves the approved prompt version and sends it to the LLM. I capture the prompt version, Agent version, and model version in telemetry so we can reproduce issues, perform regression evaluation, and roll back a prompt safely. I also never store secrets such as API keys or access tokens inside prompts.”**

### Easy memory

**Prompt Registry → Version → Approve → Load → LLM → Track → Evaluate → Rollback**

> **Strong interview line:**
> **“Prompts are production configuration, so I version, govern, evaluate, and audit them just like application code.”**
