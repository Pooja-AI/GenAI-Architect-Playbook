In your **CWD architecture**, I would introduce caching where the same data, retrieval results, or intermediate computation is requested repeatedly and does not need to be freshly calculated every time.

### 1. Cache frequently accessed enterprise data

For example, customer information:

```text
Salesforce
    ↓
Salesforce Worker
    ↓
Redis Cache
```

If multiple Workers need the same `customer_id`, you don't need to call Salesforce repeatedly.

```text
Request 1 → Salesforce → Redis
Request 2 → Redis
Request 3 → Redis
```

**Benefit:** lower latency, fewer Salesforce API calls, lower cost.

---

### 2. Cache RAG retrieval results

Your CWD uses **Azure AI Search**.

If users repeatedly ask similar questions, cache the retrieval results:

```text
User Query
    ↓
Query Cache
    ↓ cache hit
Documents
```

On a cache miss:

```text
Query
 ↓
Azure AI Search
 ↓
Top-K documents
 ↓
Cache
```

This can reduce repeated search operations.

---

### 3. Cache embeddings

If the same document or query is embedded repeatedly:

```text
Text
 ↓
Embedding Cache
 ↓
Existing vector
```

Instead of calling the embedding model again.

This is useful when:

* Documents don't change frequently
* The same queries occur frequently
* Embedding generation is expensive

---

### 4. Cache LLM responses carefully

You can cache deterministic or highly repeatable requests:

```text
User Request
     ↓
LLM Response Cache
     ↓
Cache Hit → Return response
```

But I would **not blindly cache every LLM response**.

For example, a customer-specific request may depend on:

* User identity
* Permissions
* Customer data
* Current incidents
* Current Salesforce state

So caching the final answer could potentially return **stale or unauthorized information**.

For CWD, I would prefer caching **safe intermediate data** rather than blindly caching final responses.

---

### 5. Cache session/workflow state

Your CWD workflow has state such as:

```text
session
   ↓
task
   ↓
run
   ↓
turn
   ↓
step
```

Redis can provide fast access to active workflow state:

```text
Coordinator
    ↓
Redis
    ↓
Current workflow state
```

For example:

```text
W1 → Success
W2 → Success
W3 → Failed

Redis:
{
  W1: SUCCESS,
  W2: SUCCESS,
  W3: FAILED
}
```

When W3 is retried, the system doesn't need to recompute W1 and W2.

---

### 6. Cache configuration / metadata

Things such as:

* Agent configuration
* Prompt versions
* Tool metadata
* Routing rules
* Model configuration
* Frequently used permissions metadata

can be cached to avoid repeatedly querying the registry/database.

---

## Where I would NOT cache

This is very important for your **enterprise architecture interview**.

I would be careful caching:

```text
Real-time incidents
Current ticket status
Financial transactions
Highly sensitive data
Frequently changing authorization information
```

For example:

> If ServiceNow says a ticket is currently **OPEN**, I shouldn't return a cached **CLOSED** status just because it is faster.

You need appropriate **TTL, invalidation, and authorization-aware cache keys**.

---

## CWD caching architecture

```text
                         ┌── Redis ──→ Session State
                         │
                         ├── Redis ──→ Customer Data Cache
                         │
User
 ↓                       ├── Redis ──→ RAG Results
FastAPI
 ↓                       │
Coordinator ─────────────┤
 ↓                       │
Delegator                 └── Cache Lookup
 ↓
Worker
 ↓
MCP
 ↓
Salesforce / ServiceNow
```

### Cache key example

For customer data, don't simply use:

```text
customer:12345
```

You should consider authorization context, for example:

```text
customer:{customer_id}:{tenant}:{access_scope}
```

Otherwise, you risk returning cached data across users or authorization boundaries.

### Interview answer

> **“In CWD, I would primarily use Redis for caching frequently accessed data, active workflow state, retrieval results, and selected metadata. For example, if multiple Workers need the same customer information, we can cache the Salesforce response and reduce repeated API calls. I would also cache RAG retrieval results and embeddings where appropriate. However, I would not blindly cache sensitive or rapidly changing data. Cache keys must respect tenant and authorization boundaries, and we need appropriate TTL and invalidation strategies to prevent stale or unauthorized data.”**

### Easy way to remember

**Queue → handles work**

**Cache → avoids repeating work**

**Database → source of truth**

**Redis → fast temporary access**

For CWD, that's a very good architectural distinction to explain in an interview.
