# How would you monitor SQS?

## Short answer
Monitor SQS for backlog, age and dead letters.

## Key points
- Visible and in-flight messages, oldest-message age, messages sent, received and deleted.
- Alarm when the DLQ has any visible message.
- Consumer lag drives auto scaling.

## CWD context
Oldest-message age is the best SLO signal.
