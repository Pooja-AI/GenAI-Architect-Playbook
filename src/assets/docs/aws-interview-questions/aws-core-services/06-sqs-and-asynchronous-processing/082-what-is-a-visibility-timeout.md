# What is a visibility timeout?

## Short answer
The visibility timeout hides a received message from other consumers for a period.

## Key points
- If the message is not deleted before the timeout ends, it becomes visible again and is redelivered.
- Default 30 seconds, maximum 12 hours.

## CWD context
It is a lease on the message, not a delivery guarantee.
