# ADF vs Databricks?

## Short answer
ADF orchestrates and copies; Databricks transforms at scale.

## Key points
- Databricks: Spark, Delta Lake, complex transformations, streaming and ML.
- ADF: simple mapping, movement and scheduling.
- Typical pattern: ADF triggers and monitors Databricks notebooks or jobs.

## CWD context
Avoid heavy logic in ADF data flows if the team already runs Databricks.
