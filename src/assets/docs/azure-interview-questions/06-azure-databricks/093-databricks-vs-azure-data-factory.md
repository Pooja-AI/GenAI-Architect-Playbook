# Databricks vs Azure Data Factory?

## Short answer
Databricks does heavy transformation; ADF orchestrates and moves data.

## Key points
- ADF: connectors, copy, scheduling, simple mapping.
- Databricks: Spark, Delta, complex logic, streaming, ML.
- Usually used together: ADF triggers Databricks jobs.

## CWD context
Put logic in one place; do not split transformation logic between both.
