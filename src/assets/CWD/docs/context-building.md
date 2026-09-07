# Retrieved Chunk Filtering, Ranking, Deduplication, and Context Assembly in Enterprise RAG

## Core Principle

Retrieval is **not finished when Azure AI Search returns the top-K chunks**.

The initial retrieval result is only a **candidate set**. CWD must transform those candidates into a compact, diverse, authorized, relevant, and well-structured context window before sending them to the LLM.

The complete process is:

```text
Query
  │
  ▼
Initial Retrieval
  │
  ▼
Candidate Chunks
  │
  ▼
① Security / Eligibility Filtering
  │
  ▼
② Relevance Ranking
  │
  ▼
③ Deduplication
  │
  ▼
④ Diversity / Coverage Selection
  │
  ▼
⑤ Parent / Context Expansion
  │
  ▼
⑥ Token-Budget Management
  │
  ▼
⑦ Context Assembly
  │
  ▼
⑧ Context Validation
  │
  ▼
LLM
```

A useful conceptual formula is:

```text
High-Quality Context
=
Authorized
+
Relevant
+
Diverse
+
Non-Redundant
+
Sufficiently Contextual
+
Fresh
+
Within Token Budget
+
Traceable
```

---

# 1. Why Top-K Retrieval Is Not Enough

Suppose Azure AI Search returns:

```text
Top 10 chunks
```

They may contain:

```text
Chunk 1 → highly relevant
Chunk 2 → highly relevant
Chunk 3 → duplicate of Chunk 1
Chunk 4 → same document, almost identical
Chunk 5 → unauthorized
Chunk 6 → relevant but outdated
Chunk 7 → useful supporting evidence
Chunk 8 → irrelevant
Chunk 9 → useful context
Chunk 10 → duplicate
```

Sending all ten directly to the LLM is poor RAG design.

Instead:

```text
Top-K Candidates
      │
      ▼
Security Filter
      │
      ▼
Relevant Candidates
      │
      ▼
Deduplication
      │
      ▼
Diversity / Coverage
      │
      ▼
Token Budget
      │
      ▼
Final Context
```

---

# 2. Candidate Retrieval vs Final Context

This distinction is extremely important.

### Candidate retrieval

Answers:

> **Which chunks might be useful?**

### Context assembly

Answers:

> **Which chunks should actually be given to the LLM?**

Therefore:

```text
Retrieval
=
Candidate Generation

Context Assembly
=
Evidence Selection
```

In enterprise RAG:

```text
Initial Search
       ↓
Broad enough for recall
       ↓
Filtering + Ranking + Deduplication
       ↓
Narrow enough for precision
       ↓
LLM Context
```

This is why systems often retrieve more candidates initially than they ultimately place into the prompt.

---

# 3. Step 1 — Security and Eligibility Filtering

The first critical step is determining whether each candidate is **eligible**.

For every chunk:

```text
Is the user authorized?
Is the document active?
Is the document within the business scope?
Is the classification allowed?
Is the document applicable to this task?
```

Example:

```text
Retrieved Candidates
       │
       ├── Chunk A → Authorized ✓
       ├── Chunk B → Authorized ✓
       ├── Chunk C → Unauthorized ✗
       ├── Chunk D → Authorized ✓
       └── Chunk E → Expired ✗
```

Only eligible chunks proceed.

The important rule is:

> **Security filtering is an eligibility constraint, not merely a ranking signal.**

An unauthorized chunk should not receive a lower score—it should be removed.

---

# 4. Business Filtering

After security eligibility, business metadata can further narrow the candidates.

Example task:

```text
Domain = Manufacturing
Plant = Plant-A
Equipment = Etching-01
Document Type = Procedure
```

The search candidate may contain:

```json
{
  "domain": "manufacturing",
  "plant": "Plant-B",
  "equipment": "Etching-01"
}
```

Even though it is semantically similar, it may not be applicable.

So:

```text
Security Eligibility
        +
Business Applicability
```

determines the usable candidate set.

---

# 5. Step 2 — Relevance Ranking

Once candidates are eligible, they need to be ranked.

