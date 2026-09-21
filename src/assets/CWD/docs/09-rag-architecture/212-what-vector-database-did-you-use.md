## What vector database did you use?

For your **CWD Azure architecture**, the best answer is:

> **“We used Azure AI Search as our primary vector search and retrieval layer. We stored document chunks, embeddings, metadata, and ACL information there. We also used Redis for fast application/session state, but Redis was not our primary document vector store.”**

### CWD flow

```text
Enterprise Documents
       ↓
Chunking
       ↓
Azure OpenAI Embeddings
       ↓
Azure AI Search
       ↓
Vector + Keyword/Hybrid Search
       ↓
Relevant Chunks
       ↓
LLM
```

### What did Azure AI Search store?

Each indexed record could contain:

```text
{
  "document_id": "DOC123",
  "chunk_id": "DOC123_05",
  "content": "Cooling module failure...",
  "embedding": [0.012, -0.034, ...],
  "source": "SharePoint",
  "page": 5,
  "department": "Engineering",
  "acl": ["Engineering"]
}
```

This allows us to perform:

* **Vector search** → semantic similarity
* **Keyword/BM25 search** → exact terms
* **Hybrid search** → both
* **Metadata filtering**
* **ACL/security filtering**

### Why Azure AI Search?

Because CWD is Azure-centric and we needed more than just vector similarity. We needed:

```text
Vector Search
      +
Keyword Search
      +
Semantic Ranking
      +
Metadata Filtering
      +
ACL Filtering
```

### Important distinction

Don't say:

> “Redis was our vector database.”

If you're describing the CWD architecture we've been using, say:

> **Azure AI Search = RAG/vector retrieval**
> **Redis/Cosmos DB = state, cache, workflow persistence**

### 🎯 Strong interview answer

> **“For CWD, we used Azure AI Search as the primary vector search layer. We stored document chunks, embeddings, metadata, and ACL information in the search index. We used hybrid retrieval combining vector and keyword search, along with metadata and security filtering. Redis was used for fast state or caching rather than as the primary document vector store.”**

### Easy memory trick

**Azure AI Search → RAG + Vector Search**
**Redis → Cache/fast state**
**Cosmos DB → Durable application/workflow state**
