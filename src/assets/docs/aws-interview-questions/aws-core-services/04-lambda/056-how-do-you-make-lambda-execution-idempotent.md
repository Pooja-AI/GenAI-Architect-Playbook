# How do you retry Lambda execution?

## Short answer

It depends on **how Lambda is invoked**:

```text
Asynchronous → AWS retries
SQS trigger  → SQS redelivers
Synchronous → Caller retries
```

## 1. Asynchronous invocation

Example:

```text
EventBridge
    ↓
Lambda
    ↓
Failure
    ↓
AWS retry
    ↓
Failure
    ↓
DLQ / Destination
```

For asynchronous Lambda invocation, AWS automatically retries certain failures. I configure the retry behavior and failure destination/DLQ.

---

## 2. SQS → Lambda

This is very useful for CWD.

```text
SQS
 ↓
Lambda
 ↓
Failure
 ↓
Message becomes visible again
 ↓
Lambda processes again
```

I configure:

* **Visibility timeout**
* **Maximum receive attempts**
* **Dead-letter queue**

Example:

```text
SQS
 ↓
Lambda
 ↓
Fail
 ↓
Retry
 ↓
Fail
 ↓
Retry
 ↓
Max attempts reached
 ↓
DLQ
```

The important point is:

> **SQS handles message redelivery; Lambda processes the message.**

---

## 3. Synchronous invocation

For example:

```text
CWD
 ↓
Lambda
 ↓
Timeout / transient error
```

The **calling application** handles the retry:

```text
CWD
 ↓
Lambda
 ↓
Failure
 ↓
Backoff + jitter
 ↓
Retry
 ↓
Success
```

I use a bounded retry policy, for example:

```text
Maximum attempts = 3
```

rather than retrying forever.

---

## 4. Exponential backoff + jitter

I don't retry immediately:

```text
❌ Retry → Retry → Retry
```

Instead:

```text
Attempt 1
   ↓
100 ms
   ↓
Attempt 2
   ↓
200 ms
   ↓
Attempt 3
   ↓
400 ms
```

And add **jitter** so multiple requests don't retry simultaneously.

---

## 5. Retry only transient failures

### Retry

* 429 / throttling
* Temporary network error
* 5xx service error
* Temporary service unavailable

### Don't automatically retry

* Invalid input
* Invalid parameters
* Authentication failure
* Authorization failure
* Business validation failure

---

# CWD example

Suppose:

```text
Customer Briefing
      ↓
IT Delegator
      ↓
Incident Worker
      ↓
Lambda
      ↓
ServiceNow
```

ServiceNow returns `503`:

```text
503
 ↓
Retry #1
 ↓
Backoff + jitter
 ↓
Retry #2
 ↓
Backoff + jitter
 ↓
Retry #3
 ↓
Still failing?
 ↓
DLQ / failure state
 ↓
Delegator
```

The **Delegator** then decides what to do.

If the Worker is optional:

```text
Sales Worker ✅
Incident Worker ❌
      ↓
Partial response
```

If the Worker is mandatory, the workflow can fail or pause for recovery.

## 🎯 Strong interview answer

> **“I retry Lambda based on the invocation model. For asynchronous invocations, AWS provides automatic retries with configurable failure handling. For SQS-triggered Lambda, SQS redelivers failed messages and I use a DLQ after the maximum receive attempts. For synchronous Lambda calls, the calling service implements bounded retries with exponential backoff and jitter. I retry only transient failures such as throttling or temporary 5xx errors. After retries are exhausted, I use DLQ or failure handling, and in CWD the Delegator determines whether the failed Worker is mandatory or optional.”**

## Easy memory trick

**Async → AWS retry**
**SQS → Redeliver**
**Sync → Caller retry**
**All → Backoff + Jitter + Max retries**
