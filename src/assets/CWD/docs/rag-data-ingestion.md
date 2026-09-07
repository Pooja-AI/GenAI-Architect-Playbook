# Enterprise Knowledge Ingestion into the CWD RAG Pipeline

The key idea is:

> **Enterprise RAG ingestion is the controlled process of extracting knowledge from governed enterprise systems, preserving its business meaning and security metadata, transforming it into searchable chunks and vectors, and publishing it into a governed knowledge index.**

It is much more than simply uploading PDFs into a vector database.

## 1. The Big Picture

Enterprise knowledge can exist across many different systems:

```text
                         ENTERPRISE SOURCES
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
     SharePoint          Enterprise Apps        Databases
          │                    │                    │
          ▼                    ▼                    ▼
    Documents/Files       APIs/Records          Tables/Views
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ▼
                       INGESTION LAYER
                               │
                               ▼
                    CONNECT + EXTRACT
                               │
                               ▼
                    PARSE / NORMALIZE
                               │
                               ▼
                         CHUNKING
                               │
                               ▼
                  METADATA + SECURITY ACL
                               │
                               ▼
                         EMBEDDINGS
                               │
                               ▼
                          INDEXING
                               │
                               ▼
                    GOVERNED RAG INDEX
```

The ingestion pipeline therefore converts:

```text
Raw Enterprise Information
            ↓
Structured + Governed Knowledge
            ↓
Searchable RAG Knowledge
```

---

# 2. Why Enterprise Ingestion Is Different

A simple RAG tutorial might do:

```text
PDF
 ↓
Text
 ↓
Chunks
 ↓
Embeddings
 ↓
Vector DB
```

Enterprise RAG needs considerably more:

```text
Enterprise Source
      ↓
Authentication
      ↓
Authorization
      ↓
Extraction
      ↓
Parsing
      ↓
Normalization
      ↓
Classification
      ↓
Metadata
      ↓
ACL / Entitlements
      ↓
Chunking
      ↓
Embeddings
      ↓
Indexing
      ↓
Validation
      ↓
Monitoring
      ↓
Governed Knowledge Index
```

The enterprise ingestion system must answer:

* Where did the information come from?
* Who owns it?
* Is it current?
* What version is it?
* Who can access it?
* What domain does it belong to?
* Is it confidential?
* Has it changed?
* Has it been deleted?
* Should it be searchable?
* Which users/groups can retrieve it?

---

# 3. Source Types

CWD may ingest knowledge from several categories.

## 3.1 Document repositories

Examples:

```text
SharePoint
OneDrive
Confluence
Document Management Systems
Internal File Shares
Object Storage
Knowledge Portals
```

These typically contain:

```text
PDF
DOCX
PPTX
XLSX
HTML
TXT
Images
Scanned Documents
```

---

## 3.2 Enterprise applications

Examples:

```text
CRM
ERP
Service Management
HR Applications
Supply Chain Systems
Manufacturing Systems
Customer Support
Engineering Applications
```

The information may be accessed through:

```text
REST API
Graph API
SDK
Event Stream
Database
MCP Server
```

---

## 3.3 Databases

Examples:

```text
PostgreSQL
SQL Server
Oracle
MySQL
Data Warehouse
Data Lake
Operational Databases
```

However, the system should generally **not ingest unrestricted database contents blindly**.

Instead, use:

```text
Approved Tables
      +
Approved Views
      +
Approved Queries
      +
Business Rules
      +
Security Filters
```

---

# 4. Source Registration

Before ingestion begins, the source should be registered.

For example:

```json id="a91kx3"
{
  "source_id": "sharepoint-logistics",
  "source_type": "sharepoint",
  "owner": "Logistics Operations",
  "domain": "logistics",
  "classification": "internal",
  "ingestion_mode": "incremental",
  "schedule": "hourly",
  "enabled": true
}
```

This creates governance around the source.

The ingestion platform should know:

```text
WHAT source is this?
WHO owns it?
WHAT domain does it belong to?
WHAT data classification applies?
HOW should it be accessed?
HOW frequently should it be synchronized?
```

---

# 5. Source Authentication

The ingestion service must authenticate to the source.

For example:

