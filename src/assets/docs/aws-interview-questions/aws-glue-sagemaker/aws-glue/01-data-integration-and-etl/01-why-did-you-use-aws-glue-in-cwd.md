# Why did you use AWS Glue in CWD?

## Short answer
Glue provides serverless ETL and a data catalogue, so CWD can ingest and prepare enterprise data at scale without managing clusters.

## Key points
- Spark-based jobs for large batch work; integration with S3, Athena and Lake Formation.
- Job bookmarks for incremental processing; connectors for databases and SaaS sources.
- Prepares document chunks for RAG and datasets for SageMaker training.

## CWD context
Glue moves and shapes data; retrieval and reasoning happen elsewhere.
