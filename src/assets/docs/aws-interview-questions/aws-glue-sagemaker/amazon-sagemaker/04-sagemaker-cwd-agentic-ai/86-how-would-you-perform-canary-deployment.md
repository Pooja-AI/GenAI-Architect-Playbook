# How would you perform canary deployment?

## Short answer
Canary with deployment guardrails or shadow testing.

## Key points
- Blue-green deployment with canary or linear traffic shifting and automatic rollback on alarms.
- Shadow variants receive copies of traffic without affecting users.
- Watch latency, errors and quality.

## CWD context
Shadow testing is safest for high-risk models.
