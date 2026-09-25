# How would you trigger processing when a document arrives in S3?

For CWD, I would use an **event-driven architecture**:

```text
Document Upload
      ↓
     S3
      ↓
 S3 Event
      ↓
 EventBridge
      ↓
     SQS
      ↓
Ingestion Worker
      ↓
Extract → Chunk → Embed → OpenSearch
```

## 1. Document arrives in S3

For example:

```text
s3://cwd-documents/raw/customer_policy.pdf
```

S3 generates an **Object Created** event.

---

## 2. Send the event to EventBridge

I would use **Amazon EventBridge** to receive the S3 event and route it based on rules.

For example:

```text
S3 Object Created
       ↓
EventBridge Rule
       ↓
Is it under /raw/?
       ↓
YES → Continue
```

I can filter by:

* Bucket
* Object key/prefix
* Event type
* File type where appropriate

---

## 3. Put the event into SQS

```text
EventBridge
     ↓
    SQS
```

I prefer putting SQS between the event and processing Worker because it provides:

* Buffering
* Retry
* Backpressure
* DLQ
* Controlled concurrency

So if 10,000 documents arrive together, I don't need to immediately start 10,000 processing tasks.

---

## 4. Ingestion Worker processes the document

The Worker receives the S3 object information:

```text
bucket
object_key
version_id
event_id
```

Then:

```text
S3
 ↓
Download document
 ↓
Extract/OCR
 ↓
Clean
 ↓
Chunk
 ↓
Generate embeddings
 ↓
OpenSearch
```

---

## 5. Make processing idempotent

S3 events can potentially be delivered more than once, so I don't want duplicate processing.

I can create an idempotency key such as:

```text
document_id + version_id
```

and store processing status in DynamoDB:

```text
QUEUED
   ↓
PROCESSING
   ↓
COMPLETED
```

If the same event arrives again:

```text
Already COMPLETED?
      ↓
    Skip
```

---

## 6. Handle failures

```text
Ingestion Worker
      ↓
   Failure
      ↓
 SQS Retry
      ↓
Backoff + Retry
      ↓
Repeated failure
      ↓
     DLQ
```

After fixing the problem, I can replay the failed message.

---

# 🎯 Strong interview answer

> **“For CWD, I would trigger document processing using an event-driven pipeline. When a document is uploaded to S3, an Object Created event is generated. I would route that event through EventBridge and then place it into SQS for buffering, retries, backpressure, and DLQ handling. An ingestion Worker consumes the message, retrieves the document from S3, performs extraction or OCR, chunking and embedding, and indexes the result into OpenSearch. I would also use the document ID and S3 version ID for idempotency so duplicate events don't cause duplicate processing.”**

### Easy memory trick

**S3 → EventBridge → SQS → Worker → OpenSearch**

### Key distinction

**EventBridge = routes the event**
**SQS = buffers the work**
**Worker = processes the document**
**OpenSearch = makes it searchable for RAG**
