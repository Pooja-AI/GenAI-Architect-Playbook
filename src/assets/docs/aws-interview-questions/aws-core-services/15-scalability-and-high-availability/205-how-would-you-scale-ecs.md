# How would you scale ECS?

## Short answer
Scale ECS with Service Auto Scaling and fast, right-sized tasks.

## Key points
- Target tracking on CPU, memory, ALB requests per target, or SQS backlog per task; scheduled scaling for known peaks.
- Small images and warm minimum capacity to speed scale-out; check Fargate task quotas.
- Spread across AZs; Fargate Spot for non-critical work.

## CWD context
Scale Workers on backlog, the API on request count.
