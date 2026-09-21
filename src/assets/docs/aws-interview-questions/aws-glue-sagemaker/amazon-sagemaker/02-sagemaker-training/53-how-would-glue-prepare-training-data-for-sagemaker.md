# How would Glue prepare training data for SageMaker?

## Short answer
Glue prepares training data by cleaning, joining, engineering features and splitting.

## Key points
- Deduplicate and join sources; create features; split train, validation and test without leakage.
- Write versioned Parquet to S3; catalogue tables; data-quality rules; anonymise PII.
- EventBridge starts the training pipeline when data is ready.

## CWD context
Data leakage between splits is the most common silent error.
