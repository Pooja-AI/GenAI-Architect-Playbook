# How would you handle container failures?

## Short answer
Handle container failures with redundancy, restarts and resumable state.

## Key points
- Multiple replicas across zones; automatic restart on liveness failure.
- SIGTERM handling and draining; in-flight messages redelivered by Service Bus.
- Workflow state checkpointed so runs resume.
- Alerts on restart count and crash loops.

## CWD context
Design so a replica can die at any moment without losing work.
