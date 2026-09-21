# How would you scale SageMaker endpoints?

## Short answer
Scale endpoints with autoscaling on invocations per instance, with headroom.

## Key points
- Target-tracking on invocations per instance with a value from load tests; minimum of two instances.
- Scheduled scaling for known peaks; multi-model endpoints or inference components for many models.
- Asynchronous endpoints scale on backlog and can scale to zero.

## CWD context
Load test to find real per-instance capacity.
