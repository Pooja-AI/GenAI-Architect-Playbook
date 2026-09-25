# Where would you use SQS?

## Short answer

I would use **Amazon SQS** as a **durable message queue** between CWD components when I need to decouple producers and consumers, absorb traffic spikes, support asynchronous processing, and handle retries without blocking the main request.

## Key points

* Decouples services.
* Buffers traffic spikes.
* Supports asynchronous processing.
* Provides durable message storage.
* Supports retries.
* Dead-letter queues (DLQ).
* Controls consumer concurrency.
* Helps protect downstream systems.
* Supports horizontal scaling.
* Useful for long-running/background work.

### CWD flow

```text id="k4p8zs"
CWD
 ↓
Producer
 ↓
SQS Queue
 ↓
Consumer
 ↓
Worker / Lambda / ECS
 ↓
MCP / Enterprise System
```

## Where would I use it?

### 1. Asynchronous Worker processing

Suppose CWD receives many document-processing requests:

```text id="x7m2qd"
User Requests
     ↓
CWD API
     ↓
SQS
     ↓
Worker
     ↓
Process document
```

The API doesn't need to wait for every document to finish.

---

### 2. Absorb traffic spikes

Suppose 1,000 requests arrive suddenly:

```text id="r9v5nc"
1,000 requests
      ↓
     SQS
      ↓
  Queue builds
      ↓
Consumers process
at controlled rate
```

This prevents the downstream Worker or enterprise API from being overwhelmed.

---

### 3. Control concurrency

This is particularly useful for CWD.

For example, Salesforce may only tolerate a certain level of concurrent traffic.

```text id="w3k8pb"
SQS
 ↓
Consumer concurrency = 5
 ↓
5 Worker executions
 ↓
Salesforce
```

Instead of allowing hundreds of requests to hit Salesforce simultaneously.

---

### 4. Retry failed processing

Suppose a Worker temporarily fails:

```text id="q6n4yt"
SQS
 ↓
Worker
 ↓
Failure
 ↓
Message becomes available again
 ↓
Retry
```

For transient failures, the message can be retried.

---

### 5. Dead-letter queue

If a message repeatedly fails:

```text id="z8c2mv"
SQS
 ↓
Worker
 ↓
Failure
 ↓
Retry
 ↓
Retry
 ↓
Retry
 ↓
DLQ
```

The DLQ allows us to investigate the problematic message instead of retrying forever.

---

### 6. Decouple CWD services

Without SQS:

```text id="j4v7px"
Coordinator → Worker
             ↓
          Worker down
             ↓
        Request blocked
```

With SQS:

```text id="t5r9ka"
Coordinator
     ↓
    SQS
     ↓
 Worker
```

The producer and consumer don't need to be available at exactly the same time.

---

## Example: CWD document ingestion

```text id="n2x6wc"
SharePoint / S3
      ↓
Event
      ↓
SQS
      ↓
Ingestion Worker
      ↓
Extract
      ↓
Chunk
      ↓
Embed
      ↓
OpenSearch
```

If OpenSearch temporarily fails, the processing can be retried instead of losing the request.

---

## SQS vs Step Functions

This is an important interview distinction.

| SQS                              | Step Functions               |
| -------------------------------- | ---------------------------- |
| Message queue                    | Workflow orchestrator        |
| Decouples producers/consumers    | Coordinates workflow steps   |
| Buffers traffic                  | Tracks workflow state        |
| Async processing                 | Sequential/parallel workflow |
| Retry messages                   | Retry workflow states        |
| DLQ                              | Catch/error handling         |
| Great for event-driven workloads | Great for defined workflows  |

Think:

```text
SQS
 ↓
"Hold this work until a consumer can process it."

Step Functions
 ↓
"Execute these workflow steps in this order."
```

---

## SQS vs SNS

Another common interview question:

```text
SQS → Queue / one workload consumer pattern

SNS → Publish / fan-out notifications
```

For example:

```text
SNS
 ↓
 ├── SQS → Worker
 ├── SQS → Audit
 └── Lambda → Notification
```

SNS can distribute an event to multiple subscribers, while SQS provides durable queued processing for consumers.

---

## 🎯 Strong interview answer

> **“I would use SQS in CWD when I need asynchronous, decoupled processing. For example, document ingestion or background Worker tasks can publish messages to SQS, and Lambda or ECS consumers process them independently. SQS absorbs traffic spikes, controls the rate at which downstream systems are called, supports retries, and provides a DLQ for messages that repeatedly fail. This is especially useful for protecting enterprise systems such as Salesforce or ServiceNow from sudden bursts of concurrent requests. Step Functions would be used when I need to orchestrate a defined multi-step workflow, whereas SQS is primarily for durable asynchronous messaging.”**

## Easy memory trick

**SQS = Queue → Buffer → Process → Retry → DLQ**

## Key distinction

> **“SQS doesn't orchestrate my agents; it decouples and buffers work between components.”**
