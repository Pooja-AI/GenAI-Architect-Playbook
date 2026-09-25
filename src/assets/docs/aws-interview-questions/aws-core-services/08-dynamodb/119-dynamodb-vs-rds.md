# DynamoDB vs RDS

The simplest distinction:

> **DynamoDB = scalable NoSQL application state**
> **RDS = relational SQL data with relationships and transactions**

|               | **DynamoDB**                  | **RDS**                                            |
| ------------- | ----------------------------- | -------------------------------------------------- |
| Database type | NoSQL                         | Relational SQL                                     |
| Data model    | Key-value / document          | Tables / rows                                      |
| Schema        | Flexible                      | Structured                                         |
| Scaling       | Horizontal                    | Primarily vertical + read replicas/scaling options |
| Query style   | Access-pattern based          | SQL queries                                        |
| Joins         | ❌ No traditional joins        | ✅ SQL joins                                        |
| Transactions  | Supported                     | Strong relational transactions                     |
| Best for      | High-scale operational state  | Relational business data                           |
| CWD use       | Session/task/run/Worker state | Complex relational business data                   |

## CWD example

I would use **DynamoDB** for:

```text id="7m4y2v"
Session
Task
Run
Worker status
Checkpoint
Retry count
Idempotency key
```

Example:

```text id="u1p3gk"
RUN123
 ├── CustomerWorker = COMPLETED
 ├── SalesWorker    = COMPLETED
 └── IncidentWorker = FAILED
```

Because CWD typically needs fast key-based access:

```text
Get state for RUN123
        ↓
DynamoDB
        ↓
Very fast lookup
```

---

## When would I use RDS?

Suppose the application needs:

```text id="q4e8az"
Customer
   ↓
Orders
   ↓
Products
   ↓
Invoices
   ↓
Payments
```

and needs queries such as:

```sql
SELECT ...
FROM customers
JOIN orders ...
JOIN invoices ...
WHERE ...
```

That's a strong relational database use case.

---

## Why not use RDS for CWD workflow state?

You could, but if the dominant access pattern is:

```text
Get RUN123
Update Worker status
Get checkpoint
Check idempotency key
```

DynamoDB fits naturally without requiring relational joins.

RDS would make more sense if CWD needed **complex relational queries, joins, strong relational constraints, and SQL-based reporting**.

---

## 🎯 Strong interview answer

> **“For CWD workflow state, I would prefer DynamoDB because the access patterns are primarily key-based: session, task, run, Worker status, checkpoints, and idempotency records. DynamoDB provides low-latency access and horizontal scalability without managing database servers. I would choose RDS when the data has strong relational relationships and the application requires SQL, joins, relational constraints, or complex transactional queries. So the decision is based on the data model and access patterns, not simply on which database is faster.”**

### Easy memory trick

**DynamoDB → Key-value + Scale**
**RDS → Relationships + SQL**

### Key distinction

Don't say **“DynamoDB is better than RDS.”**

Say:

> **“DynamoDB fits key-value/high-scale access patterns; RDS fits relational/SQL access patterns.”**
