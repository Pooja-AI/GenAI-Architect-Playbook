## How do you handle scanned documents?

Scanned documents are essentially **images**, so normal PDF text extraction may return nothing. We use **OCR** first, then process the extracted text through the normal RAG pipeline.

### Simple flow

```text
Scanned PDF / Image
        ↓
       OCR
        ↓
Extracted Text + Metadata
        ↓
Clean / Normalize
        ↓
Chunk
        ↓
Embeddings
        ↓
Azure AI Search
        ↓
RAG
```

### In CWD

We can use **Azure AI Document Intelligence** for OCR and document structure extraction.

For example:

```text
Scanned PDF
    ↓
Document Intelligence
    ↓
Page 5:
"Failure Code: E102"
"Temperature: 95°C"
    ↓
Chunk + Metadata
    ↓
Azure AI Search
```

We preserve metadata such as:

```text
document_id
page_number
source
section
ACL
```

### What about tables?

If the scanned document contains a table, OCR/document extraction should preserve the **table structure** where possible rather than converting everything into one flat string.

### What if OCR is poor?

We can add:

* OCR confidence thresholds
* preprocessing such as deskewing/rotation
* image enhancement
* human review for low-confidence/high-value documents
* validation before indexing

### 🎯 Strong interview answer

> **“For scanned documents, we first use OCR because there is no machine-readable text. In our Azure-based pipeline, we can use Azure AI Document Intelligence to extract text, tables, and document structure. We preserve page-level metadata and ACL information, clean and chunk the extracted content, generate embeddings, and index it in Azure AI Search. For low-confidence OCR results, we can apply preprocessing or route the document for validation before indexing.”**

### Easy memory trick

**Scanned document = Image → OCR → Text → Chunk → Embed → Search → RAG**
