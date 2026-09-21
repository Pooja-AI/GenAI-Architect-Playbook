# How would you handle SageMaker inference latency?

## Short answer
Handle inference latency by measuring where it goes and fixing the biggest part.

## Key points
- Separate model latency from overhead latency; right-size the instance.
- Model optimisation (compilation, quantisation), batching, smaller payloads.
- Keep endpoints warm; co-locate in the same region; cache predictions; use asynchronous inference for slow work.

## CWD context
Set timeouts and fallbacks based on a latency budget.
