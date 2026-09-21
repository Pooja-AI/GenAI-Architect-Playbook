## Vector Search vs BM25

The easiest way to remember:

> **BM25 = matches words**
> **Vector Search = matches meaning**

### Example

User asks:

> **“Why is the device getting too hot?”**

Suppose the document says:

> “The equipment is experiencing a thermal management failure.”

**BM25:** may give a lower score because the exact words *“getting too hot”* don't appear.

**Vector search:** can find it because *“getting too hot”* and *“thermal management failure”* are semantically related.

---

### Comparison

|                            | BM25              | Vector Search      |
| -------------------------- | ----------------- | ------------------ |
| Based on                   | Keywords          | Semantic meaning   |
| Exact terms                | Excellent         | Good               |
| Similar meaning            | Limited           | Excellent          |
| Customer IDs               | Excellent         | Not ideal alone    |
| Error codes                | Excellent         | Not ideal alone    |
| Natural-language questions | Good              | Excellent          |
| Uses embeddings            | No                | Yes                |
| CWD usage                  | Exact identifiers | Semantic retrieval |

### CWD example

Query:

> **“What happened to customer C123 with error E102?”**

BM25 is useful for finding:

```text
C123
E102
```

Vector search can find documents discussing:

```text
thermal failure
overheating
temperature issue
cooling problem
```

So we combine them:

```text id="8i6s5r"
                 Query
                   ↓
          ┌────────┴────────┐
          ↓                 ↓
        BM25            Vector Search
       Keywords            Meaning
          ↓                 ↓
          └────────┬────────┘
                   ↓
              Hybrid Search
                   ↓
            Ranked Results
```

### 🎯 Strong interview answer

> **“BM25 is keyword-based search, so it's strong for exact terms such as customer IDs, error codes, and ticket numbers. Vector search uses embeddings to find semantically similar content even when the wording is different. In CWD, we use hybrid search because enterprise queries contain both exact identifiers and natural-language concepts. Combining BM25 and vector search gives us better retrieval coverage and relevance.”**

### Easy memory trick

**BM25 → “Does it contain my words?”**
**Vector → “Does it understand my meaning?”**
**Hybrid → “Give me both.”**
