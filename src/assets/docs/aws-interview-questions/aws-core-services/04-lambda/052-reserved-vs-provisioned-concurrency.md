# Reserved vs Provisioned Concurrency

## Short answer

The easiest way to remember:

> **Reserved Concurrency = controls how many can run.**
> **Provisioned Concurrency = controls how many are ready to run.**

They solve **different problems**.

## Key comparison

|                             | **Reserved Concurrency**      | **Provisioned Concurrency**            |
| --------------------------- | ----------------------------- | -------------------------------------- |
| Main purpose                | Limit/control concurrency     | Reduce cold starts                     |
| Controls                    | Maximum concurrent executions | Pre-initialized execution environments |
| Protects downstream systems | ✅ Yes                         | Not its primary purpose                |
| Reduces cold starts         | ❌ Not directly                | ✅ Yes                                  |
| Keeps environments warm     | ❌                             | ✅                                      |
| Useful for                  | Throttling/isolation          | Low-latency applications               |
| Cost impact                 | Mainly a concurrency control  | You pay for provisioned capacity       |

## 1. Reserved Concurrency

Suppose:

```text
CWD Worker Lambda
Reserved Concurrency = 20
```

That means:

```text
                    Lambda
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
      Execution 1             Execution 20
          ...                    ...
              MAX = 20
```

If more requests arrive while all 20 are executing, additional invocations can be throttled/queued depending on the invocation pattern.

### Why use it in CWD?

Suppose the Worker calls Salesforce:

```text
Lambda Worker
     ↓
Salesforce
```

Salesforce may only tolerate a certain request rate.

So:

```text
Reserved concurrency = 20
```

helps prevent Lambda from creating an uncontrolled number of simultaneous calls.

---

# 2. Provisioned Concurrency

Suppose:

```text
Provisioned Concurrency = 10
```

AWS keeps approximately **10 execution environments initialized and ready**.

```text
        Provisioned Lambda
       ┌──────────────────┐
       │ Ready │ Ready    │
       │ Ready │ Ready    │
       │ Ready │ Ready    │
       │ Ready │ Ready    │
       │ Ready │ Ready    │
       └──────────────────┘
                ↓
             Request
                ↓
          Execute quickly
```

This reduces the initialization delay associated with cold starts.

### Why use it in CWD?

Suppose you have a latency-sensitive API:

```text
API Gateway
     ↓
Lambda
     ↓
Response
```

You might use Provisioned Concurrency so the Lambda environment is already initialized.

---

# 3. They can be used together

This is an important interview point.

For example:

```text
Reserved Concurrency = 100
Provisioned Concurrency = 20
```

Meaning conceptually:

```text
Maximum allowed executions = 100

         100
    ┌───────────────┐
    │               │
    │ 20 pre-warmed  │
    │ environments  │
    │               │
    └───────────────┘
```

The **20** are kept initialized to reduce cold-start latency, while the function's configured concurrency ceiling is **100**.

---

# CWD example

Imagine:

```text
Customer Request
       ↓
API Gateway
       ↓
Lambda Worker
       ↓
Bedrock
```

If the Worker is latency-sensitive:

```text
Provisioned Concurrency
        ↓
Reduce cold-start latency
```

If the Worker calls a downstream system that cannot handle unlimited parallel requests:

```text
Reserved Concurrency
        ↓
Limit simultaneous executions
        ↓
Protect downstream system
```

For bursty asynchronous workloads:

```text
SQS
 ↓
Lambda
 ↓
Reserved Concurrency
 ↓
Controlled processing
```

---

# 🎯 Strong interview answer

> **“Reserved and Provisioned Concurrency solve different problems. Reserved Concurrency sets a concurrency limit for a Lambda function and helps isolate the function and protect downstream systems. Provisioned Concurrency keeps a specified number of execution environments initialized and ready, which reduces cold-start latency. In CWD, I could use Reserved Concurrency for Workers calling systems like Salesforce or Bedrock, and Provisioned Concurrency for latency-sensitive Lambda APIs. They can also be used together.”**

## Easy memory trick

**Reserved = Restrict**

**Provisioned = Pre-warm**

Or simply:

> **Reserved asks: ‘How many can run?’**
> **Provisioned asks: ‘How many are ready?’**
