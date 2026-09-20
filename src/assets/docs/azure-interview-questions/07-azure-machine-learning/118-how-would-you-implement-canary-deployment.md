# How would you implement canary deployment?

## Short answer
Canary by routing a small share of traffic (or mirrored traffic) to the new deployment.

## Key points
- Start at 5 to 10 percent, or mirror requests without affecting users.
- Watch latency, errors and quality metrics.
- Increase gradually; roll back automatically on alert.

## CWD context
Mirrored (shadow) traffic is safest for high-risk changes.
