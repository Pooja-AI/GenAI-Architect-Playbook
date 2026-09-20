# How would you implement A/B testing?

## Short answer
A/B test with two deployments under one endpoint and a traffic split.

## Key points
- Example 90/10 or 50/50 split; use sticky assignment at the app if needed.
- Compare technical and business metrics with statistical care.
- Promote or revert based on results.

## CWD context
Decide success metrics before starting the test.
