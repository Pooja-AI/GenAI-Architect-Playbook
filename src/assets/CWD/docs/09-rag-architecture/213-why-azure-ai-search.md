## Why Azure AI Search?

For CWD, we chose **Azure AI Search** because we needed more than just a vector database. We needed **enterprise-grade retrieval with hybrid search, metadata filtering, and security/ACL filtering**.

### Why?

```text
Azure AI Search
      |
      +-- Vector Search
      +-- Keyword/BM25 Search
      +-- Hybrid Search
      +-- Semantic Ranking
      +-- Metadata Filtering
      +-- ACL/Security Filtering
```

### Example in CWD

User asks:

> “What are the recent failure issues for customer C123?”

Azure AI Search can combine:

```text
Semantic meaning
       +
Exact keywords
       +
Customer metadata
       +
User ACL
```

and return only the **relevant and authorized chunks**.

### Why not just vector search?

Because enterprise queries often contain **exact terms**:

```text
E102
C123
OSD-4582
Product Model X100
```

Keyword search is useful for these, while vector search is better for semantic questions.

So we use:

> **Hybrid search = keyword + vector**

### 🎯 Strong interview answer

> **“We chose Azure AI Search because CWD needed enterprise retrieval capabilities beyond basic vector similarity. It supports vector search, keyword/BM25 search, hybrid retrieval, semantic ranking, metadata filtering, and ACL-based security filtering. Since our data is enterprise-specific and access-controlled, these capabilities were important for producing relevant and authorized RAG results while staying within our Azure ecosystem.”**

### Easy memory trick

**Azure AI Search = Search + Vector + Semantic + Security**

And a strong interview line:

> **“We chose the search layer based on retrieval and enterprise requirements, not simply because it supports vectors.”**