```text
                Ingestion Service
                       │
                       ▼
                 Identity Provider
                       │
                       ▼
                Access Token / Identity
                       │
                       ▼
                Enterprise Source
```

In an Azure-oriented architecture this could involve:

```text
Microsoft Entra ID
Managed Identity
OAuth2
Service Principal
Workload Identity
```

Secrets should not be embedded in:

```text
Code
Prompts
Configuration files
Documents
Vector metadata
```

Secrets should be managed through an enterprise secrets mechanism such as Azure Key Vault where appropriate.

---

# 6. Authorization During Ingestion

Authentication answers:

```text
"Who is the ingestion service?"
```

Authorization answers:

```text
"What is it allowed to read?"
```

For example:

```text
Ingestion Identity
      ↓
SharePoint
      ↓
Allowed Sites
      ↓
Allowed Libraries
      ↓
Allowed Documents
```

The ingestion service should only access approved data.

---

# 7. SharePoint Ingestion Example

Suppose a company has:

```text
SharePoint
 └── Logistics
      ├── Policies
      ├── Carrier Documents
      ├── Shipment Procedures
      └── Engineering Documents
```

The ingestion pipeline may look like:

```text
SharePoint
    │
    ▼
Connector
    │
    ▼
Discover Files
    │
    ▼
Check Created / Modified / Deleted
    │
    ▼
Download Changed Content
    │
    ▼
Parse
    │
    ▼
Extract Metadata + ACL
    │
    ▼
Chunk
    │
    ▼
Embed
    │
    ▼
Index
```

The important part is that SharePoint permissions should not simply disappear during ingestion.

---

# 8. Preserve Source ACL Information

Suppose:

```text
Document A
Access:
Logistics-Team

Document B
Access:
Executives

Document C
Access:
Engineering-Team
```

The ingestion pipeline should preserve this information.

For example:

```json id="r5f9mc"
{
  "document_id": "DOC-1001",
  "source": "sharepoint",
  "title": "Shipment Policy",
  "access_groups": [
    "logistics-team"
  ],
  "classification": "internal"
}
```

Then the retrieval layer can apply the appropriate access filtering.

This leads to an important principle:

> **Security metadata must travel with the knowledge.**

---

# 9. Enterprise Application Ingestion

Consider an enterprise CRM.

The system might expose:

```text
CRM API
   ↓
Customer records
   ↓
Orders
   ↓
Support cases
   ↓
Account information
```

The ingestion architecture becomes:

```text
Enterprise Application
        │
        ▼
    API Connector
        │
        ▼
 Authentication
        │
        ▼
 Authorization
        │
        ▼
   Data Extraction
        │
        ▼
 Normalization
        │
        ▼
 Metadata + ACL
        │
        ▼
 Chunk / Transform
        │
        ▼
 Embedding
        │
        ▼
 Search Index
```

However, not every application record necessarily belongs in RAG.

---

# 10. RAG vs Live Enterprise Data

This is an important architecture decision.

Suppose the user asks:

```text
"What is our return policy?"
```

A policy document is a good RAG candidate.

But:

```text
"What is the current balance of account 12345?"
```

may require a live transactional API.

Therefore:

```text
Static / Slowly Changing Knowledge
             ↓
            RAG
```

while:

```text
Real-Time Transactional Data
             ↓
       API / Tool / MCP
```

CWD can combine both when required:

```text
                  User
                   │
                   ▼
               Coordinator
                   │
          ┌────────┴─────────┐
          ▼                  ▼
         RAG              MCP Tool
          │                  │
     Policy/Docs         Live System
          │                  │
          └────────┬─────────┘
                   ▼
                  LLM
```

---

# 11. Database Ingestion

For databases, the ingestion system should use governed extraction.

Example:

```text
SQL Database
     │
     ▼
Approved View
     │
     ▼
Extraction Query
     │
     ▼
Normalization
     │
     ▼
Knowledge Representation
     │
     ▼
Chunking
     │
     ▼
Embedding
     │
     ▼
Index
```

Instead of:

```text
LLM → unrestricted SQL → database
```

the enterprise ingestion pipeline should define explicitly:

```text
Allowed Source
Allowed Tables
Allowed Columns
Allowed Views
Allowed Queries
Allowed Data Classification
```

