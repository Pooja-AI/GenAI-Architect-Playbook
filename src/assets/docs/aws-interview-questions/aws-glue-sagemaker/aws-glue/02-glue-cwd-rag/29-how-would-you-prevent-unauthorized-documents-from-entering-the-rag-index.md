## How would you prevent unauthorized documents from entering the RAG index?

I would enforce **authorization during ingestion**, before the document is indexed.

```text id="f0qk3m"
Source System
    ↓
Extract Document + ACL
    ↓
Validate ACL
    ↓
Authorized? ── No → Reject / Quarantine
    │
   Yes
    ↓
Chunk + Metadata
    ↓
Embedding
    ↓
OpenSearch
```

### Practical controls

1. **Extract source ACLs** from SharePoint/Salesforce/ServiceNow.
2. **Validate the ACL** before indexing.
3. Attach `tenant_id`, `group_ids`, `user_ids`, etc. to every chunk.
4. **Reject/quarantine** documents with missing or invalid security metadata.
5. Encrypt and restrict access to the ingestion pipeline.
6. Periodically **reconcile ACL changes** and remove/restrict stale documents.

### Important

I would use **two security layers**:

```text
Ingestion-time authorization
          +
Query-time authorization
```

Even if a document was correctly indexed, a user's permissions may change later, so query-time ACL filtering is still required.

### Interview answer

> “I would prevent unauthorized documents from entering the RAG index by extracting and validating source ACLs before indexing. Documents with missing or invalid permissions would be quarantined rather than indexed. I would attach ACL metadata to every chunk and also enforce entitlement filtering at query time, because permissions can change after ingestion.”

**Memory:**
**Extract ACL → Validate → Reject/Quarantine → Index with ACL → Filter at Query**


## How would you prevent unauthorized documents from entering the RAG index?

I would enforce **authorization during ingestion**, before the document is indexed.

```text id="f0qk3m"
Source System
    ↓
Extract Document + ACL
    ↓
Validate ACL
    ↓
Authorized? ── No → Reject / Quarantine
    │
   Yes
    ↓
Chunk + Metadata
    ↓
Embedding
    ↓
OpenSearch
```

### Practical controls

1. **Extract source ACLs** from SharePoint/Salesforce/ServiceNow.
2. **Validate the ACL** before indexing.
3. Attach `tenant_id`, `group_ids`, `user_ids`, etc. to every chunk.
4. **Reject/quarantine** documents with missing or invalid security metadata.
5. Encrypt and restrict access to the ingestion pipeline.
6. Periodically **reconcile ACL changes** and remove/restrict stale documents.

### Important

I would use **two security layers**:

```text
Ingestion-time authorization
          +
Query-time authorization
```

Even if a document was correctly indexed, a user's permissions may change later, so query-time ACL filtering is still required.

### Interview answer

> “I would prevent unauthorized documents from entering the RAG index by extracting and validating source ACLs before indexing. Documents with missing or invalid permissions would be quarantined rather than indexed. I would attach ACL metadata to every chunk and also enforce entitlement filtering at query time, because permissions can change after ingestion.”

**Memory:**
**Extract ACL → Validate → Reject/Quarantine → Index with ACL → Filter at Query**
