# How would you prevent secrets from appearing in logs?

## Short answer
Prevent secrets in logs by design and by detection.

## Key points
- Never log environment variables, headers or bodies containing credentials; redaction in logging code.
- CloudWatch Logs data protection policies to mask and audit sensitive patterns.
- Secret scanning in CI; reference secrets rather than embedding them in task definitions.
- Never put secrets in prompts.

## CWD context
Prompts and tool arguments are commonly logged, so treat them as a leak path.
