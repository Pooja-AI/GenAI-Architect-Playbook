# Why use Azure Databricks in CWD?

## Short answer
Databricks handles large-scale data engineering on a Delta Lake lakehouse, which complements ADF's orchestration role.

## Key points
- Distributed ETL and parsing / chunking of large document sets.
- Bulk embedding generation and data quality checks.
- Feature engineering and evaluation dataset preparation.
- Governance through Unity Catalog.

## CWD context
Use it where volume or transformation complexity outgrows simple ADF copy activities.
