# Approximate Nearest Neighbor (ANN) Search

ANN search algorithms find vectors that are *very likely* the closest matches to a query vector, without guaranteeing the mathematically exact nearest neighbors — trading a small amount of accuracy for a large gain in speed.

## Why ANN Instead of Exact Search?
Exact nearest neighbor search requires comparing the query to every vector in the dataset — computationally expensive at scale (millions+ of vectors). ANN algorithms build index structures that dramatically reduce the number of comparisons needed.

## Common ANN Algorithms
- **HNSW (Hierarchical Navigable Small World)** — graph-based, widely used, strong speed/accuracy trade-off.
- **IVF (Inverted File Index)** — clusters vectors and searches only relevant clusters.
- **LSH (Locality-Sensitive Hashing)** — hashes similar vectors into the same buckets.
- **PQ (Product Quantization)** — compresses vectors to save memory, often combined with IVF.

## Trade-offs to Tune
- **Recall vs. speed** — higher accuracy settings mean slower queries.
- **Memory usage** — some indexes trade memory for speed (e.g., HNSW's graph structure).
- **Build time** — more accurate indexes often take longer to construct.

Most vector databases let you tune these parameters (e.g., `ef_search`, number of clusters) to balance latency, recall, and cost for your workload.
