## What can be cached in CWD?

In CWD, I cache **frequently accessed, relatively stable, read-heavy data** to reduce latency, token consumption, and repeated calls to Salesforce, ServiceNow, RAG, or LLMs.

### 1. Enterprise data — cache carefully

Examples:

```text
Customer profile
Account metadata
Product metadata
Organization information
Reference/master data
```

Example:

```text
Customer Worker
     ↓
Redis
     ↓ HIT → return customer profile
     ↓ MISS
MCP → Salesforce
     ↓
Redis → store
```

Use a short/appropriate TTL depending on how frequently the source changes.

---

### 2. RAG retrieval results

You can cache:

```text
Query → retrieved document/chunk IDs
```

For example:

```text
User Query
   ↓
Redis
   ↓ HIT → cached retrieval
   ↓ MISS
Azure AI Search
```

The cache key should consider **tenant, authorization/entitlements, filters, and index/version**.

---

### 3. LLM responses — selectively

Some LLM responses can be cached when the request is sufficiently deterministic.

For example:

```text
Same task
+ same model
+ same prompt version
+ same relevant context
        ↓
Cached response
```

I would **not blindly cache every LLM response**, especially when the answer depends on real-time enterprise data or user-specific permissions.

---

### 4. Embeddings

For repeated identical text, embeddings can be cached:

```text
Text
 ↓
Embedding cache
 ↓ HIT → reuse vector
 ↓ MISS → embedding model
```

This is particularly useful during ingestion when duplicate content appears.

---

### 5. Configuration / reference data

Good candidates include:

```text
Agent configuration
Prompt templates
Tool metadata
Model configuration
Routing configuration
Business reference data
```

These can often have longer TTLs and can be invalidated when configuration changes.

---

### 6. Authentication metadata — carefully

Short-lived authentication information can sometimes be cached, such as:

```text
JWKS/public-key metadata
Token validation metadata
```

But **don't treat sensitive credentials or secrets as ordinary application cache data**.

Secrets should remain in a proper secret-management system.

---

### 7. What should NOT be cache-only?

This is very important for CWD.

Avoid using cache as the source of truth for:

```text
❌ LangGraph critical checkpoints
❌ Financial transactions
❌ Create/update/delete operations
❌ Critical workflow state
❌ Security authorization decisions
❌ Highly sensitive data without a strict design
```

For example:

```text
Coordinator
    ↓
Critical workflow state
    ↓
Durable DB / Cosmos DB
```

not:

```text
Coordinator
    ↓
Redis only
```

### CWD cache strategy

```text
                 CWD
                  |
        ┌─────────┼─────────┐
        ↓         ↓         ↓
   Enterprise    RAG       LLM
      data      results   responses
        |         |         |
        └─────────┼─────────┘
                  ↓
               Redis
```

But authorization remains outside the cache:

```text
Request
   ↓
Authenticate + Authorize
   ↓
Check Cache
   ↓
Return only authorized data
```

### 🎯 Interview-ready answer

> **“In CWD, I cache read-heavy and relatively stable data such as customer metadata, reference data, selected RAG retrieval results, embeddings, and carefully selected LLM responses. I use Redis with TTL and cache invalidation to control staleness. For enterprise data, the cache key includes tenant and authorization context. I don't use the cache as the source of truth for critical workflow checkpoints, transactions, or security decisions; those remain in durable storage or the authoritative system.”**

**Easy memory:**

> **Cache reads, not critical writes.**
> **Cache for performance; durable storage for correctness.**
