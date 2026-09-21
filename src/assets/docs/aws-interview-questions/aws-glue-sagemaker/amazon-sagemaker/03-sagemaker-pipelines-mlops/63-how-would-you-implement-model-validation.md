# How would you implement model validation?

## Short answer
Validate data before training and the model before registration.

## Key points
- Data: schema, ranges and data-quality rules.
- Model: metric sanity checks, holdout inference test, container smoke test, latency test.
- Bias and explainability checks with Clarify.

## CWD context
Fail early on bad data.
