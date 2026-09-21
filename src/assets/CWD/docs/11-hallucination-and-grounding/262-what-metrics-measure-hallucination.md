## What metrics measure hallucination?

There isn't one universal **“hallucination score.”** In a production CWD system, I measure hallucination mainly through **groundedness/faithfulness, factual correctness, and unsupported-claim rate**.

### Key metrics

| Metric                          | What it measures                                                           | CWD example                                      |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------ |
| **Faithfulness / Groundedness** | Are answer claims supported by retrieved evidence?                         | LLM says only what ServiceNow/RAG supports       |
| **Factual accuracy**            | Is the answer factually correct against the source of truth?               | Incident status matches ServiceNow               |
| **Unsupported claim rate**      | % of generated claims without supporting evidence                          | LLM invents an RCA not present in evidence       |
| **Hallucination rate**          | % of responses containing unsupported/incorrect claims                     | 5 out of 1,000 answers contain unsupported facts |
| **Context relevance**           | Whether retrieved context is relevant to the question                      | Correct customer documents retrieved             |
| **Context recall**              | Whether necessary evidence was retrieved                                   | Required incident record was retrieved           |
| **Citation correctness**        | Whether cited sources actually support the claim                           | Citation really contains the stated fact         |
| **Abstention accuracy**         | Whether system correctly says “I don't know” when evidence is insufficient | No RCA available → abstain                       |

### Example in CWD

Suppose ServiceNow returns:

```text
INC1001
Status = Open
Priority = High
```

LLM response:

> “INC1001 is a high-priority open incident caused by a database failure.”

We have:

```text
Supported:
✓ INC1001
✓ Open
✓ High priority

Unsupported:
✗ Database failure
```

So the response has an **unsupported claim**, even though part of the answer is correct.

---

### A useful production metric

I would track:

```text
Unsupported Claim Rate
=
Unsupported claims / Total factual claims
```

For example:

```text
10,000 factual claims
   ↓
120 unsupported
   ↓
1.2% unsupported-claim rate
```

The goal is to drive this rate down while monitoring that the system isn't simply abstaining excessively.

### Don't measure hallucination alone

I would monitor it together with:

```text
Groundedness
Factual Accuracy
Retrieval Recall
Retrieval Relevance
Abstention Rate
Citation Correctness
Tool-call Accuracy
```

Because a low hallucination rate could be misleading if the system simply answers **“I don't know”** to everything.

### Interview-ready answer

> **“I don't use a single metric for hallucination. In CWD, I primarily monitor faithfulness or groundedness, factual accuracy against the system of record, unsupported-claim rate, citation correctness, and appropriate abstention. For the RAG layer, I also track context relevance and context recall because poor retrieval can cause downstream hallucination. I use golden datasets and automated evaluation with tools such as RAGAS, plus production telemetry, to continuously measure these metrics.”**

### Easy memory

**Hallucination measurement = Groundedness + Factual Accuracy + Unsupported Claims + Citation Correctness + Appropriate Abstention.**
