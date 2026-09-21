## What is RAGAS?

**RAGAS (Retrieval Augmented Generation Assessment)** is a framework for **evaluating RAG applications**.

In simple terms:

> **RAGAS tells us whether our RAG pipeline retrieved the right information and whether the LLM generated an answer based on that information.**

For your **CWD project**, you can use RAGAS to evaluate:

```text
User Question
     ↓
Retriever
     ↓
Retrieved Chunks
     ↓
LLM
     ↓
Answer
     ↓
RAGAS Evaluation
```

---

# 1. What does RAGAS evaluate?

The commonly used RAGAS metrics include:

| Metric                | What it measures                                 | Simple meaning                     |
| --------------------- | ------------------------------------------------ | ---------------------------------- |
| **Context Precision** | Relevance/ranking of retrieved context           | Did we retrieve useful chunks?     |
| **Context Recall**    | Whether required information was retrieved       | Did we miss important information? |
| **Faithfulness**      | Whether answer is supported by retrieved context | Did LLM make things up?            |
| **Answer Relevancy**  | How relevant the answer is to the question       | Did it answer the question?        |

Depending on the RAGAS version, additional metrics such as **Answer Correctness** and other specialized metrics may also be available.

---

# 2. CWD example

Suppose the user asks:

> **"Why did customer C123 experience A100 overheating?"**

Our RAG system retrieves:

### Context 1

```text
Customer C123 uses A100 equipment.
```

### Context 2

```text
Incident INC1001 reported A100 overheating.
```

### Context 3

```text
The root cause was cooling fan failure.
```

The LLM generates:

> "Customer C123 experienced overheating because the cooling fan failed, according to incident INC1001."

Now RAGAS evaluates the result.

---

# 3. Context Precision

### Question

> **Did we retrieve the relevant chunks near the top?**

Suppose retrieval returns:

```text
Chunk 1 → Cooling fan failure       ✅
Chunk 2 → A100 overheating incident ✅
Chunk 3 → HR policy                 ❌
Chunk 4 → Marketing document       ❌
```

Context precision will be lower because irrelevant context was retrieved.

**Goal: high context precision.**

---

# 4. Context Recall

### Question

> **Did we retrieve all the information needed to answer the question?**

Suppose the ground-truth answer requires:

```text
Customer = C123
Product = A100
Incident = INC1001
Root Cause = Cooling fan failure
```

But retrieval only gives:

```text
Customer = C123
Product = A100
```

We missed the root cause.

So **context recall is low**.

**Goal: high context recall.**

---

# 5. Faithfulness

This is extremely important for enterprise RAG.

It asks:

> **Is the generated answer supported by the retrieved context?**

Retrieved context:

```text
Root cause = Cooling fan failure
```

Answer:

> "The root cause was cooling fan failure."

✅ Faithful.

But if the answer says:

> "The root cause was a power-supply failure."

and the context doesn't say that:

❌ Potential hallucination / low faithfulness.

---

# 6. Answer Relevancy

It asks:

> **Does the generated answer actually answer the user's question?**

Question:

> "Why did C123 overheat?"

Good:

> "C123 overheated because the cooling fan failed."

Bad:

> "C123 is an important enterprise customer using A100 equipment."

The second statement may be true, but it doesn't answer **why** it overheated.

---

# 7. RAGAS evaluation dataset

A typical evaluation dataset contains:

```python
dataset = {
    "question": [
        "Why did customer C123 experience overheating?"
    ],

    "answer": [
        "The overheating was caused by cooling fan failure."
    ],

    "contexts": [[
        "Customer C123 uses A100 equipment.",
        "Incident INC1001 reported A100 overheating.",
        "The root cause was cooling fan failure."
    ]],

    "ground_truth": [
        "Customer C123 experienced overheating because the cooling fan failed."
    ]
}
```

Then RAGAS evaluates the RAG response.

---

# 8. RAGAS Python example

The exact imports/API can vary by **RAGAS version**, so in an interview I'd explain the concepts first. A current-style example looks like this:

