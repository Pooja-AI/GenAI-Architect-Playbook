# How would you detect data drift?

## Short answer
Detect data drift by comparing production input distributions with a baseline.

## Key points
- Azure ML model monitoring compares features using statistical measures such as PSI or Jensen-Shannon distance.
- Requires collecting production inputs.
- Scheduled monitors with alert thresholds.

## CWD context
Drift alerts feed the retraining pipeline.
