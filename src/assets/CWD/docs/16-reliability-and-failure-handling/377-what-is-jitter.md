## What is Jitter?

**Jitter means adding a small random delay to the retry wait time.**

It is mainly used with **exponential backoff** to prevent many requests from retrying at exactly the same time.

### Without Jitter

Suppose 1,000 Workers fail at the same time:

```text
Failure
  ↓
wait 2 sec
  ↓
1,000 requests retry together ❌
  ↓
wait 4 sec
  ↓
1,000 requests retry together ❌
```

This can create a **thundering herd problem** and overload Salesforce, ServiceNow, MCP, or another dependency.

### With Jitter

Instead of everyone waiting exactly 2 seconds:

```text
Worker 1 → wait 2.1 sec
Worker 2 → wait 2.7 sec
Worker 3 → wait 2.3 sec
Worker 4 → wait 2.9 sec
...
```

The retries become spread out.

### In CWD

Example:

```text
Incident Worker
      ↓
MCP → ServiceNow ❌
      ↓
Exponential Backoff
      +
     Jitter
      ↓
Retry after ~2.4 sec
      ↓
ServiceNow ✅
```

A simple concept is:

```text
retry_delay = exponential_delay + random_jitter
```

### Interview-ready answer

> **“Jitter is a small random variation added to the retry delay. I use it with exponential backoff so that multiple CWD Workers don't retry a failed MCP, Salesforce, or ServiceNow call at exactly the same time. This helps prevent the thundering herd problem and reduces load spikes.”**

### Easy memory

**Exponential backoff = wait longer.**
**Jitter = don't wait exactly the same amount.**

**Strong interview line:**

> **“Backoff controls how long we wait; jitter prevents synchronized retries.”**
