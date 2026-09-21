## How do you implement ACL filtering?

**ACL filtering means making sure the RAG system only retrieves documents/chunks that the current user is authorized to see.**

In your **CWD enterprise RAG**, I would implement it as **security metadata + identity-based filtering at Azure AI Search**.

### 1. Store ACL metadata with every chunk

During ingestion, each chunk gets security metadata:

```json
{
  "chunk_id": "DOC123_05",
  "content": "A100 cooling failure...",
  "department": "Engineering",
  "region": "US",
  "allowed_groups": [
    "Engineering",
    "A100-Team"
  ],
  "allowed_users": [],
  "document_id": "DOC123"
}
```

The important point is that **ACL information travels with the indexed chunk**.

---

### 2. Get the user's identity

The user authenticates through **Microsoft Entra ID**.

```text
User
 ↓
Entra ID
 ↓
Access Token
 ↓
Coordinator
```

The token contains identity information such as:

```text
user_id
groups
roles
```

---

### 3. Convert identity into search filters

Suppose the user belongs to:

```text
Engineering
A100-Team
```

The Worker constructs an ACL filter such as:

```text
allowed_groups/any(g:
    search.in(g, 'Engineering,A100-Team', ',')
)
```

Conceptually:

```text
User Groups
     ↓
ACL Filter
     ↓
Azure AI Search
```

---

### 4. Apply ACL filtering during retrieval

This is very important:

```text
User Query
    ↓
Generate embedding
    ↓
Azure AI Search
    │
    ├── ACL filter
    ├── Metadata filter
    ├── BM25
    └── Vector search
    ↓
Authorized candidate chunks
    ↓
Semantic ranking
    ↓
Top K
    ↓
LLM
```

So an unauthorized document should **never become RAG context**.

---

## Example

Suppose Azure AI Search has:

| Document | Department  | ACL         |
| -------- | ----------- | ----------- |
| DOC1     | Engineering | Engineering |
| DOC2     | HR          | HR          |
| DOC3     | Engineering | Engineering |
| DOC4     | Finance     | Finance     |

User belongs to:

```text
Engineering
```

The query:

> "What caused the A100 failure?"

might semantically match all four documents.

But ACL filtering restricts retrieval to:

```text
DOC1 ✅
DOC3 ✅

DOC2 ❌
DOC4 ❌
```

The LLM only receives DOC1 and DOC3.

---

## Where should ACL enforcement happen?

**Not only in the LLM.**

Never do:

```text
Retrieve everything
       ↓
LLM decides what user can see
```

The LLM should **not be trusted to enforce authorization**.

Instead:

```text
Identity
   ↓
Authorization
   ↓
ACL filter
   ↓
Search
   ↓
LLM
```

For sensitive enterprise systems, I would also enforce authorization again when accessing the **live source system** through MCP/API.

---

## CWD example with Salesforce + SharePoint

Suppose a user asks:

> "Give me a customer briefing for C123."

The Coordinator identifies the intent and delegates work.

```text
Coordinator
    ↓
Sales Delegator
    ↓
Customer Worker
    ↓
 ┌─────────────────────┐
 │ SharePoint RAG      │
 │ + ACL filtering     │
 └─────────────────────┘
          +
 ┌─────────────────────┐
 │ Salesforce via MCP  │
 │ + authorization     │
 └─────────────────────┘
```

For SharePoint documents, ACL filtering happens during RAG retrieval.

For Salesforce, the Worker/MCP server validates whether the user is authorized to access customer `C123`.

---

### 🎯 Strong interview answer

> **“We implement ACL filtering by storing document-level and chunk-level security metadata during ingestion, such as allowed groups, users, department, and region. The user's identity and group membership come from Entra ID. At query time, the Worker builds an ACL filter and sends it to Azure AI Search along with the hybrid BM25 and vector query. Only authorized chunks are retrieved and passed to the LLM. We don't rely on the LLM for authorization; access control is enforced before the data becomes RAG context, and sensitive live-system access is authorized again through MCP.”**

### Easy memory trick

**Identity → ACL → Filter → Retrieve → LLM**

Or:

> **“Never retrieve what the user cannot see.”**
