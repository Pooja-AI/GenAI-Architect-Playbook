# How would you implement hybrid search?

## Short answer
Hybrid search sends a keyword query and a vector query in one request and merges the two ranked lists.

## Key points
- BM25 and vector queries run in parallel.
- Results are combined with Reciprocal Rank Fusion (RRF).
- Optional semantic ranking then reranks the merged top results.
- Filters apply to both.

## CWD context
Hybrid is the default retrieval mode for CWD because enterprise text mixes exact codes and natural language.
