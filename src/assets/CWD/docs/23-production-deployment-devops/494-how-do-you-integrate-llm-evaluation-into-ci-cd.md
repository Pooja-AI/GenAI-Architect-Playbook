## How do you integrate LLM evaluation into CI/CD?

For **CWD**, I treat LLM evaluation as a **release gate**, not as something I do manually after deployment.

Whenever I change the **prompt, model, Agent workflow, RAG configuration, or tool-selection logic**, the CI/CD pipeline automatically runs the same golden evaluation dataset and compares the new version against the approved baseline.

### Overall flow

```text id="5c0xqf"
Code / Prompt / Model / RAG Change
              ↓
         Git Pull Request
              ↓
        Build + Unit Tests
              ↓
        Security Tests
              ↓
       Integration Tests
              ↓
       Golden Dataset Eval
              ↓
      Compare with Baseline
              ↓
        Quality Gate
          ↙       ↘
       FAIL        PASS
        ↓           ↓
      Block       Deploy
                    ↓
                 Staging
                    ↓
                 Canary
                    ↓
                Production
```

---

## 1. Maintain a golden evaluation dataset

I maintain a versioned dataset containing representative CWD scenarios.

For example:

```json id="3f1q8p"
{
  "input": "Give me a customer briefing for C12345",
  "expected_intent": "customer_briefing",
  "expected_delegators": [
    "sales_delegator",
    "it_delegator"
  ],
  "expected_entities": {
    "customer_id": "C12345"
  }
}
```

The dataset also contains:

```text id="6z8m2k"
Normal cases
Edge cases
Ambiguous requests
No-data cases
Hallucination cases
Tool failures
Authorization failures
Prompt-injection cases
Multi-worker workflows
```

I version this dataset because changing the evaluation dataset itself can change the evaluation result.

---

## 2. Trigger evaluation from CI/CD

Suppose I change:

```text
Prompt v3.1 → v3.2
```

or:

```text
Model v1 → Model v2
```

The pipeline automatically runs the evaluation suite.

For example:

```text id="h9k4w2"
Pull Request
    ↓
Build
    ↓
pytest
    ↓
Agent Evaluation
    ↓
Quality Gate
```

This can run in GitHub Actions, Azure DevOps, GitLab CI, etc.

---

## 3. Evaluate multiple dimensions

I don't evaluate only the final answer.

For CWD I evaluate:

### Agent behavior

```text
Intent accuracy
Delegator routing
Worker selection
Tool-call accuracy
Task completion
```

### RAG

```text
Retrieval relevance
Context precision
Context recall
Groundedness
```

### Answer quality

```text
Answer relevance
Factual correctness
Hallucination
```

### Production characteristics

```text
Latency
Token usage
Cost
Error rate
```

### Safety

```text
Prompt injection
Unauthorized tool use
Data leakage
Policy violations
```

---

## 4. Compare against a baseline

Suppose the current production version produces:

```text id="8y2nq4"
Task completion       94%
Groundedness          96%
Tool-call accuracy    97%
Hallucination          2%
P95 latency           4.2 sec
```

The new version produces:

```text id="4k7m1p"
Task completion       91%
Groundedness          95%
Tool-call accuracy    96%
Hallucination          6%
P95 latency           4.5 sec
```

The pipeline compares the new version against the **approved baseline and predefined acceptance criteria**.

---

## 5. Apply quality gates

For example, the project might define rules such as:

```text id="7r5x3m"
Task completion   → must meet minimum threshold
Groundedness      → must meet minimum threshold
Tool accuracy     → must meet minimum threshold
Safety            → zero critical violations
Hallucination     → must remain within allowed threshold
Latency           → must remain within SLO
Cost              → must remain within budget
```

The exact thresholds should be established from business requirements and baseline performance rather than invented universally.

If a critical gate fails:

```text id="w3p6j9"
Evaluation FAILED
       ↓
CI/CD pipeline STOPPED
       ↓
No production deployment
```

---

## 6. Example CWD evaluation

Suppose I change the Coordinator prompt.

The evaluation might test:

```text id="3k6r8w"
Input
 ↓
Coordinator
 ↓
Expected Delegator routing
 ↓
Expected Workers
 ↓
MCP calls
 ↓
Final response
```

For:

> "Give me a complete customer briefing for C12345."

Expected:

```text
Customer ID = C12345
        ↓
Sales Delegator ✓
        ↓
Customer Worker ✓
Opportunity Worker ✓

IT Delegator ✓
        ↓
Incident Worker ✓
```

If the new prompt incorrectly routes the request only to Sales:

```text
Sales Delegator ✓
IT Delegator ✗
```

the evaluation catches the regression **before production**.

---

## 7. Use LLM-as-a-judge carefully

For subjective dimensions such as answer relevance or helpfulness, I can use an LLM evaluator.

Example:

```text id="n2m7x4"
Candidate Answer
       ↓
Evaluation Model
       ↓
Groundedness / Relevance / Completeness
       ↓
Score
```

But I don't rely entirely on an LLM judge.

I combine:

```text
Deterministic tests
+
Reference-based evaluation
+
LLM-as-a-judge
+
Business metrics
```

For example, whether the correct `customer_id` was used or whether the correct MCP tool was called can often be validated deterministically.

---

## 8. Store evaluation results

I record:

```text id="p5v8r2"
agent_version
model_version
prompt_version
rag_index_version
evaluation_dataset_version
evaluation_timestamp
metrics
failed_cases
```

Example:

```json id="9q3m6v"
{
  "agent_version": "2.4",
  "model_version": "v2",
  "prompt_version": "3.2",
  "dataset_version": "2026.09",
  "task_completion": 0.94,
  "groundedness": 0.96,
  "tool_accuracy": 0.97,
  "status": "PASSED"
}
```

This gives me reproducibility.

---

## 9. Failed production cases become regression tests

This is a strong production practice.

Suppose production discovers:

```text id="u7k2m9"
Agent selected wrong Worker
```

I add that scenario to the golden dataset:

```text id="v3p8n1"
Production Failure
       ↓
New Regression Test
       ↓
Golden Dataset
       ↓
Future CI/CD Runs
```

That prevents the same issue from silently returning in a future model or prompt release.

---

## 10. Evaluation continues after deployment

CI/CD evaluation is the **pre-production gate**, but I also monitor production.

```text id="b8x4q2"
Offline Evaluation
       ↓
Canary
       ↓
Online Evaluation
       ↓
Production Monitoring
```

During canary, I compare:

```text
v1 vs v2
```

for:

* task completion
* tool success
* groundedness
* hallucination
* latency
* token usage
* cost
* errors

If the canary regresses, I roll back.

---

# Interview-ready answer

> **“I integrate LLM evaluation into CI/CD as an automated quality gate. Whenever we change the model, prompt, Agent workflow, RAG configuration or tool-selection logic, the pipeline runs a versioned golden dataset. I evaluate intent and routing accuracy, Worker and tool selection, task completion, groundedness, hallucination, RAG retrieval quality, safety, latency, token usage and cost. I compare the results against the approved baseline and predefined release thresholds. Critical regressions fail the pipeline and prevent deployment. After deployment, I continue the same evaluation dimensions during canary and production monitoring. Any production failure is converted into a regression test and added back to the golden dataset.”**

### Easy memory

**Change → Evaluate → Compare → Gate → Deploy → Monitor → Learn**

### Strong interview line

> **“For Agentic AI, CI/CD should validate behavior, not just code. A build can be technically successful while the Agent is making the wrong decisions, so LLM evaluation becomes a first-class deployment gate.”**
