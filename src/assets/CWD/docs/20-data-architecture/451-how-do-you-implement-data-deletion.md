## How do you implement data deletion?

In CWD, I implement **policy-driven, auditable deletion** across all places where user or workflow data may exist—not just the primary database.

```text id="6v2r8k"
Deletion Request
      ↓
Authenticate + Authorize
      ↓
Identify Data
      ↓
Find all storage locations
      ↓
Delete / Expire
      ↓
Caches + Indexes + Logs
      ↓
Verify deletion
      ↓
Audit deletion
```

### 1. Identify what needs to be deleted

For a conversation deletion request, I use identifiers such as:

```text
tenant_id
user_id
conversation_id
workflow_id
```

Then identify associated data:

```text id="p7k3xq"
Conversation
Workflow state
Redis cache
RAG/cache entries
Search documents, if applicable
LLM traces
Application logs
Audit references
```

I don't blindly delete business records from Salesforce or ServiceNow because those are **system-of-record data** and may have separate retention policies.

---

### 2. Delete from durable conversation storage

For example:

```text id="x5r9mb"
Cosmos DB
   ↓
Find conversation_id = CONV-1001
   ↓
Delete conversation records
```

If workflow state is also subject to deletion:

```text id="q3n8vz"
workflow_id = WF-1001
       ↓
Delete eligible workflow-state records
```

But if there is a legal/compliance requirement to retain a particular audit record, that retention policy takes precedence.

---

### 3. Delete cached data

This is easy to forget.

If the conversation was cached:

```text id="w1s7cx"
Redis
 ↓
conversation:CONV-1001
 ↓
DELETE
```

I also invalidate related semantic-cache entries so deleted data isn't returned from a cache.

---

### 4. Handle vector/RAG data

If user-specific documents were indexed into the vector store:

```text id="8f2mqp"
Azure AI Search
       ↓
Filter by tenant_id / document_id
       ↓
Delete corresponding chunks/vectors
```

For shared enterprise documents, I don't automatically delete the source document merely because one user's conversation was deleted. The source system's ownership and retention policy determines that.

---

### 5. Handle logs and telemetry

This is important because sensitive information can accidentally appear in telemetry.

I design logging to **avoid storing full sensitive payloads in the first place**.

For existing telemetry:

```text id="9x3kqa"
trace_id
workflow_id
conversation_id
user_id
       ↓
Retention / deletion policy
```

Where the logging platform supports deletion or retention controls, I apply them according to the organization's policy.

---

### 6. Deletion should be idempotent

If the deletion request is received twice:

```text id="v2a7rm"
DELETE CONV-1001
       ↓
First request → deleted
Second request → already deleted
```

It should not cause an error that prevents the deletion workflow from completing.

I use a deletion request ID:

```json id="c1x8dz"
{
  "deletion_request_id": "DEL-9001",
  "conversation_id": "CONV-1001",
  "requested_by": "U123",
  "status": "COMPLETED"
}
```

---

### 7. Verify deletion

I don't simply issue `DELETE` and assume everything is gone.

I verify:

```text id="h5k0pz"
Cosmos DB       → deleted
Redis           → invalidated
Vector index    → deleted if applicable
LLM/telemetry   → handled according to policy
```

Then mark:

```text
Deletion status = VERIFIED
```

---

### 8. Keep an audit trail of the deletion

The **data itself** can be deleted while the **fact that a deletion occurred** may need to be retained, depending on policy.

For example:

```json id="7e0q2m"
{
  "event": "DATA_DELETION",
  "deletion_request_id": "DEL-9001",
  "conversation_id": "CONV-1001",
  "requested_at": "...",
  "completed_at": "...",
  "status": "VERIFIED"
}
```

I would minimize the audit record so it doesn't recreate the sensitive data that was deleted.

---

## 🎯 Interview-ready answer

> **“In CWD, I implement data deletion as an orchestrated, auditable workflow. First I authenticate and authorize the deletion request and identify the related tenant, user, conversation, and workflow IDs. Then I delete eligible data from durable conversation storage, invalidate Redis and semantic caches, and remove user-specific vector data from Azure AI Search where applicable. I also apply the appropriate retention or deletion policy to telemetry and logs. I don't automatically delete authoritative Salesforce or ServiceNow records because those systems have their own data ownership and retention policies. The deletion operation is idempotent, and after deletion I verify each storage location and record a minimal audit event showing that the deletion was completed.”**

### Easy memory

**Identify → Authorize → Delete → Invalidate cache → Remove index data → Handle telemetry → Verify → Audit**

> **Strong interview line:** **“Deletion is a workflow across all data copies, not just a DELETE statement against one database.”**
