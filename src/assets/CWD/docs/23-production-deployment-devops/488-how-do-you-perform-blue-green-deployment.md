## How do you perform blue-green deployment?

**Blue-green deployment** means I maintain **two production environments**:

* **Blue** = current stable version
* **Green** = new version

I deploy and test the new version in Green **without disturbing Blue**. Once Green is validated, I switch traffic from Blue to Green.

### CWD example

Suppose CWD currently runs:

```text id="8p9q2m"
                    APIM
                     |
                  Blue v1
                     |
          Coordinator v1
          Delegators v1
          Workers v1
```

I deploy the new Agent version separately:

```text id="3x7k1n"
                    APIM
                   /    \
              Blue v1   Green v2
                         |
                  Coordinator v2
                  Delegators v2
                  Workers v2
```

### Step 1 — Blue is serving production

```text id="1m5q7r"
Blue = Production
Green = New/Idle
```

All production traffic goes to Blue.

---

### Step 2 — Deploy Green

I deploy the new CWD version to Green.

```text id="g6v2p4"
Green
 ├── FastAPI v2
 ├── Coordinator v2
 ├── Delegators v2
 ├── Workers v2
 └── MCP-compatible configuration
```

The Green environment uses the same required infrastructure contracts but the new application/Agent versions.

---

### Step 3 — Run validation

Before sending real production traffic, I test Green.

```text id="w8j3s6"
Green
 ↓
Smoke Tests
 ↓
Integration Tests
 ↓
Security Tests
 ↓
Agent Evaluation
 ↓
Performance Tests
```

For CWD, I specifically test:

```text id="5x4v8n"
✓ Coordinator routing
✓ Delegator selection
✓ Worker execution
✓ MCP tool calls
✓ Salesforce / ServiceNow integration
✓ RAG quality
✓ Agent task completion
✓ Groundedness
✓ Tool-call accuracy
✓ Latency
✓ Error handling
```

---

### Step 4 — Switch traffic

Once Green passes the gates:

```text id="n6q4r2"
Before:

APIM → Blue v1


After:

APIM → Green v2
```

The traffic switch can be controlled through the gateway/traffic-routing layer.

The key point is that **the switch is quick and reversible**.

---

### Step 5 — Monitor Green

After switching:

```text id="c8f2m7"
Users
  ↓
Green v2
  ↓
Monitor
```

I watch:

* HTTP 4xx/5xx
* P95/P99 latency
* Agent failures
* A2A failures
* MCP failures
* Tool-call success
* Task completion
* Groundedness
* Hallucination/regression signals
* Token usage
* Cost

For Agentic AI, infrastructure health alone isn't sufficient.

---

### Step 6 — Roll back if necessary

If Green has a regression:

```text id="a9r5x1"
Green v2
   ↓
Problem detected
   ↓
Switch traffic back
   ↓
Blue v1
```

Because Blue was kept intact, rollback is fast.

```text id="2f6m8q"
APIM → Blue v1
```

---

### Step 7 — Decommission old Blue later

After Green has been stable for the defined observation period:

```text id="s3k7p1"
Green v2 = Production
Blue v1  = Previous version
```

I don't immediately destroy Blue. I retain the previous version for a controlled rollback window, then retire it according to the deployment/retention policy.

---

## Important CWD consideration: long-running workflows

This is a good **Architect-level interview point**.

Suppose:

```text id="p4z8k2"
WF-1001 started on Blue
Agent = v1
Prompt = v3.1
```

Then I switch new traffic to Green:

```text id="r7m1c5"
New workflows → Green
```

I need a clear compatibility/versioning strategy for **WF-1001**.

The workflow should retain its execution metadata:

```json id="j8q3v6"
{
  "workflow_id": "WF-1001",
  "agent_version": "v1",
  "prompt_version": "3.1",
  "model_version": "2026-08"
}
```

So a deployment doesn't accidentally change the behavior of an already-running workflow.

---

## Blue-Green vs Canary

A common interview question:

| Blue-Green                           | Canary                                                          |
| ------------------------------------ | --------------------------------------------------------------- |
| Two environments                     | Usually same production infrastructure with versioned instances |
| Switch traffic between environments  | Gradually increase traffic to new version                       |
| Fast rollback                        | Gradual rollback                                                |
| Good for clean environment isolation | Good for observing new version with limited traffic             |
| Higher infrastructure cost           | Usually more incremental                                        |

For **CWD Agent changes**, canary can be especially useful when I want to observe new Agent behavior with limited traffic before full rollout.

---

## Interview-ready answer

> **“For CWD, I use blue-green deployment by maintaining two production-capable environments. Blue contains the currently stable version, while Green contains the new version. I deploy the new Agent and application versions to Green, run smoke, integration, security, performance, and GenAI evaluation tests, and validate MCP and enterprise integrations. Once Green passes the gates, I switch traffic at the API gateway layer from Blue to Green. I then monitor both infrastructure and Agent-specific metrics such as task completion, tool-call success, groundedness, latency, errors, tokens and cost. If we detect a regression, I immediately route traffic back to Blue. I also preserve Agent, prompt and model versions for long-running workflows so deployment doesn't unexpectedly change an existing workflow.”**

### Easy memory

**Blue = current → Green = new → Test → Switch → Monitor → Rollback**

### Strong interview line

> **“The main advantage of blue-green is that I can validate the new production version before exposing it to users and roll back quickly without rebuilding the previous version.”**
