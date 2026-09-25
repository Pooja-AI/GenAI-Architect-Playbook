# How do you monitor Lambda?

## Short answer
Monitor Lambda with CloudWatch metrics, structured logs and tracing.

## Key points
- Invocations, Errors, Throttles, Duration, ConcurrentExecutions, async event age, iterator age.
- Structured JSON logs; Lambda Insights; X-Ray or OpenTelemetry.
- Alarms on errors, throttles and duration; Powertools for metrics.

## CWD context
Track p95 duration against the function timeout.



# How do you make Lambda execution idempotent?

## Short answer

**Idempotency means: if the same Lambda request executes multiple times, the business operation should happen only once.**

This is important because Lambda can be retried.

```text
Request
  ↓
Lambda
  ↓
Business operation
  ↓
Timeout / retry
  ↓
Same request again
```

Without idempotency:

```text
Update Salesforce
Update Salesforce again ❌
```

With idempotency:

```text
Request ID = ABC123
      ↓
Already processed?
      ↓
YES → Return previous result
```

---

# 1. Generate an idempotency key

Use a unique key for the business operation.

For example:

```text
customer_id = C123
operation = create_case
request_id = ABC123
```

Create:

```text
idempotency_key = ABC123
```

The key should represent the **same logical operation**, not simply every Lambda invocation.

---

# 2. Store the key

For CWD, I could use **DynamoDB**:

```text
DynamoDB

idempotency_key | status     | result
------------------------------------------------
ABC123          | COMPLETED  | CASE456
```

---

# 3. Check before processing

Lambda:

```text id="x2m6r9"
Lambda
  ↓
Check DynamoDB
  ↓
Key exists?
  ├── YES → Return previous result
  │
  └── NO
       ↓
   Process operation
```

---

# 4. Use conditional writes

This is very important when multiple Lambda executions arrive at the same time.

Suppose:

```text
Lambda A ──┐
           ├──→ DynamoDB
Lambda B ──┘
```

Both receive:

```text
request_id = ABC123
```

You don't want both to process it.

Use an **atomic conditional write**:

```text
Put ABC123
ONLY IF ABC123 does not already exist
```

One Lambda succeeds:

```text
Lambda A → Lock/record created → Process
```

The other sees the existing key:

```text
Lambda B → Key exists → Don't process
```

---

# 5. Store processing status

I normally use states such as:

```text
IN_PROGRESS
COMPLETED
FAILED
```

Example:

```text id="a6y8z2"
ABC123
   ↓
IN_PROGRESS
   ↓
Business operation
   ↓
COMPLETED
```

Store the result when appropriate:

```text
ABC123 → COMPLETED → Salesforce Case = INC456
```

If a duplicate request arrives:

```text
ABC123 already COMPLETED
        ↓
Return INC456
```

---

# 6. Handle the tricky case: Lambda crashes

Suppose:

```text id="v4n9c1"
Lambda
 ↓
Create Salesforce Case
 ↓
Salesforce succeeds
 ↓
Lambda crashes before marking DynamoDB COMPLETED
```

Now Lambda is retried.

This is why **idempotency must also exist at the business-operation/API level when possible**.

For example:

```text
CWD request_id = ABC123
       ↓
Salesforce
       ↓
External idempotency key = ABC123
```

Then Salesforce or your adapter can recognize the duplicate operation.

If the downstream system doesn't support idempotency natively, use a durable idempotency record plus carefully designed state transitions/reconciliation.

---

# CWD example

Suppose a Worker creates a ServiceNow ticket:

```text id="n8w5k2"
Coordinator
    ↓
IT Delegator
    ↓
Ticket Worker
    ↓
Lambda
    ↓
ServiceNow
```

Request:

```text
request_id = RUN123-STEP05
```

Lambda checks:

```text
DynamoDB
    ↓
RUN123-STEP05 exists?
```

### First execution

```text
Doesn't exist
    ↓
Create IN_PROGRESS
    ↓
Create ServiceNow ticket
    ↓
Store ticket ID
    ↓
COMPLETED
```

### Retry

```text
RUN123-STEP05 exists
       ↓
COMPLETED
       ↓
Return existing ticket ID
```

So we don't create a duplicate ticket.

---

# Important: Idempotency ≠ retry

They work together:

```text
Retry
  ↓
Same request executes again
  ↓
Idempotency check
  ↓
Prevent duplicate business operation
```

**Retry = try again**

**Idempotency = safely handle trying again**

---

# 🎯 Strong interview answer

> **“I make Lambda idempotent by assigning a unique idempotency key to each logical business operation and storing its processing state in a durable store such as DynamoDB. Before processing, Lambda performs an atomic conditional write to prevent concurrent duplicates. I track states such as IN_PROGRESS and COMPLETED and store the result when appropriate. If the same request is retried, Lambda detects the existing key and returns the previous result instead of executing the business operation again. For critical operations such as Salesforce or ServiceNow updates, I also propagate the idempotency key to the downstream adapter or API when supported.”**

## Easy memory trick

**Key → Check → Lock → Process → Store result**

### Key distinction

> **A Lambda invocation can be retried, so I don't make the invocation itself unique—I make the underlying business operation idempotent.**
