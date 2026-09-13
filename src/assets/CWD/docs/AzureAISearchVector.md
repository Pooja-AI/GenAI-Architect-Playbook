# Azure AI Search — Vector & Hybrid Search

For your **CWD Agentic RAG**, think of Azure AI Search as the **retrieval engine that finds the right enterprise evidence before the LLM reasons over it**.

### 1. Big picture

```text
User Question
      ↓
Coordinator
      ↓
Delegator
      ↓
RAG / Search Worker
      ↓
Azure AI Search
      ↓
Retrieval
 ┌────┼───────────┐
 ↓    ↓           ↓
Keyword Vector   Filters
 ↓    ↓           ↓
 └────┼───────────┘
      ↓
Hybrid Results
      ↓
Semantic Ranking
      ↓
Top-K Relevant + Authorized Chunks
      ↓
LLM
      ↓
Grounded Answer
```

The important idea:

> **Search finds the evidence; the LLM reasons over the evidence.**

---

# 2. Keyword Search

Keyword search looks for **exact or lexical matches**.

Example:

> "Why did equipment EQ-102 generate alarm E104?"

Keyword search is very good at finding:

* `EQ-102`
* `E104`
* lot numbers
* product IDs
* ticket numbers
* error codes
* technical terms
* exact part numbers

Example:

```text
Query:
EQ-102 E104 alarm

Search:
"EQ-102 alarm history"
"Equipment EQ-102 E104"
```

### Strength

Excellent for **exact identifiers**.

### Weakness

It may fail when the user uses different wording.

For example:

> "Why did the machine overheat?"

Document says:

> "Thermal excursion detected."

Keyword search may not recognize that **overheat ≈ thermal excursion**.

---

# 3. Vector Search

Vector search performs **semantic similarity search**.

Text is converted into embeddings:

```text
"Why did the machine overheat?"
             ↓
        Embedding Model
             ↓
[0.12, -0.45, 0.73, ...]
```

Documents/chunks are also embedded.

Azure AI Search compares the vectors and finds semantically similar content.

Example:

```text
User:
"Why did the machine overheat?"

Retrieved:
"Equipment experienced a thermal excursion
during the wafer processing cycle."
```

Even though the words aren't identical, the meanings are similar.

### Strength

Good for:

* natural language questions
* conceptual searches
* paraphrases
* similar historical incidents
* semantic relationships

### Weakness

Vector search can be weaker for exact identifiers.

For example:

```text
EQ-102
LOT-78451
E104
PN-7A23
```

For these, keyword search is often valuable.

---

# 4. Hybrid Search

This is **very important for enterprise RAG**.

Hybrid search combines:

```text
Keyword Search
       +
Vector Search
       ↓
Combined Results
```

For example:

User asks:

> "Why did EQ-102 have the E104 thermal alarm?"

Keyword search finds:

```text
EQ-102
E104
thermal alarm
```

Vector search finds:

```text
equipment overheating
thermal excursion
temperature anomaly
cooling failure
```

Then Azure AI Search combines the results.

### Why hybrid is powerful

Enterprise questions often contain **both exact identifiers and semantic meaning**.

For your CWD:

> **Keyword = exact business terminology**

> **Vector = meaning/context**

> **Hybrid = both**

---

# 5. Semantic Ranking

Semantic ranking is another stage that improves the ordering of retrieved candidates.

Think:

```text
Search
  ↓
Candidate Documents
  ↓
Semantic Ranker
  ↓
Better ordered results
```

Suppose search retrieves 50 chunks.

The semantic ranker determines which candidates are **most relevant to the meaning of the query**.

Example:

```text
Query:
"Why did EQ-102 overheat?"

Candidate 1 → EQ-102 thermal failure report
Candidate 2 → EQ-102 maintenance history
Candidate 3 → EQ-101 temperature report
Candidate 4 → generic equipment manual
Candidate 5 → unrelated production report
```

Semantic ranking helps put the most relevant evidence higher.

### Important distinction

**Vector search is not the same as semantic ranking.**

```text
Vector Search
→ finds semantically similar candidates

Semantic Ranking
→ improves the ordering/relevance of candidates
```

---

# 6. Filtered Search

This is extremely important for **enterprise security**.

Suppose your search index contains:

```text
Quality documents
Manufacturing documents
HR documents
Finance documents
Engineering documents
```

The user asks:

> "Show me historical failure analysis for SiC MOSFET."

You don't want to search everything blindly.

You can apply filters such as:

```text
product = "SiC MOSFET"
department = "Quality"
fab = "Fab-X"
document_type = "Failure Analysis"
```

Then search only the relevant subset.

---

# 7. ACL / Security Filtering

This is even more important.

Imagine:

```text
User
 ↓
Entra ID
 ↓
User Groups / Entitlements
 ↓
Search Filter
 ↓
Authorized Documents Only
 ↓
LLM
```

Suppose the user belongs to:

```text
QUALITY_ENGINEERING
```

A document has:

```text
access_groups:
["QUALITY_ENGINEERING", "FA_ENGINEERING"]
```

The user can retrieve it.

But if another document has:

```text
access_groups:
["HR"]
```

it should never reach the LLM.

### Critical interview statement

> **The LLM should not be the security boundary. Authorization must happen before enterprise data enters the model context.**

