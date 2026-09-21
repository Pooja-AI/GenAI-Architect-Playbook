# How would you monitor SageMaker endpoints?

## Short answer
Monitor endpoints with CloudWatch metrics, logs and Model Monitor.

## Key points
- Invocations, model and overhead latency, 4XX and 5XX errors, CPU, memory and GPU.
- Alarms on p95 latency, errors and saturation; backlog metrics for asynchronous endpoints.
- Model Monitor for data and model quality.

## CWD context
Track quality as well as availability.
