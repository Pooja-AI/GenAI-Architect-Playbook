Absolutely. In an enterprise RAG system such as CWD, **vectorization is the bridge between human language and mathematical similarity search**.

# Document and Query Vectorization for Semantic Similarity Search

## 1. Core Principle

Traditional keyword search asks:

> “Do these documents contain the same words as my query?”

Semantic search asks:

> “Do these documents mean something similar to my query?”

To achieve this, both **documents/chunks** and **user queries** are converted into numerical vectors called **embeddings**.

For example:

```text
Document:
"Employees can work remotely up to three days per week."

                    │
                    ▼
             Embedding Model
                    │
                    ▼
        [0.021, -0.184, 0.731, ..., 0.092]
                    │
                    ▼
              Vector Database
```

A query is processed through the **same embedding space**:

```text
Query:
"How many days can I work from home?"

                    │
                    ▼
             Embedding Model
                    │
                    ▼
        [0.018, -0.176, 0.724, ..., 0.088]
                    │
                    ▼
             Similarity Search
```

Because the vectors are mathematically close, the system retrieves the document even though the query uses different words.

---

# 2. What Is an Embedding?

An embedding is a numerical representation of the semantic meaning of text.

Conceptually:

```text
Text
  │
  ▼
Embedding Model
  │
  ▼
Vector
  │
  ├── semantic meaning
  ├── concepts
  ├── relationships
  └── contextual information
```

A vector might look like:

```python
[
    0.021,
   -0.184,
    0.731,
    0.442,
   -0.092,
    ...
]
```

The vector may contain hundreds or thousands of dimensions.

For example:

```text
Embedding dimension = 1536

Document chunk
      │
      ▼
[0.12, -0.44, 0.91, ..., 0.07]
          1536 numbers
```

The individual dimensions generally do **not** have simple human-readable meanings such as:

```text
dimension 1 = finance
dimension 2 = employee
dimension 3 = security
```

Instead, the entire vector collectively represents learned semantic information.

---

# 3. Why Vectors Enable Semantic Search

Consider these sentences:

```text
A:
"Employees can work remotely three days per week."

B:
"Staff members are permitted to work from home up to three days weekly."

C:
"The company cafeteria serves lunch from 11 AM to 2 PM."
```

Query:

```text
"How many days can employees work from home?"
```

Keyword matching might struggle because:

```text
Query:
work from home

Document A:
work remotely

Document B:
work from home

Document C:
cafeteria
```

Semantic embeddings capture the relationship:

```text
                  Query
       "days work from home"
                  │
                  ▼
             Query Vector
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
    Doc A       Doc B      Doc C
   similar     similar    unrelated
```

Conceptually:

```text
Similarity(Query, Doc A) = 0.91
Similarity(Query, Doc B) = 0.94
Similarity(Query, Doc C) = 0.12
```

Therefore:

```text
Doc B → Rank 1
Doc A → Rank 2
Doc C → Rank 3
```

---

# 4. End-to-End Document Vectorization

In enterprise RAG, we normally do **not** embed an entire large document as one vector.

Instead:

```text
Enterprise Document
        │
        ▼
     Parsing
        │
        ▼
   Cleaning
        │
        ▼
    Chunking
        │
        ├── Chunk 1
        ├── Chunk 2
        ├── Chunk 3
        └── Chunk N
              │
              ▼
       Embedding Model
              │
              ▼
       Vector per Chunk
              │
              ▼
       Vector Index
```

For example:

```text
Employee_Handbook.pdf
        │
        ▼
Sections
        │
        ▼
Chunks

Chunk 1:
"Employees are eligible for..."

Chunk 2:
"Remote work is permitted..."

Chunk 3:
"Employees must submit..."

        │
        ▼
Embedding Model

Chunk 1 → Vector 1
Chunk 2 → Vector 2
Chunk 3 → Vector 3
```

This allows retrieval at a useful semantic granularity.

---

# 5. Document Chunk → Embedding

Suppose we have:

```text
Chunk:

"Employees may work remotely up to three days
per week with manager approval."
```

The embedding model converts it:

```text
Text
 │
 ▼
Embedding Model
 │
 ▼
Vector

[
  0.021,
 -0.184,
  0.731,
  0.442,
 -0.092,
  ...
]
```

The vector is stored together with metadata.

For example:

