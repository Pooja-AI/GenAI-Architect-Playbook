# How do you implement health checks?

## Short answer
Combine load balancer and container health checks, with a startup grace period.

## Key points
- ALB target-group health checks on a shallow /health endpoint.
- Container health check command in the task definition.
- healthCheckGracePeriodSeconds for slow start; keep dependency checks shallow.

## CWD context
Deep dependency checks in health endpoints can cause cascading restarts.
