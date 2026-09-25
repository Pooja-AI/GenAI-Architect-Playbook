# What is a Visibility Timeout?

**Visibility timeout is the period during which an SQS message becomes temporarily invisible to other Workers after one Worker receives it.**

It prevents multiple Workers from processing the same message **at the same time**.

### Simple example

```text
SQS
 ↓
Message JOB-123
 ↓
Worker A receives it
 ↓
Message becomes INVISIBLE
 ↓
Worker A processes it
 ↓
Delete message from SQS
```

Suppose the visibility timeout is **60 seconds**.

```text
0 sec       Worker receives message
     ↓
0–60 sec    Message invisible
     ↓
Worker finishes
     ↓
Delete message
```

If Worker A crashes:

```text
SQS
 ↓
Worker A receives JOB-123
 ↓
Message invisible for 60 sec
 ↓
Worker A crashes
 ↓
60 sec expires
 ↓
Message becomes visible again
 ↓
Worker B receives it
```

This provides **automatic retry behavior**.

---

## CWD example

```text
Delegator
    ↓
   SQS
    ↓
Customer Worker A
    ↓
MCP
    ↓
Salesforce
```

Suppose the Worker normally takes **30 seconds**.

I might configure the visibility timeout longer than the expected processing time, for example **60 seconds**.

If the Worker finishes successfully:

```text
Worker
 ↓
Process successfully
 ↓
Delete SQS message
```

If it fails:

```text
Worker crashes
 ↓
Message not deleted
 ↓
Visibility timeout expires
 ↓
SQS makes message visible
 ↓
Another Worker retries
```

---

## What if the job takes longer?

You can **extend the visibility timeout** while processing.

```text
Initial timeout = 60 sec

Worker processing
       ↓
Still running at 50 sec
       ↓
Extend visibility timeout
       ↓
Continue processing
```

This is useful for long-running Worker jobs.

---

## Visibility timeout vs message retention

Don't confuse these:

| Concept                | Meaning                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| **Visibility timeout** | How long a received message stays hidden from other consumers             |
| **Message retention**  | How long SQS keeps the message if it isn't successfully processed/deleted |

### Memory trick

> **Visibility timeout = “Give this Worker some time to finish.”**

### 🎯 Strong interview answer

> **“Visibility timeout is the period for which an SQS message is hidden after a Worker receives it. It prevents another Worker from immediately processing the same message. If the Worker successfully completes the job, it deletes the message. If the Worker crashes or doesn't delete it before the visibility timeout expires, SQS makes the message visible again for retry. For long-running CWD Workers, I can extend the visibility timeout while processing.”**
