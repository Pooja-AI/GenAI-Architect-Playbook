# What is Lambda Cold Start?

## Short answer

A **Lambda cold start** happens when AWS needs to create a **new execution environment** for a Lambda function before running your code.

That initialization adds **extra latency to the first request**.

### Simple flow

```text
Request
   ↓
Is Lambda environment already warm?
   │
   ├── YES → Execute immediately
   │
   └── NO
        ↓
   Create environment
        ↓
   Initialize runtime
        ↓
   Load dependencies
        ↓
   Run Lambda
```

## Warm vs Cold Start

### 🥶 Cold start

```text
Request
  ↓
Create container/environment
  ↓
Load Python/Java/etc.
  ↓
Load libraries
  ↓
Initialize application
  ↓
Execute function
```

This causes additional latency.

### 🔥 Warm start

```text
Request
  ↓
Existing environment
  ↓
Execute function
```

Much less initialization overhead.

## When does it happen?

A cold start can occur when:

* Lambda is invoked after being idle and no suitable environment exists.
* Traffic increases and AWS creates additional execution environments.
* A new version/deployment needs new environments.
* Existing environments have been retired.

You **cannot assume** a Lambda environment will remain warm.

## Example in CWD

Suppose CWD uses Lambda for a lightweight document-processing Worker:

```text
S3
 ↓
Lambda
 ↓
Process document
```

First invocation:

```text
Cold start → initialization → processing
```

Later invocation:

```text
Warm environment → processing
```

If traffic suddenly increases:

```text
100 requests
     ↓
Multiple Lambda environments
     ↓
Some may require initialization
```

## How do you reduce cold-start impact?

### 1. Keep the deployment package small

Don't load unnecessary libraries.

### 2. Initialize reusable resources outside the handler

For example, create reusable clients outside the Lambda handler when appropriate.

```python
client = create_client()

def handler(event, context):
    return client.process(event)
```

This allows the initialized resource to potentially be reused by subsequent invocations in the same environment.

### 3. Provisioned Concurrency

AWS can keep a configured number of execution environments initialized and ready.

```text
Provisioned Concurrency
        ↓
Pre-initialized environments
        ↓
Request
        ↓
Lower initialization latency
```

This is useful when predictable low latency matters.

### 4. Choose the runtime and dependencies carefully

Large dependencies and initialization work can increase startup time.

### 5. Monitor initialization duration

Use CloudWatch/Lambda metrics and logs to identify initialization overhead and latency.

---

# 🎯 Strong interview answer

> **“A Lambda cold start occurs when AWS has to create and initialize a new execution environment before executing the function. This adds initialization latency to the invocation. Warm invocations can reuse an existing environment and are generally faster. In CWD, for latency-sensitive Lambda functions, I would minimize dependencies and initialization work and use Provisioned Concurrency when predictable startup latency is required.”**

## Easy memory trick

**Cold = Create + Initialize + Execute**

**Warm = Reuse + Execute**

### Key distinction

> **Cold start is not the Lambda function failing or restarting. It is the additional initialization time when a new execution environment is needed.**
