# Document Chunking Strategies for Enterprise RAG

Chunking is one of the most important design decisions in a RAG system because it determines **what unit of knowledge gets embedded, retrieved, ranked, and ultimately placed into the LLM context**.

The central principle is:

> **A good chunk is large enough to preserve meaning but small enough to retrieve precisely and fit efficiently into the LLM context.**

For CWD, chunking should therefore be treated as a **retrieval-quality and context-engineering decision**, not simply a text-splitting operation.

## 1. Where Chunking Fits

The ingestion pipeline is:

```text id="h4x8cp"
Enterprise Document
       ↓
Parsing
       ↓
Cleaning
       ↓
Structure Detection
       ↓
        CHUNKING
       ↓
Metadata + ACL
       ↓
Embedding
       ↓
Index
```

At runtime:

```text id="w7m2qk"
User Query
    ↓
Retrieval
    ↓
Relevant Chunks
    ↓
Re-ranking
    ↓
Context Construction
    ↓
LLM
    ↓
Grounded Response
```

Therefore:

```text id="9z4b1f"
Chunking
   ↓
Embedding Unit
   ↓
Retrieval Unit
   ↓
Context Unit
```

This is why chunking has a direct effect on the final answer.

---

# 2. Why Can't We Embed the Entire Document?

Suppose we have:

```text id="d8n3mv"
100-page Engineering Manual
```

If we create one embedding:

```text id="a5k7rx"
100-page document
       ↓
   One vector
```

the vector represents many different topics.

A query such as:

```text id="q6p1cz"
"What is the maximum operating temperature?"
```

may retrieve the entire document.

That creates several problems:

* Poor retrieval precision
* Too much irrelevant context
* Larger token consumption
* Increased latency
* More difficult reranking
* Greater chance of confusing the LLM

Instead:

```text id="x2v8qa"
100-page document
       ↓
   Chunking
       ↓
 ┌─────┼─────┬─────┐
 ▼     ▼     ▼     ▼
C1    C2    C3    C4
```

The relevant operating-temperature section can be retrieved directly.

---

# 3. The Fundamental Chunking Trade-off

There is no universally correct chunk size.

You are balancing:

```text id="s5n9yc"
          Chunk Size
              │
      ┌───────┴────────┐
      ▼                ▼
Too Small          Too Large
      │                │
      ▼                ▼
Missing Context    Poor Precision
Fragmentation      Too Much Noise
More Chunks        Large Context
```

The ideal chunk is somewhere between these extremes.

Conceptually:

```text id="p1x6za"
             Optimal Chunk
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
Enough Context       High Retrieval Precision
```

---

# 4. What Happens With Very Small Chunks?

Suppose we split:

```text id="4r7qnx"
"Carrier capacity constraints resulted
in shipment delays."
```

into:

```text id="z8k2mc"
"Carrier capacity"

"constraints resulted"

"shipment delays"
```

Each piece contains insufficient context.

A query:

```text id="g4m1py"
"Why was the shipment delayed?"
```

may retrieve:

```text id="0r5hvb"
"shipment delays"
```

but not the critical explanation:

```text id="t7j3kd"
"Carrier capacity constraints"
```

This creates **context fragmentation**.

### Small chunks can cause:

* Loss of semantic meaning
* Poor retrieval recall
* Fragmented evidence
* More metadata records
* More embeddings
* More index entries
* More retrieval candidates

---

# 5. What Happens With Very Large Chunks?

Now imagine:

```text id="j6x9qp"
10,000-token chunk
```

A query about:

```text id="r3m7ka"
"Maximum operating temperature?"
```

may retrieve a huge section containing:

```text Introduction
Architecture
Operating Conditions
Safety
Troubleshooting
Maintenance
Warranty
References
```

Only one paragraph may actually matter.

The LLM receives a lot of irrelevant information.

This can cause:

* Lower retrieval precision
* Context dilution
* Higher token usage
* Higher latency
* Higher cost
* Increased chance of confusing evidence
* Reduced effective context utilization

---

# 6. Chunk Size

Chunk size can be defined in:

```text id="f3w8nv"
Characters
Words
Tokens
Sentences
Paragraphs
Semantic units
```

For LLM-based RAG, **tokens** are usually the most meaningful measurement because LLM context windows and token costs are token-based.

For example:

```text id="9c5v2a"
Chunk size = 500 tokens
Overlap    = 50 tokens
```

means approximately:

```text id="q7x3mw"
Chunk 1: tokens 1–500
Chunk 2: tokens 451–950
Chunk 3: tokens 901–1400
```

