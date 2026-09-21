## How do you handle stale documents?

**Stale documents are documents in the RAG index that are outdated compared with the current source system.**

For an enterprise RAG like **CWD**, I handle staleness through **metadata, incremental ingestion, deletion handling, freshness rules, and monitoring**.

### CWD approach

```text
SharePoint / Enterprise Source
          ↓
Change Detection
          ↓
Incremental Ingestion
          ↓
Update / Delete Index
          ↓
Azure AI Search
          ↓
Freshness + ACL Filtering
          ↓
Hybrid Retrieval
          ↓
Reranking
          ↓
LLM
```

### 1. Store document timestamps

During ingestion, store metadata such as:

```json id="c2m8ka"
{
  "document_id": "DOC123",
  "version": "v7",
  "last_modified": "2026-09-18T10:30:00Z",
  "ingested_at": "2026-09-18T10:35:00Z",
  "source": "SharePoint"
}
```

This allows us to determine how fresh the indexed content is.

---

### 2. Detect changes

Instead of rebuilding the entire index every time:

```text id="7qv3mx"
Source document changed
       ↓
Change detected
       ↓
Re-process document
       ↓
Re-chunk
       ↓
Re-embed
       ↓
Update Azure AI Search
```

For unchanged documents, we don't need to reprocess them.

This is **incremental ingestion**.

---

### 3. Handle deleted documents

Suppose a SharePoint document is deleted.

We don't want its old chunks remaining in Azure AI Search.

```text id="p3z8kn"
Source deleted
      ↓
Deletion event detected
      ↓
Find document_id
      ↓
Delete associated chunks
      ↓
Index stays synchronized
```

This is important because otherwise the LLM could retrieve information that no longer exists.

---

### 4. Use freshness metadata during retrieval

For some use cases, we can apply a freshness rule.

For example:

```text id="n8x2qa"
document_type = "Incident"
AND last_modified >= today - 90 days
```

Or use the timestamp as a ranking signal.

But I wouldn't blindly filter everything by date because an old document may still be authoritative—for example, an engineering specification or policy.

---

### 5. Distinguish authoritative vs stale

This is important in enterprise RAG.

An old document isn't necessarily wrong.

For example:

```text id="2d7mvp"
2024 Product Specification
```

could still be the current approved specification.

So I would maintain metadata such as:

```text id="f8k4zr"
status = Active / Deprecated
version = v7
effective_date
expiration_date
last_modified
source
```

Then retrieval can prefer **active/current versions**.

---

### 6. Version documents

Suppose we have:

```text id="3x6mqa"
A100 Troubleshooting v1
A100 Troubleshooting v2
A100 Troubleshooting v3
```

We should avoid giving all three versions to the LLM.

Instead:

```text id="q4p9sv"
v1 → Deprecated
v2 → Deprecated
v3 → Active
```

Retrieve the active version.

---

### 7. Use TTL only where appropriate

For highly time-sensitive information, we can define a freshness window.

Example:

```text id="4f7b2m"
Incident data → very short freshness requirement
Sales opportunities → short freshness requirement
Product manuals → longer freshness requirement
Historical reports → may never expire
```

So **freshness policy should be data-type specific**, not one global TTL.

---

## Important: RAG vs live enterprise data

This is particularly important in your CWD architecture.

If the user asks:

> **"What is the current status of incident INC123?"**

I would **not rely only on an indexed RAG document**.

Instead:

```text id="s7m3kn"
Current incident status
        ↓
ServiceNow MCP
        ↓
Live ServiceNow data
```

Whereas:

> **"What is the troubleshooting procedure for A100 overheating?"**

can use:

```text id="x2v8qa"
SharePoint
   ↓
RAG
   ↓
Azure AI Search
```

So:

> **Static knowledge → RAG**
> **Current transactional state → MCP/API**

---

## 🎯 Strong interview answer

> **“We handle stale documents through incremental ingestion and freshness-aware metadata. During ingestion we store document version, last-modified time, ingestion time, and active or deprecated status. When the source changes, we reprocess only the affected document, including re-chunking and re-embedding, and we remove deleted documents from the index. For time-sensitive data we apply freshness rules, but we don't blindly expire old documents because some older documents can still be authoritative. For real-time information such as current ServiceNow incidents or Salesforce status, we query the live system through MCP rather than relying on RAG.”**

### Easy memory trick

**Detect → Update → Version → Delete → Freshness → Live API when needed**

And the key interview line:

> **“RAG is for knowledge; MCP is for current transactional truth.”**
