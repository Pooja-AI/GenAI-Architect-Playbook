# How would you implement autoscaling?

## Short answer
Autoscale on the metric that reflects real demand.

## Key points
- Container Apps: KEDA rules on HTTP concurrency, queue length, CPU or custom metrics.
- AKS: HPA or KEDA plus cluster autoscaler.
- Set minimum, maximum and cooldown; load test.

## CWD context
Queue length for Workers, concurrent requests for the API.
