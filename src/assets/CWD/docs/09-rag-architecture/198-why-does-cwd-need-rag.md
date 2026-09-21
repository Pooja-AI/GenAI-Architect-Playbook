## Why does CWD need RAG?

CWD needs **RAG (Retrieval-Augmented Generation)** because the LLM should not depend only on its training knowledge. It needs to retrieve **current, private, enterprise information** before generating an answer.

### In CWD

For example, a user asks:

> “Give me a briefing for customer C123.”

The Workers may need information from:

```text
Salesforce     → customer & opportunity data
ServiceNow     → incidents/tickets
SharePoint     → customer documents
Enterprise KB  → policies/product information
```

RAG helps retrieve the relevant information and provide it to the LLM.

### Simple flow

```text
User
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
RAG Retrieval
  ↓
Azure AI Search
  ↓
Relevant enterprise data
  ↓
LLM
  ↓
Grounded response
```

### Why RAG?

* **Current information** → retrieves latest enterprise data
* **Private information** → accesses company-specific knowledge
* **Less hallucination** → LLM answers using retrieved context
* **Better relevance** → retrieves only information related to the request
* **Traceability** → can provide source documents/references
* **Access control** → retrieval can apply user/document ACLs

### 🎯 Strong interview answer

> **“CWD uses RAG because our agents need current and private enterprise knowledge that the LLM doesn't have in its training data. For example, during a customer briefing, Workers retrieve relevant Salesforce, ServiceNow, or SharePoint information and provide that context to the LLM. This improves accuracy, reduces hallucination, and allows us to apply enterprise access controls.”**

### Easy memory trick

**RAG = Retrieve → Ground → Generate**

> **Don't let the LLM guess; retrieve the enterprise data first, then generate the answer.**
