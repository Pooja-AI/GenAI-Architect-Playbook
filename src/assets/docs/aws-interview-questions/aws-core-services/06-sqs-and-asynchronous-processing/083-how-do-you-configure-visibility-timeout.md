# How do you configure visibility timeout?

I configure the **SQS visibility timeout based on the expected maximum processing time of the Worker**, with some safety margin.

### Simple rule

```text
Visibility Timeout
        >
Worker processing time
        +
Safety margin
```

For example:

```text
Typical Worker time = 30 sec
Maximum expected    = 45 sec

Visibility timeout = 60 sec
```

## CWD example

Suppose:

```text
SQS
 ↓
Customer Worker
 ↓
MCP
 ↓
Salesforce
```

The Worker normally takes **20–30 seconds**, but can sometimes take **45 seconds**.

I could configure:

```text
Visibility Timeout = 60 seconds
```

Flow:

```text
0 sec
 ↓
Worker receives message
 ↓
Message becomes invisible
 ↓
Worker processes
 ↓
45 sec → processing completed
 ↓
Delete message
```

---

## What if the Worker takes longer?

For long-running jobs, I can **extend the visibility timeout dynamically**.

```text
Initial timeout = 60 sec

Worker starts
    ↓
50 sec
    ↓
Still processing
    ↓
Extend timeout
    ↓
Continue processing
    ↓
Complete
    ↓
Delete message
```

This prevents the same message from becoming visible while the original Worker is still processing it.

---

## What if timeout is too short?

Suppose:

```text
Worker processing = 90 sec
Visibility timeout = 60 sec
```

Then:

```text
Worker A receives message
       ↓
60 sec
       ↓
Message becomes visible
       ↓
Worker B receives same message
```

Now **Worker A and Worker B could process the same job concurrently**.

That's why the timeout must be long enough.

---

## What if timeout is too long?

Suppose:

```text
Worker crashes after 5 sec
Visibility timeout = 30 minutes
```

The failed message may remain invisible for a long time before another Worker can retry it.

So don't make it unnecessarily large.

---

## How I choose it

For CWD:

```text
Measure actual Worker duration
        ↓
Look at P95 / P99
        ↓
Set appropriate timeout
        ↓
Extend for unusually long jobs
        ↓
Use idempotency as protection
```

For example:

| Worker          | Typical | Max expected | Visibility |
| --------------- | ------: | -----------: | ---------: |
| Customer Worker |     10s |          30s |        60s |
| Incident Worker |     15s |          45s |     60–90s |
| Document Worker |   2 min |        5 min |   6–10 min |

These are **example values**, not universal settings.

### 🎯 Strong interview answer

> **“I configure SQS visibility timeout based on the Worker’s maximum expected processing time, with a safety margin. I measure actual processing latency, typically looking at P95/P99, and set the timeout high enough that a healthy Worker normally finishes before the message becomes visible again. For long-running jobs, I extend the visibility timeout while processing. If the Worker fails without deleting the message, the timeout expires and SQS makes the message available for retry. I also use idempotency so a duplicate delivery remains safe.”**

### Easy memory trick

**Measure → Set → Extend → Retry → Idempotency**

**Key point:** Visibility timeout controls **when a failed/unacknowledged message can be retried**; it does **not** control how long SQS stores the message.
