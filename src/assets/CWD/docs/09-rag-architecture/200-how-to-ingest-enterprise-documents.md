## How do you ingest enterprise documents?

In CWD, we use an **ETL/ingestion pipeline** to bring enterprise documents into **Azure AI Search** for RAG.

### Simple flow

```text
SharePoint / M365 / Enterprise Sources
              ↓
        Document Ingestion
              ↓
      Extract Text / Metadata
              ↓
          Chunking
              ↓
      Generate Embeddings
              ↓
       Azure AI Search
              ↓
      Hybrid Search + RAG
              ↓
             LLM
```

### Step-by-step

1. **Connect to source**

   * SharePoint/M365
   * Enterprise document repositories
   * Knowledge bases

2. **Extract content**

   * PDF → text
   * Word → text
   * HTML → text
   * Capture metadata such as document ID, title, source, department, etc.

3. **Clean and normalize**

   * Remove unnecessary formatting
   * Normalize text
   * Detect duplicates

4. **Chunk documents**

```text
Large document
      ↓
Chunk 1
Chunk 2
Chunk 3
...
```

This makes retrieval more precise.

5. **Generate embeddings**

Each chunk is converted into a vector representation.

6. **Index into Azure AI Search**

We store:

```text
chunk_text
embedding
document_id
source
title
metadata
ACL/security information
```

7. **Apply security metadata**

For example:

```text
document_id = DOC123
department = Engineering
allowed_groups = [Engineering, AI-Team]
```

At query time, we apply **ACL/metadata filtering** so users don't retrieve documents they aren't authorized to see.

### 🎯 Strong interview answer

> **“We ingest enterprise documents from sources such as SharePoint and knowledge repositories. The pipeline extracts text and metadata, cleans and chunks the documents, generates embeddings, and indexes the chunks in Azure AI Search along with metadata and ACL information. At query time, we use hybrid search with security filtering to retrieve only relevant and authorized content for the RAG pipeline.”**

### Easy memory trick

**Ingest → Extract → Clean → Chunk → Embed → Index → Secure**

One important interview point:

> **Indexing is not just storing embeddings. We also store metadata and security information so retrieval can respect enterprise access controls.**
