## How do you implement semantic caching in CWD?

**Semantic caching** means caching an answer based on the **meaning of the request**, not just the exact text.

For example:

```text
"Show me customer C12345's open incidents"
```

and

```text
"What incidents are currently open for C12345?"
```

are different strings but have the same intent. A semantic cache can recognize that they are similar and reuse a validated result.

### CWD flow

```text
User Request
     ↓
Coordinator
     ↓
Normalize + authorize
     ↓
Create semantic embedding
     ↓
Semantic Cache / Redis + Vector Index
     ↓
Similarity search
     ↓
 ┌───────────────┐
 │ Similar enough?│
 └───────┬───────┘
      YES│       │NO
         ↓       ↓
   Cached result  Normal CWD flow
                   ↓
              Delegator
                   ↓
                Worker
                   ↓
                 MCP
                   ↓
           Salesforce/ServiceNow
                   ↓
              Validate result
                   ↓
             Store in cache
```

### Step 1: Create the cache key/context

I don't use only the user's sentence.

I create something like:

```python
cache_context = {
    "tenant_id": "T001",
    "user_scope": "sales",
    "intent": "customer_incidents",
    "customer_id": "C12345",
    "filters": {
        "status": "open"
    }
}
```

This is important because **semantic similarity alone must never bypass authorization**.

---

### Step 2: Generate an embedding

Convert the semantic request into a vector:

```python
query_vector = embedding_model.embed(
    "Show me customer C12345's open incidents"
)
```

Store the embedding with the validated response.

```text
Embedding
   +
Intent
   +
Tenant
   +
Authorization scope
   +
Result
   +
Timestamp / TTL
```

---

### Step 3: Search for a similar request

Suppose the next request is:

```text
"What open incidents does C12345 have?"
```

Generate its embedding and perform vector similarity search.

Conceptually:

```python
matches = semantic_cache.search(
    vector=query_vector,
    top_k=1
)
```

If:

```text
similarity >= threshold
```

then it can be a **candidate cache hit**.

The threshold is determined through evaluation rather than blindly choosing a number.

---

### Step 4: Validate the cache entry

This is the most important part for enterprise AI.

Before returning the cached response, check:

```text
Same tenant?
Same authorization scope?
Same customer?
Same intent?
Same important filters?
Not expired?
Data freshness acceptable?
Same/compatible model or prompt version?
```

For example:

```python
if (
    match.tenant_id == tenant_id
    and match.customer_id == customer_id
    and authorized(user, match)
    and not expired(match)
):
    return match.result
```

---

### Step 5: Cache only validated results

If there is no valid semantic hit:

```text
Worker
 ↓
MCP
 ↓
ServiceNow
 ↓
Validate
 ↓
Result
 ↓
Generate embedding
 ↓
Semantic cache
```

I don't cache an unvalidated or potentially hallucinated LLM response.

---

## Where can we use it in CWD?

### 1. RAG queries

Good candidate:

```text
"What is the warranty policy for product X?"
"Tell me the warranty rules for product X."
```

If the underlying documents and authorization context haven't changed, the cached retrieval/answer may be reusable.

### 2. FAQ / knowledge questions

For stable enterprise knowledge:

```text
"What is the escalation process?"
"How do I escalate a Sev-1 incident?"
```

### 3. LLM responses

Semantic caching can reduce repeated LLM calls when:

* intent is equivalent
* relevant context is equivalent
* authorization is compatible
* model/prompt version is compatible
* freshness requirements are satisfied

### 4. Enterprise read operations — carefully

For example:

```text
"Show C12345's account information"
"Give me the account details for C12345"
```

But customer/incident data may change, so I use an appropriate TTL or event-based invalidation.

---

## What should NOT use semantic caching?

Be especially careful with:

```text
❌ Create/update/delete operations
❌ Financial transactions
❌ Real-time transaction status
❌ Security authorization decisions
❌ Highly sensitive data without strict isolation
❌ Unvalidated LLM output
```

For example, never let:

```text
"Create an incident for C12345"
```

hit a semantic cache and accidentally replay an old result.

Writes should go to the authoritative system through the Worker → MCP flow, with **idempotency**.

---

## Technical architecture

A practical implementation could be:

```text
                 CWD
                  │
             Coordinator
                  │
        ┌─────────▼─────────┐
        │ Semantic Cache     │
        │ Redis / Vector DB  │
        └─────────┬─────────┘
                  │
           Similarity Search
                  │
          ┌───────┴───────┐
          │               │
       Valid HIT        MISS
          │               │
          ↓               ↓
   Cached Result       Delegator
                          ↓
                        Worker
                          ↓
                         MCP
                          ↓
                Salesforce / ServiceNow
                          ↓
                       Validate
                          ↓
                    Store in cache
```

The cache entry could contain:

```json
{
  "tenant_id": "T001",
  "intent": "customer_incidents",
  "customer_id": "C12345",
  "query_embedding": "...",
  "result": "...",
  "created_at": "...",
  "expires_at": "...",
  "data_version": "v15",
  "prompt_version": "p3"
}
```

### 🎯 Interview-ready answer

> **“I implement semantic caching by converting the normalized user request into an embedding and searching a vector-based cache for a sufficiently similar previous request. Before returning a cache hit, I validate tenant, authorization scope, intent, entities such as customer ID, freshness, and relevant model or prompt versions. If there is no valid hit, the request follows the normal CWD flow through Delegator, Worker, and MCP. After validating the result, I store it with an embedding, TTL, and version metadata. I use semantic caching mainly for read-heavy RAG, FAQ, and carefully selected LLM or enterprise-read workloads, not for critical writes or security decisions.”**

**Easy memory:**

> **Embed → Similarity Search → Authorize → Validate Freshness → HIT / CWD → Validate → Cache**