---

# 12. Structured Data Requires Different Processing

Documents are primarily unstructured.

Databases are structured.

For example:

```text
Customer Table

customer_id | name | region | status
--------------------------------------
C001        | ABC  | US     | Active
C002        | XYZ  | EU     | Active
```

You shouldn't blindly concatenate database rows.

Instead, transform them into a meaningful representation:

```text
Customer C001
Name: ABC
Region: US
Status: Active
```

or create structured retrieval capabilities.

For highly dynamic structured information, a tool/API approach may be better than embedding the data.

---

# 13. Stage-by-Stage Ingestion Pipeline

Let's break down the complete ingestion process.

```text
1. Source Registration
        ↓
2. Authentication
        ↓
3. Authorization
        ↓
4. Source Discovery
        ↓
5. Change Detection
        ↓
6. Content Extraction
        ↓
7. Parsing
        ↓
8. Cleaning
        ↓
9. Normalization
        ↓
10. Classification
        ↓
11. Metadata Extraction
        ↓
12. ACL Extraction
        ↓
13. Chunking
        ↓
14. Embedding
        ↓
15. Indexing
        ↓
16. Validation
        ↓
17. Publish
        ↓
18. Monitoring
```

---

# 14. Change Detection

Enterprise sources continuously change.

Suppose:

```text
Policy v1
```

becomes:

```text
Policy v2
```

The ingestion system should detect:

```text
Created
Modified
Deleted
Moved
Renamed
Version Changed
Permission Changed
```

Instead of reprocessing everything:

```text
Entire Repository
       ↓
Reprocess Everything
```

prefer:

```text
Change Detection
       ↓
Changed Documents Only
       ↓
Reprocess
```

This is called **incremental ingestion**.

---

# 15. Document Versioning

Suppose:

```text
Shipment Policy
v1
v2
v3
```

The knowledge system should know which version is current.

Metadata could contain:

```json id="v3p5qa"
{
  "document_id": "POL-1001",
  "version": "3.0",
  "is_current": true,
  "effective_date": "2026-08-01"
}
```

This prevents retrieval from accidentally using an obsolete policy.

---

# 16. Parsing

Different formats require different parsers.

```text
PDF
 ↓
PDF Parser

DOCX
 ↓
DOCX Parser

HTML
 ↓
HTML Parser

Image / Scan
 ↓
OCR

XLSX
 ↓
Spreadsheet Parser
```

The output should be normalized into a common internal representation.

For example:

```json id="j6q2ma"
{
  "document_id": "DOC-1001",
  "title": "Shipment Policy",
  "sections": [
    {
      "heading": "Delay Handling",
      "content": "A shipment delay must be reported..."
    }
  ]
}
```

---

# 17. Preserve Document Structure

A good ingestion pipeline should preserve relationships such as:

```text
Document
 ├── Title
 ├── Section
 │    ├── Subsection
 │    └── Paragraph
 ├── Table
 └── References
```

Why?

Because:

```text
"Maximum temperature"
```

has more meaning when associated with:

```text
Product X
Operating Conditions
Maximum Temperature
125°C
```

Structure improves retrieval quality.

---

# 18. Metadata Extraction

Every document and chunk should carry useful metadata.

Typical metadata:

```text
document_id
source_id
source_type
title
author
owner
department
business_unit
domain
region
classification
version
effective_date
expiration_date
created_at
updated_at
language
document_type
```

Security metadata may include:

```text
access_groups
allowed_roles
security_labels
data_owner
retention_class
```

---

# 19. Classification

Enterprise data should be classified.

For example:

```text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
```

The ingestion pipeline can attach:

```json id="y9c2nd"
{
  "classification": "confidential",
  "domain": "finance",
  "security_label": "finance-restricted"
}
```

This classification can influence:

```text
Who can retrieve it
Which agents can use it
Whether it can enter LLM context
Logging rules
Retention rules
Approval requirements
```

---

# 20. Chunking

After processing:

```text
Normalized Document
       ↓
Chunking
       ↓
Chunk 1
Chunk 2
Chunk 3
...
```

For enterprise documents, semantic or section-aware chunking is often preferable to blindly splitting every N characters.

