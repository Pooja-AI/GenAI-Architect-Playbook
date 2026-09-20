# What is a dead-letter queue?

## Short answer
A dead-letter queue is a sub-queue holding messages that could not be processed or delivered.

## Key points
- Reasons: max delivery count exceeded, TTL expired, explicit dead-lettering.
- Messages keep a reason and description for diagnosis.
- Must be monitored and replayed after the fix.

## CWD context
A DLQ without an owner is just a hidden data loss.
