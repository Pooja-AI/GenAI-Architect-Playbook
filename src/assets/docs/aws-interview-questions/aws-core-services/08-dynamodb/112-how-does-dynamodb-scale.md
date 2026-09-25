# How does DynamoDB scale?

DynamoDB scales **horizontally** by distributing data and traffic across partitions. AWS manages the underlying infrastructure for you.

```text id="6p8k2m"
                DynamoDB Table
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   Partition 1   Partition 2   Partition 3
      ↓              ↓             ↓
   Requests       Requests       Requests
```

## 1. Data is distributed across partitions

DynamoDB uses the **partition key** to distribute items.

For CWD:

```text id="q7x3na"
SESSION#S101 → Partition A
SESSION#S102 → Partition B
SESSION#S103 → Partition C
SESSION#S104 → Partition A
```

As data/traffic grows, DynamoDB can distribute it across more physical partitions.

---

## 2. On-demand capacity

For unpredictable CWD traffic, I can use **On-Demand mode**.

```text id="0u9f5p"
Low traffic
   ↓
Low usage/cost

Traffic spike
   ↓
DynamoDB automatically handles increased capacity
```

This is useful when traffic is difficult to predict.

Example:

```text
Normal → 1,000 requests/min
Spike  → 100,000 requests/min
```

---

## 3. Provisioned capacity

If CWD traffic is predictable, I can use **Provisioned capacity**.

```text id="5k2h8s"
Expected workload
      ↓
Provision capacity
      ↓
Auto Scaling
      ↓
Increase/decrease capacity
```

DynamoDB Auto Scaling can adjust provisioned capacity based on utilization.

---

## 4. Read scaling

For read-heavy workloads, I can use:

* DynamoDB read capacity
* Eventually consistent reads where acceptable
* **DynamoDB Accelerator (DAX)** for extremely low-latency read-heavy workloads

For CWD, I might use Redis/ElastiCache for application-level caching instead when that better fits the access pattern.

---

## 5. Write scaling

Writes scale by distributing them across partition keys.

For example:

```text id="b2y7kc"
Bad:
PK = CWD
       ↓
All writes → same partition ❌

Good:
PK = SESSION#S1
PK = SESSION#S2
PK = SESSION#S3
       ↓
Distributed writes ✅
```

This is why **partition-key design is critical**.

---

## 6. Global Tables for multi-region CWD

If CWD needs multi-region availability:

```text id="w5p1qs"
             CWD
              │
       ┌──────┴──────┐
       ▼             ▼
   US Region      EU Region
   DynamoDB       DynamoDB
       │             │
       └── Global ───┘
           Tables
```

DynamoDB Global Tables provide multi-region, multi-active replication.

---

## 🎯 Strong interview answer

> **“DynamoDB scales horizontally by distributing items and traffic across partitions based on the partition key. For unpredictable CWD traffic, I would typically consider on-demand capacity, while predictable workloads can use provisioned capacity with auto scaling. The most important part is good partition-key design so reads and writes are distributed and we avoid hot partitions. For multi-region CWD, DynamoDB Global Tables can provide multi-region replication and availability.”**

### Easy memory trick

**Partition → Distribute → Auto Scale → Cache → Multi-Region**

### Key distinction

**DynamoDB scaling is primarily horizontal.**

You don't make one database server bigger; DynamoDB distributes the workload across its managed infrastructure.