A simple vector similarity score is often insufficient.

A conceptual ranking model can combine:

```text
Semantic Relevance
+
Lexical Relevance
+
Intent Relevance
+
Domain Relevance
+
Business Applicability
+
Authority
+
Freshness
```

For example:

```text
Final Score =
  0.35 Semantic
+ 0.20 Keyword
+ 0.15 Intent
+ 0.10 Domain
+ 0.10 Authority
+ 0.10 Freshness
```

These numbers are **illustrative**, not universal production weights.

The correct weights should be determined through evaluation.

---

# 6. Semantic Relevance

Vector similarity determines how closely the chunk's meaning matches the query.

For example:

```text
Query:
"Why did the shipment get delayed?"

Chunk A:
"Carrier capacity constraints caused a shipment backlog."

Chunk B:
"Employee travel reimbursement policy."
```

Chunk A should receive substantially higher semantic relevance.

Conceptually:

```text
Query Vector
      │
      ▼
Similarity
      │
      ▼
Candidate Ranking
```

---

# 7. Lexical Relevance

Semantic search is powerful, but exact terms matter.

Consider:

```text
Query:
"Error E104 on Etcher-3000"
```

A chunk containing:

```text
"E104"
"Etcher-3000"
```

may be extremely valuable.

This is where keyword/BM25 retrieval helps.

Therefore:

```text
Dense Retrieval
→ Meaning

Sparse Retrieval
→ Exact Terms

Hybrid Retrieval
→ Meaning + Exact Terms
```

---

# 8. Intent Relevance

The same chunk can have different relevance depending on the user's intent.

Suppose the user asks:

> “What is the current remote-work policy?”

Candidate documents:

```text
A → Official Remote Work Policy
B → Employee FAQ
C → 2022 Remote Work Announcement
D → Employee Discussion
```

For a **policy lookup**, ranking should favor:

```text
A > B > C > D
```

because authority and current validity matter.

For:

> “What changed between the old and new policies?”

Document C becomes important.

Therefore:

```text
Relevance = f(Query, Intent)
```

not just:

```text
Relevance = f(Query)
```

---

# 9. Authority Ranking

Enterprise knowledge often contains multiple versions of similar information.

Example:

```text
Official Policy
Approved Procedure
Engineering Standard
Employee FAQ
Incident Discussion
User-generated Notes
```

These should not necessarily be treated equally.

Metadata can provide:

```json
{
  "document_type": "policy",
  "authority_level": "official",
  "status": "approved"
}
```

The ranking layer can favor authoritative sources when the intent requires them.

---

# 10. Freshness and Temporal Ranking

For queries containing:

```text
latest
current
today
recent
new
effective
```

freshness becomes important.

Example:

```text
Document A
Modified: 2023
Similarity: 0.94

Document B
Modified: 2026
Similarity: 0.91
```

For:

> “What is the current procedure?”

Document B may be preferable if it is approved and effective.

But freshness must be combined with lifecycle metadata.

```text
Freshness alone ≠ Validity
```

A recently modified draft should not automatically outrank an older approved policy.

---

# 11. Step 3 — Deduplication

Enterprise indexes frequently contain duplicate or near-duplicate chunks.

Duplicates can arise from:

```text
Multiple document versions
Repeated headers
Overlapping chunks
Copied policies
Different repositories
Document synchronization
Chunk overlap
Near-identical documents
```

Example:

```text
Chunk A:
"Employees must complete annual security training..."

Chunk B:
"Employees must complete annual security training..."

Chunk C:
"Employees must complete annual security training before..."
```

Sending all three wastes context.

---

# 12. Exact Deduplication

The simplest approach is hashing normalized content.

```python id="c7e8b2"
import hashlib

def content_hash(text):
    normalized = " ".join(text.lower().split())
    return hashlib.sha256(
        normalized.encode("utf-8")
    ).hexdigest()
```

Then:

```text
Chunk
 ↓
Normalize
 ↓
Hash
 ↓
Duplicate?
 ├── Yes → Remove
 └── No  → Keep
```

