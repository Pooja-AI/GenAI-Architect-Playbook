## How do you implement citation generation?

In CWD, I generate citations by **preserving source metadata during ingestion/retrieval and attaching that metadata to the evidence passed to the LLM**.

The important point is:

> **I don't ask the LLM to invent citations. The application provides the source references.**

### CWD flow

```text id="9x4f2m"
Enterprise Documents
       ↓
Ingestion
       ↓
Chunk + Metadata
       ↓
Azure AI Search
       ↓
Retrieve Top-K
       ↓
Evidence with source IDs
       ↓
LLM generates answer + citation references
       ↓
Citation Validator
       ↓
Final Answer + Citations
```

### 1. Store citation metadata during ingestion

When I chunk a document, I store metadata such as:

```json id="2u6c9k"
{
  "document_id": "DOC123",
  "chunk_id": "CH45",
  "title": "Customer Support Policy",
  "source": "SharePoint",
  "source_url": "https://...",
  "page_number": 12,
  "last_modified": "2026-09-15"
}
```

The metadata travels with the chunk into Azure AI Search.

---

### 2. Retrieve evidence with metadata

For example:

```python id="7w2n5p"
results = search(
    query="customer C12345 support policy",
    top_k=5
)
```

Each result contains both content and its source:

```text id="v7j2q4"
Chunk 1
 ├── Content: "Support response time is 4 hours..."
 ├── document_id: DOC123
 ├── page: 12
 └── source: SharePoint

Chunk 2
 ├── Content: "Premium customers receive..."
 ├── document_id: DOC456
 └── page: 4
```

---

### 3. Give evidence IDs to the LLM

Instead of asking:

> “Give me a citation.”

I provide controlled evidence:

```text id="m4t8z1"
[E1]
Customer Support Policy, page 12
"Support response time is 4 hours."

[E2]
Premium Customer Policy, page 4
"Premium customers receive priority support."
```

Then instruct:

```text id="c6p2x9"
Answer only using the supplied evidence.

For each factual claim, provide the
corresponding evidence ID.

Do not create or modify source references.
```

The LLM might produce:

```json id="5j8r3k"
{
  "answer": "The support response time is 4 hours.",
  "citations": ["E1"]
}
```

---

### 4. Resolve citation IDs in the application

The application—not the LLM—maps `E1` back to the real source.

```python id="1x7m4q"
citation = evidence_map["E1"]

# {
#   "document_id": "DOC123",
#   "title": "Customer Support Policy",
#   "page_number": 12,
#   "source_url": "..."
# }
```

This prevents the model from fabricating URLs or document references.

---

### 5. Validate citations

Before returning the answer, I check:

```text id="g3w9s2"
LLM Claim
   ↓
Citation E1
   ↓
Does E1 actually support the claim?
   ↓
 ├── YES → Keep citation
 └── NO  → Reject / regenerate
```

For example, if the LLM says:

> “Response time is 2 hours [E1]”

but E1 actually says **4 hours**, the citation validator catches the mismatch.

---

### 6. Final response

The user sees something like:

> **The support response time is 4 hours.**
> *Source: Customer Support Policy, page 12*

For multiple claims:

> The customer receives priority support **[1]**, with a standard response time of four hours **[2]**.

---

## What about MCP data?

For CWD, citations aren't limited to RAG documents.

For example, ServiceNow:

```text id="n6f3q8"
Incident Worker
      ↓
MCP
      ↓
ServiceNow
      ↓
INC1001
```

I can retain:

```json id="k5d1v7"
{
  "source_type": "ServiceNow",
  "incident_id": "INC1001",
  "retrieved_at": "2026-09-20T10:30:00Z"
}
```

Then the final response can say:

> **INC1001 is currently open and high priority.**
> Source: ServiceNow incident INC1001.

This is especially useful because **live transactional data doesn't necessarily have a document/page citation**.

---

## Interview-ready answer

> **“I implement citations by preserving source metadata throughout the RAG pipeline. During ingestion, every chunk gets metadata such as document ID, chunk ID, title, source URL, page number, version, and timestamp. During retrieval, I assign internal evidence IDs and pass the evidence with those IDs to the LLM. The LLM returns claims mapped to evidence IDs, but the application resolves those IDs to the actual source metadata rather than allowing the model to invent URLs or citations. I then validate that each citation actually supports the claim. For CWD, the same pattern can be used with MCP sources such as ServiceNow or Salesforce, where the citation points to the relevant record or transaction.”**

### Easy memory

**Metadata → Evidence ID → LLM claim → Citation mapping → Citation validation → User**

**Key interview line:**

> **“The LLM selects the supporting evidence; the application owns the actual citation.”**
