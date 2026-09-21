## What is Recall@K?

**Recall@K measures how many of the relevant documents we successfully retrieved within the top K results.**

In simple words:

> **“Out of everything that should have been retrieved, how much did we actually retrieve?”**

### Formula

**Recall@K = Relevant documents retrieved in Top-K / Total relevant documents**

### Example

Suppose for a CWD question:

> **“Why did customer C123 experience overheating?”**

Our golden dataset says there are **5 relevant chunks**:

```text
DOC1 ✅
DOC2 ✅
DOC3 ✅
DOC4 ✅
DOC5 ✅
```

Our retrieval system returns the **Top-10** results, and we find 4 of those 5 relevant chunks:

```text
Top 10
 ├── DOC1 ✅
 ├── DOC7
 ├── DOC3 ✅
 ├── DOC9
 ├── DOC5 ✅
 ├── DOC8
 ├── DOC2 ✅
 ├── DOC10
 ├── DOC11
 └── DOC12
```

So:

**Recall@10 = 4 / 5 = 80%**

That means we found **80% of the relevant information** within the first 10 results.

---

### Why is Recall@K important in RAG?

Low recall means:

```text
Relevant information exists
        ↓
Retriever misses it
        ↓
LLM never sees it
        ↓
Potentially incomplete answer
```

Even a powerful LLM **cannot use information that retrieval failed to provide**.

---

### Recall vs Precision

This is a common interview question:

| Metric          | Question                                    |
| --------------- | ------------------------------------------- |
| **Recall@K**    | Did we find the relevant information?       |
| **Precision@K** | How much of what we retrieved was relevant? |

Memory trick:

> **Recall = Don't miss relevant information.**
> **Precision = Don't retrieve too much irrelevant information.**

### 🎯 Strong interview answer

> **“Recall@K measures the percentage of all relevant documents that appear in the top K retrieved results. For example, if there are 5 relevant chunks and our Top-10 retrieval contains 4 of them, Recall@10 is 80%. In CWD, we use Recall@K to make sure our RAG pipeline isn't missing important enterprise information.”**
