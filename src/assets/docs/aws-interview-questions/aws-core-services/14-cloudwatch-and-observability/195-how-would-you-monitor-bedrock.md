# How would you monitor Bedrock?

## Short answer
Monitor Bedrock with its CloudWatch metrics and invocation logging.

## Key points
- Invocations, latency, client and server errors, throttles, input and output tokens, per model.
- Guardrail intervention counts; application inference profile metrics for per-tenant attribution.
- Alarms on throttles, latency and token spikes.

## CWD context
Rising throttles mean capacity planning is due.
