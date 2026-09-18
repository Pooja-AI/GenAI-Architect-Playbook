# Chunk Overlap

Chunk overlap means including a small amount of shared text between consecutive chunks so that ideas split across a boundary aren't lost entirely in either chunk.

## Why It Helps
Without overlap, a sentence or concept that straddles the end of one chunk and the start of the next may become unretrievable, since neither chunk fully represents it.

## Typical Values
- A common starting point is **10–20% of the chunk size** (e.g., 50 tokens of overlap on a 300-token chunk).
- Too much overlap increases index size and redundancy without much benefit.
- Too little overlap risks losing boundary context.

## Trade-offs
- More overlap → better boundary context, but more storage and duplicate retrieval.
- Less overlap → smaller index, but risk of fragmented meaning.

Overlap is a simple lever to tune alongside chunk size and should be validated against retrieval evaluation metrics rather than set arbitrarily.
