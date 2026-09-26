### Why use a DLQ?

A **Dead Letter Queue (DLQ)** stores messages that **failed repeatedly** after the configured retry limit.

```text id="7r1qfc"
Worker
  ↓
Failure
  ↓
Retry → Retry → Retry
  ↓
Still failing
  ↓
DLQ
  ↓
Investigate / Fix / Replay
```

* Prevents endlessly retrying the same failed message.
* Keeps the main queue healthy.
* Helps isolate **poison messages**.
* Provides a place for **investigation and replay**.
* Improves reliability and operational monitoring.

**Interview answer:**

> “We use a DLQ for messages that continue to fail after the configured retries. Instead of blocking the main queue with a poison message, we move it to the DLQ for investigation, correction, and controlled replay. This improves reliability and prevents infinite retry loops.”
