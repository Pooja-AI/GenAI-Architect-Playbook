The **biggest architectural weakness of CWD is orchestration complexity**.

### Interview answer

> **The biggest weakness is that the Coordinator becomes a central dependency for planning, routing, state management, aggregation, validation, and error recovery.**
>
> In a simple workflow this works well, but as the number of Delegators and Workers grows, the Coordinator can become a **bottleneck and a potential single point of failure**.
>
> For example, a Customer Briefing request may flow:
>
> `Coordinator → Sales Delegator → Salesforce Worker`
>
> and
>
> `Coordinator → IT Delegator → ServiceNow Worker`
>
> If the Coordinator is responsible for maintaining the complete workflow state, coordinating parallel execution, handling retries, validating results, and aggregating responses, its responsibilities can grow significantly.
>
> I would address this by making orchestration **durable and distributed**: persist workflow state externally, use asynchronous events/queues for long-running tasks, make Workers independently retryable and idempotent, and keep the Coordinator focused primarily on **intent, planning, routing, and final business-level aggregation**.

### Why this matters

```text
                 Coordinator
                /     |      \
               /      |       \
        Delegator  Delegator  Delegator
           / \        / \        / \
       Workers     Workers    Workers
```

As CWD grows:

```text
                 Coordinator
                      |
        +-------------+-------------+
        |             |             |
     Planning      State         Recovery
        |             |             |
     Routing       Tracking      Retry/DLQ
        |             |             |
     Validation    Aggregation   Resume
        |             |             |
        +-------------+-------------+
                      |
              Complexity increases
```

The concern isn't simply **"the Coordinator is slow."** The deeper concern is **responsibility concentration**.

### How I would fix it

**1. Keep the Coordinator stateless where possible**

Store durable workflow state in something like DynamoDB/Cosmos DB rather than keeping important state only inside the Coordinator.

**2. Separate orchestration from execution**

```text
Coordinator
    ↓
Workflow Engine
    ↓
Event Bus / Queue
    ↓
Delegators
    ↓
Workers
```

The Coordinator decides **what should happen**; durable workflow infrastructure manages **how the work progresses and resumes**.

**3. Make Workers independently resilient**

Each Worker should have:

* timeout
* retry
* idempotency
* circuit breaker
* structured error response
* correlation ID

**4. Use asynchronous execution**

If Salesforce and ServiceNow are independent:

```text
Coordinator
     |
     +----> Sales Delegator ----> Salesforce Worker
     |
     +----> IT Delegator -------> ServiceNow Worker
```

They can execute independently rather than making the entire workflow synchronous.

**5. Persist checkpoints**

If:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → FAILED
```

don't restart everything.

Persist:

```text
W1 = COMPLETED
W2 = COMPLETED
W3 = FAILED
```

Then after recovery:

```text
Resume → W3 → Aggregation → Validation → Response
```

### One-line answer to memorize

> **“The biggest weakness of CWD is responsibility concentration in the Coordinator. As the system scales, planning, routing, state, recovery, validation, and aggregation can make the Coordinator a bottleneck and single point of failure. I would mitigate that with durable workflow state, asynchronous events, independently resilient Workers, and a thinner Coordinator focused on planning and business-level orchestration.”**
