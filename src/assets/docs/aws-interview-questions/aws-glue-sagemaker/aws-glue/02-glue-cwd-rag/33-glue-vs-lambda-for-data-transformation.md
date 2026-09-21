# Glue vs Lambda for data transformation?

## Short answer
Use Glue for large batch transformation and Lambda for small, event-driven work.

## Key points
- Glue: distributed Spark for GBs to TBs; slower start; pay per DPU time.
- Lambda: up to 15 minutes and limited memory; fast start; per event.
- Hybrid designs are common.

## CWD context
Per-document events suit Lambda; bulk re-indexing suits Glue.
