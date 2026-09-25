# Where would you use DynamoDB?

## Short answer

I would use **Amazon DynamoDB** in CWD for **fast, scalable, key-value/document data** such as workflow state, session metadata, agent/task information, idempotency records, and application configuration.

I would **not use DynamoDB as the primary RAG/vector database**. For that, I would use OpenSearch or another dedicated search/vector solution.

## Key points

* Fully managed NoSQL database.
* Very low-latency reads/writes.
* Horizontally scalable.
* Serverless capacity options.
* Good for key-value/document data.
* Supports TTL for automatic expiration.
* Conditional writes for concurrency control.
* Useful for idempotency.
* Supports DynamoDB Streams for change events.
* Integrates with Lambda and other AWS services.

### CWD flow

```text id="m8q3vx"
User
 ↓
API Gateway
 ↓
CWD API
 ↓
Coordinator
 ↓
DynamoDB
 ├── Session State
 ├── Task State
 ├── Run Metadata
 ├── Idempotency
 └── Agent/Workflow Metadata
 ↓
Delegator
 ↓
Workers
```

## Where would I use it?

### 1. Session state

For example:

```json id="f4n8pw"
{
  "session_id": "S123",
  "user_id": "U456",
  "last_customer_id": "C123",
  "status": "active"
}
```

The Coordinator can quickly retrieve the user's current session state.

---

### 2. Workflow state

CWD has a workflow hierarchy:

```text id="q7v2kc"
Session
  ↓
Task
  ↓
Run
  ↓
Turn
  ↓
Step
```

DynamoDB can store metadata about these workflow objects.

For example:

```text id="z5r9mn"
Run ID: R123
Status: RUNNING
Current Step: Service Worker
Started: 10:30
```

For complex LangGraph checkpointing requirements, I would select the persistence mechanism based on the framework and workload; DynamoDB can be an application-level state store.

---

### 3. Idempotency

This is very useful for CWD.

Suppose an MCP operation is accidentally submitted twice:

```text id="c6x2vt"
Request
  ↓
request_id = R123
  ↓
DynamoDB
  ↓
Already processed?
  ↓
YES → Don't execute again
```

This helps prevent duplicate operations.

---

### 4. Agent/task metadata

We can store information such as:

```text id="n9p4qw"
agent_id
agent_type
delegator_id
version
status
capabilities
```

For example:

```json id="b3m7ys"
{
  "agent_id": "sales-worker",
  "version": "v2",
  "status": "ACTIVE",
  "capabilities": [
    "customer_lookup",
    "opportunity_lookup"
  ]
}
```

---

### 5. TTL for temporary data

For temporary state:

```text id="r8k5dx"
Session metadata
Temporary cache
Idempotency record
Temporary workflow data
       ↓
TTL
       ↓
Automatic expiration
```

This prevents temporary records from growing indefinitely.

---

### 6. Conditional writes

Suppose two Workers try to update the same task:

```text id="p2v6hm"
Worker A ─┐
          ├──→ DynamoDB
Worker B ─┘
```

Conditional writes can help enforce rules such as:

> Update this record only if the current status is `PENDING`.

This helps with concurrency control.

---

### 7. DynamoDB Streams

If a DynamoDB record changes:

```text id="w5k3qn"
DynamoDB
   ↓
DynamoDB Streams
   ↓
Lambda
   ↓
EventBridge / downstream processing
```

This can support event-driven processing.

---

## Example: CWD workflow

Suppose the user asks:

> "Create a customer briefing for C123."

```text id="t9m4zc"
User
 ↓
API Gateway
 ↓
Coordinator
 ↓
Create Run ID
 ↓
DynamoDB
 └── Run = R123, Status = RUNNING
 ↓
Sales Delegator
 ↓
Sales Worker
 ↓
Service Worker
 ↓
DynamoDB
 └── Worker results / status metadata
 ↓
Coordinator
 ↓
Final response
 ↓
DynamoDB
 └── Run = COMPLETED
```

---

## DynamoDB vs S3 vs OpenSearch

This distinction is useful in interviews.

| Service               | CWD usage                      |
| --------------------- | ------------------------------ |
| **DynamoDB**          | Application/workflow state     |
| **S3**                | Documents/files/object storage |
| **OpenSearch**        | Search/vector/RAG data         |
| **ElastiCache/Redis** | Fast temporary cache           |
| **Bedrock**           | Foundation models              |

Think:

```text id="y4p8ks"
DynamoDB → State
S3       → Files
OpenSearch → Search
Redis    → Cache
Bedrock  → LLM
```

---

## 🎯 Strong interview answer

> **“I would use DynamoDB in CWD for low-latency, highly scalable application state rather than as the primary RAG database. For example, I can store session metadata, task and run status, agent metadata, idempotency records, and temporary workflow information. DynamoDB's conditional writes help with concurrency and duplicate-request prevention, and TTL can automatically expire temporary records. For documents and RAG, I would use S3 for object storage and OpenSearch for search and vector retrieval.”**

## Easy memory trick

**DynamoDB = Fast Application State**

**S3 = Files**

**OpenSearch = RAG/Search**

**Redis = Cache**

**Bedrock = LLM**

## Key distinction

> **“DynamoDB stores the application's state; it is not the primary vector database for my CWD RAG pipeline.”**
