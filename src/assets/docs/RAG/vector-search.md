# Vector Search

Vector search finds the most semantically similar items to a query by comparing embedding vectors, rather than matching exact keywords.

## How It Works
1. Convert the query into an embedding vector.
2. Compare that vector against all (or an indexed subset of) stored vectors using a similarity metric (commonly cosine similarity or dot product).
3. Return the top-k nearest vectors, which correspond to the most semantically relevant chunks.

## Exact vs. Approximate Search
- **Exact (brute-force) search** compares the query to every vector — accurate but slow at scale.
- **Approximate Nearest Neighbor (ANN) search** uses index structures (like HNSW) to find near-optimal matches much faster, trading a small amount of accuracy for large speed gains.

## Strengths and Weaknesses
- Strength: captures semantic meaning, handles synonyms and paraphrasing well.
- Weakness: can miss exact keyword matches (e.g., product codes, names) that a keyword search would catch — this is why **hybrid search** combining vector and keyword search is common in production RAG systems.
