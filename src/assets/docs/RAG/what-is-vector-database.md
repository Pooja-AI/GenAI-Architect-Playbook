# What Is a Vector Database?

A vector database is a specialized data store optimized for storing, indexing, and querying high-dimensional vectors (embeddings) efficiently, typically using approximate nearest neighbor (ANN) search algorithms.

## Core Capabilities
- **Storage** of vectors alongside metadata (source, permissions, timestamps).
- **Indexing** using ANN structures (e.g., HNSW, IVF) for fast similarity search at scale.
- **Querying** — given a query vector, return the top-k most similar stored vectors.
- **Filtering** — combine vector similarity search with metadata filters (e.g., "only documents tagged 'HR'").
- **CRUD operations** — insert, update, and delete vectors as source documents change.

## Popular Options
Dedicated vector databases (e.g., Pinecone, Weaviate, Qdrant, Milvus), vector search extensions in traditional databases (e.g., pgvector for Postgres), and vector indexes in search engines (e.g., Elasticsearch, OpenSearch).

## Why Not Just Use a Regular Database?
Traditional indexes (B-trees) don't scale to efficient nearest-neighbor search across high-dimensional vectors — vector databases use specialized ANN algorithms designed for this exact problem.
