# How would you evaluate a new Bedrock model before production?

## Short answer

I would **not replace the production model directly**. I would evaluate the new Bedrock model against the **same golden dataset and production-like test scenarios**, comparing **quality, groundedness, tool calling, latency, cost, safety, and reliability**.

```text
New Model
   ↓
Offline Evaluation
   ↓
Quality + Safety + Cost + Latency
   ↓
Shadow / Canary Testing
   ↓
Production
```

## Key points

### 1. Create a representative golden dataset

For CWD, I would include real business scenarios such as:

```text
Customer Briefing
Incident lookup
Customer + ServiceNow combination
RAG questions
Multi-step reasoning
Tool calling
"No information available" cases
```

Each test case has an expected outcome or evaluation criteria.

---

### 2. Compare the new model with the current model

Run the **same inputs** through both models:

```text
                  Golden Dataset
                       ↓
              ┌────────┴────────┐
              ↓                 ↓
        Current Model       New Model
              ↓                 ↓
        Evaluation          Evaluation
              ↓                 ↓
              └────────┬────────┘
                       ↓
                  Comparison
```

This is important because I'm measuring the **change caused by the new model**, not just whether the new model looks good by itself.

---

## 3. Evaluate answer quality

For CWD, I check:

* Answer correctness
* Relevance
* Completeness
* Instruction following
* Structured-output validity

For RAG:

* Groundedness / faithfulness
* Context relevance
* Retrieval quality
* Unsupported claims

For example:

```text
Current model → 92% task accuracy
New model     → 94% task accuracy
```

I would consider that improvement together with latency, cost and other requirements rather than looking at accuracy alone.

---

## 4. Test tool calling

This is especially important for CWD.

```text
Worker
  ↓
Model
  ↓
Tool selection
  ↓
MCP
  ↓
Salesforce / ServiceNow
```

I test:

* Correct tool selection
* Correct arguments
* Missing parameters
* Invalid parameters
* Multiple tool calls
* Tool-call ordering
* Structured response

A model that produces good text but calls the wrong enterprise tool is not suitable for that Worker.

---

## 5. Test latency

Measure:

```text
P50
P95
P99
```

Example:

```text
                Current     New
P50              1.8s       1.5s
P95              4.2s       3.7s
P99              7.0s       6.2s
```

I also test under realistic concurrency.

---

## 6. Evaluate cost

Track:

```text
Input tokens
Output tokens
Total tokens
Cost/request
Cost/workflow
```

For example, a model might have better quality but consume substantially more tokens.

So I compare:

```text
Quality
   +
Latency
   +
Cost
```

rather than choosing based on one metric.

---

## 7. Test reliability

I test:

* Timeouts
* Throttling
* Retries
* Malformed responses
* Invalid structured output
* Tool failures
* High concurrency
* Long-context requests

For example:

```text
1000 test requests
        ↓
Success rate
Timeout rate
429 rate
Retry rate
Malformed output rate
```

---

## 8. Test safety and security

For an enterprise CWD system, I also test:

* Prompt injection
* Indirect injection
* Sensitive-data leakage
* Unauthorized information requests
* Unsafe tool execution
* Jailbreak-style inputs
* Incorrect handling of confidential data

The model should not be responsible for authorization; CWD should enforce authorization separately.

---

# 9. Run shadow testing

Before exposing users to the new model:

```text
Production Request
       ↓
Current Model → Real response to user
       ↓
New Model → Shadow evaluation
```

The new model receives representative traffic, but its response isn't used for the user-facing result.

This gives production-like performance data without immediately changing user behavior.

---

# 10. Canary deployment

After offline and shadow testing:

```text
100% → Current Model
```

Then:

```text
90% → Current
10% → New
```

Monitor:

```text
Quality
P95/P99 latency
Cost
Errors
Tool-call success
Groundedness
Throttling
```

If the new model meets the required thresholds, gradually increase traffic.

---

# 11. Define quality gates

Before production, I define explicit gates.

Example:

```text
Quality              ≥ required threshold
Groundedness         ≥ required threshold
Tool-call accuracy   ≥ required threshold
P95 latency          ≤ SLA
Error rate           ≤ threshold
Cost/workflow        ≤ budget
Safety tests         = pass
```

The exact thresholds should come from the application's requirements rather than arbitrary numbers.

---

# CWD evaluation flow

```text
              New Bedrock Model
                       ↓
                Golden Dataset
                       ↓
          ┌────────────┴────────────┐
          ↓                         ↓
      Quality                    Safety
          ↓                         ↓
      Tool Calls                Security
          ↓                         ↓
      Latency                    Cost
          └────────────┬────────────┘
                       ↓
                Quality Gates
                       ↓
                Shadow Testing
                       ↓
                 Canary 10%
                       ↓
                  Monitoring
                       ↓
              Promote / Rollback
```

# 🎯 Strong interview answer

> **“Before production, I evaluate a new Bedrock model using the same golden dataset and production-like scenarios that we use for the current model. I compare task accuracy, groundedness, relevance, tool-call correctness, structured-output validity, P95/P99 latency, token usage, cost, reliability and safety. For CWD, I specifically test MCP tool selection and argument correctness because a model can generate good text but still select the wrong enterprise tool. After offline evaluation, I use shadow testing and then a controlled canary rollout. I define quality gates for quality, latency, cost, reliability and safety, and promote the model only when those gates are satisfied. Otherwise, I roll back to the existing model.”**

## Easy memory trick

**G → Q → T → L → C → S → Shadow → Canary**

* **G** = Golden dataset
* **Q** = Quality
* **T** = Tool calling
* **L** = Latency
* **C** = Cost
* **S** = Safety

> **“Evaluate offline → test in shadow → canary → monitor → promote or rollback.”**
