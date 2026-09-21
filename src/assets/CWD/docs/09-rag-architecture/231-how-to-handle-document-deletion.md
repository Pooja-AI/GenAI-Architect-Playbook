## How do you handle document deletion?

In CWD, when a document is deleted from the **source system**, we must also remove its indexed chunks from **Azure AI Search**. Otherwise, the LLM could retrieve information that no longer exists.

### End-to-end flow

```text
SharePoint / Enterprise Source
          ↓
Document Deleted
          ↓
Change Detection
          ↓
Identify document_id
          ↓
Delete all related chunks
          ↓
Azure AI Search
          ↓
Document no longer retrievable
```

### Example

Suppose the original document is:

```text
document_id = DOC123
```

During ingestion, it created:

```text
DOC123_001
DOC123_002
DOC123_003
DOC123_004
```

If `DOC123` is deleted:

```text
Delete DOC123
      ↓
Delete DOC123_001
Delete DOC123_002
Delete DOC123_003
Delete DOC123_004
```

That's why **`document_id` must be stored as metadata on every chunk**.

---

## 1. Detect the deletion

Ideally, use the source system's change notifications/webhooks or incremental synchronization.

```text
Source
  ↓
Change event
  ↓
event_type = DELETE
document_id = DOC123
```

If the source doesn't provide events, we can use scheduled reconciliation:

```text
Source inventory
      vs
Search index inventory
      ↓
Missing source documents
      ↓
Delete stale index entries
```

---

## 2. Delete by document ID

Conceptually:

```python
def handle_document_deleted(document_id: str):

    chunks = search_index.find_by_document_id(document_id)

    for chunk in chunks:
        search_index.delete(chunk["chunk_id"])

    audit_log(
        event="DOCUMENT_DELETED",
        document_id=document_id
    )
```

In a production implementation, I'd prefer a **batch delete** rather than deleting chunks one by one.

---

## 3. What if deletion processing fails?

Don't silently ignore it.

```text
Delete Event
    ↓
Queue
    ↓
Deletion Worker
    ↓
Azure AI Search
    ↓
Success ──→ Complete
    │
    └── Failure
          ↓
       Retry
          ↓
       DLQ
          ↓
     Alert / Replay
```

For CWD, **Service Bus + retry + DLQ** is a reasonable Azure implementation.

---

## 4. What about cached results?

This is an important production consideration.

Suppose a deleted document was already retrieved and cached.

We should invalidate related:

* retrieval cache
* embedding/cache entries where applicable
* document metadata cache
* application-level cached context

```text
Document deleted
      ↓
Index deletion
      +
Cache invalidation
```

---

## 5. What about a document that is being processed?

Suppose:

```text
Document updated
       ↓
Re-indexing
       ↓
Document deleted during processing
```

We need idempotent processing and version/change checks so an old ingestion job doesn't accidentally recreate a deleted document.

For example:

```text
document_id = DOC123
version = 7
```

If version 7 was deleted and an older ingestion job tries to write version 6, the pipeline should reject that stale write.

---

## 6. Security consideration

Deletion should also respect ACL/security metadata.

If access is revoked rather than the document itself being deleted:

```text
Access revoked
      ↓
Update ACL metadata
      ↓
Future retrieval blocked
```

If the document is actually deleted:

```text
Document deleted
      ↓
Remove indexed chunks
      ↓
Invalidate cache
```

These are different operations.

---

### 🎯 Strong interview answer

> **“When a source document is deleted, we propagate that deletion to the RAG index using the document ID stored on every chunk. We detect the deletion through source change events or periodic reconciliation, then batch-delete all associated chunks from Azure AI Search and invalidate related caches. The deletion operation is idempotent and uses retry and DLQ handling for failures. We also protect against stale ingestion jobs recreating deleted content by using document versions or change timestamps.”**

### Easy memory trick

**Detect → Identify → Delete → Invalidate → Retry → Verify**

The key interview line:

> **“Every chunk carries a document ID, so deleting one source document lets us reliably remove all of its indexed chunks.”**
