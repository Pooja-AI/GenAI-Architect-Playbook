# How would you detect model drift?

## Short answer
Detect model quality drift by comparing predictions with ground truth.

## Key points
- Model Monitor model-quality jobs compare predictions with labels against baseline metrics.
- Scheduled runs with alarms; proxy metrics such as prediction distribution when labels are delayed.

## CWD context
Build a label feedback loop from Worker outcomes.
