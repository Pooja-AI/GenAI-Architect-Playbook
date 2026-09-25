## How would you implement incremental data ingestion?

Instead of processing **all Salesforce data every time**, I would ingest only **new or changed records**.

```text
Salesforce
    ↓
Last Successful Timestamp
    ↓
Glue Job
    ↓
Only New/Updated Records
    ↓
S3
    ↓
OpenSearch
```

### Example

First run:

```text
Last Run = 2026-09-20
```

Glue queries Salesforce for:

```text
LastModifiedDate > 2026-09-20
```

It processes only those records.

After successful completion:

```text
New Last Run = 2026-09-25
```

### Where do I store the checkpoint?

For example:

```text
DynamoDB
-------------------------
source: Salesforce
object: Account
last_successful_time: ...
```

Or use a Glue job bookmark where it fits the ingestion pattern.

### Important

Only update the checkpoint **after successful processing**.

```text
Read → Process → Write successfully
                  ↓
            Update checkpoint
```

If the job fails, don't advance the checkpoint, so the data can be retried.

### Interview answer

> “I would implement incremental ingestion using a watermark such as Salesforce LastModifiedDate. The Glue job reads the last successful checkpoint, extracts only records changed after that timestamp, processes them, and updates the checkpoint only after successful completion. For suitable Glue sources, I can also use Glue job bookmarks.”

**Memory:**
**Checkpoint → Extract Changes → Process → Success → Update Checkpoint**
