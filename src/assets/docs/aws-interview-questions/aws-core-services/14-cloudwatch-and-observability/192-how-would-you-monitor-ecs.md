### Monitor ECS

Use **CloudWatch + ECS service metrics + ALB metrics**.

```text id="e8c4n1"
ECS/Fargate
   ↓
CloudWatch
   ├── CPU / Memory
   ├── Task Count
   ├── Restarts
   ├── Errors
   └── Logs
        ↓
     Alarms
```

Monitor:

* **CPUUtilization** → CPU pressure
* **MemoryUtilization** → memory pressure
* **RunningTaskCount** → capacity/availability
* **Task failures/restarts** → unhealthy containers
* **ALB 4xx/5xx** → application errors
* **ALB P95/P99 latency** → response performance
* **Container logs** → exceptions and failures

For CWD, I would also track **Coordinator/Delegator/Worker latency and failure rates** using custom CloudWatch metrics.

### Interview answer

> “I monitor ECS using CloudWatch for CPU, memory, task count, and container failures. I also monitor ALB 4xx/5xx and P95/P99 latency. Application logs include correlation IDs, so I can trace a failed ECS request end-to-end. I configure CloudWatch alarms and autoscaling based on these metrics.”

**Memory:**
**CPU → Memory → Tasks → Errors → Latency → Logs → Scale**
