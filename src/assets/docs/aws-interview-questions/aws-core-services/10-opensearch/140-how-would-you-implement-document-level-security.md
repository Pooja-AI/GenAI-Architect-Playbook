# How would you implement document-level security?

In CWD, I would implement **document-level security (DLS)** by storing the **user/group access information as metadata on every document chunk** and enforcing the authorization **before the chunk reaches the LLM**.

```text
User
 ↓
Entra ID / Enterprise IdP
 ↓
Authenticate
 ↓
Get User Groups / Roles
 ↓
CWD Authorization Layer
 ↓
OpenSearch
 ├── Tenant Filter
 ├── ACL / Group Filter
 ├── Classification Filter
 └── Vector / BM25 Search
 ↓
Only Authorized Documents
 ↓
Bedrock
 ↓
Answer
```

## 1. Store ACL metadata during ingestion

When a document enters S3, I extract its security information.

```json
{
  "document_id": "DOC123",
  "chunk_id": "CH456",
  "text": "Customer contract information...",
  "tenant_id": "ONSEMI",
  "classification": "CONFIDENTIAL",
  "allowed_groups": [
    "sales-team",
    "account-managers"
  ],
  "allowed_users": [],
  "active": true
}
```

Every chunk from that document carries the same security metadata.

---

## 2. Identify the user's permissions

For example, the user authenticates through the enterprise identity provider.

```text
User
 ↓
Entra ID
 ↓
User ID + Groups + Roles
```

Suppose the user belongs to:

```text
sales-team
account-managers
```

CWD obtains these entitlements.

---

## 3. Apply authorization during retrieval

The query becomes conceptually:

```text
tenant_id = "ONSEMI"
AND active = true
AND (
     allowed_groups contains "sales-team"
     OR
     allowed_groups contains "account-managers"
     OR
     allowed_users contains current_user
)
```

Then vector/BM25 retrieval happens within that authorized set.

```text
Query
 ↓
Authorization Filter
 ↓
Vector/BM25 Search
 ↓
Authorized Top-K
```

---

## 4. Never let the LLM decide access

This is a **very important interview point**.

❌ Don't do:

```text
Retrieve everything
      ↓
LLM decides what user can see
```

✅ Do:

```text
User Identity
      ↓
Authorization
      ↓
Filtered Retrieval
      ↓
LLM
```

The LLM should **never be the security boundary**.

---

## 5. Protect the original documents too

DLS should exist at multiple layers:

```text
S3
 ↓
IAM + Bucket Policy + KMS
 ↓
CWD Authorization
 ↓
OpenSearch ACL Filtering
 ↓
Bedrock
```

So even if someone bypasses the application, they shouldn't automatically have access to the underlying S3 documents.

---

## 6. Handle permission changes

Suppose:

```text
User was in → sales-team
User removed → sales-team
```

I would ensure the authorization source is refreshed and avoid relying on stale ACL information indefinitely.

For highly sensitive data:

```text
Identity Provider
       ↓
Current Entitlements
       ↓
OpenSearch ACL Filter
```

I would also monitor ACL synchronization and permission-change propagation.

---

# 🎯 Strong interview answer

> **“For document-level security in CWD, I would associate ACL metadata with every document and its chunks during ingestion, including tenant, allowed users, groups, classification and document status. At query time, I authenticate the user through the enterprise identity provider and obtain their current groups and entitlements. The CWD authorization layer converts those entitlements into OpenSearch filters, and retrieval performs vector or hybrid search only within the authorized document set. The LLM never makes authorization decisions. I would also secure the original S3 documents using IAM, bucket policies and KMS. This gives us defense in depth from identity through storage and retrieval.”**

### Easy memory trick

**Identity → Entitlement → ACL Filter → Retrieve → LLM**

### Key distinction

**Metadata filtering:**
“Give me documents from the Sales department.”

**Document-level security:**
“Give me only documents that **this particular user is authorized to access**.”
