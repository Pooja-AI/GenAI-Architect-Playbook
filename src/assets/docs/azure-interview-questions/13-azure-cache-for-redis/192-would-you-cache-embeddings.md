# Would you cache embeddings?

## Short answer
Yes, cache embeddings: for a given model and text they are deterministic.

## Key points
- Key: hash of model, dimensions and normalised text.
- Long TTL; high hit rate for repeated queries.
- Include the model version in the key so a model change invalidates everything.

## CWD context
Saves both latency and embedding cost.
