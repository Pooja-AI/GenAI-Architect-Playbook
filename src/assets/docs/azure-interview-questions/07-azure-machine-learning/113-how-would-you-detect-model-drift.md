# How would you detect model drift?

## Short answer
Detect model drift by tracking performance against ground truth or good proxies.

## Key points
- Join predictions with actual outcomes when labels arrive; track accuracy, precision and recall.
- Use prediction drift and feature-attribution drift while labels are delayed.
- Alert and trigger review or retraining.

## CWD context
Data drift does not always mean performance drift; measure both.
