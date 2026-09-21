## What embedding model did you use?

For your **Azure-based CWD**, a strong interview answer is:

> **“We used Azure OpenAI `text-embedding-3-large` for generating embeddings, with `text-embedding-3-small` as a lower-cost option where the retrieval requirements were less demanding.”**

### CWD flow

```text
Enterprise Document
       ↓
Extract + Chunk
       ↓
Azure OpenAI Embedding Model
       ↓
Vector Embedding
       ↓
Azure AI Search
       ↓
Hybrid Search
       ↓
RAG
       ↓
LLM
```

### Why `text-embedding-3-large`?

It provides strong semantic representation for enterprise content such as:

* technical documents
* troubleshooting guides
* policies
* knowledge articles
* product documentation

For example:

```text
"cooling module overheating"
              ↓
        embedding vector
              ↓
Azure AI Search finds:
"thermal management failure"
```

Even though the wording is different, the **semantic meaning is similar**.

### Important interview point

Don't say:

> “We selected the model because it is the best.”

Instead say:

> **“We evaluated the embedding model using retrieval metrics such as Recall@K, Precision@K, and downstream answer quality, along with latency and cost.”**

That shows an **engineering decision rather than simply choosing a model by name**.

### 🎯 Strong interview answer

> **“For CWD, we used Azure OpenAI `text-embedding-3-large` to generate embeddings for our enterprise document chunks. We stored those vectors along with metadata and ACL information in Azure AI Search. During retrieval, we combined vector search with keyword/semantic search. We evaluated the embedding model based on retrieval relevance, Recall@K, answer quality, latency, and cost rather than selecting it only based on the model specification.”**

### Easy memory trick

**Embedding model → converts text to vectors → Azure AI Search → retrieves similar meaning.**
