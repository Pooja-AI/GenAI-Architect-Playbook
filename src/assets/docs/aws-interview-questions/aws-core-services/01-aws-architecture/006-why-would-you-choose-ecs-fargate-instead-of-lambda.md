# Why would you choose ECS/Fargate instead of Lambda?

## Short answer
Choose ECS Fargate over Lambda for long-running, connection-heavy or steady workloads.

## Key points
- Runs longer than 15 minutes, streaming and persistent connections.
- Larger images and dependencies; predictable latency without cold starts.
- Cost is often lower at sustained load; consistent runtime for the LangGraph service.
- Fargate has no GPU; use EC2-backed ECS or SageMaker for GPU needs.

## CWD context
Coordinator, Delegators, Workers and MCP servers run on Fargate; event glue stays on Lambda.
