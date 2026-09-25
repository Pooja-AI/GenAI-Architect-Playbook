# How do you handle message duplication?

In CWD, I assume **duplicate messages can happen**, especially with SQS. I handle them using **idempotency** rather than assuming every message is delivered only once.

```text
SQS Message
     ↓
Worker
     ↓
Extract job_id / idempotency_key
     ↓
Check DynamoDB
     ↓
Already processed?
   ↙          ↘
 YES           NO
  ↓             ↓
Skip          Process
                ↓
          MCP / Salesforce
                ↓
          Mark COMPLETED
```

## 1. Give every job a unique ID

When the Delegator creates a job:

```json
{
  "job_id": "JOB-12345",
  "customer_id": "CUST-100",
  "operation": "UPDATE_CASE"
}
```

`job_id` becomes the **idempotency key**.

---

## 2. Check DynamoDB before processing

Worker receives:

```text
JOB-12345
```

It checks:

```text
DynamoDB:
JOB-12345 → COMPLETED
```

Then:

```text
Already processed
      ↓
Skip business operation
```

No second Salesforce update.

---

## 3. Use atomic conditional writes

The important part is that the check and reservation shouldn't have a race condition.

Conceptually:

```text
Put JOB-12345
ONLY IF job_id does not already exist
```

If another Worker already claimed it:

```text
Conditional write fails
        ↓
Duplicate detected
        ↓
Don't process again
```

This is safer than:

```text
if not exists:
    process()
```

because two Workers could otherwise check at the same time.

---

## 4. Make downstream operations idempotent

For example, instead of blindly:

```text
Create Salesforce Case
```

use an idempotency/reference key:

```text
CWD_JOB_ID = JOB-12345
```

The Worker checks whether that operation has already been completed before creating it again.

This is especially important for **side effects** such as:

* Create/update Salesforce record
* Create ServiceNow incident
* Send notification
* Submit transaction

---

## 5. Use SQS FIFO when appropriate

For workflows where ordering and deduplication are important:

```text
FIFO Queue
   ↓
MessageGroupId = customer-100
```

FIFO provides queue-level deduplication capabilities, but I **still implement application-level idempotency**.

Why?

Because deduplication at the queue doesn't replace protection around the actual business operation.

---

## 6. What if Worker crashes after the business operation?

This is a common interview scenario.

```text
Worker
  ↓
Salesforce UPDATE succeeds
  ↓
Worker crashes
  ↓
SQS message becomes visible again
  ↓
Worker receives duplicate
```

The second Worker sees:

```text
JOB-12345 → COMPLETED
```

and doesn't repeat the operation.

---

# 🎯 Strong interview answer

> **“I handle SQS duplication using application-level idempotency. Every CWD job gets a unique job ID or idempotency key. When the Worker receives a message, it atomically checks and records that key in DynamoDB before performing the business operation. If the key has already been completed, the Worker skips the duplicate. For side-effecting operations such as Salesforce or ServiceNow updates, I also pass or persist the idempotency key at the business-operation level. FIFO queues can provide additional ordering and deduplication, but I don't rely on FIFO alone because the downstream operation must also be protected.”**

### Easy memory trick

**ID → Check → Claim → Process → Complete**

### Key distinction

**SQS deduplication** = prevents some duplicate messages.

**Idempotency** = ensures the **business operation is safe even if the message is processed more than once**.

That second point is the important one to mention in an architect interview.