This works well for exact duplicates.

---

# 13. Near-Duplicate Detection

Exact hashing doesn't catch:

```text
Chunk A:
"The shipment was delayed because of carrier capacity."

Chunk B:
"Carrier capacity caused the shipment delay."
```

They are different strings but almost identical semantically.

For this, use:

```text
Embedding similarity
```

or other similarity techniques.

Conceptually:

```python id="1hj8xa"
if similarity(chunk_a, chunk_b) > DUPLICATE_THRESHOLD:
    remove_lower_priority_chunk()
```

The threshold should be evaluated against the corpus rather than assumed universally.

---

# 14. Don't Remove Useful Supporting Evidence

Deduplication should not become:

```text
"Only one chunk per document."
```

because different chunks from the same document may contain different evidence.

For example:

```text
Document: Manufacturing Procedure

Chunk 1 → Preconditions
Chunk 2 → Procedure
Chunk 3 → Safety Requirements
Chunk 4 → Troubleshooting
```

If the query asks:

> “How do I safely perform this procedure?”

multiple chunks may be necessary.

Therefore:

```text
Duplicate
≠
Same Document
```

---

# 15. Document-Level Diversity

Suppose retrieval returns:

```text
Top 10

Document A → 8 chunks
Document B → 1 chunk
Document C → 1 chunk
```

This may produce a narrow context.

A better selection may be:

```text
Document A → 4 chunks
Document B → 3 chunks
Document C → 2 chunks
Document D → 1 chunk
```

depending on the task.

This improves **evidence diversity**.

---

# 16. Diversity and MMR

A common conceptual approach is **Maximal Marginal Relevance (MMR)**.

The idea is:

> Select chunks that are relevant to the query while avoiding excessive similarity to chunks already selected.

Conceptually:

```text
MMR =
λ × Relevance(chunk, query)
-
(1 - λ) × Similarity(chunk, selected_chunks)
```

Where:

```text
λ → preference for relevance
1-λ → preference for diversity
```

For example:

```text
Candidate A → highly relevant
Candidate B → highly relevant but almost duplicate A
Candidate C → slightly less relevant but provides new evidence
```

MMR may select:

```text
A
C
```

rather than:

```text
A
B
```

---

# 17. Why Diversity Matters

Consider the question:

> “Why did the manufacturing line fail?”

A useful context might contain:

```text
Engineering report
+
Equipment logs
+
Maintenance procedure
+
Incident report
```

rather than four chunks from the same engineering report repeating the same sentence.

Therefore:

```text
High Quality Context
=
Relevance
+
Evidence Coverage
-
Redundancy
```

---

# 18. Step 4 — Parent-Child Context Expansion

Sometimes the retrieved chunk is too small to provide sufficient context.

Example:

```text
Retrieved Child Chunk:

"Step 4: Increase pressure to 2.5 bar."
```

That may be insufficient.

The parent section may contain:

```text
Section:
Pressure Calibration Procedure

Preconditions
Equipment Setup
Steps 1–6
Safety Requirements
Expected Result
```

So CWD can perform:

```text
Retrieve Child
      │
      ▼
Identify Parent
      │
      ▼
Expand Context
      │
      ▼
Select Relevant Parent Content
```

This is the **parent-child retrieval pattern**.

---

# 19. Context Expansion Must Be Controlled

Do not automatically insert the entire document.

Otherwise:

```text
Small relevant chunk
       ↓
Entire 80-page document
       ↓
Huge prompt
```

Instead:

```text
Relevant Child
      +
Relevant Parent Section
      +
Adjacent Context
```

subject to the token budget.

---

# 20. Neighbor Chunk Expansion

Sometimes the best context comes from adjacent chunks.

Suppose:

```text
Chunk 10 → setup
Chunk 11 → actual procedure
Chunk 12 → expected result
```

Retrieval returns:

```text
Chunk 11
```

The context builder may add:

```text
Chunk 10 + Chunk 11 + Chunk 12
```

if they are within the same semantic section and improve completeness.

This should be conditional, not automatic.

---

# 21. Step 5 — Token Budget Management

