# How would you implement BM25 search in CWD?

I would use **BM25 in OpenSearch** for keyword-based retrieval. It is especially useful for **exact names, customer IDs, ticket numbers, product codes, and technical terms**.

```text id="bm2501"
User Query
    ↓
OpenSearch
    ↓
BM25 keyword search
    ↓
Matching documents/chunks
    ↓
Score + Rank
    ↓
Top-K results
```

## 1. Store text in an OpenSearch text field

During ingestion:

```json id="bm2502"
{
  "chunk_id": "C123",
  "document_id": "DOC45",
  "text": "ServiceNow incident INC12345 was resolved...",
  "tenant_id": "ON",
  "active": true
}
```

The `text` field is indexed for full-text search.

---

## 2. Send the user's query to OpenSearch

Example:

```text id="bm2503"
User:
"INC12345 resolution"
```

OpenSearch analyzes the query and searches the indexed text.

A simplified query looks like:

```json id="bm2504"
{
  "query": {
    "match": {
      "text": "INC12345 resolution"
    }
  }
}
```

The `match` query uses the field's text analysis and BM25-based scoring.

---

## 3. BM25 calculates relevance

BM25 considers factors such as:

* **Term Frequency (TF)** — how often the term appears
* **Inverse Document Frequency (IDF)** — how rare the term is across documents
* **Document length** — prevents long documents from automatically winning

Conceptually:

```text id="bm2505"
More relevant term
       +
Rare term
       +
Good document length
       ↓
Higher BM25 score
```

You don't normally calculate the BM25 formula yourself; OpenSearch handles the scoring.

---

## 4. Apply CWD security filters

I would combine BM25 with authorization filters:

```text id="bm2506"
BM25 Search
     ↓
tenant_id filter
     ↓
ACL / entitlement filter
     ↓
active = true
     ↓
Authorized results
```

This is important because **relevance doesn't equal authorization**.

---

## 5. Return Top-K candidates

For example:

```text id="bm2507"
C123 → 12.8
C875 → 9.4
C456 → 7.2
...
```

I might retrieve 20–50 candidates and then pass them to a reranker.

```text id="bm2508"
BM25
 ↓
Top 20–50
 ↓
Reranker
 ↓
Top 5–10
 ↓
Bedrock
```

The actual K values should be determined through retrieval evaluation.

---

# Why BM25 is useful in CWD

Suppose the user asks:

> **"Find incident INC12345."**

Vector search might find semantically related incidents.

BM25 is very good at finding the exact:

```text id="bm2509"
INC12345
```

Similarly:

```text
Customer ID: CUST-84721
Product: XYZ-9000
Ticket: INC12345
Part Number: ABC-456
```

These exact identifiers are often where keyword search is especially valuable.

---

# BM25 vs Vector Search

| BM25                 | Vector                           |
| -------------------- | -------------------------------- |
| Keyword-based        | Semantic                         |
| Exact terms          | Meaning                          |
| IDs/codes/names      | Natural-language concepts        |
| Lexical matching     | Similarity matching              |
| Great for `INC12345` | Great for "shipment was delayed" |

That's why CWD uses **hybrid search**:

```text id="bm2510"
          Query
            ↓
     ┌──────┴──────┐
     ↓             ↓
   BM25          Vector
     ↓             ↓
     └──────┬──────┘
            ↓
           RRF
            ↓
         Reranker
```

### 🎯 Strong interview answer

> **“I would implement BM25 search using OpenSearch's full-text indexing. During ingestion, I store the document chunks in a text field and index them. At query time, the user's query is analyzed and matched against the text using BM25 scoring. OpenSearch ranks the chunks based on term frequency, inverse document frequency, and document length. I would apply tenant and ACL filters as part of the query, retrieve a candidate set, and then optionally rerank those candidates. BM25 is especially valuable in CWD for exact identifiers such as customer IDs, incident numbers, product codes, and technical terms.”**

### Easy memory trick

**Index → Query → BM25 Score → Filter → Top-K → Rerank**

### Key distinction

**BM25 asks:** *“Which documents contain the important words?”*

**Vector search asks:** *“Which documents have similar meaning?”*
