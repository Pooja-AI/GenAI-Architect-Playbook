# How do you monitor Bedrock latency?

## Short answer
Monitor latency per stage, and separate time to first token from total time.

## Key points
- InvocationLatency metric plus application-side timing around streaming.
- X-Ray spans for each model call; percentiles rather than averages.
- Compare models and regions; consider latency-optimised inference where offered.
- Alarms on p95 and on changes after a release.

## CWD context
A latency jump after a deployment usually points to a prompt or model change.
