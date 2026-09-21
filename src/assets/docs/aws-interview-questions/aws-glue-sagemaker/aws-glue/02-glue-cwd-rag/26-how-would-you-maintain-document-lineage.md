# How would you maintain document lineage?

## Short answer
Maintain lineage with catalogue metadata, chunk-level fields and run identifiers.

## Key points
- Source ID, ingest run ID and hash on every chunk; Glue job run IDs.
- Catalogue table properties; Lake Formation or DataZone lineage where available.
- A manifest table linking documents to chunks.

## CWD context
A citation should trace chunk → document → source system.
