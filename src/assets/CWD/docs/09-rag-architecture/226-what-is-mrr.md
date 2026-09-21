## What is MRR?

**MRR = Mean Reciprocal Rank.**

It measures **how high the first relevant result appears in the retrieved results**.

In simple words:

> **“How quickly do I find the first useful document?”**

### Example

Suppose a CWD query returns:

```text id="9f2q6a"
Rank 1 → Irrelevant ❌
Rank 2 → Irrelevant ❌
Rank 3 → Relevant ✅
Rank 4 → Irrelevant
Rank 5 → Relevant
```

The **first relevant result is at Rank 3**.

So:

**Reciprocal Rank = 1 / 3 = 0.33**

If the first relevant result were Rank 1:

**MRR = 1 / 1 = 1.0**

If it were Rank 5:

**MRR = 1 / 5 = 0.20**

So **higher MRR means relevant results tend to appear earlier.**

---

## Why "Mean" Reciprocal Rank?

MRR is calculated across **multiple queries**.

Example:

| Query | First relevant result | Reciprocal Rank |
| ----- | --------------------: | --------------: |
| Q1    |                Rank 1 |            1.00 |
| Q2    |                Rank 2 |            0.50 |
| Q3    |                Rank 4 |            0.25 |

Then:

**MRR = (1.00 + 0.50 + 0.25) / 3 = 0.58**

---

## MRR in your CWD RAG

Suppose you compare:

```text id="x9b2jd"
BM25              → MRR = 0.62
Vector Search     → MRR = 0.71
Hybrid Search     → MRR = 0.82
Hybrid + Reranker → MRR = 0.91
```

These numbers are just an **illustrative example**. The important point is that MRR helps you determine whether your retrieval/reranking strategy puts the first useful chunk near the top.

### MRR vs Recall@K vs Precision@K

| Metric          | Measures                                   |
| --------------- | ------------------------------------------ |
| **Recall@K**    | Did we retrieve the relevant information?  |
| **Precision@K** | How many retrieved results are relevant?   |
| **MRR**         | How high is the **first relevant result**? |

### 🎯 Strong interview answer

> **“MRR, or Mean Reciprocal Rank, measures how highly the first relevant result appears in the ranking. If the first relevant document is at rank 1, the reciprocal rank is 1; if it's at rank 5, it's 0.2. We average this across queries. In CWD, MRR helps us evaluate whether our hybrid retrieval and reranking are putting useful enterprise information near the top.”**

### Easy memory trick

**Recall = Did I find it?**
**Precision = Is it relevant?**
**MRR = How high did I find it?**
