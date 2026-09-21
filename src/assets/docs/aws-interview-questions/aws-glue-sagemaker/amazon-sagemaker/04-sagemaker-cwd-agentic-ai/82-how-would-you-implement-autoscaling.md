# How would you implement autoscaling?

## Short answer
Implement autoscaling with a scalable target, a tracking policy and sensible limits.

## Key points
- Minimum and maximum instances; target value from load testing; cooldowns.
- Backlog-based metrics for asynchronous endpoints; scheduled scaling for known peaks.
- Alarms; instance quota checks.

## CWD context
Keep some headroom; scale-out is not instant.
