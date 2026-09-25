# How does SQS help CWD scalability?

**SQS helps CWD scale by decoupling request producers from Workers.** It acts as a **buffer** when traffic suddenly increases.

### Without SQS

```text
Coordinator
    ↓
Worker
    ↓
Salesforce / ServiceNow
```

If traffic jumps from 100 → 1,000 requests:

```text
Worker overload
   ↓
Timeouts
   ↓
Failures
```

### With SQS

```text
Coordinator
    ↓
   SQS
    ↓
 ┌──┴──┬────┬────┐
 W1   W2   W3   W4
    ↓
Enterprise Systems
```

Now CWD can absorb the traffic spike in the queue while Workers process messages at a controlled rate.

### How SQS improves scalability

1. **Buffering**

   * Handles traffic spikes without immediately overwhelming Workers.

2. **Independent scaling**

   * Coordinator and Workers can scale independently.
   * ECS can add more Worker tasks when queue depth increases.

3. **Backpressure**

   * Queue naturally slows the flow toward Salesforce, ServiceNow, or other downstream systems.

4. **Asynchronous processing**

   * Long-running operations don't need to keep the user's request waiting.

5. **Retry**

   * Failed messages can be processed again instead of losing the request.

6. **DLQ**

   * Repeatedly failed messages move to a Dead Letter Queue instead of continuously consuming Worker capacity.

### Example

Suppose:

```text
Incoming requests = 1,000/min
Worker capacity   = 300/min
```

SQS absorbs the difference:

```text
1,000 requests
      ↓
     SQS
      ↓
300/min processed
      ↓
Remaining work stays queued
```

When more Workers are available:

```text
5 Workers
   ↓
10 Workers
   ↓
20 Workers
```

the queue drains faster.

### 🎯 Strong interview answer

> **“SQS improves CWD scalability by decoupling the Coordinator and Workers and providing a durable buffer. During traffic spikes, requests can accumulate in the queue instead of overwhelming Workers or downstream systems. I can monitor queue depth and oldest-message age and use those signals to scale ECS Workers. SQS also provides retry and DLQ capabilities, making the system more resilient while scaling.”**

**Memory trick:**
**SQS = Buffer → Decouple → Scale → Retry → DLQ**

**Key distinction:**
**SQS doesn't directly make the Worker faster. It allows the overall system to handle more variable traffic safely.**
