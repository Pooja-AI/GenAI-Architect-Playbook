## What is NDCG?

**NDCG = Normalized Discounted Cumulative Gain.**

It measures **how well the search results are ranked when documents have different levels of relevance.**

In simple words:

> **“Are the most relevant documents placed near the top?”**

### Why do we need NDCG?

Unlike Precision, not every relevant document is equally useful.

For example:

```text
5 = Highly relevant
3 = Partially relevant
1 = Slightly relevant
0 = Not relevant
```

Suppose CWD retrieves:

```text id="x7m2pk"
Rank 1 → Highly relevant     → 5
Rank 2 → Slightly relevant   → 1
Rank 3 → Highly relevant     → 5
Rank 4 → Not relevant        → 0
Rank 5 → Partially relevant  → 3
```

A good retrieval system should ideally put the **5s near the top**.

NDCG rewards that behavior.

---

## What does "Discounted" mean?

A relevant result at **Rank 1** is more valuable than the same result at **Rank 5**.

Conceptually:

```text id="3dy9pp"
Rank 1 → High value
Rank 2 → Slightly lower
Rank 3 → Lower
Rank 4 → Lower
...
```

So NDCG gives **more importance to higher-ranked results**.

---

## What does "Normalized" mean?

Different queries can have different numbers of relevant documents.

NDCG normalizes the score against the **ideal ranking**.

The result is typically between:

```text id="0w2wqf"
0 → Poor ranking
1 → Ideal ranking
```

**NDCG@10** means we're evaluating the ranking quality of the first 10 results.

---

## CWD example

Query:

> **"Why did customer C123 experience A100 overheating?"**

Suppose we have:

```text id="u3kz8e"
Chunk A → highly relevant       = 5
Chunk B → irrelevant            = 0
Chunk C → highly relevant       = 5
Chunk D → somewhat relevant     = 3
```

### Ranking 1 — Good

```text
A(5)
C(5)
D(3)
B(0)
```

Highly relevant chunks are near the top → **high NDCG**.

### Ranking 2 — Poor

```text
B(0)
D(3)
A(5)
C(5)
```

The highly relevant chunks are lower → **lower NDCG**.

Both rankings contain the same documents, but **NDCG prefers Ranking 1**.

---

## NDCG vs MRR

This is a common interview comparison:

| Metric          | Focus                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| **MRR**         | Position of the **first relevant result**                               |
| **NDCG**        | Ranking quality of **multiple results with different relevance levels** |
| **Precision@K** | Percentage of Top-K that is relevant                                    |
| **Recall@K**    | Percentage of relevant documents retrieved                              |

### 🎯 Strong interview answer

> **“NDCG, or Normalized Discounted Cumulative Gain, measures ranking quality when retrieved documents have different degrees of relevance. It gives more weight to highly relevant documents appearing near the top and discounts documents appearing lower in the ranking. In CWD, we can use NDCG@K to evaluate whether hybrid retrieval and semantic reranking are putting the most relevant enterprise chunks at the top.”**

### Easy memory trick

**MRR → First relevant result**
**NDCG → Overall ranking quality**

Or:

> **“NDCG asks: Are my best results at the top?”**
