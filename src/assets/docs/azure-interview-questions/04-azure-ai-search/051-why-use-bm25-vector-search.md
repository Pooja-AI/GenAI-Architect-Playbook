# Why use BM25 + vector search?

## Short answer
Vector search understands meaning; BM25 understands exact terms; hybrid covers both weaknesses.

## Key points
- Vectors handle paraphrase and synonyms but can miss exact identifiers.
- BM25 handles exact tokens but misses different wording for the same idea.
- Fusing the two improves recall for a small extra cost.

## CWD context
Enterprise questions often contain both, for example "What is the SLA for incident INC12345?".