The LLM has a finite context window.

Suppose the context budget is:

```text
20,000 tokens
```

Other prompt components consume:

```text
System instructions = 2,000
User query = 500
Tool/task context = 1,500
Output reservation = 4,000
```

Remaining retrieval budget:

```text
20,000 - 2,000 - 500 - 1,500 - 4,000
= 12,000 tokens
```

The context builder should select evidence within that budget.

Conceptually:

```text
Total Context Budget
        │
        ├── System Instructions
        ├── User Query
        ├── Task Context
        ├── Retrieved Evidence
        └── Output Budget
```

---

# 22. Context Budget Is Not "Use Everything"

A common mistake is:

> “The model supports a huge context window, so retrieve everything.”

Large context can still introduce:

```text
Noise
Redundancy
Conflicting evidence
Higher cost
Higher latency
Attention dilution
```

The goal is:

> **Maximum useful evidence, not maximum tokens.**

---

# 23. Evidence Ordering

The order of chunks inside the context can matter.

A practical structure is:

```text
Context
 ├── Most relevant evidence
 ├── Supporting evidence
 ├── Additional evidence
 └── Source metadata
```

For example:

```text
[Source 1]
Most relevant procedure

[Source 2]
Supporting engineering report

[Source 3]
Applicable safety requirement
```

The context builder should preserve enough source information for grounding and citations.

---

# 24. Context Structure

A good enterprise context should not simply concatenate raw text.

Instead:

```text
<enterprise_context>

SOURCE 1
Document: Manufacturing Procedure
Section: Pressure Calibration
Version: 4.2
Effective: 2026-06-01

[chunk text]

SOURCE 2
Document: Equipment Manual
Section: Pressure Limits
Version: 8.1

[chunk text]

</enterprise_context>
```

This gives the LLM useful provenance.

---

# 25. Provenance

Every chunk should retain information such as:

```json id="j77w92"
{
  "chunk_id": "CH-1001",
  "document_id": "DOC-2001",
  "document_version": "4.2",
  "title": "Manufacturing Procedure",
  "section": "Pressure Calibration",
  "source": "SharePoint",
  "page": 17,
  "effective_date": "2026-06-01"
}
```

This enables:

```text
Answer
 ↓
Evidence
 ↓
Document
 ↓
Section
 ↓
Source
```

which is important for enterprise trust and auditability.

---

# 26. Conflicting Evidence

Another important context-assembly problem is conflicting documents.

Example:

```text
Document A
Procedure v3
Pressure = 2.0 bar

Document B
Procedure v4
Pressure = 2.5 bar
```

Simply giving both to the LLM may create ambiguity.

The retrieval layer should use metadata such as:

```text
Version
Status
Effective Date
Authority
Owner
```

to identify the authoritative document.

Potential strategy:

```text
Current Approved Version
       ↓
Preferred

Older Version
       ↓
Supporting historical evidence only
```

If the question specifically asks for historical comparison, both versions become relevant.

---

# 27. Contradiction Detection

For high-risk domains, context processing may include:

```text
Evidence A
      +
Evidence B
      ↓
Conflict Detection
      │
      ├── No conflict → Continue
      │
      └── Conflict → Resolve / Flag / Human Review
```

For example:

```text
Current approved policy
vs
outdated procedure
```

The system should not blindly synthesize contradictory evidence.

---

# 28. Context Quality Scoring

You can conceptually score the final context:

```text
Context Quality
=
Relevance
+
Coverage
+
Authority
+
Freshness
+
Diversity
+
Grounding Potential
-
Redundancy
-
Noise
```

Again, this is a design model rather than a universal mathematical scoring function.

---

# 29. Complete CWD Retrieval Pipeline

