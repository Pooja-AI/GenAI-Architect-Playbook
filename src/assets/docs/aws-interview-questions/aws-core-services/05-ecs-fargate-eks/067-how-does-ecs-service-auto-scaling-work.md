# How does ECS service auto scaling work?

## Short answer
ECS Service Auto Scaling uses Application Auto Scaling policies on metrics.

## Key points
- Target tracking on CPU, memory or ALB requests per target.
- Custom metric such as SQS backlog per running task.
- Set minimum and maximum capacity, cooldowns and scale-in protection.

## CWD context
Scale Workers on backlog, the API on request count.
