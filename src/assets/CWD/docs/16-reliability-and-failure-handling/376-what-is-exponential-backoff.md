## What is Exponential Backoff?

**Exponential backoff** means **waiting longer after each failed retry** instead of retrying immediately.

In CWD, if an MCP call to Salesforce temporarily fails:

```text
Attempt 1 → Fail → wait 1 sec
Attempt 2 → Fail → wait 2 sec
Attempt 3 → Fail → wait 4 sec
Attempt 4 → Stop retrying
```

Typical formula:

```text
delay = base_delay × 2^(retry_count)
```

Example with `base_delay = 1 second`:

| Retry |  Wait |
| ----- | ----: |
| 1     | 1 sec |
| 2     | 2 sec |
| 3     | 4 sec |
| 4     | 8 sec |

### Why use it?

Suppose Salesforce is temporarily overloaded. If 1,000 Workers immediately retry at the same time, they create even more load.

Exponential backoff spreads the retries out:

```text
Worker
  ↓
MCP → Salesforce ❌
  ↓
wait 1s
  ↓
retry ❌
  ↓
wait 2s
  ↓
retry ✅
```

### Add Jitter

In production, I would usually add **jitter** so thousands of requests don't retry at exactly the same time.

```text
delay = exponential_backoff + random_jitter
```

For example:

```text
Retry 1 → ~1.2 sec
Retry 2 → ~2.7 sec
Retry 3 → ~4.3 sec
```

### In CWD

For example:

```text
Incident Worker
      ↓
MCP Client
      ↓
MCP Server
      ↓
ServiceNow ❌ Timeout
      ↓
Retry + Exponential Backoff + Jitter
      ↓
ServiceNow ✅
```

I would use it for **transient failures** such as:

* Timeout
* HTTP 429
* 502
* 503
* 504
* Temporary network failure

I would **not** retry things like `401`, `403`, invalid parameters, or authorization failures.

### Interview-ready answer

> **“Exponential backoff means increasing the delay between retries after each transient failure. For example, I might retry after 1, 2, and 4 seconds, with jitter added to avoid synchronized retries. In CWD, I use bounded exponential backoff for transient failures such as MCP, Salesforce, ServiceNow, LLM, or database timeouts.”**

**Easy memory:**
**Fail → Wait longer → Retry → Wait longer → Stop after retry limit.**
