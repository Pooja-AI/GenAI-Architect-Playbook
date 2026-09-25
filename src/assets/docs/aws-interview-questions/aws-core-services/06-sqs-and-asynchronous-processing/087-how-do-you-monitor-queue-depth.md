# How do you monitor queue depth?

In CWD, I would monitor **SQS queue depth using Amazon CloudWatch**.

**Queue depth = number of messages waiting to be processed.**

```text
                 SQS
                  ↓
        ┌──────────────────┐
        │ Queue Depth      │
        │ 100 → 500 → 2000 │
        └────────┬─────────┘
                 ↓
             CloudWatch
                 ↓
              Alarm
                 ↓
        ECS Worker Auto Scaling
```

## 1. Monitor `ApproximateNumberOfMessagesVisible`

This is the main metric for messages currently available to be consumed.

Example:

```text
Queue depth = 50
```

means approximately 50 messages are waiting.

If it continuously increases:

```text
100 → 500 → 1,000 → 5,000
```

it indicates **Workers are not keeping up with incoming work**.

---

## 2. Monitor messages in flight

Also monitor:

**`ApproximateNumberOfMessagesNotVisible`**

These are messages currently being processed or hidden because of visibility timeout.

```text
Visible       = 500
Not visible   = 100
```

So you can understand:

```text
Waiting work + currently processing
```

---

## 3. Monitor DLQ depth

Very important for CWD:

```text
Main Queue
    ↓
Worker
    ↓
Failures
    ↓
DLQ
```

Monitor:

**`ApproximateNumberOfMessagesVisible` on the DLQ**

If:

```text
DLQ depth = 0
```

normally good.

If:

```text
DLQ depth = 50 → 500 → 2,000
```

you have a growing processing problem that needs investigation.

---

# 4. Create CloudWatch alarms

Example:

```text
Queue depth > 1,000
        ↓
CloudWatch Alarm
        ↓
SNS / incident notification
        ↓
Operations team
```

But the threshold should be based on **expected workload and SLA**, not an arbitrary number.

---

# 5. Use queue depth for ECS scaling

This is particularly useful in CWD.

```text
                SQS
                 ↓
           Queue depth
                 ↓
             CloudWatch
                 ↓
          ECS Auto Scaling
          ↙            ↘
    Add Workers      Remove Workers
```

Example:

```text
Queue depth < 100
→ 3 Worker tasks

Queue depth > 1,000
→ scale to 10 Worker tasks
```

You can use **custom CloudWatch metrics / Application Auto Scaling policies** based on workload characteristics.

---

# 6. Queue depth alone isn't enough

I would also monitor:

| Metric                    | Why                            |
| ------------------------- | ------------------------------ |
| Queue depth               | How much work is waiting       |
| Messages not visible      | Work currently being processed |
| Age of oldest message     | How long work is waiting       |
| Message receive count     | Repeated retries               |
| DLQ depth                 | Persistent failures            |
| Worker CPU/memory         | Worker capacity                |
| Worker processing latency | Processing speed               |
| Success/failure rate      | Processing health              |
| Downstream latency        | Salesforce/ServiceNow health   |

### Very important: Age of oldest message

Suppose:

```text
Queue depth = 100
```

That sounds manageable.

But:

```text
Oldest message age = 20 minutes
```

means your users may already be experiencing a serious delay.

So I pay particular attention to:

**Queue depth + oldest message age.**

---

# CWD example

```text
Customer Worker Queue

Queue depth       = 2,500
Oldest message    = 8 minutes
Workers           = 5
CPU               = 80%
DLQ               = 0
```

This tells me the system is receiving work faster than Workers are processing it.

I could:

```text
Increase Worker capacity
        ↓
Check downstream limits
        ↓
Scale gradually
        ↓
Monitor queue age
```

I would **not blindly add Workers** if Salesforce/ServiceNow is already throttling us.

---

## 🎯 Strong interview answer

> **“I monitor CWD SQS queues primarily through CloudWatch. I track visible message count for queue depth, not-visible messages for in-flight work, the age of the oldest message for user-facing delay, and DLQ depth for persistent failures. I configure CloudWatch alarms based on queue growth and message age, and I can use queue-based metrics to drive ECS Worker scaling. However, I also consider downstream limits such as Salesforce, ServiceNow, and Bedrock before increasing concurrency.”**

### Easy memory trick

**Depth → Age → In-flight → DLQ → Scale**

### Key distinction

**Queue depth tells me how much work is waiting.**

**Oldest message age tells me how long users have been waiting.**
