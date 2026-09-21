# Where would chunking happen?

## Short answer
Chunk in the curated processing job, not at query time.

## Key points
- Recursive, structure-aware or semantic chunking with versioned parameters (size, overlap).
- Deterministic chunk IDs; store the chunking strategy version in metadata.
- Changing the strategy triggers a controlled re-chunk.

## CWD context
Chunk size and overlap should be tuned with retrieval evaluation.
