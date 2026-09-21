## How do you handle GDPR-style deletion requirements?

In CWD, I handle GDPR-style deletion as a **controlled data-deletion workflow** across all systems where personal data may exist.

The key principle is:

> **Identify → Verify → Delete → Propagate → Verify → Audit**

### 1. Receive and verify the request

A user or authorized administrator submits a deletion request.

```text id="7g2m1k"
Deletion Request
      ↓
Authenticate user
      ↓
Verify authorization / identity
      ↓
Create deletion_request_id
```

I don't allow the LLM to decide whether someone is authorized to delete data. Authorization is handled by the security layer.

---

### 2. Find all personal-data locations

For CWD, I maintain a data inventory showing where personal data can exist:

```text id="3s8p4v"
User / Conversation
       │
       ├── Cosmos DB → conversation/workflow state
       ├── Redis → cached data
       ├── Azure AI Search → indexed documents, if applicable
       ├── Application Insights / Log Analytics → telemetry
       ├── Langfuse → LLM traces, if applicable
       └── Enterprise systems → Salesforce / ServiceNow / etc.
```

I use identifiers such as:

```text
tenant_id
user_id
conversation_id
workflow_id
document_id
```

to locate related records.

---

### 3. Delete from CWD-managed data

For example:

```text id="4x1m7n"
CONV-1001
   ↓
Cosmos DB → Delete
Redis → Invalidate
Search index → Delete eligible user-owned data
LLM traces → Apply deletion/retention policy
Logs → Apply retention/deletion policy
```

I also invalidate semantic-cache entries so deleted information cannot be returned from a cached response.

---

### 4. Don't blindly delete system-of-record data

This is important in an enterprise architecture.

If the conversation references:

```text
Salesforce customer record
ServiceNow incident
```

I don't automatically delete those records just because a conversation deletion request was received.

Those systems may be **systems of record** with their own legal, business, retention, and data-owner requirements.

Instead, CWD identifies the data and invokes the appropriate enterprise data-governance/deletion process when applicable.

---

### 5. Data minimization helps

The best GDPR-style design is not to store unnecessary personal data in the first place.

For example, instead of storing:

```text id="c6q4bd"
Full Salesforce record
Full ServiceNow record
Full conversation
```

I prefer:

```text id="y7p2fa"
customer_id
record_reference
required workflow result
minimal metadata
```

And I avoid putting sensitive information into logs.

---

### 6. Handle backups and replicas

Deletion isn't complete if an active copy disappears but an accessible backup still contains the data.

I therefore define policies for:

```text id="5k8n3c"
Primary database
      ↓
Replicas
      ↓
Caches
      ↓
Search indexes
      ↓
Backups / archives
```

Backups may follow a different lifecycle—for example, they may be retained until their normal expiration rather than modified immediately, depending on applicable requirements and technical design.

The important point is that the organization must have a documented policy for backup retention and restoration so deleted data isn't unexpectedly reintroduced.

---

### 7. Verify deletion

After the deletion workflow runs:

```text id="9w4t2s"
Deletion
   ↓
Check Cosmos DB
Check Redis
Check Search
Check telemetry
Check applicable enterprise systems
   ↓
Deletion verified
```

I record the result without recreating the deleted personal information.

---

### 8. Maintain a minimal audit record

The **personal data is deleted**, but the organization may need evidence that the deletion request was processed.

For example:

```json id="3v8m1q"
{
  "deletion_request_id": "DEL-9001",
  "request_type": "DATA_DELETION",
  "status": "COMPLETED",
  "requested_at": "...",
  "completed_at": "..."
}
```

I avoid putting the deleted personal content into this audit record.

---

## 🎯 Interview-ready answer

> **“For GDPR-style deletion requirements, I treat deletion as a controlled, auditable workflow rather than simply deleting one database record. First, I authenticate and authorize the request and create a deletion request ID. Then I identify where the person's data exists across CWD, including Cosmos DB, Redis, Azure AI Search, telemetry, LLM traces, and applicable enterprise systems. I delete or invalidate eligible data across those locations and apply the appropriate retention policies to logs, archives, replicas, and backups. I don't blindly delete records from systems such as Salesforce or ServiceNow because they are systems of record with their own data-governance requirements. After deletion, I verify the applicable stores and retain only a minimal audit record showing that the request was processed. I also apply data minimization so we don't unnecessarily store personal data in the first place.”**

### Easy memory

**Verify → Discover → Delete → Propagate → Backups → Verify → Audit**

> **Strong interview line:** **“For privacy deletion, I think in terms of the entire data lifecycle—not just the primary database.”**