```json
{
  "chunk_id": "CHUNK-1024",
  "document_id": "DOC-1001",
  "text": "Employees may work remotely up to three days per week with manager approval.",
  "embedding": [0.021, -0.184, 0.731, 0.442],
  "metadata": {
    "domain": "HR",
    "classification": "internal",
    "section": "Remote Work Policy",
    "access_groups": ["employees"]
  }
}
```

The real vector would contain hundreds or thousands of dimensions.

---

# 6. Query Vectorization

When a user asks:

```text
"How many days can I work from home?"
```

The query goes through the **same embedding model**:

```text
User Query
    │
    ▼
Embedding Model
    │
    ▼
Query Vector
    │
    ▼
Vector Search
```

Conceptually:

```python
query_vector = embedding_model.embed(
    "How many days can I work from home?"
)
```

Now:

```text
Query Vector
      │
      ▼
Vector Index
      │
      ├── Chunk Vector 1
      ├── Chunk Vector 2
      ├── Chunk Vector 3
      ├── Chunk Vector 4
      └── Chunk Vector N
```

The system calculates similarity between the query vector and stored vectors.

---

# 7. Why the Same Embedding Space Matters

This is extremely important.

Documents and queries must normally be represented in a **compatible embedding space**.

```text
Document
    │
    ▼
Embedding Model
    │
    ▼
Document Vector
         \
          \
           → Same semantic vector space
          /
         /
Query
    │
    ▼
Embedding Model
    │
    ▼
Query Vector
```

Then:

```text
Similarity(Query Vector, Document Vector)
```

can be meaningfully calculated.

A common mistake is embedding documents with one incompatible model and queries with another without a supported shared-space design.

---

# 8. Vector Similarity

Once vectors exist, we need a mathematical method to determine how similar they are.

Common methods include:

1. Cosine similarity
2. Dot product
3. Euclidean distance

The most commonly discussed method for text embeddings is **cosine similarity**.

---

# 9. Cosine Similarity

For two vectors:

```text
A = document vector

B = query vector
```

Cosine similarity is:

```text
                  A · B
Similarity = ───────────────
             ||A|| × ||B||
```

Where:

```text
A · B
```

is the dot product.

And:

```text
||A||
```

is the magnitude of vector A.

Conceptually:

```text
Similarity ≈ 1
      │
      ▼
Very similar meaning

Similarity ≈ 0
      │
      ▼
Weak relationship

Similarity ≈ -1
      │
      ▼
Opposite direction
```

The exact useful score range and interpretation depend on the embedding model and vector-search implementation.

---

# 10. Vector Search Example

Suppose the query vector is compared against four chunks:

| Chunk                  | Similarity |
| ---------------------- | ---------: |
| Remote Work Policy     |       0.94 |
| Employee Leave Policy  |       0.82 |
| Office Security Policy |       0.41 |
| Cafeteria Policy       |       0.13 |

The search engine ranks them:

```text
1. Remote Work Policy       0.94
2. Employee Leave Policy    0.82
3. Office Security Policy   0.41
4. Cafeteria Policy         0.13
```

The RAG system may select:

```text
Top K = 3
```

and pass those chunks to the next stage.

---

# 11. Semantic Search Pipeline

The complete runtime flow is:

```text
                   USER QUERY
                       │
                       ▼
              Query Preprocessing
                       │
                       ▼
               Query Embedding
                       │
                       ▼
                Query Vector
                       │
                       ▼
          ┌─────────────────────────┐
          │     Vector Search       │
          │                         │
          │ Query Vector            │
          │      ↓                  │
          │ Vector Index            │
          └─────────────────────────┘
                       │
                       ▼
               Candidate Chunks
                       │
                       ▼
             Metadata Filtering
                       │
                       ▼
                  Re-ranking
                       │
                       ▼
              Top Relevant Chunks
                       │
                       ▼
             Context Construction
                       │
                       ▼
                    LLM
                       │
                       ▼
              Grounded Response
```

---

# 12. Enterprise CWD Architecture

Within CWD, vectorization typically belongs primarily to the **RAG/Knowledge layer**.

