# Lambda vs ECS/Fargate?

## Short answer
Lambda is best for short, bursty, event-driven work; ECS Fargate is best for long-running or steady services.

## Key points
- Lambda: 15-minute limit, scale to zero, cold starts, pay per invocation.
- Fargate: no duration limit, persistent connections, no cold start on running tasks, pay per running task.
- Cost crossover: Lambda is cheaper when idle or spiky; Fargate is often cheaper at sustained load.

## CWD context
Choose per component, and it is normal to use both.
