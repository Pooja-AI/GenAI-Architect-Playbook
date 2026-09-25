### Detect a cost spike

Use **AWS Cost Explorer + AWS Budgets + CloudWatch/application metrics**.

```text id="p5n8rx"
AWS Usage
   ↓
Cost / Usage Metrics
   ↓
Compare with baseline
   ↓
Unexpected increase?
   ↓
Budget Alarm
   ↓
Investigate
```

For CWD, monitor:

* **Bedrock token usage** → input/output tokens, model usage
* **ECS/Fargate** → task count and runtime
* **OpenSearch** → compute/search usage
* **S3** → storage and request volume
* **NAT Gateway** → data processing charges
* **DynamoDB** → read/write consumption
* **SQS/Lambda** → invocation and message volume

Example:

> Normal Bedrock usage = 1M tokens/day
> Suddenly = 5M tokens/day → cost anomaly → investigate which Worker/workflow increased LLM calls.

### Interview answer

> “I detect cost spikes by setting AWS Budgets and cost anomaly alerts, then correlate cost with usage metrics. For CWD, I especially monitor Bedrock token usage, ECS task count, OpenSearch, S3, DynamoDB, and NAT Gateway usage. If cost suddenly increases, I trace it back to the responsible service, Worker, workflow, or increased traffic.”

**Memory:**
**Cost → Usage → Baseline → Alert → Find source → Optimize**
