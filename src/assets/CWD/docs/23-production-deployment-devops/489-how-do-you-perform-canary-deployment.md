## How do you perform canary deployment?

**Canary deployment** means I release the new version to a **small percentage of production traffic first**, monitor its behavior, and gradually increase traffic if the new version remains healthy.

For CWD, this is especially useful for **Agent, prompt, model, or workflow changes**.

### CWD example

Suppose:

```text
Current → Agent v1
New     → Agent v2
```

Instead of sending everyone to v2:

```text
                    APIM
                      |
              Traffic Router
                 /        \
                ↓          ↓
          Agent v1       Agent v2
           95%             5%
```

---

### Step 1 — Deploy the new version

I deploy Agent v2 alongside the existing production version.

```text id="j7k2m4"
Production
 ├── v1 → 95%
 └── v2 → 5%
```

The exact percentage is a deployment decision based on risk and traffic volume; it isn't a fixed requirement.

---

### Step 2 — Route a small amount of traffic

I configure the traffic-routing layer, such as APIM/ingress, to send a small percentage of eligible requests to v2.

For example:

```text id="f3m8q1"
100 requests
   ↓
95 → v1
 5 → v2
```

I can also target the canary by controlled criteria such as a test tenant or internal users rather than only using percentages.

---

### Step 3 — Monitor the canary

For CWD, I monitor both **technical and Agentic AI metrics**.

### Technical

```text id="x5r9p2"
4xx / 5xx
P95 / P99 latency
CPU / memory
Timeouts
A2A failures
MCP failures
```

### Agent behavior

```text id="v6n3k8"
Task completion
Tool-call accuracy
Routing accuracy
Groundedness
Hallucination
RAG relevance
Token usage
Cost
```

This is important because an Agent can return HTTP 200 while still producing incorrect behavior.

---

### Step 4 — Compare v1 vs v2

I compare the canary against the existing production version using the **same traffic characteristics and evaluation criteria**.

```text id="c2m7x9"
             Production traffic
                    |
             ┌──────┴──────┐
             ↓             ↓
          Agent v1       Agent v2
             ↓             ↓
          Metrics       Metrics
             └──────┬──────┘
                    ↓
                 Compare
```

For example:

```text
Task completion       v1 vs v2
Tool success          v1 vs v2
P95 latency           v1 vs v2
Groundedness          v1 vs v2
Error rate            v1 vs v2
```

I use predefined acceptance thresholds rather than making an ad-hoc decision from one metric.

---

### Step 5 — Gradually increase traffic

If v2 remains healthy:

```text id="p8m4z6"
5%
 ↓
10%
 ↓
25%
 ↓
50%
 ↓
100%
```

The actual steps and observation periods depend on traffic volume and risk.

---

### Step 6 — Roll back if there is a regression

Suppose MCP failures or hallucination increase:

```text id="q4k8n1"
Agent v2
   ↓
Regression detected
   ↓
Traffic → v1
```

```text
v1 → 100%
v2 → 0%
```

Because v1 is still running, rollback is fast.

---

## Canary for prompts

The same approach can be used for prompt changes.

```text id="m5x2r7"
Prompt v3.1 → 95%
Prompt v3.2 → 5%
```

I monitor:

* Groundedness
* Answer relevance
* Hallucination
* Task completion
* Tool-call behavior
* Tokens
* Cost

---

## Canary for models

For a model upgrade:

```text id="k3p8w5"
Model A → 95%
Model B → 5%
```

I compare the same production metrics plus model-specific quality evaluation.

---

## Canary in your CWD architecture

A particularly good way to explain this in an interview:

```text id="z8c4m2"
                    APIM
                      ↓
               Traffic Routing
                  /       \
                 ↓         ↓
          CWD v1          CWD v2
             ↓               ↓
        Coordinator       Coordinator
             ↓               ↓
         Delegators        Delegators
             ↓               ↓
          Workers          Workers
             ↓               ↓
            MCP             MCP
             ↓               ↓
        Enterprise Systems
```

The **MCP and enterprise contracts must remain compatible** with the canary version, or the canary must use a compatible MCP contract/version.

---

## Canary vs Blue-Green

```text
Blue-Green:
100% → Blue
       ↓
100% → Green

Canary:
95% → Blue
 5% → Green
       ↓
10% → Green
       ↓
25% → Green
       ↓
100% → Green
```

**Blue-green** focuses on switching between two environments.

**Canary** focuses on **gradual exposure and observation**.

---

## Interview-ready answer

> **“For canary deployment, I run the new CWD version alongside the existing production version and initially route a small, controlled percentage of traffic to it. I monitor infrastructure metrics as well as Agent-specific metrics such as task completion, tool-call accuracy, groundedness, hallucination, latency, token usage, cost, A2A and MCP failures. I compare the canary against the current version using predefined acceptance thresholds. If it remains healthy, I gradually increase traffic until it reaches 100%. If I detect a regression, I immediately route traffic back to the stable version. The same strategy can be applied to Agent, prompt, model, or workflow changes.”**

### Easy memory

**Deploy → Small traffic → Monitor → Compare → Increase → Rollback**

### Strong interview line

> **“For Agentic AI, canary deployment lets me validate not only whether the new version is technically healthy, but whether its behavior is healthy under real production conditions.”**
