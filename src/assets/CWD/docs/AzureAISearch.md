# Azure AI Search for Enterprise RAG

Microsoft **Azure AI Search** is the retrieval layer I would use in your CWD architecture to find **relevant, authorized enterprise information** before the LLM generates an answer.

The core mental model is:

> **Azure AI Search finds the right information. The LLM reasons over that information.**

For your interview, master these seven concepts:

1. **Chunking**
2. **Indexing**
3. **Vector search**
4. **Keyword/full-text search**
5. **Hybrid search**
6. **Semantic ranking**
7. **Metadata + ACL filtering**

---

# 1. Where Azure AI Search fits in CWD

Your architecture can look like:

```text
User
 ↓
Coordinator
 ↓
Quality / Engineering / Manufacturing Delegator
 ↓
Worker / Agent
 ↓
Azure AI Search
 ↓
Relevant enterprise documents
 ↓
LLM
 ↓
Grounded answer
```

For example:

> "What caused similar wafer defects in the past?"

```text
Quality Worker
      ↓
Azure AI Search
      ↓
Historical FA reports
      ↓
Relevant chunks
      ↓
LLM
      ↓
Root-cause analysis
```

---

# 2. Why do we need RAG?

An LLM doesn't automatically know your private enterprise data.

For example, your company may have:

* Failure Analysis reports
* Manufacturing SOPs
* Equipment manuals
* Quality reports
* Engineering documents
* Product specifications
* Historical RCA
* CAPA reports
* ServiceNow knowledge
* SharePoint documents

The LLM should not simply invent an answer.

Instead:

```text
User Question
     ↓
Retrieve enterprise knowledge
     ↓
Provide relevant context to LLM
     ↓
Generate answer
```

That's **Retrieval-Augmented Generation (RAG)**.

---

# 3. End-to-End RAG Flow

The simplest architecture:

```text
                 INGESTION
                     │
Documents ──→ Chunking ──→ Embeddings
                     │
                     ↓
               Azure AI Search
                     │
                     │
                 RETRIEVAL
                     │
User Question
      ↓
Query Processing
      ↓
Keyword + Vector Search
      ↓
Semantic Ranking
      ↓
Metadata / ACL Filtering
      ↓
Top-K Relevant Chunks
      ↓
LLM
      ↓
Answer
```

---

# 4. Step 1 — Document Ingestion

Suppose you have:

```text
failure_analysis_report.pdf
equipment_manual.pdf
quality_report.docx
process_sop.pdf
```

These documents enter your RAG pipeline.

Possible sources:

```text
SharePoint
Blob Storage
OneDrive
File systems
Enterprise databases
APIs
```

For example:

```text
SharePoint
    ↓
Document ingestion pipeline
    ↓
Azure AI Search
```

---

# 5. Step 2 — Chunking

You normally don't put a 100-page PDF into the LLM as one giant piece.

You divide it into smaller pieces called **chunks**.

Example:

```text
100-page document
       ↓
     Chunking
       ↓
 ┌─────┼─────┬─────┐
 ↓     ↓     ↓     ↓
C1    C2    C3    C4 ...
```

Example chunk:

```text
Document:
FA_Report_123.pdf

Chunk:
"Temperature excursions above 85°C were observed
during process step 4..."
```

Each chunk becomes independently searchable.

---

# 6. Why Chunking Matters

If chunks are too large:

```text
Large chunk
 ↓
Lots of irrelevant information
 ↓
More tokens
 ↓
Higher cost
 ↓
Lower retrieval precision
```

If chunks are too small:

```text
Tiny chunk
 ↓
Context lost
 ↓
Poor answer quality
```

So chunking is a **retrieval-quality optimization problem**.

---

# 7. Chunking Strategies

Common approaches:

### Fixed-size chunking

```text
Every 500 tokens
```

Simple but may break sentences or concepts.

### Sentence-based

Split around sentences.

### Paragraph-based

Keep paragraphs together.

### Semantic chunking

Split based on meaning/topic boundaries.

### Structure-aware chunking

Use document structure:

```text
Document
 ├── Section
 │    ├── Subsection
 │    └── Paragraph
```

For enterprise documents, **structure-aware/semantic chunking** is often preferable when document structure is meaningful.

---

# 8. Chunk Metadata

Don't store only the text.

