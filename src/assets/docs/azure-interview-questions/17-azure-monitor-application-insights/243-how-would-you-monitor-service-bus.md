# How would you monitor Service Bus?

## Short answer
Monitor Service Bus for backlog, age and dead letters.

## Key points
- Active, dead-lettered and scheduled messages; throttling and server errors.
- Oldest-message age.
- Alerts on any DLQ message and growing backlog; correlate with consumer scaling.

## CWD context
DLQ alerts should reach a named owner.
