## How does CWD integrate with SharePoint?

In CWD, **Workers don't directly connect to SharePoint**. A Worker uses an **MCP Client** to call approved SharePoint tools exposed through a **SharePoint MCP Server**.

### CWD flow

```text
User
  ↓
Coordinator
  ↓ A2A
Relevant Delegator
  ↓
Knowledge / Document Worker
  ↓ MCP Client
SharePoint MCP Server
  ↓
Microsoft Graph / SharePoint APIs
  ↓
SharePoint Documents
```

### Example: Customer Briefing

Suppose the user asks:

> **“Give me a customer briefing for C12345, including relevant documents from SharePoint.”**

The Coordinator creates:

```text
Intent       = Customer Briefing
customer_id  = C12345
requirements = CRM + Incidents + SharePoint documents
```

It can route the work like this:

```text
                    Coordinator
                         |
          +--------------+--------------+
          |              |              |
          ▼              ▼              ▼
   Sales Delegator  IT Delegator   Knowledge Delegator
          |              |              |
      Salesforce      ServiceNow    Document Worker
                                         |
                                         ▼
                                    MCP Client
                                         |
                                         ▼
                               SharePoint MCP Server
                                         |
                                         ▼
                              SharePoint / Graph API
```

### 1. Document Worker receives the request

The Worker might receive:

```json
{
  "customer_id": "C12345",
  "document_types": [
    "customer_profile",
    "technical_document",
    "project_document"
  ]
}
```

The important point is that the Worker doesn't need to know how SharePoint authentication or API calls work.

---

### 2. Worker calls an MCP tool

For example:

```python
documents = await mcp_client.call_tool(
    "search_sharepoint_documents",
    {
        "customer_id": "C12345",
        "query": "customer technical project",
        "top_k": 5
    }
)
```

Other approved tools could be:

```text
search_sharepoint_documents
get_sharepoint_document
get_document_metadata
list_sharepoint_files
```

For write operations, you might expose tools such as:

```text
create_sharepoint_file
update_sharepoint_file
```

but these should have stricter authorization than read-only tools.

---

### 3. SharePoint MCP Server handles the integration

The MCP Server becomes the controlled integration boundary:

```text
MCP Request
    ↓
Validate parameters
    ↓
Authenticate workload
    ↓
Check user/agent authorization
    ↓
Apply SharePoint permissions
    ↓
Call Microsoft Graph / SharePoint
    ↓
Validate response
    ↓
Return structured result
```

For example:

```json
{
  "documents": [
    {
      "document_id": "DOC1001",
      "name": "ABC_Customer_Architecture.pdf",
      "source": "SharePoint",
      "url_reference": "...",
      "last_modified": "2026-09-20"
    }
  ]
}
```

---

## 4. Where does RAG fit?

This is an important interview distinction.

If the requirement is simply:

> “Find documents in SharePoint.”

the Worker can use the SharePoint MCP tool directly.

But if the requirement is:

> “Find relevant SharePoint information and answer questions from those documents.”

then CWD can use a **RAG pipeline**.

```text
SharePoint
    ↓
Document Ingestion
    ↓
Extract / Clean
    ↓
Chunk
    ↓
Add Metadata + ACL
    ↓
Embedding
    ↓
Azure AI Search
    ↓
Hybrid Retrieval
    ↓
Document Worker
    ↓
LLM
    ↓
Grounded Answer
```

For example, metadata might include:

```json
{
  "document_id": "DOC1001",
  "tenant_id": "T001",
  "customer_id": "C12345",
  "source": "SharePoint",
  "document_type": "technical",
  "acl": [
    "sales-team",
    "engineering-team"
  ],
  "classification": "Confidential",
  "embedding_version": "v2"
}
```

This is important because **the embedding itself doesn't provide authorization**. We preserve ACL/security metadata and apply authorization/entitlement filtering before returning content to the Worker/LLM.

---

## 5. How do you protect SharePoint data?

I would use **entitlement-first retrieval**:

```text
User Identity
     ↓
Authentication
     ↓
Authorization / Entitlements
     ↓
Tenant + ACL Filters
     ↓
SharePoint / Search
     ↓
Authorized Documents
     ↓
Worker
     ↓
LLM
```

The LLM doesn't decide:

> “This user should be allowed to see this document.”

That decision happens in the **security/policy layer**.

Also:

* Use least-privilege permissions.
* Don't put SharePoint credentials in prompts.
* Use Managed Identity/OAuth where applicable.
* Validate MCP parameters.
* Audit document access.
* Don't expose unnecessary document contents to the LLM.
* Preserve document ACL and classification metadata.
* Protect against prompt injection in retrieved documents.

---

## 6. What if SharePoint is unavailable?

The Worker should return a structured failure:

```json
{
  "status": "DEPENDENCY_UNAVAILABLE",
  "source": "SharePoint",
  "retryable": true
}
```

CWD can then:

```text
SharePoint failure
       ↓
Retry with backoff
       ↓
Still unavailable?
       ↓
Circuit breaker
       ↓
Coordinator
       ↓
Partial Customer Briefing
```

The Coordinator could still return Salesforce and ServiceNow information while clearly indicating that SharePoint information was unavailable.

**It should never invent SharePoint content.**

---

## Interview-ready answer

> **“In CWD, we integrate with SharePoint through an MCP-based tool layer. The Coordinator identifies when document or knowledge information is required and routes that work to the appropriate Delegator and Document Worker. The Worker uses an MCP Client to call approved SharePoint tools such as document search or document retrieval. The SharePoint MCP Server handles authentication, authorization, parameter validation, Microsoft Graph or SharePoint API communication, retries, timeouts, and auditing. For document-based question answering, SharePoint documents can also be ingested into our RAG pipeline, where we chunk and embed them into Azure AI Search along with security metadata such as tenant and ACL information. At retrieval time, we apply entitlement and metadata filtering before passing content to the LLM. If SharePoint is unavailable, we return a structured dependency failure or partial result rather than hallucinating document content.”**

### Easy memory

**Coordinator → Delegator → Document Worker → MCP → SharePoint**

For RAG:

**SharePoint → Chunk → Embed → Azure AI Search → ACL Filter → Retrieve → LLM**

**Strong interview line:**

> **“SharePoint remains the source of truth; MCP provides controlled access, and Azure AI Search provides the retrieval layer when we need RAG.”**
