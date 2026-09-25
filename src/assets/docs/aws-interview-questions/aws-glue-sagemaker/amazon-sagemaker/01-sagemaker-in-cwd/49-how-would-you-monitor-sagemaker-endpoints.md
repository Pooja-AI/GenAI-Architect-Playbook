## How would you monitor SageMaker endpoints?

I would monitor **infrastructure + inference performance + model quality**.

```text
SageMaker Endpoint
       ↓
CloudWatch
 ├── Latency
 ├── Invocations
 ├── Errors
 ├── CPU / Memory
 └── Throttling
       ↓
Alarms → SNS / Incident
```

### What I monitor

1. **Latency** – P50/P95/P99 inference latency.
2. **Errors** – 4xx/5xx and failed invocations.
3. **Traffic** – invocation count and request rate.
4. **Resource utilization** – CPU, memory, instance utilization.
5. **Model quality** – accuracy, precision/recall, F1 where labels are available.
6. **Data/model drift** – detect changes in production input data or model behavior.
7. **Cost** – endpoint instance usage and utilization.

### CWD example

```text
ML Worker
   ↓
SageMaker Endpoint
   ↓
CloudWatch
   ↓
High P95 / Error Rate
   ↓
Alarm
   ↓
Investigate / Scale / Rollback
```

### Interview answer

> “I would use CloudWatch to monitor SageMaker endpoint latency, invocation rate, errors, resource utilization, and throttling. At the ML level, I would monitor model quality and data drift. I would configure alarms for abnormal latency or error rates and use CloudTrail for API auditing.”

**Memory:**
**Traffic → Latency → Errors → Resources → Model Quality → Drift**
