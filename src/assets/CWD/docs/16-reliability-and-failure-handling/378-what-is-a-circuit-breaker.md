## What is a Circuit Breaker?

A **circuit breaker** is a resilience pattern that **temporarily stops sending requests to a failing dependency** after repeated failures.

Think of it like an **electrical circuit breaker**: instead of continuously sending traffic to a system that is down, we "open the circuit" and give that system time to recover.

### In CWD

Suppose the **Incident Worker** calls ServiceNow through MCP:

```text
Incident Worker
      ↓
MCP Client
      ↓
MCP Server
      ↓
ServiceNow ❌
```

If ServiceNow repeatedly fails:

```text
Failure 1 → Retry
Failure 2 → Retry
Failure 3 → Circuit OPEN
```

Now new requests are **blocked immediately** instead of continuing to call ServiceNow.

### Circuit states

```text
        failures exceed threshold
CLOSED ─────────────────────────→ OPEN
  ↑                                │
  │                                │ wait
  │                                ↓
  └──────────── success ───── HALF-OPEN
```

**1. CLOSED — normal**

```text
Worker → MCP → ServiceNow ✅
```

Requests flow normally.

**2. OPEN — dependency is unhealthy**

```text
Worker → MCP → 🚫 ServiceNow
```

Calls are rejected quickly or routed to a fallback.

**3. HALF-OPEN — test recovery**

After a recovery period, allow a small number of test requests:

```text
Worker → MCP → ServiceNow
                 ↓
              Success ✅
                 ↓
             CLOSED
```

If the test fails:

```text
ServiceNow ❌
     ↓
OPEN again
```

### Why use it?

Without a circuit breaker:

```text
ServiceNow is down
      ↓
Workers keep retrying
      ↓
More traffic
      ↓
More timeouts
      ↓
Thread/connection exhaustion
      ↓
CWD becomes slower
```

With a circuit breaker:

```text
ServiceNow fails repeatedly
      ↓
Circuit opens
      ↓
Stop unnecessary calls
      ↓
Protect CWD
      ↓
ServiceNow gets time to recover
```

### Circuit Breaker + Retry + Backoff

These work together:

```text
Transient failure
      ↓
Retry
      ↓
Exponential Backoff + Jitter
      ↓
Still failing?
      ↓
Circuit Breaker
      ↓
OPEN
      ↓
Fallback / Partial Result / HITL
```

For example:

```text
Max retries = 3
Failure threshold = 5 failures
Open duration = 30 seconds
Then → HALF-OPEN
```

These are **example starting values**, not universal settings; they should be tuned based on the dependency and SLA.

### Important interview point

A circuit breaker is **not a replacement for retries**.

* **Retry:** "Maybe this temporary failure will recover."
* **Circuit breaker:** "This dependency is repeatedly failing, so stop calling it for now."

### Interview-ready answer

> **“A circuit breaker protects my CWD workflow from repeatedly calling an unhealthy dependency. For example, if ServiceNow keeps failing through the MCP Server, after a configured failure threshold I open the circuit and temporarily stop new calls. After a cooldown period, I move to half-open and send a test request. If it succeeds, I close the circuit; otherwise, I keep it open. I typically combine circuit breakers with bounded retries, exponential backoff, jitter, and fallback handling.”**

### Easy memory

**Retry → Backoff → Still failing → OPEN → Wait → HALF-OPEN → Test → CLOSE or OPEN.**
