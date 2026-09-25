# How would you implement hybrid search in CWD?

I would combine **keyword search (BM25)** and **vector search** so CWD can handle both **exact matches** and **semantic matches**.

```text
                    User Query
                        ↓
              ┌─────────┴─────────┐
              ↓                   ↓
        BM25 Keyword         Vector Search
        (exact terms)       (semantic meaning)
              ↓                   ↓
              └─────────┬─────────┘
                        ↓
                  Rank Fusion
                        ↓
                    Reranker
                        ↓
                   Top-K Chunks
                        ↓
                     Bedrock
```

## 1. Run BM25 search

BM25 is good when the user provides exact terms.

Example:

```text
User:
"Find ticket INC12345"
```

BM25 can match:

```text
INC12345
```

very effectively.

---

## 2. Run vector search

Convert the query into an embedding:

```text
User Query
    ↓
Embedding Model
    ↓
Query Vector
    ↓
OpenSearch Vector Search
```

This is useful when the wording is different but the meaning is similar.

Example:

```text
Query:
"Why was the customer's shipment late?"

Document:
"Order fulfillment was delayed because of
manufacturing capacity constraints."
```

Keyword matching may be weak, but vector search can identify the semantic relationship.

---

## 3. Combine the results

Suppose we get:

```text
BM25:
A → rank 1
B → rank 2
C → rank 3

Vector:
C → rank 1
A → rank 2
D → rank 3
```

We combine the rankings using a **rank-fusion approach**, such as **Reciprocal Rank Fusion (RRF)**.

Conceptually:

```text
BM25 results
      +
Vector results
      ↓
    RRF
      ↓
Combined candidates
```

RRF combines rankings rather than directly assuming that the BM25 and vector scores are on the same scale.

---

## 4. Rerank the candidates

After fusion, I would take a manageable candidate set and apply a semantic reranker.

```text
BM25 + Vector
      ↓
RRF
      ↓
Top 20–50 candidates
      ↓
Reranker
      ↓
Top 5–10 chunks
```

The exact numbers should be tuned through evaluation rather than hardcoded universally.

---

## 5. Apply authorization filters

For CWD, security filtering is critical.

```text
Hybrid Search
     ↓
Tenant Filter
     ↓
ACL / Entitlement Filter
     ↓
Active Version Filter
     ↓
Authorized Results
```

The LLM should only receive content the user is authorized to access.

---

## 6. Send the final context to Bedrock

```text
Top authorized chunks
        ↓
Prompt + Context
        ↓
      Bedrock
        ↓
Grounded response
```

---

# Example

User asks:

> **"What is the status of ticket INC12345?"**

### BM25 finds:

```text
INC12345
ServiceNow incident INC12345
```

### Vector search finds:

```text
Documents discussing the same incident
and related troubleshooting information
```

### Hybrid:

```text
BM25
  +
Vector
  ↓
RRF
  ↓
Reranker
  ↓
Authorized Top-K
  ↓
Bedrock
```

For **current ticket status**, however, I would use **MCP → ServiceNow** rather than relying only on the indexed document, because ServiceNow is the live system of record.

---

# 🎯 Strong interview answer

> **“I would implement hybrid search by combining BM25 keyword search with vector similarity search. BM25 handles exact terms such as ticket IDs, customer IDs, and product codes, while vector search handles semantic variations in natural language. I would combine the two result sets using a rank-fusion method such as RRF, then rerank the candidate set and apply tenant and ACL filters before sending the final chunks to Bedrock. For live transactional information such as current ServiceNow ticket status, I would use MCP to query the system of record rather than depending on potentially stale indexed content.”**

### Easy memory trick

**BM25 + Vector → RRF → Rerank → ACL → Bedrock**

### Key distinction

**BM25 = exact/keyword matching**
**Vector = semantic matching**
**RRF = combines rankings**
**Reranker = improves final ordering**
**MCP = gets live enterprise data**
