## How would Glue trigger downstream processing?

I would trigger downstream processing **only after the Glue job succeeds**.

```text
Glue ETL Job
     ↓
  SUCCESS
     ↓
EventBridge
     ↓
Step Functions / Lambda
     ↓
Embedding
     ↓
OpenSearch
```

### Two common approaches

**1. EventBridge**

* Glue job completes successfully.
* EventBridge detects the Glue `SUCCEEDED` event.
* Triggers Lambda or another workflow.

**2. Step Functions**

* Better when multiple steps are required.
* Example:
  `Glue → Embedding → OpenSearch → Validation`

### CWD example

```text
S3
 ↓
Glue ETL
 ↓
SUCCESS
 ↓
Step Functions
 ↓
Chunk/Embed
 ↓
OpenSearch
 ↓
RAG Worker
```

If Glue **fails**, downstream processing should **not start**.

### Interview answer

> “After a successful Glue ETL job, I would use EventBridge for event-driven triggering or Step Functions for a multi-step workflow. For CWD, a typical flow would be Glue → Step Functions → embedding → OpenSearch. If Glue fails, I would stop the downstream workflow and alert through CloudWatch.”
