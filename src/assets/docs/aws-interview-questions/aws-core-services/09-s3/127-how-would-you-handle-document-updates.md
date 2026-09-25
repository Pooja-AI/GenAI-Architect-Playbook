# How would you handle document deletion in CWD?

I would treat deletion as an **event-driven cleanup operation**. When a document is deleted from S3, I make sure its corresponding chunks are removed or marked inactive in OpenSearch so **RAG cannot retrieve stale content**.

```text
S3
 │
 │ Delete
 ▼
S3 Event / EventBridge
 │
 ▼
SQS
 │
 ▼
Deletion Worker
 │
 ├── Find document_id
 ├── Remove/deactivate chunks
 └── Update metadata
 │
 ▼
OpenSearch
```

## 1. Detect the deletion

With S3 Versioning enabled, a normal delete creates a **delete marker**.

```text
customer_policy.pdf
        ↓
Delete
        ↓
Delete Marker
```

The deletion event triggers the cleanup pipeline.

---

## 2. Send the event through SQS

```text
S3
 ↓
EventBridge
 ↓
SQS
 ↓
Deletion Worker
```

SQS gives us:

* Retry
* Buffering
* DLQ
* Controlled processing

---

## 3. Identify the document

The deletion event contains the object information.

I would maintain metadata such as:

```text
document_id
s3_key
version_id
status
```

Example:

```text
document_id = DOC123
s3_key      = /policies/customer_policy.pdf
```

The Worker uses `document_id` to find all corresponding chunks in OpenSearch.

---

## 4. Remove the document from OpenSearch

Suppose the document produced:

```text
DOC123
 ├── chunk-001
 ├── chunk-002
 ├── chunk-003
 └── chunk-004
```

After deletion:

```text
DOC123
 ├── chunk-001 → deleted/inactive
 ├── chunk-002 → deleted/inactive
 ├── chunk-003 → deleted/inactive
 └── chunk-004 → deleted/inactive
```

I can either:

### Hard delete

Physically remove the chunks from OpenSearch.

### Soft delete

Mark:

```text
active = false
```

and filter inactive documents during retrieval.

For enterprise systems where audit/history matters, **soft deletion plus retention** can be useful.

---

## 5. Make deletion idempotent

The same deletion event might be delivered more than once.

So I use something like:

```text
idempotency_key =
document_id + version_id + DELETE
```

Then:

```text
Already deleted?
      │
   ┌──┴──┐
  YES    NO
   ↓      ↓
 Skip   Delete
```

This prevents duplicate deletion operations from causing problems.

---

## 6. Handle failure

```text
Deletion Worker
      ↓
OpenSearch failure
      ↓
SQS retry
      ↓
Retry + backoff
      ↓
Repeated failure
      ↓
DLQ
```

After fixing the issue, I replay the deletion event.

---

## 7. Important security point

Deleting the S3 document is **not enough**.

Imagine:

```text
S3 document → deleted
        ↓
OpenSearch chunks → still exist
        ↓
RAG retrieves old content ❌
```

Therefore, I need deletion propagation:

```text
S3 deletion
     ↓
OpenSearch deletion/deactivation
     ↓
RAG no longer retrieves document
```

---

# 🎯 Strong interview answer

> **“I would handle document deletion as an event-driven cleanup workflow. When a document is deleted from S3, the deletion event goes through EventBridge and SQS to a deletion Worker. The Worker identifies the document ID and removes or marks all corresponding chunks inactive in OpenSearch. I would use idempotency so duplicate deletion events are safe, and SQS retries with a DLQ for failures. Most importantly, I would verify that the deleted document is no longer retrievable from the RAG index, because deleting the S3 source alone is not sufficient.”**

### Easy memory trick

**Detect → Identify → Delete → Verify → Retry**

### Key distinction

**S3 deletion removes the source document.**

**OpenSearch cleanup removes the document from RAG retrieval.**
