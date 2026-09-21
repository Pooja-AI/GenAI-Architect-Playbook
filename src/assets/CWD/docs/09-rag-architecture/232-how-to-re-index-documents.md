## How do you re-index documents?

**Re-indexing means processing a document again and updating its chunks, embeddings, metadata, and search index when the source document changes or when the indexing strategy changes.**

In CWD, I prefer **incremental re-indexing** rather than rebuilding the entire index.

### CWD re-indexing flow

```text
SharePoint / Enterprise Source
          ↓
Change Detection
          ↓
Document Changed?
          ↓
Fetch Latest Version
          ↓
Extract + Clean
          ↓
Chunk
          ↓
Generate Embeddings
          ↓
Update Metadata / ACL
          ↓
Azure AI Search
          ↓
Validate
```

### Example

Suppose:

```text
DOC123
Version 5
```

is changed to:

```text
DOC123
Version 6
```

We detect the change:

```text
version 5 ≠ version 6
```

Then:

```text
DOC123 v6
   ↓
Re-extract
   ↓
Re-chunk
   ↓
Re-embed
   ↓
Replace old chunks
   ↓
Azure AI Search
```

If the document creates:

```text
DOC123_001
DOC123_002
DOC123_003
```

we update those chunks with the new content and metadata.

---

## Why re-chunk and re-embed?

If the content changes:

```text
Old content
   ↓
Old embedding
```

The old embedding no longer accurately represents the new content.

Therefore:

> **Content change → Re-chunk → Re-embed**

---

## When do we re-index?

### 1. Source document changed

```text
SharePoint document updated
        ↓
Incremental re-index
```

### 2. Document deleted

Remove its chunks from the index.

### 3. Embedding model changed

For example:

```text
text-embedding-3-small
        ↓
text-embedding-3-large
```

You generally need to **re-embed the affected corpus** because the vector representation changes.

### 4. Chunking strategy changed

Example:

```text
Old: 1000-token chunks
New: 600-token semantic chunks
```

Reprocess and re-index the documents.

### 5. Metadata/ACL policy changed

If security metadata changes, update the indexed ACL fields so retrieval reflects the new permissions.

---

## How do you avoid downtime?

For a large production index, I wouldn't blindly delete the entire existing index.

A safer approach is **blue/green or versioned indexing**:

```text
Current Index
    ↓
index_v1

Build new index
    ↓
index_v2
    ↓
Validate
    ↓
Switch alias/configuration
    ↓
index_v2 becomes active
    ↓
Retire index_v1
```

This is particularly useful for:

* embedding-model changes
* chunking changes
* large-scale re-indexing

For small incremental document updates, update only the affected documents.

---

## How do you validate re-indexing?

After re-indexing:

```text
Document count
Chunk count
Embedding generation success
ACL metadata
Version
Searchability
Retrieval quality
```

Then run retrieval tests:

```text
Recall@K
Precision@K
MRR
NDCG
RAGAS
```

This ensures the new index didn't reduce retrieval quality.

---

### 🎯 Strong interview answer

> **“We use incremental re-indexing for normal document changes. When a source document changes, we detect the new version, re-extract and clean the content, re-chunk it, regenerate embeddings, update ACL and metadata, and replace the document's chunks in Azure AI Search. If the embedding model or chunking strategy changes, we may rebuild the broader index using a versioned or blue-green approach and switch only after validation. We verify the new index using retrieval metrics and RAG evaluation.”**

### Easy memory trick

**Detect → Extract → Chunk → Embed → Index → Validate**

And remember:

> **Document changed → reprocess that document.**
> **Embedding/chunking strategy changed → consider re-indexing the corpus.**