---

# 7. Chunk Size Should Be Based on Content

Do not blindly decide:

```text id="w4p8sd"
Every document = 500 tokens
```

Instead consider the content.

### FAQ

```text id="f5n2rc"
Question + Answer
```

can be a natural chunk.

### Policy

```text id="m8v3qa"
Policy Section
```

may be the right chunk.

### Engineering manual

```text id="x6j1kp"
Section / subsection
```

may work better.

### Code documentation

```text id="v9r4cy"
Function/Class + explanation
```

may be more meaningful.

### Legal document

```text id="k2s7mb"
Clause / subsection
```

may be the appropriate boundary.

Therefore:

> **Chunk size should follow the semantic structure of the source whenever possible.**

---

# 8. Fixed-Size Chunking

The simplest strategy is fixed-size splitting.

Example:

```text id="d4y8qf"
Document
   ↓
500-token chunks
```

```python id="c5n1za"
def fixed_chunks(tokens, chunk_size=500):
    chunks = []

    for i in range(0, len(tokens), chunk_size):
        chunk = tokens[i:i + chunk_size]
        chunks.append(chunk)

    return chunks
```

Advantages:

* Simple
* Fast
* Predictable
* Easy to implement
* Easy to scale

Disadvantages:

* Can split sentences
* Can split paragraphs
* Can split tables
* Can split logical concepts

---

# 9. Fixed-Size Chunking With Overlap

Overlap attempts to reduce information loss at chunk boundaries.

Suppose:

```text id="n3j7ka"
Chunk size = 500 tokens
Overlap = 50 tokens
```

Then:

```text id="q6v2md"
Chunk 1
[1 ───────────────── 500]

Chunk 2
              [451 ─────────────── 950]

Chunk 3
                            [901 ─────────────── 1400]
```

The overlapping region preserves some context between neighboring chunks.

---

# 10. Why Overlap Is Useful

Consider:

```text id="a4k8sp"
Chunk 1:

"The carrier reported capacity constraints.
As a result, shipments scheduled for the
Dallas distribution center were delayed..."
```

If the split happens here:

```text id="q9m3rx"
Chunk 1:
"The carrier reported capacity constraints."

Chunk 2:
"As a result, shipments scheduled for the
Dallas distribution center were delayed..."
```

The relationship between cause and consequence can become weaker.

Overlap gives:

```text id="f2v7mc"
Chunk 1:
...carrier reported capacity constraints.
As a result...

Chunk 2:
...capacity constraints.
As a result, shipments...
```

This improves boundary continuity.

---

# 11. Too Much Overlap Is Also Bad

Suppose:

```text id="1k8w4s"
Chunk size = 500
Overlap = 400
```

You are creating huge duplication.

```text id="v3x7qp"
Chunk 1: ████████████████████
Chunk 2:       ████████████████████
Chunk 3:             ████████████████████
```

This leads to:

* More chunks
* Larger index
* More embedding cost
* Duplicate retrieval results
* More redundant context

Therefore:

> **Overlap should preserve boundary context, not duplicate most of the document.**

A modest overlap is often a useful starting point, but the optimal value should be evaluated empirically.

---

# 12. Semantic Chunking

Semantic chunking tries to preserve meaningful concepts.

Instead of:

```text id="z5b8xk"
Every 500 tokens
```

we identify:

```text id="p7c4nm"
Heading
   ↓
Paragraphs
   ↓
Subheading
   ↓
Paragraphs
```

For example:

```text id="m3f9qa"
Shipment Management
│
├── Shipment Creation
│
├── Carrier Selection
│
├── Delay Management
│
├── Rerouting
│
└── Cancellation
```

Each section can become a logical retrieval unit.

---

# 13. Why Semantic Boundaries Matter

Consider:

```text id="y2k6rp"
Operating Conditions

The device must operate between
-20°C and 125°C.

Safety Requirements

The device must be installed...
```

A fixed splitter might produce:

```text id="x5v1mc"
Chunk:
125°C.

Safety Requirements...
```

The number `125°C` has lost its relationship to:

```text id="d7q9nb"
Operating Conditions
```

A semantic chunk keeps:

```text id="h3m8vf"
Operating Conditions

The device must operate between
-20°C and 125°C.
```

This is far better for retrieval and grounding.

---

# 14. Hierarchical Chunking

Hierarchical chunking preserves document hierarchy.

