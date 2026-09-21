# How would you containerize Workers?

## Short answer
Run Workers as ECS services that consume SQS queues, or as tasks started by Step Functions.

## Key points
- One queue and service per Worker type; scale on backlog per task.
- Own task role; Fargate Spot for non-critical work.
- Idempotent handlers and graceful shutdown so in-flight messages return to the queue.

## CWD context
Workers call MCP servers rather than embedding system integrations.
