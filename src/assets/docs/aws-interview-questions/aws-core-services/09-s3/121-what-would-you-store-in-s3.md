# What would you store in S3 for CWD?

For CWD, I would use **S3 for large, durable objects and artifacts**, not transactional workflow state.

```text id="2d7xq1"
                    CWD
                     │
                     ▼
                    S3
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Documents   Artifacts   Data
          │          │          │
        PDFs       Reports      CSV
        Word       Results      JSON
        Excel      Models       Images
        Images     Logs        Raw data
```

## 1. Enterprise documents for RAG

Store source documents such as:

```text id="w3f9pa"
PDF
Word
Excel
PowerPoint
CSV
TXT
Images
Scanned documents
```

Example:

```text id="q0r7em"
s3://cwd-documents/
    ├── sales/
    ├── manufacturing/
    ├── it/
    └── policies/
```

These can then be processed and indexed into **OpenSearch** for RAG.

---

## 2. RAG ingestion data

I would keep:

```text id="x2j8n4"
Raw document
    ↓
S3
    ↓
Extraction / Chunking / Embedding
    ↓
OpenSearch
```

S3 remains the **source of truth for the original document**.

---

## 3. Large workflow results

If a Worker generates a large report:

```text id="k5z1pq"
Worker
  ↓
Large result
  ↓
S3
  ↓
DynamoDB stores only:
result_s3_key
```

For example:

```text id="v8c3lm"
DynamoDB:
RUN123
result_s3_key =
reports/RUN123/customer-briefing.json
```

This prevents DynamoDB items from becoming unnecessarily large.

---

## 4. Images and multimodal data

For CWD's multimodal use cases:

```text id="n6a2wf"
Product images
Inspection images
Scanned documents
OCR input
Vision-model artifacts
```

can be stored in S3.

---

## 5. Evaluation datasets

For GenAI/Agentic AI evaluation:

```text id="7r0x5k"
Golden datasets
Test prompts
Expected answers
Evaluation results
Regression test data
```

Example:

```text id="s3a9pd"
s3://cwd-evaluation/
    ├── golden/
    ├── regression/
    └── results/
```

These can support CI/CD quality gates.

---

## 6. Generated reports and artifacts

Examples:

```text id="e1m4ty"
Customer briefing PDF
Excel reports
JSON outputs
Agent execution artifacts
Export files
```

---

## 7. Backups / archival data

S3 can also be used for:

* Long-term archives
* Historical documents
* Exported workflow artifacts
* Backup datasets
* Older evaluation results

Use **S3 Lifecycle policies** to move older data to lower-cost storage classes when appropriate.

---

# What NOT to store in S3

| Data                      | Better location       |
| ------------------------- | --------------------- |
| Session/task/run state    | **DynamoDB**          |
| Worker status/checkpoints | **DynamoDB**          |
| Idempotency keys          | **DynamoDB**          |
| Frequently accessed cache | **ElastiCache/Redis** |
| Vector/search index       | **OpenSearch**        |
| Secrets                   | **Secrets Manager**   |

---

## 🎯 Strong interview answer

> **“In CWD, I use S3 as the durable object store for large enterprise documents, RAG source data, images, generated reports, workflow artifacts, evaluation datasets, and archival data. For RAG, S3 holds the original documents while OpenSearch holds the searchable/vector representation. For large workflow results, I store the result in S3 and keep only the S3 reference in DynamoDB. This keeps transactional state separate from large objects and allows S3 lifecycle and storage policies to control long-term cost.”**

### Easy memory trick

**S3 = Store large, durable objects**

### Key distinction

**DynamoDB → workflow state**
**S3 → large objects**
**OpenSearch → search/vector**
**Redis → fast cache**
