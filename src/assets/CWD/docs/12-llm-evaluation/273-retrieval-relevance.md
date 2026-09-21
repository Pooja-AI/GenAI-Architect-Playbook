## What is Retrieval Relevance?

**Retrieval relevance measures whether the documents/chunks retrieved by RAG are actually useful for answering the user's question.**

In simple terms:

> **“Did my search retrieve the right information for this question?”**

### CWD example

User asks:

> **“What is the current support policy for premium customers?”**

Azure AI Search retrieves:

```text id="v9d2xk"
E1 → Premium Customer Support Policy      ✅ Relevant
E2 → Standard Customer Support Policy     ⚠️ Partially relevant
E3 → Employee Leave Policy                ❌ Irrelevant
E4 → IT Network Troubleshooting Guide     ❌ Irrelevant
```

The goal is for the top results to contain information directly related to the question.

---

### How do you measure it?

A simple evaluation approach is:

```text id="p6xq1v"
Relevant retrieved documents
──────────────────────────────
Total retrieved documents
```

For example:

```text id="4w7k3m"
Top 5 retrieved chunks

4 relevant
1 irrelevant

Relevance = 4 / 5 = 80%
```

For more formal evaluation, I can use metrics such as:

* **Precision@K** — How many of the top K results are relevant?
* **Recall@K** — Did we retrieve the relevant information that exists?
* **NDCG@K** — Are the most relevant results ranked higher?
* **Context relevance** — Is the retrieved context relevant to the question?

---

### CWD RAG flow

```text id="x3f6bn"
User Query
    ↓
Query Understanding
    ↓
Hybrid Search
(BM25 + Vector)
    ↓
Metadata / ACL Filtering
    ↓
Semantic Reranking
    ↓
Top-K Results
    ↓
Relevance Evaluation
    ↓
LLM
```

For CWD, I use **hybrid search + semantic ranking + metadata/ACL filtering** to improve the chance that the retrieved context is both relevant and authorized.

---

### Retrieval relevance vs faithfulness

These are different.

**Retrieval relevance:**

> Did I retrieve the right evidence?

**Faithfulness:**

> Did the LLM answer using that evidence correctly?

Example:

```text
User asks:
"What is the premium customer response SLA?"

Retrieved:
"Premium customers receive a 4-hour response SLA."
```

That's **relevant retrieval**.

If the LLM responds:

> "Premium customers receive a 4-hour response SLA."

That's also **faithful**.

But if it says:

> "Premium customers receive a 24-hour response SLA."

Then retrieval was relevant, but the **LLM response was not faithful**.

---

### Interview-ready answer

> **“Retrieval relevance measures whether the documents or chunks returned by the RAG system are actually relevant to the user's query. In CWD, I evaluate it using metrics such as Precision@K, Recall@K, NDCG@K, and context relevance. For example, if a customer-support query retrieves four relevant chunks out of the top five, the retrieval precision is 80%. I improve relevance using hybrid BM25 plus vector search, semantic reranking, metadata filtering, ACL filtering, and appropriate chunking.”**

### Easy memory

**Retrieval relevance = “Did I retrieve the right evidence?”**

**Faithfulness = “Did the LLM use that evidence correctly?”**