```python
from datasets import Dataset

from ragas import evaluate
from ragas.metrics import (
    context_precision,
    context_recall,
    faithfulness,
    answer_relevancy
)

data = {
    "question": [
        "Why did customer C123 experience overheating?"
    ],

    "answer": [
        "Customer C123 experienced overheating because the cooling fan failed."
    ],

    "contexts": [[
        "Customer C123 uses A100 equipment.",
        "Incident INC1001 reported A100 overheating.",
        "The root cause was cooling fan failure."
    ]],

    "ground_truth": [
        "Customer C123 experienced overheating because the cooling fan failed."
    ]
}

dataset = Dataset.from_dict(data)

result = evaluate(
    dataset,
    metrics=[
        context_precision,
        context_recall,
        faithfulness,
        answer_relevancy
    ]
)

print(result)
```

You might get results conceptually like:

```text
context_precision    0.90
context_recall       0.95
faithfulness         0.98
answer_relevancy     0.94
```

These numbers are **illustrative**, not actual results from running this example.

---

# 9. How RAGAS fits into your CWD architecture

Your production flow can be:

```text
                    ┌──────────────────────┐
                    │     CWD Request      │
                    └──────────┬───────────┘
                               ↓
                         Coordinator
                               ↓
                          Delegator
                               ↓
                            Worker
                               ↓
                     Azure AI Search
                               ↓
                  BM25 + Vector + ACL
                               ↓
                         Reranking
                               ↓
                      Retrieved Context
                               ↓
                             LLM
                               ↓
                         Final Answer
                               │
                               ↓
                    ┌──────────────────┐
                    │      RAGAS       │
                    ├──────────────────┤
                    │ Context Recall   │
                    │ Context Precision│
                    │ Faithfulness     │
                    │ Answer Relevancy │
                    └──────────────────┘
```

For **offline evaluation**, I would not run RAGAS on every production request. Instead, maintain a **golden evaluation dataset** and run it during:

* prompt changes
* embedding-model changes
* chunking changes
* retrieval changes
* reranker changes
* LLM/model changes
* production release/CI-CD evaluation

---

# 10. Example: improving CWD retrieval

Suppose your initial CWD RAG evaluation gives:

```text
Context Recall       = 0.72
Context Precision    = 0.65
Faithfulness         = 0.91
Answer Relevancy     = 0.88
```

You investigate:

```text
Low Context Recall
       ↓
Chunking too small
       ↓
Important context split across chunks
```

You adjust:

```text
Chunking
500–700 tokens
10–15% overlap
semantic boundaries
```

Then test again.

Or:

```text
Low Context Precision
       ↓
Too many irrelevant chunks
       ↓
Improve hybrid retrieval
       ↓
Add semantic reranking
       ↓
Evaluate again
```

This is exactly how you demonstrate **LLM/RAG evaluation depth** in an AI Architect interview.

---

# 11. RAGAS vs Recall@K / Precision@K

This distinction is important.

### Retrieval metrics

```text
Recall@K
Precision@K
MRR
NDCG
```

These primarily evaluate **retrieval/ranking behavior**.

### RAGAS

```text
Context Recall
Context Precision
Faithfulness
Answer Relevancy
```

RAGAS evaluates the **RAG pipeline**, including the relationship between retrieved context and generated answer.

So you can say:

> **“We use retrieval metrics to diagnose the retriever and RAGAS to evaluate the end-to-end retrieval-plus-generation quality.”**

---

## 🎯 Strong interview answer

> **“RAGAS is a framework we can use to evaluate RAG systems. In CWD, I would maintain a golden dataset containing representative enterprise questions, expected answers, and relevant contexts. We evaluate context precision and recall to measure retrieval quality, faithfulness to detect unsupported generation, and answer relevancy to check whether the response addresses the question. We use these metrics during prompt, chunking, embedding, retriever, reranker, and model changes to prevent regressions.”**

### Easy memory trick

**RAGAS = Retrieval + Generation Evaluation**

Remember:

> **Context Precision → Did I retrieve useful chunks?**
> **Context Recall → Did I retrieve enough?**
> **Faithfulness → Did the answer stay grounded?**
> **Answer Relevancy → Did it answer the question?**
