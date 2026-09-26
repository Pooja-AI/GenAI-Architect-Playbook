### Why hybrid search instead of vector-only?

Because enterprise queries often contain **exact terms** as well as **semantic meaning**.

* **Vector search** → finds semantically similar content.
* **BM25/keyword search** → handles exact terms, IDs, error codes, product names, ticket numbers, etc.
* **Hybrid search** → combines both and improves retrieval quality.
* We can then use **semantic reranking** to select the most relevant documents.

**Example:**

```text
Query: "ServiceNow INC0012345 for customer C123"

Vector → understands the meaning
BM25    → matches exact INC0012345 and C123
Hybrid  → combines both
Reranker → selects the best results
```

**Interview answer:**

> “We used hybrid search because enterprise queries contain both semantic questions and exact identifiers. Vector-only search can miss exact IDs, ticket numbers, product names, or error codes, while keyword-only search can miss semantic meaning. So we combined BM25 and vector search, followed by semantic reranking, to improve retrieval accuracy.”
