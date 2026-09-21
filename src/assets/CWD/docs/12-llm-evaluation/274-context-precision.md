## What is Context Precision?

**Context precision measures how much of the retrieved context is actually relevant to the user's question, especially whether the relevant chunks are ranked near the top.**

In simple terms:

> **“Of the information I retrieved, how much of it is useful?”**

### CWD example

User asks:

> **“What are the open incidents for customer C12345?”**

RAG retrieves 5 chunks:

```text id="q2j7mx"
Rank 1 → C12345 Incident INC1001 — Open       ✅
Rank 2 → C12345 Incident INC1002 — Resolved   ⚠️
Rank 3 → C12345 Customer Profile              ⚠️
Rank 4 → Employee Leave Policy                ❌
Rank 5 → Network Troubleshooting Guide        ❌
```

The first few results contain the useful incident information, but some irrelevant context is also included.

### Why does ranking matter?

Suppose:

```text id="9h2k4p"
Query: "Open incidents for C12345"

Top 3:
1. Relevant ✅
2. Relevant ✅
3. Irrelevant ❌
```

This is better than:

```text id="7n5m1c"
Top 3:
1. Irrelevant ❌
2. Irrelevant ❌
3. Relevant ✅
```

Even though both might contain one relevant document, the **first ranking is more useful to the LLM**.

---

## Context Precision vs Retrieval Relevance

They are closely related, but context precision emphasizes **the proportion and ranking of relevant retrieved context**.

```text
Retrieval relevance
→ Is the retrieved information relevant?

Context precision
→ How much of the retrieved information is relevant,
  particularly near the top?
```

### Simple example

If I retrieve 5 chunks:

```text
4 relevant
1 irrelevant
```

A simple precision calculation is:

```text
4 / 5 = 80%
```

For formal RAG evaluation, context precision metrics can account for the **rank position** of relevant chunks rather than simply counting relevant vs. irrelevant chunks.

---

## CWD example with Azure AI Search

```text id="1j6m9r"
User Query
   ↓
Hybrid Search
(BM25 + Vector)
   ↓
Top 20 candidates
   ↓
Semantic Reranker
   ↓
Top 5 context chunks
   ↓
LLM
```

I evaluate whether those top 5 chunks are relevant.

If irrelevant chunks dominate the top results, I investigate:

* Chunk size
* Chunk overlap
* Embedding model
* Query formulation
* BM25/vector weighting
* Metadata filters
* Semantic reranking
* Top-K value
* Document quality

---

### Context Precision vs Context Recall

This is a very common interview question.

**Context Precision:**

> Of what I retrieved, how much was relevant?

**Context Recall:**

> Of the relevant information that exists, how much did I successfully retrieve?

Example:

```text id="4v7s2n"
There are 10 relevant chunks in the knowledge base.

Retrieved 5 chunks:
4 are relevant.
```

Then:

```text
Precision = 4 / 5 = 80%

Recall = 4 / 10 = 40%
```

So you have **good precision but poor recall**.

---

## Interview-ready answer

> **“Context precision measures how much of the retrieved context is relevant to the user's query, with emphasis on whether relevant information appears high in the ranking. In CWD, I evaluate the top-K chunks returned by Azure AI Search and check whether they contain the information needed to answer the question. Low context precision means we're giving the LLM too much irrelevant information, which can increase noise and hallucination risk. I improve it using hybrid search, semantic reranking, metadata and ACL filtering, and better chunking.”**

### Easy memory

**Context Precision = “Of what I retrieved, how much was useful?”**

**Context Recall = “Of what I needed, how much did I retrieve?”**
