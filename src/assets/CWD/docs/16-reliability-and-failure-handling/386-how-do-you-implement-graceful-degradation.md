## How do you implement graceful degradation?

**Graceful degradation means when one component or dependency fails, CWD continues providing as much useful functionality as safely possible instead of completely failing.**

### CWD example

Suppose a Customer Briefing needs:

```text
Coordinator
   ↓
   ├── Sales Delegator
   │     ├── Customer Worker      → Salesforce ✅
   │     └── Opportunity Worker   → Salesforce ✅
   │
   └── IT Delegator
         └── Incident Worker      → ServiceNow ❌
```

Instead of:

```text
ServiceNow ❌
     ↓
Entire CWD ❌
```

I degrade gracefully:

```text
Customer information      ✅
Opportunity information   ✅
Incident information      ⚠️ unavailable
```

---

## How I implement it

### 1. Identify critical vs optional capabilities

Define business rules:

```text
Customer data       → Critical
Opportunity data    → Critical
Incident data       → Optional
```

If an optional Worker fails, the workflow can continue.

If a critical Worker fails, CWD may pause or require HITL.

---

### 2. Isolate failures

Each Delegator/Worker should have its own failure boundary:

```text id="9x1h5c"
Sales Delegator ──→ ✅
IT Delegator ─────→ ❌
                     │
                     └── does not bring down Sales
```

This is especially important in a multi-agent architecture.

---

### 3. Use retries + circuit breakers

For temporary failures:

```text
Worker
  ↓
MCP
  ↓
ServiceNow ❌
  ↓
Retry
  ↓
Backoff + Jitter
  ↓
Circuit Breaker
```

If ServiceNow remains unavailable, stop repeatedly calling it and degrade that capability.

---

### 4. Use approved fallback sources

For some **read** operations, an approved cached or secondary source may be used:

```text
ServiceNow
    ↓
Unavailable
    ↓
Approved cache
    ↓
Return last-known data
```

But the response must clearly indicate that it is **cached/stale** if freshness matters.

For sensitive or transactional operations, I would **not blindly use stale data**.

---

### 5. Return a controlled partial response

The Coordinator should explicitly communicate what succeeded and what was unavailable.

```json id="5q1v4m"
{
  "customer": "available",
  "opportunities": "available",
  "incidents": "unavailable",
  "status": "PARTIAL"
}
```

The LLM should never fill the missing section with invented information.

---

### 6. Preserve state for recovery

CWD checkpoints successful work:

```text id="7j3m2k"
Customer Worker      → ✅ checkpoint
Opportunity Worker   → ✅ checkpoint
Incident Worker      → ❌
```

When ServiceNow recovers:

```text id="n5p8za"
Replay Incident Worker
        ↓
ServiceNow ✅
        ↓
Update checkpoint
        ↓
Coordinator aggregates
```

We don't rerun the successful Workers.

---

## CWD graceful-degradation architecture

```text id="w7q2ne"
                    Coordinator
                        │
             ┌──────────┴──────────┐
             ↓                     ↓
       Sales Delegator        IT Delegator
             │                     │
       ┌─────┴─────┐               ↓
       ↓           ↓        Incident Worker
 Customer      Opportunity        │
 Worker          Worker           ↓
       ↓           ↓             MCP
     MCP         MCP              ↓
       ↓           ↓          ServiceNow ❌
 Salesforce    Salesforce
       ↓           ↓
       └─────┬─────┘
             ↓
       Partial Result
             ↓
     Continue safely
```

### Technologies that help

| Requirement           | CWD technology/pattern                |
| --------------------- | ------------------------------------- |
| Failure isolation     | LangGraph workflow boundaries         |
| Partial results       | Coordinator aggregation               |
| Retry                 | Bounded retry policy                  |
| Backoff               | Exponential backoff + jitter          |
| Dependency protection | Circuit breaker                       |
| Failed async work     | Service Bus + DLQ                     |
| Recovery              | Checkpoints                           |
| Duplicate protection  | Idempotency                           |
| Fallback              | Cache/secondary source where approved |
| Human decision        | HITL                                  |
| Detection             | App Insights + Langfuse               |

### Interview-ready answer

> **“I implement graceful degradation by designing CWD so individual capability failures don't automatically bring down the entire workflow. I classify Workers as critical or optional, isolate failures at the Worker/Delegator boundary, use retries and circuit breakers for transient dependency failures, and use approved fallback sources where appropriate. For optional failures, the Coordinator returns a controlled partial result instead of fabricating data. I persist successful results so the failed Worker can later be replayed and the workflow resumed.”**

### Strong interview line

> **“Graceful degradation means reducing functionality, not reducing correctness.”**

### Easy memory

**Isolate → Retry → Circuit Breaker → Fallback → Partial Result → Checkpoint → Recover.**