```text id="7w2z1j"
                       USER QUERY
                           │
                           ▼
                  Intent / Domain / Context
                           │
                           ▼
                   Query Transformation
                           │
                           ▼
                Azure AI Search Retrieval
                           │
                           ▼
                 Initial Candidate Set
                           │
                           ▼
              ┌─────────────────────────┐
              │ Security / ACL Filter   │
              └────────────┬────────────┘
                           │
                           ▼
              Business Metadata Filter
                           │
                           ▼
                   Relevance Ranking
                           │
                           ▼
                 Authority / Freshness
                           │
                           ▼
                    Deduplication
                           │
                           ▼
                  Diversity Selection
                           │
                           ▼
                Parent / Neighbor Expansion
                           │
                           ▼
                  Token Budget Control
                           │
                           ▼
                  Context Assembly
                           │
                           ▼
                 Context Validation
                           │
                           ▼
                          LLM
                           │
                           ▼
                 Grounded Response
```

---

# 30. How This Fits with Azure AI Search

Azure AI Search can perform much of the **initial retrieval and ranking**, including:

```text
Keyword Search
Vector Search
Hybrid Search
Filtering
Semantic Ranking
```

But CWD may still need application-level processing for:

```text
Authorization validation
Intent-specific selection
Cross-source deduplication
MMR/diversity
Parent-child expansion
Token budgeting
Context formatting
Conflict handling
Provenance
Final context validation
```

Therefore:

```text
Azure AI Search
=
Search + Retrieval + Ranking

CWD RAG Worker
=
Retrieval Strategy + Security + Selection + Context Assembly

LLM
=
Reasoning + Generation
```

---

# 31. LangGraph Orchestration

LangGraph can represent this as a stateful workflow:

```text id="j3p7aj"
START
  │
  ▼
Retrieve Candidates
  │
  ▼
Apply ACL
  │
  ▼
Business Filter
  │
  ▼
Rank
  │
  ▼
Deduplicate
  │
  ▼
Check Coverage
  │
  ├── Insufficient ──→ Query Rewrite → Retrieve
  │
  └── Sufficient
           │
           ▼
      Context Expand
           │
           ▼
      Token Budget
           │
           ▼
      Assemble Context
           │
           ▼
      Validate Context
           │
           ▼
           LLM
```

This is a good example of where **LangGraph controls the retrieval workflow**, while Azure AI Search performs search operations.

---

# 32. Example Context Builder

A simplified conceptual implementation:

```python id="w5n3q8"
def build_context(
    query,
    candidates,
    user,
    token_budget
):

    # 1. Security filtering
    authorized = [
        chunk
        for chunk in candidates
        if policy.authorized(
            user=user,
            document=chunk.document
        )
    ]

    # 2. Business applicability
    applicable = [
        chunk
        for chunk in authorized
        if is_applicable(chunk, query)
    ]

    # 3. Rank
    ranked = rank_chunks(
        query=query,
        chunks=applicable
    )

    # 4. Remove duplicates
    unique = deduplicate(
        ranked
    )

    # 5. Select diverse evidence
    diverse = select_diverse_chunks(
        query=query,
        chunks=unique
    )

    # 6. Expand context where appropriate
    expanded = expand_context(
        diverse
    )

    # 7. Fit within token budget
    selected = fit_to_token_budget(
        expanded,
        token_budget
    )

    # 8. Assemble structured context
    context = assemble_context(
        selected
    )

    # 9. Final validation
    validate_context(
        context=context,
        user=user
    )

    return context
```

This is intentionally conceptual; production implementations should make authorization and data-classification decisions through trusted policy services rather than embedding all security logic in application code.

---

# 33. Example Chunk Object

A useful internal representation might look like:

```json id="j15hqa"
{
  "chunk_id": "CH-1001",
  "document_id": "DOC-5001",
  "text": "The inspection procedure requires...",
  "score": 0.93,
  "semantic_score": 0.91,
  "keyword_score": 0.88,
  "domain": "quality",
  "document_type": "procedure",
  "authority": "official",
  "status": "approved",
  "version": "4.2",
  "effective_date": "2026-06-01",
  "classification": "internal",
  "allowed_groups": [
    "quality-engineering"
  ],
  "section": "Inspection Procedure",
  "parent_chunk_id": "SEC-100",
  "source": "SharePoint"
}
```

This gives the context builder enough information to make intelligent selection decisions.

---

