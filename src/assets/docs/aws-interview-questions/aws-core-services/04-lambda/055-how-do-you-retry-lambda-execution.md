# How do you retry Lambda execution?

## Short answer

Lambda retry depends on **how the function is invoked**.

There are 3 common approaches:

1. **Asynchronous invocation** → Lambda can automatically retry.
2. **SQS/Event source** → SQS redelivers the message.
3. **Synchronous invocation** → Your application must implement the retry.

---

## 1. Asynchronous Lambda invocation

Example:

```text
EventBridge
     ↓
Lambda
     ↓
Failure
     ↓
Lambda retry
     ↓
Failure
     ↓
DLQ / destination
```

AWS can automatically retry asynchronous Lambda invocations.

For example:

```text
EventBridge → Lambda
                  ↓
               Failure
                  ↓
               Retry
```

You can configure retry behavior and failure destinations/DLQ.

---

## 2. SQS + Lambda

This is very useful for CWD.

```text
SQS
 ↓
Lambda
 ↓
Failure
 ↓
Message becomes available again
 ↓
Lambda retries
```

The important point is:

> **SQS owns the message and controls redelivery; Lambda processes the message.**

You can configure:

* Visibility timeout
* Maximum receives
* Dead-letter queue

Example:

```text
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
Retry
 ↓
Maximum receives
 ↓
DLQ
```

---

## 3. Synchronous invocation

Example:

```text
API Gateway
     ↓
Lambda
     ↓
Failure
```

For synchronous calls, I would normally implement the retry policy in the **calling application/service**, rather than blindly retrying inside Lambda.

For example:

```text
CWD
 ↓
Lambda
 ↓
Timeout
 ↓
Retry with backoff + jitter
 ↓
Lambda
```

Use a **bounded number of retries**.

---

# 4. Exponential backoff + jitter

Don't do:

```text
Retry immediately
Retry immediately
Retry immediately
```

Instead:

```text
Attempt 1
   ↓
wait 100 ms
   ↓
Attempt 2
   ↓
wait 200 ms
   ↓
Attempt 3
   ↓
wait 400 ms
```

Add **jitter** so many requests don't retry at exactly the same time.

---

# 5. Don't retry permanent errors

For example:

```text
Invalid customer_id
```

Retrying won't fix it.

Similarly:

* Invalid request
* Authentication failure
* Authorization failure
* Invalid parameters
* Business validation failure

should generally **not** be retried automatically.

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

ServiceNow temporarily returns `503`.

I would do:

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

If the Incident Worker is **optional**, the Delegator could continue with the Sales Worker and return a partial response.

If it's **mandatory**, the workflow could fail or pause for recovery.

---

## 🎯 Strong interview answer

> **“I choose the retry mechanism based on the invocation type. For asynchronous Lambda invocations, AWS can automatically retry and I configure failure handling such as DLQs or destinations. For SQS-triggered Lambda, SQS provides redelivery and I configure visibility timeout, maximum receives and a DLQ. For synchronous Lambda calls, the calling service implements bounded retries with exponential backoff and jitter. I only retry transient failures such as throttling or temporary service unavailability; I don't retry permanent errors such as invalid requests or authorization failures. In CWD, after retries are exhausted, the Delegator decides whether the Worker failure is mandatory or optional.”**

## Easy memory trick

**Async → AWS retry**

**SQS → Message redelivery**

**Sync → Caller retry**

**Always → Backoff + Jitter + Max retries + DLQ where applicable**
