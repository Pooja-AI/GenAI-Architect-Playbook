# How would you implement model evaluation?

## Short answer
Evaluate the candidate against the current champion on a held-out test set.

## Key points
- A Processing step computes metrics, including per-slice results.
- A Condition step enforces thresholds; the report is stored in S3.
- Clarify for bias and explainability; business-metric checks.

## CWD context
Do not promote a model that is better overall but worse on a critical slice.
