## What happens if Redis fails?

In **CWD**, Redis is primarily used for **fast, temporary state**, such as session/context, short-lived agent memory, caching, distributed locks, or frequently accessed workflow data.

So Redis failure should **degrade performance**, not cause permanent data loss—assuming durable workflow state is stored in Cosmos DB or another durable database.

### CWD flow

```text id="f4x7q2"
Coordinator / Worker
        ↓
      Redis
        ❌
        ↓
Fallback to durable DB
        ↓
Continue / Recover
```

### 1. Detect Redis failure

Examples:

```text id="1m8v3k"
Connection timeout
Connection refused
Redis unavailable
Read/write failure
High latency
```

I capture:

```text id="6z2p9x"
trace_id
correlation_id
workflow_id
operation
Redis latency
error_type
```

---

### 2. Retry transient failures

For temporary network problems:

```text id="q5w8r1"
Redis request
    ↓
Timeout
    ↓
Retry
    ↓
Success
```

Use:

**bounded retries + exponential backoff + jitter**

I don't keep retrying indefinitely.

---

### 3. Fall back to the durable database

This is the important part of the CWD design.

```text id="0j4h6n"
Worker
  ↓
Redis
  ❌
  ↓
Cosmos DB
  ↓
Continue
```

For example, if Redis contains conversation/session context:

```text id="9p2x7m"
Redis
  ↓
cache miss / unavailable
  ↓
Cosmos DB
  ↓
restore required state
```

The tradeoff is **higher latency**, but the workflow remains recoverable.

---

### 4. What if Redis is only a cache?

This is the easiest case.

```text id="e3v5k9"
Redis cache ❌
     ↓
Fetch from source of truth
     ↓
Return data
     ↓
Repopulate Redis later
```

The application becomes slower, but correctness is preserved.

---

### 5. What if Redis contains temporary agent memory?

Suppose:

```text id="k7s2p4"
Worker
 ↓
Redis
 ↓
short-term context
```

If Redis fails, I retrieve the required durable context from the persistent state store if available.

I would **not treat Redis-only state as recoverable workflow state** unless Redis has been specifically configured and designed for that durability requirement.

---

### 6. What about distributed locks?

This requires more care.

If Redis is used for:

```text id="2c8n6v"
distributed lock
```

and Redis becomes unavailable, I would **fail closed for critical operations** rather than allow multiple Workers to execute the same non-idempotent operation.

For example:

```text id="r9k1t4"
Worker 1 → needs lock
Worker 2 → needs lock

Redis unavailable
        ↓
Cannot safely establish lock
        ↓
Don't execute critical operation
```

Then use:

**idempotency + durable coordination** where appropriate.

---

### 7. Redis recovery

When Redis comes back:

```text id="h3y6p0"
Redis recovers
      ↓
Health check
      ↓
Warm/repopulate cache
      ↓
Resume normal operation
```

I don't blindly copy stale data back into Redis. Cache entries should respect their TTL and freshness rules.

---

## Example: Customer Briefing

```text id="6x1z8v"
Customer Briefing
      ↓
Coordinator
      ↓
Customer Worker
      ↓
Redis → customer context ❌
      ↓
Cosmos DB → retrieve durable state
      ↓
Worker continues
      ↓
MCP → Salesforce
```

The user may experience slightly higher latency, but the workflow doesn't have to fail simply because Redis is unavailable.

---

## Redis vs Database failure

This is a good interview distinction:

| Redis failure                     | Durable DB failure              |
| --------------------------------- | ------------------------------- |
| Usually performance/cache problem | Durability/state problem        |
| Can often fallback                | May need to pause workflow      |
| Rebuild cache                     | Protect checkpoints             |
| Higher latency                    | Risk of state loss              |
| Usually graceful degradation      | Potential workflow interruption |

### Interview-ready answer

> **“In CWD, Redis is mainly used for low-latency state, caching and short-lived agent memory, while the durable database is the source of truth for critical workflow state. If Redis fails, I detect it, retry transient failures with bounded exponential backoff, and fall back to the durable store where possible. If Redis is only a cache, I simply retrieve from the source of truth and repopulate the cache later. For critical distributed locks, I fail closed rather than allowing unsafe concurrent execution. When Redis recovers, I perform health checks and gradually repopulate the cache. This way Redis failure primarily affects latency rather than workflow correctness.”**

### Strong interview line

> **“Redis is an optimization layer, not my source of truth. If Redis fails, CWD should become slower—not lose workflow state.”**

**Easy memory:**
**Redis fails → Retry → Fallback → Continue slower → Recover → Repopulate.**
