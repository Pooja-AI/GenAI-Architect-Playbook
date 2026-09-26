### Why Service Bus / SQS?

We use **Service Bus on Azure** or **SQS on AWS** when we need **asynchronous, reliable communication** between agents/services.

* **Decouples** Coordinator, Delegators, and Workers.
* Supports **retries** for transient failures.
* **DLQ** captures messages that repeatedly fail.
* Provides **buffering** during traffic spikes.
* Supports **asynchronous/long-running tasks**.
* Helps with **scalability** because consumers can scale independently.

**In CWD:**

```text
Coordinator
    ↓
Service Bus / SQS
    ↓
Delegator
    ↓
Workers
```

**Interview answer:**

> “We used Service Bus on Azure or SQS on AWS to decouple our agents and services and support reliable asynchronous processing. It provides buffering, retries, dead-letter queues, and independent scaling. This is especially useful when a Worker or downstream system is slow or temporarily unavailable.”
