# HNSW (Hierarchical Navigable Small World)

HNSW is one of the most widely used algorithms for approximate nearest neighbor search in vector databases, powering systems like Pinecone, Weaviate, Qdrant, and FAISS.

## How It Works
HNSW builds a multi-layer graph where each vector is a node:
- Upper layers contain fewer nodes with long-range connections, enabling fast coarse navigation.
- Lower layers contain more nodes with short-range connections, enabling fine-grained search.
- A query starts at the top layer and greedily navigates toward the nearest node, descending layer by layer until it reaches the closest matches at the bottom layer.

## Key Parameters
- **M** — the number of connections per node; higher M improves recall but increases memory and build time.
- **ef_construction** — controls index build quality; higher values improve accuracy but slow indexing.
- **ef_search** — controls search-time accuracy/speed trade-off; higher values improve recall but slow queries.

## Why It's Popular
HNSW offers excellent recall with sub-linear query time and works well for high-dimensional embeddings, making it a default choice in most modern vector databases.
