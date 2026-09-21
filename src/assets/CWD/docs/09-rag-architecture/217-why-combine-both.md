## Why combine BM25 + Vector Search?

Because **enterprise queries contain both exact terms and semantic meaning**.

### Simple example

User asks:

> **“Why did customer C123 get error E102 due to overheating?”**

We need two types of matching:

**BM25 finds exact information:**

```text
C123
E102
```

**Vector search finds related meaning:**

```text
overheating
thermal issue
cooling failure
temperature problem
```

If we use only one:

```text
Only BM25
→ Good exact matching
→ Can miss semantically similar content

Only Vector
→ Good semantic matching
→ Can be weaker for exact IDs/codes
```

### Hybrid approach

```text id="h6l2kd"
                  Query
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
        BM25              Vector Search
     Exact terms             Meaning
          ↓                   ↓
          └─────────┬─────────┘
                    ↓
              Combine/Rank
                    ↓
             Top-K Results
                    ↓
                   LLM
```

### In CWD

This is particularly useful because enterprise data contains things like:

* Customer IDs → `C123`
* Incident IDs → `INC45821`
* Error codes → `E102`
* Product numbers → `X100`
* Technical descriptions → "thermal management failure"

BM25 handles the **identifiers**, while vector search handles the **meaning**.

### 🎯 Strong interview answer

> **“We combine BM25 and vector search because enterprise queries contain both exact identifiers and semantic concepts. BM25 is strong for exact terms like customer IDs, ticket numbers, and error codes, while vector search finds semantically related content even when the wording is different. Combining both gives us better retrieval coverage and relevance than relying on either approach alone.”**

### Easy memory trick

**BM25 = Exact**
**Vector = Meaning**
**Hybrid = Exact + Meaning → Better Retrieval**
