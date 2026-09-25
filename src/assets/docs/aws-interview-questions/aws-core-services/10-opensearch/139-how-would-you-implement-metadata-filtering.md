# How would you implement metadata filtering?

In CWD, I would store **metadata along with every document chunk** and apply filters **during retrieval**, before sending the results to the LLM.

```text
User Query
    ↓
Authenticate User
    ↓
Get User Entitlements
    ↓
Create Query Embedding
    ↓
OpenSearch
 ┌─────────────────────────────┐
 │ Vector / BM25 Search        │
 │ + Metadata Filters          │
 │ + ACL Filters               │
 └─────────────────────────────┘
    ↓
Authorized Relevant Chunks
    ↓
Bedrock
    ↓
Answer
```

### 1. Store metadata with each chunk

For example:

```json
{
  "chunk_id": "C123",
  "document_id": "DOC456",
  "text": "Customer warranty policy...",
  "embedding": [0.12, -0.43, 0.87],
  "tenant_id": "ONSEMI",
  "department": "SALES",
  "classification": "INTERNAL",
  "region": "US",
  "active": true,
  "allowed_groups": ["sales-team"]
}
```

### 2. Build filters from the authenticated user

Suppose the user belongs to:

```text
tenant = ONSEMI
department = SALES
region = US
groups = sales-team
```

The retrieval query would conceptually apply:

```text
tenant_id = ONSEMI
AND department = SALES
AND region = US
AND active = true
AND user/group has access
```

### 3. Combine filtering with vector search

```text
Query
 ↓
Embedding
 ↓
OpenSearch
 ├── Vector similarity
 ├── tenant_id filter
 ├── department filter
 ├── region filter
 ├── active filter
 └── ACL filter
 ↓
Top-K authorized chunks
```

This is important because I **don't want to retrieve sensitive documents first and then ask the LLM to decide whether the user can see them**.

### 4. Example

Suppose OpenSearch contains:

| Document | Department | Classification | Access |
| -------- | ---------- | -------------- | ------ |
| DOC1     | Sales      | Internal       | Sales  |
| DOC2     | HR         | Confidential   | HR     |
| DOC3     | IT         | Internal       | IT     |

User is a Sales employee.

A query about company policies might semantically match all three, but the retrieval filter allows only:

```text
DOC1
```

The HR document should never enter the LLM context.

### 🎯 Strong interview answer

> **“In CWD, I store metadata such as tenant, department, region, classification, document version, active status, and ACL information with every chunk. After authenticating the user, I obtain their entitlements and construct metadata and authorization filters. I apply those filters directly in OpenSearch along with vector or hybrid search, so only authorized and relevant chunks are returned. Authorization happens outside the LLM—the LLM is responsible for generation, not access control.”**

### Easy memory trick

**Authenticate → Authorize → Filter → Retrieve → Generate**

**Key distinction:**
**Metadata filtering** narrows results based on attributes like department, region, and document status.
**ACL filtering** determines whether the specific user/group is allowed to access the document.
