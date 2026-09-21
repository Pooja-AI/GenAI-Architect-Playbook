# How would you recover from a failed workflow using DynamoDB?

## Short answer
Recover a failed workflow from its last checkpoint stored in DynamoDB.

## Key points
- Find failed runs through a status GSI or DynamoDB Streams.
- Load the last checkpoint and resume; increment an attempt counter with a condition.
- Side effects must be idempotent; mark permanently failed after N attempts.

## CWD context
Route unrecoverable runs to a human queue.
