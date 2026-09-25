## How would you monitor inference cost?

I would track **cost per model, endpoint, request, and environment** and correlate cost with traffic.

```text
Requests
   ↓
SageMaker Endpoint
   ↓
Usage Metrics ──→ CloudWatch
   ↓
Cost Data ──────→ AWS Cost Explorer
   ↓
Cost / Request
Cost / Model
Cost / Environment
```

### What I monitor

* Total SageMaker endpoint cost
* Instance hours
* Number of inference requests
* Cost per 1,000 requests
* CPU/GPU utilization
* Idle capacity
* Cost by model/version/environment

### Optimization

If cost is high:

* Right-size instances
* Enable autoscaling
* Scale down during low traffic
* Use Serverless for suitable low-volume workloads
* Use asynchronous inference for suitable workloads
* Optimize the model
* Remove unused endpoints

### Interview answer

> “I monitor SageMaker inference cost using AWS Cost Explorer and CloudWatch usage metrics. I correlate instance hours and request volume to calculate cost per request and identify idle or underutilized endpoints. If costs increase, I right-size instances, configure autoscaling, use serverless or asynchronous inference where appropriate, and optimize the model.”

**Memory:** `Usage → Cost → Cost/Request → Find Waste → Optimize`
