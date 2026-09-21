# How would you scale Lambda?

## Short answer
Lambda scales by adding concurrent execution environments, within account and function limits.

## Key points
- Scaling rate per function; regional concurrency quota (raisable).
- Reserved concurrency to protect or cap; provisioned concurrency for predictable peaks.
- SQS maximum concurrency and batch sizes to protect downstream systems.

## CWD context
Cap Lambda so it cannot overwhelm MCP servers or Bedrock.
