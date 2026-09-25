# On-Demand vs Provisioned Capacity in DynamoDB

The simple difference is:

> **On-Demand = DynamoDB automatically handles capacity.**
> **Provisioned = You specify capacity, and DynamoDB Auto Scaling can adjust it.**

|                    | **On-Demand**       | **Provisioned**              |
| ------------------ | ------------------- | ---------------------------- |
| Capacity planning  | Minimal             | Required                     |
| Scaling            | Automatic           | Auto Scaling available       |
| Traffic pattern    | Unpredictable       | Predictable                  |
| Cost model         | Pay per request     | Pay for provisioned capacity |
| Operational effort | Lower               | Higher                       |
| Good for           | Spiky/new workloads | Stable/high-volume workloads |

### CWD example

#### On-Demand

If CWD traffic looks like:

```text
100 req/min
     ↓
1,000 req/min
     ↓
50,000 req/min  ← sudden spike
```

On-demand is useful because you don't have to constantly estimate capacity.

#### Provisioned

If CWD consistently receives:

```text
10,000 requests/min
10,000 requests/min
10,000 requests/min
```

and the workload is predictable, provisioned capacity can be considered, with Auto Scaling adjusting capacity as utilization changes.

### 🎯 Strong interview answer

> **“I would choose DynamoDB On-Demand when CWD traffic is unpredictable, spiky, or the workload is new because DynamoDB handles capacity automatically and I pay based on usage. I would consider Provisioned capacity when traffic is predictable and sustained because I can define expected capacity and use Auto Scaling to adjust it. For a new CWD workload with uncertain traffic, I would start with On-Demand and move to Provisioned if the workload becomes predictable and the economics justify it.”**

### Easy memory trick

**On-Demand = Unpredictable**
**Provisioned = Predictable**

### Important distinction

Neither option fixes a **bad partition-key design**.

Even with automatic scaling, you still need to avoid **hot partitions**.
