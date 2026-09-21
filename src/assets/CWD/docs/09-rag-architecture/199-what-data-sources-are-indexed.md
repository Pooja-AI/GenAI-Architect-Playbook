## What data sources are indexed?

In CWD, we index **enterprise knowledge that is useful for search and RAG**, especially unstructured or semi-structured content.

### Main sources

```text
SharePoint / M365
       ↓
Product & technical documents
       ↓
Policies / SOPs / manuals
       ↓
Knowledge articles
       ↓
Support documentation
       ↓
Azure AI Search
       ↓
RAG
```

We can also index selected data from:

* **SharePoint / M365** → documents, manuals, policies, knowledge articles
* **ServiceNow** → knowledge articles, resolved incident information
* **Salesforce** → selected customer/opportunity information when search is required
* **Enterprise databases** → approved business/technical knowledge
* **Product documentation** → specifications, troubleshooting guides

### Important distinction

Not **all enterprise data** needs to be indexed.

For example:

```text
Salesforce
   ├── Customer profile → API/MCP lookup
   ├── Live opportunity → API/MCP lookup
   └── Historical knowledge → potentially indexed

SharePoint
   └── Documents → RAG / Azure AI Search
```

For **real-time transactional data**, we generally use **MCP/API calls** rather than relying on a potentially stale index.

### 🎯 Strong interview answer

> **“In CWD, we index enterprise knowledge such as SharePoint documents, product documentation, policies, SOPs, knowledge articles, and selected ServiceNow or Salesforce content where search is required. We don't index everything. For real-time transactional information like the latest customer or incident status, the Worker uses MCP to query the source system directly. Azure AI Search is mainly used for retrieval and RAG over searchable enterprise knowledge.”**

**Memory trick:**
**Static knowledge → RAG/Search**
**Live transactional data → MCP/API**
