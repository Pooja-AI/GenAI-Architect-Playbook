## How do you parallelize Workers in CWD?

In CWD, I parallelize Workers when **they are independent and don't depend on each other's output**.

For example, in a **Customer Briefing** request:

```text
User
 ↓
Coordinator
 ↓
Sales Delegator
 ├── Customer Worker ──→ Salesforce
 └── Opportunity Worker → Salesforce
```

If both Workers only need `customer_id = C12345`, they can run **at the same time**.

### 1. LangGraph parallel execution

The Coordinator/Delegator creates multiple Worker tasks:

```text
                 Sales Delegator
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
      Customer Worker      Opportunity Worker
             ↓                   ↓
         Salesforce          Salesforce
             └─────────┬─────────┘
                       ↓
                    Reducer
                       ↓
                Sales result
```

Conceptually:

```python
async def run_workers(state):
    customer_task = customer_worker(state["customer_id"])
    opportunity_task = opportunity_worker(state["customer_id"])

    customer_result, opportunity_result = await asyncio.gather(
        customer_task,
        opportunity_task
    )

    return {
        "customer_result": customer_result,
        "opportunity_result": opportunity_result
    }
```

The important part is that `await` is done on both tasks together rather than waiting for one before starting the other.

---

### 2. Across Delegators

You can also parallelize **Delegators**.

For Customer Briefing:

```text
                 Coordinator
                /           \
               ↓             ↓
       Sales Delegator    IT Delegator
          /       \             |
         ↓         ↓            ↓
    Customer   Opportunity   Incident
     Worker      Worker        Worker
         \         |            /
          └────────┴────────────┘
                    ↓
              Coordinator
             Aggregate
```

If Sales and IT are independent, they execute concurrently.

---

### 3. When should Workers NOT be parallelized?

If there is a dependency:

```text
Customer Worker
      ↓
Customer ID / Account data
      ↓
Opportunity Worker
```

then Opportunity Worker must wait.

That's:

```text
W1 → W2
```

not:

```text
W1 ─┐
    ├→ parallel
W2 ─┘
```

So I first build a **dependency graph**.

### 4. How do I handle failures?

Suppose:

```text
Customer Worker       ✅
Opportunity Worker    ✅
Incident Worker       ❌
```

I don't rerun the successful Workers.

I persist their results:

```text
Completed:
  Customer Worker
  Opportunity Worker

Failed:
  Incident Worker
```

Then retry/replay only the failed Worker, depending on the business criticality.

### 5. How do I control too much parallelism?

I don't allow unlimited concurrent Workers.

I use:

* Worker concurrency limits
* MCP concurrency limits
* Downstream API rate limits
* Queue-based execution for long-running tasks
* Backpressure
* Timeouts
* Circuit breakers

For example:

```text
Sales Delegator
      ↓
Max 10 concurrent Workers
      ↓
MCP
      ↓
Salesforce API limit
```

This prevents parallelism from overwhelming Salesforce or ServiceNow.

### 6. Why does parallelization reduce latency?

Suppose:

```text
Customer Worker = 1.5 sec
Opportunity Worker = 1.0 sec
Incident Worker = 2.5 sec
```

Sequential:

```text
1.5 + 1.0 + 2.5 = 5.0 sec
```

Parallel:

```text
max(1.5, 1.0, 2.5) ≈ 2.5 sec
```

plus orchestration/network overhead.

So parallelism reduces the **critical-path latency**.

### 🎯 Interview-ready answer

> **“In CWD, I parallelize Workers using asynchronous execution through LangGraph when the Workers are independent and don't have dependencies on each other's outputs. For example, in Customer Briefing, Customer Worker and Opportunity Worker can execute concurrently because both receive the customer ID independently. Similarly, Sales and IT Delegators can run in parallel when their tasks are independent. I then use a reducer or aggregation step to combine the results. For dependent Workers, I use sequential edges. I also control concurrency and respect MCP and downstream API limits so parallelism doesn't overwhelm Salesforce or ServiceNow.”**

**Easy memory:**

> **Independent → Parallel**
> **Dependent → Sequential**
> **Results → Aggregate**
> **Failure → Retry only failed task**
> **Too much parallelism → Concurrency limit**
