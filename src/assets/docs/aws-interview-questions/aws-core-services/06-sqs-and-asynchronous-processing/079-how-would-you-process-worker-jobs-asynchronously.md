# How would you process Worker jobs asynchronously?

In CWD, I would use **SQS between the Delegator and Worker** when the Worker job does not need to complete within the user's synchronous request.

```text
User
  ↓
API Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
SQS Queue
  ↓
Worker
  ↓
MCP
  ↓
Salesforce / ServiceNow / Other System
```

## Step-by-step

### 1. Delegator creates a job

The Delegator creates a message containing:

```text
job_id
workflow_id
user_id
worker_type
customer_id
request_payload
priority
correlation_id
```

Example:

```json
{
  "job_id": "JOB-123",
  "worker": "CustomerWorker",
  "customer_id": "CUST-456",
  "correlation_id": "RUN-789"
}
```

---

### 2. Put the job into SQS

```text
Delegator
    ↓
SQS
```

SQS durably holds the job until a Worker processes it.

The API can return:

```text
Job accepted
Job ID: JOB-123
Status: QUEUED
```

---

### 3. Worker consumes the message

```text
SQS
 ↓
Customer Worker
```

The Worker:

1. Receives message
2. Validates payload
3. Checks authorization
4. Checks idempotency
5. Calls MCP
6. Gets Salesforce/ServiceNow data
7. Processes result
8. Updates job status

---

### 4. Update job status

I would store status in DynamoDB:

```text
JOB-123
   ↓
QUEUED
   ↓
PROCESSING
   ↓
COMPLETED
```

If it fails:

```text
PROCESSING
     ↓
FAILED
     ↓
Retry
     ↓
DLQ if persistent
```

---

### 5. Control Worker concurrency

Suppose Salesforce allows only 20 concurrent operations.

I can control the number of Workers consuming jobs:

```text
              SQS
               ↓
       ┌───────┼───────┐
       ↓       ↓       ↓
    Worker  Worker   Worker
      1       2        3
       └───────┼───────┘
               ↓
          Salesforce
```

This protects the downstream system.

---

## What happens if the Worker crashes?

SQS provides **visibility timeout**.

```text
SQS
 ↓
Worker receives message
 ↓
Worker crashes
 ↓
Message becomes visible again
 ↓
Another Worker processes it
```

For repeated failures:

```text
SQS
 ↓
Retry
 ↓
Retry
 ↓
Retry
 ↓
DLQ
```

Then operations teams can investigate the DLQ.

---

## Important: Idempotency

Suppose the Worker successfully updates Salesforce but crashes before acknowledging the SQS message.

The message may be processed again.

Therefore:

```text
SQS
 ↓
Worker
 ↓
Idempotency check
 ↓
MCP
 ↓
Salesforce
```

Use a unique `job_id` / idempotency key so the same business operation isn't executed twice.

---

# Real CWD example

Suppose the user requests:

> "Generate a report for 10,000 customers."

Instead of:

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
10,000 synchronous Worker calls
 ↓
Wait...
```

I would do:

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
SQS
 ↓
┌───────────────┐
│ Worker pool   │
│ W1 W2 W3 W4   │
│ W5 W6 ...     │
└───────┬───────┘
        ↓
     MCP
        ↓
Enterprise systems
        ↓
   DynamoDB status
```

The user gets a **Job ID** immediately and the work continues asynchronously.

## 🎯 Strong interview answer

> **“For asynchronous CWD Worker processing, the Delegator publishes a job message to SQS containing the job ID, Worker type, business parameters, correlation ID, and required context. Workers consume the messages independently, process the job, call MCP or other downstream systems, and update the job status in DynamoDB. I use visibility timeouts, retries, exponential backoff, and a DLQ for failures. I also use idempotency keys to prevent duplicate business operations. This gives us decoupling, buffering, controlled concurrency, and reliable background processing.”**

### Easy memory trick

**Create → Queue → Consume → Process → Update → Retry → DLQ**

### Key distinction

* **SQS** → holds the work
* **ECS/Fargate** → runs the Worker
* **DynamoDB** → stores job status
* **MCP** → connects Worker to enterprise tools
* **DLQ** → holds repeatedly failed jobs
