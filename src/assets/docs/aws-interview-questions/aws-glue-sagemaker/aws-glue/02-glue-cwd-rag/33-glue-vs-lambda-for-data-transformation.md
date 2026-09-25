## Glue vs Lambda for data transformation

The simple rule is:

**Glue = large/batch data transformation**
**Lambda = small/event-driven transformation**

```text id="qf3h9w"
Large Dataset
    ↓
   Glue
    ↓
Spark / Distributed ETL
```

```text id="1z3b4c"
Small Event
    ↓
  Lambda
    ↓
Quick Transformation
```

### Glue

Use Glue when:

* Large datasets
* Batch processing
* ETL pipelines
* Complex transformations/joins
* Distributed Spark processing
* S3/Data Lake processing

**CWD example:**
Process millions of historical Salesforce records → clean → deduplicate → Parquet → S3.

### Lambda

Use Lambda when:

* Small payload
* Short-running task
* Event-driven processing
* Simple transformation
* S3/SQS/EventBridge trigger

**CWD example:**
A new document arrives in S3 → Lambda validates metadata → sends an event to the next processing step.

### Interview answer

> “I would use Glue for large-scale batch transformations because it provides distributed Spark-based processing. I would use Lambda for lightweight, short-running, event-driven transformations. In CWD, historical enterprise data processing would use Glue, while small S3 or EventBridge-triggered tasks could use Lambda.”

**Memory:**
**Glue = Big + Batch + Distributed**
**Lambda = Small + Event + Short**
