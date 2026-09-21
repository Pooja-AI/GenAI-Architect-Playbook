## How do you reduce irrelevant context?

In RAG, **irrelevant context means retrieved chunks that don't actually help answer the user's question.**

In CWD, I reduce it through **filtering + better retrieval + reranking + context optimization**.

### CWD approach

```text id="x3w8k2"
User Query
    ↓
Query Understanding
    ↓
ACL + Metadata Filtering
    ↓
Hybrid Search
(BM25 + Vector)
    ↓
Top 30–50 candidates
    ↓
Semantic Reranking
    ↓
Top 5–10 chunks
    ↓
Deduplication
    ↓
Context Relevance Check
    ↓
Token Budget
    ↓
LLM
```

### 1. Metadata filtering

Filter before retrieval.

For example:

```text id="j8v2kd"
customer_id = C123
product = A100
department = Engineering
region = US
```

This prevents unrelated documents from entering the candidate set.

---

### 2. Use hybrid retrieval

Use both:

**BM25** → exact terms

```text
C123
INC1001
A100
E102
```

**Vector search** → semantic meaning

```text
"device getting too hot"
↔
"thermal management failure"
```

This gives better retrieval coverage than relying on only one method.

---

### 3. Use semantic reranking

Instead of sending the first 50 retrieved chunks to the LLM:

```text id="y1k3nz"
50 candidates
      ↓
Semantic reranker
      ↓
Top 5–10
      ↓
LLM
```

The reranker evaluates which chunks are actually most relevant to the query.

---

### 4. Improve chunking

Bad chunking can create irrelevant context.

Instead of:

```text id="9v8s5m"
Random 500-token chunks
```

I prefer:

```text id="4y7m0p"
Heading
   ↓
Related paragraphs
   ↓
Complete logical section
```

For CWD, I would start around **500–700 tokens with 10–15% overlap** and tune using retrieval evaluation.

---

### 5. Remove duplicates

Sometimes multiple chunks contain almost identical information.

```text id="n5c7rx"
Chunk A → Cooling fan failed
Chunk B → Cooling fan failure
Chunk C → Cooling fan failure
```

Don't send all three if one or two provide the necessary evidence.

Use deduplication or similarity-based filtering.

---

### 6. Control Top-K

Don't blindly send 20–50 chunks to the LLM.

For example:

```text id="v7m2kd"
Retrieve Top-50
      ↓
Rerank
      ↓
Select Top-5
      ↓
LLM
```

The exact K should be determined through evaluation rather than assuming one value works for every query.

---

### 7. Context compression

If a retrieved chunk is large but only one part answers the question:

```text id="c9q2ka"
Large document
      ↓
Relevant sentences/sections
      ↓
Compressed context
      ↓
LLM
```

This reduces token usage and noise.

---

### 8. Evaluate the changes

I would measure:

```text id="8j4pqm"
Context Precision
Context Recall
MRR
NDCG
Faithfulness
Answer Relevancy
```

For example, if Context Precision improves after adding semantic reranking, that indicates we're sending less irrelevant information to the LLM.

---

## 🎯 Strong interview answer

> **“I reduce irrelevant context at multiple stages. First, I apply ACL and metadata filtering to restrict the search space. Then I use hybrid BM25 and vector retrieval to improve relevance, followed by semantic reranking to select the strongest candidates. I also use good semantic chunking, deduplicate similar chunks, control Top-K, and compress large contexts when necessary. Finally, I validate the approach using context precision, recall, NDCG, faithfulness, and answer relevance.”**

### Easy memory trick

**Filter → Retrieve → Rerank → Deduplicate → Compress → Generate**

The key interview line:

> **“Don't give the LLM everything you retrieved; give it the smallest set of authorized, highly relevant evidence needed to answer the question.”**
