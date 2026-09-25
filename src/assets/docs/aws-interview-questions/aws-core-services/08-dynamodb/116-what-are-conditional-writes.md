# What are Conditional Writes in DynamoDB?

A **conditional write** means:

> **“Update this DynamoDB item only if a specific condition is true.”**

If the condition is false, DynamoDB **does not perform the update**.

### Simple example

Suppose CWD has:

```text
status = PROCESSING
version = 5
```

Worker wants to mark it completed.

```text
Update:
status = COMPLETED
version = 6

Condition:
version = 5
```

If version is still `5`:

```text
Condition TRUE
      ↓
Update succeeds ✅
```

If another Worker already changed it to version `6`:

```text
Condition FALSE
      ↓
Update rejected ❌
```

This prevents one Worker from accidentally overwriting another Worker's update.

---

## CWD idempotency example

Suppose two Workers receive the same SQS message:

```text
        SQS
         ↓
    ┌────┴────┐
    ↓         ↓
Worker A   Worker B
    ↓         ↓
    └────┬────┘
         ↓
     DynamoDB
```

Worker A tries:

```text
idempotency_key = ABC123
```

with:

```text
attribute_not_exists(idempotency_key)
```

Worker A succeeds:

```text
ABC123 → PROCESSING ✅
```

Worker B tries the same operation:

```text
ABC123 already exists
        ↓
Condition fails ❌
        ↓
Don't execute duplicate operation
```

This protects downstream systems such as **Salesforce or ServiceNow** from duplicate business operations.

---

## Common conditional operations

### Create only if it doesn't exist

```text
attribute_not_exists(PK)
```

Useful for **idempotency**.

### Update only if version matches

```text
version = 5
```

Useful for **optimistic locking**.

### Update only if status is correct

```text
status = PROCESSING
```

Useful for **workflow state transitions**.

---

## 🎯 Strong interview answer

> **“A conditional write in DynamoDB means the write happens only when a specified condition is satisfied. In CWD, I use it for concurrency control and idempotency. For example, I can update a Worker record only when the version is still 5, preventing another Worker from overwriting a newer update. I can also use `attribute_not_exists` to atomically claim an idempotency key so duplicate SQS messages don't cause duplicate Salesforce or ServiceNow operations.”**

### Easy memory trick

**Check → Write if true → Reject if false**

### Key distinction

**Normal write:** “Write this value.”

**Conditional write:** “Write this value **only if this condition is true**.”
