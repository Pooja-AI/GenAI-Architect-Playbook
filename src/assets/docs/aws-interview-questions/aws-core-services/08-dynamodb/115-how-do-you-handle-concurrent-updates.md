# How do you handle concurrent updates in DynamoDB?

For CWD, I would use **conditional writes and optimistic locking** to prevent two Workers from incorrectly updating the same state at the same time.

### Example problem

Suppose two Workers update the same run:

```text
              RUN123
             /      \
     Worker A        Worker B
     status=         status=
     PROCESSING      PROCESSING
          \            /
           ↓          ↓
            DynamoDB
```

Without protection, one update could overwrite the other.

---

## 1. Use conditional writes

For example, only allow a Worker to change:

```text
PROCESSING → COMPLETED
```

if the current state is still `PROCESSING`.

Conceptually:

```text
UPDATE RUN123
SET status = COMPLETED
WHERE status = PROCESSING
```

If another Worker already changed it, the condition fails.

---

## 2. Use optimistic locking with a version

Store:

```text
version = 5
```

Worker A reads version 5.

Worker B also reads version 5.

Worker A updates:

```text
version 5 → 6
```

Worker B tries:

```text
version 5 → 6
```

DynamoDB rejects Worker B because the version is no longer 5.

```text
Worker A → version 5 → 6 ✅
Worker B → version 5 → 6 ❌
```

Worker B can then re-read the latest state and decide whether to retry.

---

## 3. Use atomic counters when appropriate

If multiple Workers need to update a counter:

```text
retry_count
worker_count
completed_count
```

I would use DynamoDB's atomic update operations rather than:

```text
Read → Add 1 → Write
```

because two Workers could read the same value.

---

## 4. Use transactions when multiple items must change together

For example:

```text
Run status
+
Idempotency record
```

If both must be updated consistently, DynamoDB transactions can update multiple items atomically.

---

## CWD example

Suppose:

```text
IncidentWorker A → COMPLETED
IncidentWorker B → COMPLETED
```

Both accidentally process the same request.

I would use:

```text
Idempotency key
       ↓
Conditional Put
       ↓
Only one Worker claims operation
       ↓
Other Worker receives conditional failure
       ↓
Does not execute duplicate business operation
```

This is especially important before calling:

```text
Salesforce
ServiceNow
```

because duplicate writes could create duplicate business transactions.

---

## 🎯 Strong interview answer

> **“For concurrent CWD updates, I use DynamoDB conditional writes and optimistic locking. Each state record can have a version number, and an update succeeds only if the version I read is still current. For operations that must be executed only once, such as Salesforce or ServiceNow updates, I use an idempotency key with an atomic conditional write. For multiple related records that must change together, I can use DynamoDB transactions. If a conditional update fails, the Worker re-reads the latest state and decides whether to retry.”**

### Easy memory trick

**Condition → Version → Atomic Update → Transaction → Retry**

### Key distinction

**Optimistic locking prevents conflicting updates.**

**Idempotency prevents duplicate business operations.**

In CWD, you often need **both**.
