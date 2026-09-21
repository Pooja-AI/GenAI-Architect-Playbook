## How do you compare two LLM versions?

I compare two LLM versions using the **same prompts, same golden dataset, same tools, and same evaluation criteria**. The goal is to determine whether the new model improves the overall CWD behavior without introducing regressions.

> **“Same inputs → Same environment → Run both models → Compare quality, reliability, latency, cost, and safety.”**

### CWD example

Suppose I want to compare:

```text
Model A = Current production model
Model B = New candidate model
```

For the CWD **Customer Briefing** use case:

```text id="m7v2ka"
Golden Dataset
      │
      ├────────→ Model A → CWD results
      │
      └────────→ Model B → CWD results
                         ↓
                   Evaluation
                         ↓
                  Compare metrics
```

I keep the other variables controlled—same Coordinator prompt, Delegator/Worker prompts, retrieval configuration, tool definitions, and test cases—so that the model version is the primary variable being tested.

---

## What do I compare?

### 1. Answer quality

I compare:

* Factual accuracy
* Faithfulness
* Groundedness
* Answer relevance
* Completeness
* Citation correctness
* Appropriate abstention

Example:

```text id="a2q6mx"
                 Model A    Model B
Factual accuracy   94%        97%
Groundedness       95%        96%
Relevance          96%        97%
```

---

### 2. Agent behavior

For CWD, I also evaluate the model's decisions:

```text id="k8p4vz"
Intent accuracy
Delegator routing
Worker selection
MCP tool selection
Parameter correctness
Trajectory quality
```

For example:

> “Show open incidents for C12345.”

Expected:

```text
IT Delegator
   ↓
Incident Worker
   ↓
get_incidents(C12345, Open)
```

If Model B frequently selects the wrong tool, that is a regression even if its final responses look good.

---

### 3. Reliability

I compare:

* Task completion rate
* Agent failure rate
* Retry rate
* Timeout rate
* Recovery/resume success
* Invalid tool calls
* Loop rate

---

### 4. Latency

I measure:

```text
p50
p95
p99
```

Example:

```text id="q3v9nw"
                Model A    Model B
p50               2.1s       1.8s
p95               4.8s       4.2s
p99               8.5s       7.9s
```

---

### 5. Cost

I compare:

* Input tokens
* Output tokens
* Tokens/request
* Number of LLM calls
* Cost/request
* Total workflow cost

A model that is slightly more accurate but dramatically more expensive may require a business trade-off analysis rather than an automatic replacement.

---

### 6. Safety

For enterprise CWD, I specifically test:

* Prompt injection
* Unauthorized data access
* Sensitive-data leakage
* Cross-customer data access
* Unsafe tool selection
* Policy violations
* Incorrect handling of restricted actions

For example:

```text
User A → customer C12345
```

Model B must not expose:

```text
Customer C99999 data ❌
```

---

# How do I run the comparison?

I use a **golden dataset** containing:

```text id="r6m3xp"
Normal requests
Edge cases
Ambiguous requests
No-data cases
MCP failures
RAG failures
Prompt-injection cases
Authorization cases
Multi-agent workflows
Historical production failures
```

Then:

```text id="v9n4cs"
          Same Golden Dataset
                 ↓
       ┌─────────┴─────────┐
       ↓                   ↓
   Model A              Model B
       ↓                   ↓
  CWD Results          CWD Results
       └─────────┬─────────┘
                 ↓
          Evaluation Layer
                 ↓
            Comparison
```

---

# Example evaluation table

| Metric             | Model A | Model B |
| ------------------ | ------: | ------: |
| Intent accuracy    |     97% |     98% |
| Delegator routing  |     98% |     97% |
| Tool selection     |     96% |     98% |
| Groundedness       |     95% |     97% |
| Factual accuracy   |     94% |     97% |
| Task completion    |     96% |     97% |
| Hallucination rate |    1.8% |    1.1% |
| p95 latency        |    4.8s |    4.2s |
| Cost/request       |  $0.020 |  $0.024 |

This shows that Model B improves several quality metrics but costs more per request. I would then assess whether the quality improvement justifies the additional cost for that use case.

---

## LLM-as-a-Judge

For subjective dimensions such as:

* relevance
* completeness
* clarity
* response quality

I can use an evaluator model with the **same rubric** for both versions.

For example:

```text
Evaluate each response from 1–5 for:
1. Relevance
2. Completeness
3. Groundedness
4. Clarity
```

But for critical enterprise facts, I prefer deterministic checks against the **source of truth** whenever possible.

---

# A/B or shadow testing

After offline evaluation passes, I can test the candidate more safely.

### Shadow testing

```text id="u5k7pq"
Real User Request
       ↓
Production Model ──→ User
       │
       └────────→ Candidate Model
                    ↓
                 Evaluate
```

The candidate's response is evaluated but isn't shown to the user.

This lets me compare the candidate on realistic production traffic without immediately changing user-facing behavior.

For suitable low-risk scenarios, I can then perform controlled A/B testing.

---

## Interview-ready answer

> **“I compare two LLM versions using the same golden dataset, prompts, tools, retrieval configuration, and evaluation criteria so the model version is the primary variable. In CWD, I compare not only final-answer quality such as factual accuracy, groundedness, relevance, and hallucination rate, but also agent behavior such as intent accuracy, Delegator routing, Worker and MCP tool selection, trajectory quality, and task completion. I also compare p50/p95/p99 latency, token usage, cost per request, reliability, and safety. I first perform offline evaluation, then use shadow or controlled production testing before promoting the new model. If the candidate fails any critical quality or safety gate, I keep the existing model and investigate rather than deploying it.”**

### Easy memory

**Same dataset → Same environment → Compare Quality + Agent Behavior + Latency + Cost + Safety → Quality Gate → Shadow/A-B → Deploy.**
