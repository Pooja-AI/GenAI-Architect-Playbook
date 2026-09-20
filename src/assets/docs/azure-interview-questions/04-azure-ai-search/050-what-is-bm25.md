# What is BM25?

## Short answer
BM25 is a probabilistic keyword-ranking function and the default lexical scoring in Azure AI Search.

## Key points
- Term frequency counts, with saturation so repeated words stop adding much.
- Inverse document frequency rewards rare terms.
- Document length normalisation stops long documents from winning unfairly.

## CWD context
BM25 finds exact matches such as ticket IDs, product names and acronyms that embeddings can blur.
