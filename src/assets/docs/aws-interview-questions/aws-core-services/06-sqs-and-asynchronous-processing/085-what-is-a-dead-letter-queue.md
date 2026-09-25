# What is a Dead Letter Queue (DLQ)?

A **Dead Letter Queue is a separate SQS queue where messages are moved after they repeatedly fail processing**.

Think of it as a **quarantine area for failed jobs**.

```text id="z5y2rq"
              Main SQS Queue
                   ↓
                Worker
                   ↓
              Processing
              ↙       ↘
          SUCCESS      FAIL
             ↓           ↓
          Delete      Retry
                         ↓
                      Retry
                         ↓
                   Max attempts
                         ↓
                       DLQ
```

## CWD example

Suppose the **Incident Worker** needs to update ServiceNow.

```text id="5s6y8k"
SQS
 ↓
Incident Worker
 ↓
MCP
 ↓
ServiceNow
 ↓
503 Error
```

The Worker retries:

```text id="s3x6l1"
Attempt 1 ❌
Attempt 2 ❌
Attempt 3 ❌
Attempt 4 ❌
       ↓
      DLQ
```

The message is **not lost**. It is isolated for investigation.

---

## What do you do with DLQ messages?

Operations can inspect:

```text id="u5h8fr"
Job ID
Worker
Correlation ID
Error
Timestamp
Request information
Retry count
```

Then determine the problem:

```text id="9xgq6h"
Bad input?
    → Fix data

ServiceNow outage?
    → Wait for recovery

Worker bug?
    → Fix application

Configuration issue?
    → Fix configuration
```

After fixing the problem, the message can potentially be **replayed/reprocessed**.

---

# Why is DLQ important in CWD?

Without a DLQ:

```text id="d8s6vf"
Failed message
    ↓
Retry
    ↓
Retry
    ↓
Retry
    ↓
Retry forever ❌
```

This can create:

* Infinite retries
* Queue congestion
* Wasted compute
* Repeated downstream calls
* Difficult troubleshooting

With DLQ:

```text id="6k0j2z"
Main Queue
    ↓
Retry
    ↓
Retry
    ↓
Retry
    ↓
DLQ
    ↓
Investigate / Fix / Replay
```

---

## DLQ + Idempotency

These solve different problems:

**DLQ:**

> "This message keeps failing. Move it aside."

**Idempotency:**

> "If I process this message again, don't perform the business operation twice."

Together:

```text id="0m2r2w"
SQS
 ↓
Worker
 ↓
Failure
 ↓
Retry
 ↓
Idempotency check
 ↓
Still failing?
 ↓
DLQ
```

### 🎯 Strong interview answer

> **“A Dead Letter Queue is a separate SQS queue used to isolate messages that repeatedly fail processing. In CWD, if a Worker cannot process a message after the configured retry attempts, I move it to the DLQ instead of retrying indefinitely. The DLQ gives us visibility for troubleshooting and allows controlled replay after the underlying issue is fixed. I also use idempotency so replaying a message doesn't create duplicate business operations.”**

### Easy memory trick

**DLQ = Failed messages → Isolate → Investigate → Fix → Replay**
