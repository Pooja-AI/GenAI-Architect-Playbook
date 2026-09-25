### CloudWatch vs CloudTrail vs X-Ray

| Tool           | Main purpose                      | Simple question                 |
| -------------- | --------------------------------- | ------------------------------- |
| **CloudWatch** | Metrics, logs, alarms, dashboards | **“Is something wrong?”**       |
| **CloudTrail** | AWS API activity/audit            | **“Who did what?”**             |
| **X-Ray**      | Distributed request tracing       | **“Where is it slow/failing?”** |

### CWD example

```text
User Request
     ↓
API Gateway
     ↓
Coordinator → Delegator → Worker
     ↓
CloudWatch → metrics + logs + alarms
     ↓
X-Ray → end-to-end request trace

CloudTrail → records AWS API actions
              ↓
        Who / What / When
```

**Example:**

* ECS CPU suddenly goes to 95% → **CloudWatch**
* Someone changes an IAM policy → **CloudTrail**
* Customer request takes 10 seconds → **X-Ray** to identify whether Coordinator, MCP, OpenSearch, or Bedrock caused the delay.

### Interview answer

> “CloudWatch is for monitoring metrics, logs, and alarms. CloudTrail is for auditing AWS API activity and identifying who performed an action. X-Ray is for distributed tracing and finding where a request is slow or failing. In CWD, I would use all three together.”

**Memory:**
**CloudWatch = Monitor | CloudTrail = Audit | X-Ray = Trace**
