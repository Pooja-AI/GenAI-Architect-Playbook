# How do you handle API Gateway timeout?

## Short answer

I **don't let API Gateway wait indefinitely** for the CWD agent workflow. I set a timeout appropriate to the API, move long-running work to **asynchronous processing**, and use **timeouts + retries + status tracking** for downstream services.

### CWD flow

```text
User
 ↓
API Gateway
 ↓
CWD API
 ↓
Coordinator
 ↓
Delegator
 ↓
Workers
 ↓
Bedrock / MCP / RAG
```

If the complete workflow may take longer than the API Gateway timeout:

```text
User
 ↓
API Gateway
 ↓
CWD API
 ↓
Start async job
 ↓
SQS / Step Functions
 ↓
Workers
 ↓
Result stored in DynamoDB/S3
 ↓
Client checks status
```

## 1. Set timeouts at every layer

Don't only configure an API Gateway timeout.

For example:

```text
API Gateway
   ↓
CWD API timeout
   ↓
Coordinator timeout
   ↓
Worker timeout
   ↓
MCP timeout
   ↓
Bedrock timeout
```

Each layer should have a controlled timeout.

---

## 2. For short requests, fail fast

For a normal Customer Briefing request:

```text
User
 ↓
API Gateway
 ↓
CWD
 ↓
Coordinator
 ↓
Workers
 ↓
Response
```

If Salesforce or Bedrock is taking too long:

```text
Timeout
   ↓
Retry if transient
   ↓
Backoff + jitter
   ↓
If still failing → graceful failure/partial response
```

I don't keep retrying until the API Gateway itself times out.

---

## 3. Use asynchronous processing for long-running jobs

This is the most important solution.

For example, suppose a large document-processing job takes several minutes.

Instead of:

```text
Client ──────────────── waits ────────────────→ Response
```

I use:

```text
Client
  ↓
API Gateway
  ↓
CWD
  ↓
Create Job ID
  ↓
SQS / Step Functions
  ↓
Workers process asynchronously
  ↓
DynamoDB = job status
  ↓
Client → GET /jobs/{job_id}
```

Example:

```text
POST /customer-briefing
        ↓
202 Accepted
{
   "job_id": "JOB123",
   "status": "RUNNING"
}
```

Then:

```text
GET /customer-briefing/JOB123
        ↓
COMPLETED
```

---

## 4. Retry only transient failures

For downstream timeout:

```text
Timeout
   ↓
Retry
   ↓
Exponential backoff + jitter
   ↓
Retry limit reached?
   ↓
Fallback / partial response / failure
```

I don't retry indefinitely because that can create a **retry storm** and make the timeout problem worse.

---

## 5. Use circuit breaker

If ServiceNow is repeatedly timing out:

```text
Worker → MCP → ServiceNow
                 ↓
             Timeout
                 ↓
             Retry
                 ↓
             Timeout
                 ↓
        Circuit Breaker OPEN
```

The Worker temporarily stops calling ServiceNow.

After a recovery period, it allows limited test requests again.

---

## 6. Handle partial results

Suppose CWD has:

```text
Sales Delegator
 ├── Salesforce Worker      ✓
 └── CRM Worker             ✓

IT Delegator
 └── ServiceNow Worker      ✗ Timeout
```

If ServiceNow data is optional, the Delegator can return:

```text
Customer information: available
Incident information: temporarily unavailable
```

The Coordinator should **not invent the missing information**.

---

## 🎯 Strong interview answer

> **“I handle API Gateway timeouts by setting timeouts at every layer and designing the CWD workflow so the API doesn't wait indefinitely. For short requests, I use bounded retries with exponential backoff and jitter, and circuit breakers for repeatedly failing dependencies. For long-running workloads, I make the API asynchronous using SQS or Step Functions, return a job ID with 202 Accepted, and track the job status in DynamoDB. If one optional Worker times out, the Delegator can return a partial response rather than failing the entire request.”**

## Easy memory trick

**T → R → B → C → A**

* **T**imeout controls
* **R**etry transient failures
* **B**ackoff
* **C**ircuit breaker
* **A**sync for long jobs

### Key distinction

**Short request → synchronous + bounded timeout**

**Long-running workflow → asynchronous + job ID**

**Repeated dependency failure → circuit breaker**

**Optional Worker failure → partial response**

**Never → wait indefinitely or retry forever**
