# Where would you use S3?

## Short answer

I would use **Amazon S3 as the durable object-storage layer** in the AWS version of CWD.

I would store **enterprise documents, raw files, processed documents, evaluation datasets, prompts/configuration artifacts, and generated reports** in S3. It also acts as the source for the RAG ingestion pipeline.

## Key points

* Store PDFs, Word files, Excel files, images, CSVs, etc.
* Store raw and processed documents.
* Source for the **RAG ingestion pipeline**.
* Store evaluation/golden datasets.
* Store large artifacts that shouldn't go into DynamoDB.
* Versioning for document history.
* Encryption using KMS.
* Fine-grained access using IAM/bucket policies.
* Lifecycle policies for archival/deletion.
* Event notifications can trigger Lambda/EventBridge.

### CWD flow

```text
                 Enterprise Documents
                         ↓
                        S3
                         ↓
                 Ingestion Pipeline
                         ↓
            Extract → Clean → Chunk
                         ↓
                    Embeddings
                         ↓
              OpenSearch Serverless
                         ↓
                  RAG Retrieval
                         ↓
                    Worker
                         ↓
                     Bedrock
                         ↓
                     Answer
```

# Where would I use S3 in CWD?

### 1. Enterprise document storage

For example:

```text
S3
 ├── product-documents/
 ├── engineering-documents/
 ├── service-knowledge/
 ├── customer-documents/
 └── policies/
```

Documents can come from SharePoint, file uploads, enterprise systems, or other ingestion sources.

---

### 2. RAG ingestion

S3 can be the landing zone:

```text
Document
   ↓
S3
   ↓
Lambda / ECS ingestion
   ↓
Text extraction
   ↓
Chunking
   ↓
Embedding
   ↓
OpenSearch Serverless
```

The important point is:

**S3 stores the original document; OpenSearch stores the searchable representation.**

---

### 3. Store processed artifacts

For example:

```text
raw.pdf
   ↓
extracted.json
   ↓
chunks.json
   ↓
metadata.json
```

These can be stored in different S3 prefixes.

---

### 4. Evaluation datasets

For LLM evaluation, I could store:

```text
S3
 └── evaluation/
      ├── golden_questions.json
      ├── expected_answers.json
      ├── retrieval_tests.json
      └── regression_results/
```

This is useful for testing prompts, models, RAG retrieval, and agent behavior before production.

---

### 5. Large files and reports

If CWD generates large artifacts such as:

* Customer briefing reports
* Generated PDFs
* Batch processing results
* Evaluation reports
* Data exports

I would store them in S3 rather than DynamoDB.

---

### 6. Event-driven processing

S3 can trigger downstream processing.

Example:

```text
User uploads document
        ↓
       S3
        ↓
   EventBridge
        ↓
       SQS
        ↓
 Ingestion Worker
        ↓
OpenSearch Serverless
```

This gives us an asynchronous ingestion architecture.

---

## S3 vs OpenSearch vs DynamoDB

| Service                   | Purpose                    |
| ------------------------- | -------------------------- |
| **S3**                    | Store files/objects        |
| **OpenSearch Serverless** | Search + vector/RAG        |
| **DynamoDB**              | Application/workflow state |
| **Redis**                 | Cache                      |
| **Bedrock**               | LLM/foundation models      |

Simple way to remember:

```text
S3         → STORE
OpenSearch → SEARCH
DynamoDB   → STATE
Redis      → CACHE
Bedrock    → GENERATE
```

## Security

For enterprise CWD, I would use:

* **S3 Block Public Access**
* IAM/bucket policies
* **SSE-KMS** encryption
* Versioning
* CloudTrail auditing
* VPC endpoints where appropriate
* Lifecycle policies
* Least-privilege access

I would also keep **ACL/security metadata with the document** so the RAG pipeline can enforce authorization during retrieval.

## 🎯 Strong interview answer

> **“I would use S3 as the durable object-storage layer in CWD. We would store raw enterprise documents such as PDFs, Excel files and images, along with processed artifacts and evaluation datasets. S3 can act as the landing zone for our RAG pipeline, where documents are extracted, chunked and embedded before being indexed into OpenSearch Serverless. I would use KMS encryption, IAM policies, versioning and lifecycle policies for security and governance. So, in simple terms, S3 stores the source artifacts, OpenSearch searches them, and Bedrock generates responses from the retrieved context.”**

## Easy memory trick

**S3 = STORE**

> **Store → Secure → Source for RAG → Scale**

### Key distinction

**S3 does not perform the RAG search.**

```text
S3
 ↓
Stores document
 ↓
Ingestion
 ↓
OpenSearch
 ↓
Retrieves relevant chunks
 ↓
Bedrock
 ↓
Generates answer
```