Store metadata with each chunk.

Example:

```json
{
  "chunk_id": "CH123",
  "document_id": "FA456",
  "title": "Failure Analysis Report",
  "content": "Temperature excursions...",
  "department": "Quality",
  "product": "SiC MOSFET",
  "fab": "Fab-X",
  "document_type": "Failure Analysis",
  "created_date": "2026-08-10",
  "access_group": "QUALITY_ENGINEERING"
}
```

This metadata becomes extremely valuable during retrieval.

---

# 9. Step 3 — Embeddings

The text is converted into a numerical representation called an **embedding**.

Conceptually:

```text
"equipment overheating"
        ↓
Embedding Model
        ↓
[0.12, -0.31, 0.77, ...]
```

Similar meanings produce vectors that are close in vector space.

For example:

```text
"equipment overheating"
```

can be semantically similar to:

```text
"high temperature condition"
```

even though the words aren't identical.

---

# 10. Vector Search

Vector search compares the query embedding with document/chunk embeddings.

```text
User Query
    ↓
Embedding
    ↓
Vector Search
    ↓
Similar chunks
```

Example:

User:

> "Why did the machine overheat?"

Search may find:

> "Repeated high-temperature excursions were detected..."

Even though the exact word **overheat** doesn't appear.

That's the power of semantic/vector retrieval.

---

# 11. Keyword Search

Traditional text search looks for terms.

Query:

```text
"EQ-102 temperature alarm"
```

It can find documents containing:

```text
EQ-102
temperature
alarm
```

Keyword search is especially useful for:

* equipment IDs
* part numbers
* lot IDs
* ticket IDs
* error codes
* exact product names
* technical terminology

For enterprise RAG, you usually don't want to rely on vector search alone.

---

# 12. Hybrid Search

This is one of the most important concepts for your interview.

**Hybrid search combines keyword search + vector search.**

```text
                User Query
                    ↓
           ┌────────┴────────┐
           ↓                 ↓
      Keyword Search     Vector Search
           ↓                 ↓
           └────────┬────────┘
                    ↓
              Combined Results
                    ↓
              Ranking / Reranking
                    ↓
                Top Results
```

### Why hybrid?

Keyword search is excellent for:

> "EQ-102"

Vector search is excellent for:

> "Why did the equipment overheat?"

Combining them gives you stronger retrieval.

---

# 13. Example of Hybrid Search

User:

> **"Find previous EQ-102 failures caused by overheating."**

### Keyword search finds:

```text
EQ-102
```

### Vector search finds:

```text
temperature excursion
thermal issue
cooling failure
over-temperature
```

### Hybrid search combines them:

```text
EQ-102 + thermal-related historical reports
```

This is much better than relying on either approach alone.

---

# 14. Semantic Ranking

After retrieving candidate documents, you can use **semantic ranking** to improve the ordering of results.

Conceptually:

```text
Query
 ↓
Initial Retrieval
 ↓
50 candidate chunks
 ↓
Semantic Ranker
 ↓
Top 5 relevant chunks
```

The important distinction:

> **Search retrieves candidates.**

> **Semantic ranking improves the order/relevance of those candidates.**

---

# 15. Complete Retrieval Pipeline

A strong enterprise RAG pipeline:

```text
User Query
    ↓
Query Understanding
    ↓
Security / User Context
    ↓
Keyword Search ─────┐
                    ├──→ Hybrid Retrieval
Vector Search ──────┘
                    ↓
Metadata Filtering
                    ↓
Semantic Ranking
                    ↓
Top-K Chunks
                    ↓
Context Assembly
                    ↓
LLM
                    ↓
Grounded Answer
```

---

# 16. Metadata Filtering

Suppose the search index contains documents from:

```text
Quality
Manufacturing
HR
Finance
Engineering
```

A Quality Engineer shouldn't necessarily retrieve everything.

You can filter:

```text
department == "Quality"
```

Or:

```text
product == "SiC"
```

Or:

```text
fab == "Fab-X"
```

Or:

```text
document_type == "Failure Analysis"
```

So:

```text
Query
 ↓
Search
 ↓
Metadata Filter
 ↓
Relevant results
```

---

# 17. ACL-Based Retrieval

This is **extremely important for enterprise AI**.

Suppose two employees ask:

> "Show me the failure-analysis reports."

