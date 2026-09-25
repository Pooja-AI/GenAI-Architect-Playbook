# How would you handle document updates in CWD?

I would use an **event-driven, incremental ingestion pipeline**. When a document changes in S3, I process **only that document/version**, re-index its affected chunks, and remove the old version from active search.

```text
User / Enterprise Source
          ↓
       S3 Upload
          ↓
    New Object Version
          ↓
   S3 Event / EventBridge
          ↓
        SQS
          ↓
   Ingestion Worker
          ↓
   Extract + Chunk
          ↓
      Embedding
          ↓
     OpenSearch
          ↓
   Updated RAG Index
```

## 1. Detect the update

Enable S3 versioning and capture the S3 event.

For example:

```text
customer_policy.pdf
       ↓
Version 1
       ↓
Document updated
       ↓
Version 2
```

The event contains information such as the bucket, object key and version information.

---

## 2. Put the update into SQS

```text
S3
 ↓
EventBridge
 ↓
SQS
 ↓
Ingestion Worker
```

Why SQS?

* Buffer traffic spikes
* Retry failures
* DLQ for repeated failures
* Decouple S3 from processing

---

## 3. Check whether the document really changed

I would maintain metadata such as:

```text
document_id
version_id
content_hash
updated_at
status
```

For example:

```text
Old hash = ABC123
New hash = XYZ789
```

Different hash → process the document.

Same hash → skip unnecessary processing.

This prevents unnecessary embedding and indexing.

---

## 4. Reprocess the changed document

The ingestion Worker:

```text
Download new version
       ↓
Extract text/OCR
       ↓
Clean
       ↓
Chunk
       ↓
Generate embeddings
       ↓
Index new chunks
```

For example:

```text
Version 1
  ├── chunk-001
  ├── chunk-002
  └── chunk-003

Version 2
  ├── chunk-001
  ├── chunk-002
  ├── chunk-003
  └── chunk-004
```

---

## 5. Remove old chunks from active search

This is important.

Suppose Version 1 contains:

> "Warranty is 1 year."

Version 2 says:

> "Warranty is 2 years."

I don't want RAG to retrieve both versions.

So I use:

```text
document_id + version_id
```

and mark/delete the old chunks from the active OpenSearch index.

```text
OpenSearch

Old Version → inactive
New Version → active
```

I prefer **soft-delete/version filtering** when auditability is important.

---

## 6. Make the update idempotent

Use a unique processing key such as:

```text
document_id + version_id
```

Store it in DynamoDB.

```text
Already processed?
      │
   ┌──┴──┐
  YES    NO
   ↓      ↓
 Skip   Process
```

This prevents duplicate SQS events from causing duplicate indexing.

---

## 7. Handle failures

```text
Ingestion Worker
      ↓
   Failure
      ↓
SQS retry
      ↓
Retry + backoff
      ↓
Repeated failure
      ↓
DLQ
```

After fixing the issue, I can replay the failed document version.

---

## 8. Important: live data vs documents

For **documents**:

```text
S3 → OpenSearch → RAG
```

For **live transactional data**:

```text
Worker → MCP → Salesforce / ServiceNow
```

I wouldn't depend on an old OpenSearch copy of highly dynamic Salesforce or ServiceNow data.

---

# 🎯 Strong interview answer

> **“I would handle document updates using an event-driven incremental ingestion pipeline. When a document is updated in S3, versioning gives me the new version, and the S3 event goes through EventBridge and SQS to an ingestion Worker. The Worker checks the document ID, version and content hash to avoid unnecessary or duplicate processing. If the content changed, I extract, chunk and embed only that document, then update OpenSearch and mark the previous chunks inactive so RAG doesn't return stale content. I would use DynamoDB for idempotency and SQS retries with a DLQ for failures. This allows us to update only changed documents instead of rebuilding the entire RAG index.”**

### Easy memory trick

**Detect → Queue → Compare → Reprocess → Reindex → Deactivate old → Monitor**

### Key distinction

**S3 Versioning** tells me **which version of the document exists**.

**Content hash** tells me **whether the content actually changed**.

**OpenSearch** stores the **active searchable representation** used by RAG.