Each chunk should preserve its lineage:

```text
Document
   ↓
Section
   ↓
Chunk
```

For example:

```json id="m2v7qa"
{
  "chunk_id": "CH-1004",
  "document_id": "DOC-1001",
  "section": "Delay Handling",
  "text": "A shipment delay must be reported..."
}
```

---

# 21. Embedding

The chunk is converted into an embedding:

```text
Chunk
  ↓
Embedding Model
  ↓
Vector
```

Conceptually:

```text
"Carrier capacity caused shipment delay"
                  ↓
          [0.21, -0.13, ...]
```

The vector enables semantic retrieval.

---

# 22. Indexing

The final searchable record combines:

```text
Text
+
Vector
+
Metadata
+
Security Information
+
Source Information
```

For example:

```json id="p8s4de"
{
  "chunk_id": "CH-1004",
  "document_id": "DOC-1001",
  "text": "Carrier capacity caused shipment delay.",
  "embedding": [0.21, -0.13, 0.72],
  "domain": "logistics",
  "classification": "internal",
  "access_groups": [
    "logistics-team"
  ],
  "version": "3.0",
  "source": "sharepoint"
}
```

---

# 23. Knowledge Index

The result is a governed enterprise knowledge index.

```text
                 RAG KNOWLEDGE INDEX
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
     Content          Vectors          Metadata
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                    Search Layer
```

Possible implementations include:

```text
Azure AI Search
PostgreSQL + pgvector
Qdrant
Pinecone
Weaviate
FAISS
```

In an Azure-centric CWD architecture, Azure AI Search is a natural candidate because it can support enterprise search patterns combining text, vector, and metadata filtering.

---

# 24. Validation Before Publishing

The ingestion pipeline should not automatically publish every processed document.

Validation can include:

```text
Document parsed successfully?
       ↓
Chunks valid?
       ↓
Metadata complete?
       ↓
Classification present?
       ↓
ACL present?
       ↓
Embedding generated?
       ↓
No duplicate?
       ↓
Version valid?
       ↓
Source available?
       ↓
Security policy satisfied?
```

Only then:

```text
Publish to Knowledge Index
```

---

# 25. Ingestion Quality Checks

Useful checks include:

### Content quality

```text
Empty document?
OCR quality?
Encoding errors?
Duplicate content?
Malformed text?
```

### Chunk quality

```text
Chunk too small?
Chunk too large?
Broken sentence?
Missing section?
```

### Metadata quality

```text
Missing owner?
Missing domain?
Missing classification?
Missing version?
```

### Security quality

```text
Missing ACL?
Invalid access group?
Unknown classification?
Restricted content incorrectly indexed?
```

---

# 26. Incremental Synchronization

A production ingestion service should maintain synchronization state.

For example:

```json id="c4z8pa"
{
  "source_id": "sharepoint-logistics",
  "last_sync": "2026-09-06T10:00:00Z",
  "last_cursor": "abc123",
  "documents_processed": 12540,
  "documents_failed": 12
}
```

Then:

```text
Next Run
   ↓
Read last sync state
   ↓
Get changes
   ↓
Process changed items
   ↓
Update index
```

This dramatically reduces unnecessary processing.

---

# 27. Deletion Handling

Deletion is often overlooked.

Suppose:

```text
SharePoint:
DOC-1001 deleted
```

If the ingestion pipeline only adds new documents, the old chunk could remain in the RAG index.

Then:

```text
Source:
Document deleted

RAG:
Document still searchable
```

This creates stale-data and potentially security problems.

Therefore:

```text
Source Deletion
      ↓
Deletion Event
      ↓
Find document_id
      ↓
Delete associated chunks
      ↓
Update index
```

---

# 28. Permission Changes

Permission changes are equally important.

Suppose:

```text
Yesterday:
Employee A → authorized

Today:
Employee A → no longer authorized
```

The index must reflect the new security state.

Therefore ingestion should synchronize:

```text
Content
+
Metadata
+
Permissions
```

not just content.

---

# 29. End-to-End SharePoint Example

Consider:

```text
SharePoint
 └── Logistics
      └── Shipment Policy.docx
```

### Step 1 — Discover

