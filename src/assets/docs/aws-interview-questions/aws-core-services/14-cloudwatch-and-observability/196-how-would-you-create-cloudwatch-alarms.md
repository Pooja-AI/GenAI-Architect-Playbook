### How would you create CloudWatch alarms?

Define a **metric + threshold + evaluation period + action**.

```text id="k4v8ps"
CloudWatch Metric
      ↓
Set Threshold
      ↓
Evaluation Period
      ↓
Alarm: OK / ALARM
      ↓
SNS / Auto Scaling / Incident
```

For CWD, examples:

* **API 5xx > 5%** → alarm
* **P95 latency > 5 sec** → alarm
* **ECS CPU > 80%** → scaling/alarm
* **SQS oldest message > 5 min** → alarm
* **SQS DLQ messages > 0** → alarm
* **Bedrock throttling > threshold** → alarm

### Interview answer

> “I create CloudWatch alarms by selecting a metric, defining a threshold and evaluation period, and configuring an action such as SNS notification or autoscaling. For CWD, I would create alarms for high 5xx errors, P95 latency, ECS resource utilization, SQS backlog or DLQ messages, and Bedrock throttling.”

**Memory:**
**Metric → Threshold → Evaluation → Alarm → Action**
