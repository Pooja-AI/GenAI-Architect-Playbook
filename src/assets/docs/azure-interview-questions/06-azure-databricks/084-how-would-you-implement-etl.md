# How would you implement ETL?

## Short answer
Implement ETL as scheduled or triggered Databricks jobs with tested, parameterised code.

## Key points
- Workflows or declarative pipelines with data-quality expectations.
- Notebooks or Python packages with unit tests.
- CI/CD with Databricks Asset Bundles; ADF or events trigger runs.
- Idempotent writes so reruns are safe.

## CWD context
Treat pipelines as code: reviewed, tested and versioned.
