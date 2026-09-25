# How would you control access to documents in CWD?

I would use **defense in depth** and enforce authorization **before retrieval**.

```text
User
 ↓
Authentication
 ↓
User Identity + Roles
 ↓
Authorization / Entitlement Check
 ↓
OpenSearch ACL Filter
 ↓
Authorized Documents
 ↓
LLM
```

## 1. Authenticate the user

First, identify who the user is.

For example:

```text
User
 ↓
Microsoft Entra ID / enterprise IdP
 ↓
User ID + Groups + Roles
```

Authentication answers:

> **Who is the user?**

---

## 2. Store document ACL metadata

During document ingestion, I would capture access information.

Example:

```text
document_id: DOC123
department: Finance
classification: Confidential
allowed_groups:
  - Finance
  - Finance-Managers
```

Then propagate that metadata to the RAG index.

```text
S3
 ↓
Ingestion Worker
 ↓
Document + ACL metadata
 ↓
OpenSearch
```

---

## 3. Apply authorization before retrieval

Suppose:

```text
User = Pooja
Groups = Finance
```

The retrieval request becomes conceptually:

```text
Search:
    "customer contract"

Filter:
    user/group has access
```

Only authorized chunks are returned.

```text
OpenSearch
 ├── Public document       ✅
 ├── Finance document      ✅
 └── HR confidential doc   ❌
```

---

## 4. Don't let the LLM decide authorization

This is extremely important.

I would **not** do:

```text
LLM → "Should this user see the document?"
```

Instead:

```text
Identity
   ↓
Authorization service/policy
   ↓
Retrieval filter
   ↓
Authorized context
   ↓
LLM
```

The LLM only receives content that the user is already authorized to access.

---

## 5. Enforce access at multiple layers

### Storage layer

S3:

* IAM
* Bucket policies
* Block Public Access
* KMS encryption

### Application layer

CWD:

* User identity
* Roles/groups
* Entitlement checks

### Retrieval layer

OpenSearch:

* Metadata/ACL filters
* Tenant filtering
* Document classification filtering

---

## 6. Multi-tenant example

If CWD supports multiple tenants:

```text
document_id
tenant_id
classification
allowed_groups
```

Query:

```text
tenant_id = current_user.tenant_id
AND
user/group has access
```

This prevents one tenant from retrieving another tenant's documents.

---

## 7. Handle access changes

Suppose a user moves from Finance to Sales.

Their authorization should change immediately or within the organization's defined propagation SLA.

I would avoid relying only on a stale cached permission.

For highly sensitive content:

```text
Current identity
       ↓
Current entitlement
       ↓
Retrieve
```

---

# 🎯 Strong interview answer

> **“I would control document access using identity-based authorization combined with document-level ACL metadata. First, I authenticate the user and obtain their roles, groups, tenant and other entitlements. During ingestion, I attach the document's ACL and classification metadata to the OpenSearch chunks. At query time, authorization is evaluated before retrieval, and OpenSearch applies filters so only authorized chunks are returned. The LLM never makes the authorization decision; it only receives content that has already passed the access-control checks. I would also enforce S3 IAM, bucket policies, KMS, and tenant isolation as additional security layers.”**

### Easy memory trick

**Identify → Authorize → Filter → Retrieve → Generate**

### Key distinction

**Authentication:** *Who are you?*
**Authorization:** *What are you allowed to access?*
**ACL metadata:** *Which documents can you access?*
**LLM:** *Generates an answer from already-authorized content.*