Bad architecture:

```text
Search everything
      ↓
LLM
      ↓
"Don't show confidential information"
```

Good architecture:

```text
User Identity
      ↓
Entitlement Check
      ↓
ACL Filter
      ↓
Authorized Search
      ↓
LLM
```

---

# 8. Multi-Stage Retrieval

For enterprise Agentic RAG, you generally don't want:

```text
Question → Search → LLM
```

A stronger architecture is:

```text
User Question
      ↓
Query Understanding
      ↓
Metadata / ACL Filtering
      ↓
Keyword Search
      +
Vector Search
      ↓
Candidate Fusion
      ↓
Semantic Ranking
      ↓
Top-K
      ↓
Context Validation
      ↓
LLM
```

This is **multi-stage retrieval**.

---

# 9. CWD Example

User asks:

> **"Have we seen this type of SiC MOSFET defect before in Fab-X, and what was the root cause?"**

### Step 1 — Coordinator

Understands:

```text
Intent = Historical Failure Analysis
Product = SiC MOSFET
Fab = Fab-X
```

Routes to:

```text
Quality / Failure Analysis Delegator
```

---

### Step 2 — Delegator

Selects:

```text
Historical RAG Worker
+
Image Analysis Worker
+
RCA Worker
```

---

### Step 3 — Query construction

RAG Worker creates search query:

```text
"SiC MOSFET defect root cause historical failure"
```

Metadata:

```text
product = SiC MOSFET
fab = Fab-X
document_type = Failure Analysis
```

Security:

```text
user_entitlements = QUALITY_ENGINEERING
```

---

### Step 4 — Hybrid retrieval

Azure AI Search performs:

```text
Keyword Search
        +
Vector Search
        ↓
Candidate Results
```

Keyword search can identify:

```text
SiC MOSFET
Fab-X
failure report IDs
lot numbers
```

Vector search can identify:

```text
similar defect patterns
similar failure mechanisms
similar RCA descriptions
```

---

### Step 5 — Filtering

Apply:

```text
Product = SiC MOSFET
Fab = Fab-X
Document Type = Failure Analysis
ACL = User's authorized groups
```

---

### Step 6 — Semantic ranking

The system ranks the remaining candidates based on relevance to:

> "Have we seen this defect before and what was the root cause?"

---

### Step 7 — Top-K

Suppose 100 candidates were initially found.

After ranking:

```text
Top 5 relevant chunks
```

are selected.

Example:

```text
1. FA-2026-104
2. FA-2025-872
3. FA-2025-641
4. RCA-2026-031
5. QualityReport-2026-112
```

---

### Step 8 — LLM reasoning

Only those authorized chunks are sent to the LLM.

The LLM produces:

```text
Similar defects:
3 historical cases

Common pattern:
Gate oxide damage

Probable root cause:
Process temperature excursion

Evidence:
FA-2026-104
FA-2025-872

Confidence:
High
```

The answer is grounded in retrieved evidence rather than model memory.

---

# 10. The complete retrieval architecture

```text
                  User Question
                       ↓
                  Coordinator
                       ↓
                    Delegator
                       ↓
                  RAG Worker
                       ↓
              Query Understanding
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
        Metadata            ACL/Entitlement
         Filters                Filter
             └─────────┬─────────┘
                       ↓
                Azure AI Search
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
      Keyword Search       Vector Search
             ↓                   ↓
             └─────────┬─────────┘
                       ↓
                  Hybrid Fusion
                       ↓
                Semantic Ranking
                       ↓
                    Top-K
                       ↓
              Context Validation
                       ↓
                     LLM
                       ↓
              Grounded Response
```

---

# 11. When to use each retrieval method

| Method                    | Best for                                |
| ------------------------- | --------------------------------------- |
| **Keyword**               | Exact IDs, error codes, product numbers |
| **Vector**                | Meaning, concepts, paraphrases          |
| **Hybrid**                | Enterprise RAG / mixed queries          |
| **Semantic ranking**      | Improving candidate ordering            |
| **Metadata filtering**    | Business/domain narrowing               |
| **ACL filtering**         | Security/authorization                  |
| **Multi-stage retrieval** | High-quality production RAG             |

For your CWD, **hybrid + filtering + semantic ranking + multi-stage retrieval** is the strongest general pattern.

---

# 12. Interview answer

> **"For enterprise Agentic RAG, I would use Azure AI Search as the retrieval layer. I would combine keyword search for exact identifiers such as equipment IDs, lot numbers and error codes with vector search for semantic similarity. I would use hybrid retrieval to combine both signals, then apply metadata and entitlement-based ACL filters so that the search operates only on authorized enterprise data. For the retrieved candidates, I would use semantic ranking to improve relevance and select a small Top-K context set. That context is then passed to the LLM for grounded reasoning. In a CWD scenario, the Coordinator routes the request to the appropriate Delegator, which invokes a RAG Worker. The RAG Worker performs this multi-stage retrieval and returns evidence to the agent, allowing the final answer to be grounded, traceable and secure."**

### Remember this sequence

**Keyword → Vector → Hybrid → Filter → Rank → Top-K → LLM**

And the most important security principle:

> **Authenticate → Authorize → Retrieve → Reason.**
