# How do you monitor Lambda?

## Short answer
Monitor Lambda with CloudWatch metrics, structured logs and tracing.

## Key points
- Invocations, Errors, Throttles, Duration, ConcurrentExecutions, async event age, iterator age.
- Structured JSON logs; Lambda Insights; X-Ray or OpenTelemetry.
- Alarms on errors, throttles and duration; Powertools for metrics.

## CWD context
Track p95 duration against the function timeout.
