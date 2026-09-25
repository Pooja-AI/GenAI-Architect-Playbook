# How do you implement idempotency?

In CWD, I implement idempotency by giving every business operation a **unique idempotency key** and storing its processing state in **DynamoDB**.

```text
Delegator
   ↓
Generate idempotency_key
   ↓
SQS
   ↓
Worker
   ↓
Atomic check in DynamoDB
   ↓
Already processed?
   ├── YES → Return existing result / skip
   └── NO  → Claim key → Process
                    ↓
              MCP / Salesforce
                    ↓
              Mark COMPLETED
```

## 1. Generate a unique key

For example:

```text
idempotency_key = JOB-12345
```

For a business operation, I may construct it from:

```text
tenant_id + customer_id + operation + request_id
```

Example:

```text
ONSEMI + CUST-100 + UPDATE_CASE + REQ-789
```

The key must uniquely represent **one business operation**, not simply every HTTP retry.

---

## 2. Atomically claim the operation

When the Worker receives the SQS message:

```text
Worker
  ↓
DynamoDB
  ↓
Put JOB-12345
ONLY IF it doesn't already exist
```

DynamoDB might contain:

```json
{
  "idempotency_key": "JOB-12345",
  "status": "PROCESSING"
}
```

The conditional write is important because two Workers could receive the same message.

```text
Worker A ──┐
           ├──→ DynamoDB
Worker B ──┘

Only ONE successfully claims JOB-12345
```

---

## 3. Process the operation

After successfully claiming the key:

```text
Worker
  ↓
Validate
  ↓
MCP
  ↓
Salesforce / ServiceNow
```

For example:

```text
Update ServiceNow incident
INC-100
```

---

## 4. Mark it COMPLETED

After successful processing:

```text
DynamoDB

JOB-12345
    status = COMPLETED
    result = ...
```

If the same message arrives again:

```text
Worker
 ↓
DynamoDB
 ↓
JOB-12345 = COMPLETED
 ↓
Don't execute again
```

---

# What if the Worker crashes?

This is the important interview case.

```text
Worker
  ↓
Claim JOB-12345
  ↓
Salesforce update succeeds
  ↓
Worker crashes
  ↓
Message delivered again
```

The Worker checks:

```text
JOB-12345 = COMPLETED
```

and skips the operation.

---

## What if it crashes before completion?

Suppose:

```text
JOB-12345 = PROCESSING
```

and the Worker crashes before calling Salesforce.

You need a **recovery policy**.

For example:

```text
PROCESSING
    ↓
Lease/timeout expires
    ↓
Retry
    ↓
PROCESSING
    ↓
COMPLETED
```

Don't permanently treat `PROCESSING` as completed.

A common pattern is to store:

```text
idempotency_key
status
created_at
updated_at
lease_expiry
result
```

and allow another Worker to reclaim a stale `PROCESSING` record after the lease expires.

---

# Very important: side effects

For operations like:

```text
Create Salesforce case
Create ServiceNow incident
Send payment
Send email
Update database
```

idempotency must protect the **side effect**, not just the SQS message.

For example:

```text
SQS duplicate
      ↓
Worker
      ↓
Idempotency check
      ↓
Already completed?
      ↓
Don't create another ServiceNow incident
```

If the downstream API itself supports an **idempotency key**, pass the same key to it.

---

# Simple CWD implementation

```text
             Delegator
                 ↓
          JOB-12345 created
                 ↓
               SQS
                 ↓
              Worker
                 ↓
       DynamoDB conditional write
          ↙              ↘
   Already exists       New key
        ↓                   ↓
      Skip               Process
                            ↓
                          MCP
                            ↓
                    ServiceNow
                            ↓
                    Mark COMPLETED
```

### 🎯 Strong interview answer

> **“I implement idempotency using a unique idempotency key for every business operation. When the Worker receives an SQS message, it performs an atomic conditional write in DynamoDB to claim that key. If the key already exists in COMPLETED state, the Worker skips the duplicate. If it successfully claims the key, it performs the operation through MCP and then marks the record COMPLETED. I also handle stale PROCESSING records using a lease or timeout so failed Workers can be retried. For side-effecting operations such as Salesforce or ServiceNow updates, I propagate the idempotency key to the downstream system when supported. This makes the operation safe even when SQS delivers a message more than once.”**

### Easy memory trick

**Generate → Claim → Process → Complete → Retry safely**

### Key distinction

**Deduplication:**
“Is this message a duplicate?”

**Idempotency:**
“Even if I process it twice, will the business result remain correct?”
