# OpenSearch vs DynamoDB

The simple difference is:

> **OpenSearch = Search**
> **DynamoDB = Application State**

For CWD, they solve different problems.

| Area                         | OpenSearch         | DynamoDB                   |
| ---------------------------- | ------------------ | -------------------------- |
| Primary purpose              | Search & retrieval | Application state/data     |
| Full-text search             | ✅                  | ❌                          |
| Vector search                | ✅                  | Limited/not primary choice |
| BM25                         | ✅                  | ❌                          |
| Hybrid search                | ✅                  | ❌                          |
| RAG                          | ✅                  | ❌                          |
| Key-value access             | Not primary        | ✅                          |
| Workflow state               | Not primary        | ✅                          |
| Session/task/run data        | Not primary        | ✅                          |
| High-scale application state | Not primary        | ✅                          |
| Document/chunk retrieval     | ✅                  | ❌                          |

### In CWD

I would use **OpenSearch** for:

```text
Documents
   ↓
Chunks
   ↓
Embeddings + Metadata
   ↓
OpenSearch
   ↓
Vector / BM25 / Hybrid Search
   ↓
Relevant chunks
```

And **DynamoDB** for:

```text
Session
Task
Run
Worker status
Checkpoint
Idempotency
Workflow metadata
```

Example:

```text
DynamoDB

RUN#R123
 ├── STATUS = RUNNING
 ├── WORKER#CUSTOMER = COMPLETED
 ├── WORKER#SALES = COMPLETED
 └── WORKER#INCIDENT = FAILED
```

While OpenSearch contains:

```text
DOC123 / CHUNK001
DOC123 / CHUNK002
DOC456 / CHUNK001
...
```

with their embeddings and searchable text.

### Important distinction

If the user asks:

**"Find documents related to warranty policy."**

→ **OpenSearch**

If the application asks:

**"What is the current status of Run R123?"**

→ **DynamoDB**

### 🎯 Strong interview answer

> **“I would not use OpenSearch and DynamoDB interchangeably. In CWD, OpenSearch is the retrieval layer for RAG—it stores searchable document chunks, embeddings and metadata and supports vector, BM25 and hybrid search. DynamoDB is the durable application-state layer for sessions, tasks, runs, Worker status, checkpoints and idempotency records. So OpenSearch answers ‘which information is relevant?’ while DynamoDB answers ‘what is the current application state?’”**

**Memory trick:**
**OpenSearch → Find information**
**DynamoDB → Store application state**
