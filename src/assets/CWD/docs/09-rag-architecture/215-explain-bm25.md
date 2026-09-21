## Explain BM25

**BM25 is a keyword-based search algorithm** used to rank documents based on how well their words match the user's query.

Think of it as:

> **“How strongly does this document match the exact words in my query?”**

### Simple example

User asks:

> **“E102 overheating customer C123”**

Suppose we have:

```text
Document A:
Customer C123 experienced E102 overheating.

Document B:
Customer C456 had a network connectivity issue.

Document C:
Thermal management problems can cause overheating.
```

BM25 gives higher relevance to **Document A** because it contains several important query terms:

```text
C123 ✓
E102 ✓
overheating ✓
```

### How BM25 decides relevance

It mainly considers:

1. **Term Frequency (TF)**
   How often does the query term appear?

2. **Inverse Document Frequency (IDF)**
   How rare/important is the term across the collection?

3. **Document length**
   It normalizes for document size so long documents don't automatically win just because they contain more words.

### Why BM25 is useful in CWD

Enterprise queries often contain exact identifiers:

```text
Customer ID → C123
Error code  → E102
Ticket ID   → INC45821
Product     → X100
```

Vector search might understand the meaning, but **BM25 is very good at exact keyword matching**.

That's why we use it together with vector search:

```text id="m5xq6c"
                 Query
                   ↓
          ┌────────┴────────┐
          ↓                 ↓
       BM25             Vector Search
   Exact matching       Meaning matching
          ↓                 ↓
          └────────┬────────┘
                   ↓
             Hybrid Ranking
                   ↓
             Relevant Chunks
```

### 🎯 Strong interview answer

> **“BM25 is a keyword-based ranking algorithm. It scores documents based on factors such as how frequently query terms appear, how rare those terms are across the collection, and document length. In CWD, BM25 is especially useful for exact terms like customer IDs, error codes, and ticket numbers, while vector search captures semantic meaning. We combine both through hybrid search to improve retrieval quality.”**

### Easy memory trick

**BM25 = Exact keyword relevance**

**BM25 → Words**
**Vector → Meaning**
**Hybrid → Words + Meaning**
