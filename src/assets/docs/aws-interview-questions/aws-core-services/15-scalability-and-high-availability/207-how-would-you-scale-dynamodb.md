# How would you scale DynamoDB?

## Short answer
Scale DynamoDB with on-demand or auto-scaled provisioned capacity and good key design.

## Key points
- Adaptive capacity and even key distribution; GSI capacity.
- Cache hot reads (DAX or Redis); avoid scans; batch operations.
- Global tables for multi-region; TTL to limit growth.

## CWD context
Throttling usually means a design issue, not a capacity issue.