```text
                    USER
                      │
                      ▼
                COORDINATOR
                      │
                      ▼
                 DELEGATOR
                      │
                      ▼
                RAG WORKER
                      │
          ┌───────────┴────────────┐
          │                        │
          ▼                        ▼
    Query Embedding          Access Policy
          │                        │
          └───────────┬────────────┘
                      ▼
              Vector / Hybrid Search
                      │
                      ▼
                Candidate Chunks
                      │
                      ▼
              Security Filtering
                      │
                      ▼
                  Re-ranking
                      │
                      ▼
              Context Construction
                      │
                      ▼
                  LLM / Model
                      │
                      ▼
             Grounded Response
```

The important architectural principle is:

> **The LLM should not directly search the enterprise vector database. The governed RAG Worker performs retrieval and supplies authorized evidence to the LLM.**

---

# 13. Offline Document Vectorization vs Runtime Query Vectorization

There are actually two different vectorization processes.

## A. Offline / ingestion time

```text
Document
   ↓
Parse
   ↓
Chunk
   ↓
Embed
   ↓
Vector
   ↓
Index
```

This happens when documents are added or updated.

For example:

```text
SharePoint
    ↓
Document ingestion
    ↓
Chunking
    ↓
Embedding
    ↓
Azure AI Search / Vector DB
```

## B. Online / query time

```text
User Query
    ↓
Embed
    ↓
Query Vector
    ↓
Vector Search
    ↓
Relevant Chunks
```

The key optimization is:

```text
Documents → embedded once
Queries   → embedded per request
```

Documents are re-embedded when their content changes or when the embedding model/indexing strategy changes.

---

# 14. Vector Database

A vector database/index stores vectors and associated metadata.

Conceptually:

```text
┌─────────────────────────────────────────────┐
│                Vector Index                 │
├──────────┬──────────────┬───────────────────┤
│ Chunk ID │ Vector       │ Metadata          │
├──────────┼──────────────┼───────────────────┤
│ C001     │ [0.1,...]    │ HR                │
│ C002     │ [0.4,...]    │ Finance           │
│ C003     │ [0.7,...]    │ Engineering       │
│ C004     │ [0.2,...]    │ Security          │
└──────────┴──────────────┴───────────────────┘
```

Examples of vector-capable technologies include:

```text
Azure AI Search
PostgreSQL + pgvector
Qdrant
Pinecone
Weaviate
FAISS
Chroma
```

In an Azure-oriented CWD architecture, **Azure AI Search** can provide vector, lexical, hybrid, filtering, and semantic-search capabilities.

---

# 15. Why an Index Is Required

Suppose you have:

```text
10 million document chunks
```

You don't necessarily want to calculate the exact similarity against every vector for every query.

Vector search systems use indexing/approximate nearest-neighbor techniques to efficiently find nearby vectors.

Conceptually:

```text
10,000,000 vectors
       │
       ▼
Vector Index
       │
       ▼
Efficient candidate search
       │
       ▼
Top 50 candidates
       │
       ▼
Re-ranking
       │
       ▼
Top 5–10
```

This provides a practical balance between:

```text
Search Quality
       +
Search Latency
       +
Infrastructure Cost
```

---

# 16. Dense Vector Retrieval

Embedding-based retrieval is usually called **dense retrieval**.

```text
Query
  ↓
Dense Vector
  ↓
Vector Similarity
  ↓
Relevant Chunks
```

It is particularly useful when:

```text
Query wording ≠ Document wording
```

Example:

```text
Query:
"work from home"

Document:
"remote working arrangement"
```

Dense retrieval can recognize the semantic relationship.

---

# 17. Dense vs Sparse Retrieval

Enterprise RAG often benefits from combining semantic and keyword search.

### Dense

```text
Meaning-based
     ↓
Embedding
     ↓
Vector similarity
```

### Sparse

```text
Keyword/token based
     ↓
BM25
     ↓
Lexical matching
```

For example:

```text
Query:

"policy ID HR-4721"
```

Keyword search may be excellent because:

```text
HR-4721
```

is an exact identifier.

But for:

```text
"What is our policy for working remotely?"
```

semantic search can be much more useful.

---

# 18. Hybrid Search

Enterprise RAG commonly combines both:

```text
                 Query
                   │
          ┌────────┴────────┐
          ▼                 ▼
    Dense Retrieval    Sparse Retrieval
          │                 │
          ▼                 ▼
    Semantic Results    Keyword Results
          │                 │
          └────────┬────────┘
                   ▼
              Fusion/Ranking
                   │
                   ▼
              Top Results
```

