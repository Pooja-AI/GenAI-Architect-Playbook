## S3 → Glue → OpenSearch architecture

This is the **batch RAG ingestion pipeline** in CWD.

```text
Enterprise Data
      ↓
     S3
      ↓
 Glue Crawler
      ↓
 Data Catalog
      ↓
 Glue ETL
(clean / transform / chunk)
      ↓
 Embedding Model
      ↓
 OpenSearch
(vector + keyword index)
      ↓
 CWD RAG Worker
```

### Step-by-step

**1. S3 — Raw data**

* Store PDFs, CSV, JSON, historical Salesforce/ServiceNow data, etc.
* S3 is the durable source/landing layer.

**2. Glue Crawler — Discover**

* Detects schema/structure.
* Updates Glue Data Catalog.

**3. Glue Data Catalog**

* Stores metadata: tables, columns, types, S3 locations, partitions.

**4. Glue ETL — Prepare**

* Clean and normalize data.
* Remove duplicates.
* Handle schema changes.
* Chunk documents/text.
* Add metadata such as `customer_id`, source, timestamp, ACL information.

**5. Embedding**

* Convert chunks into vectors using an embedding model.

**6. OpenSearch — Index**
Store:

```text
chunk text
+ embedding vector
+ metadata
+ ACL/security attributes
```

OpenSearch supports **vector + keyword/hybrid search**.

**7. Runtime RAG**

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
RAG Worker
 ↓
OpenSearch
 ↓
Relevant chunks
 ↓
Bedrock
 ↓
Grounded response
```

### Important distinction

**Glue is batch/offline ingestion.**
**OpenSearch is the runtime retrieval layer.**

### Interview answer

> “In CWD, S3 acts as the durable data landing layer. Glue Crawler discovers the schema and updates the Data Catalog, while Glue ETL cleans, transforms, deduplicates, and prepares the data. We then generate embeddings and index the chunks, vectors, and security metadata into OpenSearch. At runtime, the RAG Worker queries OpenSearch using hybrid or vector search and sends the retrieved context to Bedrock for response generation.”

**Memory:**
**S3 = Store → Glue = Prepare → Embedding = Vectorize → OpenSearch = Retrieve → Bedrock = Generate**
