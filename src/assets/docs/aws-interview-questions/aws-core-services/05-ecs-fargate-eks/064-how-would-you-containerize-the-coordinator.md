# How would you containerize the Coordinator?

## Short answer
Containerise the Coordinator as a stateless FastAPI and LangGraph service.

## Key points
- Slim, non-root image with pinned dependencies; health endpoint; graceful SIGTERM.
- Checkpoints in DynamoDB so any task can resume a run.
- ECS service with two or more tasks across AZs behind a private ALB.
- Task role limited to approved Bedrock models, its DynamoDB table and its queues.

## CWD context
Statelessness is what makes scaling and restarts safe.
