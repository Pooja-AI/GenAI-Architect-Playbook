# How would Glue trigger downstream processing?

## Short answer
Trigger downstream steps from Glue job state-change events.

## Key points
- EventBridge events for succeeded and failed job runs → Step Functions, Lambda or SNS.
- Step Functions can start and wait for a Glue job directly; Glue triggers and workflows for simple chains.

## CWD context
Completion starts indexing, evaluation or notification.