# 34. Filtering → Ranking → Deduplication → Assembly

The four stages can be summarized as:

### Filtering

```text
"Can this chunk be used?"
```

### Ranking

```text
"How useful is this chunk?"
```

### Deduplication

```text
"Does this chunk add new information?"
```

### Assembly

```text
"How should the selected evidence be presented to the LLM?"
```

This distinction is extremely useful in architecture discussions.

---

# 35. A More Complete Selection Algorithm

Conceptually:

```python id="qgq0f2"
def select_context(query, candidates, user, budget):

    # Eligibility
    candidates = [
        c for c in candidates
        if is_authorized(user, c)
        and is_business_applicable(c)
        and is_valid_version(c)
    ]

    # Ranking
    candidates = rank(
        candidates,
        query=query
    )

    # Deduplication
    candidates = remove_exact_duplicates(
        candidates
    )

    candidates = remove_near_duplicates(
        candidates
    )

    # Diversity
    candidates = mmr_select(
        query=query,
        candidates=candidates
    )

    # Context expansion
    candidates = expand_parent_context(
        candidates
    )

    # Token budget
    selected = token_budget_select(
        candidates,
        budget=budget
    )

    # Provenance-aware assembly
    return assemble(
        selected
    )
```

---

# 36. Retrieval Quality vs Context Quality

These are different metrics.

You can have:

```text
Excellent retrieval
+
Poor context assembly
=
Poor final answer
```

For example:

```text
Top 20 relevant chunks
        ↓
15 duplicates
        ↓
3 irrelevant
        ↓
2 useful
        ↓
LLM
```

Likewise:

```text
Poor retrieval
+
Excellent context assembly
=
Still poor answer
```

Therefore:

```text
RAG Quality
=
Retrieval Quality
+
Context Selection Quality
+
Generation Quality
```

More formally as a conceptual chain:

```text
Retrieval
   ↓
Filtering
   ↓
Ranking
   ↓
Deduplication
   ↓
Context Assembly
   ↓
Generation
```

A failure at any stage can degrade the final response.

---

# 37. Evaluation Metrics

You should evaluate each stage independently.

### Retrieval

```text
Recall@K
Precision@K
MRR
NDCG
```

### Context

```text
Context Precision
Context Recall
Context Relevance
Context Coverage
Redundancy
Token Efficiency
```

### Generation

```text
Faithfulness
Groundedness
Answer Relevance
Citation Accuracy
Completeness
Hallucination Rate
```

### System

```text
Latency
Token Usage
Cost
Search Failures
Authorization Failures
```

This gives a much clearer understanding of where RAG quality problems originate.

---

# 38. Observability

CWD should capture retrieval decisions using the existing correlation hierarchy:

```text
correlation_id
workflow_id
task_id
agent_id
worker_id
```

Additional retrieval telemetry:

```json id="6p8gkl"
{
  "correlation_id": "CORR-7890",
  "query": "What caused the shipment delay?",
  "intent": "root_cause_analysis",
  "retrieval_mode": "hybrid",
  "initial_candidates": 50,
  "authorized_candidates": 37,
  "ranked_candidates": 37,
  "duplicates_removed": 8,
  "final_chunks": 7,
  "token_count": 5200,
  "reranker": "semantic-ranker-v2"
}
```

This makes the retrieval pipeline explainable and debuggable.

---

# 39. Security Must Survive Every Stage

The security principle is:

```text
Retrieved
   ↓
Filtered
   ↓
Ranked
   ↓
Deduplicated
   ↓
Expanded
   ↓
Assembled
   ↓
LLM
```

At every stage:

```text
Authorization lineage must be preserved.
```

Especially during parent/neighbor expansion.

For example:

```text
Authorized child chunk
        ↓
Parent document
        ↓
Does user have access to parent content?
```

Do not assume that authorization for one chunk automatically authorizes every related piece of content unless the enterprise ACL model explicitly establishes that relationship.

---

# 40. Important Anti-Patterns

### ❌ Send raw Top-K directly to LLM

```text
Search → LLM
```

### ❌ Security filtering after context creation

