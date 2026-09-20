## Can a Worker call another Worker?

**Technically yes, but in CWD, normally no.**

A Worker should focus on **one specific business capability**. The **Delegator** should coordinate multiple Workers.

### Recommended flow

```text
Coordinator
     ↓
Delegator
   ↓     ↓
Worker  Worker
```

For example:

```text
Sales Delegator
   ↓          ↓
Customer    Contract
Worker      Worker
```

If `CustomerWorker` needs `ContractWorker`, don't normally make:

```text
CustomerWorker → ContractWorker   ❌
```

Instead, let the Delegator manage the dependency:

```text
Sales Delegator
      ↓
CustomerWorker
      ↓
ContractWorker
```

### Why?

Because the Delegator is responsible for:

* Worker dependencies
* Execution order
* Retry and timeout
* Failure handling
* Result aggregation

This keeps Workers **small, reusable, and independent**.

### Interview answer

> **"Technically a Worker could call another Worker, but in our CWD architecture we avoid that. Workers perform individual capabilities, while the Delegator manages dependencies and orchestration between Workers. This keeps the architecture loosely coupled and easier to maintain."**

**One line:**

> **"Worker performs; Delegator orchestrates."**
