# How do you handle container failures?

## Short answer
ECS replaces failed tasks automatically, so design for tasks disappearing at any time.

## Key points
- Tasks spread across AZs; the scheduler maintains the desired count.
- In-flight SQS messages return after the visibility timeout; state is checkpointed.
- Alarms on running task count and stopped-task reasons (for example out-of-memory exits).

## CWD context
Investigate crash loops; do not just let them restart.
