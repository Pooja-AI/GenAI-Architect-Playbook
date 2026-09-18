# Multilingual Embeddings

Multilingual embedding models are trained to place semantically equivalent text from different languages close together in vector space — e.g., "cat" (English) and "gato" (Spanish) map to nearby vectors.

## Why They Matter
- Enable **cross-lingual retrieval**: a query in one language can retrieve relevant documents written in another.
- Avoid maintaining separate indexes and pipelines per language.

## Challenges
- Multilingual models sometimes trade off some monolingual accuracy compared to language-specific models.
- Quality varies significantly across languages — high-resource languages (English, Spanish, Chinese) tend to perform better than low-resource ones.
- Tokenization and chunking strategies may need adjustment for non-space-delimited languages (e.g., Chinese, Japanese).

## Recommendations
- If your corpus and users are single-language, a monolingual model may outperform a multilingual one.
- If you need cross-lingual search or serve a global user base, choose a strong multilingual model and validate retrieval quality per language with your own evaluation set.
