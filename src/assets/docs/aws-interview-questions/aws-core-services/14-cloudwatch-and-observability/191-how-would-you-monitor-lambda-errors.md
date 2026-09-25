### Monitor Lambda Errors

Use **CloudWatch**.

```text
Lambda
  ↓
CloudWatch Metrics + Logs
  ↓
Alarm
  ↓
SNS / Notification
```

Monitor these key metrics:

* **Errors** → function failures
* **Throttles** → Lambda concurrency limit reached
* **Duration** → slow execution
* **Invocations** → request volume
* **ConcurrentExecutions** → concurrency usage

For detailed troubleshooting, check **CloudWatch Logs** for the exception, stack trace, `request_id`, and `correlation_id`.

### Interview answer

> “I monitor Lambda using CloudWatch metrics and logs. I create alarms for errors, throttles, and high duration. When an error occurs, I use the Lambda request ID and CWD correlation ID to trace the failure through CloudWatch Logs and X-Ray/OpenTelemetry.”

**Memory:**
**Errors → Throttles → Duration → Logs → Trace → Alarm**
