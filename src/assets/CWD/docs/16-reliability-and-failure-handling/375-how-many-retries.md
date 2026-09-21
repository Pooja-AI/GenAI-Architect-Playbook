## How many retries?

For **CWD**, I would typically start with **2–3 retries**, but I would make the number **dependency- and error-specific**, not one global value.

### Practical CWD policy

| Dependency       | Typical retries | Reason                             |
| ---------------- | --------------: | ---------------------------------- |
| Azure OpenAI     |             2–3 | Transient timeout/429/5xx          |
| MCP → Salesforce |             2–3 | Transient network/5xx              |
| MCP → ServiceNow |             2–3 | Transient network/5xx              |
| Database         |             2–3 | Transient connection/throttling    |
| Redis            |             2–3 | Fast operation, short retry window |
| A2A              |             2–3 | Transient communication failure    |

For example:

```text id="7z4m2k"
Attempt 1 → fail
Attempt 2 → fail
Attempt 3 → fail
             ↓
       Stop retrying
             ↓
     Circuit breaker / failure
             ↓
       Coordinator decides
```

### Why not 10 retries?

Because retries increase:

* latency
* load on the failing dependency
* cost
* possibility of retry storms
* user-facing response time

For an interactive CWD request, **3 retries is often already a significant delay** depending on the backoff.

### Important: retry count isn't enough

I would define:

```text id="5g9w2p"
max_attempts
+ timeout per attempt
+ exponential backoff
+ jitter
+ overall deadline
```

For example:

```text id="2v6j8s"
Max attempts: 3
Per-call timeout: 10 sec
Backoff: exponential
Jitter: enabled
Overall workflow deadline: 30 sec
```

The **overall deadline** is important. Otherwise three individually reasonable retries can still make the whole workflow too slow.

### When I would use fewer retries

For:

```text
401 / 403
Invalid parameters
Schema validation failure
Business rule failure
Security denial
```

I use:

```text
0 retries
```

For a persistent dependency outage, I stop retrying and use the **circuit breaker/fallback path**.

### Interview-ready answer

> **“I typically start with 2–3 retries for transient failures, but I don't use a fixed number for every dependency. I configure the retry count together with per-attempt timeout, exponential backoff, jitter and an overall deadline. Authentication, authorization and validation errors get zero retries. After the retry budget is exhausted, I fail gracefully or use a fallback/circuit-breaker path. For write operations, idempotency is required before retrying.”**

**Easy memory:**
**2–3 retries → only transient → backoff + jitter → deadline → then fail/fallback.**