Conceptually:

```text
Hybrid Score =
    α × Dense Score
  + β × Sparse Score
```

where:

```text
α + β = 1
```

The actual fusion/ranking method should be evaluated against the enterprise corpus rather than assuming fixed weights.

---

# 19. Vectorization Is Not Authorization

This is a critical CWD security principle.

Suppose a restricted HR document has a highly similar vector.

That does **not** mean the user is allowed to retrieve it.

```text
Query
  │
  ▼
Query Vector
  │
  ▼
Candidate Retrieval
  │
  ▼
Authorization / ACL Filtering
  │
  ▼
Authorized Results
  │
  ▼
Context
```

Therefore:

```text
Semantic relevance ≠ authorization
```

The system must combine:

```text
Relevance
    +
Identity
    +
Entitlements
    +
Classification
    +
Policy
```

before exposing content to the LLM.

---

# 20. Metadata Travels With the Vector

A production vector record should not be just:

```text
vector = [0.12, -0.44, ...]
```

It should maintain lineage and security metadata.

For example:

```json
{
  "chunk_id": "CH-00123",
  "document_id": "DOC-1001",
  "document_version": "7",
  "section": "Remote Work Policy",
  "domain": "HR",
  "classification": "internal",
  "access_groups": [
    "employees"
  ],
  "source": "sharepoint",
  "source_url": "...",
  "effective_date": "2026-01-01",
  "embedding_model": "embedding-model-v1",
  "embedding_dimension": 1536
}
```

This enables:

```text
Vector similarity
       +
Metadata filtering
       +
Security filtering
       +
Provenance
```

---

# 21. What Happens When a Document Changes?

Suppose:

```text
Old policy:
Remote work = 3 days/week
```

changes to:

```text
New policy:
Remote work = 2 days/week
```

The ingestion pipeline should detect:

```text
Document changed
       ↓
New document version
       ↓
Re-parse
       ↓
Re-chunk
       ↓
Re-embed changed chunks
       ↓
Update index
```

This is important because the vector represents the **content that was embedded**.

If the content changes significantly, the old embedding should not remain the authoritative retrieval representation.

---

# 22. Embedding Model Versioning

Embedding models themselves are production dependencies.

For example:

```text
Embedding Model v1
       ↓
1536-dimensional vectors
```

Later:

```text
Embedding Model v2
       ↓
different representation
```

You should not casually mix incompatible vector representations in the same index.

A controlled migration can look like:

```text
Current Index
    │
    │ v1 embeddings
    ▼
New Index
    │
    │ v2 embeddings
    ▼
Evaluation
    │
    ▼
Validation
    │
    ▼
Controlled Promotion
```

This makes retrieval behavior reproducible and supports rollback.

---

# 23. Vectorization and CWD State

For reproducibility, CWD can record information such as:

```json
{
  "embedding_model": "embedding-model-v1",
  "embedding_version": "1.0",
  "vector_index": "enterprise-kb-prod",
  "retrieval_mode": "hybrid",
  "top_k": 20,
  "reranker_version": "2.1",
  "metadata_filters": {
    "domain": "HR",
    "classification": "internal"
  }
}
```

LangGraph state can carry workflow-level retrieval information, while the actual vector index remains an external knowledge service.

---

# 24. RAG Retrieval Pipeline

Putting everything together:

```text
                ENTERPRISE KNOWLEDGE
                       │
                       ▼
                Document Ingestion
                       │
                       ▼
                     Parsing
                       │
                       ▼
                    Chunking
                       │
                       ▼
               Metadata + ACL
                       │
                       ▼
                 Embedding Model
                       │
                       ▼
                 Vector Embeddings
                       │
                       ▼
                 Vector / Search Index
                       │
                       │
                 ──────┼──────
                       │
                       ▲
                       │
                  USER QUERY
                       │
                       ▼
                 Query Embedding
                       │
                       ▼
                 Query Vector
                       │
                       ▼
              Semantic / Hybrid Search
                       │
                       ▼
               Candidate Documents
                       │
                       ▼
             Authorization Filtering
                       │
                       ▼
                    Re-ranking
                       │
                       ▼
               Context Construction
                       │
                       ▼
                      LLM
                       │
                       ▼
              Grounded Response
```

---

# 25. Complete Conceptual Python Example

A simplified implementation looks like this:

