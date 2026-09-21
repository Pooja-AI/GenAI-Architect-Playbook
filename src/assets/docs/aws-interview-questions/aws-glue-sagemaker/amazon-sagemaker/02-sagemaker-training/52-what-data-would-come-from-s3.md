# What data would come from S3?

## Short answer
Training data comes from curated, versioned S3 datasets.

## Key points
- Cleaned and labelled data in Parquet or CSV under immutable, versioned prefixes; feature tables.
- Training, validation and test splits; access through the job's role; encryption with KMS.
- Use fast-file or pipe modes for very large data.

## CWD context
Record the dataset version with each model.