```text id="c9x4ma"
Document
   │
   ├── Chapter
   │      │
   │      ├── Section
   │      │      │
   │      │      ├── Chunk
   │      │      └── Chunk
   │      │
   │      └── Section
   │
   └── Chapter
```

Metadata can retain:

```json id="y7f3pd"
{
  "document": "Engineering Manual",
  "chapter": "Operating Conditions",
  "section": "Temperature",
  "chunk_id": "CH-104"
}
```

This gives the retriever more context about where a chunk belongs.

---

# 15. Parent-Child Chunking

Another powerful strategy is parent-child retrieval.

```text id="v4n8xa"
                Parent Section
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    Child 1       Child 2      Child 3
```

The child chunks are small and precise.

The parent section provides broader context.

Runtime:

```text id="r5c7mq"
Query
 ↓
Retrieve Child Chunk
 ↓
Identify Parent
 ↓
Retrieve Parent Context
 ↓
Construct Context
 ↓
LLM
```

This can provide:

```text id="k3p8wd"
High retrieval precision
        +
Sufficient surrounding context
```

---

# 16. Document Structure-Aware Chunking

For enterprise documents, structure can be extremely valuable.

Preserve:

```text id="j6v9cz"
Title
Heading
Subheading
Paragraph
Table
List
Caption
Reference
Page
Section
```

For example:

```text id="z2r7bx"
Document:
Shipment Policy

Section:
Delay Management

Subsection:
Carrier Capacity

Content:
Carrier capacity constraints...
```

Instead of embedding only:

```text id="g8q1nf"
"Carrier capacity constraints..."
```

embed something closer to:

```text id="p4y7km"
Shipment Policy
→ Delay Management
→ Carrier Capacity

Carrier capacity constraints...
```

The additional structural context can improve semantic retrieval.

---

# 17. Table Chunking

Tables require special treatment.

Suppose:

```text id="e9w2ka"
Product | Temperature | Pressure
---------------------------------
P100   | 125°C       | 10 bar
P200   | 150°C       | 15 bar
```

Blind text extraction may produce:

```text id="z4n8qy"
P100 125°C 10 bar P200 150°C 15 bar
```

This loses relationships.

A better representation might preserve:

```text id="f5q7mc"
Product: P100
Maximum Temperature: 125°C
Maximum Pressure: 10 bar
```

or maintain table structure in a retrievable representation.

For technical enterprise RAG, **table-aware ingestion can significantly affect answer quality**.

---

# 18. Chunking Lists

Lists should generally remain together when they represent one procedure.

Instead of:

```text id="8b3r7m"
Chunk 1:
1. Detect delay
2. Notify manager

Chunk 2:
3. Check rerouting constraints
4. Obtain approval
```

prefer:

```text id="x6p2nv"
Delay Handling Procedure

1. Detect delay
2. Notify manager
3. Check rerouting constraints
4. Obtain approval
```

The procedure is a single semantic unit.

---

# 19. Code and Technical Documents

Code should not necessarily be chunked using generic character-based splitting.

For example:

```text id="m8x4cq"
Class
 ├── Constructor
 ├── Method A
 ├── Method B
 └── Method C
```

A better chunking unit may be:

```text id="r7j2ka"
Class + relevant method + documentation
```

Similarly, API documentation can be chunked by:

```text id="v5n9cx"
Endpoint
Request
Parameters
Response
Examples
Errors
```

This preserves technical meaning.

---

# 20. Chunking and Embeddings

Remember:

```text id="q6m8sa"
Chunk
  ↓
Embedding
  ↓
Vector
```

Therefore:

> **Chunking determines what semantic concept the embedding represents.**

If a chunk contains five unrelated topics:

```text id="p3x7zn"
Topic A + Topic B + Topic C + Topic D + Topic E
```

the embedding becomes a representation of a mixed semantic region.

If a chunk represents:

```text id="h9v2mq"
Topic C
```

the embedding is more focused.

This is why chunk quality directly affects vector retrieval.

---

# 21. Chunking and Retrieval Precision

Suppose the query is:

```text id="b6q3tw"
"What is the maximum operating temperature?"
```

With good chunks:

```text id="s8f1ka"
Top result:
Operating Conditions → Temperature
```

With poor chunks:

```text id="x5m7qp"
Top result:
Entire Product Manual
```

The second result may technically contain the answer but is less precise.

So:

```text id="z4y8mc"
Better Chunking
      ↓
Better Retrieval Precision
      ↓
Better Context
      ↓
Better Answer
```

---

# 22. Chunking and Recall

Chunking also affects recall.

