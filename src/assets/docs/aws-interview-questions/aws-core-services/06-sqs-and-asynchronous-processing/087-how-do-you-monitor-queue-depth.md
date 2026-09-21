# How do you monitor queue depth?

## Short answer
Monitor queue depth and message age, not just counts.

## Key points
- Visible and in-flight messages, age of the oldest message, messages sent and deleted.
- DLQ visible messages above zero should alarm.
- Backlog per task drives auto scaling.

## CWD context
Oldest-message age is the best SLO signal.
