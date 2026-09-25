## How would you scale DynamoDB?

DynamoDB scales **horizontally by partitioning data and capacity across partitions**.

```text id="p3n8vk"
More CWD Traffic
      ↓
   DynamoDB
      ↓
┌─────┬─────┬─────┐
↓     ↓     ↓
P1    P2    P3
      ↓
Auto Scaling
```

### How I would do it

* **On-demand capacity** → good for unpredictable/spiky CWD traffic.
* **Provisioned + Auto Scaling** → good for predictable workloads.
* Design a **high-cardinality partition key** to distribute traffic.
* Avoid **hot partitions** caused by too many requests hitting one partition key.
* Use **adaptive capacity** to help with uneven access patterns.
* Monitor **ThrottledRequests**, consumed capacity, latency, and read/write utilization.
* Use **DAX/Redis** for frequently accessed data when caching is appropriate.

### CWD example

```text id="v1c6zs"
PK = TENANT#ON#SESSION#S123
SK = TASK#T456#RUN#R789
```

Using session/run IDs helps distribute workload rather than putting every request under one common key.

### Interview answer

> “For CWD, I would use DynamoDB on-demand initially when traffic is unpredictable, or provisioned capacity with Auto Scaling for predictable workloads. I would design high-cardinality partition keys to avoid hot partitions and monitor throttling, latency, and consumed capacity. For frequently read data, I can use Redis as a cache to reduce DynamoDB traffic.”

**Memory:**
**Partition well → Avoid Hot Keys → Auto Scale → Monitor → Cache**
