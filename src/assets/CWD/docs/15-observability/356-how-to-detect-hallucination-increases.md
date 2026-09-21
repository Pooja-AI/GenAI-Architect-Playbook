## How do you detect hallucination increases?

In CWD, I detect hallucination increases through **continuous evaluation + production monitoring**. I don't rely only on user complaints.

The key idea is to monitor whether the LLM's claims are **supported by retrieved enterprise evidence**.

### CWD flow

```text
User Request
    ↓
Worker
    ↓
RAG / MCP
    ↓
Trusted Evidence
    ↓
LLM
    ↓
Answer
    ↓
Grounding / Faithfulness Evaluation
    ↓
Hallucination Metric
    ↓
Dashboard + Alert
```

### 1. Measure groundedness / faithfulness

For evaluated responses, I check:

```text
Are the claims in the answer supported by the retrieved evidence?
```

Example:

```text
Retrieved evidence:
"Customer C12345 had 3 open incidents."

LLM response:
"Customer C12345 has 3 open incidents."
       ↓
Supported ✓
```

But:

```text
LLM response:
"Customer C12345 has 7 open incidents."
       ↓
Not supported ❌
```

That becomes a potential hallucination.

---

### 2. Track hallucination rate over time

For example:

```text
Week 1 → 2.1%
Week 2 → 2.4%
Week 3 → 2.7%
Week 4 → 5.8%  ← investigate
```

The important thing is the **trend**, not just one bad response.

I can break it down by:

```text
Model
Prompt version
Worker
Delegator
Use case
RAG index version
Document source
```

For example:

```text
Customer Worker       2.1%
Incident Worker       2.4%
Opportunity Worker    7.2%  ← investigate
```

---

### 3. Compare against a golden dataset

I maintain a set of trusted test cases:

```text
Question
Expected evidence
Expected answer/behavior
```

After a model, prompt, RAG, or agent change:

```text
New Model/Prompt
      ↓
Golden Dataset
      ↓
Run CWD workflow
      ↓
Evaluate answers
      ↓
Compare with baseline
```

If hallucination/grounding metrics regress beyond the allowed threshold, the deployment can be blocked or rolled back.

---

### 4. Check retrieval quality too

A hallucination increase isn't always an LLM problem.

For example:

```text
Bad retrieval
     ↓
Wrong context
     ↓
LLM
     ↓
Unsupported answer
```

So I check:

```text
Retrieval relevance
Context precision
Context recall
Groundedness
Answer relevance
```

This helps determine whether the root cause is:

* bad retrieval
* stale index
* incorrect ACL filtering
* poor chunking
* prompt change
* model change
* excessive context
* tool failure

---

### 5. Monitor production signals

I monitor:

```text
Groundedness / faithfulness
Answer relevance
Citation/evidence correctness
"No evidence" rate
User feedback
Correction rate
Abstention rate
Task completion
```

If users frequently correct answers or the system suddenly produces more unsupported claims, I investigate the corresponding traces.

---

### 6. Trace the problematic response

Suppose hallucination increases:

```text
Response
 ↓
Trace ID
 ↓
Worker
 ↓
RAG retrieval
 ↓
Retrieved documents
 ↓
Prompt version
 ↓
LLM model/version
 ↓
Final answer
```

This lets me ask:

> **Did the model hallucinate, or did we give the model bad/missing evidence?**

---

### Example

Suppose after changing the RAG configuration:

```text
Before:
Groundedness = 94%

After:
Groundedness = 86%
```

I trace the regression:

```text
RAG Top-K changed: 5 → 15
        ↓
More irrelevant context
        ↓
Context precision decreased
        ↓
Unsupported claims increased
        ↓
Hallucination increased
```

So I would investigate/revert the retrieval change rather than simply changing the LLM.

---

## Interview-ready answer

> **“I detect hallucination increases through continuous grounding and faithfulness evaluation. I maintain a golden dataset and evaluate production traces against metrics such as groundedness, answer relevance, citation correctness and unsupported-claim rate. I monitor these metrics by model, prompt version, Worker, use case and RAG version. If hallucination increases, I trace the complete request to determine whether the root cause is the LLM, retrieval quality, stale data, prompt changes, or tool failures. If authoritative evidence is unavailable, the system should abstain rather than generate an unsupported answer.”**

### Strong interview line

> **“I don't treat hallucination as only an LLM problem. I trace the complete pipeline—retrieval, evidence, prompt, model and final response—to identify where the grounding failure occurred.”**

**Easy memory:**
**Evaluate → Measure groundedness → Trend → Trace → Find root cause → Fix → Regression test**
