# How do you prevent secrets from appearing in logs?

## Short answer
Prevent secrets in logs by design and by detection.

## Key points
- Never log Authorization headers or full request bodies.
- Redaction in logging filters and telemetry processors.
- Secret scanning in CI; masked pipeline variables.
- Never put secrets in prompts; alert on detected patterns.

## CWD context
Logs are a top leak path in AI systems, since prompts are often logged.
