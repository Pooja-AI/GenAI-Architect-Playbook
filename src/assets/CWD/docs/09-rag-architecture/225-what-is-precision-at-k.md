## What is Precision@K?

**Precision@K measures how many of the top K retrieved documents are actually relevant.**

In simple words:

> **“Of the documents I retrieved, how many were useful?”**

### Formula

**Precision@K = Relevant documents in Top-K / K**

### Example

Suppose CWD retrieves the **Top-10** chunks for:

> “Why did customer C123 experience overheating?”

Out of those 10 chunks:

```text
Top 10 retrieved
├── DOC1 ✅ Relevant
├── DOC2 ✅ Relevant
├── DOC3 ❌ Irrelevant
├── DOC4 ✅ Relevant
├── DOC5 ❌ Irrelevant
├── DOC6 ✅ Relevant
├── DOC7 ❌ Irrelevant
├── DOC8 ✅ Relevant
├── DOC9 ❌ Irrelevant
└── DOC10 ❌ Irrelevant
```

There are **5 relevant chunks**.

So:

**Precision@10 = 5 / 10 = 50%**

That means **50% of what we retrieved was relevant**.

---

### Why does Precision@K matter in RAG?

If precision is low:

```text
Top 10 chunks
   ↓
Many irrelevant chunks
   ↓
More noise in LLM context
   ↓
Higher token usage
   ↓
Potentially poorer answer
```

So we want the retrieved context to contain as much relevant information as possible.

---

## Recall@K vs Precision@K

This is very important for interviews:

| Metric          | Question                                  |
| --------------- | ----------------------------------------- |
| **Recall@K**    | How much relevant information did I find? |
| **Precision@K** | How much of what I found was relevant?    |

Example:

```text
There are 5 relevant documents in total.

Retrieved Top-10:
4 relevant + 6 irrelevant
```

**Recall@10 = 4 / 5 = 80%**

**Precision@10 = 4 / 10 = 40%**

So:

> **High Recall = don't miss important information.**
> **High Precision = don't add unnecessary information.**

### 🎯 Strong interview answer

> **“Precision@K measures the percentage of the top K retrieved results that are actually relevant. For example, if we retrieve 10 chunks and 6 are relevant, Precision@10 is 60%. In CWD, we use Precision@K to reduce irrelevant context and improve the quality and efficiency of the information passed to the LLM.”**

### Easy memory trick

**Recall → Did I find enough?**
**Precision → Did I find the right things?**
