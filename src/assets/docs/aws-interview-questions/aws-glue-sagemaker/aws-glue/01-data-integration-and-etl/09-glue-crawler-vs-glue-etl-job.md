# Glue Crawler vs Glue ETL job?

## Short answer
A crawler discovers schemas and updates the catalogue; an ETL job transforms and moves data.

## Key points
- Crawler: samples data, infers schema and partitions; metadata only.
- ETL job: produces new datasets.
- Crawlers can be slow and drift-prone on huge paths; define known tables in IaC and use partition projection.

## CWD context
Do not put crawlers on the critical path of ingestion.
