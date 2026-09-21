## Explain your ingestion pipeline

In CWD, our ingestion pipeline takes **enterprise documents → processes them → indexes them in Azure AI Search**, so Workers can retrieve relevant information during RAG.

### Simple flow

```text
SharePoint / M365 / Enterprise Sources
              ↓
        Document Connector
              ↓
      Extract Text + Metadata
              ↓
       Clean / Normalize
              ↓
          Chunking
              ↓
     Generate Embeddings
              ↓
   Add ACL / Security Metadata
              ↓
      Azure AI Search Index
              ↓
        RAG Retrieval
              ↓
             LLM
```

### Step-by-step

**1. Document collection**

We connect to sources such as SharePoint, M365, and enterprise knowledge repositories.

**2. Text extraction**

We extract text from PDF, Word, HTML, etc., and capture metadata such as:

```text
document_id
title
source
department
created_date
modified_date
```

**3. Cleaning**

Remove unnecessary formatting, duplicate content, headers/footers, and normalize the text.

**4. Chunking**

Large documents are divided into smaller meaningful chunks.

```text
Document
   ↓
Chunk 1
Chunk 2
Chunk 3
...
```

**5. Embedding generation**

Each chunk is converted into a vector embedding.

**6. Security metadata**

We attach ACL information:

```text
document_id = DOC123
allowed_groups = [Engineering, Sales]
```

This is important because **retrieval must respect user permissions**.

**7. Indexing**

We store the chunk, embedding, metadata, and ACL information in **Azure AI Search**.

**8. Retrieval**

When a Worker receives a question, Azure AI Search performs **hybrid search**—keyword/BM25 + vector search, with metadata/ACL filtering.

```text
User Question
     ↓
Query
     ↓
Hybrid Search + ACL Filter
     ↓
Relevant Chunks
     ↓
LLM
     ↓
Grounded Answer
```

### 🎯 Strong interview answer

> **“Our CWD ingestion pipeline starts by collecting documents from enterprise sources such as SharePoint and M365. We extract the text and metadata, clean and chunk the content, generate embeddings, and attach ACL information. We then index the chunks, vectors, and metadata in Azure AI Search. During retrieval, we use hybrid search with security filtering to return relevant and authorized content to the Worker, which provides that context to the LLM for grounded generation.”**

### Easy memory trick

**Collect → Extract → Clean → Chunk → Embed → Secure → Index → Retrieve → Generate**
