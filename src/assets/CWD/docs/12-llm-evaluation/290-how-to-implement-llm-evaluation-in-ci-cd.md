## How do you implement LLM evaluation in CI/CD?

**I integrate LLM evaluation into the deployment pipeline as automated quality gates.** Whenever I change a prompt, model, RAG configuration, agent workflow, or tool definition, the pipeline runs a fixed evaluation suite before allowing deployment.

> **“Every AI change must pass automated quality checks before it reaches production.”**

### CWD CI/CD flow

```text
Developer Change
      ↓
Git Commit / PR
      ↓
Unit Tests
      ↓
Build + Security Scan
      ↓
Deploy to Evaluation Environment
      ↓
Run CWD Golden Dataset
      ↓
LLM Evaluation
      ↓
Compare with Baseline
      ↓
Quality Gates
   ┌──┴───────────┐
 FAIL            PASS
  ↓               ↓
Stop / Rollback   Staging
                  ↓
              Production
```

---

## 1. Store the golden dataset in Git

For example:

```json id="r8k4wp"
{
  "test_id": "CWD-001",
  "input": "Give me a customer briefing for C12345",
  "expected": {
    "intent": "customer_briefing",
    "delegators": ["sales", "it"],
    "workers": ["customer_worker", "incident_worker"],
    "requires_grounding": true
  }
}
```

I version this dataset along with the application.

---

## 2. Run CWD against the dataset

The pipeline invokes the actual workflow:

```python id="k6p3vz"
for test_case in golden_dataset:
    result = cwd.invoke(test_case["input"])

    evaluation_results.append(
        evaluate(
            expected=test_case["expected"],
            actual=result
        )
    )
```

For CWD I capture the complete trajectory:

```text id="m9q2xs"
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
MCP Tool
   ↓
Enterprise System
   ↓
Final Answer
```

---

## 3. Evaluate multiple dimensions

I don't use just one LLM score.

### Agent behavior

```text
Intent accuracy
Delegator routing accuracy
Worker selection accuracy
Tool-selection accuracy
Parameter correctness
Trajectory quality
```

### RAG / answer quality

```text
Context relevance
Context recall
Faithfulness
Groundedness
Factual accuracy
Answer relevance
Citation correctness
Hallucination rate
```

### Production characteristics

```text
Task completion
Latency
Token usage
Cost/request
Retry/failure rate
```

### Safety

```text
Prompt injection
Unauthorized access
Sensitive-data leakage
Unsafe tool execution
```

---

# 4. Use deterministic checks where possible

For example, if expected:

```text
customer_id = C12345
delegators = ["sales", "it"]
tool = "get_incidents"
```

I don't need another LLM to judge those.

I can do:

```python id="t3c7nm"
assert result["customer_id"] == "C12345"
assert set(result["delegators"]) == {"sales", "it"}
assert result["tool_name"] == "get_incidents"
```

This gives highly reliable regression checks.

---

# 5. Use LLM evaluation for subjective quality

For things such as response relevance or completeness, I can use an evaluator model.

Conceptually:

```python id="w5m9qx"
score = evaluator(
    question=test_case["input"],
    answer=result["answer"],
    evidence=result["evidence"],
    rubric=[
        "Is the answer relevant?",
        "Is it grounded in the evidence?",
        "Is it complete?"
    ]
)
```

The evaluator returns structured results rather than free-form text.

```json id="f2n8kc"
{
  "relevance": 0.95,
  "groundedness": 0.97,
  "completeness": 0.92
}
```

For critical facts, I still prefer validation against the **system of record** rather than relying only on an LLM judge.

---

# 6. Compare against the baseline

Suppose the current production version has:

```text id="x4q8mv"
Groundedness       = 96%
Task completion    = 97%
Routing accuracy   = 98%
Hallucination rate = 1.2%
p95 latency        = 4.5 sec
```

New version produces:

```text id="v6k2pw"
Groundedness       = 97%   ✅
Task completion    = 97%   ✅
Routing accuracy   = 91%   ❌
Hallucination rate = 1.1%  ✅
p95 latency        = 4.0 sec
```

Even though the new version improves some metrics, the **routing regression** could fail the pipeline quality gate.

---

# 7. Define quality gates

Example:

```text id="b7m4zs"
Routing accuracy      >= 95%
Groundedness          >= 95%
Task completion       >= 95%
Hallucination rate    <= 2%
Safety violations      = 0
p95 latency           <= 5 sec
```

These are **illustrative thresholds**; actual gates should come from the application's requirements and SLA.

The pipeline evaluates:

```python id="q2r8mx"
if (
    routing_accuracy < MIN_ROUTING
    or groundedness < MIN_GROUNDEDNESS
    or hallucination_rate > MAX_HALLUCINATION
    or safety_violations > 0
):
    raise Exception("LLM evaluation gate failed")
```

Then deployment stops.

---

# 8. Put evaluation into CI/CD

For example:

```text id="n5c9qa"
Pull Request
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
LLM Evaluation
    ↓
Quality Gates
    ↓
Build Container
    ↓
Deploy Staging
    ↓
Smoke Tests
    ↓
Production
```

For expensive LLM evaluations, I might use:

**PR pipeline**

* Small regression suite
* Critical safety tests
* Routing/tool tests

**Nightly/full pipeline**

* Full golden dataset
* More extensive LLM evaluation
* Broader edge cases

---

# 9. Production feedback becomes regression data

This is particularly important for agentic AI.

Suppose production has:

> Wrong incident status returned for C12345.

I add that failure to the golden dataset:

```text id="g4w7px"
Production Failure
       ↓
Root Cause
       ↓
New Golden Test
       ↓
CI/CD Regression Suite
       ↓
Future deployments must pass
```

So the evaluation suite continuously improves.

---

## Where do Langfuse / RAGAS fit?

For your CWD architecture:

```text id="c8m2vk"
CI/CD
  ↓
Golden Dataset
  ↓
CWD execution
  ↓
Langfuse traces
  ↓
RAGAS / custom evaluators
  ↓
Evaluation Results
  ↓
Quality Gate
```

* **Langfuse** → captures LLM/agent traces, prompts, model calls, latency, tokens, and evaluation scores.
* **RAGAS** → useful for RAG-oriented metrics such as faithfulness, context relevance/precision/recall and answer relevance.
* **Custom evaluators** → routing accuracy, Worker selection, MCP tool selection, business rules, task completion.
* **CI/CD** → decides whether the change passes the deployment gate.

---

## Interview-ready answer

> **“I implement LLM evaluation in CI/CD as an automated quality gate. Whenever we change a model, prompt, RAG configuration, agent workflow, or MCP tool, the pipeline runs our versioned golden dataset against the CWD workflow. We evaluate routing, Worker and tool selection, retrieval quality, faithfulness, groundedness, factual accuracy, hallucination rate, task completion, latency, cost, and safety. I use deterministic assertions for things like customer IDs, Delegator selection, tool names, and business rules, and LLM-based evaluators for subjective qualities such as relevance and completeness. The results are compared with the production baseline, and if a critical metric falls below its threshold—or a safety violation occurs—the pipeline blocks deployment. After a production failure, I add that scenario to the regression dataset so future deployments are tested against it.”**

### Easy memory

**Code/Prompt change → Golden tests → Evaluate → Compare baseline → Quality gate → Deploy/Block.**