```text
Connector
 ↓
Find Shipment Policy.docx
```

### Step 2 — Authenticate

```text
Managed Identity / OAuth
 ↓
SharePoint
```

### Step 3 — Authorize

```text
Allowed site/library?
Allowed document?
```

### Step 4 — Download

```text
DOCX
 ↓
Raw Content
```

### Step 5 — Parse

```text
DOCX
 ↓
Title + Sections + Tables
```

### Step 6 — Normalize

```text
Clean text
Preserve structure
```

### Step 7 — Extract metadata

```text
domain = logistics
classification = internal
owner = Logistics
version = 5
```

### Step 8 — Extract ACL

```text
access_groups = [
    "logistics-team"
]
```

### Step 9 — Chunk

```text
Document
 ↓
Chunk 1
Chunk 2
Chunk 3
```

### Step 10 — Embed

```text
Chunk
 ↓
Embedding
```

### Step 11 — Index

```text
Chunk
+
Vector
+
Metadata
+
ACL
```

### Step 12 — Validate

```text
Quality
Security
Metadata
Version
```

### Step 13 — Publish

```text
Governed Knowledge Index
```

---

# 30. Enterprise Application Example

Suppose CWD needs knowledge from an internal service-management application.

```text
Service Management System
          │
          ▼
       REST API
          │
          ▼
    Ingestion Connector
          │
          ▼
       Normalize
          │
          ▼
   Security Metadata
          │
          ▼
       Chunk / Transform
          │
          ▼
       Embeddings
          │
          ▼
      Search Index
```

For example:

```text
Incident INC-1001

Title:
Database connection failures

Resolution:
Restart connection pool and verify...
```

This can become a searchable knowledge item.

---

# 31. Database Example

Suppose an engineering database contains product specifications.

```text
Engineering DB
      │
      ▼
Approved View
      │
      ▼
Product Specification Records
      │
      ▼
Structured Transformation
      │
      ▼
Metadata + ACL
      │
      ▼
Embedding / Index
```

But if the question requires real-time information:

```text
"What is the current production quantity?"
```

CWD may instead route:

```text
Worker
 ↓
MCP
 ↓
Production API
 ↓
Live database
```

This distinction prevents stale RAG data from being treated as real-time truth.

---

# 32. Event-Driven Ingestion

Enterprise ingestion does not always need to be batch-based.

A document update can generate an event:

```text
Document Updated
       ↓
Event
       ↓
Service Bus / Event Grid
       ↓
Ingestion Worker
       ↓
Process
       ↓
Re-index
```

Architecture:

```text
SharePoint / Enterprise System
             │
             ▼
          Change Event
             │
             ▼
       Message Broker
             │
             ▼
       Ingestion Worker
             │
             ▼
       Processing Pipeline
             │
             ▼
        Search Index
```

This enables near-real-time knowledge synchronization.

---

# 33. Batch vs Event-Driven

| Approach          | Best for                       |
| ----------------- | ------------------------------ |
| Batch             | Large periodic synchronization |
| Incremental batch | Changed documents              |
| Event-driven      | Near-real-time updates         |
| Scheduled polling | Sources without events         |
| Hybrid            | Large enterprise environments  |

A mature CWD platform may use all of them depending on source capabilities.

---

# 34. Where MCP Fits

MCP can be used as a standardized integration layer for some enterprise capabilities.

For example:

```text
Ingestion Worker
      ↓
MCP Client
      ↓
Enterprise Knowledge MCP Server
      ↓
SharePoint / API / Search System
```

But MCP is not required for every ingestion connector.

You can have:

```text
Native Connector
      ↓
Enterprise Source
```

or:

```text
MCP Client
      ↓
MCP Server
      ↓
Enterprise Source
```

The important architectural rule is:

> **MCP standardizes capability interaction; the ingestion architecture still owns governance, synchronization, validation, and indexing.**

---

# 35. CWD Integration

The complete CWD architecture can be viewed as:

```text
                         USER
                           │
                           ▼
                    ┌──────────────┐
                    │ Coordinator  │
                    └──────┬───────┘
                           │
                           ▼
                     ┌───────────┐
                     │ Delegator │
                     └─────┬─────┘
                           │
                           ▼
                     ┌───────────┐
                     │RAG Worker │
                     └─────┬─────┘
                           │
                           ▼
                    Knowledge Search
                           │
                           ▼
                Authorized Context
                           │
                           ▼
                          LLM
```