If an important answer is split across:

```text id="j7n3vb"
Chunk A:
Carrier capacity constraints...

Chunk B:
...caused the shipment delay.
```

and only B is retrieved, the system may miss the causal relationship.

Overlap or semantic chunking can help preserve this relationship.

Therefore chunking affects both:

```text id="a2x9kc"
Precision
+
Recall
```

---

# 23. Chunking and LLM Context

The LLM does not receive the entire index.

It receives selected chunks.

For example:

```text id="k8m2za"
Retrieved:
50 chunks

        ↓

Reranked:
10 chunks

        ↓

Context:
5 chunks

        ↓

LLM
```

Therefore chunk size affects context construction.

If chunks are too large:

```text id="r6p1vb"
5 chunks
×
Large chunk size
=
Huge context
```

If chunks are too small:

```text id="q4z8mx"
5 chunks
=
Insufficient context
```

The goal is:

```text id="n7c3qa"
Maximum useful information
with minimum irrelevant information
```

---

# 24. Context Window Is Not a Reason to Make Chunks Huge

Modern LLMs can support large contexts.

That does **not** mean:

```text id="j8x4mv"
"Put the entire document into the context."
```

Large context windows do not eliminate the need for retrieval precision.

More context can introduce:

```text id="p3v6qy"
Noise
Conflicting information
Higher latency
Higher cost
Attention dilution
```

Therefore:

> **The goal of RAG is not maximum context; it is maximum relevant context.**

---

# 25. Chunking and Token Budget

Suppose the model context budget is:

```text id="f7n2mc"
16,000 tokens
```

You might allocate:

```text id="k8q4pa"
System instructions     = 1,500
User question           =   200
Retrieved context       = 10,000
Expected output         = 2,000
Safety / overhead       = 2,300
```

Now the retrieval system must fit useful evidence inside the context budget.

Chunking therefore becomes part of **context-budget management**.

---

# 26. Dynamic Context Construction

A production system may dynamically select:

```text id="q3w8vb"
Top 3 chunks
```

for a simple query, but:

```text id="n5m1xc"
Top 8 chunks
```

for a complex query.

The context builder can consider:

```text id="d7p4za"
Relevance
Diversity
Source authority
Document version
Chunk size
Token budget
Query complexity
```

This is better than always retrieving exactly the same amount.

---

# 27. Chunk Diversity

Suppose the top five results are:

```text id="u6c8kr"
Chunk 1 → same paragraph
Chunk 2 → same paragraph
Chunk 3 → same paragraph
Chunk 4 → same paragraph
Chunk 5 → same paragraph
```

You may waste context on duplicates.

A context builder can perform deduplication:

```text id="h3m9vx"
Retrieve
 ↓
Rerank
 ↓
Deduplicate
 ↓
Diverse Evidence
 ↓
Context
```

This gives the LLM broader useful evidence.

---

# 28. Chunk Metadata Is as Important as Chunk Text

A chunk should ideally preserve:

```json id="p8z5wd"
{
  "chunk_id": "CH-1004",
  "document_id": "DOC-1001",
  "document_version": "5.0",
  "title": "Shipment Policy",
  "section": "Delay Management",
  "domain": "logistics",
  "classification": "internal",
  "access_groups": [
    "logistics-team"
  ],
  "effective_date": "2026-08-01",
  "text": "Carrier capacity constraints..."
}
```

This allows retrieval to consider:

```text id="x5q9mc"
Semantic relevance
+
Domain
+
Version
+
Classification
+
Authorization
+
Effective date
```

---

# 29. Chunking Must Preserve Security Lineage

This is particularly important in CWD.

If a document has:

```text id="z6k2qa"
Access:
Finance-Restricted
```

every derived chunk should retain the appropriate security metadata.

```text id="m8x4vc"
Document ACL
     ↓
Chunk ACL
     ↓
Index
     ↓
Retrieval Filter
```

You do not want:

```text id="f3p7yb"
Restricted Document
       ↓
Chunk
       ↓
Security metadata lost
       ↓
LLM context
```

---

# 30. Chunking Strategies Comparison