```python
from typing import List
import numpy as np


class EmbeddingModel:

    def embed(self, text: str) -> List[float]:
        """
        In production this would call an approved
        embedding model.
        """
        vector = model_api.create_embedding(text)

        return vector


def cosine_similarity(a, b):

    a = np.array(a)
    b = np.array(b)

    return np.dot(a, b) / (
        np.linalg.norm(a) * np.linalg.norm(b)
    )


# ------------------------------------------------
# DOCUMENT INGESTION
# ------------------------------------------------

documents = [
    "Employees may work remotely up to three days per week.",
    "Employees receive twenty days of annual leave.",
    "The cafeteria is open from 11 AM to 2 PM."
]

embedding_model = EmbeddingModel()

vector_store = []

for document in documents:

    vector = embedding_model.embed(document)

    vector_store.append({
        "text": document,
        "vector": vector
    })


# ------------------------------------------------
# USER QUERY
# ------------------------------------------------

query = "How many days can I work from home?"

query_vector = embedding_model.embed(query)


# ------------------------------------------------
# SEMANTIC SEARCH
# ------------------------------------------------

results = []

for item in vector_store:

    score = cosine_similarity(
        query_vector,
        item["vector"]
    )

    results.append({
        "text": item["text"],
        "score": score
    })


# ------------------------------------------------
# RANK RESULTS
# ------------------------------------------------

results.sort(
    key=lambda x: x["score"],
    reverse=True
)


for result in results[:3]:

    print(
        result["score"],
        result["text"]
    )
```

The production implementation would add:

```text
Authentication
Authorization
ACL filtering
Metadata filtering
Hybrid retrieval
ANN indexing
Reranking
Caching
Observability
Timeouts
Retries
Data classification
Provenance
Evaluation
```

---

# 26. Where the LLM Fits

An important distinction:

```text
Embedding Model
       │
       └── converts text → vectors

LLM
       │
       └── reasons over retrieved context
```

They are different responsibilities.

```text
             ┌─────────────────┐
             │ Embedding Model │
             └────────┬────────┘
                      │
                Semantic Vector
                      │
                      ▼
                Search Engine
                      │
                Relevant Context
                      │
                      ▼
             ┌─────────────────┐
             │       LLM       │
             └────────┬────────┘
                      │
                  Answer
```

The embedding model is primarily responsible for **representation and retrieval**.

The LLM is responsible for **reasoning and generation**.

---

# 27. The Most Important Architectural Distinction

Think of the entire RAG system as four layers:

```text
1. REPRESENTATION
   Text → Embedding

2. RETRIEVAL
   Query Vector → Similar Vectors

3. GROUNDING
   Retrieved Chunks → LLM Context

4. GENERATION
   Context + Query → Answer
```

And enterprise CWD adds:

```text
5. GOVERNANCE
   Identity + Authorization + Policy
```

So:

```text
Text
 ↓
Embedding
 ↓
Vector Search
 ↓
Authorization
 ↓
Re-ranking
 ↓
Context
 ↓
LLM
 ↓
Validation
 ↓
Answer
```

---

# 28. Key Design Decisions

| Decision            | Why it matters                                        |
| ------------------- | ----------------------------------------------------- |
| Embedding model     | Determines semantic representation                    |
| Embedding dimension | Determines vector representation/storage requirements |
| Chunk size          | Controls retrieval granularity                        |
| Chunk overlap       | Preserves boundary context                            |
| Vector index        | Controls search efficiency                            |
| Similarity metric   | Determines vector comparison                          |
| Top-K               | Controls candidate retrieval                          |
| Metadata filters    | Improve precision and security                        |
| ACL filtering       | Prevents unauthorized retrieval                       |
| Hybrid search       | Handles semantic + exact-match queries                |
| Reranking           | Improves final relevance                              |
| Model versioning    | Enables reproducibility                               |
| Provenance          | Enables traceability                                  |
| Evaluation          | Measures retrieval quality                            |

---

# 29. Common Anti-Patterns

### ❌ Embedding the entire enterprise document

```text
Huge Document
     ↓
One Vector
```

This can produce poor retrieval granularity.

### ❌ Using different incompatible embedding spaces

```text
Documents → Model A
Queries   → Model B
```

unless the models are explicitly designed to work together.

### ❌ Ignoring metadata

```text
Vector only
```

