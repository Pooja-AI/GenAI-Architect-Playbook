## What is your retrieval pipeline?

In your **CWD enterprise RAG**, the retrieval pipeline takes the user's question, applies security and metadata constraints, finds relevant enterprise information, reranks it, and sends only the best authorized chunks to the LLM.

### End-to-end CWD retrieval pipeline

```text
User Query
    ↓
Coordinator
    ↓
Worker
    ↓
Query Understanding
    ↓
Query Embedding
    ↓
ACL + Metadata Filters
    ↓
┌───────────────────────┐
│ Hybrid Retrieval      │
│                       │
│ BM25  +  Vector       │
└───────────────────────┘
    ↓
Candidate Chunks
    ↓
Semantic Reranking
    ↓
Top-K Relevant Chunks
    ↓
Context Validation / Deduplication
    ↓
Context Builder
    ↓
LLM
    ↓
Grounded Response
```

### Step-by-step

**1. Query understanding**

The Worker identifies important information from the request.

Example:

> "Why did customer C123 have an A100 overheating issue?"

```text
Intent = Failure Analysis
customer_id = C123
product = A100
issue = overheating
```

**2. Query embedding**

The query is converted into a vector using the embedding model.

```text
"Why is A100 overheating?"
        ↓
Embedding vector
```

**3. Apply security and metadata filters**

Before retrieving content, we apply:

```text
User ACL
Department
Product
Region
Document type
Date
```

This prevents unauthorized or irrelevant documents from being retrieved.

**4. Hybrid retrieval**

We run:

```text
                Query
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
      BM25                Vector
   exact terms          semantic meaning
        ↓                   ↓
        └─────────┬─────────┘
                  ↓
             Combined
```

BM25 is useful for things like:

```text
C123
INC45821
E102
A100
```

Vector search is useful for semantic relationships such as:

```text
"device getting too hot"
        ↔
"thermal management failure"
```

**5. Reranking**

The initial retrieval may return, for example, 50 chunks.

A semantic ranker then reorders them based on relevance.

```text
50 candidates
     ↓
Semantic Ranker
     ↓
Top 10
```

In CWD, Azure AI Search's semantic ranking can be used here.

**6. Context preparation**

Before sending chunks to the LLM, we:

* remove duplicates
* verify metadata/ACL
* control total token size
* preserve source information
* select the highest-value chunks

```text
Top 10
 ↓
Deduplicate
 ↓
Token limit check
 ↓
Final context
```

**7. LLM generation**

The LLM receives:

```text
System Instructions
+
User Question
+
Authorized Retrieved Context
```

and generates the grounded response.

---

## Example

User asks:

> **"Give me a briefing for customer C123, including recent incidents."**

The Worker might retrieve:

```text
Salesforce → customer information
ServiceNow → incident information
SharePoint → relevant product documentation
```

The final context could be:

```text
Customer Profile
Incident INC1001
Incident INC1005
A100 troubleshooting document
```

The LLM uses those sources to generate the customer briefing.

---

### 🎯 Strong interview answer

> **“Our CWD retrieval pipeline starts with query understanding and embedding generation. We then apply ACL and metadata filters so only authorized data is searchable. We use hybrid retrieval combining BM25 and vector search, followed by semantic reranking. The top relevant chunks are deduplicated and checked against token limits before being added to the LLM context. This gives us secure, relevant, and grounded responses.”**

### Easy memory trick

**Understand → Embed → Filter → Retrieve → Rerank → Prepare → Generate**

Or simply:

> **Filter first, retrieve broadly, rerank precisely, generate from authorized context.**
