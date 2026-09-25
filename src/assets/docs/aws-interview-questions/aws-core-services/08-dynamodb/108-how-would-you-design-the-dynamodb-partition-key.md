# How would you design the DynamoDB partition key?

For CWD, I would design the partition key around the **main access pattern**, not simply around the data type.

For workflow state, a good design is:

```text
PK = TENANT#<tenant_id>#RUN#<run_id>
SK = <entity_type>#<entity_id>
```

Example:

```text
PK = TENANT#ONsemi#RUN#RUN123

SK = METADATA
SK = WORKER#CUSTOMER
SK = WORKER#SALES
SK = WORKER#INCIDENT
SK = CHECKPOINT#001
```

### Example table

| PK                  | SK                | Data                 |
| ------------------- | ----------------- | -------------------- |
| `TENANT#ON#RUN#123` | `METADATA`        | intent, user, status |
| `TENANT#ON#RUN#123` | `WORKER#CUSTOMER` | status, start/end    |
| `TENANT#ON#RUN#123` | `WORKER#SALES`    | status, retry        |
| `TENANT#ON#RUN#123` | `WORKER#INCIDENT` | status, error        |
| `TENANT#ON#RUN#123` | `CHECKPOINT#001`  | completed steps      |

This gives me an efficient query:

```text
Get all information for RUN123
        ↓
Query PK = TENANT#ON#RUN#123
        ↓
Metadata + Workers + Checkpoints
```

## Why not use just `run_id`?

You could use:

```text
PK = RUN123
```

But I prefer including the **tenant** when CWD is multi-tenant because it gives a clear tenant boundary and supports access-control/query patterns.

## Avoid hot partitions

I would also make sure the partition key has enough cardinality.

Bad:

```text
PK = CWD
```

Almost all traffic goes to one partition → potential hot partition.

Better:

```text
PK = TENANT#ON#RUN#123
PK = TENANT#ON#RUN#124
PK = TENANT#ON#RUN#125
```

Requests are distributed across many partition-key values.

### For idempotency

I would use a separate item/key pattern:

```text
PK = IDEMPOTENCY#<idempotency_key>
```

Then use a **conditional write**:

```text
Put item
IF attribute_not_exists(PK)
```

This prevents two Workers from claiming the same operation simultaneously.

---

## 🎯 Strong interview answer

> **“I design the DynamoDB partition key based on CWD's access patterns. For workflow state, I would typically use a composite partition key such as `TENANT#tenantId#RUN#runId`, with a sort key for metadata, Workers, and checkpoints. This allows me to retrieve the complete state of a workflow efficiently while providing good partition distribution. I avoid low-cardinality keys such as a constant `CWD` because they can create hot partitions. For idempotency, I use a separate idempotency-key item with conditional writes.”**

### Easy memory trick

**Access pattern → High cardinality → Even distribution → Efficient query**

### Key distinction

**Partition key = decides where the item is distributed.**
**Sort key = organizes related items within that partition.**
