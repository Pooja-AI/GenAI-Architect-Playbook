# How would you replay failed CWD requests?

I would **replay a failed request from the DLQ after fixing the root cause**, while preserving the original `job_id` / `correlation_id` and using idempotency to prevent duplicate business operations.

```text
Main SQS
   ↓
Worker
   ↓
FAIL
   ↓
Retry
   ↓
DLQ
   ↓
Investigate
   ↓
Fix root cause
   ↓
Validate message
   ↓
Replay
   ↓
Main SQS
   ↓
Worker
   ↓
Success
```

## 1. Identify the failed request

DLQ message contains information such as:

```json
{
  "job_id": "JOB-12345",
  "worker": "IncidentWorker",
  "customer_id": "CUST-100",
  "correlation_id": "RUN-789",
  "attempt": 5,
  "error": "ServiceNow timeout"
}
```

I first investigate **why it failed**.

---

## 2. Fix the root cause

For example:

```text
ServiceNow outage → Service restored
Worker bug       → Deploy fix
Bad configuration → Correct configuration
Temporary 429    → Capacity recovered
```

I don't blindly replay while the underlying problem still exists.

---

## 3. Validate the message

Before replaying, check:

* Is the payload still valid?
* Is the customer/request still authorized?
* Is the downstream system available?
* Is the request still relevant?
* Has the operation already completed?

This is especially important for **old requests**.

---

## 4. Check idempotency

Suppose the original Worker actually succeeded but crashed before acknowledging SQS.

```text
Salesforce update → SUCCESS
Worker → CRASH
SQS → message goes to DLQ
```

Before replaying:

```text
JOB-12345
    ↓
DynamoDB
    ↓
COMPLETED?
    ↓
YES → Don't execute again
```

This prevents duplicate business operations.

---

## 5. Replay to the main queue

After validation:

```text
DLQ
 ↓
Replay service / controlled operator action
 ↓
Main SQS
 ↓
Worker
```

I prefer **controlled replay**, not automatically replaying thousands of DLQ messages at once.

---

## 6. Control replay rate

Suppose the DLQ contains 10,000 failed messages.

Don't do:

```text
10,000 messages
      ↓
10,000 Workers
      ↓
Salesforce ❌
```

Instead:

```text
DLQ
 ↓
Controlled replay
 ↓
SQS
 ↓
10–20 Workers
 ↓
Salesforce
```

This protects downstream systems.

---

## 7. Monitor the replay

Track:

```text
DLQ depth
Replay rate
Success rate
Failure rate
Retry count
P95/P99 latency
Downstream errors
```

If failures start increasing again:

```text
Pause replay
   ↓
Investigate
```

---

# CWD example

Suppose:

```text
Customer Worker
      ↓
MCP
      ↓
ServiceNow
      ↓
503
```

After several retries:

```text
DLQ
 ↓
100 failed jobs
```

ServiceNow becomes healthy.

I would:

```text
1. Confirm ServiceNow is healthy
2. Check one sample message
3. Check idempotency status
4. Replay a small batch
5. Monitor success/error rate
6. Gradually increase replay rate
7. Stop when all valid messages are processed
```

---

# Important distinction: Retry vs Replay

**Retry:**

```text
Automatic
↓
Same processing attempt
↓
Transient failure
```

**Replay:**

```text
Controlled recovery
↓
Message already moved to DLQ
↓
Root cause fixed
↓
Put message back for processing
```

### 🎯 Strong interview answer

> **“For CWD, I would replay failed requests from the DLQ only after identifying and fixing the root cause. I would validate the message, authorization, downstream availability, and current business state, then check the idempotency key to ensure the operation wasn't already completed. After that, I would move the message back to the main SQS queue and process it at a controlled rate. I would start with a small batch, monitor success and downstream error rates, and gradually increase the replay rate. This avoids creating another downstream spike or duplicate business operations.”**

### Easy memory trick

**DLQ → Investigate → Fix → Validate → Idempotency → Replay → Monitor**
