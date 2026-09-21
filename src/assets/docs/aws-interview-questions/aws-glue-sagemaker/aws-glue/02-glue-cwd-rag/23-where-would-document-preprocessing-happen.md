# Where would document preprocessing happen?

## Short answer
Preprocess in Glue for bulk corpora and in Lambda for small, per-document events.

## Key points
- Glue: large batches and heavy transformations.
- Lambda: near-real-time single-document processing.
- Share code as a library so both paths behave the same.

## CWD context
Divergent code paths produce inconsistent chunks.