```text
Search → Context → LLM → Security
```

### ❌ Keep duplicates

```text
10 chunks
→ 7 copies of same content
```

### ❌ Maximize token usage

```text
"More context must be better."
```

### ❌ Ignore authority

```text
Official policy
vs
random discussion
```

treated equally.

### ❌ Ignore document version

Old procedure and current procedure both treated equally.

### ❌ Expand entire documents

```text
Relevant chunk
→ 100-page document
```

### ❌ Lose provenance

Returning text without:

```text
document_id
section
version
source
```

### ❌ Mix incompatible evidence

Current and obsolete policies presented without distinction.

---

# 41. The Enterprise Context Assembly Formula

A strong conceptual model is:

```text
Final Context
=
Authorized Candidates
∩
Relevant Candidates
∩
Business-Applicable Candidates
∩
Valid/Current Evidence
-
Duplicates
-
Noise
+
Diverse Supporting Evidence
+
Required Context
```

subject to:

```text
Token Budget
+
Security Constraints
+
Task Requirements
```

---

# 42. Complete CWD Architecture

```text id="a6m7jz"
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
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
        Intent / Domain            Entitlements
              │                         │
              └────────────┬────────────┘
                           ▼
                    Retrieval Planner
                           │
                           ▼
                   Azure AI Search
                  ┌────────┼─────────┐
                  ▼        ▼         ▼
               Keyword   Vector    Hybrid
                  └────────┼─────────┘
                           ▼
                    Candidate Chunks
                           │
                           ▼
                    ACL / Security
                           │
                           ▼
                  Business Filtering
                           │
                           ▼
                       Ranking
                           │
                           ▼
                    Deduplication
                           │
                           ▼
                     Diversity
                           │
                           ▼
                 Parent/Neighbor Context
                           │
                           ▼
                   Token Management
                           │
                           ▼
                  Context Assembly
                           │
                           ▼
                  Context Validation
                           │
                           ▼
                  Prompt Registry
                           │
                           ▼
                         LLM
                           │
                           ▼
                 Grounded Response
```

---

# 43. Interview-Ready Answer

> **“In our CWD RAG architecture, the initial search results are treated as candidate evidence rather than being sent directly to the LLM. The RAG Worker first applies entitlement and ACL filtering, followed by business metadata and applicability filters. The remaining candidates are ranked using semantic, lexical, intent, domain, authority, freshness, and other evaluated signals. We then remove exact and near-duplicate chunks and use diversity techniques such as MMR when appropriate so the context contains complementary evidence rather than repeated information. For small chunks, we can expand to relevant parent or neighboring sections while preserving authorization. Finally, we select chunks within a controlled token budget, assemble them with provenance such as document ID, section, version, and source, and validate the final context before sending it to the LLM. LangGraph orchestrates these steps, Azure AI Search performs retrieval and ranking, Policy/IAM handles authorization, and the LLM reasons only over the resulting authorized evidence.”**

---

# Final Definition

**Retrieved-chunk processing in enterprise RAG is the controlled transformation of an initial search candidate set into a compact, high-quality evidence context by applying security and business eligibility filters, relevance and authority ranking, duplicate and near-duplicate removal, diversity and coverage selection, contextual expansion, token-budget management, provenance preservation, and final validation before the evidence is supplied to the LLM.**

### Final Mental Model

```text id="w6by7f"
             RETRIEVE
                 │
                 ▼
          ┌──────────────┐
          │   FILTER     │
          │ Can use it?  │
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │    RANK      │
          │ Is it useful?│
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │  DEDUPLICATE │
          │ Is it unique?│
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │   DIVERSIFY  │
          │ Adds coverage│
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │   ASSEMBLE   │
          │ Fits context?│
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │   VALIDATE   │
          │ Safe + trace │
          └──────┬───────┘
                 │
                 ▼
                LLM
```

> **Retrieve broadly for recall, filter strictly for authorization and applicability, rank for relevance and authority, deduplicate for efficiency, diversify for evidence coverage, assemble within the token budget, preserve provenance, and give the LLM only the final validated context.**
