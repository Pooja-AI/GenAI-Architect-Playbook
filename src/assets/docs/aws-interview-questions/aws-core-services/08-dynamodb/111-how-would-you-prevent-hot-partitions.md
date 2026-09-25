# How would you prevent hot partitions in DynamoDB?

A **hot partition** happens when too much traffic is concentrated on the same partition key.

For CWD, I would prevent this mainly through **high-cardinality keys, good access-pattern design, and write distribution**.

### 1. Avoid a constant partition key

❌ Bad:

```text
PK = CWD
```

All requests go to the same partition.

✅ Better:

```text
PK = TENANT#ON#SESSION#S123
PK = TENANT#ON#SESSION#S124
PK = TENANT#ON#SESSION#S125
```

Traffic is distributed across many partition-key values.

---

### 2. Use high-cardinality identifiers

Good partition-key candidates:

```text
tenant_id
session_id
run_id
customer_id
```

Avoid low-cardinality values such as:

```text
status = RUNNING
region = US
type = WORKER
```

because many requests could target the same value.

---

### 3. Avoid one extremely busy workflow partition

Suppose one CWD run generates thousands of Worker events:

```text
PK = RUN123
```

and everything is written to that partition:

```text
RUN123
 ├── Worker1
 ├── Worker2
 ├── Worker3
 ├── Event1
 ├── Event2
 ├── Event3
 └── ...
```

That can become a hotspot.

For very high-volume execution history, I could distribute writes using a bucket/shard:

```text
PK = RUN123#BUCKET#0
PK = RUN123#BUCKET#1
PK = RUN123#BUCKET#2
```

For example, hash the event ID and select one of 10 buckets.

---

### 4. Don't use timestamps alone as the partition key

❌

```text
PK = 2026-09-24
```

A huge number of requests on the same day could concentrate traffic.

Instead:

```text
PK = TENANT#ON#RUN#R123
SK = EVENT#2026-09-24T21:30:15Z
```

---

### 5. Use adaptive capacity, but don't depend on it

DynamoDB provides mechanisms to handle uneven traffic, but I still design the keys correctly.

My first defense is:

```text
Good access pattern
        ↓
High-cardinality partition key
        ↓
Distributed traffic
        ↓
Adaptive capacity
```

---

### 6. Monitor for hotspots

I would monitor DynamoDB/CloudWatch metrics such as:

* Throttled requests
* Read/write throttling
* Consumed read/write capacity
* Latency
* Hot partition behavior

If throttling occurs, I investigate whether a particular partition key is receiving disproportionate traffic.

---

## CWD example

A good design could be:

```text
PK = TENANT#ON#SESSION#S123
SK = TASK#T456#RUN#R789
```

For normal workflow state, this is fine because sessions/runs naturally distribute traffic.

For **very high-volume event logging**, I wouldn't force every event into one hot partition. I would distribute event records using buckets or a separate event-storage pattern.

---

## 🎯 Strong interview answer

> **“I prevent DynamoDB hot partitions by designing high-cardinality partition keys based on access patterns. I avoid low-cardinality keys such as a constant CWD key or status-based keys. For CWD, session or run identifiers provide good distribution. If a single high-volume run generates excessive event writes, I can introduce write sharding or buckets to distribute those writes across multiple partition keys. I also monitor throttling and capacity metrics to identify hotspots and adjust the data model when necessary.”**

### Easy memory trick

**High Cardinality → Distribute → Shard if needed → Monitor**

### Key distinction

**Partition key design prevents hotspots.**
**Auto scaling increases capacity.**

You should fix a poor key design rather than simply adding more capacity.
