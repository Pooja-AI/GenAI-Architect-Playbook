## How do you roll back a bad prompt?

In CWD, I **never overwrite the existing production prompt**. Every prompt is immutable and versioned, so if a new prompt causes a regression, I can quickly switch the Agent back to the last approved version.

### Example

Suppose production is:

```text id="n8v4k2"
Customer Briefing Worker
        ↓
Prompt v3.1  ← current production
```

I deploy:

```text id="r5m2x7"
Prompt v3.2  ← new version
```

After deployment, monitoring shows increased hallucination or reduced task completion.

### Rollback flow

```text id="w7p3q9"
Prompt v3.2
     ↓
Regression detected
     ↓
Disable / stop rollout
     ↓
Activate Prompt v3.1
     ↓
Verify metrics
     ↓
Continue production with v3.1
```

### 1. Detect the regression

I monitor both technical and GenAI metrics:

```text id="a6k4m1"
Groundedness ↓
Task completion ↓
Tool-call accuracy ↓
Hallucination ↑
Latency ↑
Token usage ↑
Cost ↑
```

For example:

```text id="t3q8v6"
v3.1 → Task completion = healthy
v3.2 → Task completion = regression
```

---

### 2. Stop further rollout

If I'm doing a canary:

```text id="y5r9c2"
Prompt v3.1 → 95%
Prompt v3.2 → 5%
```

I immediately stop increasing v3.2 traffic.

If necessary:

```text id="m4k7p1"
v3.1 → 100%
v3.2 → 0%
```

---

### 3. Change the active prompt version

The Agent configuration points back to the previously approved version:

```json id="j6x2v8"
{
  "prompt_id": "customer_briefing",
  "active_version": "3.1"
}
```

I don't need to rebuild the Agent container for a prompt-only rollback if prompt configuration is independently managed.

---

### 4. Verify the rollback

After switching back, I verify:

```text id="c8m3r5"
API errors
Task completion
Groundedness
Tool success
Latency
Token usage
Cost
```

I also run a targeted regression/golden dataset to confirm the bad behavior is no longer present.

---

### 5. Investigate v3.2

I keep v3.2 for investigation rather than deleting it.

```text id="p7n2w4"
Prompt v3.2
   ↓
Root-cause analysis
   ↓
Fix
   ↓
Create v3.3
   ↓
Evaluate
   ↓
Canary
```

This preserves auditability.

---

## Important: Long-running workflows

Suppose:

```text id="e5x8m2"
WF-1001
Prompt = v3.1
```

was already running when v3.2 was deployed.

I keep the workflow's prompt version pinned:

```json id="v2q9k7"
{
  "workflow_id": "WF-1001",
  "agent_version": "2.3",
  "prompt_version": "3.1",
  "status": "RUNNING"
}
```

So the new deployment doesn't unexpectedly change the behavior of an already-running workflow.

New workflows can use the rolled-back production version according to the deployment policy.

---

## Prompt rollback vs code rollback

This is a good interview distinction:

```text
Prompt-only problem
       ↓
Rollback prompt version
       ↓
No application rebuild required
```

But if the problem is in Agent code:

```text
Agent code problem
       ↓
Rollback container/image
       ↓
Previous Agent version
```

If the problem involves **prompt + model + code compatibility**, I roll back the complete compatible configuration.

---

## Interview-ready answer

> **“I treat prompts as immutable, versioned production artifacts. If a new prompt causes a regression, I stop the rollout and change the active prompt configuration back to the last approved version. Because the prompt is independently versioned, I don't need to rebuild the Agent for a prompt-only rollback. I then verify task completion, groundedness, tool-call accuracy, hallucination, latency, tokens and cost, and run targeted regression tests. I keep the bad version for root-cause analysis and create a new version after fixing the issue. For long-running workflows, I persist the prompt version with the workflow state so an in-progress workflow remains reproducible.”**

### Easy memory

**Detect → Stop → Revert → Verify → Investigate → Fix → Re-evaluate**

### Strong interview line

> **“I don't delete a bad prompt—I deactivate it and roll back to the last known-good immutable version.”**
