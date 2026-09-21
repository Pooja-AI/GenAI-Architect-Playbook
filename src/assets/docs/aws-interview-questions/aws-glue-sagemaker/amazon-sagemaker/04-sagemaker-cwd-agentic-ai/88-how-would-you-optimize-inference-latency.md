# How would you optimize inference latency?

## Short answer
Optimise inference latency by optimising the model, the hardware and the path.

## Key points
- Quantisation, compilation, distillation; GPU or purpose-built inference hardware where it pays off.
- Batching, warm containers, small payloads, fast feature lookup or caching.
- Same-region private endpoints and keep-alive connections; asynchronous handling for slow parts.

## CWD context
Measure model latency versus overhead before optimising.
