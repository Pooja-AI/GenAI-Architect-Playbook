# How do you handle Lambda failures?

## Short answer

I use **Detect → Retry → Backoff → DLQ → Idempotency → Monitor → Alert**.

The exact strategy depends on whether the Lambda failure is **transient** or **permanent**.

## Key points

### 1. Detect the failure

Monitor:

* Lambda errors
* Timeouts
* Throttles
* Duration
* Invocation failures
* Downstream API errors

Use **CloudWatch** for metrics, logs, and alarms.

---

### 2. Retry transient failures

For temporary failures:

```text id="7c2q4m"
Lambda
  ↓
Temporary failure
  ↓
Retry
  ↓
Success
```

Examples:

* Temporary network issue
* Service unavailable
* Throttling
* Transient downstream failure

Use **bounded retries** with exponential backoff and jitter.

```text id="9p5k2r"
Retry 1 → wait
Retry 2 → wait longer
Retry 3 → wait longer
       ↓
Max attempts
```

Don't retry forever.

---

### 3. Use DLQ for failed asynchronous processing

For SQS-based Lambda:

```text id="4x7m1p"
SQS
 ↓
Lambda
 ↓
Failure
 ↓
Retry
 ↓
Failure
 ↓
DLQ
```

The DLQ lets us investigate or replay failed messages without blocking normal processing.

---

### 4. Make Lambda idempotent

This is very important.

Suppose Lambda processes:

```text id="6n8v2c"
Update customer record
```

The Lambda succeeds, but the response is lost.

The system may retry the same message.

Without idempotency:

```text id="p2r5k7"
Retry
 ↓
Duplicate operation ❌
```

With idempotency:

```text id="m8q3v1"
Request ID = ABC123
      ↓
Already processed?
      ↓
YES → Don't execute again
```

For CWD, I could store an idempotency key in **DynamoDB**.

---

### 5. Handle timeouts

Configure appropriate Lambda timeout.

```text id="y3w6n9"
Lambda
  ↓
Downstream API
  ↓
Timeout
```

Don't allow a function to wait indefinitely.

Use:

* Timeout
* Bounded retry
* Backoff
* Circuit breaker where appropriate

---

### 6. Handle downstream failures

Suppose a Lambda Worker calls Salesforce:

```text id="c8v2m5"
Lambda Worker
      ↓
Salesforce
      ↓
Unavailable
```

I wouldn't continuously retry.

Instead:

```text id="r7k4p1"
Failure
 ↓
Retry + backoff
 ↓
Maximum attempts
 ↓
Queue/DLQ
 ↓
Alert
```

For an optional CWD Worker, the Delegator can continue with other Workers and return a **partial response**.

For a mandatory Worker, the workflow may need to fail or pause for recovery.

---

## CWD example

Suppose:

```text id="q5m8s2"
Customer Briefing
      ↓
Sales Delegator
      ↓
Customer Worker
      ↓
Lambda
      ↓
Salesforce
```

Salesforce temporarily fails.

I would handle it like:

```text id="n6p2r8"
Salesforce failure
       ↓
Detect
       ↓
Retry with exponential backoff + jitter
       ↓
Success? ── YES → Continue
       │
       NO
       ↓
Maximum retries
       ↓
DLQ / failure state
       ↓
Delegator decides
       ↓
Partial response or workflow failure
```

And I would record the failure using the CWD **correlation ID / run ID** so the failure can be traced across the workflow.

## Important: Don't retry everything

| Failure                         | Retry?                          |
| ------------------------------- | ------------------------------- |
| Temporary network error         | ✅                               |
| Service temporarily unavailable | ✅                               |
| Throttling / 429                | ✅ with backoff                  |
| Lambda timeout                  | Sometimes, after checking cause |
| Invalid request                 | ❌                               |
| Authentication failure          | Usually ❌                       |
| Authorization failure           | ❌                               |
| Invalid parameters              | ❌                               |
| Business-rule failure           | ❌                               |

## 🎯 Strong interview answer

> **“I handle Lambda failures using different strategies for transient and permanent failures. For transient failures, I use bounded retries with exponential backoff and jitter. For asynchronous processing, I use SQS with a DLQ after the retry limit. I make the Lambda idempotent so retries don't create duplicate operations, especially for enterprise systems like Salesforce or ServiceNow. I also configure timeouts, monitor errors, throttles and duration through CloudWatch, and propagate correlation IDs into the CWD workflow. At the Delegator level, I distinguish mandatory and optional Workers so an optional Lambda failure can result in a partial response rather than failing the entire workflow.”**

## Easy memory trick

**Detect → Retry → Backoff → Idempotent → DLQ → Monitor**

### Key distinction

> **Retry handles temporary failure. DLQ handles repeatedly failed asynchronous work. Idempotency prevents retries from creating duplicate business operations.**
