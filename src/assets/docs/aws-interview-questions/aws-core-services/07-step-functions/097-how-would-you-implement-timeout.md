# How would you implement timeout?

In CWD, I would set **timeouts at multiple layers** so one slow Worker or downstream system cannot block the entire workflow indefinitely.

```text id="q4x8kp"
Coordinator
    ↓
Step Functions
    ↓
Worker Timeout
    ↓
MCP/API Timeout
    ↓
Salesforce / ServiceNow
```

## 1. Step Functions timeout

For each Worker task, configure a timeout.

Example:

```text id="9h3m2k"
Salesforce Worker
      ↓
Maximum: 30 seconds
      ↓
Response?
   ↙       ↘
 Yes       No
  ↓         ↓
Continue   Timeout
            ↓
          Retry/Catch
```

If the Worker doesn't finish within the limit, Step Functions marks the task as timed out.

---

## 2. MCP/API timeout

The Worker should also have a timeout when calling MCP or downstream APIs.

```text id="j7v4cs"
Worker
  ↓
MCP Client
  ↓
ServiceNow
  ↓
Timeout = 10 sec
```

Don't allow the Worker to wait indefinitely.

---

## 3. Different timeouts for different operations

Don't use one timeout everywhere.

For example:

```text id="5j2v8m"
Simple MCP lookup       → 5 sec
Salesforce query        → 10 sec
RAG retrieval           → 5 sec
LLM generation         → 30 sec
Long document process   → minutes
```

The values should come from actual **P95/P99 latency and SLA requirements**, not arbitrary numbers.

---

## 4. Timeout → Retry → Catch

A typical CWD flow:

```text id="q8c6da"
Worker
  ↓
Call ServiceNow
  ↓
Timeout
  ↓
Retry + backoff
  ↓
Timeout again
  ↓
Retry
  ↓
Still timeout
  ↓
Catch
  ↓
Optional? ── Yes → Partial result
    │
    └──────── No → Fail workflow
```

---

## 5. Protect against retry storms

A timeout shouldn't immediately cause unlimited retries.

Use:

* Maximum retry attempts
* Exponential backoff
* Jitter
* Circuit breaker
* Concurrency limits
* Idempotency

For example:

```text id="9t5v3a"
Timeout
 ↓
2 sec
 ↓
Retry
 ↓
4 sec
 ↓
Retry
 ↓
8 sec
 ↓
Catch
```

---

## 🎯 Strong interview answer

> **“I implement timeouts at multiple layers in CWD. Step Functions provides the workflow-level timeout, while each Worker and MCP/API call has its own bounded timeout. I tune the values based on observed P95/P99 latency and business SLAs. When a timeout occurs, I classify it as potentially transient, apply bounded retries with exponential backoff and jitter, and then use Catch for recovery. For optional Workers I can continue with a partial result; for mandatory Workers I can fail or pause the workflow. This prevents a slow downstream system from blocking the entire CWD workflow indefinitely.”**

### Memory trick

**Timeout → Retry → Backoff → Catch → Recover**

### Key distinction

**Timeout controls how long we wait.**

**Retry controls whether we try again.**

**Catch controls what we do when the retry strategy cannot recover.**
