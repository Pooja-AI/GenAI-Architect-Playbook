## Where would I introduce SQS in CWD?

I would introduce SQS **between components where work can be asynchronous** and where I need **buffering, decoupling, retries, and backpressure**.

```text id="r2n6vk"
User
 ↓
API Gateway
 ↓
Coordinator
 ↓
Delegator
 ↓
SQS
 ↓
Worker
 ↓
MCP / Bedrock / Enterprise Systems
```

### Good places in CWD

**1. Delegator → Worker**

```text id="z7k3qa"
Delegator → SQS → Workers
```

Useful when many requests arrive and Workers need controlled concurrency.

**2. Document ingestion**

```text id="q8m4tp"
S3
 ↓
EventBridge
 ↓
SQS
 ↓
RAG Worker
 ↓
OpenSearch
```

Useful for buffering large document-ingestion workloads.

**3. Failed processing**

```text id="w5c9dn"
SQS → Worker → failure
              ↓
             DLQ
```

### Important

I would **not put SQS in the middle of every synchronous request**.

For example, if the user expects an immediate Customer Briefing response, I can keep the initial orchestration synchronous and use SQS for long-running or asynchronous work.

### Interview answer

> “I would introduce SQS mainly between the Delegator and Workers, and for asynchronous workloads such as document ingestion. It gives CWD buffering, backpressure, retries, and decoupling. I would avoid putting SQS into latency-sensitive synchronous paths unless the business flow supports asynchronous processing.”

**Memory:**
**SQS = Buffer → Decouple → Retry → Backpressure**
