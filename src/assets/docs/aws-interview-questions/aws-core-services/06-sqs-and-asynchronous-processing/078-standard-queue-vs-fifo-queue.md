# Standard Queue vs FIFO Queue in SQS

The main difference is **ordering and duplicate handling**.

| Feature            | Standard Queue             | FIFO Queue                                                       |
| ------------------ | -------------------------- | ---------------------------------------------------------------- |
| Ordering           | Best-effort ordering       | Strict ordering                                                  |
| Throughput         | Very high                  | Lower / more controlled                                          |
| Duplicate delivery | Possible                   | Designed for exactly-once processing with deduplication features |
| Deduplication      | Application must handle it | Built-in deduplication                                           |
| Use case           | General async processing   | Ordered business operations                                      |

## 1. Standard Queue

Use when **ordering is not important**.

```text
SQS
 ↓
Worker 1
Worker 2
Worker 3
Worker 4
```

Messages can be processed concurrently.

### CWD example

Suppose you have:

```text
Customer 101 → Fetch CRM data
Customer 102 → Fetch CRM data
Customer 103 → Fetch CRM data
```

The order doesn't matter.

So I would use **Standard SQS**.

---

## 2. FIFO Queue

Use when **order matters**.

Example:

```text
1. Create customer
2. Update customer
3. Delete customer
```

You don't want:

```text
Delete
 ↓
Create
 ↓
Update
```

You want:

```text
Create → Update → Delete
```

FIFO preserves the required ordering within a **message group**.

### CWD example

Suppose multiple operations for the same customer must execute sequentially:

```text
Customer-101
   ↓
Create Case
   ↓
Update Case
   ↓
Close Case
```

You could use:

```text
MessageGroupId = Customer-101
```

Messages for that group are processed in order.

---

# Important: FIFO does NOT mean everything is globally sequential

You can have:

```text
Customer-101 → Group A
Customer-102 → Group B
Customer-103 → Group C
```

Each group maintains order while different groups can be processed concurrently.

```text
Group A:  A1 → A2 → A3
Group B:  B1 → B2 → B3
Group C:  C1 → C2 → C3
          ↓
      Parallel groups
```

This gives you **ordering + parallelism**.

---

# Which would I use in CWD?

### Standard

For:

* Document processing
* RAG ingestion
* Independent Worker jobs
* Batch processing
* Async enrichment
* Independent requests

```text
Request → Standard SQS → Workers
```

### FIFO

For:

* Ordered updates
* Sequential business transactions
* Operations where duplicate processing must be tightly controlled
* Per-customer/per-account ordered workflows

```text
Customer 101
    ↓
FIFO
    ↓
Create → Update → Close
```

## 🎯 Strong interview answer

> **“I would use a Standard SQS queue when messages are independent and strict ordering is not required. It provides high throughput and supports massive parallel processing. I would use FIFO when business correctness requires ordered processing or built-in deduplication. In CWD, document processing could use Standard SQS, while sequential operations for the same customer or case could use FIFO with a MessageGroupId. I would still design Workers to be idempotent because queue-based systems should not depend solely on deduplication.”**

### Easy memory trick

**Standard = Scale**

**FIFO = Sequence**

### Key distinction

> **Standard:** “Process as much as possible.”

> **FIFO:** “Process in the required order.”
