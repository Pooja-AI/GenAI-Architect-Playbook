## How do you measure retrieval quality?

In RAG, **retrieval quality means: “Did we retrieve the right information for the user's question?”**

For your **CWD RAG**, I would measure it using a **golden evaluation dataset** containing questions and the expected relevant documents/chunks.

### 1. Create a golden dataset

Example:

```text
Question:
"Why did customer C123 experience overheating?"

Expected relevant chunks:
DOC123_05
DOC456_02
```

Then run the retrieval pipeline and compare the retrieved chunks with the expected ones.

---

## 2. Key retrieval metrics

### Recall@K

Measures:

> **Of all the relevant documents, how many did we retrieve in the top K?**

Example:

```text
Relevant chunks = 5
Retrieved in Top-10 = 4

Recall@10 = 4 / 5 = 80%
```

**High recall = we're not missing important information.**

---

### Precision@K

Measures:

> **Of the K documents we retrieved, how many are actually relevant?**

Example:

```text
Top-10 retrieved = 10
Relevant = 8

Precision@10 = 8 / 10 = 80%
```

**High precision = less irrelevant information.**

---

### MRR — Mean Reciprocal Rank

Measures how high the **first relevant result** appears.

Example:

```text
Rank 1 → relevant
```

Score:

```text
1 / 1 = 1.0
```

If the first relevant result is at rank 5:

```text
1 / 5 = 0.2
```

So MRR is useful when we care about getting a relevant result **near the top**.

---

### NDCG@K

Useful when there are **different levels of relevance**.

For example:

```text
5 = highly relevant
3 = partially relevant
1 = weakly relevant
0 = irrelevant
```

NDCG evaluates whether the most relevant results are ranked near the top.

---

## 3. Evaluate the complete RAG system too

Retrieval metrics alone aren't enough.

We also measure:

```text
Retrieval
   ↓
Recall@K
Precision@K
MRR
NDCG
   ↓
LLM Generation
   ↓
Groundedness
Answer Relevance
Faithfulness
   ↓
Latency + Cost
```

For example, you might have excellent retrieval but the LLM could still generate an incorrect answer.

---

## 4. CWD evaluation example

Suppose we test **100 golden questions**.

We compare:

```text
                    Target
Recall@10           ≥ 90%
Precision@10        ≥ 80%
NDCG@10             High
Answer relevance    High
Groundedness        High
```

These numbers are **illustrative targets**, not universal thresholds. We would establish the actual thresholds from CWD's business requirements and baseline evaluation.

Then compare retrieval strategies:

```text
BM25
   vs
Vector
   vs
Hybrid
   vs
Hybrid + Semantic Reranking
```

This tells us whether each retrieval improvement actually improves the system.

---

### 🎯 Strong interview answer

> **“We measure retrieval quality using a golden dataset of representative CWD questions with known relevant documents. Our primary metrics are Recall@K to measure whether we're retrieving the required information, Precision@K for relevance, and MRR or NDCG to evaluate ranking quality. We also evaluate the downstream RAG response for groundedness and answer relevance. We compare BM25, vector, hybrid, and reranked retrieval and tune chunking, embeddings, and Top-K based on those results.”**

### Easy memory trick

**Recall → Did I find the important information?**
**Precision → Did I avoid irrelevant information?**
**MRR/NDCG → Did I rank it near the top?**
**Groundedness → Did the LLM actually use the retrieved information?**
