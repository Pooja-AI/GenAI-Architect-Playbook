### Why asynchronous execution?

Because some CWD tasks are **long-running or independent**, so we don't want the user request to wait for every operation sequentially.

* **Lower response latency** → independent Workers can run in parallel.
* **Better scalability** → services process tasks independently.
* **Handles long-running tasks** without blocking the API.
* **Improves reliability** → failed tasks can be retried independently.
* **Better resource utilization** during high traffic.

**Example:**

```text
Customer Briefing
      ↓
   Delegator
   ↙      ↘
Sales     IT
Worker   Worker
  ↓        ↓
Salesforce ServiceNow
```

Sales and IT Workers can execute **in parallel**, then the Delegator aggregates the results.

**Interview answer:**

> “We used asynchronous execution because CWD has independent and potentially long-running Worker tasks. Instead of executing everything sequentially, we can run independent Workers in parallel, reducing overall latency and improving scalability. For long-running tasks, we use asynchronous messaging and track the task status until completion.”
