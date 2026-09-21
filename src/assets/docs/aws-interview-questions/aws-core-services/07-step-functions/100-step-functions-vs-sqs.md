# Step Functions vs SQS?

## Short answer
Step Functions orchestrates a multi-step flow; SQS buffers messages between two components.

## Key points
- Step Functions: state, branching, retries, visibility.
- SQS: decoupling, buffering, load levelling.
- Combine them: Step Functions sends a message and waits for a task-token callback.

## CWD context
They solve different problems and work well together.
