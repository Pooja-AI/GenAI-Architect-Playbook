# Embedding Models

## Overview
Embedding models convert text (or images, audio) into dense numeric vectors that capture semantic meaning. Two pieces of text with similar meaning produce vectors that are close together in vector space, measured by cosine similarity or dot product. Embeddings are the backbone of retrieval in every RAG system.

## How Embeddings Work
A trained neural network (often a transformer encoder) maps input text to a fixed-length vector, e.g., 1024 or 1536 dimensions. Training objectives like contrastive learning pull semantically similar pairs together and push dissimilar pairs apart in vector space.

## Popular Embedding Models on AWS
- **Amazon Titan Embeddings (Text v2)** — Bedrock-native, supports up to 8K tokens, configurable output dimensions (256/512/1024)
- **Cohere Embed v3** — available via Bedrock, strong multilingual support, separate "search_document" vs "search_query" input types for asymmetric retrieval
- **Open-source options** (self-hosted on SageMaker) — BGE, E5, GTE model families, useful when data residency prevents using managed APIs

## Key Selection Criteria
1. **Dimensionality** — higher dimensions capture more nuance but cost more to store and search; 1024 is a common sweet spot
2. **Max input length** — must exceed your chunk size
3. **Domain fit** — general-purpose models work well for broad content; domain-specific or fine-tuned embeddings outperform on specialized corpora (legal, medical, code)
4. **Multilingual support** — required if your corpus spans multiple languages
5. **Cost and latency** — embedding is billed per token; batch embedding jobs are cheaper than real-time calls

## Symmetric vs Asymmetric Embeddings
- **Symmetric**: query and document use the same embedding representation (e.g., matching two similar sentences)
- **Asymmetric**: query and document are embedded differently since a short question and a long passage aren't linguistically symmetric — Cohere Embed's separate input types address this directly and typically improve retrieval precision

## Evaluating Embedding Quality
Use standard IR metrics against a labeled test set:
- **Recall@k** — does the correct chunk appear in the top k results?
- **MRR (Mean Reciprocal Rank)** — how high does the correct chunk rank?
- **nDCG** — accounts for graded relevance, not just binary correct/incorrect

## Re-embedding Considerations
When you change embedding models, every existing vector must be regenerated — old and new embeddings are **not** comparable in the same vector space. This is a major migration cost, so choose an embedding model deliberately and plan for embedding-versioning (track model version as chunk metadata) to support safe rollouts.

## Practical Tips
- Normalize vectors if your vector store expects cosine similarity via dot product
- Batch embed during ingestion — never embed synchronously in a slow user-facing path except for the query itself
- Cache query embeddings for repeated queries to reduce cost and latency
- Monitor for embedding drift if you fine-tune or swap models over time

## Summary
The embedding model is the semantic backbone of a RAG system. Picking the right model — matched to domain, language, and latency needs — and planning for versioning and re-embedding are essential production considerations often overlooked in early prototypes.
