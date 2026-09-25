# Why SQS instead of synchronous API calls?

## Short answer

I use **SQS when the work does not need to finish before I respond to the user**.

Synchronous API:

```text
Request → Worker → Salesforce → Response
```

SQS:

```text
Request → SQS → Worker → Salesforce
              ↓
           Process later
```

## Why SQS?

### 1. Handle traffic spikes

Suppose 1,000 requests arrive at once.

Without SQS:

```text
1000 requests
     ↓
1000 API calls
     ↓
Salesforce overloaded
```

With SQS:

```text
1000 requests
     ↓
   SQS
     ↓
10-20 Workers process at controlled rate
     ↓
Salesforce
```

SQS acts as a **buffer**.

---

### 2. Protect downstream systems

In CWD, Salesforce/ServiceNow may have API/concurrency limits.

SQS allows me to control how many Workers process requests simultaneously.

```text
SQS
 ↓
Worker 1
Worker 2
Worker 3
...
Worker 10
 ↓
ServiceNow
```

This prevents a sudden traffic spike from overwhelming the downstream system.

---

### 3. Retry failures

With synchronous calls:

```text
Worker → ServiceNow → failure
```

The request may fail immediately.

With SQS:

```text
SQS
 ↓
Worker
 ↓
ServiceNow
 ↓
Temporary failure
 ↓
Retry
 ↓
Worker
```

Persistent failures can go to a **DLQ**.

---

### 4. Decouple services

Synchronous:

```text
Coordinator
     ↓
Worker
```

Coordinator is directly dependent on Worker availability.

SQS:

```text
Coordinator
     ↓
    SQS
     ↓
   Worker
```

The Worker can be temporarily unavailable while the message remains in the queue.

---

### 5. Better for long-running work

For something like document processing:

```text
User
 ↓
API
 ↓
SQS
 ↓
Document Worker
 ↓
OCR → Embedding → Indexing
```

The user doesn't need to keep an HTTP connection open for the entire operation.

---

# But don't use SQS everywhere

For a **real-time Customer Briefing**, the user may need an immediate answer:

```text
User
 ↓
Coordinator
 ↓
Sales Delegator
 ↓
Customer Worker
 ↓
MCP
 ↓
Salesforce
 ↓
Response
```

Here, synchronous calls can be appropriate.

For asynchronous processing:

```text
Document ingestion
Batch processing
Large report generation
Background enrichment
Bulk Salesforce updates
```

SQS is more appropriate.

## 🎯 Strong interview answer

> **“I would use synchronous API calls when the user needs an immediate response. I would use SQS when the work can be processed asynchronously or when I need buffering, controlled concurrency, retries, and downstream protection. In CWD, for example, a real-time Customer Briefing could use synchronous MCP calls, while document ingestion or bulk processing could use SQS. This gives us resilience without adding unnecessary asynchronous complexity.”**

### Easy memory trick

**Synchronous = “I need the answer now.”**

**SQS = “Process this reliably, but it doesn't have to finish now.”**

### Key distinction

**API call → immediate response**

**SQS → durable work item + buffering + retry**
