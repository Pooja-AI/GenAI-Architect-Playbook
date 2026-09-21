# How would you implement BM25 search?

## Short answer
BM25 is the default lexical relevance scoring in OpenSearch for text fields.

## Key points
- Combines term frequency, inverse document frequency and length normalisation.
- Use match and multi_match queries; tune analyzers, synonyms and field boosts.

## CWD context
BM25 finds exact terms such as ticket IDs that embeddings can blur.
