# Where would you use SQS in CWD?

I would use **Amazon SQS for asynchronous, decoupled work** in CWD—especially when I want to **buffer traffic, control concurrency, retry failures, and protect downstream systems**.

### CWD example

```text
User
  ↓
API Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
   ┌───────────────┐
   │ SQS Queue     │
   └───────┬───────┘
           ↓
       Worker
           ↓
      MCP Client
           ↓
      MCP Server
       ↙       ↘
 Salesforce   ServiceNow
```

## 1. Protect downstream systems

Suppose 1,000 requests arrive but Salesforce can safely handle only 100 concurrent operations.

Instead of calling Salesforce directly:

```text
1000 requests
     ↓
   SQS
     ↓
Worker processes controlled number
     ↓
Salesforce
```

SQS acts as a **buffer**.

---

## 2. Handle traffic spikes

Example:

```text
Normal:     20 requests/sec
Peak:      500 requests/sec
```

Instead of immediately creating 500 downstream calls:

```text
500 requests
     ↓
   SQS Queue
     ↓
Workers gradually process
```

This prevents sudden overload.

---

## 3. Retry failed Worker processing

Suppose an Incident Worker calls ServiceNow and ServiceNow temporarily fails.

```text
Worker
  ↓
ServiceNow
  ↓
Temporary failure
  ↓
Message retry
  ↓
Worker
  ↓
ServiceNow
```

Use **visibility timeout + retry policy** and eventually move repeatedly failing messages to a **Dead-Letter Queue (DLQ)**.

---

## 4. Long-running/asynchronous tasks

For example, a user asks CWD to process 10,000 documents.

Instead of keeping the HTTP request open:

```text
User
 ↓
Coordinator
 ↓
SQS
 ↓
Document Workers
 ↓
Processing
```

The API can return:

```text
"Request accepted. Job ID = 12345"
```

The user can later check the job status.

---

## 5. Decouple Coordinator and Workers

Instead of tightly coupling services:

```text
Coordinator → Worker
```

you can have:

```text
Coordinator
     ↓
   SQS
     ↓
   Worker
```

Now the Worker can scale independently.

---

# Where exactly in CWD?

I would primarily use SQS for:

| CWD use case                        | SQS?                         |
| ----------------------------------- | ---------------------------- |
| Async Worker execution              | ✅                            |
| Traffic buffering                   | ✅                            |
| Downstream protection               | ✅                            |
| Retry/DLQ                           | ✅                            |
| Document ingestion                  | ✅                            |
| Batch processing                    | ✅                            |
| Long-running jobs                   | ✅                            |
| Simple synchronous request/response | Usually ❌                    |
| Agent reasoning/orchestration       | Usually ❌                    |
| Agent state                         | ❌ DynamoDB                   |
| Semantic cache                      | ❌ Redis                      |
| Agent workflow                      | ❌ LangGraph / Step Functions |

### Important distinction

**SQS = Queue and buffer work.**

**Step Functions = Orchestrate a defined workflow.**

**LangGraph = Orchestrate dynamic agent reasoning.**

For example:

```text
Coordinator
    ↓
LangGraph
    ↓
Sales Delegator
    ↓
SQS  ← asynchronous work
    ↓
Customer Worker
    ↓
MCP
    ↓
Salesforce
```

### 🎯 Strong interview answer

> **“In CWD, I would use SQS mainly for asynchronous Worker execution, traffic buffering, retries, and downstream protection. For example, if many requests arrive simultaneously but Salesforce or ServiceNow has a concurrency limit, I can put the work into SQS and let Workers consume messages at a controlled rate. I would configure retries and a DLQ for persistent failures. I would not use SQS for agent reasoning or workflow state; LangGraph handles dynamic agent orchestration, while DynamoDB handles durable state.”**

**Memory trick:**
**SQS = Buffer → Decouple → Process → Retry → DLQ**
