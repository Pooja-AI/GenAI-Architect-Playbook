## How do human evaluations fit into the CWD system?

**Human evaluation is the human-in-the-loop quality layer** used to validate AI responses that automated metrics cannot reliably judge.

In CWD, I use human evaluation mainly for **quality, correctness, safety, and difficult edge cases**, while automated evaluation handles large-scale continuous testing.

### CWD flow

```text
User Request
     ↓
Coordinator
     ↓
Delegator
     ↓
Workers
     ↓
RAG / MCP
     ↓
LLM Response
     ↓
Automated Evaluation
     ↓
 ┌───────────────────────┐
 │ Good → Return         │
 │ Low confidence/error  │
 │        ↓              │
 │ Human Evaluation      │
 └───────────────────────┘
          ↓
   Approve / Correct /
   Reject / Feedback
```

### What do humans evaluate?

For example, for a **Customer Briefing for C12345**, a human evaluator can check:

* Is the answer **factually correct**?
* Did it use the right Salesforce/ServiceNow information?
* Is the answer **grounded in retrieved evidence**?
* Did it miss an important incident?
* Are citations correct?
* Is the response relevant and complete?
* Did the Coordinator select the correct Delegators?
* Did the Worker use the correct MCP tools?
* Did the system appropriately say **"I don't have enough information"** instead of guessing?

### Human evaluation vs automated evaluation

| Automated evaluation                   | Human evaluation                                        |
| -------------------------------------- | ------------------------------------------------------- |
| Runs at large scale                    | Smaller sample                                          |
| Fast and continuous                    | Slower                                                  |
| RAGAS/custom evaluators                | Domain experts/users                                    |
| Good for regression                    | Good for nuanced judgment                               |
| Measures groundedness, relevance, etc. | Validates whether metrics reflect real business quality |
| Used in CI/CD and production           | Used for difficult/ambiguous cases                      |

### Where humans are triggered

I wouldn't send every request to a human. I would use **risk/confidence-based sampling**.

For example:

```text
CWD Response
     ↓
Automated checks
     ↓
Confidence / Risk
     ├── High quality → Return
     ├── Low confidence → Human review
     ├── Security-sensitive → Human review
     ├── Conflicting evidence → Human review
     └── Random sample → Human review
```

For high-risk actions, such as creating or modifying an enterprise record, human approval can also be part of the **execution workflow**, separate from evaluation.

### Human feedback becomes training/evaluation data

This is very important.

Suppose a reviewer marks:

```text
Expected:
INC1001 = Open

CWD Response:
INC1001 = Resolved

Human evaluation:
❌ Incorrect
Reason: Model used stale retrieved context
```

I can then use that failure to:

1. Investigate retrieval/model behavior.
2. Fix the RAG, prompt, or workflow.
3. Add the case to the **golden dataset**.
4. Run it in regression testing.
5. Monitor whether the problem reappears in production.

```text
Human Feedback
      ↓
Failure Analysis
      ↓
Fix
      ↓
Golden Dataset
      ↓
Regression Test
      ↓
CI/CD Quality Gate
      ↓
Production
```

### Interview-ready answer

> **“Human evaluation is the quality-validation layer in my CWD system. Automated evaluation handles large-scale metrics such as groundedness, relevance, routing accuracy, and tool-call accuracy, but humans are important for ambiguous, high-risk, or nuanced cases. I use domain experts to review sampled responses, low-confidence outputs, failures, and security-sensitive scenarios. Their feedback is captured with the trace and correlation ID, and important failures are converted into golden test cases for regression testing. So human evaluation is not a replacement for automated evaluation; it helps validate the automated metrics and continuously improve the system.”**

**Easy memory:**
**Automated evaluation = scale. Human evaluation = judgment. Human feedback → golden dataset → regression → improvement.**
