## How would you monitor Glue jobs?

I would use **CloudWatch + Glue job metrics/logs**.

```text id="n9v0wq"
Glue Job
   ↓
CloudWatch
   ├── Job status
   ├── Duration
   ├── Errors
   ├── Spark metrics
   └── Logs
        ↓
     Alarms
        ↓
   SNS / Incident
```

### What I monitor

* **Job success/failure**
* **Job duration** — detect performance degradation
* **Errors/exceptions**
* **Records processed**
* **Data quality failures**
* **Spark executor/worker performance**
* **Data skew / slow stages**
* **Input/output data volume**
* **S3 read/write failures**

### Example alarm

```text
Glue Job FAILED
      ↓
CloudWatch Alarm
      ↓
SNS / Alert
      ↓
Investigate logs
```

For CWD, I would also track:

```text
Glue → S3 → Embedding → OpenSearch
```

and ensure downstream processing starts **only after successful Glue completion**.

### Interview answer

> “I would monitor Glue jobs using CloudWatch metrics and Glue/Spark logs. I would track job status, duration, failures, records processed, data volume, and Spark performance. I would configure alarms for job failures or abnormal duration and use structured logs to troubleshoot ETL issues.”

**Memory:**
**Status → Duration → Errors → Data Volume → Spark → Alarm**
