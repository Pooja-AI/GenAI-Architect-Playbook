# How does Lambda concurrency work?

## Short answer

**Lambda concurrency = number of Lambda executions running at the same time.**

If 100 requests arrive at the same time and 100 executions are allowed, Lambda can run roughly **100 concurrent executions**.

```text
100 requests
     ↓
Lambda
     ↓
┌────┬────┬────┬────┬─────┐
│ E1 │ E2 │ E3 │... │ E100│
└────┴────┴────┴────┴─────┘
        Concurrent executions
```

## Key points

### 1. Each concurrent request needs an execution environment

For example:

```text
Request 1 → Lambda Environment 1
Request 2 → Lambda Environment 2
Request 3 → Lambda Environment 3
```

A single Lambda execution environment handles one invocation at a time for standard synchronous invocation.

---

### 2. Concurrency increases automatically

Suppose traffic changes:

```text
10 requests
   ↓
~10 concurrent executions
```

Then:

```text
500 requests
   ↓
Potentially hundreds of concurrent executions
```

AWS can create additional execution environments to handle the concurrency, subject to account/function limits.

---

### 3. Reserved Concurrency

You can reserve a maximum concurrency for a function.

Example:

```text
CWD Worker Lambda
Reserved concurrency = 20
```

That function can have at most about **20 concurrent executions**.

This is useful for protecting downstream systems.

```text
Lambda
  ↓
Max 20 concurrent
  ↓
Salesforce
```

You don't want 1,000 Lambda executions simultaneously overwhelming Salesforce.

---

### 4. Provisioned Concurrency is different

This is an important interview distinction.

**Reserved Concurrency**

> Controls the concurrency limit.

**Provisioned Concurrency**

> Keeps a configured number of execution environments initialized and ready.

Example:

```text
Reserved concurrency = 100
Provisioned concurrency = 20
```

You can have up to 100 concurrent executions, while 20 environments are kept pre-initialized.

---

### 5. What happens when concurrency is exhausted?

For synchronous invocations, additional requests can be **throttled** rather than creating unlimited executions.

For asynchronous workloads, a queueing mechanism can absorb the traffic.

For CWD, I would often use:

```text
High traffic
    ↓
SQS
    ↓
Lambda
    ↓
Controlled concurrency
    ↓
Enterprise system
```

This protects downstream systems.

---

# CWD example

Suppose CWD has a Lambda Worker that processes documents.

```text
S3
 ↓
EventBridge
 ↓
SQS
 ↓
Lambda Worker
```

Suppose I configure:

```text
Lambda concurrency = 20
```

Then I effectively allow up to about **20 executions at once** for that function.

If 500 documents arrive:

```text
500 documents
      ↓
     SQS
      ↓
20 Lambda executions at a time
      ↓
Process gradually
```

This prevents a sudden traffic spike from overwhelming:

* OpenSearch
* Bedrock
* Salesforce
* ServiceNow
* Other downstream APIs

---

# Why concurrency matters in CWD

CWD has **fan-out**:

```text
Coordinator
    ↓
Delegator
    ↓
10 Workers
    ↓
10 downstream calls
```

If 100 users make requests simultaneously:

```text
100 users
   ×
10 Workers
   =
Potentially 1,000 downstream operations
```

So simply allowing unlimited Lambda concurrency can create a **downstream overload problem**.

I would control concurrency at multiple levels:

```text
API Gateway
     ↓
Request throttling
     ↓
ECS/Fargate scaling
     ↓
Worker concurrency
     ↓
SQS buffering
     ↓
Downstream limits
     ↓
Bedrock / Salesforce / ServiceNow
```

## 🎯 Strong interview answer

> **“Lambda concurrency is the number of function invocations running simultaneously. Lambda can automatically scale execution environments as concurrent requests increase, but concurrency is subject to limits. In CWD, I would control concurrency using reserved concurrency where I need to protect downstream systems, and use SQS to buffer spikes for asynchronous workloads. I would use Provisioned Concurrency separately when I need to reduce cold-start latency. This is important because CWD can fan out one request into multiple Workers, so uncontrolled concurrency could overload Bedrock, Salesforce, or ServiceNow.”**

## Easy memory trick

**Concurrency = How many are running now**

**Reserved = Maximum allowed**

**Provisioned = Ready in advance**

**SQS = Wait in queue**
