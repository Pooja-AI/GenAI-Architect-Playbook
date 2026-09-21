## What is Semantic Ranking?

**Semantic ranking re-ranks the search results based on the meaning and relevance of the query**, rather than relying only on keyword or vector similarity scores.

Think of it as:

> **Search finds candidates → Semantic ranking puts the most relevant ones first.**

### CWD example

User asks:

> **“Why did customer C123 experience overheating?”**

Search may initially return:

```text
1. Cooling system troubleshooting
2. Customer C123 incident report
3. General product documentation
4. Thermal management guide
```

Semantic ranking analyzes the **query and retrieved content** and may determine that:

```text
1. Customer C123 incident report
2. Cooling system troubleshooting
3. Thermal management guide
4. General product documentation
```

The goal is to put the most useful content at the top.

### Where it fits

```text id="4q0n6x"
User Query
    ↓
BM25 + Vector Search
    ↓
Candidate Documents
    ↓
Semantic Ranking
    ↓
Top Relevant Chunks
    ↓
ACL / Metadata Filtering
    ↓
LLM
```

In Azure AI Search, semantic ranking is a **reranking stage** on top of the initial retrieval results.

### BM25 vs Vector vs Semantic Ranking

| Technique            | Main purpose                                               |
| -------------------- | ---------------------------------------------------------- |
| **BM25**             | Find keyword matches                                       |
| **Vector Search**    | Find semantic similarity                                   |
| **Semantic Ranking** | Re-rank candidates based on deeper query/content relevance |

### 🎯 Strong interview answer

> **“Semantic ranking is a second-stage ranking mechanism that improves the ordering of retrieved documents based on their semantic relevance to the user's query. In CWD, we first retrieve candidates using hybrid BM25 and vector search, then use semantic ranking to prioritize the most relevant results before passing the final context to the LLM.”**

### Easy memory trick

**BM25 → Find by words**
**Vector → Find by meaning**
**Semantic Ranker → Put the best results first**


Yes. In RAG, **reranking algorithms** are used after the initial retrieval step to reorder the retrieved chunks so the most relevant chunks are passed to the LLM.

### Common RAG reranking approaches

| Reranker                         | How it works                                         | Example                       |
| -------------------------------- | ---------------------------------------------------- | ----------------------------- |
| **Cross-Encoder**                | Reads query + document together and scores relevance | `ms-marco-MiniLM-L-6-v2`      |
| **Cohere Rerank**                | LLM-based semantic relevance scoring                 | Cohere Rerank                 |
| **BGE Reranker**                 | Cross-encoder style semantic reranking               | `BAAI/bge-reranker`           |
| **LLM-based reranking**          | LLM evaluates query-document relevance               | GPT-based scoring             |
| **Azure Semantic Ranker**        | Azure AI Search semantic reranking                   | Used in your CWD architecture |
| **Reciprocal Rank Fusion (RRF)** | Combines rankings from different retrieval methods   | BM25 + Vector                 |

### Where reranking fits in your CWD RAG

```text
User Query
    ↓
BM25 Search ─────┐
                 ├──→ Hybrid Retrieval
Vector Search ───┘
                       ↓
                  Top 50 chunks
                       ↓
                 Reranker
                       ↓
                  Top 5–10
                       ↓
                     LLM
```

### Example

Query:

> "Why did customer C123 experience overheating?"

Initial retrieval:

```text
Chunk A → score 0.81
Chunk B → score 0.79
Chunk C → score 0.76
Chunk D → score 0.74
```

A reranker examines the **query + actual chunk content together** and might reorder them:

```text
Chunk C → 0.96  ← directly discusses C123 overheating
Chunk A → 0.91
Chunk D → 0.68
Chunk B → 0.51
```

Then only the highest-ranked chunks go to the LLM.

### Important interview distinction

**RRF is not really a semantic reranker.** It is a **rank-fusion algorithm** that combines rankings from different retrieval methods.

For example:

```text
BM25 ranking
      +
Vector ranking
      ↓
     RRF
      ↓
Combined ranking
```

Then you can apply a **semantic/cross-encoder reranker** afterward.

### 🎯 Strong interview answer

> **“Yes. Common RAG reranking approaches include cross-encoders, BGE or Cohere rerankers, LLM-based reranking, and Azure Semantic Ranker. RRF is used for rank fusion rather than semantic reranking. In our CWD architecture, we use hybrid BM25 plus vector retrieval, followed by semantic ranking to improve the relevance of the final context sent to the LLM.”**

**Memory trick:**
**Retrieve → Fuse → Rerank → Generate**.