The ingestion side operates independently:

```text
SharePoint ───────┐
Enterprise Apps ──┤
Databases ────────┤
APIs ─────────────┤
Knowledge Bases ──┘
          │
          ▼
   Ingestion Platform
          │
          ▼
   Processing Pipeline
          │
          ▼
  Governed Knowledge Index
          │
          └──────────────► RAG Worker
```

---

# 36. The Most Important Separation

There are two fundamentally different flows:

```text
              KNOWLEDGE PLANE
              ===============

Enterprise Sources
       ↓
Ingestion
       ↓
Processing
       ↓
Indexing
       ↓
Knowledge Store
```

and:

```text
              EXECUTION PLANE
              ===============

User
 ↓
Coordinator
 ↓
Delegator
 ↓
RAG Worker
 ↓
Retrieve
 ↓
LLM
 ↓
Response
```

This separation allows the knowledge platform to continuously maintain enterprise knowledge while CWD executes user workflows against it.

---

# 37. Governance Across the Entire Pipeline

Governance should exist at every stage.

```text
Source
 ↓
Authentication
 ↓
Authorization
 ↓
Classification
 ↓
Processing
 ↓
Metadata
 ↓
ACL
 ↓
Chunking
 ↓
Embedding
 ↓
Index
 ↓
Retrieval
 ↓
Context
 ↓
LLM
 ↓
Response
```

Security should not be added only at the final retrieval step.

---

# 38. What Should Be Stored in the Index?

A useful conceptual record is:

```json id="u3w8fk"
{
  "chunk_id": "CH-10045",
  "document_id": "DOC-5001",
  "source_id": "sharepoint-logistics",
  "source_type": "sharepoint",

  "text": "A shipment delay must be reported...",

  "embedding": [0.12, -0.43, 0.87],

  "metadata": {
    "title": "Shipment Policy",
    "domain": "logistics",
    "department": "operations",
    "region": "US",
    "version": "5.0",
    "classification": "internal",
    "effective_date": "2026-08-01"
  },

  "security": {
    "access_groups": [
      "logistics-team"
    ]
  }
}
```

This record provides:

```text
Content
+
Semantic Representation
+
Business Metadata
+
Security Metadata
+
Source Lineage
```

---

# 39. Observability

The ingestion pipeline should generate telemetry.

For example:

```text
source_id
document_id
document_version
ingestion_run_id
correlation_id
processing_status
chunk_count
embedding_status
index_status
classification
failure_reason
processing_duration
```

Example:

```json id="g8p2nm"
{
  "ingestion_run_id": "ING-20260906-001",
  "source_id": "sharepoint-logistics",
  "document_id": "DOC-5001",
  "status": "indexed",
  "chunks": 18,
  "duration_ms": 4200
}
```

This enables operational troubleshooting.

---

# 40. Failure Handling

Suppose parsing fails.

```text
Document
 ↓
Parser
 ↓
FAIL
```

The system should:

```text
Record failure
     ↓
Retry if transient
     ↓
Move to quarantine/DLQ if required
     ↓
Alert owner
```

It should not silently publish incomplete content.

Similarly:

```text
Embedding Failure
Index Failure
ACL Extraction Failure
OCR Failure
Authentication Failure
```

should have controlled failure paths.

---

# 41. Ingestion Idempotency

If the same document is processed twice:

```text
DOC-1001
   ↓
Process
   ↓
Process Again
```

we should avoid creating:

```text
CH-1
CH-2
CH-3

CH-101
CH-102
CH-103
```

for the same document version.

Use stable identifiers such as:

```text
source_id
document_id
document_version
chunk_id
content_hash
```

This supports idempotent processing.

---

# 42. Enterprise RAG Ingestion Formula

A useful architect-level formula is:

```text
Enterprise Knowledge Ingestion
=
Source Registration
+
Authentication
+
Authorization
+
Change Detection
+
Content Extraction
+
Parsing
+
Normalization
+
Classification
+
Metadata
+
ACL Preservation
+
Chunking
+
Embedding
+
Indexing
+
Validation
+
Versioning
+
Monitoring
```

