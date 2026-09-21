# How would you reduce ECS costs?

## Short answer
Reduce ECS cost by right-sizing and using cheaper capacity where safe.

## Key points
- Right-size CPU and memory from real metrics; Graviton (ARM) tasks.
- Fargate Spot for interruptible Workers; Compute Savings Plans.
- Scale-in policies and schedules for non-production; consolidate tiny services.

## CWD context
Do not put latency-critical services on Spot.