| Strategy        | Strength                     | Weakness                | Best Use             |
| --------------- | ---------------------------- | ----------------------- | -------------------- |
| Fixed-size      | Simple                       | Breaks semantics        | Simple text          |
| Fixed + overlap | Preserves boundaries         | Duplication             | General documents    |
| Sentence-based  | Natural boundaries           | Variable size           | Articles             |
| Paragraph-based | Good meaning                 | Uneven sizes            | Business docs        |
| Section-based   | Strong structure             | Large sections possible | Policies/manuals     |
| Semantic        | Meaning-aware                | More processing         | Complex knowledge    |
| Parent-child    | Precision + context          | More architecture       | Enterprise RAG       |
| Hierarchical    | Preserves document structure | More metadata           | Technical docs       |
| Table-aware     | Preserves relationships      | More complex            | Engineering/finance  |
| Structure-aware | High-quality retrieval       | Requires good parsing   | Enterprise documents |

---

# 31. Recommended Enterprise Strategy

For CWD, I would not recommend one universal chunking strategy.

Use a **document-aware chunking policy**:

```text id="b6r4xy"
Document Type
      ↓
Chunking Strategy
      │
      ├── Policy
      │      → Section-aware
      │
      ├── Engineering Manual
      │      → Hierarchical / semantic
      │
      ├── FAQ
      │      → Question-answer pair
      │
      ├── Table
      │      → Table-aware
      │
      ├── Code
      │      → Function/class-aware
      │
      └── General Text
             → Sentence / token based
```

This is generally more robust than a single global chunk size.

---

# 32. Practical Starting Point

For a first enterprise implementation, a reasonable **starting configuration** might be:

```text id="y8v2kc"
Chunk size:
~400–800 tokens

Overlap:
~10–20%

Boundary:
Prefer paragraph/section boundaries

Metadata:
Always preserve

Security:
Propagate ACL/classification

Retrieval:
Hybrid when appropriate

Reranking:
Yes

Context:
Dynamic token budget
```

These are **starting points, not universal rules**. The correct values depend on document type and should be selected through evaluation.

---

# 33. Chunking Evaluation

Do not evaluate chunking only by looking at the chunks.

Evaluate the complete retrieval pipeline.

Create a benchmark:

```text id="x5m8qa"
Question
Expected Answer
Expected Source
Expected Chunk
```

Then test different configurations.

### Configuration A

```text
500 tokens
50 overlap
```

### Configuration B

```text
800 tokens
100 overlap
```

### Configuration C

```text
Semantic sections
```

Compare:

```text id="p7v3mx"
Recall@K
Precision@K
MRR
NDCG
Context relevance
Answer groundedness
Citation accuracy
Latency
Token usage
Cost
```

Choose based on measured performance.

---

# 34. Chunking Is a Retrieval Optimization Problem

The wrong question is:

> “What is the correct chunk size?”

The better question is:

> **“What chunking strategy produces the best retrieval and grounded-answer quality for this enterprise corpus under our latency, cost, security, and context constraints?”**

This changes the architecture from:

```text id="k5z8vq"
Choose 500 tokens
```

to:

```text id="g2m6xa"
Corpus
 ↓
Chunking Strategies
 ↓
Retrieval Evaluation
 ↓
Generation Evaluation
 ↓
Cost / Latency Evaluation
 ↓
Select Best Strategy
```

---

# 35. Advanced Pattern — Multi-Level Retrieval

A mature CWD RAG system can combine:

```text id="s9f4ka"
Document
   ↓
Section
   ↓
Parent Chunk
   ↓
Child Chunk
```

Runtime:

```text id="w3x8nb"
Query
 ↓
Child Retrieval
 ↓
Find precise evidence
 ↓
Parent Expansion
 ↓
Add surrounding context
 ↓
LLM
```

This addresses the classic trade-off:

```text id="d7q2mc"
Small chunks
= high precision

Large context
= better understanding
```

Parent-child retrieval attempts to provide both.

---

# 36. Chunking and Grounding

Ultimately, chunking affects grounding.

Suppose the LLM says:

```text id="a8v3mc"
"The maximum operating temperature is 125°C."
```

The grounding system needs to identify supporting evidence.

Good chunk:

```text id="f6q9xb"
Operating Conditions

Maximum operating temperature:
125°C
```

Easy to ground.

Poor chunk:

```text id="z2m7ka"
"...125°C... maintenance... warranty...
installation... pressure..."
```

The evidence is harder to isolate.

Therefore:

```text id="n5x8vc"
Good Chunk
   ↓
Clear Evidence
   ↓
Better Grounding
```

---

# 37. Chunking and Hallucination

Poor chunks can indirectly increase hallucination risk.

```text id="j4k7qa"
Poor Chunking
      ↓
Poor Retrieval
      ↓
Missing Evidence
      ↓
LLM Has Insufficient Context
      ↓
More Opportunity for Unsupported Generation
```