They may have different permissions.

You cannot simply retrieve all documents and ask the LLM to hide unauthorized information.

Instead:

```text
User
 ↓
Identity
 ↓
Entitlements / Groups
 ↓
Azure AI Search ACL filter
 ↓
Authorized documents only
 ↓
LLM
```

### Key principle

> **Authorization must happen before the LLM sees the data.**

---

# 18. Example ACL

Suppose a document contains:

```text
access_groups:
[
  "QUALITY_ENGINEERING",
  "FAILURE_ANALYSIS"
]
```

User belongs to:

```text
QUALITY_ENGINEERING
```

The document can be returned.

Another user belongs only to:

```text
SALES
```

The document should not be retrieved.

The LLM never receives the unauthorized document.

---

# 19. Why ACL Filtering is Better Than Prompt Filtering

Bad design:

```text
Search everything
 ↓
LLM
 ↓
"Don't show confidential documents"
```

The model has already seen the confidential information.

Better:

```text
User Identity
 ↓
Authorization
 ↓
Search only authorized data
 ↓
LLM
```

This is called an **entitlement-first** approach.

For your interviews, say:

> **"Security filtering happens at retrieval time, not only at generation time."**

---

# 20. CWD ACL Flow

For your CWD architecture:

```text
User
 ↓
Entra ID
 ↓
User Groups / Entitlements
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Azure AI Search
 ↓
ACL + Metadata Filter
 ↓
Authorized Chunks
 ↓
LLM
```

Example:

```text
User Group:
QUALITY_ENGINEERING

Search Filter:
access_group = QUALITY_ENGINEERING
```

---

# 21. Azure AI Search Index

The index is the searchable structure containing your enterprise content.

Conceptually:

```text
Index: enterprise-knowledge

Fields:
 ├── chunk_id
 ├── document_id
 ├── title
 ├── content
 ├── content_vector
 ├── department
 ├── product
 ├── fab
 ├── document_type
 ├── created_date
 └── access_groups
```

Different fields can support different types of retrieval.

For example:

```text
content
    → keyword search

content_vector
    → vector search

department
    → filtering

access_groups
    → ACL filtering
```

---

# 22. Indexing Pipeline

A typical enterprise ingestion architecture:

```text
Documents
   ↓
Blob / SharePoint
   ↓
Document Processing
   ↓
Extract Text
   ↓
Chunk
   ↓
Generate Embeddings
   ↓
Add Metadata + ACL
   ↓
Azure AI Search Index
```

Then:

```text
User Query
   ↓
Search Index
   ↓
Relevant Chunks
```

---

# 23. CWD Example — Historical Failure Analysis

User asks:

> **"Have we seen this type of defect before?"**

The Worker receives:

```text
Defect type = crack
Product = SiC MOSFET
Fab = Fab-X
```

The Worker queries Azure AI Search.

### Query

```text
"similar crack defects in SiC MOSFET"
```

Filters:

```text
product = "SiC MOSFET"
fab = "Fab-X"
access_group = user's authorized group
```

Then:

```text
Hybrid Search
      ↓
Semantic Ranking
      ↓
Top 5 historical reports
```

The LLM receives those reports as context.

It can answer:

```text
Similar defects were observed in 3 historical cases.

Common pattern:
Process temperature excursion during Step 4.

Most likely cause:
Thermal instability.

Evidence:
FA-1023, FA-1088, FA-1112.
```

That's **grounded RAG**.

---

# 24. RAG Grounding

The LLM should ideally answer based on retrieved evidence.

```text
Retrieved Context
       ↓
      LLM
       ↓
Answer + Citations
```

If the search returns nothing relevant:

```text
No reliable context
       ↓
Don't fabricate
       ↓
"I couldn't find sufficient evidence."
```

This is much safer than hallucinating.

---

# 25. Top-K Retrieval

Suppose search returns:

```text
100 candidate chunks
```

You might select:

```text
Top 5
```

or:

```text
Top 10
```

for the LLM.

But don't blindly assume:

> Higher K = better.

Too many chunks can introduce:

* irrelevant information
* conflicting information
* larger prompts
* higher token cost
* latency

So K should be evaluated empirically.

---

# 26. RAG Quality Metrics

For your Solution Architect interviews, mention:

### Retrieval metrics

