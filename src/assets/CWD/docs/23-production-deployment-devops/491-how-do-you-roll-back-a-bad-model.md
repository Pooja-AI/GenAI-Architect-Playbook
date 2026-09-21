## How do you roll back a bad model?

In CWD, I treat the **LLM/model as a versioned production dependency**, just like code and prompts. I don't simply change the model name in production without evaluation.

Suppose the current model is healthy:

```text
Customer Briefing Agent
        ↓
Model v1
```

I deploy a new model:

```text
Model v2  ← new
```

If v2 causes quality or reliability regressions, I switch production traffic back to v1.

### Rollback flow

```text
Model v2
   ↓
Regression detected
   ↓
Stop rollout
   ↓
Route traffic back to Model v1
   ↓
Verify metrics
   ↓
Keep v2 disabled
   ↓
Investigate and fix
```

### 1. Detect the problem

I monitor both technical and GenAI metrics:

```text
Task completion ↓
Groundedness ↓
Tool-call accuracy ↓
Hallucination ↑
P95 latency ↑
Token usage ↑
Cost ↑
Safety violations ↑
```

For example:

```text
Model v1 → Task completion: 94%
Model v2 → Task completion: 81%
```

That would trigger investigation/rollback according to the predefined release thresholds.

---

### 2. Stop the canary

If I deployed v2 using canary:

```text
Model v1 → 95%
Model v2 → 5%
```

I stop increasing v2 traffic.

If the regression is significant:

```text
Model v1 → 100%
Model v2 → 0%
```

---

### 3. Switch the active model

I keep model configuration outside the application code.

For example:

```json
{
  "agent_id": "customer_briefing_agent",
  "model": "approved-model-v1",
  "model_version": "v1"
}
```

Rollback means changing the approved deployment/configuration back to v1.

The exact mechanism depends on the model platform—for example, the Azure OpenAI deployment configuration or the model-routing layer.

---

### 4. Verify after rollback

I don't assume rollback worked just because traffic changed.

I verify:

```text
API error rate
Task completion
Groundedness
Tool-call success
Hallucination
P95/P99 latency
Token consumption
Cost
Safety metrics
```

I also run the relevant **golden evaluation dataset**.

---

### 5. Preserve model versions

I don't delete v2.

I record:

```text
Agent Version
Prompt Version
Model Version
MCP Version
RAG Index Version
Evaluation Dataset Version
```

For example:

```json
{
  "agent_version": "2.4",
  "prompt_version": "3.1",
  "model_version": "v2",
  "mcp_version": "1.8",
  "rag_index_version": "2026-09-20"
}
```

This makes the failure reproducible.

---

## Important: Long-running CWD workflows

Suppose a workflow started with Model v1:

```text
WF-1001
Model = v1
Status = RUNNING
```

Then I deploy v2 and later roll it back.

I don't arbitrarily change WF-1001 to v2 or another model halfway through.

I persist the model configuration with the workflow:

```json
{
  "workflow_id": "WF-1001",
  "agent_version": "2.3",
  "prompt_version": "3.1",
  "model_version": "v1"
}
```

That provides **reproducibility and consistent behavior** for the workflow.

For new workflows, the active approved model is used.

---

## What if the model itself is unavailable?

That's slightly different from a **bad model**.

If the model endpoint is unavailable:

```text
Model timeout / 5xx / throttling
        ↓
Retry with bounded backoff
        ↓
Circuit breaker
        ↓
Approved fallback model
```

A fallback model should already be **evaluated and approved**. I wouldn't dynamically switch to an arbitrary model simply because the primary model failed.

---

## Model rollback vs prompt rollback

| Problem             | Rollback                 |
| ------------------- | ------------------------ |
| Bad prompt          | Previous prompt version  |
| Bad model           | Previous approved model  |
| Bad Agent code      | Previous container/image |
| Bad MCP integration | Previous MCP version     |
| Bad RAG index       | Previous approved index  |

Sometimes the issue is caused by an incompatible combination, so I roll back the **entire approved configuration bundle** rather than only one component.

---

## Interview-ready answer

> **“I treat model changes as versioned production releases. Before production, I evaluate the new model against the same golden dataset and then deploy it gradually using canary traffic. In production I monitor task completion, groundedness, hallucination, tool-call accuracy, latency, token usage, cost and safety metrics. If the new model shows regression, I stop the rollout and route traffic back to the last approved model. I verify the rollback with both production metrics and regression tests. I also persist the model version with each workflow so long-running workflows remain reproducible. The failed model remains registered for investigation rather than being deleted.”**

### Easy memory

**Evaluate → Canary → Monitor → Detect → Roll back → Verify → Investigate**

### Strong interview line

> **“A model upgrade is a production change, not just a configuration change, so I use evaluation, controlled rollout, observability and fast rollback.”**
