## How would Glue trigger downstream processing?

After Glue successfully completes the ETL job, I would use **EventBridge** or a Glue workflow to trigger the next step.

```text
S3
 ↓
Glue ETL
 ↓
Job Succeeded
 ↓
EventBridge
 ↓
Lambda / Step Functions
 ↓
Embedding
 ↓
OpenSearch
```

### Example in CWD

```text
Glue ETL
   ↓
Clean + Chunk documents
   ↓
Write to S3
   ↓
EventBridge
   ↓
Embedding Worker
   ↓
OpenSearch
```

### Why EventBridge?

Glue can emit job state events such as **SUCCEEDED** or **FAILED**. EventBridge can react to the successful completion and start downstream processing.

For more complex workflows:

```text
Glue → Step Functions → Embedding → OpenSearch → Validation
```

### Interview answer

> “After Glue completes successfully, I would trigger downstream processing using EventBridge for event-driven processing or Step Functions for a multi-step workflow. For CWD, a successful Glue job could trigger the embedding process, followed by OpenSearch indexing. If Glue fails, downstream processing would not start.”

**Memory:**
**Glue Success → EventBridge/Step Functions → Embedding → OpenSearch**
