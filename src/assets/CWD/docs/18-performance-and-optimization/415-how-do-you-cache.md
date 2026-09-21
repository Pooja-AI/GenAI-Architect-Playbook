## How do you cache in CWD?

In CWD, I use caching mainly to **avoid repeated expensive operations**, especially repeated **LLM, RAG, and enterprise API calls**.

A simple architecture is:

```text id="c8s6f1"
Worker
  ↓
Cache (Redis)
  ↓
Cache HIT? ── Yes → Return cached result
  │
  No
  ↓
MCP → Salesforce / ServiceNow
  ↓
Store result in cache
  ↓
Return result
```

### 1. What would I cache?

| Data                              | Cache?              | Example                     |
| --------------------------------- | ------------------- | --------------------------- |
| Frequently read customer metadata | ✅                   | Customer profile            |
| Repeated RAG results              | ✅ Carefully         | Common knowledge query      |
| LLM responses                     | ✅ Carefully         | Deterministic/safe requests |
| Authentication tokens             | ⚠️ Short-lived only | Access token                |
| Workflow checkpoint               | ❌ Not cache-only    | Use durable DB              |
| Financial/transactional writes    | ❌ Generally         | Create/update transaction   |
| Highly sensitive data             | ⚠️ Carefully        | Only with strict controls   |

### 2. Redis in CWD

For low-latency caching, I can use **Redis**.

Example:

```python id="q7y3l0"
cache_key = f"customer:{tenant_id}:{customer_id}"

cached = await redis.get(cache_key)

if cached:
    return json.loads(cached)

result = await mcp_client.call_tool(
    "get_customer",
    {"customer_id": customer_id}
)

await redis.set(
    cache_key,
    json.dumps(result),
    ex=300
)

return result
```

Here:

```text
Cache hit  → Redis → fast response
Cache miss → MCP → Salesforce → store → response
```

`ex=300` means the cached value expires after 5 minutes.

---

### 3. Cache key must include authorization context

This is **very important in enterprise AI**.

Don't use:

```text
customer:C12345
```

because different users/tenants may have different permissions.

Instead:

```text
tenant:T001:user/U123:customer:C12345
```

or use an equivalent authorization/entitlement-aware key.

The cache must never become a way to bypass authorization.

> **Authorization happens before returning cached data.**

---

### 4. Cache invalidation

The biggest challenge is:

> **When should cached data be considered stale?**

I use:

* TTL
* Event-based invalidation
* Version numbers
* Explicit invalidation after writes

Example:

```text id="m6c4z1"
Salesforce customer updated
        ↓
Event
        ↓
Invalidate Redis cache
        ↓
Next request → Salesforce
```

For frequently changing data, use a shorter TTL.

---

### 5. Cache-aside pattern

For CWD, **cache-aside** is a simple pattern:

```text id="3j8qg5"
             Request
                ↓
             Redis?
            /      \
          HIT      MISS
           ↓         ↓
        Return    MCP/API
                     ↓
                   Redis
                     ↓
                   Return
```

The application controls when data is read from and written to the cache.

---

### 6. What about LLM response caching?

You can cache an LLM response when the request is sufficiently deterministic.

For example:

```text id="7j6f0s"
Same normalized prompt
+ same model
+ same prompt version
+ same relevant context
        ↓
Cached response
```

But I wouldn't blindly cache all LLM responses because:

* Data may change
* User permissions may differ
* Context may differ
* Model/prompt version may change

So the cache key should account for relevant context and versioning.

---

### 7. What about RAG caching?

For RAG:

```text id="m8j3p2"
User Query
 ↓
Normalize query
 ↓
Cache?
 ├── HIT → cached retrieval results
 └── MISS → Azure AI Search
```

But again, include:

```text
tenant
authorization context
index/version
query
filters
```

Otherwise you risk returning results from the wrong security context.

---

### 8. Cache vs database

This is a very important interview question.

```text id="x1b8m9"
Redis
 ↓
Fast cache / temporary state
 ↓
Can be lost

Durable DB
 ↓
Source of truth
 ↓
Critical workflow state
```

For CWD:

> **Redis improves performance; durable storage protects correctness.**

I would **never depend on Redis alone for critical LangGraph workflow checkpoints**.

### 🎯 Interview-ready answer

> **“In CWD, I primarily use Redis for low-latency caching of frequently accessed, safe read data such as customer metadata or selected RAG results. I use the cache-aside pattern: check Redis first, on a miss call the MCP or search layer, then store the result with an appropriate TTL. Cache keys must include tenant and authorization context so caching never bypasses security. I also use TTL, event-based invalidation, and versioning to control staleness. For LLM or RAG caching, I include the model, prompt, index, and relevant context versions in the key. I don't use Redis as the source of truth for critical workflow state; that remains in durable storage.”**

**Easy memory:**

> **Check → Hit return → Miss fetch → Store → TTL → Invalidate → Authorize**
