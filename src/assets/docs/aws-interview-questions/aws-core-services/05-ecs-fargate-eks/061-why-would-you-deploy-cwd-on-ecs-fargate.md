# Why would you deploy CWD on ECS/Fargate?

## Short answer
ECS Fargate runs containers without managing servers, with per-task IAM and networking.

## Key points
- Task roles, awsvpc networking with security groups per task.
- ALB integration, Service Auto Scaling, CodeDeploy blue-green.
- Secrets injected from Secrets Manager; logs to CloudWatch.

## CWD context
A natural fit for FastAPI, LangGraph and MCP servers.
