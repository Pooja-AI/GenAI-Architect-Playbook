# Hybrid Search

Hybrid search combines **semantic (vector) search** with **keyword (lexical) search**, such as BM25, to get the strengths of both approaches.

## Why Combine Them?
- **Vector search** excels at capturing meaning and handling paraphrasing/synonyms but can miss exact matches like product IDs, names, acronyms, or rare technical terms.
- **Keyword search** excels at exact-match precision but fails to generalize across different phrasings of the same idea.

## How It Works
1. Run both a vector search and a keyword search (e.g., BM25) against the index.
2. Combine the two result sets using a fusion method:
   - **Reciprocal Rank Fusion (RRF)** — combines rankings from each method without needing to normalize scores.
   - **Weighted score combination** — blend normalized scores from each method using tunable weights.
3. Return the merged, re-ranked top-k results.

## When to Use It
Hybrid search is recommended for most production RAG systems, especially when the corpus contains specific identifiers, names, codes, or technical jargon alongside natural language content.
