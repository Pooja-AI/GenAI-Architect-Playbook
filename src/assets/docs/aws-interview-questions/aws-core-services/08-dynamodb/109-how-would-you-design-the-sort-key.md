# How would you design the Sort Key?

For CWD, I would use the **sort key to organize related items within one workflow/run** and make common queries efficient.

If my partition key is:

```text
PK = TENANT#ON#RUN#RUN123
```

I can design the sort key as:

```text
SK = <ENTITY_TYPE>#<ENTITY_ID>
```

### Example

```text
PK = TENANT#ON#RUN#RUN123

SK = METADATA
SK = WORKER#CUSTOMER
SK = WORKER#SALES
SK = WORKER#INCIDENT
SK = CHECKPOINT#001
SK = CHECKPOINT#002
```

Then:

```text
Query:
PK = TENANT#ON#RUN#RUN123
```

returns all related workflow information.

---

## 1. Worker status

```text
SK = WORKER#CUSTOMER
SK = WORKER#SALES
SK = WORKER#INCIDENT
```

Example:

```text
WORKER#INCIDENT
status = FAILED
retry_count = 2
error = TIMEOUT
```

---

## 2. Checkpoints

For multiple checkpoints, I would make the sort key naturally ordered:

```text
SK = CHECKPOINT#0001
SK = CHECKPOINT#0002
SK = CHECKPOINT#0003
```

Then DynamoDB's sort-key ordering helps retrieve them sequentially.

---

## 3. Events / execution history

If I need execution history:

```text
SK = EVENT#2026-09-24T21:20:01Z
SK = EVENT#2026-09-24T21:20:05Z
SK = EVENT#2026-09-24T21:20:10Z
```

I can query a specific range:

```text
PK = TENANT#ON#RUN#RUN123
SK begins_with "EVENT#"
```

or use a range condition for timestamps.

---

## 4. Hierarchical sort keys

For more complex CWD state:

```text
SK =
WORKER#SALES#STEP#01

WORKER#SALES#STEP#02

WORKER#INCIDENT#STEP#01
```

This lets me query specific groups:

```text
begins_with(SK, "WORKER#SALES")
```

and retrieve all Sales Worker records.

---

## 5. Don't make the sort key too complicated

I wouldn't put every possible attribute into the key.

Keep it focused on **query patterns**.

```text
Good:
WORKER#SALES

Good:
EVENT#2026-09-24T21:20:01Z

Avoid:
WORKER#SALES#USER#123#MODEL#XYZ#TOKEN#5000#...
```

---

## 🎯 Strong interview answer

> **“I design the sort key based on how I need to query related records within a CWD workflow. For example, with `PK = TENANT#tenantId#RUN#runId`, I can use sort keys such as `METADATA`, `WORKER#CUSTOMER`, `WORKER#SALES`, `WORKER#INCIDENT`, and `CHECKPOINT#0001`. For execution history, I can use timestamp-based keys such as `EVENT#timestamp`. This gives me efficient prefix and range queries while keeping the key simple and aligned with access patterns.”**

### Easy memory trick

**Sort Key = Organize + Filter + Order**

### Key distinction

**Partition key → Which partition/workflow?**
**Sort key → Which related item and in what logical order?**
