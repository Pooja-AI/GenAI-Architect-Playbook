# How would you prevent Lambda concurrency exhaustion?

## Short answer

I would use **concurrency limits + queues + backpressure + downstream protection + monitoring**.

The goal is to prevent a sudden CWD traffic spike from creating too many simultaneous Lambda executions.

## Key points

### 1. Use Reserved Concurrency

Set a maximum concurrency for important functions.

```text id="1f8g2p"
CWD Lambda Worker
Reserved Concurrency = 20
```

This prevents that function from consuming unlimited account concurrency.

---

### 2. Use SQS for bursty workloads

Instead of:

```text id="b8t9yw"
1000 requests
     ↓
1000 Lambda executions
```

use:

```text id="u2v5xq"
1000 requests
     ↓
     SQS
     ↓
Controlled Lambda concurrency
     ↓
Process gradually
```

SQS provides **buffering/backpressure**.

---

### 3. Control Lambda concurrency

For example:

```text id="j8l3v4"
SQS
 ↓
Lambda
 ↓
Reserved concurrency = 20
```

Only a controlled number of messages are processed simultaneously.

This is especially important when Lambda calls:

* Salesforce
* ServiceNow
* Bedrock
* Databases
* External APIs

---

### 4. Control CWD fan-out

This is especially important for your architecture.

One request can become:

```text id="n4c5x8"
1 User Request
      ↓
Coordinator
      ↓
Delegator
      ↓
10 Workers
      ↓
10 Lambda calls
```

If 100 users arrive:

```text id="j9k2m1"
100 × 10 Workers
      =
1000 potential executions
```

So I would limit **Worker concurrency** rather than allowing unlimited fan-out.

---

### 5. Use downstream rate limits

Even if Lambda can process 1,000 requests, Salesforce may not want 1,000 simultaneous calls.

```text id="7x2p4c"
Lambda
   ↓
Concurrency limit
   ↓
Salesforce
```

Apply separate limits for important dependencies.

---

### 6. Use retries carefully

Don't allow every throttled Lambda invocation to immediately retry.

Bad:

```text id="2c8w6a"
Throttled
   ↓
Retry immediately
   ↓
Throttled
   ↓
Retry
   ↓
Throttled
```

Better:

```text id="r4q7m2"
Failure
  ↓
Exponential backoff + jitter
  ↓
Retry
  ↓
Max attempts
  ↓
DLQ / failure handling
```

---

### 7. Use Dead-Letter Queues

For asynchronous Lambda processing:

```text id="x6v9k3"
SQS
 ↓
Lambda
 ↓
Failed repeatedly
 ↓
DLQ
```

This prevents continuously failing messages from consuming processing capacity.

---

### 8. Monitor concurrency

I would monitor:

* Concurrent executions
* Throttles
* Reserved concurrency
* Account concurrency
* Invocation count
* Duration
* Error rate
* SQS queue depth
* Lambda iterator age where applicable
* Downstream API latency/errors

Create CloudWatch alarms when concurrency or throttling approaches a defined threshold.

---

## CWD example

Suppose the Customer Briefing workflow generates several background tasks:

```text id="8n4k1d"
Customer Request
       ↓
Coordinator
       ↓
Delegator
       ↓
Workers
       ↓
SQS
       ↓
Lambda
       ↓
Salesforce / ServiceNow
```

I could configure:

```text id="3g5r8m"
Reserved concurrency = 20
```

Then use SQS to buffer excess work.

If Salesforce starts returning throttling responses:

```text id="5k9v2s"
Salesforce throttling
        ↓
Backoff
        ↓
SQS retains messages
        ↓
Lambda processes later
```

This protects both **Lambda and the downstream system**.

## 🎯 Strong interview answer

> **“I prevent Lambda concurrency exhaustion by controlling concurrency at multiple levels. I use Reserved Concurrency for critical functions, SQS to buffer bursty asynchronous workloads, and limit CWD Worker fan-out so one request cannot create unlimited parallel executions. I also apply downstream rate limits, exponential backoff with jitter, retries and DLQs, and monitor concurrent executions, throttles, queue depth and downstream errors through CloudWatch. The key is to apply backpressure instead of allowing traffic to propagate uncontrolled through the system.”**

## Easy memory trick

**Limit → Queue → Control fan-out → Backoff → DLQ → Monitor**

### Key distinction

> **Concurrency exhaustion is not solved simply by increasing Lambda concurrency.**
> In CWD, you must also control **fan-out and downstream capacity**.
