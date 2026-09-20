# How would you scale an Azure ML endpoint?

## Short answer
Scale with autoscale rules and correct instance sizing, across zones.

## Key points
- Azure Monitor autoscale on CPU, request rate or custom metrics.
- Minimum of two instances for availability; tune concurrent requests per instance.
- Choose CPU or GPU SKUs to fit the model; load test.

## CWD context
Use traffic splitting for safe rollouts.
