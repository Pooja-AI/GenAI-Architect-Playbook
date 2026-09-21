## How do you perform regression testing?

**Regression testing means re-running previously validated CWD test cases after every significant change to make sure existing functionality still works and quality has not degraded.**

In simple terms:

> **“I changed something—did I accidentally break something that was already working?”**

### CWD example

Suppose I change the **Coordinator routing prompt**.

Before the change:

```text
Customer Briefing
        ↓
Sales Delegator + IT Delegator ✅
```

After the change, it routes only to:

```text
Customer Briefing
        ↓
Sales Delegator ❌
```

The regression suite should detect this immediately.

---

## My CWD regression-testing flow

```text
Code / Prompt / Model / RAG Change
              ↓
       Run Golden Dataset
              ↓
        Execute CWD
              ↓
     Capture Full Trajectory
              ↓
   Compare Expected vs Actual
              ↓
 ┌────────────┼─────────────┐
 ↓            ↓             ↓
Routing      RAG           Final
Accuracy     Quality       Answer
 ↓            ↓             ↓
 MCP         Grounding     Accuracy
 ↓            ↓             ↓
Performance  Cost          Safety
              ↓
        Compare Baseline
              ↓
         Pass / Fail
```

---

## What changes trigger regression testing?

I run regression tests when I change:

* LLM/model
* System or agent prompts
* Coordinator routing logic
* Delegator logic
* Worker logic
* MCP tools/tool schemas
* RAG chunking
* Embedding model
* Retrieval configuration
* Ranking/reranking
* Business rules
* Security/ACL logic
* LangGraph workflow
* Retry/recovery behavior

---

## What is in my regression dataset?

I maintain a **golden dataset** containing representative CWD scenarios.

For example:

```json
{
  "test_id": "CWD-001",
  "input": "Give me a customer briefing for C12345",
  "expected": {
    "intent": "customer_briefing",
    "delegators": ["sales", "it"],
    "workers": [
      "customer_worker",
      "incident_worker"
    ],
    "sources": [
      "Salesforce",
      "ServiceNow"
    ]
  }
}
```

I include:

```text
Normal cases
Edge cases
Ambiguous requests
No-data cases
Hallucination cases
MCP failures
Timeouts
Authorization failures
Prompt-injection cases
Partial failures
Recovery/resume cases
```

---

## What do I compare?

I don't only compare the final answer.

I compare the **entire behavior**.

### 1. Routing

```text
Expected: Sales + IT
Actual:   Sales + IT

→ PASS ✅
```

### 2. Worker selection

```text
Expected: Customer Worker + Incident Worker
Actual:   Customer Worker + Incident Worker

→ PASS ✅
```

### 3. Tool selection

```text
Expected: get_customer()
Actual:   get_customer()

→ PASS ✅
```

### 4. Retrieval

Check:

* Recall@K
* Precision@K
* Context relevance
* Context recall

### 5. Final answer

Check:

* Factual accuracy
* Faithfulness
* Groundedness
* Relevance
* Completeness
* Citation correctness

### 6. Performance

Check:

* p50/p95/p99 latency
* Token usage
* Cost per request
* MCP latency
* LLM latency

### 7. Reliability

Check:

* Task completion rate
* Retry success
* Recovery/resume
* Failure rate
* Timeout rate

---

## Example regression failure

Suppose before a model change:

```text
Routing accuracy       98%
Groundedness           96%
Task completion        97%
p95 latency            4.2 sec
Cost/request           $0.02
```

After the change:

```text
Routing accuracy       91%  ❌
Groundedness           95%
Task completion        96%
p95 latency             4.0 sec
Cost/request           $0.015
```

Even though the new model is cheaper and slightly faster, the regression suite shows a significant **routing degradation**.

So I would investigate before promoting the change.

---

## CI/CD integration

I integrate regression tests into the deployment pipeline:

```text
Developer Change
      ↓
Unit Tests
      ↓
Integration Tests
      ↓
CWD Golden Regression Tests
      ↓
Evaluation Metrics
      ↓
Quality Gates
      ↓
Deploy to Staging
      ↓
Production
```

For example, I can define quality gates such as:

```text
Routing accuracy   >= baseline threshold
Groundedness       >= baseline threshold
Task completion    >= baseline threshold
Safety violations  = 0
p95 latency        <= agreed threshold
Cost/request       <= agreed threshold
```

The exact thresholds are **business/SLA dependent**, rather than assuming one universal number.

---

## Regression testing after a production failure

This is an important practice.

Suppose a customer reports:

> “CWD returned the wrong incident status.”

I don't just fix the bug.

I:

```text
Production Failure
       ↓
Root Cause
       ↓
Create Regression Test
       ↓
Add to Golden Dataset
       ↓
Fix
       ↓
Run Entire Regression Suite
       ↓
Deploy
```

That prevents the same problem from coming back.

---

## Interview-ready answer

> **“I perform regression testing using a curated golden dataset of previously validated CWD scenarios. Whenever I change a model, prompt, routing logic, RAG configuration, MCP tool, or workflow, I run the same scenarios again and compare the new behavior against the baseline. I evaluate not only the final answer but also Delegator routing, Worker selection, tool selection, retrieval quality, groundedness, factual accuracy, task completion, latency, cost, and safety. I put quality gates into CI/CD so a significant degradation blocks promotion. When we discover a production issue, I convert that scenario into a new regression test so the same failure doesn't recur.”**

### Easy memory

**Change → Replay Golden Dataset → Compare → Quality Gate → Deploy.**
