# How would you implement timeout?

## Short answer
Set TimeoutSeconds on tasks and the execution, plus heartbeats for long tasks.

## Key points
- A timeout raises States.Timeout, which Retry or Catch can handle.
- HeartbeatSeconds detects stalled long-running tasks.
- Choose values from measured durations.

## CWD context
No task should be able to hang a workflow forever.
