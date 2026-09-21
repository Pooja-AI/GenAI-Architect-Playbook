## Where do you store embeddings?

In your **CWD Azure architecture, I would store embeddings in Azure AI Search**, along with the document chunks and metadata needed for secure retrieval.

```text
Enterprise Documents
       ↓
Extract / Clean / Chunk
       ↓
Embedding Model
       ↓
Vector Embedding
       ↓
Azure AI Search
 ├── Vector
 ├── Text
 └── Metadata / ACL
```

### 1. What is stored?

For example, a ServiceNow knowledge document might become:

```json
{
  "document_id": "DOC-1001",
  "chunk_id": "DOC-1001-03",
  "text": "Steps to troubleshoot overheating...",
  "embedding": [0.012, -0.084, 0.231, "..."],
  "tenant_id": "T001",
  "customer_id": "C12345",
  "document_type": "service_knowledge",
  "source": "ServiceNow",
  "acl": ["support-team"],
  "embedding_version": "v2"
}
```

The **embedding** is the numerical vector used for semantic similarity search.

---

### 2. How does CWD use it?

Suppose the user asks:

> "Show me information related to overheating issues for C12345."

The Incident Worker performs:

```text
User Query
    ↓
Incident Worker
    ↓
Create query embedding
    ↓
Azure AI Search
    ├── Vector search
    ├── BM25 keyword search
    ├── Metadata filters
    └── Semantic ranking
    ↓
Relevant chunks
    ↓
LLM
    ↓
Grounded response
```

I prefer **hybrid search** because enterprise queries can contain both semantic language and exact identifiers such as customer IDs, incident numbers, or product codes.

---

### 3. What about the original documents?

I don't use the vector store as the only copy of the original documents.

Conceptually:

```text
Original documents
      ↓
Enterprise storage / source system
      ↓
Processing pipeline
      ↓
Chunks + embeddings + metadata
      ↓
Azure AI Search
```

Azure AI Search is primarily the **retrieval/index layer**.

The authoritative business or document source remains the appropriate enterprise system.

---

### 4. Why store metadata with embeddings?

This is very important for CWD security.

For example:

```text
embedding
   +
tenant_id
customer_id
document_type
classification
ACL
source
version
```

Then the Worker can retrieve only documents the user is authorized to access.

For example:

```text
tenant_id = T001
customer_id = C12345
ACL = user_has_access
```

So I don't simply search the entire vector index and then ask the LLM to decide what the user can see.

**Authorization happens outside the LLM.**

---

### 5. Do I store embeddings in Redis?

Not as the primary vector store for your CWD architecture.

Redis can be used for:

* caching repeated query results
* caching query embeddings
* temporary application state
* low-latency lookups

But:

```text
Azure AI Search → primary vector retrieval
Redis           → optional cache
```

---

### 6. What about embedding optimization?

I also store/version information such as:

```text
document_id
content_hash
embedding_model
embedding_version
index_version
```

If the document hasn't changed:

```text
Content hash unchanged
       ↓
Don't regenerate embedding
```

If only one chunk changed:

```text
Changed chunk
    ↓
Re-embed that chunk
    ↓
Update Azure AI Search
```

This reduces embedding cost.

---

## 🎯 Interview-ready answer

> **“In CWD, I store document embeddings in Azure AI Search. During ingestion, we extract and clean enterprise documents, chunk them, generate embeddings, and index the vectors together with searchable text and security metadata such as tenant ID, customer ID, document type, classification, and ACL information. At query time, the Worker generates a query embedding and performs hybrid vector plus keyword search with appropriate authorization and metadata filters, followed by semantic ranking when needed. Azure AI Search is the retrieval/index layer, while the original enterprise systems remain the source of truth. Redis can optionally cache frequently used embeddings or retrieval results, but it is not my primary vector store.”**

### Easy memory

**Chunk → Embed → Azure AI Search → Filter → Hybrid Search → Rerank → Retrieve**

> **Strong interview line:**
> **“I store the vector together with the chunk and its security metadata, because a vector without tenant and ACL context is not sufficient for secure enterprise RAG.”**
