# How would you reduce Azure ML inference cost?

## Short answer
Reduce inference cost by right-sizing and matching the endpoint type to the workload.

## Key points
- Right-size SKUs, autoscale down, low minimum instances for non-critical models.
- Batch endpoints for non-real-time work.
- Optimise models (quantisation, ONNX, distillation).
- Turn off idle dev endpoints; consider reservations.

## CWD context
Track cost per prediction alongside latency.
