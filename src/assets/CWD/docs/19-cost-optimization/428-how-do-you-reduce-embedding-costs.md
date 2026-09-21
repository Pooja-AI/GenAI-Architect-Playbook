## How do you reduce embedding costs in CWD?

The main principle is:

> **Don't generate embeddings unless the content actually needs a new vector.**

Embedding costs mainly come from the **amount of text embedded and how often you re-embed it**.

### 1. Use incremental embedding

This is one of the biggest optimizations.

Instead of re-embedding the entire enterprise corpus:

```text id="emb1"
10 million documents
       ↓
Document changed?
   ├── NO → Skip
   └── YES → Re-embed
```

I track:

```json id="emb2"
{
  "document_id": "DOC123",
  "content_hash": "abc123",
  "embedding_model": "model_v2",
  "embedding_version": "v2"
}
```

If the `content_hash` hasn't changed, I don't generate another embedding.

---

### 2. Use content hashing

For example:

```python id="emb3"
new_hash = sha256(document_text)

if new_hash == stored_hash:
    skip_embedding()
else:
    generate_embedding()
```

This prevents unnecessary embedding when a document is reprocessed but its actual content hasn't changed.

---

### 3. Remove unnecessary content before embedding

Don't embed:

```text id="emb4"
Headers
Footers
Navigation menus
Repeated boilerplate
Duplicate documents
Irrelevant formatting
```

Use:

```text id="emb5"
Raw document
     ↓
Clean
     ↓
Deduplicate
     ↓
Chunk
     ↓
Embed
```

Fewer tokens → fewer embedding costs.

---

### 4. Optimize chunking

Bad chunking can create thousands of unnecessary chunks.

For example:

```text id="emb6"
Poor chunking
100 documents
   ↓
50,000 tiny chunks ❌
```

Better:

```text id="emb7"
Meaningful sections
   ↓
Appropriate chunks
   ↓
10,000 useful chunks
```

I tune chunk size and overlap based on retrieval evaluation.

**Don't make chunks unnecessarily small**, because that increases the number of vectors and embedding tokens.

---

### 5. Don't embed metadata unnecessarily

For example:

```json id="emb8"
{
  "tenant_id": "T001",
  "customer_id": "C12345",
  "document_type": "incident",
  "acl": ["sales"],
  "content": "Actual document content..."
}
```

The **content** is embedded.

Fields such as `tenant_id`, `customer_id`, document type, dates, and ACL information can generally be stored as metadata and used for filtering instead of repeatedly embedding them into the text.

---

### 6. Batch embedding requests

During offline ingestion:

```text id="emb9"
10,000 chunks
      ↓
Batch embedding requests
      ↓
Vector index
```

Batching reduces request overhead and improves ingestion throughput, subject to provider limits.

This doesn't necessarily change the provider's token price, but it can reduce operational overhead and improve throughput.

---

### 7. Don't re-embed unchanged chunks

Suppose only one section of a document changes:

```text id="emb10"
Document
 ├── Chunk 1 unchanged
 ├── Chunk 2 unchanged
 ├── Chunk 3 changed  ← re-embed
 ├── Chunk 4 unchanged
 └── Chunk 5 unchanged
```

Only Chunk 3 needs a new embedding.

---

### 8. Choose the appropriate embedding model

Don't automatically use the largest/most expensive model.

I evaluate:

```text id="emb11"
Model
 ↓
Retrieval quality
 ↓
Cost
 ↓
Latency
 ↓
Storage
```

Then select the least expensive model that meets the required retrieval-quality threshold.

---

### 9. Cache repeated query embeddings

There are two different cases:

**Document embeddings:**

```text
Document → embedding → store permanently
```

**Query embeddings:**

```text
User query
    ↓
Embedding cache
    ↓
HIT → reuse
MISS → embedding model
```

For repeated search queries, caching the query vector can avoid unnecessary embedding calls.

---

### 10. Don't embed data that doesn't need semantic search

This is often overlooked.

If I have:

```text
customer_id = C12345
incident_id = INC0012345
status = OPEN
date = 2026-09-20
```

I don't need to use vector embeddings just to search exact structured fields.

Use metadata/filters:

```text id="emb12"
customer_id = C12345
status = OPEN
```

and use vector search for the **semantic content**.

---

## CWD example

Suppose ServiceNow has 1 million incident records.

Instead of:

```text id="emb13"
1M records
 ↓
Embed everything every night ❌
```

I use:

```text id="emb14"
ServiceNow
    ↓
Incremental ingestion
    ↓
Content hash
    ↓
 ┌───────────────┐
 │ Changed?      │
 └───────┬───────┘
      NO │     │ YES
         ↓     ↓
       Skip   Clean
                ↓
              Chunk
                ↓
             Embed
                ↓
        Azure AI Search
```

This significantly reduces unnecessary embedding work.

### 🎯 Interview-ready answer

> **“I reduce embedding costs primarily by avoiding unnecessary embedding generation. In CWD, I use incremental ingestion with document and chunk-level content hashes, so unchanged content is not re-embedded. I clean and deduplicate documents before chunking, optimize chunk size and overlap, and store attributes such as tenant ID, customer ID, document type, and ACL as metadata rather than embedding unnecessary metadata into the content. I batch embedding requests for offline ingestion, cache repeated query embeddings where appropriate, and use the least expensive embedding model that meets our retrieval-quality threshold. I also avoid embeddings for structured fields that can be handled with exact metadata filters.”**

### Easy memory

**Don't re-embed → Hash → Clean → Deduplicate → Right-size chunks → Batch → Cache queries → Filter metadata → Right-size model**

> **Biggest optimization: embed only what changed and only what actually needs semantic search.**