loses valuable filtering, lineage, and governance information.

### ❌ Treating similarity as authorization

```text
High similarity
      ≠
User can access document
```

### ❌ Sending every retrieved vector to the LLM

Vectors themselves are not useful context for the LLM.

The system needs:

```text
Vector Search
     ↓
Retrieve original text
     ↓
Build context
     ↓
LLM
```

### ❌ Assuming the nearest vector is always correct

Semantic similarity is a retrieval signal, not a guarantee of correctness.

That is why production RAG often uses:

```text
Dense Retrieval
+
Sparse Retrieval
+
Metadata Filtering
+
Reranking
+
Grounding Validation
```

---

# 30. Evaluation

Vectorization should be evaluated as part of retrieval quality.

Important metrics include:

```text
Recall@K
Precision@K
MRR
NDCG
Context Precision
Context Recall
Answer Groundedness
Citation Accuracy
Latency
Token Cost
```

For example:

```text
Query
  │
  ▼
Retrieve Top 10
  │
  ▼
How many relevant documents
were actually retrieved?
  │
  ▼
Recall@10
```

A better embedding model does not automatically mean better enterprise RAG.

The complete pipeline matters:

```text
Embedding
   ↓
Chunking
   ↓
Indexing
   ↓
Retrieval
   ↓
Filtering
   ↓
Reranking
   ↓
Context
   ↓
Generation
```

---

# 31. CWD Mental Model

For your CWD architecture, keep this separation:

```text
                 CWD
                  │
        ┌─────────┴─────────┐
        │                   │
   Orchestration         Knowledge
        │                   │
    LangGraph               RAG
        │                   │
 Coordinator/         ┌─────┴─────┐
 Delegator/Worker     │           │
        │          Embedding    Retrieval
        │              │           │
        │          Vector DB    Reranker
        │              │           │
        └──────────────┴───────────┘
                       │
                       ▼
                      LLM
```

And the responsibilities are:

```text
LLM
→ Reason and generate

Embedding Model
→ Convert text/query into semantic vectors

Vector Index
→ Find semantically similar content

RAG Worker
→ Execute governed retrieval

Policy/IAM
→ Determine what the user/agent may access

LangGraph
→ Manage workflow state and retrieval steps

MCP
→ Standardize access to approved knowledge/search capabilities

Agent Registry
→ Discover the appropriate agent/integration

CWD
→ Orchestrate the entire enterprise workflow
```

---

# 32. Final Formula

The fundamental semantic retrieval process is:

```text
Document
      ↓
Embedding Model
      ↓
Document Vector
      ↓
Vector Index


Query
      ↓
Same Embedding Space
      ↓
Query Vector
      ↓
Similarity Search
      ↓
Relevant Documents
```

Mathematically:

```text
Retrieved Documents
=
TopK(
    Similarity(
        Embed(Query),
        Embed(Document Chunks)
    )
)
```

Enterprise RAG extends this to:

```text
Enterprise Retrieval
=
Semantic Similarity
+
Metadata Filtering
+
Authorization Filtering
+
Hybrid Retrieval
+
Re-ranking
+
Provenance
```

## Final Definition

**Document and query vectorization is the process of converting enterprise document chunks and user queries into compatible numerical embedding representations so that semantic similarity can be calculated between them. During ingestion, document chunks are embedded and stored with metadata in a vector-capable index; at runtime, the user's query is embedded into the same semantic space, compared against indexed vectors, filtered according to metadata and access policies, and ranked to identify the most relevant authorized knowledge that can be supplied to the LLM for grounded response generation.**

### Architect Mental Model

```text
              TEXT
                │
                ▼
          EMBEDDING MODEL
                │
                ▼
             VECTOR
                │
                ▼
        SEMANTIC SEARCH
                │
       ┌────────┴────────┐
       ▼                 ▼
  RELEVANCE          AUTHORIZATION
       │                 │
       └────────┬────────┘
                ▼
           RERANKING
                │
                ▼
          RELEVANT CONTEXT
                │
                ▼
               LLM
                │
                ▼
        GROUNDED ANSWER
```

**In one sentence:**

> **Embeddings turn documents and queries into points in a shared semantic space, and vector search finds the enterprise knowledge whose points are closest to the query while CWD's security and governance layers ensure that only relevant and authorized evidence reaches the LLM.**
