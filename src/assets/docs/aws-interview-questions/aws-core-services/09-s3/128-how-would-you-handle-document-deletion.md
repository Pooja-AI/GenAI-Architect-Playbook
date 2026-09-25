# How would you handle document deletion in CWD?

I would handle deletion as an **event-driven cleanup process** and make sure the deleted document is removed from both **S3 and the RAG/OpenSearch index**.

```text
S3 Delete
   ↓
S3 Event
   ↓
EventBridge
   ↓
SQS
   ↓
Deletion Worker
   ↓
Find document_id
   ↓
Delete / deactivate OpenSearch chunks
   ↓
Verify
```

### 1. Detect deletion

When the document is deleted from S3, capture the deletion event.

If S3 Versioning is enabled, the delete normally creates a **delete marker**.

### 2. Queue the deletion

Send the event through:

```text
S3 → EventBridge → SQS → Deletion Worker
```

SQS gives us retry, buffering, and DLQ handling.

### 3. Find all related chunks

I maintain metadata such as:

```text
document_id
s3_key
version_id
```

Example:

```text
DOC123
 ├── chunk-001
 ├── chunk-002
 ├── chunk-003
 └── chunk-004
```

The Worker finds all chunks belonging to `DOC123`.

### 4. Remove from OpenSearch

I can either:

**Hard delete:**

```text
Delete chunks completely
```

or **soft delete:**

```text
active = false
```

and exclude inactive chunks during retrieval.

For enterprise systems, soft deletion can be useful when audit/history requirements exist.

### 5. Make deletion idempotent

Use an idempotency key such as:

```text
document_id + version_id + DELETE
```

If the same deletion event arrives twice:

```text
Already deleted?
     ↓
   YES → Skip
   NO  → Delete
```

This protects against duplicate event delivery.

### 6. Handle failures

```text
OpenSearch failure
      ↓
SQS retry
      ↓
Backoff
      ↓
Still failing?
      ↓
DLQ
```

After fixing the problem, replay the deletion event.

### 7. Verify RAG cannot retrieve it

This is very important.

```text
S3 document deleted
        ↓
OpenSearch chunks deleted/inactive
        ↓
RAG search
        ↓
Document should NOT be returned
```

Deleting the S3 source alone is **not enough**, because stale chunks could still exist in OpenSearch.

## 🎯 Strong interview answer

> **“I would handle document deletion as an event-driven cleanup workflow. When a document is deleted from S3, the event goes through EventBridge and SQS to a deletion Worker. The Worker identifies the document ID and removes or marks all corresponding chunks inactive in OpenSearch. I would make the operation idempotent so duplicate deletion events are safe, and use SQS retries and a DLQ for failures. Finally, I would verify that the deleted document is no longer retrievable from the RAG index, because deleting the S3 source alone does not remove stale indexed content.”**

**Memory:** **Detect → Queue → Identify → Delete → Verify → Retry**

**Key distinction:**
**S3 deletion = remove the source.**
**OpenSearch cleanup = remove it from RAG retrieval.**
