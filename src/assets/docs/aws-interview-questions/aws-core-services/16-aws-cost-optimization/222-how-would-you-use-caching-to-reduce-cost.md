## How would you use caching to reduce cost?

Main idea: **if we already have a valid result, don't call Bedrock or downstream systems again.**

```text
User Request
     ↓
  Cache Check
   ↙       ↘
 HIT       MISS
  ↓          ↓
Return    Bedrock / RAG / MCP
             ↓
          Cache Result
```

### In CWD, I would use Redis for:

1. **Exact-match cache** → same request, return previous result.
2. **Semantic cache** → similar/rephrased questions can reuse a valid result.
3. **RAG result cache** → reuse frequently requested retrieval results.
4. **Reference/config cache** → Agent Registry, Prompt Registry, etc.
5. **Short-lived downstream data cache** → when freshness requirements allow.

### Important

Cache key should consider things like:

```text
tenant + user/entitlement + query + model_version + prompt_version + RAG_version
```

Use **TTL** so stale information isn't returned.

### Interview answer

> “I use Redis caching to avoid repeated Bedrock, RAG, and downstream calls. Exact-match caching handles identical requests, while semantic caching can handle rephrased requests. I use TTL and include tenant, authorization context, model, prompt, and RAG versions in the cache key to prevent incorrect or stale results.”

**Memory:**
**Check Cache → HIT = Return → MISS = Process → Store → TTL**