---

# 43. Critical Design Principles

### Principle 1

> **Do not ingest enterprise data without knowing its ownership and access policy.**

### Principle 2

> **Security metadata must be preserved from source to retrieval.**

### Principle 3

> **Incremental ingestion is preferred over full reprocessing.**

### Principle 4

> **Document deletion and permission changes must propagate to the index.**

### Principle 5

> **Current transactional data should generally be retrieved through governed tools/APIs rather than stale embeddings.**

### Principle 6

> **Every chunk must retain source lineage.**

### Principle 7

> **Classification should travel with the data.**

### Principle 8

> **Ingestion failures must be observable and recoverable.**

### Principle 9

> **The index is not the system of record; it is a retrieval representation of governed enterprise knowledge.**

### Principle 10

> **RAG retrieval must never bypass enterprise authorization.**

---

# 44. Final End-to-End Mental Model

```text
                    ENTERPRISE KNOWLEDGE
                            │
       ┌────────────────────┼─────────────────────┐
       ▼                    ▼                     ▼
   SharePoint          Enterprise Apps        Databases
       │                    │                     │
       └────────────────────┼─────────────────────┘
                            ▼
                     SOURCE CONNECTORS
                            │
                            ▼
                   AUTH + AUTHORIZATION
                            │
                            ▼
                    CHANGE DETECTION
                            │
                            ▼
                  EXTRACTION / PARSING
                            │
                            ▼
                  CLEAN + NORMALIZE
                            │
                            ▼
               CLASSIFICATION + METADATA
                            │
                            ▼
                     ACL PRESERVATION
                            │
                            ▼
                       CHUNKING
                            │
                            ▼
                      EMBEDDINGS
                            │
                            ▼
                       INDEXING
                            │
                            ▼
                GOVERNED KNOWLEDGE INDEX
                            │
═══════════════════════════╪════════════════════════
                            │
                         RUNTIME
                            │
                      USER QUESTION
                            │
                            ▼
                         CWD
                            │
                            ▼
                       RAG WORKER
                            │
                            ▼
                    RETRIEVE + FILTER
                            │
                            ▼
                       RE-RANK
                            │
                            ▼
                  CONTEXT CONSTRUCTION
                            │
                            ▼
                           LLM
                            │
                            ▼
                  GROUNDED RESPONSE
```

# 45. Final Definition

> **Enterprise RAG ingestion is the governed pipeline through which knowledge from systems such as SharePoint, enterprise applications, databases, APIs, and other approved sources is securely authenticated and extracted, processed and normalized, enriched with business and security metadata, classified and associated with access controls, divided into meaningful chunks, converted into embeddings, and indexed with source lineage so that CWD can later retrieve current, relevant, and authorized enterprise evidence for grounded LLM generation.**

### Interview-ready answer

> **“In CWD, enterprise knowledge ingestion starts by registering and securely connecting to governed sources such as SharePoint, enterprise applications, databases, and APIs. The ingestion layer authenticates to each source, extracts only authorized data, detects changes, parses and normalizes the content, preserves document structure and ACL metadata, classifies the information, and chunks it into meaningful units. Each chunk is then embedded and indexed together with its metadata, source lineage, version, and access controls. The resulting governed knowledge index becomes the retrieval layer used by RAG Workers at runtime. Importantly, ingestion is incremental and must also propagate document deletions, version changes, and permission changes so the RAG index remains current and secure.”**

```text
SOURCE
  ↓
AUTHENTICATE
  ↓
AUTHORIZE
  ↓
EXTRACT
  ↓
PROCESS
  ↓
CLASSIFY
  ↓
METADATA + ACL
  ↓
CHUNK
  ↓
EMBED
  ↓
INDEX
  ↓
VALIDATE
  ↓
GOVERNED KNOWLEDGE
```

**Mental model:**

> **Enterprise sources provide the knowledge, ingestion provides controlled synchronization, metadata provides meaning and governance, ACLs provide security boundaries, embeddings provide semantic retrieval, and the knowledge index provides the searchable representation consumed by CWD RAG Workers.**
