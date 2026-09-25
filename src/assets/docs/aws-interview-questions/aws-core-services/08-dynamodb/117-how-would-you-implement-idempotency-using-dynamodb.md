# How would you implement idempotency using DynamoDB?

For CWD, I would use a **unique idempotency key + DynamoDB conditional write** so that only one Worker can claim a business operation.

### CWD flow

```text
SQS Message
    ↓
Worker
    ↓
Generate / extract idempotency_key
    ↓
DynamoDB conditional write
    ↓
┌───────────────────────────┐
│ Key already exists?       │
└───────────────────────────┘
      ↓              ↓
     YES             NO
      ↓              ↓
Don't execute    Claim operation
      ↓              ↓
Return existing   Call Salesforce/
result             ServiceNow
                       ↓
                  Mark COMPLETED
```

## 1. Create a unique key

For example:

```text
idempotency_key = CUST123-CREATE-TICKET-456
```

The key should represent the **business operation**, not just the HTTP request.

---

## 2. Atomically claim the operation

Create an item in DynamoDB:

```text
PK = IDEMPOTENCY#CUST123-CREATE-TICKET-456

status = PROCESSING
created_at = ...
```

Use:

```text
ConditionExpression:
attribute_not_exists(PK)
```

This is important because the check and insert happen atomically.

---

## 3. First Worker wins

```text
Worker A → Conditional Put → SUCCESS ✅
Worker B → Conditional Put → ConditionalCheckFailed ❌
```

Only Worker A executes the business operation.

---

## 4. Store the result

After successful processing:

```text
PK = IDEMPOTENCY#ABC123

status = COMPLETED
result_reference = ...
completed_at = ...
```

Then if the same request arrives again:

```text
ABC123 already exists
        ↓
status = COMPLETED
        ↓
Return existing result
```

No duplicate Salesforce/ServiceNow operation.

---

## 5. Handle Worker crashes

Suppose:

```text
DynamoDB → PROCESSING
        ↓
Worker calls Salesforce
        ↓
Salesforce succeeds
        ↓
Worker crashes before marking COMPLETED
```

The message may be delivered again.

The new Worker sees:

```text
status = PROCESSING
```

You shouldn't blindly execute the operation again.

Use a **lease/expiration timestamp** and, ideally, downstream idempotency support:

```text
PROCESSING
   ↓
lease expires
   ↓
reclaim/reconcile
   ↓
check downstream result
   ↓
complete safely
```

This is especially important for operations with external side effects.

---

## 6. Add TTL

For temporary idempotency records:

```text
PK = IDEMPOTENCY#ABC123
status = COMPLETED
ttl = <expiration timestamp>
```

After the retention period, DynamoDB can clean up the record.

---

## 🎯 Strong interview answer

> **“I implement idempotency in CWD by generating a unique business-operation idempotency key and storing it in DynamoDB using a conditional write such as `attribute_not_exists(PK)`. The first Worker successfully claims the key and processes the operation. A duplicate Worker gets a conditional-check failure and doesn't execute the business operation again. After successful processing, I update the record to `COMPLETED` and store the result reference. For crashes during processing, I use a lease or expiration mechanism and reconcile the downstream operation before retrying. I can use TTL to clean up old idempotency records.”**

### Easy memory trick

**Key → Claim → Process → Complete → Reuse**

### Key distinction

**Deduplication:** “Have I seen this message before?”

**Idempotency:** “If I receive it again, can I safely avoid performing the business operation twice?”

For CWD, DynamoDB conditional writes give you the **atomic claim** needed to implement this safely.
