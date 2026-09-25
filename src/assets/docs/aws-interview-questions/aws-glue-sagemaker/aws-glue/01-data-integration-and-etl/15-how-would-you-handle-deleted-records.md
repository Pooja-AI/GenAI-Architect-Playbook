## How would you handle deleted records?

I would use **CDC/change tracking** when available, because a normal `LastModifiedDate` query may not see records that were deleted.

```text
Salesforce
    ↓
CDC / Delete Detection
    ↓
Delete Event
    ↓
Glue Processing
    ↓
S3 / OpenSearch
    ↓
Remove or mark record inactive
```

### Example

If Salesforce deletes:

```text
customer_id = 123
```

I would capture:

```text
customer_id = 123
operation = DELETE
```

Then remove the corresponding document from OpenSearch or mark it as deleted in the curated data.

### If CDC is not available

Use:

* **Soft-delete flag** such as `IsDeleted`
* Periodic **full reconciliation**
* Compare source records against the target

### Important

For RAG, I would **not allow deleted documents to remain searchable**, because the LLM could retrieve stale information.

### Interview answer

> “For deleted records, I prefer CDC when the source supports it, because it captures delete events. The ingestion pipeline propagates the delete to S3 or OpenSearch, either by removing the record or marking it inactive. If CDC isn't available, I would use a soft-delete field or periodic reconciliation to detect deletions.”

**Memory:**
**CDC → Detect Delete → Propagate Delete → Remove from Search**
