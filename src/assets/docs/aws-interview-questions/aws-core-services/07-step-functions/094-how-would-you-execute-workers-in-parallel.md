# How would you execute Workers in parallel?

In CWD, I would use **parallel execution when Workers are independent of each other**.

For Step Functions, I would use a **`Parallel` state**.

### CWD example

Suppose the Customer Briefing needs data from three independent systems:

```text
                 Coordinator
                      ↓
              Step Functions
                      ↓
                  Parallel
              ↙      ↓       ↘
             ↓       ↓        ↓
      Customer W   Sales W   Incident W
          ↓           ↓          ↓
      Salesforce   CRM       ServiceNow
              ↘      ↓       ↙
                Aggregate
                    ↓
            Briefing Worker
```

All three Workers can start at approximately the same time.

### Why parallel execution?

Without parallelism:

```text
Customer → Sales → Incident
   2 sec     3 sec     4 sec

Total ≈ 9 sec
```

With parallelism:

```text
Customer ── 2 sec ──┐
Sales ───── 3 sec ──┼→ Aggregate
Incident ── 4 sec ──┘

Total ≈ 4 sec
```

The total is approximately the **slowest branch**, plus orchestration/aggregation overhead.

---

## How I handle failures

Each branch can have its own:

* Timeout
* Retry
* Exponential backoff
* Catch
* Error classification

Example:

```text
Customer Worker ─── Success ───┐
Sales Worker ─────── Success ───┼→ Aggregate
Incident Worker ──── Failure ───┘
                         ↓
                    Optional?
                    ↙       ↘
                  Yes        No
                   ↓          ↓
             Partial result  Fail
```

If Incident Worker is optional, I can continue with:

```text
Customer data ✓
Sales data    ✓
Incident data ✗
```

and clearly indicate that incident information was unavailable rather than inventing it.

---

## Important dependency rule

Don't parallelize Workers that have dependencies.

For example:

```text
Customer Worker
      ↓
Sales Worker
```

Sales Worker needs Customer Worker's output, so this must be sequential.

But:

```text
Customer Worker
      ↓
     Parallel
    ↙       ↘
 Sales     Incident
```

Sales and Incident can run in parallel if they don't depend on each other.

### 🎯 Strong interview answer

> **“I use Step Functions Parallel states to execute independent CWD Workers concurrently. For example, Customer, Sales, and Incident Workers can query their respective systems at the same time. After all required branches complete, I aggregate the results and invoke the final Briefing Worker. Each branch has its own timeout, retry, and failure handling. I only parallelize independent Workers; if one Worker depends on another's output, I model that as a sequential dependency.”**

**Memory trick:**
**Independent → Parallel | Dependent → Sequential**

**Key distinction:**
Parallelism improves **latency and throughput**, but I still control **concurrency** so I don't overload Salesforce, ServiceNow, or Bedrock.
