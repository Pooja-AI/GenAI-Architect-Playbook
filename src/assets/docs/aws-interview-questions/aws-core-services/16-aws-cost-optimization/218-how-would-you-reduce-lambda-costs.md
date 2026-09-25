## How would you reduce Lambda costs?

Main idea: **reduce execution time, memory, and unnecessary invocations.**

```text
Events
  ↓
Filter / Batch
  ↓
Lambda
  ↓
Fast execution
```

### Practical techniques

1. **Reduce unnecessary invocations** → filter events before triggering Lambda.
2. **Batch messages** → process multiple SQS messages per invocation.
3. **Optimize execution time** → remove unnecessary processing/API calls.
4. **Right-size memory** → choose the lowest memory that meets latency requirements.
5. **Reuse connections** → initialize clients outside the handler.
6. **Avoid Lambda for long-running workloads** → use ECS/Fargate when appropriate.
7. **Monitor duration and invocations** → identify expensive functions.

### Interview answer

> “I reduce Lambda cost by minimizing unnecessary invocations, batching events, optimizing execution time, right-sizing memory, and reusing connections. For long-running or continuously running workloads, I would move the workload to ECS/Fargate instead of Lambda.”

**Memory:**
**Fewer Invocations → Batch → Faster Execution → Right-size → Use Fargate when appropriate**
