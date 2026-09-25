# How do you version model configurations?

## Short answer

I treat **model configuration as code/configuration**, store it in **Git**, assign a version, and promote it through **dev → QA → staging → production**.

This lets me know exactly **which model, prompt, parameters, and routing policy** produced a response and allows quick rollback.

---

## Key points

### 1. What do I version?

For each model configuration, I version:

```text
Model ID
Model provider
Region
Model parameters
Temperature
Max output tokens
System prompt version
Routing rules
Fallback model
Token limits
Timeout
Retry policy
Safety configuration
```

Example:

```yaml
version: "customer-briefing-v3"

primary_model: "model-A"
fallback_model: "model-B"

temperature: 0.2
max_output_tokens: 1500

timeout_seconds: 30
max_retries: 2

prompt_version: "customer-briefing-p12"
```

---

## 2. Store it in Git

For example:

```text
config/
 ├── models/
 │    ├── customer-briefing-v1.yaml
 │    ├── customer-briefing-v2.yaml
 │    └── customer-briefing-v3.yaml
 │
 ├── routing/
 │    └── model-routing-v4.yaml
 │
 └── prompts/
      ├── customer-briefing-p11.yaml
      └── customer-briefing-p12.yaml
```

Git gives me:

* Change history
* Code review
* Approval
* Auditability
* Rollback

---

## 3. Use immutable versions

I don't overwrite:

```text
customer-briefing-v2
```

with new values.

Instead:

```text
v2 → old configuration
v3 → new configuration
```

This is important because I can reproduce what happened with an older production request.

---

## 4. Version more than the model ID

A common mistake is thinking:

> "Model version = model ID."

For GenAI applications, the actual behavior depends on several things:

```text
Model
+
Prompt
+
Parameters
+
RAG configuration
+
Tool configuration
+
Routing policy
```

So I track these versions together.

Example:

```text
Run R123

Model:        model-A-v3
Prompt:       prompt-v12
RAG config:   rag-v5
Router:       router-v4
```

Now the response is reproducible/auditable at the configuration level.

---

# 5. Promote through environments

I use:

```text
Git
 ↓
Dev
 ↓
QA
 ↓
Staging
 ↓
Production
```

Example:

```text
model-v4
   ↓
Automated evaluation
   ↓
QA
   ↓
Staging
   ↓
Canary
   ↓
Production
```

---

# 6. Combine versioning with evaluation

Before promoting a new model configuration, I run a golden test set.

```text
Model Config v3
       ↓
Golden Dataset
       ↓
Quality Evaluation
       ↓
Latency
       ↓
Cost
       ↓
Tool-call accuracy
       ↓
Groundedness
       ↓
Approval
       ↓
Production
```

This prevents a configuration change from reaching production just because it passed a basic deployment test.

---

# 7. Rollback becomes easy

Suppose:

```text
Production → Config v5
```

After deployment:

```text
P95 latency ↑
Groundedness ↓
Cost ↑
```

I can simply route back:

```text
v5
 ↓
Rollback
 ↓
v4
```

No code change in the Worker is required.

---

# CWD example

For the **Customer Briefing Worker**:

```text
Customer Briefing Config v7

Model:
    Claude Sonnet-class

Prompt:
    customer-briefing-p15

Temperature:
    0.2

Max tokens:
    1500

Fallback:
    Nova Pro-class

RAG:
    rag-config-v6
```

The execution metadata can record:

```text
Run ID: R12345
Model Config: v7
Prompt: p15
RAG Config: v6
Router Config: v4
```

So later, if someone asks:

> "Why did this customer briefing produce this response?"

we can identify the configuration used for that run.

---

# 🎯 Strong interview answer

> **“I version model configuration as code. I store model IDs, parameters, prompts, routing rules, fallback models, token limits and timeout policies in Git with immutable versions. Changes go through code review, automated evaluation and environment promotion from dev to QA to staging and production. For GenAI, I version the model together with the prompt, routing and RAG configuration because they collectively affect application behavior. I also record the configuration version with every CWD run, which gives us auditability, reproducibility and fast rollback if a new configuration causes quality, latency or cost problems.”**

## Easy memory trick

**Git → Version → Evaluate → Promote → Track → Rollback**

> **“Version the configuration, not just the model.”**

### Key distinction

**Model version** = which foundation model/version was used.

**Model configuration version** = model + parameters + prompt + routing + fallback + related settings.

For a production GenAI system, I care about the **complete configuration version** because changing the prompt or routing policy can change behavior even when the underlying model stays the same.
