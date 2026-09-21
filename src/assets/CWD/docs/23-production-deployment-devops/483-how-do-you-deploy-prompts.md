## How do you deploy prompts?

In CWD, I **treat prompts as versioned production artifacts**, not as hardcoded strings inside Python code.

### CWD prompt deployment flow

```text
Developer
   ↓
Prompt Change
   ↓
Git / Prompt Registry
   ↓
Review
   ↓
Golden Dataset Evaluation
   ↓
Security / Regression Tests
   ↓
DEV
   ↓
QA / Staging
   ↓
Approval
   ↓
Production
   ↓
Monitor
   ↓
Rollback if needed
```

### 1. Store prompts separately

Instead of:

```python
prompt = "You are a customer briefing agent..."
```

inside the Worker code, I maintain a versioned prompt:

```text
customer_briefing_prompt
    ├── v1.0
    ├── v1.1
    └── v2.0
```

A prompt configuration might contain:

```json
{
  "prompt_id": "customer_briefing",
  "version": "2.1",
  "model": "gpt-4.x",
  "temperature": 0.1,
  "max_tokens": 2000,
  "status": "approved"
}
```

The actual model/version depends on the production configuration.

---

### 2. Prompt Registry

I use a centralized **Prompt Registry** so Workers don't each maintain their own copy.

```text
Customer Briefing Worker
        ↓
Prompt ID + Version
        ↓
Prompt Registry
        ↓
Approved Prompt
        ↓
Azure OpenAI
```

The registry could be implemented using a configuration store such as Cosmos DB, with Git as the source-controlled authoring/review layer.

---

### 3. Evaluate before deployment

Suppose I change:

```text
customer_briefing_prompt v1.0
                ↓
customer_briefing_prompt v1.1
```

I run the same golden dataset against both versions.

I evaluate:

```text
Groundedness
Answer relevance
Hallucination
Tool selection
Task completion
Latency
Token usage
Cost
Safety
```

If v1.1 causes unacceptable regression, **I don't promote it**.

---

### 4. Deploy through environments

```text
Prompt v1.1
    ↓
DEV
    ↓
Automated evaluation
    ↓
QA / Staging
    ↓
Approval
    ↓
Production
```

The prompt is promoted independently or together with the Agent version, depending on how tightly coupled the change is.

---

### 5. Runtime resolution

The Worker doesn't need to know the complete prompt.

It requests:

```python
prompt = prompt_registry.get(
    prompt_id="customer_briefing",
    version="2.1"
)
```

Then:

```python
response = await llm.generate(
    prompt=prompt,
    context=validated_context
)
```

This gives us centralized prompt management.

---

### 6. Don't blindly change production prompts

For production, I use controlled rollout:

```text
v2.1
 ↓
Canary
 ↓
Monitor
 ↓
Gradual rollout
```

For example, a small portion of eligible traffic can use the new prompt while the existing version remains available.

I monitor:

* Task completion
* Groundedness
* Hallucination
* Tool-call success
* Latency
* Token usage
* Cost
* Error rate

---

### 7. Prompt rollback

Because every prompt is versioned:

```text
Production
    ↓
Prompt v2.1
    ↓
Regression detected
    ↓
Rollback
    ↓
Prompt v2.0
```

No code rollback is necessarily required for a prompt-only change.

---

### 8. Auditability

For every LLM request, I record metadata such as:

```json
{
  "workflow_id": "WF-1001",
  "worker_id": "customer_worker",
  "prompt_id": "customer_briefing",
  "prompt_version": "2.1",
  "model_version": "production-model",
  "timestamp": "..."
}
```

This is extremely useful when someone asks:

> **“Why did the Agent produce this answer yesterday but a different answer today?”**

I can identify the exact prompt/model/configuration used.

---

## Important interview distinction

### Prompt deployment ≠ code deployment

You can have:

```text
Agent Code v5
Prompt v2.1
Model v3
MCP Contract v1.4
RAG Index v8
```

These versions should be traceable together.

For a long-running workflow, I also prefer to **pin the prompt/agent version used by that workflow**, so a workflow doesn't unexpectedly change behavior halfway through execution.

---

## Interview-ready answer

> **“I treat prompts as versioned production artifacts rather than hardcoding them inside the Worker. We maintain prompts in a centralized Prompt Registry with prompt ID, version, model configuration and approval status. Any prompt change goes through code review, golden-dataset evaluation, security and regression testing before promotion from Dev to QA and production. For production, I use controlled rollout and monitor groundedness, hallucination, task completion, tool-call success, latency, tokens and cost. Every request records the prompt and model versions for traceability, and because prompts are immutable and versioned, I can quickly roll back to the previous approved version if we see a regression.”**

### Easy memory

**Prompt = Version → Evaluate → Approve → Deploy → Monitor → Rollback**

### Strong interview line

> **“A prompt is a production dependency, so I version it, evaluate it, audit it, and roll it back just like code.”**