Good chunking:

```text id="r8v3mc"
Good Chunking
      ↓
Relevant Evidence
      ↓
Better Context
      ↓
Better Grounding
```

Chunking therefore participates in the overall grounding chain.

---

# 38. Complete CWD Chunking Architecture

```text id="q8n4za"
                 ENTERPRISE DOCUMENT
                         │
                         ▼
                      PARSER
                         │
                         ▼
               STRUCTURE DETECTION
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
        Document Type           Document Metadata
             │                       │
             ▼                       │
       CHUNKING POLICY               │
             │                       │
       ┌─────┼─────┬──────┐          │
       ▼     ▼     ▼      ▼          │
    Section Semantic Table Parent    │
    Chunk    Chunk    Chunk Child    │
       │     │     │      │          │
       └─────┴─────┴──────┘          │
                   │                 │
                   ▼                 │
             Metadata + ACL ◄────────┘
                   │
                   ▼
               Embeddings
                   │
                   ▼
                 Index
                   │
═══════════════════╪════════════════════════
                   │
                RUNTIME
                   │
                Query
                   │
                   ▼
               Retrieval
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
          Grounding Validation
```

---

# 39. Key Anti-Patterns

### ❌ One chunk size for every document

```text
Everything = 500 tokens
```

Different content requires different boundaries.

### ❌ No overlap when boundaries matter

Can lose relationships across chunks.

### ❌ Excessive overlap

Creates duplication and unnecessary cost.

### ❌ Splitting tables blindly

Destroys row/column relationships.

### ❌ Losing section titles

Reduces semantic context.

### ❌ Losing source metadata

Makes filtering and provenance difficult.

### ❌ Losing ACL information

Creates serious security risk.

### ❌ Making chunks huge because the LLM has a large context window

Large context ≠ useful context.

### ❌ Optimizing chunking without evaluation

Chunking must be evaluated against retrieval and generation quality.

---

# 40. Final Chunking Formula

A useful architect-level model is:

```text id="m3c8vx"
Optimal Chunking
=
Semantic Coherence
+
Retrieval Precision
+
Retrieval Recall
+
Context Sufficiency
+
Metadata Preservation
+
Security Lineage
-
Context Noise
-
Redundancy
-
Token Cost
```

And the downstream relationship is:

```text id="p7x2qa"
Chunk Quality
      ↓
Embedding Quality
      ↓
Retrieval Quality
      ↓
Context Quality
      ↓
Grounding Quality
      ↓
Answer Quality
```

# 41. Final Definition

> **Document chunking in enterprise RAG is the process of dividing processed enterprise content into retrieval-appropriate semantic units while preserving sufficient surrounding context, document structure, metadata, version information, and security lineage. Chunk size and overlap control the balance between retrieval precision, recall, context sufficiency, redundancy, latency, and token cost, while semantic and structure-aware boundaries help ensure that the retrieved chunk represents a coherent piece of enterprise knowledge.**

### Interview-ready answer

> **“Chunking determines the retrieval unit of a RAG system. If chunks are too small, important context is fragmented and retrieval recall can suffer; if they are too large, retrieval becomes less precise and the LLM receives unnecessary context. In enterprise RAG, I prefer document-aware chunking that respects headings, sections, paragraphs, tables, procedures, and other semantic boundaries, with controlled overlap where necessary. Every chunk also retains source, version, classification, and ACL metadata. We then evaluate different chunking strategies using retrieval metrics such as Recall@K, Precision@K, MRR and NDCG, together with groundedness, citation accuracy, latency, and token cost. The goal is not a universally correct chunk size, but the chunking strategy that produces the best relevant and authorized context for the LLM.”**

```text id="q4m8vz"
             DOCUMENT
                 │
                 ▼
        Semantic Structure
                 │
                 ▼
        Document-Aware Chunks
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
     Content   Metadata   ACL
        │        │        │
        └────────┼────────┘
                 ▼
              EMBEDDING
                 │
                 ▼
             RETRIEVAL
                 │
                 ▼
              RE-RANK
                 │
                 ▼
        CONTEXT CONSTRUCTION
                 │
                 ▼
                 LLM
```

> **The best chunk is not the smallest or largest chunk; it is the smallest coherent unit that preserves enough meaning for accurate retrieval and sufficient context for grounded LLM reasoning.**

**Architect mental model:**
**Chunking is the bridge between document structure and retrieval quality.** It determines what the embedding represents, what the retriever finds, what context the LLM receives, and ultimately how reliably the answer can be grounded.
