## How would you attach ACL metadata to documents?

I would extract the document's **access-control information from the source system** and attach it to every chunk during ingestion.

```text id="f0qk3m"
SharePoint / Salesforce / ServiceNow
            ↓
      Extract ACLs
            ↓
        Glue ETL
            ↓
   Document → Chunks
            ↓
      ACL Metadata
            ↓
       OpenSearch
```

### Example

```text id="l6d7px"
document_id = DOC-123
chunk_id    = DOC-123-C05

allowed_groups:
  - Sales
  - Account-Managers

allowed_users:
  - user123
```

For enterprise systems, I might also store:

```text
tenant_id
department
security_level
source_system
acl_group_ids
```

### At query time

The user's identity/entitlements are checked **before returning chunks**:

```text id="3f9v3j"
User Identity
     ↓
User Entitlements
     ↓
OpenSearch ACL Filter
     ↓
Authorized Chunks Only
     ↓
LLM
```

**Important:** The LLM should **not decide whether a user is authorized**. Authorization must happen in the retrieval/application layer.

### Interview answer

> “During ingestion, I would extract ACL information from the source system and attach it as metadata to every document chunk. At query time, I would obtain the user's entitlements and apply ACL filters during retrieval, so only authorized chunks reach the LLM.”

**Memory:**
**Source ACL → Chunk Metadata → User Entitlement → Filter → LLM**