* Recall
* Precision
* MRR
* NDCG
* Top-K hit rate

### Generation metrics

* Groundedness
* Answer relevance
* Answer correctness
* Faithfulness

### Application metrics

* Task success
* Tool success
* End-to-end latency
* Cost per task

For CWD:

```text
Search Quality
      +
LLM Quality
      +
Agent Workflow Quality
      =
Business Outcome
```

---

# 27. RAG Latency

A RAG request may involve:

```text
User Query
 ↓
Embedding
 ↓
Search
 ↓
Semantic Ranking
 ↓
Context Construction
 ↓
LLM
```

Each step adds latency.

You should monitor:

```text
Embedding latency
Search latency
Reranking latency
LLM TTFT
LLM generation latency
End-to-end latency
```

For your interviews, this demonstrates production awareness.

---

# 28. RAG Cost Optimization

You can optimize:

### Chunk size

Avoid unnecessary tokens.

### Top-K

Don't retrieve 50 chunks if 5 are enough.

### Metadata filtering

Reduce search space.

### Hybrid retrieval

Improve precision.

### Semantic ranking

Improve relevance without sending everything to the LLM.

### Caching

Reuse repeated queries/results where appropriate.

---

# 29. Azure AI Search + MCP

Your Worker can access search through a tool.

```text
Worker
 ↓
MCP Client
 ↓
RAG/Search MCP Tool
 ↓
Azure AI Search
 ↓
Authorized chunks
```

For example:

```text
search_failure_reports()
search_equipment_manual()
search_quality_sop()
```

This fits nicely with your CWD architecture.

---

# 30. Azure AI Search vs Vector Database

This is another common question.

A specialized vector database focuses heavily on vector storage/search.

Azure AI Search supports broader enterprise retrieval capabilities including:

* full-text search
* vector search
* hybrid search
* semantic ranking
* filtering
* enterprise indexing
* document-oriented search

For a Microsoft-centric enterprise RAG platform, Azure AI Search is often a strong choice because it combines traditional enterprise search with vector retrieval.

---

# 31. Most Important Architecture

Memorize this:

```text
                     ENTERPRISE DATA
                           ↓
              ┌────────────────────────┐
              │ SharePoint / Blob / DB  │
              └────────────┬───────────┘
                           ↓
                    Document Processing
                           ↓
                       Chunking
                           ↓
                      Embeddings
                           ↓
                 ┌──────────────────┐
                 │ Azure AI Search  │
                 │                  │
                 │ Text Index       │
                 │ Vector Index     │
                 │ Metadata         │
                 │ ACL Metadata     │
                 └────────┬─────────┘
                          │
                          │
User → Coordinator → Worker
                          ↓
                    Search Query
                          ↓
             ┌────────────┴────────────┐
             ↓                         ↓
       Keyword Search             Vector Search
             └────────────┬────────────┘
                          ↓
                    Hybrid Results
                          ↓
                  ACL + Metadata Filter
                          ↓
                   Semantic Ranking
                          ↓
                       Top-K
                          ↓
                        LLM
                          ↓
                 Grounded Response
```

---

# 32. Strong Interview Answer

> **"For enterprise RAG in CWD, I would use Azure AI Search as the governed retrieval layer. During ingestion, documents from sources such as SharePoint and Blob Storage are parsed, intelligently chunked, enriched with metadata and ACL information, and embedded into the search index. At query time, the Worker performs hybrid retrieval using keyword and vector search, applies metadata and entitlement-based filters, and uses semantic ranking to select the most relevant chunks. Only authorized context is passed to the LLM, which generates a grounded response based on that evidence. I would monitor retrieval metrics such as recall, precision and NDCG along with groundedness, answer relevance, latency, token usage and cost."**

## Final mental model

> **Chunking → break knowledge into useful pieces**

> **Indexing → organize those pieces for retrieval**

> **Vector search → find semantic similarity**

> **Keyword search → find exact terms**

> **Hybrid search → combine both**

> **Semantic ranking → improve result ordering**

> **Metadata filtering → narrow to the right business context**

> **ACL filtering → retrieve only authorized information**

> **LLM → reason over retrieved evidence**

### The most important sentence for your interview:

> **"The LLM should not be the security boundary. We enforce identity and ACL filtering at retrieval time so unauthorized enterprise data never enters the model context."**
