## What if retrieved documents are wrong?

This is an important **RAG grounding risk**. RAG does not automatically make the answer correct—**if the retrieved data is wrong, outdated, or irrelevant, the LLM can produce a confidently wrong answer based on it.**

In CWD, I handle this with **data quality + retrieval validation + grounding controls**.

### CWD flow

```text id="v5j5y5"
Enterprise Sources
      ↓
Ingestion Validation
      ↓
Clean / Deduplicate / Version
      ↓
Metadata + ACL
      ↓
Azure AI Search
      ↓
Hybrid Retrieval + Reranking
      ↓
Relevance / Freshness Check
      ↓
LLM
      ↓
Grounding Validation
      ↓
Response / Abstain
```

### 1. Validate documents during ingestion

Before indexing documents, I check:

* Required fields
* Empty/corrupt documents
* Duplicate content
* Document version
* Metadata
* Source
* Last modified timestamp
* ACL/security information
* Parsing/chunking quality

Bad documents go to a **quarantine/DLQ** instead of being indexed.

### 2. Check freshness

Suppose SharePoint contains:

```text
Version 1 → Customer contract expires Dec 2026
Version 2 → Customer contract expires Dec 2027
```

If we accidentally retrieve Version 1, the answer could be wrong.

So I maintain metadata such as:

```json id="6j5e4g"
{
  "document_id": "DOC123",
  "version": "v2",
  "last_modified": "2026-09-15",
  "is_current": true
}
```

The retrieval layer can prioritize the current version.

### 3. Don't trust a single retrieved chunk blindly

For important questions, I can retrieve multiple pieces of evidence.

```text id="3l2k6d"
Query
 ↓
Top 10 results
 ↓
Reranking
 ↓
Compare evidence
 ↓
Consistent?
 ├── Yes → LLM
 └── No → Flag / retrieve more / abstain
```

For example, if three current documents say **$10M revenue** and one old document says **$7M**, metadata and freshness rules help identify the newer source.

### 4. Use relevance thresholds

If retrieval confidence/relevance is too low:

```text id="0xw5kt"
Search
 ↓
Relevance score
 ↓
Below threshold?
      ↓
    YES
      ↓
Don't answer confidently
      ↓
"Insufficient information"
```

This is important because **irrelevant retrieval can be just as dangerous as no retrieval**.

### 5. Validate against authoritative systems

For CWD, some information should come from the **system of record** rather than documents.

For example:

```text
Customer profile → Salesforce
Current incidents → ServiceNow
Current policy document → SharePoint
```

If the question is:

> "How many open incidents does C12345 have?"

I would prefer:

```text
Incident Worker
    ↓
MCP
    ↓
ServiceNow
```

rather than relying on an old PDF containing incident information.

### 6. Detect conflicting sources

If sources disagree:

```text
Source A → Status = Open
Source B → Status = Closed
```

I don't simply let the LLM choose arbitrarily.

I apply source-priority/business rules:

```text
System of Record
      >
Current approved document
      >
Older document
      >
General knowledge
```

If the conflict cannot be resolved, the system should **surface the conflict or abstain**.

### Interview-ready answer

> **“RAG itself doesn't guarantee that retrieved information is correct. In CWD, I address that at multiple layers. During ingestion, I validate documents, remove duplicates, track versions and freshness, and enforce ACL metadata. During retrieval, I use hybrid search, reranking, relevance thresholds, and metadata filters. For critical transactional information, I prefer the system of record through MCP—for example, ServiceNow for current incidents—rather than relying on an old document. If retrieved sources conflict or don't meet the relevance and freshness requirements, I don't allow the LLM to guess; I either retrieve better evidence, use the authoritative source, or abstain.”**

### Easy memory

**Wrong RAG data → Validate → Version → Freshness → Rerank → Authoritative source → Abstain if uncertain.**

**Key interview line:**

> **“Grounding is only as strong as the evidence we retrieve, so I validate the data before and after retrieval rather than blindly trusting RAG.”**
