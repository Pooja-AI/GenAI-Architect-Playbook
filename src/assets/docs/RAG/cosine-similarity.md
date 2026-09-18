# Cosine Similarity

Cosine similarity is the most common metric used to measure how similar two embedding vectors are.

## Definition
It measures the cosine of the angle between two vectors, ignoring their magnitude — only the direction matters.

```
cosine_similarity(A, B) = (A · B) / (||A|| * ||B||)
```

- A value of **1** means the vectors point in the same direction (very similar meaning).
- A value of **0** means the vectors are orthogonal (unrelated).
- A value of **-1** means the vectors point in opposite directions (rare in typical text embeddings).

## Why Cosine, Not Euclidean Distance?
Cosine similarity focuses purely on semantic direction, making it robust to differences in text length or embedding magnitude — two important properties for comparing sentences of different lengths.

## Usage in RAG
When a query is embedded, its vector is compared against all chunk vectors in the index using cosine similarity (or a related metric like dot product for normalized vectors), and the top-k highest-scoring chunks are retrieved.
