## How would Glue prepare enterprise documents for RAG?

Glue would perform the **batch preprocessing** before documents are indexed into OpenSearch.

```text id="0ql4af"
Enterprise Documents
        ↓
       S3
        ↓
    Glue ETL
        ↓
Extract / Clean
        ↓
Chunk Documents
        ↓
Add Metadata + ACL
        ↓
Generate Embeddings
        ↓
   OpenSearch
```

### Main steps

1. **Extract** text from PDFs, CSV, JSON, etc.
2. **Clean** unwanted text, formatting, duplicates.
3. **Chunk** documents into meaningful sections.
4. **Add metadata**, for example:

   ```text
   document_id
   source
   customer_id
   department
   document_type
   created_date
   ACL / entitlement
   ```
5. **Generate embeddings** for each chunk.
6. **Store/index** chunks + embeddings + metadata in OpenSearch.
7. Keep the **original document in S3**.

### Important security point

ACL metadata must travel with the chunk:

```text id="1f4z6h"
Document
   ↓
Chunk
   ↓
ACL metadata
   ↓
OpenSearch
```

At query time, CWD applies the user's entitlements **before returning chunks**.

### Interview answer

> “I would use Glue as the batch preprocessing layer. It would extract and clean enterprise documents, remove duplicates, chunk the content, attach metadata and ACL information, generate embeddings, and prepare the chunks for OpenSearch. The original documents remain in S3, while OpenSearch stores the searchable chunks, vectors, and metadata.”

**Memory:**
**Extract → Clean → Chunk → Metadata/ACL → Embed → OpenSearch**
