# How would you detect data drift?

## Short answer
Detect data drift by comparing inference inputs with training baselines.

## Key points
- Enable data capture to S3; baseline statistics and constraints from training data.
- Scheduled Model Monitor jobs report violations; CloudWatch alarms.
- Clarify tracks feature attribution drift.

## CWD context
Data drift is a warning; quality drift is the proof.
