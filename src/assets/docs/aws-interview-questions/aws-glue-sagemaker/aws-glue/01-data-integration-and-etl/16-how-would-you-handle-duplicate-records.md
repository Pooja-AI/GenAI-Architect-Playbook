## How would you handle duplicate records?

I would use a **unique business key + deduplication logic** before loading the data.

```text id="h0zqko"
Source
  ↓
Glue ETL
  ↓
Identify Duplicate
  ↓
Keep Latest Record
  ↓
S3 / OpenSearch
```

### Example

Salesforce:

```text
customer_id = 123
```

If the same customer appears multiple times, use `customer_id` as the **deduplication key**.

For records with multiple versions:

```text
customer_id | LastModifiedDate
123         | 10:00
123         | 11:30  ← keep this
```

Glue can use Spark/DataFrame logic such as:

```text
partition by customer_id
→ order by LastModifiedDate DESC
→ keep latest
```

### Also important

For the ingestion pipeline itself, use **idempotency** so retrying the same batch doesn't create duplicates.

### Interview answer

> “I would identify duplicates using a stable business key such as customer_id. In the Glue ETL job, I would partition by that key, keep the latest record based on LastModifiedDate, and then write the deduplicated data to S3 or OpenSearch. I would also make the ingestion process idempotent so retries don't create duplicate records.”

**Memory:**
**Business Key → Detect → Keep Latest → Idempotent Write**
