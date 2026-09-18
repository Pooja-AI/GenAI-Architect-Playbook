# Semantic Search

Semantic search retrieves content based on **meaning** rather than exact keyword matches, using embeddings to represent both the query and the documents.

## How It Differs From Keyword Search
- Keyword search (e.g., BM25) matches literal terms and their variants.
- Semantic search matches *concepts* — a query for "cheap flights" can retrieve a document about "budget airfare" even with no shared words.

## Core Mechanics
1. Embed the query and the corpus using the same embedding model.
2. Compute similarity (typically cosine similarity) between the query vector and each document vector.
3. Rank and return the most similar documents.

## Strengths
- Handles synonyms, paraphrasing, and conceptual relationships naturally.
- Works well for natural-language questions.

## Limitations
- Can underperform on exact-match needs (IDs, codes, rare terms).
- Quality depends heavily on the embedding model and how well it was trained on your domain.

Semantic search is a foundational component of RAG retrieval, often paired with keyword search in a hybrid approach for best results.
