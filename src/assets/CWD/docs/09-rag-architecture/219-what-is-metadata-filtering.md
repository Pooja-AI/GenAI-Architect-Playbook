## What is Metadata Filtering?

**Metadata filtering means filtering search results using additional information about a document/chunk before giving it to the LLM.**

Instead of searching only by **semantic meaning**, we also say:

> “Only return documents that match these conditions.”

### Simple example in CWD

Suppose a document has metadata:

```json
{
  "document_id": "DOC123",
  "source": "SharePoint",
  "department": "Engineering",
  "product": "Onsemi-A100",
  "year": 2026,
  "region": "US",
  "access_level": "Engineering"
}
```

User asks:

> "What is the A100 overheating issue?"

We can filter:

```text
product = "Onsemi-A100"
AND region = "US"
AND access_level = "Engineering"
```

Then perform semantic/vector or hybrid search **only within those eligible documents**.

---

## Why do we need metadata filtering?

### 1. Improve relevance

If the user asks about:

```text
Product = A100
```

we don't need to search documents for every product.

### 2. Security / ACL

This is especially important in enterprise RAG.

For example:

```text
User → Engineering
```

The search should return:

```text
Engineering documents ✅
```

but not:

```text
HR documents ❌
Finance documents ❌
Executive documents ❌
```

Even if those documents are semantically relevant.

### 3. Reduce search scope

Instead of searching millions of chunks:

```text
10 million chunks
       ↓
metadata filter
       ↓
500,000 eligible chunks
       ↓
BM25 + Vector Search
       ↓
Top K
```

This can improve efficiency and relevance.

---

## Metadata vs Content

This is an important interview distinction.

**Content:**

> "The A100 device experienced overheating because of cooling failure."

**Metadata:**

```text
document_id = DOC123
product = A100
department = Engineering
source = SharePoint
page = 15
year = 2026
ACL = Engineering
```

The **content** tells us what the document says.

The **metadata** tells us information *about the document*.

---

## In your CWD architecture

```text
User
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
RAG Query
  ↓
Azure AI Search
  │
  ├── Metadata / ACL filtering
  │
  ├── BM25 search
  │
  └── Vector search
  ↓
Semantic Ranking / Reranking
  ↓
Top relevant chunks
  ↓
LLM
  ↓
Grounded Response
```

Typical metadata:

```text
document_id
chunk_id
source
department
product
customer_id
region
date
document_type
security/ACL information
```

### 🎯 Strong interview answer

> **“Metadata filtering means restricting retrieval based on attributes associated with documents or chunks, such as product, department, date, source, or user access level. In our CWD RAG pipeline, we use metadata and ACL filters in Azure AI Search so the search operates only on documents the user is authorized to access. This improves both retrieval relevance and security.”**

### Easy memory trick

**Content = What is inside?**
**Metadata = What is it about?**
**ACL = Who can access it?**
