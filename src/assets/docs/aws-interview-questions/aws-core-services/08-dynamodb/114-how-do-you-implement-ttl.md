# How do you implement TTL in DynamoDB?

DynamoDB TTL (**Time to Live**) automatically removes items after a specified expiration time.

For CWD, I would use TTL for **temporary data** such as session metadata, idempotency records, temporary workflow state, or old execution records.

### 1. Add an expiration attribute

Example:

```text id="1m9k2v"
{
  "PK": "TENANT#ON#SESSION#S123",
  "SK": "METADATA",

  "status": "ACTIVE",

  "ttl": 1790276400
}
```

`ttl` contains a **Unix epoch timestamp in seconds**.

---

### 2. Enable TTL on the table

Configure DynamoDB TTL using the attribute name:

```text id="x4v8qn"
TTL attribute = ttl
```

DynamoDB then identifies expired items and removes them automatically.

---

### 3. Set TTL when creating the item

For example, if I want an idempotency record to live for 24 hours:

```text id="7m2p6c"
current_time
     +
24 hours
     ↓
ttl
```

Conceptually:

```python
ttl = int(time.time()) + 86400
```

---

### 4. CWD example

Suppose a request creates:

```text id="4b9jzs"
PK = IDEMPOTENCY#ABC123
status = COMPLETED
ttl = +24 hours
```

After the retention period, DynamoDB can automatically remove that record.

This prevents the table from growing indefinitely with temporary records.

---

## Important: TTL is not an exact-time deletion mechanism

If:

```text
ttl = 10:00 AM
```

don't design the application assuming the item disappears **exactly at 10:00 AM**.

TTL deletion is asynchronous.

So:

```text
10:00 AM → eligible for deletion
             ↓
       DynamoDB removes it later
```

Therefore, **application logic should not depend on exact deletion time**.

---

## What I would use TTL for in CWD

| Data                                   | TTL?                                   |
| -------------------------------------- | -------------------------------------- |
| Temporary session data                 | ✅                                      |
| Idempotency records                    | ✅                                      |
| Temporary workflow metadata            | ✅                                      |
| Old execution metadata                 | ✅, depending on retention requirements |
| Audit records requiring long retention | ❌                                      |
| Important business records             | ❌                                      |
| Large documents                        | ❌ → S3 lifecycle policies              |

### 🎯 Strong interview answer

> **“I implement DynamoDB TTL by adding an expiration attribute containing a Unix epoch timestamp in seconds and enabling TTL on that attribute at the table level. For CWD, I would use it for temporary session data, idempotency records, and temporary workflow metadata. TTL deletion is asynchronous, so I would never depend on it for exact-time business logic. For large objects in S3, I would use S3 Lifecycle policies instead.”**

### Easy memory trick

**Set timestamp → Enable TTL → DynamoDB cleans up**

### Key distinction

**TTL = automatic cleanup of expired DynamoDB items.**

It is **not** an exact scheduler or guaranteed deletion timestamp.
