## How does Hybrid Search work?

**Hybrid search combines keyword search and vector search** to get better retrieval results.

### Simple CWD flow

```text
User Query
   ↓
"Customer C123 overheating issue"
   ↓
 ┌─────────────────────┐
 │                     │
Keyword Search      Vector Search
(BM25)              (Semantic)
 │                     │
 └─────────┬───────────┘
           ↓
     Combine / Rank
           ↓
   Security + Metadata
      Filtering
           ↓
    Top-K Documents
           ↓
          LLM
```

### 1. Keyword search — BM25

Looks for **exact or related words**.

For example:

```text
"E102"
"C123"
"overheating"
```

This is very useful for:

* customer IDs
* error codes
* product numbers
* ticket IDs
* technical terms

### 2. Vector search

Converts the query into an embedding and finds content with **similar meaning**.

For example:

```text
Query:
"device is getting too hot"

Document:
"thermal management failure"
```

The exact words are different, but their **meaning is similar**.

### 3. Combine the results

Azure AI Search combines the keyword and vector results and ranks the most relevant documents.

```text
BM25 results
      +
Vector results
      ↓
Hybrid ranking
      ↓
Top relevant chunks
```

Then we apply **metadata/ACL filters** so the Worker only receives documents the user is authorized to access.

### Example

Suppose the user asks:

> **“Why did customer C123 experience E102 overheating?”**

Vector search may find:

```text
"Thermal management failure analysis"
```

Keyword search may find:

```text
"C123"
"E102"
```

Hybrid search can use **both signals** to identify the most relevant document.

### 🎯 Strong interview answer

> **“In CWD, hybrid search combines keyword search such as BM25 with vector similarity search. Keyword search is useful for exact identifiers like customer IDs, error codes, and ticket numbers, while vector search captures semantic meaning. Azure AI Search combines and ranks the results, and we apply metadata and ACL filtering before passing the top relevant chunks to the LLM for RAG.”**

### Easy memory trick

**Keyword = Exact words**
**Vector = Meaning**
**Hybrid = Both → Better retrieval**
