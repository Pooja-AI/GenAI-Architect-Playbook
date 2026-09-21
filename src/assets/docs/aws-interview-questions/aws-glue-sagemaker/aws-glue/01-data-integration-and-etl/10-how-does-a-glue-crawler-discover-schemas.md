# How does a Glue Crawler discover schemas?

## Short answer
A crawler connects to the data store, samples files with classifiers and writes tables to the catalogue.

## Key points
- Built-in classifiers for CSV, JSON, Parquet and others.
- Detects partitions from folder structure.
- Schema change policy decides whether to update, log or ignore changes.

## CWD context
Sampling means the inferred schema can be wrong for irregular data.
