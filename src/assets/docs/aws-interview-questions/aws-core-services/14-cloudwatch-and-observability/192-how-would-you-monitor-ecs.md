# How would you monitor ECS?

## Short answer
Monitor ECS with Container Insights, service metrics and task events.

## Key points
- CPU, memory, network, running versus desired task count.
- Stopped-task reasons through EventBridge task state change events.
- ALB target health, deployment events and logs.

## CWD context
Alert when running tasks fall below desired for more than a few minutes.
