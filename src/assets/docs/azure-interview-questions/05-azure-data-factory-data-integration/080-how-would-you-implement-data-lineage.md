# How would you implement data lineage?

## Short answer
Implement lineage with Microsoft Purview and with metadata carried in the data.

## Key points
- Purview captures lineage from ADF and Databricks.
- Add source system, source ID, ingestion run ID and content hash to each record and chunk.
- Lineage supports impact analysis and answer citations back to the source.

## CWD context
A citation should trace chunk → document → source system.
