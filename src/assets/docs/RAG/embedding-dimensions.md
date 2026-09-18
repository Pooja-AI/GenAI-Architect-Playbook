# Embedding Dimensions

The "dimension" of an embedding refers to the length of the vector produced by the embedding model — e.g., 384, 768, 1536, or 3072 numbers per vector.

## Trade-offs
- **Higher dimensions** can capture more nuanced semantic information but increase:
  - Storage cost in the vector database.
  - Memory and compute cost for similarity search.
  - Index build and query latency at scale.
- **Lower dimensions** are cheaper and faster but may lose some representational precision.

## Matryoshka / Variable-Dimension Embeddings
Some modern embedding models support truncatable ("Matryoshka") embeddings, letting you use a smaller prefix of the vector (e.g., first 256 of 1536 dimensions) for faster, cheaper search with a modest accuracy trade-off.

## Practical Guidance
- For small-to-medium corpora, dimension size rarely matters much for cost.
- At large scale (millions+ of chunks), reducing dimensionality can meaningfully cut infrastructure costs — validate the accuracy impact with evaluation before committing.
