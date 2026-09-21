## What is Context Recall?

**Context recall measures how much of the relevant information that exists in the knowledge base was successfully retrieved by the RAG system.**

In simple terms:

> **“Did I retrieve all the important information needed to answer the question?”**

### CWD example

User asks:

> **“Give me all open incidents for customer C12345.”**

Suppose the source of truth contains **5 relevant incident records**:

```text id="9y7x3p"
INC1001 → Open
INC1002 → Open
INC1003 → Resolved
INC1004 → Open
INC1005 → Open
INC1006 → Open
```

Assume there are **5 relevant open incidents**:

```text
INC1001
INC1002
INC1004
INC1005
INC1006
```

But RAG retrieves only:

```text id="g6b2m1"
INC1001
INC1002
INC1004
```

Then:

```text id="j9f4xq"
Context Recall = Relevant information retrieved
                 ───────────────────────────────
                 Total relevant information

              = 4 / 5
              = 80%
```

So **20% of the relevant information was missed**.

---

## Why is context recall important?

Low recall can cause the LLM to produce an incomplete answer.

For example, the user asks:

> "What are all the open incidents?"

But RAG retrieves only 4 of 5 incidents.

The LLM may correctly summarize those 4 incidents, but the answer is still **incomplete**.

This is why:

> **Good faithfulness does not necessarily mean complete retrieval.**

---

## Context Recall vs Context Precision

This is a very common interview question.

| Metric                | Question                                      |
| --------------------- | --------------------------------------------- |
| **Context Precision** | Of what I retrieved, how much is relevant?    |
| **Context Recall**    | Of what is relevant, how much did I retrieve? |

Example:

```text id="n8z4rm"
Knowledge base:
10 relevant chunks

Retrieved:
5 chunks
4 are relevant
```

Then:

```text id="s0k2vw"
Precision = 4 / 5 = 80%

Recall = 4 / 10 = 40%
```

So:

* **Precision = 80%** → retrieval has relatively little noise.
* **Recall = 40%** → retrieval missed a lot of relevant information.

---

## How I improve context recall in CWD

If recall is low, I investigate:

```text id="x2m8qp"
Low Context Recall
       ↓
Check query formulation
       ↓
Hybrid BM25 + Vector Search
       ↓
Increase candidate Top-K
       ↓
Semantic Reranking
       ↓
Improve chunking
       ↓
Metadata/filter review
       ↓
Query expansion
       ↓
Evaluate again
```

For example, instead of relying only on vector similarity, CWD can combine:

```text id="j3c6sv"
BM25 keyword search
        +
Vector similarity
        +
Semantic ranking
        +
Metadata filtering
```

This can improve retrieval coverage for enterprise terminology such as:

* Customer IDs
* Incident IDs
* Product names
* Error codes
* Technical terms

---

## Important distinction

**Context recall is not the same as answer recall.**

You can retrieve all relevant evidence but still have the LLM omit some of it.

```text id="p8y4wt"
Knowledge Base
     ↓
Retrieve all relevant evidence
     ↓
High Context Recall ✅
     ↓
LLM
     ↓
Misses one important fact
     ↓
Incomplete Answer ❌
```

So I evaluate both **retrieval quality** and **final answer quality**.

---

## Interview-ready answer

> **“Context recall measures how much of the relevant information available in the knowledge base was successfully retrieved. For example, if five relevant incidents exist for a customer and our RAG retrieves four, context recall is 80%. Low recall means the LLM may not receive all the evidence required to answer completely. In CWD, I improve recall using hybrid BM25 plus vector search, appropriate top-K, semantic reranking, query expansion, good chunking, and careful metadata filtering.”**

### Easy memory

**Context Precision:**

> *“Of what I retrieved, how much is relevant?”*

**Context Recall:**

> *“Of what is relevant, how much did I retrieve?”*
