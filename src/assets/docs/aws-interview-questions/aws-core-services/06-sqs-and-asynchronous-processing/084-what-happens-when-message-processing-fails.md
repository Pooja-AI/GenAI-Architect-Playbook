# What happens when message processing fails?

In CWD, I would use **retry + visibility timeout + exponential backoff + DLQ**.

```text
SQS
 ↓
Worker receives message
 ↓
Processing fails
 ↓
Don't delete message
 ↓
Visibility timeout expires
 ↓
Message becomes visible again
 ↓
Worker retries
 ↓
 ┌───────────────┐
 │ Success?      │
 └───────┬───────┘
       YES │ NO
          ↓   ↓
       Delete  Retry
                ↓
          Max retries?
             ↓ YES
             DLQ
```

## Step-by-step

### 1. Worker receives the message

```text
SQS → Worker
```

The message becomes invisible because of the **visibility timeout**.

---

### 2. Worker processing fails

For example:

```text
Worker
  ↓
MCP
  ↓
ServiceNow
  ↓
Timeout / 5xx
```

The Worker should **not delete the SQS message**.

---

### 3. Visibility timeout expires

Suppose:

```text
Visibility timeout = 60 seconds
```

If the Worker doesn't successfully complete the job:

```text
60 sec
 ↓
Message becomes visible again
 ↓
Worker can receive it again
```

---

### 4. Retry with backoff

I don't want immediate repeated calls to ServiceNow:

```text
Retry → Retry → Retry → Retry
```

Instead:

```text
Attempt 1 → wait
Attempt 2 → wait longer
Attempt 3 → wait longer
```

Use **exponential backoff + jitter**.

Example concept:

```text
1st retry → ~2 sec
2nd retry → ~4 sec
3rd retry → ~8 sec
```

Actual values are configurable.

---

### 5. Maximum retry attempts

Suppose the message keeps failing:

```text
Attempt 1 ❌
Attempt 2 ❌
Attempt 3 ❌
Attempt 4 ❌
Attempt 5 ❌
```

After the configured failure threshold, I route it to a **Dead-Letter Queue (DLQ)**.

```text
Main Queue
    ↓
Worker
    ↓
Retry
    ↓
Retry
    ↓
Retry
    ↓
DLQ
```

---

## 6. Investigate the DLQ

The DLQ allows operations teams to investigate:

```text
job_id
error
Worker
correlation_id
timestamp
failure count
```

Then we can fix the underlying issue and potentially **replay** the message.

---

# Important: not every error should be retried

### Retry transient errors

Examples:

```text
429 throttling
503 Service Unavailable
temporary network failure
temporary downstream timeout
```

### Don't blindly retry permanent errors

Examples:

```text
Invalid input
Invalid customer_id
Unauthorized request
Malformed payload
Business validation failure
```

These may go directly to failure handling/DLQ depending on the design.

---

# CWD example

Suppose:

```text
Customer Worker
      ↓
MCP
      ↓
Salesforce
      ↓
503 Service Unavailable
```

Flow:

```text
SQS
 ↓
Worker
 ↓
Salesforce 503
 ↓
Retry + exponential backoff
 ↓
Salesforce
 ↓
Success
 ↓
Delete message
```

If Salesforce remains unavailable:

```text
Retry 1 ❌
Retry 2 ❌
Retry 3 ❌
 ↓
DLQ
```

---

## Idempotency is still important

A Worker might successfully update Salesforce but crash **before deleting the SQS message**.

Then the message can be delivered again.

That's why:

```text
SQS retry
   +
Idempotency
```

work together.

The second Worker sees:

```text
JOB-123 = COMPLETED
```

and doesn't perform the business operation again.

---

# 🎯 Strong interview answer

> **“When a CWD Worker fails, I don't delete the SQS message. The visibility timeout eventually expires and the message becomes available for retry. For transient failures such as throttling, temporary network errors, or 5xx responses, I use bounded retries with exponential backoff and jitter. If the message continues to fail after the configured retry threshold, I move it to a Dead-Letter Queue for investigation and possible replay. I also use idempotency so that if a message is delivered again after a partial failure, the downstream Salesforce or ServiceNow operation isn't duplicated.”**

### Easy memory trick

**Fail → Don't Delete → Visibility Timeout → Retry → Backoff → DLQ**

### Key distinction

**Retry** handles temporary failures.

**DLQ** handles repeatedly failed messages.

**Idempotency** prevents retries from creating duplicate business operations.
